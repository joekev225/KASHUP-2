'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  balance: number
  setBalance: (balance: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [balance, setBalance] = useState(0)

  return (
    <AppContext.Provider value={{ user, setUser, balance, setBalance }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
