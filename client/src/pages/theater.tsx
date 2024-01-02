import { useSearchParams } from "react-router-dom";
import { Player } from "video-react";
import { Main } from "../components/Main";

export const Theater = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("watch");
  const folder = searchParams.get("folder");

  const videoUrl = `/api/video?folder=${folder}&id=${id}`;

  return (
    <Main>
      <div className="mx-auto w-full sm:w-[600px]">
        <Player src={videoUrl} autoPlay />
      </div>
    </Main>
  );
};
