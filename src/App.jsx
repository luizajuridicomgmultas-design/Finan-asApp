import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Accounts from './components/Accounts';
import Lists from './components/Lists';
import Tasks from './components/Tasks';
import Subscription from './components/Subscription';
import Categories from './components/Categories';
import Settings from './components/Settings';
import { Toaster } from './components/ui/toaster';
import { useLocalStorage } from './hooks/useLocalStorage';
import { initializeDefaultData } from './lib/defaultData';
import ActivationFlow from './components/ActivationFlow';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [userPlan, setUserPlan] = useLocalStorage('user_plan', null);
  const [userExpiry, setUserExpiry] = useLocalStorage('user_expiry', null);
  
  const [isActivated, setIsActivated] = useState(false);

  const [transactions, setTransactions] = useLocalStorage('transactions', []);
  const [accounts, setAccounts] = useLocalStorage('accounts', []);
  const [categories, setCategories] = useLocalStorage('categories', []);
  const [wishlist, setWishlist] = useLocalStorage('wishlist', []);
  const [shopping, setShopping] = useLocalStorage('shopping', []);
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [subscription, setSubscription] = useLocalStorage('subscription', null);

  useEffect(() => {
    if (userPlan && userExpiry) {
      const expiryDate = new Date(userExpiry);
      if (expiryDate > new Date()) {
        setIsActivated(true);
      } else {
        // Clear expired data
        setUserPlan(null);
        setUserExpiry(null);
      }
    }
  }, [userPlan, userExpiry, setUserPlan, setUserExpiry]);


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (isActivated && transactions.length === 0 && accounts.length === 0) {
      const defaultData = initializeDefaultData();
      setTransactions(defaultData.transactions);
      setAccounts(defaultData.accounts);
      setCategories(defaultData.categories);
      setWishlist(defaultData.wishlist);
      setShopping(defaultData.shopping);
      setTasks(defaultData.tasks);
    }
  }, [isActivated, transactions, accounts, setTransactions, setAccounts, setCategories, setWishlist, setShopping, setTasks]);

  const onActivationSuccess = (plan, expiry, email) => {
    setUserPlan(plan);
    setUserExpiry(expiry);
    setIsActivated(true);

    const expiryDate = new Date(expiry);
    const daysUntilRenewal = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));

    const newSubscription = {
      status: 'active',
      planType: plan,
      email: email,
      daysUntilRenewal,
      benefits: [
        'Backup automático na nuvem',
        'Relatórios avançados',
        'Suporte prioritário',
        'Sem anúncios',
        'Exportação de dados'
      ]
    };
    
    setSubscription(newSubscription);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} accounts={accounts} categories={categories} />;
      case 'transactions':
        return <Transactions transactions={transactions} setTransactions={setTransactions} accounts={accounts} categories={categories} />;
      case 'accounts':
        return <Accounts accounts={accounts} setAccounts={setAccounts} />;
      case 'lists':
        return <Lists wishlist={wishlist} setWishlist={setWishlist} shopping={shopping} setShopping={setShopping} />;
      case 'tasks':
        return <Tasks tasks={tasks} setTasks={setTasks} />;
      case 'subscription':
        return <Subscription subscription={subscription} setSubscription={setSubscription} />;
      case 'categories':
        return <Categories categories={categories} setCategories={setCategories} />;
      case 'settings':
        return <Settings darkMode={darkMode} setDarkMode={setDarkMode} setTransactions={setTransactions} setAccounts={setAccounts} setCategories={setCategories} setWishlist={setWishlist} setShopping={setShopping} setTasks={setTasks} setSubscription={setSubscription} setIsActivated={setIsActivated} />;
      default:
        return <Dashboard transactions={transactions} accounts={accounts} categories={categories} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Finanças Plus - Gestão Financeira Pessoal</title>
        <meta name="description" content="Controle completo das suas finanças pessoais com dashboard, transações, contas, listas e muito mais." />
      </Helmet>
      
      {!isActivated ? (
        <ActivationFlow onActivationSuccess={onActivationSuccess} />
      ) : (
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
            {renderContent()}
          </main>
          <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}
      <Toaster />
    </>
  );
}

export default App;
