
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const [showSignupDropdown, setShowSignupDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-primary">
              Startrit
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/hire-developers"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Hire Developers
              </Link>
              <Link
                to="/find-work"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Find Work
              </Link>
              <Link
                to="/faqs"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                FAQs
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                About
              </Link>
            </nav>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <Input
                placeholder="Search projects or developers"
                className="pr-10 w-64"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <DropdownMenu open={showSignupDropdown} onOpenChange={setShowSignupDropdown}>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  Sign Up
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white border shadow-lg z-50">
                <DropdownMenuItem asChild>
                  <Link to="/signup/client" className="w-full cursor-pointer">
                    Become a Client
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/signup/developer" className="w-full cursor-pointer">
                    Become a Developer
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find the Best Freelance Developers
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12">
            Connect with top deep-tech talent, post your project, and get hired fast.
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center bg-white rounded-lg shadow-lg p-2">
              <Input
                placeholder="What project are you looking for?"
                className="flex-1 border-0 text-lg focus:ring-0"
              />
              <Button size="lg" className="ml-2 bg-primary hover:bg-primary/90">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/hire-developers">
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg">
                Hire Developers
              </Button>
            </Link>
            <Link to="/find-work">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-2">
                Become Developer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* For Clients */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-left">
                For Clients
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Access Top Deep-Tech Talent
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Connect with skilled developers specializing in AI, blockchain, IoT, and cutting-edge technologies. 
                    Find the perfect match for your innovative projects with our curated talent pool.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Streamlined Project Management
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Post your project requirements and receive qualified proposals from verified developers. 
                    Our platform makes it easy to manage milestones, payments, and communication.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Quality Assurance
                  </h3>
                  <p className="text-gray-600 mb-4">
                    All developers are thoroughly vetted for their technical skills and experience. 
                    Review ratings, portfolios, and client feedback to make informed hiring decisions.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Secure Payments
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Our escrow system ensures secure transactions and protects both clients and developers. 
                    Pay only when milestones are completed to your satisfaction.
                  </p>
                </div>

                <Link to="/signup/client">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Become a Client
                  </Button>
                </Link>
              </div>
            </div>

            {/* For Developers */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-left">
                For Developers
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Showcase Your Expertise
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create a compelling profile highlighting your deep-tech skills and experience. 
                    Stand out with your portfolio of innovative projects and technical achievements.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Access Premium Projects
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Work on cutting-edge projects with forward-thinking companies. 
                    Find opportunities that match your skills in AI, blockchain, IoT, and emerging technologies.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Flexible Work Arrangements
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Choose projects that fit your schedule and work style. 
                    Whether you prefer short-term contracts or long-term partnerships, find the perfect match.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Competitive Compensation
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Set your own rates and negotiate terms directly with clients. 
                    Benefit from our transparent fee structure and timely payment processing.
                  </p>
                </div>

                <Link to="/signup/developer">
                  <Button size="lg" variant="outline" className="border-2">
                    Become a Developer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Startrit</h3>
              <p className="text-gray-400">
                Connecting deep-tech developers with innovative clients worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/hire-developers" className="hover:text-white transition-colors">Hire Developers</Link></li>
                <li><Link to="/signup/client" className="hover:text-white transition-colors">Post a Project</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Developers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/find-work" className="hover:text-white transition-colors">Find Work</Link></li>
                <li><Link to="/signup/developer" className="hover:text-white transition-colors">Join as Developer</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Success Stories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Startrit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
