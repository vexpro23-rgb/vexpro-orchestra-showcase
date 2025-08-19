import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageSquare, 
  Bot, 
  PenTool, 
  BarChart3, 
  Briefcase, 
  GraduationCap,
  ShoppingCart,
  Stethoscope,
  Code,
  Newspaper,
  Music,
  Camera
} from 'lucide-react';

const Applications = () => {
  const applications = [
    {
      icon: MessageSquare,
      title: 'Chatbots Inteligentes',
      description: 'Crie assistentes virtuais personalizados para atendimento ao cliente, suporte técnico ou vendas com nossa API de conversação avançada.',
      examples: ['Suporte 24/7', 'Vendas automatizadas', 'FAQ dinâmico']
    },
    {
      icon: PenTool,
      title: 'Geração de Conteúdo',
      description: 'Automatize a criação de textos, artigos, posts para redes sociais e materiais de marketing com IA de última geração.',
      examples: ['Blog posts', 'Descrições de produtos', 'E-mail marketing']
    },
    {
      icon: BarChart3,
      title: 'Análise de Dados',
      description: 'Processe e analise grandes volumes de dados, gere insights e relatórios automatizados para tomada de decisões.',
      examples: ['Relatórios financeiros', 'Análise de sentimentos', 'Previsões de mercado']
    },
    {
      icon: GraduationCap,
      title: 'Plataformas Educacionais',
      description: 'Desenvolva tutores virtuais, sistemas de avaliação automática e conteúdo educacional personalizado.',
      examples: ['Tutoria personalizada', 'Correção automática', 'Planos de estudo']
    },
    {
      icon: Briefcase,
      title: 'Automação Empresarial',
      description: 'Otimize processos internos, automatize workflows e integre IA em sistemas corporativos existentes.',
      examples: ['Análise de documentos', 'Classificação automática', 'Gestão de tarefas']
    },
    {
      icon: ShoppingCart,
      title: 'E-commerce Inteligente',
      description: 'Implemente recomendações personalizadas, assistentes de compra e otimização de catálogos de produtos.',
      examples: ['Recomendações de produtos', 'Busca inteligente', 'Atendimento virtual']
    },
    {
      icon: Stethoscope,
      title: 'Soluções em Saúde',
      description: 'Desenvolva assistentes médicos, sistemas de triagem e análise de dados clínicos (sempre com supervisão profissional).',
      examples: ['Triagem de sintomas', 'Análise de exames', 'Lembretes de medicação']
    },
    {
      icon: Code,
      title: 'Assistência em Programação',
      description: 'Crie ferramentas de code review, geração de documentação e assistentes de desenvolvimento.',
      examples: ['Review de código', 'Geração de docs', 'Debug assistido']
    },
    {
      icon: Newspaper,
      title: 'Mídia e Jornalismo',
      description: 'Automatize a curadoria de notícias, geração de resumos e análise de tendências em tempo real.',
      examples: ['Resumos de notícias', 'Análise de trends', 'Fact-checking']
    },
    {
      icon: Music,
      title: 'Entretenimento',
      description: 'Desenvolva sistemas de recomendação de conteúdo, assistentes criativos e experiências interativas.',
      examples: ['Playlists personalizadas', 'Roteiros interativos', 'Jogos narrativos']
    },
    {
      icon: Camera,
      title: 'Análise Visual',
      description: 'Integre capacidades de reconhecimento de imagem, análise de vídeo e processamento visual.',
      examples: ['Reconhecimento facial', 'Análise de produtos', 'Moderação de conteúdo']
    },
    {
      icon: Bot,
      title: 'IoT e Automação',
      description: 'Conecte dispositivos inteligentes com capacidades de IA para criar experiências mais intuitivas.',
      examples: ['Casa inteligente', 'Manutenção preditiva', 'Otimização energética']
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Aplicações Possíveis com Nossa API
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubra as infinitas possibilidades de integrar inteligência artificial em seus projetos. 
            Nossa API versatil permite criar soluções inovadoras em diversos setores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {applications.map((app, index) => {
            const IconComponent = app.icon;
            return (
              <Card 
                key={index} 
                className="h-full hover:shadow-lg transition-shadow duration-300 border-border/50 hover:border-primary/20"
              >
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 rounded-lg bg-vexpro-gradient">
                      <IconComponent className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{app.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {app.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Exemplos de uso:</h4>
                    <ul className="space-y-1">
                      {app.examples.map((example, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="bg-card border border-border rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Pronto para Começar?</h3>
            <p className="text-muted-foreground mb-6">
              Nossa API foi projetada para ser flexível e fácil de integrar. 
              Com documentação completa e suporte dedicado, você pode começar a desenvolver em minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/developers" className="inline-block">
                <button className="px-6 py-3 bg-vexpro-gradient text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Documentação da API
                </button>
              </a>
              <a href="/auth" className="inline-block">
                <button className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-secondary transition-colors">
                  Criar Conta Gratuita
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Applications;