import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/super-admin')({
  beforeLoad: async ({ context, location }) => {
    if (context.role !== 'super_admin') {
      if (context.role === 'admin') throw redirect({ to: '/admin/dashboard' })
      if (context.role === 'teacher') throw redirect({ to: '/teacher/dashboard' })
      if (context.role === 'student') throw redirect({ to: '/student/dashboard' })
      throw redirect({ to: '/login' })
    }

    if (location.pathname === '/super-admin' || location.pathname === '/super-admin/') {
      throw redirect({ to: '/super-admin/dashboard' })
    }
  },
})
