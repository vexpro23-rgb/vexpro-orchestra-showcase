import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, Crown, Infinity, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

interface Plan {
  id: string;
  name: string;
  display_name: string;
  description: string;
  price: number;
  currency: string;
  daily_limit: number;
  features: any; // Changed from string[] to any to handle Json from database
  is_active: boolean;
}

const Pricing = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os planos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: Plan) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para continuar com a compra.",
        variant: "destructive",
      });
      return;
    }

    if (plan.name === 'freemium') {
      toast({
        title: "Plano atual",
        description: "Você já está no plano gratuito!",
      });
      return;
    }

    setProcessingPlan(plan.id);

    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          plan_id: plan.id,
          plan_name: plan.name,
          amount: plan.price,
          billing_type: 'BOLETO' // Default to boleto, can be extended later
        }
      });

      if (error) throw error;

      if (data?.payment_url) {
        // Open payment in new tab
        window.open(data.payment_url, '_blank');
        
        toast({
          title: "Pagamento criado",
          description: "O boleto foi gerado. Complete o pagamento para ativar seu plano.",
        });
      }
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível processar o pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setProcessingPlan(null);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'freemium': return <Zap className="h-6 w-6" />;
      case 'basic': return <CheckCircle className="h-6 w-6" />;
      case 'pro': return <Crown className="h-6 w-6" />;
      case 'unlimited': return <Infinity className="h-6 w-6" />;
      default: return <Star className="h-6 w-6" />;
    }
  };

  const isPlanActive = (planName: string) => {
    return profile?.plan === planName;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatLimit = (limit: number) => {
    if (limit >= 999999) return 'Ilimitadas';
    return new Intl.NumberFormat('pt-BR').format(limit);
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen pt-20 px-4 bg-vexpro-gradient-subtle">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando planos...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-20 px-4 bg-vexpro-gradient-subtle">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold mb-4 bg-vexpro-gradient bg-clip-text text-transparent">
              Escolha seu plano
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Potencialize seu trabalho com nossa IA. Escolha o plano ideal para suas necessidades.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-16">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-vexpro-glow ${
                  plan.name === 'pro' ? 'border-primary shadow-vexpro-glow scale-105' : ''
                } ${isPlanActive(plan.name) ? 'ring-2 ring-primary' : ''}`}
              >
                {plan.name === 'pro' && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                
                {isPlanActive(plan.name) && (
                  <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-br-lg">
                    ATUAL
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4 p-3 rounded-full bg-primary/10">
                    {getPlanIcon(plan.name)}
                  </div>
                  <CardTitle className="text-xl mb-2">{plan.display_name}</CardTitle>
                  <CardDescription className="mb-4">{plan.description}</CardDescription>
                  <div className="text-center">
                    <span className="text-3xl font-bold">
                      {plan.price === 0 ? 'Grátis' : formatPrice(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/mês</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                      <span className="text-sm">Consultas diárias</span>
                      <Badge variant="secondary" className="ml-2">
                        {formatLimit(plan.daily_limit)}
                      </Badge>
                    </div>
                    
                    {(Array.isArray(plan.features) ? plan.features : []).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-6">
                  <Button
                    className="w-full"
                    variant={plan.name === 'pro' ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan)}
                    disabled={processingPlan === plan.id || isPlanActive(plan.name)}
                  >
                    {processingPlan === plan.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Processando...
                      </>
                    ) : isPlanActive(plan.name) ? (
                      'Plano Atual'
                    ) : plan.price === 0 ? (
                      'Plano Gratuito'
                    ) : (
                      'Assinar Agora'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="text-center py-16 border-t border-border">
            <h2 className="text-2xl font-bold mb-8">Perguntas Frequentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div>
                <h3 className="font-semibold mb-2">Como funciona o limite diário?</h3>
                <p className="text-muted-foreground text-sm">
                  Cada consulta à IA conta para seu limite diário. O limite é renovado automaticamente a cada 24 horas.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h3>
                <p className="text-muted-foreground text-sm">
                  Sim, você pode cancelar seu plano a qualquer momento sem taxas adicionais.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Como faço o pagamento?</h3>
                <p className="text-muted-foreground text-sm">
                  Aceitamos boleto bancário e PIX. O pagamento é processado de forma segura pelo Asaas.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Existe suporte técnico?</h3>
                <p className="text-muted-foreground text-sm">
                  Sim, oferecemos suporte por email para todos os planos, com atendimento prioritário para planos pagos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;