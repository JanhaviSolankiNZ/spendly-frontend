import "./App.css";
import router from "@/router";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect, Suspense } from "react";

function App() {

  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
      </Suspense>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#161b27",
            color: "#e5e7eb",
            border: "1px solid #2d3748",
            fontSize: "13px",
          },
          success: { iconTheme: { primary: "#5DCAA5", secondary: "#04342C" } },
          error: { iconTheme: { primary: "#F09595", secondary: "#500" } },
        }}
      />
    </>
  );
}

export default App;
