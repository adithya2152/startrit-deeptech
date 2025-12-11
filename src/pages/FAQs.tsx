
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQs = () => {
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
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about Startrit
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Startrit?</AccordionTrigger>
              <AccordionContent>
                Startrit is a specialized freelance platform that connects clients with 
                expert developers in deep-tech fields like AI, blockchain, IoT, and 
                emerging technologies. We focus on high-quality, innovative projects 
                that require specialized technical expertise.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How do I hire a developer?</AccordionTrigger>
              <AccordionContent>
                To hire a developer, create a client account, post your project 
                requirements, and review proposals from qualified developers. You can 
                also browse our developer profiles and invite specific developers to 
                your project.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How do I find work as a developer?</AccordionTrigger>
              <AccordionContent>
                Create a developer profile showcasing your skills and experience, 
                then browse available projects and submit proposals. You can also 
                receive direct invitations from clients who are impressed by your profile.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>What payment methods are accepted?</AccordionTrigger>
              <AccordionContent>
                We accept major credit cards, PayPal, and bank transfers. All payments 
                are processed securely through our escrow system to protect both 
                clients and developers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>How does the escrow system work?</AccordionTrigger>
              <AccordionContent>
                Our escrow system holds client payments securely until project 
                milestones are completed and approved. This protects both parties 
                and ensures fair payment for completed work.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>What types of projects are available?</AccordionTrigger>
              <AccordionContent>
                We specialize in deep-tech projects including AI/ML development, 
                blockchain applications, IoT solutions, data science, quantum 
                computing, robotics, and other cutting-edge technology projects.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>How are developers vetted?</AccordionTrigger>
              <AccordionContent>
                All developers go through a comprehensive vetting process including 
                skill assessments, portfolio reviews, and verification of their 
                experience in deep-tech domains. We maintain high standards to 
                ensure quality matches.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>What are the platform fees?</AccordionTrigger>
              <AccordionContent>
                Our transparent fee structure includes a small percentage of the 
                project value. Detailed fee information is provided during the 
                signup process and varies based on the project type and duration.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger>Can I work with developers internationally?</AccordionTrigger>
              <AccordionContent>
                Yes! Startrit connects clients and developers globally. Our platform 
                supports international payments and provides tools for effective 
                remote collaboration across different time zones.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger>How do I get support?</AccordionTrigger>
              <AccordionContent>
                Our support team is available 24/7 through the platform's messaging 
                system, email, and live chat. We also provide comprehensive 
                documentation and tutorials to help you get started.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup/client">
              <Button className="bg-primary hover:bg-primary/90">
                Get Started as Client
              </Button>
            </Link>
            <Link to="/signup/developer">
              <Button variant="outline">
                Join as Developer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
