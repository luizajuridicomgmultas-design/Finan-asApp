import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Mail, MessageCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Subscription = ({ subscription }) => {
  const { toast } = useToast();

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'expired': return 'text-red-500';
      case 'blocked': return 'text-orange-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'expired': return 'Expirada';
      case 'blocked': return 'Bloqueada';
      default: return 'Desconhecido';
    }
  };

  const handleRenewWhatsApp = () => {
    toast({
      title: "🚧 Este recurso não está implementado",
      description: "Você pode solicitar em seu próximo prompt! 🚀"
    });
  };

  const handleRenewEmail = () => {
    toast({
      title: "🚧 Este recurso não está implementado",
      description: "Você pode solicitar em seu próximo prompt! 🚀"
    });
  };

  if (!subscription) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Crown className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Nenhuma assinatura ativa</h2>
          <p className="text-muted-foreground">Você ainda não possui uma assinatura</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assinatura</h1>
        <p className="text-muted-foreground">Gerencie sua assinatura</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Crown className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Status da Assinatura</h2>
              <p className={`font-semibold ${getStatusColor(subscription.status)}`}>
                {getStatusText(subscription.status)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between p-3 bg-accent rounded-lg">
              <span className="text-muted-foreground">Tipo de Plano</span>
              <span className="font-semibold capitalize">
                {subscription.planType === 'monthly' ? 'Mensal' : subscription.planType === 'quarterly' ? 'Trimestral' : 'Único'}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-accent rounded-lg">
              <span className="text-muted-foreground">Dias até renovação</span>
              <span className="font-semibold">{subscription.daysUntilRenewal} dias</span>
            </div>
            <div className="flex justify-between p-3 bg-accent rounded-lg">
              <span className="text-muted-foreground">Email cadastrado</span>
              <span className="font-semibold">{subscription.email}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button className="w-full gap-2" onClick={handleRenewWhatsApp}>
              <MessageCircle className="w-4 h-4" />
              Renovar via WhatsApp
            </Button>
            <Button variant="outline" className="w-full gap-2" onClick={handleRenewEmail}>
              <Mail className="w-4 h-4" />
              Renovar via Email
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Benefícios da Assinatura</h2>
          <div className="space-y-3">
            {subscription.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Subscription;
