import { VideoItem } from '../../apis/videoAPI';
import './VideoCard.css';

interface VideoCardProps {
  video: VideoItem;
  onPlay: () => void;
  isPlaying: boolean;
}

const VideoCard = ({ video, onPlay, isPlaying }: VideoCardProps) => {
  return (
    <div className="video-card">
      <div className="video-thumbnail-container">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="video-thumbnail"
        />

        <div
          className={`play-button ${isPlaying ? 'playing' : ''}`}
          onClick={onPlay}
        >
          {isPlaying ? '⏸' : '▶'}
        </div>
      </div>

      <div className="video-info">
        <h3>{video.title}</h3>
      </div>
    </div>
  );
};

export default VideoCard;


