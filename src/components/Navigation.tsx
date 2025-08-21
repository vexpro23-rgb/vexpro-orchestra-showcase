import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-vexpro-gradient group-hover:animate-pulse-glow transition-all duration-300">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-vexpro-gradient bg-clip-text text-transparent">
                Vexpro
              </span>
              <span className="text-xs text-muted-foreground -mt-1">
                AI Central
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Início
            </Link>
            <Link
              to="/chat"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/chat") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              AI Central
            </Link>
            <Link
              to="/developers"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/developers") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Desenvolvedores
            </Link>
            <Link
              to="/pricing"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/pricing") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Preços
            </Link>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm" className="bg-vexpro-gradient hover:opacity-90 transition-opacity">
                      Cadastrar
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card border border-border rounded-lg mt-2 mb-4">
              <Link
                to="/"
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("/")
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Início
              </Link>
              <Link
                to="/chat"
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("/chat")
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                onClick={() => setIsOpen(false)}
              >
                AI Central
              </Link>
              <Link
                to="/developers"
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("/developers")
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Desenvolvedores
              </Link>
              <Link
                to="/pricing"
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("/pricing")
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Preços
              </Link>
              
              <div className="pt-4 space-y-2">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button size="sm" className="w-full bg-vexpro-gradient hover:opacity-90 transition-opacity">
                        Cadastrar
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;