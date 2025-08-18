import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2, Lock } from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatDemo = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const generateUserId = () => {
    return 'demo_' + Math.random().toString(36).substr(2, 9);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || isLocked) return;

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
      // Simulated API call to Vexpro AI Central
      const response = await fetch("http://18.230.116.139:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage.content,
          user_id: generateUserId()
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
      setIsLocked(true); // Lock after first interaction
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
    "Qual é a previsão do tempo para hoje?",
    "Resuma as últimas notícias de tecnologia",
    "Explique o que é inteligência artificial",
    "Como funciona a orquestração de APIs?"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-border bg-card/50 backdrop-blur-sm p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Demonstração Vexpro AI Central</h3>
            <p className="text-sm text-muted-foreground">
              Experimente nossa IA inteligente com orquestração de múltiplos modelos
            </p>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4 min-h-[300px] max-h-[400px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center space-y-3">
                <Bot className="h-12 w-12 text-primary opacity-50" />
                <div>
                  <p className="text-muted-foreground">
                    Olá! Sou o assistente da Vexpro AI Central.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Faça uma pergunta para ver nossa IA em ação!
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.isUser ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={message.isUser ? "bg-vexpro.chat.user" : "bg-vexpro.chat.ai"}>
                      {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex-1 p-3 rounded-lg ${
                      message.isUser
                        ? "bg-primary text-primary-foreground ml-12"
                        : "bg-secondary text-secondary-foreground mr-12"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-vexpro.chat.ai">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 p-3 rounded-lg bg-secondary text-secondary-foreground mr-12">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Processando sua pergunta...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Locked Message */}
          {isLocked && (
            <Card className="p-4 bg-primary/10 border-primary/20">
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Gostou da nossa IA?</p>
                  <p className="text-xs text-muted-foreground">
                    Faça login para continuar a conversa e liberar todo o potencial do nosso agente, sem custos para você!
                  </p>
                </div>
                <Button size="sm" className="bg-vexpro-gradient hover:opacity-90">
                  Fazer Login
                </Button>
              </div>
            </Card>
          )}

          {/* Input Area */}
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Input
                placeholder={isLocked ? "Faça login para continuar..." : "Digite sua pergunta..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading || isLocked}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || isLocked || !input.trim()}
                size="icon"
                className="bg-vexpro-gradient hover:opacity-90"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Suggested Questions */}
            {!isLocked && messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Sugestões:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(question)}
                      className="text-xs"
                      disabled={isLoading}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatDemo;