import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Zap, Globe, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import ChatDemo from "./ChatDemo";

const Hero = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 mb-16">
            <div className="animate-fade-in">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-vexpro-gradient bg-clip-text text-transparent">
                  Vexpro AI Central
                </span>
                <br />
                <span className="text-foreground">
                  Seu Agente Inteligente,
                </span>
                <br />
                <span className="text-foreground">
                  Orquestrado para Precisão
                </span>
              </h1>
            </div>
            
            <div className="animate-slide-up max-w-3xl mx-auto">
              <p className="text-xl text-muted-foreground leading-relaxed">
                Nossa API inteligente orquestra múltiplos modelos de linguagem avançados 
                (Gemini, Groq, Cohere, OpenAI) para oferecer respostas precisas e conscientes 
                do contexto, com fallback automático e inteligência contextual.
              </p>
            </div>

            <div className="animate-slide-up flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chat">
                <Button size="lg" className="bg-vexpro-gradient hover:opacity-90 transition-opacity">
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Ver Preços
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors">
              <div className="mx-auto w-12 h-12 bg-vexpro-gradient rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Orquestração de Modelos</h3>
              <p className="text-muted-foreground">
                Fallback automático entre múltiplos provedores de IA para garantir disponibilidade e qualidade
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors">
              <div className="mx-auto w-12 h-12 bg-vexpro-gradient rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Inteligência Contextual</h3>
              <p className="text-muted-foreground">
                Sistema de cache inteligente que mantém o contexto das conversas para respostas mais precisas
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors">
              <div className="mx-auto w-12 h-12 bg-vexpro-gradient rounded-lg flex items-center justify-center">
                <Globe className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Busca Inteligente</h3>
              <p className="text-muted-foreground">
                Capacidade de buscar informações atualizadas na web para respostas mais completas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Demo Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Experimente Nossa IA
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Teste gratuitamente nossa API inteligente e veja como ela pode 
              responder suas perguntas com precisão e contexto.
            </p>
          </div>
          
          <ChatDemo />
        </div>
      </section>
    </div>
  );
};

export default Hero;