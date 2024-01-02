import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { Main } from "../components/Main";
import { useDownload } from "../hooks/useDownload";
import { useAddFolder } from "../hooks/useAddFolder";
import { useFolders } from "../hooks/useFolders";
import { Link } from "react-router-dom";

export const Gallery = () => {
  const { folders, getFolders } = useFolders();
  const { downloadVideo, progress } = useDownload();
  const { addFolder } = useAddFolder();

  const [downloadId, setDownloadId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState(""); // 追加

  const handleDownloadClick = async () => {
    if (downloadId === "") return;
    setProcessing(true);
    await downloadVideo("default", downloadId);
    setProcessing(false);
    setDownloadId("");
  };

  const handleAddFolderClick = async () => {
    if (newFolderName === "") return;
    await addFolder(newFolderName);
    setNewFolderName("");
    setModalOpen(false);
    getFolders();
  };

  useEffect(() => {
    getFolders();
  }, [processing]);

  return (
    <Main>
      <div className="mx-auto mb-5 text-center sm:flex sm:justify-center">
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered input-primary mr-2 max-w-xs sm:w-full"
          onChange={(e) => {
            setDownloadId(e.target.value);
          }}
          value={downloadId}
        />
        <button
          className="btn btn-primary mt-2 sm:ml-2 sm:mt-0"
          onClick={async () => {
            await handleDownloadClick();
          }}
        >
          {!processing && "download"}
          {processing && (
            <Oval
              color="white"
              secondaryColor="transparent"
              width="1rem"
              height="1rem"
              wrapperClass="mx-auto"
            />
          )}
        </button>
        <button
          className="btn btn-primary mt-2 sm:ml-2 sm:mt-0"
          onClick={() => setModalOpen(true)}
        >
          ＋
        </button>
        {processing && (
          <div className="mx-auto mb-5 text-center">
            <progress
              className="progress w-full max-w-xs"
              value={progress}
              max="100"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {folders.map((folder, index) => (
          <Link
            to={`/folderView?folder=${folder}`}
            key={index}
            className="relative overflow-hidden rounded-lg border shadow-lg transition-shadow duration-300 ease-in hover:text-gray-500  hover:shadow-xl mx-auto w-[calc(100%-20px)]"
          >
            <div className="p-2">
              <div className="text-sm font-bold">{folder}</div>
            </div>
          </Link>
        ))}
      </div>
      {modalOpen && (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 backdrop-blur">
          <div className="rounded-lg bg-white p-8 text-center">
            <input
              type="text"
              placeholder="New folder name"
              className="input input-bordered input-primary mr-2"
              onChange={(e) => {
                setNewFolderName(e.target.value);
              }}
              value={newFolderName}
            />
            <button
              className="btn btn-primary mt-2"
              onClick={handleAddFolderClick}
            >
              ＋
            </button>
            <button
              className="block btn btn-neutral ml-auto mt-4"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Main>
  );
};
