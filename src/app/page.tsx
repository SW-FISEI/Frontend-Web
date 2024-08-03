"use client";

import Image from "next/image";
import LoginForm from "@/components/LoginForm";


export default function Home() {
  return (
    <main className="principal">
        <div className="formulario">
          <LoginForm />
        </div>
    </main>
  );
}
