import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionAuthProvider from "@/context/SessionAuthProvider";
import { Suspense } from "react";

import { Toaster } from 'react-hot-toast';

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
            <Toaster
              position="top-right"
              reverseOrder={false}
              gutter={8}
              containerStyle={{}}
              toastOptions={{
                style: {
                  background: '#4e1414',
                  color: '#ffffff',
                  animation: 'step-end'
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#096e27',
                    color: '#ffffff',
                  }
                }
              }} />
          </Suspense>
        </main>
      </body>
    </html>
  );
}