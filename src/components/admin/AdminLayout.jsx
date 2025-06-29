import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, LayoutDashboard, Users, Settings, Menu, Sun, Moon, BarChartBig, FileText, BellDot, Tags, MessageSquare, Webhook, LifeBuoy } from 'lucide-react';

const AdminSidebarNav = ({ closeSidebar }) => {
  const location = useLocation();
  const navItems = [
    { to: "/admin/dashboard", icon: <LayoutDashboard className="ml-2 h-5 w-5" />, text: "لوحة التحكم الرئيسية" },
    { to: "/admin/users", icon: <Users className="ml-2 h-5 w-5" />, text: "إدارة المستخدمين" },
    // { to: "/admin/reports", icon: <FileText className="ml-2 h-5 w-5" />, text: "التقارير" }, // Example for later
    // { to: "/admin/settings", icon: <Settings className="ml-2 h-5 w-5" />, text: "الإعدادات العامة" }, // Example for later
  ];

  return (
    <nav className="space-y-2">
      {navItems.map(item => (
        <Link
          key={item.to}
          to={item.to}
          onClick={closeSidebar}
          className={`flex items-center px-3 py-2 rounded-md transition-colors
            ${location.pathname === item.to 
              ? 'bg-indigo-600 text-white font-semibold shadow-md' 
              : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
            }`}
        >
          {item.icon}
          {item.text}
        </Link>
      ))}
    </nav>
  );
};


const AdminLayout = () => {
  const { isAdmin, loading, logout, adminUser } = useAdminAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const closeSidebar = () => setIsSidebarOpen(false);


  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900"><p className="text-xl text-indigo-600 dark:text-indigo-300">جاري التحميل...</p></div>;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className={`min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 arabic-text`} dir="rtl">
      <header className="bg-indigo-700 dark:bg-gray-800 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="md:hidden text-white hover:bg-indigo-800 dark:hover:bg-gray-700">
              <Menu className="h-6 w-6" />
            </Button>
            <Link to="/admin/dashboard" className="text-xl md:text-2xl font-bold hover:text-indigo-200 dark:hover:text-indigo-300 transition-colors">
              لوحة تحكم المدير - Umnak.tech
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={toggleDarkMode} variant="ghost" size="icon" className="text-white hover:bg-indigo-800 dark:hover:bg-gray-700">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <span className="text-sm hidden sm:inline">مرحباً, {adminUser?.name || 'أيها المدير'}</span>
            <Button onClick={logout} variant="ghost" className="text-white hover:bg-indigo-800 hover:text-indigo-100 dark:hover:bg-gray-700 dark:hover:text-indigo-200">
              <LogOut className="ml-2 h-5 w-5" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 container mx-auto pt-2">
        {/* Mobile Sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="right" className="bg-white dark:bg-gray-800 p-4 w-72">
            <div className="mb-6 text-center">
              <Link to="/admin/dashboard" onClick={closeSidebar} className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                Umnak.tech Admin
              </Link>
            </div>
            <AdminSidebarNav closeSidebar={closeSidebar} />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 p-4 shadow-lg rounded-lg sticky top-20 self-start hidden md:block max-h-[calc(100vh-6rem)] overflow-y-auto">
          <AdminSidebarNav closeSidebar={() => {}} />
        </aside>

        <main className="flex-1 p-2 md:p-6">
          <Outlet />
        </main>
      </div>
      
      <footer className="bg-gray-800 dark:bg-gray-900 text-white text-center p-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} Umnak.tech - لوحة تحكم المدير</p>
      </footer>
    </div>
  );
};

export default AdminLayout;