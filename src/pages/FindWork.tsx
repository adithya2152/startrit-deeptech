
import { Search, MapPin, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const FindWork = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            Startrit
          </Link>
          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup/developer">
              <Button className="bg-primary hover:bg-primary/90">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Deep-Tech Projects
          </h1>
          <p className="text-xl text-gray-600">
            Discover exciting opportunities in AI, blockchain, IoT, and emerging technologies
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Search projects by technology, keywords, or client..."
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              Search Projects
            </Button>
          </div>
        </div>

        {/* Project Cards */}
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    AI-Powered Analytics Platform Development
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We're looking for an experienced AI/ML developer to build a comprehensive analytics platform 
                    that processes large datasets and provides intelligent insights for business decision-making.
                  </p>
                </div>
                <div className="text-right ml-6">
                  <div className="text-sm text-gray-500">Budget</div>
                  <div className="font-semibold text-gray-900">${5000 + i * 1000} - ${8000 + i * 1000}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                  Machine Learning
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs">
                  Python
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs">
                  TensorFlow
                </span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-md text-xs">
                  Data Analytics
                </span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Remote
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  3-6 months
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Fixed Price
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Posted 2 days ago • 5 proposals
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  Submit Proposal
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindWork;
