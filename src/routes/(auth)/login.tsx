import { createFileRoute, redirect } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";
import z from "zod";
import { LoginForm } from "./-components/login-form";
import { LoginMedia } from "./-components/login-media";
import { PageLoader } from "@/components/ui/page-loader";

export const Route = createFileRoute("/(auth)/login")({
  component: RouteComponent,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: async ({ context }) => {
    const { isAuthenticated, role } = context;
    if (isAuthenticated) {
      if (role === "super_admin")
        throw redirect({ to: "/super-admin/dashboard" });
      // if (role === "admin") throw redirect({ to: "/admin/dashboard" });
      // if (role === "teacher") throw redirect({ to: "/teacher/dashboard" });
      // if (role === "student") throw redirect({ to: "/student/dashboard" });
    }
  },
});

function RouteComponent() {
  const [isPageReady, setIsPageReady] = useState(false);

  return (
    <>
      <PageLoader visible={!isPageReady} />
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
              Dallico.
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <LoginForm />
            </div>
          </div>
        </div>
        <LoginMedia onReady={() => setIsPageReady(true)} />
      </div>
    </>
  );
}
