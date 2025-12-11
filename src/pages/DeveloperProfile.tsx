import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DeveloperProfile = () => {
  const { id } = useParams();

  const developer = {
    name: "Ankit Sharma",
    title: "Senior AI/Blockchain Developer | IoT Systems Architect",
    location: "Bengaluru, India",
    rate: "$120/hr",
    availability: "30+ hours/week",
    bio: `I'm a deep-tech developer with over 7 years of professional experience in Artificial Intelligence, Blockchain, and IoT systems. I specialize in building scalable solutions for startups and enterprises, combining cutting-edge technology with clean, maintainable code.`,
    skills: [
      "Python", "Solidity", "C++", "TensorFlow", "PyTorch", "Web3.js",
      "OpenCV", "Ethereum", "Raspberry Pi", "AWS", "Docker", "Node.js"
    ],
    experience: [
      {
        title: "Lead AI Engineer",
        company: "AIWave Solutions",
        duration: "Jan 2021 – Present",
        description: `Designed recommendation systems and deployed BERT-based NLP models.`
      },
      {
        title: "Blockchain Consultant",
        company: "ChainSpace Innovations",
        duration: "May 2019 – Dec 2020",
        description: `Built and audited Ethereum smart contracts for DeFi apps.`
      }
    ],
    education: {
      degree: "B.Tech in Computer Science",
      institute: "IIT Madras",
      duration: "2014 – 2018",
      gpa: "8.9/10",
      highlights: "Published research on edge device vision systems."
    },
    certifications: [
      "Certified Blockchain Developer – Ethereum (Blockchain Council)",
      "TensorFlow Developer Certificate (Google)",
      "AWS Certified Machine Learning – Specialty"
    ],
    projects: [
      {
        name: "AI-based Trading Bot",
        description: "Built a bot using PPO, Twitter sentiment, and Binance API."
      },
      {
        name: "IoT Smart Home System",
        description: "Built a mobile-controlled automation platform with Alexa & NodeMCU."
      }
    ],
    stats: {
      onTime: "90%",
      onBudget: "93%",
      acceptRate: "67%",
      repeatHire: "25%"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 max-w-7xl mx-auto">
      <Link to="/hire-developers">
        <Button variant="outline" className="mb-6">← Back to Browse</Button>
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Profile */}
        <div className="flex-1 space-y-8 bg-white p-6 rounded-lg shadow-md">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{developer.name}</h2>
              <p className="text-gray-700">{developer.title}</p>
              <p className="text-sm text-gray-500">{developer.location}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-gray-600 text-sm mb-1">Availability:</p>
            <p className="text-base">{developer.availability}</p>
            <p className="text-gray-600 text-sm mt-2">Rate:</p>
            <p className="text-xl font-bold text-primary">{developer.rate}</p>
          </div>

          {/* Bio */}
          <section>
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-gray-700">{developer.bio}</p>
          </section>

          {/* Skills */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {developer.skills.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">{skill}</span>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Experience</h3>
            <ul className="space-y-4">
              {developer.experience.map((exp, index) => (
                <li key={index}>
                  <p className="font-semibold text-gray-800">{exp.title} – {exp.company}</p>
                  <p className="text-sm text-gray-500">{exp.duration}</p>
                  <p className="text-gray-700">{exp.description}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Education */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Education</h3>
            <p className="font-semibold text-gray-800">{developer.education.degree}</p>
            <p className="text-sm text-gray-600">{developer.education.institute} ({developer.education.duration})</p>
            <p className="text-gray-700">GPA: {developer.education.gpa}</p>
            <p className="text-gray-700">{developer.education.highlights}</p>
          </section>

          {/* Certifications */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Certifications</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {developer.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </section>

          {/* Projects */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Portfolio Projects</h3>
            <ul className="space-y-4">
              {developer.projects.map((proj, index) => (
                <li key={index}>
                  <p className="font-semibold text-gray-800">{proj.name}</p>
                  <p className="text-gray-700">{proj.description}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
            <Button className="w-full bg-primary hover:bg-primary/90">Invite to Bid</Button>
            <Button variant="outline" className="w-full">Contact</Button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-md font-semibold mb-3">Verifications</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✅ Email Verified</li>
              <li>✅ Phone Verified</li>
              <li>✅ Government ID Verified</li>
              <li>✅ Payment Method Verified</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-md font-semibold mb-3">Performance</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>📦 On Time: <strong>{developer.stats.onTime}</strong></li>
              <li>💰 On Budget: <strong>{developer.stats.onBudget}</strong></li>
              <li>📨 Accept Rate: <strong>{developer.stats.acceptRate}</strong></li>
              <li>🔁 Repeat Hire: <strong>{developer.stats.repeatHire}</strong></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DeveloperProfile;
