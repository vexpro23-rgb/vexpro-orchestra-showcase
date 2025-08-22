import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Code,
  BookOpen,
  Zap,
  Shield,
  Globe,
  MessageSquare,
  Copy,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Documentation = () => {
  const { toast } = useToast();

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Código copiado!",
      description: "O código foi copiado para a área de transferência."
    });
  };

  const codeExamples = {
    curl: `curl -X POST 'https://api.vexpro.com.br/v1/chat' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "model": "gpt-4",
    "messages": [
      {
        "role": "user",
        "content": "Olá, como você pode me ajudar?"
      }
    ],
    "max_tokens": 1000,
    "temperature": 0.7
  }'`,
    javascript: `const response = await fetch('https://api.vexpro.com.br/v1/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [
      {
        role: 'user',
        content: 'Olá, como você pode me ajudar?'
      }
    ],
    max_tokens: 1000,
    temperature: 0.7
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);`,
    python: `import requests

url = "https://api.vexpro.com.br/v1/chat"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "model": "gpt-4",
    "messages": [
        {
            "role": "user",
            "content": "Olá, como você pode me ajudar?"
        }
    ],
    "max_tokens": 1000,
    "temperature": 0.7
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result["choices"][0]["message"]["content"])`
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <BookOpen className="h-4 w-4 mr-2" />
              Documentação da API
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Documentação <span className="bg-vexpro-gradient bg-clip-text text-transparent">Vexpro AI</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Integre facilmente nossa API de IA em seus projetos. Documentação completa, exemplos práticos e suporte dedicado.
            </p>
          </div>

          {/* Quick Start */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Início Rápido
              </CardTitle>
              <CardDescription>
                Comece a usar nossa API em poucos minutos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h3 className="font-medium mb-1">Obtenha sua API Key</h3>
                  <p className="text-sm text-muted-foreground">Acesse seu dashboard e copie sua chave de API</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h3 className="font-medium mb-1">Faça sua primeira requisição</h3>
                  <p className="text-sm text-muted-foreground">Use os exemplos abaixo para testar a API</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h3 className="font-medium mb-1">Integre em seu projeto</h3>
                  <p className="text-sm text-muted-foreground">Implemente a IA em sua aplicação</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Endpoints */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Endpoints da API
              </CardTitle>
              <CardDescription>
                Principais endpoints disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">POST</Badge>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">/v1/chat</code>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Envie mensagens para os modelos de IA e receba respostas inteligentes
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">GET</Badge>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">/v1/models</code>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lista todos os modelos de IA disponíveis na plataforma
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">GET</Badge>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">/v1/usage</code>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Consulte o uso atual da sua API e limites disponíveis
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Examples */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="h-5 w-5 mr-2" />
                Exemplos de Código
              </CardTitle>
              <CardDescription>
                Exemplos práticos em diferentes linguagens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* cURL Example */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">cURL</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyCode(codeExamples.curl)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples.curl}</code>
                </pre>
              </div>

              {/* JavaScript Example */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">JavaScript</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyCode(codeExamples.javascript)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples.javascript}</code>
                </pre>
              </div>

              {/* Python Example */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Python</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyCode(codeExamples.python)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples.python}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Security & Best Practices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Mantenha sua API key segura e privada</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Use HTTPS em todas as requisições</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Nunca exponha a chave no frontend</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Monitore o uso da sua API regularmente</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Suporte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Precisa de ajuda? Nossa equipe está aqui para você.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir Ticket de Suporte
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat ao Vivo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <Card>
            <CardContent className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
              <p className="text-muted-foreground mb-6">
                Acesse seu dashboard para obter sua API key e começar a integrar nossa IA em seus projetos.
              </p>
              <Button className="bg-vexpro-gradient hover:opacity-90">
                <ArrowRight className="h-4 w-4 mr-2" />
                Ir para Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Documentation;