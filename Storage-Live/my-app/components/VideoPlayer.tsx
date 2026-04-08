"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  streamURL: string | null,
}

const posterURL = './loading.jpg'

const VideoPlayer = ({ streamURL }: VideoPlayerProps) => {

  //if (!streamURL) return;

  const videoRef = useRef<HTMLVideoElement | null>(null);


  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const src = streamURL!;

    let hls: Hls | null = null;

    // Safari (native HLS)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {  //you have to do hardwork i.e play()
      video.src = src;
      video.play().catch(() => { });
      return;
    }

    // Chrome / Firefox / Edge
    if (Hls.isSupported()) {     //hls will take care of play, buffering, quality and so on......... 
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    }

    return () => {
      if (hls) hls.destroy();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [streamURL]);

  return (
    <video
      ref={videoRef}
      controls
      muted
      autoPlay
      playsInline
      preload="none"
      poster={posterURL}
    />
  );
};

export default VideoPlayer;


