import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { NotFound404 } from "./components/ui/errors/404";
import { routeTree } from "./routeTree.gen";
import { useRouterContextState } from "./lib/router-context-state";
import { useAuthStore } from "../stores/auth-store";
import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../config/query-client";
import { PageLoader } from "./components/ui/page-loader";
import { useAppStore } from "../stores/app-store";

const router = createRouter({
  routeTree,
  context: {
    role: null,
    user: null,
    logout: () => {},
    isSuperAdmin: false,
    isTeacher: false,
    isStudent: false,
    isAdmin: false,
    isAuthenticated: false,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultNotFoundComponent: NotFound404,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const context = useRouterContextState();
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const isBootstrapping = useAppStore((s) => s.isBootstrapping);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    fetchUser().finally(() => setIsInitialized(true));
  }, []);

  return (
    <>
      {/* Couvre l'écran depuis le démarrage jusqu'au premier idle du router */}
      <PageLoader visible={isBootstrapping} />
      {isInitialized && <RouterProvider router={router} context={context} />}
    </>
  );
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
