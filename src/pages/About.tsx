
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
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

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Startrit
          </h1>
          <p className="text-xl text-gray-600">
            Connecting deep-tech innovators with the world's brightest developers
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            At Startrit, we believe that breakthrough technologies require exceptional talent. 
            Our platform bridges the gap between forward-thinking companies and skilled developers 
            who specialize in deep-tech domains like artificial intelligence, blockchain, IoT, 
            quantum computing, and emerging technologies.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Startrit?</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Specialized Expertise</h3>
              <p className="text-gray-600">
                Our developers are carefully vetted for their deep-tech skills and experience 
                in cutting-edge technologies.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assurance</h3>
              <p className="text-gray-600">
                Every project is backed by our quality guarantee and secure payment system 
                to ensure successful outcomes.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Network</h3>
              <p className="text-gray-600">
                Access talent from around the world with flexible working arrangements 
                that suit your project needs.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation Focus</h3>
              <p className="text-gray-600">
                We're dedicated to supporting projects that push the boundaries of 
                technology and drive innovation forward.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get Started Today</h2>
          <p className="text-gray-600 mb-6">
            Whether you're looking to hire exceptional developers or seeking your next 
            challenging project, Startrit is here to help you succeed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/hire-developers">
              <Button className="bg-primary hover:bg-primary/90">
                Hire Developers
              </Button>
            </Link>
            <Link to="/find-work">
              <Button variant="outline">
                Find Work
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
