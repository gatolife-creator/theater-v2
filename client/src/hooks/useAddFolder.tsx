import { FolderName } from "../../../server/utils/database";

export const useAddFolder = () => {
  const addFolder = async (folder: FolderName) => {
    await fetch("/api/addFolder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folder }),
    })
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  };

  return { addFolder };
};
