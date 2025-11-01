import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Transactions = ({ transactions, setTransactions, accounts, categories }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterType, setFilterType] = useState('all');
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    categoryId: '',
    accountId: '',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      const matchesMonth = tDate.getMonth() === filterMonth;
      const matchesYear = tDate.getFullYear() === filterYear;
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesMonth && matchesYear && matchesType;
    });
  }, [transactions, filterMonth, filterYear, filterType]);

  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return { income, expenses, balance: income - expenses };
  }, [filteredTransactions]);

  const expensesByCategory = useMemo(() => {
    const monthExpenses = filteredTransactions.filter(t => t.type === 'expense');

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
  }, [filteredTransactions, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.categoryId || !formData.accountId) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const amount = formData.type === 'expense' ? -Math.abs(parseFloat(formData.amount)) : Math.abs(parseFloat(formData.amount));

    if (editingId) {
      setTransactions(transactions.map(t => 
        t.id === editingId 
          ? { ...formData, id: editingId, amount }
          : t
      ));
      toast({ title: "Sucesso", description: "Transação atualizada!" });
    } else {
      const newTransaction = {
        ...formData,
        id: Date.now().toString(),
        amount
      };
      setTransactions([...transactions, newTransaction]);
      toast({ title: "Sucesso", description: "Transação adicionada!" });
    }

    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setFormData({
      description: transaction.description,
      amount: Math.abs(transaction.amount).toString(),
      type: transaction.type,
      categoryId: transaction.categoryId,
      accountId: transaction.accountId,
      date: transaction.date.split('T')[0]
    });
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Deseja realmente excluir esta transação?')) {
      setTransactions(transactions.filter(t => t.id !== id));
      toast({ title: "Sucesso", description: "Transação excluída!" });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      categoryId: '',
      accountId: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transações</h1>
          <p className="text-muted-foreground">Gerencie suas receitas e despesas</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar' : 'Nova'} Transação</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Supermercado"
                />
              </div>
              <div>
                <Label htmlFor="amount">Valor</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c.type === formData.type).map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="account">Conta</Label>
                <Select value={formData.accountId} onValueChange={(value) => setFormData({ ...formData, accountId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(acc => (
                      <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingId ? 'Atualizar' : 'Adicionar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Receitas</p>
          <p className="text-2xl font-bold text-green-500">R$ {stats.income.toFixed(2)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Despesas</p>
          <p className="text-2xl font-bold text-red-500">R$ {stats.expenses.toFixed(2)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Saldo</p>
          <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            R$ {stats.balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <Select value={filterMonth.toString()} onValueChange={(value) => setFilterMonth(parseInt(value))}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((month, idx) => (
                <SelectItem key={idx} value={idx.toString()}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterYear.toString()} onValueChange={(value) => setFilterYear(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2023, 2024, 2025].map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {filteredTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhuma transação encontrada</p>
          ) : (
            filteredTransactions.map((transaction) => {
              const category = categories.find(c => c.id === transaction.categoryId);
              const account = accounts.find(a => a.id === transaction.accountId);
              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-accent rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {category?.name || 'Outros'} • {account?.name || 'Conta'} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.type === 'income' ? '+' : '-'}R$ {Math.abs(transaction.amount).toFixed(2)}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(transaction)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(transaction.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {expensesByCategory.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Distribuição de Despesas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
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
        </div>
      )}
    </div>
  );
};

export default Transactions;
