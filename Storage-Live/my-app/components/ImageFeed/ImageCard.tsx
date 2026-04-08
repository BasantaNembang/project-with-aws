import React from 'react';
import { ImageItem } from '../../types';
import './ImageCard.css';

interface ImageCardProps {
  image: ImageItem;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  return (
    <div className="image-card">
      <div className="image-container">
        <img src={image.url} alt={image.caption || 'Image'} />
      </div>
      {image.caption && (
        <div className="image-caption">
          <p>{image.caption}</p>
        </div>
      )}
    </div>
  );
};

export default ImageCard;

