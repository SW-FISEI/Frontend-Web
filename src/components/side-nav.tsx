'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SIDENAV_ITEMS } from '@/constants';
import { SideNavItem } from '@/types';
import { Icon } from '@iconify/react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import '@/styles/side-nav.scss';
import { signOut } from 'next-auth/react';

const SideNav = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleSidebarCollapseHandler = () => {
        setIsCollapsed((prev) => !prev);
    };

    return (
        <div className="contenedorSidebar">
            <button className="btnSidebar" onClick={toggleSidebarCollapseHandler}>
                {isCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
            </button>
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="encabezadoSidebar">
                    <Link href="/admin" className="botonLogo">
                        <Image className="logoSidebar" src="/logo.png" width={80} height={80} alt="Logo" />
                        <p className="fisei">Sistema de Horarios</p>
                    </Link>
                </div>
                <div className="contenedorItems">
                    {SIDENAV_ITEMS.map((item, idx) => (
                        <MenuItem key={idx} item={item} />
                    ))}
                </div>
                <div className="cerrarSesion">
                    <button
                        onClick={() => signOut()}
                        className="nombreCerrarSesion"
                    >
                        <Icon className='inline-block ml-[10px] mr-[10px]' icon="lucide:log-out" width="24" height="24" />
                        Cerrar sesión
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
    const pathname = usePathname();
    const [subMenuOpen, setSubMenuOpen] = useState(false);

    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    };

    // Comprobar si el pathname actual coincide o es una subruta de item.path
    const isActive = pathname.startsWith(item.path) || item.subMenuItems?.some(subItem => pathname.startsWith(subItem.path));

    return (
        <div className={`contenedorSubmenuItems ${isActive ? 'contenedorSubmenuItemsPressed' : ''}`}>
            {item.submenu ? (
                <>
                    <button
                        onClick={toggleSubMenu}
                        className={`fondoOpcionMenu ${isActive ? 'fondoOpcionMenuPressed' : ''}`}
                    >
                        <div className="textoOpcionMenu">
                            {item.icon}
                            <strong><span className="menu-item-title">{item.title}</span></strong>
                        </div>
                        <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
                            <Icon icon="lucide:chevron-down" width="24" height="24" />
                        </div>
                    </button>
                    {subMenuOpen && (
                        <div className={`submenu ${isActive ? 'fondoOpcionMenuPressed' : ''}`}>
                            {item.subMenuItems?.map((subItem, idx) => (
                                <Link
                                    key={idx}
                                    href={subItem.path}
                                    className={`submenuItem ${pathname.startsWith(subItem.path) ? 'submenuItemPressed' : ''}`}
                                >
                                    {subItem.icon}
                                    <span className="submenu-item-title">{subItem.title}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <Link
                    href={item.path}
                    className={`single-submenu ${pathname.startsWith(item.path) ? 'single-submenuPressed' : ''}`}
                >
                    {item.icon}
                    <span className="single-submenu-title">{item.title}</span>
                </Link>
            )}
        </div>
    );
};
