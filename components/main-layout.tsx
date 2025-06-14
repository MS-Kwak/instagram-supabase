'use client';

import Sidebar from './sidebar';
import { createContext, useState } from 'react';

export const selectedUserIdContext = createContext(null);
export const selectedUserIndexContext = createContext(null);
export const presenceStateContext = createContext(null);

export default function MainLayout({ children }) {
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [presence, setPresence] = useState({});

  return (
    <presenceStateContext.Provider value={{ presence, setPresence }}>
      <selectedUserIndexContext.Provider
        value={{ selectedUserIndex, setSelectedUserIndex }}
      >
        <selectedUserIdContext.Provider
          value={{ selectedUserId, setSelectedUserId }}
        >
          <main className="flex h-screen items-center justify-center">
            <Sidebar />
            {children}
          </main>
        </selectedUserIdContext.Provider>
      </selectedUserIndexContext.Provider>
    </presenceStateContext.Provider>
  );
}
