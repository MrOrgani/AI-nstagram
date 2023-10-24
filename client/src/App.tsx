import { Route, Routes } from "react-router-dom";
import { Home, Profile } from "./pages";

import Navbar from "./@/components/Navbar";
import { Toaster } from "./@/components/ui/toaster";
import useAuthStore from "./store/authStore";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <>
      <Navbar />
      <Toaster />
      <main className=" px-4 w-full bg-white flex flex-col h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<Profile />} />
          <Route path="/:id/edit" element={<EditProfile />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
