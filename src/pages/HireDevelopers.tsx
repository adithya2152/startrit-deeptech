
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const HireDevelopers = () => {
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
            <Link to="/signup/client">
              <Button className="bg-primary hover:bg-primary/90">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hire Top Deep-Tech Developers
          </h1>
          <p className="text-xl text-gray-600">
            Find skilled developers specializing in AI, blockchain, IoT, and cutting-edge technologies
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Search developers by skills, location, or expertise..."
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              Search
            </Button>
          </div>
        </div>

        {/* Developer Cards Placeholder */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Developer {i}</h3>
                    <p className="text-sm text-gray-600">Deep Tech Specialist</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Starting at</div>
                  <div className="font-semibold text-gray-900">${50 + i * 10}/hr</div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                Experienced in AI/ML, blockchain development, and IoT solutions with 5+ years of experience.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                  AI/ML
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs">
                  Blockchain
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs">
                  IoT
                </span>
              </div>
              
              <Link to={`/developer/${i}`}>
  <Button className="w-full bg-primary hover:bg-primary/90">
    View Profile
  </Button>
</Link>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HireDevelopers;
