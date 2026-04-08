import { useState, useEffect } from 'react';
import Navigation from '../Home/Navigation';
import FAB from '../Common/FAB';
import AddContentModal from '../AddContent/AddContentModal';
import VideoCard from './VideoCard';
import { VideoItem } from '../../apis/videoAPI';
import './VideoFeedPage.css';
import { getAllVideosInfo, getAllVideoURL, PaginatedVideoResponse } from '../../apis/videoAPI';
import VideoPlayer from '../../components/VideoPlayer';
import { saveVideo } from '../../apis/videoAPI';
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer';


const VideoFeedPage = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [streamURL, setStreamURL] = useState<string | null>(null);

  //added
  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage, } = useInfiniteQuery<PaginatedVideoResponse>({
      queryKey: ['projects'],
      queryFn: ({ pageParam = 0 }) => getAllVideosInfo(pageParam),

      getNextPageParam: (lastPage) => {
        return lastPage.last ? undefined : lastPage.number + 1;
      },
    });


  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (!data) return;

    const allVideos = data.pages.flatMap(page => page.content);
    setVideos(allVideos)


  }, [data]);


  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);


  //added

  const getALLVideos = async () => {
    // const data = await getAllVideosInfo();
    // setVideos(data?.data?.content);
  };


  const getVideoURL = async (videoID: string) => {
    const data = await getAllVideoURL(videoID);
    setStreamURL(data?.data || null);
  };

  useEffect(() => {
    getALLVideos();
  }, []);


  useEffect(() => {
    if (activeVideoId) {
      getVideoURL(activeVideoId);
    } else {
      setStreamURL(null);
    }
  }, [activeVideoId]);


  const handlePlay = (videoId: string) => {
    if (activeVideoId === videoId) {
      setActiveVideoId(null);
    } else {
      setActiveVideoId(videoId);
    }
  };


  const handleAddVideo = async (video: File, title: string) => {
    await saveVideo(video, title)
    setShowAddModal(false);
  };



  return (
    <div className="video-feed-container">
      <div className="feed-header">
        <h1 style={{ color: 'white' }}>Videos</h1>
        <p>{videos.length} videos</p>
      </div>

      <div className="feed-content">
        {videos.length === 0 ? (
          <div className="empty-state">
            <p>No videos yet</p>
            <p className="empty-hint">
              Tap the + button to add your first video
            </p>
          </div>
        ) : (
          <div className="videos-list">
            <>
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isPlaying={activeVideoId === video.id}
                  onPlay={() => handlePlay(video.id)}
                />
              ))}
              {activeVideoId && streamURL && (
                <div className="video-player">
                  <VideoPlayer streamURL={streamURL} />
                </div>
              )}
              <div ref={ref}></div>

              {isFetchingNextPage && (
                <p style={{ color: "#978e8e", textAlign: "center", marginTop: 12 }}>
                  Loading more...
                </p>
              )}

              {data?.pages?.[data.pages.length - 1]?.last && (
                <p style={{ color: "#a8a6a6", textAlign: "center", marginTop: 12 }}>
                  No more images
                </p>
              )}
            </>
          </div>
        )}
      </div>

      <FAB onClick={() => setShowAddModal(true)} />

      <AddContentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        contentType="video"
        onAddContent={handleAddVideo}
      />

      {isFetchingNextPage && (
        <p style={{ color: "#978e8e", textAlign: "center", marginTop: 12 }}>
          Loading more...
        </p>
      )}

      <Navigation />
    </div>
  );
};

export default VideoFeedPage;

