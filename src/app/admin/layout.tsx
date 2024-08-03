"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import HeaderMobile from '@/components/header-mobile';
import MarginWidthWrapper from '@/components/margin-width-wrapper';
import PageWrapper from '@/components/page-wrapper';
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
            <main className="contenedorContenido">
                    <HeaderMobile />
                    <PageWrapper>{children}</PageWrapper>
            </main>
        </div>
    );
}
