import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AdminAuthGuardProps {
  children: ReactNode;
}

// Placeholder auth - in production, this would connect to a real auth system
const DEMO_CREDENTIALS = {
  email: "admin@pollution.gov",
  password: "admin123",
};

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem("admin_authenticated");
    if (adminAuth === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Placeholder authentication logic
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      localStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
      toast({
        title: "Welcome, Admin",
        description: "You have successfully logged in.",
      });
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border shadow-lg p-8 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold">Admin Access</h1>
              <p className="text-muted-foreground mt-2">
                Sign in to access the admin panel
              </p>
            </div>

            {/* Demo Credentials Notice */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6 text-sm">
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p className="text-muted-foreground">
                Email: admin@pollution.gov<br />
                Password: admin123
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@pollution.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full gap-2" size="lg">
                <Lock className="h-4 w-4" />
                Sign In
              </Button>
            </form>

            {/* Back Link */}
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-muted-foreground"
              >
                ← Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
