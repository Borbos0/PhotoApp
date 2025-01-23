import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import Gallery from "./components/gallery/Gallery";
import LikedPhotos from "./components/gallery/LikedPhotos";
import Login from "./components/login/Login";
import Register from "./components/login/Register";
import UploadPhotos from "./components/upload/UploadPhoto";
import "./styles/App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div>
        <nav>
          <Link to="/gallery">Gallery</Link>
          <Link to="/liked">Liked Photos</Link>
          <Link to="/upload">Upload Photos</Link>
          {!isAuthenticated ? (
            <Link to="/login">Login</Link>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </nav>
        <Routes>
          <Route
            path="/gallery"
            element={isAuthenticated ? <Gallery /> : <Navigate to="/login" />}
          />
          <Route
            path="/liked"
            element={
              isAuthenticated ? <LikedPhotos /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/upload"
            element={
              isAuthenticated ? <UploadPhotos /> : <Navigate to="/login" />
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
      </div>
    </Router>
  );
};

export default App;
