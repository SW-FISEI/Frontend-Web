import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionAuthProvider from "@/context/SessionAuthProvider";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Horarios FISEI",
  description: "Aplicación de horarios FISEI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="uta-light">
      <body className={`${inter.className} bg-background text-foreground`}>
        <main className="principalcontainer">
          <Suspense fallback={<div>Cargando...</div>}>
            <SessionAuthProvider>{children}</SessionAuthProvider>
          </Suspense>
        </main>
      </body>
    </html>
  );
}