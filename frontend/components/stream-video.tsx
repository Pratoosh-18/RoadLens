"use client";

import { useEffect, useRef } from "react";
import { useAppContext } from "@/context/app-provider";
import { CVModel } from "@/types";

interface StreamVideoProps {
  activeModel: CVModel;
}

const StreamVideo = ({ activeModel }: StreamVideoProps) => {
  const { isBackendConnected } = useAppContext();
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const streamUrl = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/stream-video?active_model=${activeModel}`;
    img.src = streamUrl;

    return () => {
      img.src = "";
    };
  }, [activeModel, isBackendConnected]);

  return (
    <div>
      {isBackendConnected && (
        // <img ref={imgRef} alt="Video Stream" className="max-h-[76vh] rounded" />
        <div className="border-2 m-3 rounded-md flex justify-center items-center h-[40vh]">
          <span className="h-[12px] w-[12px] bg-red-500 rounded-full animate-pulse mr-2"></span>
          Live Video Stream
        </div>
      )}

      {!isBackendConnected && (
        <div className="h-[360px] w-[640px] bg-muted rounded-xl flex flex-col items-center justify-center">
          <p className="mt-1 text-muted-foreground">Server is offline</p>
        </div>
      )}
    </div>
  );
};

export default StreamVideo;
