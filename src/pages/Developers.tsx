import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Zap, 
  Globe, 
  Brain, 
  Shield, 
  Clock, 
  ArrowRight, 
  Copy,
  ExternalLink
} from "lucide-react";

const Developers = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const codeExample = `// Exemplo de integração com Vexpro AI Central
const response = await fetch('http://18.230.116.139:8000/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    question: 'Qual é a previsão do tempo hoje?',
    user_id: 'user_123',
    context: 'weather_query'
  })
});

const data = await response.json();
console.log(data.answer);`;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-8 mb-16">
              <div className="animate-fade-in">
                <Badge variant="outline" className="px-4 py-2 text-sm font-medium mb-4">
                  API Documentation
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="bg-vexpro-gradient bg-clip-text text-transparent">
                    Vexpro AI Central
                  </span>
                  <br />
                  <span className="text-foreground">
                    Para Desenvolvedores
                  </span>
                </h1>
              </div>
              
              <div className="animate-slide-up max-w-3xl mx-auto">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Uma API robusta e modular que orquestra múltiplos modelos de linguagem 
                  para oferecer respostas inteligentes e contextualmente relevantes.
                </p>
              </div>

              <div className="animate-slide-up">
                <Button size="lg" className="bg-vexpro-gradient hover:opacity-90 transition-opacity">
                  Obter Chave de API
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Recursos Principais</h2>
              <p className="text-muted-foreground text-lg">
                Tecnologia de ponta para suas aplicações
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-vexpro-gradient rounded-lg flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>Orquestração de Modelos</CardTitle>
                  <CardDescription>
                    Fallback automático entre Gemini, Groq, Cohere e OpenAI para garantir 
                    alta disponibilidade e qualidade nas respostas.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-vexpro-gradient rounded-lg flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>Inteligência Contextual</CardTitle>
                  <CardDescription>
                    Sistema de cache avançado que mantém o contexto das conversas, 
                    permitindo respostas mais precisas e relevantes.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-vexpro-gradient rounded-lg flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>Busca Inteligente</CardTitle>
                  <CardDescription>
                    Capacidade nativa de buscar informações atualizadas na web 
                    para enriquecer as respostas com dados em tempo real.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-vexpro-gradient rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>Alta Performance</CardTitle>
                  <CardDescription>
                    Otimizada para resposta rápida com processamento paralelo 
                    e cache inteligente para reduzir latência.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-vexpro-gradient rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>Segurança Avançada</CardTitle>
                  <CardDescription>
                    Autenticação robusta, rate limiting e validação de entrada 
                    para proteger sua aplicação e dados.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-vexpro-gradient rounded-lg flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>Fácil Integração</CardTitle>
                  <CardDescription>
                    REST API simples com SDKs em múltiplas linguagens 
                    e documentação completa para integração rápida.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Code Example */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Exemplo de Integração</h2>
              <p className="text-muted-foreground text-lg">
                Comece a usar nossa API em minutos
              </p>
            </div>

            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Requisição de Exemplo</CardTitle>
                  <CardDescription>
                    JavaScript/TypeScript - Integração básica
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(codeExample)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="bg-secondary/50 p-4 rounded-lg overflow-x-auto text-sm">
                  <code className="text-foreground">{codeExample}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* API Access */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Pronto para Começar?</h2>
                <p className="text-muted-foreground text-lg">
                  Obtenha sua chave de API e comece a integrar hoje mesmo
                </p>
              </div>

              <Card className="border-border bg-card/50 backdrop-blur-sm p-8">
                <div className="text-center space-y-6">
                  <div className="mx-auto w-16 h-16 bg-vexpro-gradient rounded-full flex items-center justify-center">
                    <Code className="h-8 w-8 text-primary-foreground" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Obter Chave de API</h3>
                    <p className="text-muted-foreground">
                      Em breve: Crie sua conta de desenvolvedor para obter sua chave de API 
                      e integrar a Vexpro AI em seus projetos.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <Input 
                      placeholder="seu-email@exemplo.com" 
                      className="flex-1"
                    />
                    <Button className="bg-vexpro-gradient hover:opacity-90 transition-opacity">
                      Notificar-me
                    </Button>
                  </div>

                  <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      <span>Documentação</span>
                    </div>
                    <div className="flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      <span>SDKs</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      <span>Suporte 24/7</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Developers;