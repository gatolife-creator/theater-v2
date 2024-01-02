import { FolderName, VideoId } from "../../../server/utils/database";
export const useDelete = () => {
  const deleteVideo = async (folder: FolderName, id: VideoId) => {
    await fetch("/api/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folder, id }),
    })
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  };

  return { deleteVideo };
};
