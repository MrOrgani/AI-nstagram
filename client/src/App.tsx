import { Route, Routes } from "react-router-dom";
import { Feed, Profile } from "./pages";

import Navbar from "./components/shared/Navbar";
import { Toaster } from "./components/ui/toaster";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Toaster />
      <main className="flex flex-col">
        <Navbar />
        <div className="h-screen pt-24">
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route index path="/feed" element={<Feed />} />
            <Route path="/:id" element={<Profile />} />
            <Route path="/:id/edit" element={<EditProfile />} />
          </Routes>
        </div>
      </main>
    </>
  );
}

export default App;
