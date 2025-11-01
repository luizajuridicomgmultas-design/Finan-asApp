export function initializeDefaultData() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return {
    accounts: [
      {
        id: '1',
        name: 'Nubank',
        type: 'debit',
        balance: 2450.00,
        color: '#8A05BE'
      },
      {
        id: '2',
        name: 'Poupança Caixa',
        type: 'savings',
        balance: 5800.00,
        color: '#0066CC'
      },
      {
        id: '3',
        name: 'Cartão de Crédito',
        type: 'credit',
        balance: -850.00,
        limit: 3000.00,
        color: '#FF6B00'
      },
      {
        id: '4',
        name: 'Dinheiro',
        type: 'cash',
        balance: 320.00,
        color: '#00A86B'
      }
    ],
    categories: [
      { id: '1', name: 'Salário', color: '#00A86B', type: 'income' },
      { id: '2', name: 'Freelance', color: '#0066CC', type: 'income' },
      { id: '3', name: 'Alimentação', color: '#FF6B00', type: 'expense' },
      { id: '4', name: 'Transporte', color: '#8A05BE', type: 'expense' },
      { id: '5', name: 'Saúde', color: '#DC143C', type: 'expense' },
      { id: '6', name: 'Lazer', color: '#FFD700', type: 'expense' },
      { id: '7', name: 'Educação', color: '#4169E1', type: 'expense' },
      { id: '8', name: 'Moradia', color: '#8B4513', type: 'expense' },
      { id: '9', name: 'Vestuário', color: '#FF1493', type: 'expense' },
      { id: '10', name: 'Investimentos', color: '#228B22', type: 'expense' },
      { id: '11', name: 'Assinaturas', color: '#9370DB', type: 'expense' },
      { id: '12', name: 'Presentes', color: '#FF69B4', type: 'expense' },
      { id: '13', name: 'Pets', color: '#CD853F', type: 'expense' },
      { id: '14', name: 'Outros', color: '#708090', type: 'expense' }
    ],
    transactions: [
      {
        id: '1',
        description: 'Salário Mensal',
        amount: 4500.00,
        type: 'income',
        categoryId: '1',
        accountId: '1',
        date: new Date(currentYear, currentMonth, 5).toISOString()
      },
      {
        id: '2',
        description: 'Supermercado',
        amount: -320.50,
        type: 'expense',
        categoryId: '3',
        accountId: '1',
        date: new Date(currentYear, currentMonth, 10).toISOString()
      },
      {
        id: '3',
        description: 'Uber',
        amount: -45.00,
        type: 'expense',
        categoryId: '4',
        accountId: '1',
        date: new Date(currentYear, currentMonth, 12).toISOString()
      },
      {
        id: '4',
        description: 'Netflix',
        amount: -39.90,
        type: 'expense',
        categoryId: '11',
        accountId: '3',
        date: new Date(currentYear, currentMonth, 15).toISOString()
      },
      {
        id: '5',
        description: 'Freelance Design',
        amount: 800.00,
        type: 'income',
        categoryId: '2',
        accountId: '1',
        date: new Date(currentYear, currentMonth, 18).toISOString()
      }
    ],
    wishlist: [
      {
        id: '1',
        name: 'Tênis Nike Air Max',
        price: 599.90,
        store: 'Nike Store',
        shipping: 0,
        priority: 'high',
        estimatedDate: new Date(currentYear, currentMonth + 1, 15).toISOString(),
        link: 'https://www.nike.com.br'
      },
      {
        id: '2',
        name: 'Livro "Pai Rico, Pai Pobre"',
        price: 45.00,
        store: 'Amazon',
        shipping: 15.00,
        priority: 'medium',
        estimatedDate: new Date(currentYear, currentMonth, 25).toISOString(),
        link: 'https://www.amazon.com.br'
      }
    ],
    shopping: [
      { id: '1', name: 'Arroz 5kg', completed: false },
      { id: '2', name: 'Feijão 1kg', completed: false },
      { id: '3', name: 'Café 500g', completed: true },
      { id: '4', name: 'Leite integral', completed: false }
    ],
    tasks: [
      {
        id: '1',
        title: 'Pagar conta de luz',
        dueDate: new Date(currentYear, currentMonth, 20).toISOString(),
        priority: 'high',
        category: 'Pessoal',
        completed: false
      },
      {
        id: '2',
        title: 'Reunião com cliente',
        dueDate: new Date(currentYear, currentMonth, 22).toISOString(),
        priority: 'high',
        category: 'Trabalho',
        completed: false
      },
      {
        id: '3',
        title: 'Comprar presente aniversário',
        dueDate: new Date(currentYear, currentMonth, 28).toISOString(),
        priority: 'medium',
        category: 'Pessoal',
        completed: false
      }
    ],
    subscription: {
      status: 'active',
      daysUntilRenewal: 15,
      planType: 'monthly',
      email: 'usuario@email.com',
      benefits: [
        'Backup automático na nuvem',
        'Relatórios avançados',
        'Suporte prioritário',
        'Sem anúncios',
        'Exportação de dados'
      ]
    }
  };
}
