import Sidebar from './sidebar';

export default async function MainLayout({ children }) {
  return (
    <main className="flex h-screen items-center justify-center">
      <Sidebar />
      {children}
    </main>
  );
}
