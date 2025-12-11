import { useState } from 'react';

export default function PricingTool() {
  const [domain, setDomain] = useState('');
  const [experience, setExperience] = useState('');
  const [skill, setSkill] = useState('');
  const [rateType, setRateType] = useState('hourly');
  const [completedProjects, setCompletedProjects] = useState('');
  const [rating, setRating] = useState('');
  const [calculatedRate, setCalculatedRate] = useState<number | null>(null);

  const domainOptions = ['AI', 'Blockchain', 'Robotics', 'IoT', 'Cloud', 'Other'];
  const ratingOptions = ['1', '2', '3', '4', '5'];

  const calculateRate = () => {
    let baseRate = 10;

    switch (domain.toLowerCase()) {
      case 'ai':
        baseRate += 30;
        break;
      case 'blockchain':
        baseRate += 25;
        break;
      case 'robotics':
        baseRate += 20;
        break;
      case 'iot':
        baseRate += 15;
        break;
      case 'cloud':
        baseRate += 10;
        break;
      default:
        baseRate += 5;
    }

    const years = parseInt(experience);
    if (!isNaN(years)) {
      baseRate += years * 2;
    }

    switch (skill.toLowerCase()) {
      case 'beginner':
        baseRate += 0;
        break;
      case 'intermediate':
        baseRate += 10;
        break;
      case 'advanced':
        baseRate += 20;
        break;
      default:
        baseRate += 0;
    }

    const projects = parseInt(completedProjects);
    if (!isNaN(projects) && projects > 0) {
      baseRate *= 1 + Math.min(projects / 50, 1);
    }

    const r = parseFloat(rating);
    if (!isNaN(r)) {
      baseRate *= 1 + (r - 3) * 0.1;
    }

    let finalRate = baseRate;

    if (rateType === 'weekly') finalRate *= 40;
    else if (rateType === 'monthly') finalRate *= 160;

    setCalculatedRate(Math.round(finalRate));
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border shadow rounded space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🧮 Pricing Tool</h2>

      <div className="space-y-4">
        {/* Domain Dropdown with Typing */}
        <div>
          <label className="block font-medium text-gray-700">Domain</label>
          <input
            list="domain-list"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g. AI"
            className="w-full mt-1 border rounded px-3 py-2"
          />
          <datalist id="domain-list">
            {domainOptions.map((d, idx) => (
              <option key={idx} value={d} />
            ))}
          </datalist>
        </div>

        {/* Experience */}
        <div>
          <label className="block font-medium text-gray-700">Years of Experience</label>
          <input
            type="number"
            min={0}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>

        {/* Skill */}
        <div>
          <label className="block font-medium text-gray-700">Skill Level</label>
          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Completed Projects */}
        <div>
          <label className="block font-medium text-gray-700">Completed Projects</label>
          <input
            type="number"
            min={0}
            value={completedProjects}
            onChange={(e) => setCompletedProjects(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2"
            placeholder="No. of projects on platform"
          />
        </div>

        {/* User Rating Dropdown with Typing */}
        <div>
          <label className="block font-medium text-gray-700">User Rating (1-5)</label>
          <input
            list="rating-list"
            type="number"
            min={1}
            max={5}
            step={0.1}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2"
          />
          <datalist id="rating-list">
            {ratingOptions.map((r, idx) => (
              <option key={idx} value={r} />
            ))}
          </datalist>
        </div>

        {/* Rate Type */}
        <div>
          <label className="block font-medium text-gray-700">Preferred Rate Type</label>
          <select
            value={rateType}
            onChange={(e) => setRateType(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2"
          >
            <option value="hourly">Hourly</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateRate}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Calculate Rate
        </button>

        {/* Result */}
        {calculatedRate !== null && (
          <div className="text-center mt-4 text-lg font-semibold text-green-600">
            Estimated {rateType} rate: ₹{calculatedRate}
          </div>
        )}
      </div>
    </div>
  );
}
