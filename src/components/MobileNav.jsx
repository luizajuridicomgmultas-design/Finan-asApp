import React from 'react';
import { LayoutDashboard, ArrowLeftRight, Wallet, ListTodo, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileNav = ({ activeTab, setActiveTab }) => {
  const mainItems = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'transactions', icon: ArrowLeftRight },
    { id: 'accounts', icon: Wallet },
    { id: 'lists', icon: ListTodo },
    { id: 'more', icon: MoreHorizontal }
  ];

  const handleClick = (id) => {
    if (id === 'more') {
      setActiveTab('settings');
    } else {
      setActiveTab(id);
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16">
        {mainItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'more' && ['tasks', 'subscription', 'categories', 'settings'].includes(activeTab));
          return (
            <motion.button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-6 h-6" />
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
