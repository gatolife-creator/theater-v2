import express from "express";
import path from "path";
import { Server } from "socket.io";
import { createServer } from "http";
import { router as videoRouter, setIO } from "./api/videos";

const app = express();
const port = 3333;

const httpServer = createServer(app);
const io = new Server(httpServer);
setIO(io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(express.static("public"));
app.use("/api", videoRouter);
app.get("*", (_: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
