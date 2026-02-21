'use client'

import { CreateHubModal } from '@/components/features/hub/CreateHubModal'
import { Sidebar } from '@/components/shared'

interface Props {
  children: React.ReactNode
}

export default function DashboardContent({ children }: Props) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full min-h-screen bg-muted/50 dark:bg-background overflow-hidden pl-64 ">
        {children}
      </main>
      <CreateHubModal />
    </div>
  )
}
