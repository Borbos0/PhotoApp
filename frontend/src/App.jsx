import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import Gallery from "./components/Gallery";
import LikedPhotos from "./components/LikedPhotos";
import PhotoViewer from "./components/PhotoViewer";
import Login from "./components/Login";
import Register from "./components/Register";

const App = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeViewer = () => {
    setSelectedPhoto(null);
  };

  return (
    <Router>
      <div>
        <nav>
          <Link to="/gallery">Gallery</Link>
          <Link to="/liked">Liked Photos</Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login">Login</Link>
              {/* <Link to="/register">Register</Link> */}
            </>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </nav>
        <Routes>
          <Route
            path="/gallery"
            element={
              isAuthenticated ? (
                <Gallery onPhotoClick={handlePhotoClick} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/liked"
            element={
              isAuthenticated ? <LikedPhotos /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/gallery" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/gallery" /> : <Register />
            }
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/gallery" : "/login"} />}
          />
        </Routes>
        {selectedPhoto && (
          <PhotoViewer photo={selectedPhoto} onClose={closeViewer} />
        )}
      </div>
    </Router>
  );
};

export default App;
