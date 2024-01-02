export const useDelete = () => {
  const deleteVideo = async (id: string) => {
    await fetch("/api/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  };

  return { deleteVideo };
};
