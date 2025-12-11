
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Welcome back!",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            Startrit
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-gray-600">Don't have an account?</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Sign Up
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white border shadow-lg z-50">
                <DropdownMenuItem asChild>
                  <Link to="/signup/client" className="w-full cursor-pointer">
                    As a Client
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/signup/developer" className="w-full cursor-pointer">
                    As a Developer
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pt-20">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-gray-600">
              Sign in to your Startrit account
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                  Remember me
                </Label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary/80">
                  Forgot your password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center">
              <span className="text-gray-600">
                Don't have an account?{" "}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="font-medium text-primary hover:text-primary/80 underline">
                      Sign up here
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 bg-white border shadow-lg z-50">
                    <DropdownMenuItem asChild>
                      <Link to="/signup/client" className="w-full cursor-pointer">
                        As a Client
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/signup/developer" className="w-full cursor-pointer">
                        As a Developer
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
