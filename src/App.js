import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import AdHandler from "./components/ads/AdHandling";
import Profile from "./components/profile/profile";
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ToS from "./components/other/ToS";
import PrivacyPolicy from "./components/other/PrivacyP";
import About from "./components/other/About";
import UserDash from "./components/Dashboard/UserDash";

const App = () => {
  return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-slate-700">
        <NavBar />
        <main className="flex-grow">
          <Routes>
          <Route path="/" element={<AdHandler />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/tos" element={<ToS />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/Dashboard" element={<UserDash />} />
          </Routes>
        </main>
        <Footer />
      </div>
  );
};

export default App;