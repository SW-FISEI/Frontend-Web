import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Inicio',
    path: '#',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Dashboard', icon: <Icon icon="lucide:layout-dashboard" width="24" height="24" />, path: '/admin/laboratoristas/dashboard' },
    ]
  },
  {
    title: 'Consultas',
    path: '#',
    icon: <Icon icon="lucide:notebook-pen" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Docentes', icon: <Icon icon="lucide:users" width="24" height="24" />, path: '/admin/consultas/docentes' },
      { title: 'Laboratorios', icon: <Icon icon="lucide:pc-case" width="24" height="24" />, path: '/admin/consultas/laboratorios' },
    ]
  },
  {
    title: 'Hojas de control',
    path: '/admin/hojas-control/individual',
    icon: <Icon icon="lucide:clipboard-check" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Individual', icon: <Icon icon="lucide:clipboard-minus" width="24" height="24" />, path: '/admin/hojas-control/individual' },
      { title: 'Por bloque', icon: <Icon icon="lucide:clipboard-list" width="24" height="24" />, path: '/admin/hojas-control/por-bloque' },
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
      { title: 'Distribución de materias', icon: <Icon icon="lucide:blocks" width="24" height="24" />, path: '/admin/administracion-academica/distribucion-materias' },
      { title: 'Carreras', icon: <Icon icon="lucide:graduation-cap" width="24" height="24" />, path: '/admin/administracion-academica/carreras' },
      { title: 'Semestres', icon: <Icon icon="lucide:calendar" width="24" height="24" />, path: '/admin/administracion-academica/semestres' },
      { title: 'Materias', icon: <Icon icon="lucide:book-marked" width="24" height="24" />, path: '/admin/administracion-academica/materias' },
      { title: 'Paralelos', icon: <Icon icon="lucide:case-upper" width="24" height="24" />, path: '/admin/administracion-academica/paralelos' },
    ],
  },
  {
    title: 'Gestión equipos',
    path: '/admin/gestion-equipos',
    icon: <Icon icon="lucide:server-cog" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Distribución de software', icon: <Icon icon="lucide:shapes" width="24" height="24" />, path: '/admin/gestion-equipos/distribucion-software' },
      { title: 'Software', icon: <Icon icon="lucide:code-xml" width="24" height="24" />, path: '/admin/gestion-equipos/software' },
      { title: 'Máquinas', icon: <Icon icon="lucide:monitor-smartphone" width="24" height="24" />, path: '/admin/gestion-equipos/maquinas' },
      { title: 'Observaciones', icon: <Icon icon="lucide:inbox" width="24" height="24" />, path: '/admin/gestion-equipos/observaciones' },
    ],
  },
  {
    title: 'Gestión de personal',
    path: '/admin/gestion-personal/titulos',
    icon: <Icon icon="lucide:user-round-check" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Docentes', icon: <Icon icon="lucide:user-round" width="24" height="24" />, path: '/admin/gestion-personal/docentes' },
      { title: 'Laboratoristas', icon: <Icon icon="lucide:user-round-cog" width="24" height="24" />, path: '/admin/gestion-personal/laboratoristas' },
      { title: 'Titulos', icon: <Icon icon="lucide:award" width="24" height="24" />, path: '/admin/gestion-personal/titulos' },
    ],
  },
  {
    title: 'Infraestructura',
    path: '/admin/infraestructura/edificios',
    icon: <Icon icon="lucide:building" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Aulas', icon: <Icon icon="lucide:door-open" width="24" height="24" />, path: '/admin/infraestructura/aulas' },
      { title: 'Distribución de Pisos', icon: <Icon icon="lucide:door-closed" width="24" height="24" />, path: '/admin/infraestructura/distribucion-pisos' },
      { title: 'Pisos', icon: <Icon icon="lucide:dock" width="24" height="24" />, path: '/admin/infraestructura/pisos' },
      { title: 'Edificios', icon: <Icon icon="lucide:building-2" width="24" height="24" />, path: '/admin/infraestructura/edificios' },
    ],
  },
];