
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProfileSetupLayoutProps {
  children: React.ReactNode;
  step: number;
  title: string;
  description: string;
  onNext?: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  showBack?: boolean;
}

const ProfileSetupLayout = ({ 
  children, 
  step, 
  title, 
  description, 
  onNext, 
  onBack, 
  nextDisabled = false,
  showBack = true 
}: ProfileSetupLayoutProps) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            Startrit
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Step {step} of 9</span>
            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(step / 9) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {children}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {showBack && step > 1 ? (
            <Button variant="outline" onClick={onBack}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {onNext && (
            <Button 
              onClick={onNext} 
              disabled={nextDisabled}
              className="bg-primary hover:bg-primary/90"
            >
              {step === 9 ? "Complete Setup" : "Continue"}
              {step !== 9 && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupLayout;
