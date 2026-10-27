import type { RouteRecordRaw } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/features/auth/views/LoginView.vue'),
        meta: { pageTitle: 'Iniciar sesión' },
      },
    ],
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: { name: 'tasks' } },
      {
        path: 'tasks',
        name: 'tasks',
        component: () => import('@/features/tasks/views/TaskListView.vue'),
        meta: { roles: ['admin', 'member'], pageTitle: 'Tareas' },
      },
      {
        path: 'tasks/:id',
        name: 'task-detail',
        component: () => import('@/features/tasks/views/TaskDetailView.vue'),
        meta: { roles: ['admin', 'member'], pageTitle: 'Detalle de la tarea' },
      },
      {
        path: 'members',
        name: 'members',
        component: () => import('@/features/members/views/MembersView.vue'),
        meta: { roles: ['admin'], pageTitle: 'Miembros del equipo' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'tasks' },
  },
]
