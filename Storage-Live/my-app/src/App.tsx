import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../Auth/LoginPage';
import HomePage from '../components/Home/HomePage';
import ImageFeedPage from '../components/ImageFeed/ImageFeedPage';
import VideoFeedPage from '../components/VideoFeed/VideoFeedPage';
import './App.css';

function AppContent() {
  return (
    <Routes>
      <Route path="/auth" element={<LoginPage />} />
      <Route
        path="/"
        element={<HomePage />}
      />
      <Route
        path="/images"
        element={<ImageFeedPage />}
      />
      <Route
        path="/videos"
        element={<VideoFeedPage />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;






// import { useEffect, useState } from 'react'
// import './App.css'
// import { videoResponse } from "../types/VideoResponse"
// import { getAllVideosInfo, getAllVideoURL } from "../apis/videoAPI";
// import Card from "../components/Card";
// import VideoPlayer from "../components/VideoPlayer";
// function App() {
//   const [selectedVideo, SetselectedVideo] = useState<string>('');
//   const [videoList, SetvideoList] = useState<videoResponse[] | []>([]);
//   const [flag, SetFlag] = useState<boolean>(true);
//   const getVideoData = async () => {
//     const data = await getAllVideosInfo();
//     SetvideoList(data?.data)
//   }
//   const getVideoURL = async (video: videoResponse) => {
//     if (video.id) {
//       const data = await getAllVideoURL(video.id);
//       SetFlag((prev) => !prev);
//       SetselectedVideo(data?.data)
//     }
//   }
//   useEffect(() => {
//     getVideoData();
//   }, []);
//   const closeVideo = () => {
//     SetFlag((prev) => !prev)
//     SetselectedVideo('');
//   }
//   return (
//     <>
//       <div>
//         <h1>Hey there</h1>
//         {
//           flag && (
//             videoList.map((each, _) => (
//               <div onClick={() => getVideoURL(each)}>
//                 <Card imageUrl={each.url} key={each.id} />
//               </div>
//             ))
//           )
//         }
//         {
//           !flag && selectedVideo && (
//             <>
//               <span onClick={closeVideo} style={{ cursor: "pointer" }}>x</span> <br />
//               <span>video</span>
//               <VideoPlayer streamURL={selectedVideo} />
//             </>
//           )
//         }
//       </div>
//     </>
//   )
// }
// export default App;

