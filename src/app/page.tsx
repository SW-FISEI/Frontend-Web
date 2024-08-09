"use client";

import Image from "next/image";
import LoginForm from "@/components/LoginForm";
import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  return (
    <NextUIProvider>
      <main className="uta-light text-foreground bg-background principal">
        <div className="formulario">
          <LoginForm />
        </div>
      </main>
    </NextUIProvider>
  );
}
