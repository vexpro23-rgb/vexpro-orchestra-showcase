import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, ArrowRight } from "lucide-react";

const Developers = () => {
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
                  API
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="bg-vexpro-gradient bg-clip-text text-transparent">
                    Vexpro AI Central
                  </span>
                  <br />
                  <span className="text-foreground">
                    API
                  </span>
                </h1>
              </div>
              
              <div className="animate-slide-up max-w-3xl mx-auto">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Acesse nossa poderosa API de inteligência artificial.
                </p>
              </div>

              <div className="animate-slide-up">
                <Button size="lg" className="bg-vexpro-gradient hover:opacity-90 transition-opacity">
                  Acessar API
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* API Info */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-8">
              <Card className="border-border bg-card/50 backdrop-blur-sm p-8">
                <div className="text-center space-y-6">
                  <div className="mx-auto w-16 h-16 bg-vexpro-gradient rounded-full flex items-center justify-center">
                    <Code className="h-8 w-8 text-primary-foreground" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">API em Desenvolvimento</h3>
                    <p className="text-muted-foreground">
                      Nossa API estará disponível em breve com documentação completa 
                      e ferramentas para desenvolvedores.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Button className="bg-vexpro-gradient hover:opacity-90 transition-opacity">
                      Documentação da API
                    </Button>
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