import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, KeyRound, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { supabase } from '../lib/customSupabaseClient';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WelcomeScreen = ({ onNext }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center text-center p-8 h-full"
  >
    <Sparkles className="w-16 h-16 text-primary mb-4" />
    <h1 className="text-4xl font-bold mb-2">Bem-vindo ao Finanças Plus!</h1>
    <p className="text-xl text-muted-foreground mb-8 max-w-md">
      Sua jornada para a liberdade financeira começa agora.
    </p>
    <Button size="lg" onClick={onNext}>
      Começar <ArrowRight className="w-4 h-4 ml-2" />
    </Button>
  </motion.div>
);

const RegisterScreen = ({ onNext }) => {
  const [name, setName] = useLocalStorage('user_name', '');
  const [email, setEmail] = useLocalStorage('user_email', '');
  const [confirmEmail, setConfirmEmail] = useState(email);
  const { toast } = useToast();

  const handleNext = () => {
    if (!name || !email || !confirmEmail) {
      toast({ title: "Erro", description: "Por favor, preencha todos os campos.", variant: "destructive" });
      return;
    }
    if (email !== confirmEmail) {
      toast({ title: "Erro", description: "Os e-mails não correspondem.", variant: "destructive" });
      return;
    }
    onNext({ name, email });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col items-center justify-center p-8 h-full"
    >
      <h1 className="text-3xl font-bold mb-2">Crie sua conta</h1>
      <p className="text-muted-foreground mb-8">É rápido e fácil.</p>
      <div className="w-full max-w-sm space-y-4">
        <div>
          <Label htmlFor="name">Seu Nome</Label>
          <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="email">Seu E-mail</Label>
          <Input id="email" type="email" placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="confirm-email">Confirme seu E-mail</Label>
          <Input id="confirm-email" type="email" placeholder="voce@email.com" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} />
        </div>
        <Button size="lg" className="w-full" onClick={handleNext}>
          Continuar <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

const ActivationScreen = ({ onActivate }) => {
  const [code, setCode] = useLocalStorage('user_code', '');
  const [loading, setLoading] = useState(false);
  const [email] = useLocalStorage('user_email', '');
  const { toast } = useToast();

  const handleActivate = async () => {
    if (!code) {
      toast({ title: "Erro", description: "Por favor, insira um código de ativação.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('codigos_ativacao')
        .select('*')
        .eq('codigo', code.toUpperCase())
        .single();
      
      if (error || !data) {
        toast({ title: "Código Inválido", description: "O código inserido não foi encontrado. Verifique e tente novamente.", variant: "destructive" });
        setLoading(false);
        return;
      }

      if (data.ativo) {
         toast({ title: "Código já utilizado", description: "Este código de ativação já foi vinculado a uma conta.", variant: "destructive" });
         setLoading(false);
         return;
      }
      
      const today = new Date();
      today.setHours(0,0,0,0);
      const expiryDate = new Date(data.data_expira);

      if (expiryDate < today) {
        toast({ title: "Código Expirado", description: "Este código de ativação não é mais válido.", variant: "destructive" });
        setLoading(false);
        return;
      }

      // Update code as used
      const { error: updateError } = await supabase
        .from('codigos_ativacao')
        .update({ ativo: true, email: email })
        .eq('id', data.id);

      if (updateError) {
        toast({ title: "Erro ao ativar", description: "Ocorreu um erro ao atualizar seu código. Tente novamente.", variant: "destructive" });
        setLoading(false);
        return;
      }
      
      onActivate(data.plano, data.data_expira, email);

    } catch (err) {
      toast({ title: "Erro de Conexão", description: "Não foi possível conectar ao servidor. Verifique sua internet.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col items-center justify-center p-8 h-full text-center"
    >
      <KeyRound className="w-16 h-16 text-primary mb-4" />
      <h1 className="text-3xl font-bold mb-2">Ativar Assinatura</h1>
      <p className="text-muted-foreground mb-8 max-w-sm">
        Digite aqui o código de ativação que você recebeu após a compra. Seu plano será liberado automaticamente.
      </p>
      <div className="w-full max-w-sm space-y-4">
        <Input
          placeholder="SEU-CODIGO-AQUI"
          className="text-center text-lg h-12 tracking-widest"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          disabled={loading}
        />
        <Button size="lg" className="w-full" onClick={handleActivate} disabled={loading}>
          {loading ? 'Verificando...' : 'Ativar'}
        </Button>
        <div className="text-sm text-muted-foreground mt-4 space-y-2">
            <a href="#" className="text-primary hover:underline">
            Ainda não tem um código? Clique aqui para comprar
            </a>
            <p>Seu código não está ativando? <a href="mailto:suportefinancasplus@gmail.com" className="text-primary hover:underline">Entre em contato</a>.</p>
        </div>
      </div>
    </motion.div>
  );
};

const SuccessScreen = ({ plan, expiry, onFinish }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    className="flex flex-col items-center justify-center p-8 h-full text-center"
  >
    <ShieldCheck className="w-20 h-20 text-green-500 mb-4" />
    <h1 className="text-3xl font-bold mb-2">Ativação Concluída!</h1>
    <p className="text-muted-foreground mb-4">Seu plano foi ativado com sucesso.</p>
    <div className="bg-accent text-accent-foreground rounded-lg p-4 mb-8">
      <p>Plano: <span className="font-bold capitalize">{plan}</span></p>
      <p>Válido até: <span className="font-bold">
        {new Date(new Date(expiry).getTime() + new Date(expiry).getTimezoneOffset() * 60000).toLocaleDateString('pt-BR')}
      </span></p>
    </div>
    <Button size="lg" onClick={onFinish}>
      Acessar o App <Sparkles className="w-4 h-4 ml-2" />
    </Button>
  </motion.div>
);


const ActivationFlow = ({ onActivationSuccess }) => {
  const [step, setStep] = useState('welcome'); // welcome, register, activate, success
  const [userData, setUserData] = useState(null);
  const [planData, setPlanData] = useState({ plan: null, expiry: null, email: null });

  const handleWelcomeNext = () => setStep('register');
  const handleRegisterNext = (data) => {
    setUserData(data);
    setStep('activate');
  };
  const handleActivation = (activatedPlan, expiryDate, email) => {
    setPlanData({ plan: activatedPlan, expiry: expiryDate, email: email });
    setStep('success');
  };
  const handleFinish = () => {
    if (planData.plan) {
      onActivationSuccess(planData.plan, planData.expiry, planData.email);
    }
  };

  return (
    <div className="h-screen w-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'welcome' && <WelcomeScreen key="welcome" onNext={handleWelcomeNext} />}
        {step === 'register' && <RegisterScreen key="register" onNext={handleRegisterNext} />}
        {step === 'activate' && <ActivationScreen key="activate" onActivate={handleActivation} />}
        {step === 'success' && <SuccessScreen key="success" plan={planData.plan} expiry={planData.expiry} onFinish={handleFinish} />}
      </AnimatePresence>
    </div>
  );
};

export default ActivationFlow;
