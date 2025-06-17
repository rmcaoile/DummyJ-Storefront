import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import ProfilePage from "@/pages/ProfilePage";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <Toaster position="bottom-left" richColors />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;