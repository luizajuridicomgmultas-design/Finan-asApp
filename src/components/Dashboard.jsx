import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Dashboard = ({ transactions, accounts, categories }) => {
  const stats = useMemo(() => {
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return { totalBalance, income, expenses, balance: income - expenses };
  }, [transactions, accounts]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transactions]);

  const expensesByCategory = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthExpenses = transactions.filter(t => {
      const tDate = new Date(t.date);
      return t.type === 'expense' && tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });

    const grouped = monthExpenses.reduce((acc, t) => {
      const category = categories.find(c => c.id === t.categoryId);
      const categoryName = category?.name || 'Outros';
      const categoryColor = category?.color || '#708090';
      
      if (!acc[categoryName]) {
        acc[categoryName] = { name: categoryName, value: 0, color: categoryColor };
      }
      acc[categoryName].value += Math.abs(t.amount);
      return acc;
    }, {});

    return Object.values(grouped);
  }, [transactions, categories]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral das suas finanças</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Saldo Total</span>
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">R$ {stats.totalBalance.toFixed(2)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Receitas do Mês</span>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-500">R$ {stats.income.toFixed(2)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Despesas do Mês</span>
            <ArrowDownRight className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-500">R$ {stats.expenses.toFixed(2)}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Últimas Transações</h2>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const category = categories.find(c => c.id === transaction.categoryId);
              return (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{category?.name || 'Outros'}</p>
                  </div>
                  <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.type === 'income' ? '+' : '-'}R$ {Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Despesas por Categoria</h2>
          {expensesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">Nenhuma despesa registrada este mês</p>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Minhas Contas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {accounts.map((account) => (
            <div key={account.id} className="p-4 bg-accent rounded-lg border-l-4" style={{ borderLeftColor: account.color }}>
              <p className="text-sm text-muted-foreground mb-1">{account.name}</p>
              <p className="text-2xl font-bold">R$ {account.balance.toFixed(2)}</p>
              {account.type === 'credit' && account.limit && (
                <p className="text-xs text-muted-foreground mt-1">Limite: R$ {account.limit.toFixed(2)}</p>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
