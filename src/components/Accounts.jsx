import Button from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import Input from './ui/input';
import Label from './ui/label';
import Select, { SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from './ui/use-toast';

const Accounts = ({ accounts, setAccounts }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'debit',
    balance: '',
    limit: '',
    color: '#FF6B00'
  });

  const accountTypes = [
    { value: 'debit', label: 'Débito', icon: Wallet },
    { value: 'credit', label: 'Crédito', icon: CreditCard },
    { value: 'savings', label: 'Poupança', icon: PiggyBank },
    { value: 'cash', label: 'Dinheiro', icon: Banknote }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.balance) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const accountData = {
      ...formData,
      balance: parseFloat(formData.balance),
      limit: formData.limit ? parseFloat(formData.limit) : undefined
    };

    if (editingId) {
      setAccounts(accounts.map(a => 
        a.id === editingId ? { ...accountData, id: editingId } : a
      ));
      toast({ title: "Sucesso", description: "Conta atualizada!" });
    } else {
      const newAccount = {
        ...accountData,
        id: Date.now().toString()
      };
      setAccounts([...accounts, newAccount]);
      toast({ title: "Sucesso", description: "Conta adicionada!" });
    }

    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (account) => {
    setEditingId(account.id);
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      limit: account.limit?.toString() || '',
      color: account.color
    });
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Deseja realmente excluir esta conta?')) {
      setAccounts(accounts.filter(a => a.id !== id));
      toast({ title: "Sucesso", description: "Conta excluída!" });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      type: 'debit',
      balance: '',
      limit: '',
      color: '#FF6B00'
    });
  };

  const getTypeIcon = (type) => {
    const typeObj = accountTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : Wallet;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contas</h1>
          <p className="text-muted-foreground">Gerencie suas contas bancárias</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Conta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar' : 'Nova'} Conta</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Conta</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Nubank"
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="balance">Saldo Atual</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              {formData.type === 'credit' && (
                <div>
                  <Label htmlFor="limit">Limite (opcional)</Label>
                  <Input
                    id="limit"
                    type="number"
                    step="0.01"
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="color">Cor</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingId ? 'Atualizar' : 'Adicionar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => {
          const Icon = getTypeIcon(account.type);
          return (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-lg p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: account.color }} />
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent">
                    <Icon className="w-6 h-6" style={{ color: account.color }} />
                  </div>
                  <div>
                    <p className="font-semibold">{account.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{accountTypes.find(t => t.value === account.type)?.label}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(account)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(account.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Saldo</p>
                <p className={`text-3xl font-bold ${account.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  R$ {account.balance.toFixed(2)}
                </p>
                {account.type === 'credit' && account.limit && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Limite: R$ {account.limit.toFixed(2)}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Accounts;
