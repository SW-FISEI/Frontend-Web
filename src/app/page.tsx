"use client";

import Image from "next/image";
import FormularioLoguin from "@/components/formulario-loguin";
import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  return (
    <NextUIProvider>
      <main className="uta-light text-foreground bg-background principal">
        <div className="formulario">
          <FormularioLoguin />
        </div>
      </main>
    </NextUIProvider>
  );
}
