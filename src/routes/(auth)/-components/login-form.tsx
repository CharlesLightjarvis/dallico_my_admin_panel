import { cn } from "@/lib/utils";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuthStore } from "../../../../stores/auth-store";
import type { LoginFormData } from "../../../../schemas/auth-schema";
import {
  loginSchema,
  loginDefaultValues,
} from "../../../../schemas/auth-schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    console.log("🔐 Submitting login form:", { email: data.email });

    try {
      const result = await login(data);

      // Log complet de la réponse du backend
      console.log("📦 Backend response:", JSON.stringify(result, null, 2));

      if (result.success) {
        const user = useAuthStore.getState().user;
        console.log("✅ Login successful, redirecting...", {
          role: user?.role,
        });

        // Redirect based on role
        if (user?.role === "super_admin") {
          navigate({ to: "/super-admin/dashboard" });
        }
        // else if (user?.role === "admin") {
        //   navigate({ to: "/admin/dashboard" });
        // } else if (user?.role === "teacher") {
        //   navigate({ to: "/teacher/dashboard" });
        // } else if (user?.role === "student") {
        //   navigate({ to: "/student/dashboard" });
        // }
      } else {
        console.error("❌ Login failed - Full result:", {
          success: result.success,
          message: result.message,
          errors: result.errors,
          fullResult: result,
        });
      }
    } catch (error) {
      console.error("❌ Login error (catch):", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={form.handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Entrez vos identifiants ci-dessous pour vous connecter à votre
            compte
          </p>
        </div>

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="m@example.com"
                aria-invalid={fieldState.invalid}
                disabled={isLoading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Mot de passe oublié ?
                </a>
              </div>
              <Input
                {...field}
                id="password"
                type="password"
                aria-invalid={fieldState.invalid}
                disabled={isLoading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
