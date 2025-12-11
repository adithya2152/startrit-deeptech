
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords don't match",
            variant: "destructive",
          });
          return;
        }

        const { error } = await signUp(email, password, firstName, lastName);
        if (error) throw error;

        toast({
          title: "Success",
          description: "Account created! Please check your email to verify your account.",
        });
        // After signup, redirect to profile setup
        navigate("/profile-setup/1");
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;

        toast({
          title: "Success",
          description: "Welcome back!",
        });
        // After login, redirect to dashboard
        navigate("/dashboard");
      }
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
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pt-20">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mt-2 text-gray-600">
              {isSignUp 
                ? "Start your journey as a developer" 
                : "Sign in to your Startrit account"
              }
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
              )}

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
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your password"
                />
              </div>

              {isSignUp && (
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1"
                    placeholder="Confirm your password"
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Loading..." : (isSignUp ? "Create Account" : "Sign in")}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium text-primary hover:text-primary/80"
              >
                {isSignUp 
                  ? "Already have an account? Sign in" 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
