import { Home, Pill, FileText, Stethoscope, Truck, Bell, User } from 'lucide-react';

/**
 * Items del sidebar para el rol Paciente.
 * Cada rol tendrá su propio archivo así (features/medico/sidebarMenu.js, etc.)
 * y DashboardLayout recibe el array correspondiente según el usuario autenticado.
 */
export const pacienteSidebarMenu = [
  { id: 'inicio', label: 'Inicio', icon: Home, href: '/paciente/inicio' },
  { id: 'medicinas', label: 'Medicinas', icon: Pill, href: '/paciente/medicinas' },
  { id: 'recetas', label: 'Recetas', icon: FileText, href: '/paciente/recetas' },
  { id: 'examenes', label: 'Exámenes', icon: Stethoscope, href: '/paciente/examenes' },
  { id: 'pedidos', label: 'Pedidos', icon: Truck, href: '/paciente/pedidos' },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell, href: '/paciente/notificaciones' },
  { id: 'perfil', label: 'Perfil', icon: User, href: '/paciente/perfil' },
];
