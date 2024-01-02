import express from "express";
import path from "path";
import { execSync, spawn } from "child_process";
import fs from "fs";
import { Server as IOServer } from "socket.io";
import { mapToObjectRecursive } from "../utils/converter";

import {
  Database,
  FolderName,
  VideoData,
  VideoId,
  VideoTable,
} from "../utils/database";

const router = express.Router();
let io: IOServer;

const videosDirectory = path.join(__dirname, "../videos");
const imagesDirectory = path.join(__dirname, "../images");

const json = fs.readFileSync("./utils/table.json", "utf8");
const database = new Database(
  new Map<FolderName, VideoTable>(
    Object.entries<VideoTable>(JSON.parse(json)).map(([folder, videos]) => [
      folder,
      new Map<VideoId, VideoData>(Object.entries(videos)),
    ])
  )
);

// const database = new Database(new Map(Object.entries(JSON.parse(json)).map(([folder, videos]) => [folder, new Map(Object.entries(videos))])));
router.get("/folders", async (req: express.Request, res: express.Response) => {
  console.log("Sending folders");
  await getFolders(req, res);
});
router.get(
  "/folder/:foldername",
  async (req: express.Request, res: express.Response) => {
    await getFolder(req, res);
  }
);
router.get("/video", async (req: express.Request, res: express.Response) => {
  await getVideo(req, res);
});
router.post(
  "/download",
  async (req: express.Request, res: express.Response) => {
    await downloadVideo(req, res);
  }
);
router.delete(
  "/delete",
  async (req: express.Request, res: express.Response) => {
    await deleteVideo(req, res);
  }
);
router.get(
  "/thumbnail",
  async (req: express.Request, res: express.Response) => {
    await getThumbnail(req, res);
  }
);
router.post(
  "/addFolder",
  async (req: express.Request, res: express.Response) => {
    await addFolder(req, res);
  }
);

async function getFolder(req: express.Request, res: express.Response) {
  try {
    const foldername = req.params.foldername;
    console.log(`Sending folder ${foldername}`);
    const videos = database.getFolderTable(foldername);
    // const folderPath = path.join(videosDirectory, foldername);
    // const files = fs.readdirSync(folderPath);
    res.json(mapToObjectRecursive(videos!));
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function getFolders(req: express.Request, res: express.Response) {
  try {
    const folders = fs.readdirSync(videosDirectory);
    res.json(folders);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function getVideo(req: express.Request, res: express.Response) {
  try {
    const id = req.query.id;
    const folder = req.query.folder as string;
    console.log(`Sending video ${id}`);
    const videoPath = path.join(videosDirectory, folder, `${id}.mp4`);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function downloadVideo(req: express.Request, res: express.Response) {
  try {
    const url = req.body.url;
    const folder = (req.body.folder as string) || "default";
    const id = getVideoId(url);
    const title = getVideoTitle(id);

    await downloadVideos(folder, id);
    await downloadThumbnail(folder, id);

    database.addVideo(folder, id, title);
    saveDatabase();

    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

function getVideoId(url: string) {
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  return url.match(regex)![1];
}

function getVideoTitle(id: string) {
  return execSync(`yt-dlp ${id} --get-title`).toString();
}

async function downloadVideos(folder: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log("Downloading video");
    const download = spawn(
      "yt-dlp",
      [`${id}`, "-o", `${folder}/${id}.mp4`, "-f", "mp4"],
      {
        cwd: videosDirectory,
      }
    );

    download.stdout.on("data", (chunk) => {
      const progress = calculateProgress(chunk.toString());
      io.emit("progress", { progress });
    });

    download.on("close", (code) => {
      if (code !== 0) {
        console.log(`yt-dlp process exited with code ${code}`);
      } else {
        console.log("Download completed");
        resolve();
      }
    });
  });
}

async function downloadThumbnail(folder: string, id: string) {
  execSync(
    `cd ${imagesDirectory} && yt-dlp ${id} -o ${folder}/${id} --write-thumbnail --no-download`
  );
}

function saveDatabase() {
  fs.writeFileSync(
    "./utils/table.json",
    JSON.stringify(Database.serialize(database))
  );
}

async function deleteVideo(req: express.Request, res: express.Response) {
  try {
    const id = req.body.id;
    const folder = req.body.folder as string;
    database.deleteVideo(folder, id);
    fs.rmSync(path.join(videosDirectory, folder, `${id}.mp4`));
    saveDatabase();
    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function getThumbnail(req: express.Request, res: express.Response) {
  try {
    const id = req.query.id;
    const folder = req.query.folder as string;
    res.sendFile(path.join(imagesDirectory, folder, `${id}.webp`));
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function addFolder(req: express.Request, res: express.Response) {
  try {
    const folder = req.body.folder as string;
    fs.mkdirSync(path.join(videosDirectory, folder));
    saveDatabase();
    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

function calculateProgress(chunk: Buffer): number {
  const output = chunk.toString();
  const match = output.match(/(\d+(\.\d+)?)%/);
  return match ? parseFloat(match[1]) : 0;
}

export function setIO(serverIO: IOServer) {
  io = serverIO;
}

export { router };
