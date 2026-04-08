import { useState, useEffect } from 'react';
import Navigation from '../Home/Navigation';
import FAB from '../Common/FAB';
import AddContentModal from '../AddContent/AddContentModal';
import ImageCard from './ImageCard';
import { ImageItem } from '../../types';
import './ImageFeedPage.css';
import { saveImage, getPaginationImage, getAllIMAGES } from '../../apis/imageAPI';
import { useInfiniteQuery } from '@tanstack/react-query'
import { PaginatedResponse } from '../../apis/imageAPI'
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

const ImageFeedPage = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage, } = useInfiniteQuery<PaginatedResponse>({
      queryKey: ['projects'],
      queryFn: ({ pageParam = 0 }) => getPaginationImage(pageParam),

      getNextPageParam: (lastPage) => {
        return lastPage.last ? undefined : lastPage.number + 1;
      },

      onError: (error: any) => {

        if (error?.message === "Login" || error?.status === 403) {
          navigate("/login");
        }
      }
    });


  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {


    if (!data) return;

    const allImages = data.pages.flatMap(page => page.content);
    setImages(allImages);
  }, [data]);


  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);


  const fecthAllImages = async () => {
    const data = await getAllIMAGES();
    setImages(data?.data);
  }


  const handleAddImage = async (image: File, caption: string) => {
    const response = await saveImage(image, caption);
    if (response) fecthAllImages();
  };


  return (
    <div className="image-feed-container">
      <div className="feed-header">
        <h1 style={{ color: "white" }}> Photos</h1>
        <p>{images.length} photos</p>
      </div>


      <div className="feed-content">
        {isLoading ? (
          <p style={{ color: "white", textAlign: "center" }}>
            Loading...
          </p>
        ) : images.length === 0 ? (
          <div className="empty-state">
            <p>No images yet</p>
            <p className="empty-hint">
              Tap the + button to add your first image
            </p>
          </div>
        ) : (
          <>
            <div className="images-grid" >
              {images.map((image) => (
                <ImageCard key={image.id} image={image} />
              ))}
              <div ref={ref} />
            </div>
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
        )}
      </div>


      <FAB onClick={() => setShowAddModal(true)} />
      <AddContentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        contentType="image"
        onAddContent={handleAddImage}
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


export default ImageFeedPage;
