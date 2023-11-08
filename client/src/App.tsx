import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/shared/Navbar";
import { Toaster } from "./components/ui/toaster";

const Home = lazy(() => import("./pages/Home"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Feed = lazy(() => import("./pages/Feed"));
const Profile = lazy(() => import("./pages/Profile"));

function App() {
  return (
    <>
      <Toaster />
      <main className="flex flex-col">
        <Navbar />
        <div className="h-screen pt-24">
          <Routes>
            <Route
              index
              path="/"
              element={
                <Suspense fallback={"Loading..."}>
                  <Home />
                </Suspense>
              }
            />
            <Route
              index
              path="/feed"
              element={
                <Suspense fallback={"Loading..."}>
                  <Feed />
                </Suspense>
              }
            />
            <Route
              path="/:id"
              element={
                <Suspense fallback={"Loading..."}>
                  <Profile />
                </Suspense>
              }
            />
            <Route
              path="/:id/edit"
              element={
                <Suspense fallback={"Loading..."}>
                  <EditProfile />
                </Suspense>
              }
            />
          </Routes>
        </div>
      </main>
    </>
  );
}

export default App;
