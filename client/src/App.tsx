import { Route, Routes } from "react-router-dom";
import { Home, Profile } from "./pages";

import Navbar from "./@/components/Navbar";
import { Toaster } from "./@/components/ui/toaster";
import useAuthStore from "./store/authStore";

function App() {
  const { userProfile } = useAuthStore();
  return (
    <>
      <div className="fixed bottom-0 left-0 bg-slate-400 bg-opacity-50">
        <pre className="text-xs">{JSON.stringify(userProfile, null, 2)}</pre>
      </div>
      <Navbar />
      <Toaster />
      <main className=" px-4 w-full bg-white min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<Profile />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
