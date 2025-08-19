import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart3, 
  CreditCard, 
  Users, 
  Activity, 
  Zap,
  Crown,
  Infinity,
  Gift
} from 'lucide-react';

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-48"></div>
          <div className="h-4 bg-muted rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const getProgressPercentage = () => {
    if (!profile) return 0;
    return (profile.api_requests_today / profile.api_requests_limit) * 100;
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'freemium': return <Gift className="h-5 w-5" />;
      case 'basic': return <Zap className="h-5 w-5" />;
      case 'premium': return <Crown className="h-5 w-5" />;
      case 'unlimited': return <Infinity className="h-5 w-5" />;
      default: return <Gift className="h-5 w-5" />;
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'freemium': return 'Freemium 🆓';
      case 'basic': return 'Basic 💡';
      case 'premium': return 'Premium 🌟';
      case 'unlimited': return 'Unlimited ♾️';
      default: return 'Freemium 🆓';
    }
  };

  const getPlanPrice = (plan: string) => {
    switch (plan) {
      case 'freemium': return 'Grátis';
      case 'basic': return 'R$ 19,90/mês';
      case 'premium': return 'R$ 59,90/mês';
      case 'unlimited': return 'R$ 199,90/mês';
      default: return 'Grátis';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Bem-vindo de volta, {profile?.full_name || user.email}!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Plano Atual</CardTitle>
                {getPlanIcon(profile?.plan || 'freemium')}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getPlanLabel(profile?.plan || 'freemium')}</div>
                <p className="text-xs text-muted-foreground">
                  {getPlanPrice(profile?.plan || 'freemium')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Requisições Hoje</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profile?.api_requests_today || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  de {profile?.api_requests_limit || 100} disponíveis
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Limite Diário</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profile?.api_requests_limit === -1 ? '∞' : profile?.api_requests_limit || 100}
                </div>
                <p className="text-xs text-muted-foreground">
                  requisições por dia
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status da Conta</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Badge variant="outline" className="text-sm">
                    Ativa
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Desde {new Date(profile?.created_at || '').toLocaleDateString('pt-BR')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Usage Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Uso da API Hoje</CardTitle>
                <CardDescription>
                  Acompanhe o uso das suas requisições diárias
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Requisições utilizadas</span>
                    <span>
                      {profile?.api_requests_today || 0} / {profile?.api_requests_limit === -1 ? '∞' : profile?.api_requests_limit || 100}
                    </span>
                  </div>
                  <Progress 
                    value={profile?.api_requests_limit === -1 ? 0 : getProgressPercentage()} 
                    className="h-2"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {profile?.api_requests_limit === -1 
                    ? 'Requisições ilimitadas no seu plano'
                    : `${((profile?.api_requests_limit || 100) - (profile?.api_requests_today || 0))} requisições restantes hoje`
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upgrade de Plano</CardTitle>
                <CardDescription>
                  Precisa de mais requisições? Faça upgrade do seu plano
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    Plano atual: <Badge variant="outline">{getPlanLabel(profile?.plan || 'freemium')}</Badge>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Explore nossos planos para ter acesso a mais requisições e recursos avançados.
                  </p>
                </div>
                <Button 
                  className="w-full bg-vexpro-gradient hover:opacity-90"
                  onClick={() => navigate('/chat')}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Ver Planos
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Acesse rapidamente as principais funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col space-y-2"
                  onClick={() => navigate('/chat')}
                >
                  <Activity className="h-6 w-6" />
                  <span>Acessar Chat</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col space-y-2"
                  onClick={() => navigate('/developers')}
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>Documentação</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col space-y-2"
                  onClick={() => navigate('/chat')}
                >
                  <CreditCard className="h-6 w-6" />
                  <span>Gerenciar Plano</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;