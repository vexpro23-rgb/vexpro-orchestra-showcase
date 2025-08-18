import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    // Simulate loading chat history from API
    // In real implementation, this would fetch from your API using the authenticated user's ID
    const loadChatHistory = async () => {
      // Simulated history for demo
      const demoHistory: Message[] = [
        {
          id: "1",
          content: "Olá! Bem-vindo de volta ao Vexpro AI Central. Como posso ajudá-lo hoje?",
          isUser: false,
          timestamp: new Date(Date.now() - 3600000) // 1 hour ago
        }
      ];
      setMessages(demoHistory);
    };

    loadChatHistory();
  }, []);

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
      // In real implementation, send authenticated user's ID
      const response = await fetch("http://18.230.116.139:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage.content,
          user_id: "authenticated_user_123" // Replace with actual user ID
        })
      });

      const data = await response.json();
      
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
    "Resuma as notícias de IA da semana",
    "Qual a previsão do tempo para Itajaí amanhã?",
    "Crie uma introdução para um artigo sobre machine learning",
    "Explique como funciona a orquestração de APIs",
    "Quais são as tendências em inteligência artificial para 2024?"
  ];

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

          {/* Input Area */}
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
                        onClick={() => setInput(question)}
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
        </div>
      </div>
    </div>
  );
};

export default Chat;