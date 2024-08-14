import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  /*{
    title: 'Home',
    path: '/admin',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },*/
  {
    title: 'Hojas de control',
    path: '/admin/hojas-control',
    icon: <Icon icon="lucide:clipboard-check" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Individual', icon: <Icon icon="lucide:clipboard-minus" width="24" height="24" />, path: '/admin/hojas-control/individual' },
      { title: 'Por bloque', icon: <Icon icon="lucide:clipboard-list" width="24" height="24" />, path: '/admin/hojas-control/por-bloque' },
    ],
  },
  {
    title: 'Gestión de personal',
    path: '/admin/gestion-personal',
    icon: <Icon icon="lucide:user-round-check" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Titulos', icon: <Icon icon="lucide:award" width="24" height="24" />, path: '/admin/gestion-personal/titulos' },
      { title: 'Docentes', icon: <Icon icon="lucide:user-round" width="24" height="24" />, path: '/admin/gestion-personal/docentes' },
      { title: 'Laboratoristas', icon: <Icon icon="lucide:user-round-cog" width="24" height="24" />, path: '/admin/gestion-personal/laboratoristas' },
    ],
  },
  {
    title: 'Infraestructura',
    path: '/admin/infraestructura',
    icon: <Icon icon="lucide:building" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Edificios', icon: <Icon icon="lucide:building-2" width="24" height="24" />, path: '/admin/infraestructura/edificios' },
      { title: 'Pisos', icon: <Icon icon="lucide:dock" width="24" height="24" />, path: '/admin/infraestructura/pisos' },
      { title: 'Aulas', icon: <Icon icon="lucide:door-open" width="24" height="24" />, path: '/admin/infraestructura/aulas' },
      { title: 'Características de aulas', icon: <Icon icon="lucide:list-check" width="24" height="24" />, path: '/admin/infraestructura/caracteristicas-aulas' },
    ],
  },
  {
    title: 'Gestión equipos',
    path: '/admin/gestion-equipos',
    icon: <Icon icon="lucide:server-cog" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Máquinas', icon: <Icon icon="lucide:monitor-smartphone" width="24" height="24" />, path: '/admin/gestion-equipos/maquinas' },
      { title: 'Observaciones', icon: <Icon icon="lucide:inbox" width="24" height="24" />, path: '/admin/gestion-equipos/observaciones' },
      { title: 'Software', icon: <Icon icon="lucide:code-xml" width="24" height="24" />, path: '/admin/gestion-equipos/software' },
    ],
  },
  {
    title: 'Administración de horarios',
    path: '/admin/administracion-horarios',
    icon: <Icon icon="lucide:calendar-cog" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Horarios', icon: <Icon icon="lucide:calendar-days" width="24" height="24" />, path: '/admin/administracion-horarios/horarios' },
      { title: 'Periodos', icon: <Icon icon="lucide:calendar-range" width="24" height="24" />, path: '/admin/administracion-horarios/periodos' },
    ],
  },
  {
    title: 'Administración académica',
    path: '/admin/administracion-academica',
    icon: <Icon icon="lucide:folder-cog" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Semestres', icon: <Icon icon="lucide:calendar" width="24" height="24" />, path: '/admin/administracion-academica/semestres' },
      { title: 'Materias', icon: <Icon icon="lucide:book-marked" width="24" height="24" />, path: '/admin/administracion-academica/materias' },
      { title: 'Carreras', icon: <Icon icon="lucide:graduation-cap" width="24" height="24" />, path: '/admin/administracion-academica/carreras' },
      { title: 'Paralelos', icon: <Icon icon="lucide:users-round" width="24" height="24" />, path: '/admin/administracion-academica/paralelos' },
    ],
  },
  {
    title: 'Sugerencias',
    path: '/admin/sugerencias',
    icon: <Icon icon="lucide:inbox" width="24" height="24" />,
  },
];