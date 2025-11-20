// src/components/layout/Sidebar.tsx

import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { sidebarItems } from '@/lib/sidebar';
import { LogOut } from 'lucide-react';
import Logo from './Logo'; // We'll create this next

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Filter items by role & supporterType
  const filteredItems = sidebarItems.filter((item) => {
    if (!user) return false;
    
    // If no role restriction, show to all
    if (!item.roles) return true;
    
    // Check role
    if (!item.roles.includes(user.role)) return false;
    
    // If supporter, check type
    if (user.role === 'supporter' && item.supporterTypes) {
      return item.supporterTypes.includes(user.supporterType);
    }
    
    return true;
  });

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out',
          isOpen ? 'w-64' : 'w-20 lg:w-64',
          'lg:translate-x-0',
          !isOpen && 'translate-x-[-100%] lg:translate-x-0'
        )}
      >
        <div className="p-4 border-b border-border">
          <Logo collapsed={!isOpen} />
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {filteredItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                    location.pathname === item.href
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground hover:bg-muted/50'
                  )}
                >
                  <item.icon className={cn('h-5 w-5', !isOpen && 'mx-auto')} />
                  <span className={cn(isOpen ? 'block' : 'hidden lg:block')}>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10',
              !isOpen && 'justify-center px-0'
            )}
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            <span className={cn(isOpen ? 'block' : 'hidden lg:block')}>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-md border border-border"
      >
        <div className="h-0.5 w-6 bg-foreground mb-1"></div>
        <div className="h-0.5 w-6 bg-foreground mb-1"></div>
        <div className="h-0.5 w-6 bg-foreground"></div>
      </button>

      {/* Main content offset */}
      <div className={cn(
        'transition-all duration-300',
        isOpen ? 'lg:ml-64' : 'lg:ml-20'
      )} />
    </>
  );
};

export default Sidebar;