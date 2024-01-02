import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { FolderName } from "../../../server/utils/database";

export const useDownload = () => {
  const [, setSocket] = useState<Socket | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("progress", (data: { progress: number }) => {
      setProgress(data.progress);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const downloadVideo = async (foldername: FolderName, url: string) => {
    await fetch("/api/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folder: foldername, url }),
    });
    console.log("completed");
  };

  return { downloadVideo, progress };
};
