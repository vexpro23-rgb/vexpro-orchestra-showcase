import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Loader2, Sparkles, Gift, Zap, Crown, Infinity, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const { user, profile, apiKeyData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('chat_history')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: true })
          .limit(50);

        if (error) {
          console.error('Error loading chat history:', error);
          // Show welcome message if no history
          setMessages([{
            id: "1",
            content: "Olá! Bem-vindo de volta ao Vexpro AI Central. Como posso ajudá-lo hoje?",
            isUser: false,
            timestamp: new Date()
          }]);
          return;
        }

        if (data && data.length > 0) {
          const chatMessages: Message[] = data.map(msg => ({
            id: msg.id,
            content: msg.message,
            isUser: msg.role === 'user',
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(chatMessages);
        } else {
          // Show welcome message if no history
          setMessages([{
            id: "1",
            content: "Olá! Bem-vindo de volta ao Vexpro AI Central. Como posso ajudá-lo hoje?",
            isUser: false,
            timestamp: new Date()
          }]);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadChatHistory();
  }, [user]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get user session for authorization
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      // Call our edge function which will handle API key and external API communication
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { question: userMessage.content },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        throw error;
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer || "Desculpe, não consegui processar sua pergunta no momento. Tente novamente.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Erro ao conectar com a Vexpro AI Central. Verifique sua conexão e tente novamente.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "Ver planos de API",
    "Qual a previsão do tempo para Itajaí amanhã?",
    "Crie uma introdução para um artigo sobre machine learning",
    "Explique como funciona a orquestração de APIs",
    "Quais são as tendências em inteligência artificial para 2024?"
  ];

  const plans = [
    {
      id: 'freemium',
      name: 'Plano Freemium 🆓',
      price: 'Grátis',
      requests: '100 requisições por dia',
      description: 'O plano de entrada, perfeito para quem quer experimentar a API sem custos. Ideal para testes e pequenos projetos.',
      features: [
        'Acesso aos modelos mais eficientes em custo',
        'Documentação e comunidade',
        '100 requisições diárias'
      ],
      icon: Gift,
      popular: false
    },
    {
      id: 'basic',
      name: 'Plano Basic 💡',
      price: 'R$ 19,90/mês',
      requests: '1.000 requisições por dia',
      description: 'Um plano acessível para desenvolvedores e pequenos negócios que precisam de um volume maior de interações diárias com a IA.',
      features: [
        'Modelos do plano Freemium + opções adicionais',
        'Suporte por e-mail padrão',
        '1.000 requisições diárias'
      ],
      icon: Zap,
      popular: false
    },
    {
      id: 'premium',
      name: 'Plano Premium 🌟',
      price: 'R$ 59,90/mês',
      requests: '10.000 requisições por dia',
      description: 'Nosso plano mais recomendado para empresas e aplicações em crescimento, com um volume robusto de requisições e acesso a uma gama completa de modelos.',
      features: [
        'Acesso a todos os modelos (Groq, Gemini, Cohere, OpenAI)',
        'Suporte por e-mail e chat prioritários',
        'Acesso total a ferramentas como busca na web',
        '10.000 requisições diárias'
      ],
      icon: Crown,
      popular: true
    },
    {
      id: 'unlimited',
      name: 'Plano Unlimited ♾️',
      price: 'R$ 199,90/mês',
      requests: 'Requisições ilimitadas',
      description: 'Para grandes corporações e projetos que demandam uso irrestrito da API, alta disponibilidade e suporte exclusivo.',
      features: [
        'Acesso prioritário a todos os modelos',
        'Suporte empresarial dedicado e consultoria técnica',
        'Todas as funcionalidades avançadas',
        'Prioridade em novas implementações',
        'Requisições ilimitadas'
      ],
      icon: Infinity,
      popular: false
    }
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16 min-h-screen flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-vexpro-gradient">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Vexpro AI Central</h1>
                <p className="text-sm text-muted-foreground">
                  Chat completo com histórico e funcionalidades avançadas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4">
          {/* Messages */}
          <div className="flex-1 py-6 space-y-6 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-4 ${
                  message.isUser ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className={message.isUser ? "bg-primary" : "bg-secondary"}>
                    {message.isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div
                    className={`p-4 rounded-2xl max-w-[80%] ${
                      message.isUser
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground px-1">
                    {message.timestamp.toLocaleDateString()} às {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-secondary">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="p-4 rounded-2xl bg-secondary text-secondary-foreground max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processando sua pergunta...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Plans Section */}
          {showPlans && (
            <div className="py-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">🚀 Planos de API da Vexpro AI</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPlans(false)}
                  className="text-sm"
                >
                  Voltar ao Chat
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {plans.map((plan) => {
                  const IconComponent = plan.icon;
                  const isCurrentPlan = apiKeyData?.plan_name === plan.id;
                  
                  return (
                    <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground">
                            Mais Popular
                          </Badge>
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-secondary">
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <CardDescription className="text-xl font-bold text-foreground">
                              {plan.price}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {plan.description}
                        </p>
                        
                        <div className="space-y-2">
                          <p className="font-medium text-sm">Limite de Requisições:</p>
                          <p className="text-sm text-muted-foreground">{plan.requests}</p>
                        </div>

                        <div className="space-y-2">
                          <p className="font-medium text-sm">Recursos inclusos:</p>
                          <ul className="space-y-1">
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center space-x-2 text-sm">
                                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button 
                          className={`w-full ${
                            isCurrentPlan 
                              ? 'bg-secondary text-secondary-foreground cursor-default' 
                              : 'bg-vexpro-gradient hover:opacity-90'
                          }`}
                          disabled={isCurrentPlan}
                        >
                          {isCurrentPlan ? 'Plano Atual' : 'Escolher Plano'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Area */}
          {!showPlans && (
            <div className="py-6 border-t border-border bg-background/80 backdrop-blur-sm">
              <div className="space-y-4">
                {/* Suggested Questions */}
                {messages.length <= 1 && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground font-medium">
                      Experimente perguntar:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (question === "Ver planos de API") {
                              setShowPlans(true);
                            } else {
                              setInput(question);
                            }
                          }}
                          className="text-xs whitespace-nowrap"
                          disabled={isLoading}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Digite sua pergunta..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                      disabled={isLoading}
                      className="min-h-[50px] text-base resize-none"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    size="lg"
                    className="bg-vexpro-gradient hover:opacity-90 transition-opacity px-6"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground text-center">
                  A Vexpro AI pode cometer erros. Considere verificar informações importantes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;