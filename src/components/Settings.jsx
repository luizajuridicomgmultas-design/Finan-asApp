import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Trash2, Info, CheckSquare, Crown, FolderOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { initializeDefaultData } from '../lib/defaultData';

const Settings = ({ darkMode, setDarkMode, setTransactions, setAccounts, setCategories, setWishlist, setShopping, setTasks, setSubscription }) => {
  const { toast } = useToast();

  const handleClearData = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      const defaultData = initializeDefaultData();
      setTransactions(defaultData.transactions);
      setAccounts(defaultData.accounts);
      setCategories(defaultData.categories);
      setWishlist(defaultData.wishlist);
      setShopping(defaultData.shopping);
      setTasks(defaultData.tasks);
      setSubscription(defaultData.subscription);
      
      toast({
        title: "Dados limpos",
        description: "Todos os dados foram resetados para os valores padrão"
      });
    }
  };

  const menuItems = [
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
    { id: 'subscription', label: 'Assinatura', icon: Crown },
    { id: 'categories', label: 'Categorias', icon: FolderOpen }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Personalize seu aplicativo</p>
      </div>

      <div className="md:hidden space-y-3 mb-6">
        <p className="text-sm font-semibold text-muted-foreground">Acesso Rápido</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => {
                toast({
                  title: "🚧 Funcionalidade em desenvolvimento",
                  description: `Navegue para ${item.label} usando o menu principal`
                });
              }}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Aparência</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <div>
              <Label htmlFor="dark-mode" className="text-base font-medium">Modo Escuro</Label>
              <p className="text-sm text-muted-foreground">Ative o tema escuro</p>
            </div>
          </div>
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Dados</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Limpe todos os dados e restaure para os valores padrão
            </p>
            <Button variant="destructive" className="gap-2" onClick={handleClearData}>
              <Trash2 className="w-4 h-4" />
              Limpar Todos os Dados
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Sobre o Finanças Plus</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Versão 1.0.0
            </p>
            <p className="text-sm text-muted-foreground">
              Aplicativo de gestão financeira pessoal completo e moderno. Todos os dados são salvos localmente no seu dispositivo usando localStorage.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
