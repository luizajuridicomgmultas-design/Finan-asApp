import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, ArrowLeftRight, Wallet, ListTodo, CheckSquare, Crown, FolderOpen, Settings } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transações', icon: ArrowLeftRight },
    { id: 'accounts', label: 'Contas', icon: Wallet },
    { id: 'lists', label: 'Listas', icon: ListTodo },
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
    { id: 'subscription', label: 'Assinatura', icon: Crown },
    { id: 'categories', label: 'Categorias', icon: FolderOpen },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col">
      <div className="p-6 border-b border-border">
        <span className="text-2xl font-bold text-primary">Finanças Plus</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
