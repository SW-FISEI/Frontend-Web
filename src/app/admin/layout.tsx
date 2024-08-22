"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import HeaderMovil from '@/components/header-movil';
import ContenedorPagina from '@/components/contenedor-pagina';
import SideNav from '@/components/side-nav';
import "@/styles/admin.scss"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    return (
        <div className="contenedorAdmin">
            <SideNav />
            <main className="contenedorPrincipalPaginas">
                    <HeaderMovil />
                    <ContenedorPagina>{children}</ContenedorPagina>
            </main>
        </div>
    );
}
