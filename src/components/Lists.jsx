import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ExternalLink, ShoppingCart, Heart } from 'lucide-react';
import { Button } from './components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Checkbox } from './components/ui/checkbox';
import { useToast } from './components/ui/use-toast';

const Lists = ({ wishlist, setWishlist, shopping, setShopping }) => {
  const { toast } = useToast();
  const [isWishOpen, setIsWishOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  
  const [wishFormData, setWishFormData] = useState({
    name: '',
    price: '',
    store: '',
    shipping: '',
    priority: 'medium',
    estimatedDate: '',
    link: ''
  });

  const [shopFormData, setShopFormData] = useState({
    name: ''
  });

  const handleWishSubmit = (e) => {
    e.preventDefault();
    
    if (!wishFormData.name || !wishFormData.price) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newItem = {
      ...wishFormData,
      id: Date.now().toString(),
      price: parseFloat(wishFormData.price),
      shipping: parseFloat(wishFormData.shipping) || 0
    };

    setWishlist([...wishlist, newItem]);
    toast({ title: "Sucesso", description: "Item adicionado à lista de desejos!" });
    setIsWishOpen(false);
    setWishFormData({
      name: '',
      price: '',
      store: '',
      shipping: '',
      priority: 'medium',
      estimatedDate: '',
      link: ''
    });
  };

  const handleShopSubmit = (e) => {
    e.preventDefault();
    
    if (!shopFormData.name) {
      toast({
        title: "Erro",
        description: "Digite o nome do item",
        variant: "destructive"
      });
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: shopFormData.name,
      completed: false
    };

    setShopping([...shopping, newItem]);
    toast({ title: "Sucesso", description: "Item adicionado à lista de compras!" });
    setIsShopOpen(false);
    setShopFormData({ name: '' });
  };

  const deleteWishItem = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
    toast({ title: "Sucesso", description: "Item removido!" });
  };

  const deleteShopItem = (id) => {
    setShopping(shopping.filter(item => item.id !== id));
    toast({ title: "Sucesso", description: "Item removido!" });
  };

  const toggleShopItem = (id) => {
    setShopping(shopping.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const shoppingTotal = shopping.filter(item => !item.completed).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Listas</h1>
        <p className="text-muted-foreground">Organize seus desejos e compras</p>
      </div>

      <Tabs defaultValue="wishlist" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wishlist" className="gap-2">
            <Heart className="w-4 h-4" />
            Desejos
          </TabsTrigger>
          <TabsTrigger value="shopping" className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            Compras Rápidas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wishlist" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isWishOpen} onOpenChange={setIsWishOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Desejo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Desejo</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleWishSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="wish-name">Nome do Item</Label>
                    <Input
                      id="wish-name"
                      value={wishFormData.name}
                      onChange={(e) => setWishFormData({ ...wishFormData, name: e.target.value })}
                      placeholder="Ex: Tênis Nike"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wish-price">Preço</Label>
                    <Input
                      id="wish-price"
                      type="number"
                      step="0.01"
                      value={wishFormData.price}
                      onChange={(e) => setWishFormData({ ...wishFormData, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wish-store">Loja</Label>
                    <Input
                      id="wish-store"
                      value={wishFormData.store}
                      onChange={(e) => setWishFormData({ ...wishFormData, store: e.target.value })}
                      placeholder="Ex: Amazon"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wish-shipping">Frete</Label>
                    <Input
                      id="wish-shipping"
                      type="number"
                      step="0.01"
                      value={wishFormData.shipping}
                      onChange={(e) => setWishFormData({ ...wishFormData, shipping: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wish-priority">Prioridade</Label>
                    <Select value={wishFormData.priority} onValueChange={(value) => setWishFormData({ ...wishFormData, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="wish-date">Data Estimada</Label>
                    <Input
                      id="wish-date"
                      type="date"
                      value={wishFormData.estimatedDate}
                      onChange={(e) => setWishFormData({ ...wishFormData, estimatedDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="wish-link">Link do Produto</Label>
                    <Input
                      id="wish-link"
                      type="url"
                      value={wishFormData.link}
                      onChange={(e) => setWishFormData({ ...wishFormData, link: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <Button type="submit" className="w-full">Adicionar</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wishlist.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.store}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteWishItem(item.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Preço:</span>
                    <span className="font-semibold">R$ {item.price.toFixed(2)}</span>
                  </div>
                  {item.shipping > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frete:</span>
                      <span>R$ {item.shipping.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-semibold">R$ {(item.price + item.shipping).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prioridade:</span>
                    <span className={`font-semibold capitalize ${getPriorityColor(item.priority)}`}>
                      {item.priority === 'high' ? 'Alta' : item.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </div>
                  {item.estimatedDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Data estimada:</span>
                      <span>{new Date(item.estimatedDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline mt-2"
                    >
                      Ver produto <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shopping" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {shoppingTotal} {shoppingTotal === 1 ? 'item pendente' : 'itens pendentes'}
            </p>
            <Dialog open={isShopOpen} onOpenChange={setIsShopOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Item</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleShopSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="shop-name">Nome do Item</Label>
                    <Input
                      id="shop-name"
                      value={shopFormData.name}
                      onChange={(e) => setShopFormData({ name: e.target.value })}
                      placeholder="Ex: Arroz 5kg"
                    />
                  </div>
                  <Button type="submit" className="w-full">Adicionar</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            {shopping.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleShopItem(item.id)}
                  />
                  <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                    {item.name}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteShopItem(item.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Lists;
