import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';

interface Project {
  id: string;
  title: string;
  domain: string;
  budget: number;
  durationWeeks: number;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Expert';
  postedByVerified: boolean;
  postedAt: string; // ISO date string
  bidsCount: number;
}

const DOMAIN_OPTIONS = ['AI', 'Robotics', 'Quantum', 'Blockchain', 'IoT', 'Embedded Systems'];
const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Expert'];
const DURATION_OPTIONS = [
  { label: '<1 week', value: '<1' },
  { label: '1–4 weeks', value: '1-4' },
  { label: '>1 month', value: '>4' },
];
const SORT_OPTIONS = [
  { label: 'Recently Posted', value: 'recent' },
  { label: 'Highest Budget', value: 'budget_desc' },
  { label: 'Ending Soon', value: 'ending_soon' },
  { label: 'Most Bids', value: 'most_bids' },
];

const BrowseProjects: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Controlled filter states initialized from URL params
  const [searchText, setSearchText] = useState(() => searchParams.get('search') || '');
  const [domain, setDomain] = useState(() => searchParams.get('domain') || '');
  const [minBudget, setMinBudget] = useState(() => Number(searchParams.get('minBudget')) || 0);
  const [maxBudget, setMaxBudget] = useState(() => Number(searchParams.get('maxBudget')) || 100000);
  const [duration, setDuration] = useState(() => searchParams.get('duration') || '');
  const [experienceLevel, setExperienceLevel] = useState(() => searchParams.get('experienceLevel') || '');
  const [postedByVerified, setPostedByVerified] = useState(() => searchParams.get('postedByVerified') === 'true');
  const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || '');

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  // Update URL search params whenever filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchText) params.search = searchText;
    if (domain) params.domain = domain;
    if (minBudget) params.minBudget = minBudget.toString();
    if (maxBudget && maxBudget !== 100000) params.maxBudget = maxBudget.toString();
    if (duration) params.duration = duration;
    if (experienceLevel) params.experienceLevel = experienceLevel;
    if (postedByVerified) params.postedByVerified = 'true';
    if (sortBy) params.sort = sortBy;

    setSearchParams(params);
  }, [searchText, domain, minBudget, maxBudget, duration, experienceLevel, postedByVerified, sortBy, setSearchParams]);

  // Fetch projects from backend API (simulate)
  useEffect(() => {
    setLoading(true);
    // Here you would call your backend API with filters in query string
    // For demo, simulate delay and filter dummy data
    const fetchProjects = async () => {
      // Simulated dummy projects
      const dummyProjects: Project[] = [
        {
          id: 'p1',
          title: 'AI Chatbot Development',
          domain: 'AI',
          budget: 50000,
          durationWeeks: 3,
          experienceLevel: 'Intermediate',
          postedByVerified: true,
          postedAt: '2025-07-15T10:00:00Z',
          bidsCount: 5,
        },
        {
          id: 'p2',
          title: 'Blockchain Payment System',
          domain: 'Blockchain',
          budget: 100000,
          durationWeeks: 8,
          experienceLevel: 'Expert',
          postedByVerified: false,
          postedAt: '2025-07-10T10:00:00Z',
          bidsCount: 10,
        },
        // Add more dummy projects here
      ];

      // Apply filtering logic here (simplified)
      let filtered = dummyProjects.filter(p => 
        (!searchText || p.title.toLowerCase().includes(searchText.toLowerCase())) &&
        (!domain || p.domain === domain) &&
        p.budget >= minBudget &&
        p.budget <= maxBudget &&
        (!duration || 
          (duration === '<1' && p.durationWeeks < 1) ||
          (duration === '1-4' && p.durationWeeks >= 1 && p.durationWeeks <= 4) ||
          (duration === '>4' && p.durationWeeks > 4)
        ) &&
        (!experienceLevel || p.experienceLevel === experienceLevel) &&
        (!postedByVerified || p.postedByVerified)
      );

      // Sort
      switch(sortBy) {
        case 'recent':
          filtered.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
          break;
        case 'budget_desc':
          filtered.sort((a, b) => b.budget - a.budget);
          break;
        case 'ending_soon':
          // For dummy data no end date, skip or implement your own logic
          break;
        case 'most_bids':
          filtered.sort((a, b) => b.bidsCount - a.bidsCount);
          break;
      }

      setProjects(filtered);
      setLoading(false);
    };

    fetchProjects();
  }, [searchText, domain, minBudget, maxBudget, duration, experienceLevel, postedByVerified, sortBy]);

  return (
    <div className="startrit-browse-projects p-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Left: Filters Sidebar */}
      <aside className="startrit-projects-filters flex-shrink-0 w-full md:w-64 bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>

        {/* Domain Dropdown */}
        <label className="block mb-2 font-medium" htmlFor="domainFilter">Domain</label>
        <select
          id="domainFilter"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          className="startrit-select w-full mb-4 rounded border px-3 py-2"
        >
          <option value="">All</option>
          {DOMAIN_OPTIONS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Budget Range */}
        <label className="block mb-2 font-medium">Budget (₹)</label>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="number"
            min={0}
            value={minBudget}
            onChange={e => setMinBudget(Number(e.target.value))}
            className="startrit-input w-1/2 rounded border px-3 py-2"
            placeholder="Min"
          />
          <input
            type="number"
            min={0}
            value={maxBudget}
            onChange={e => setMaxBudget(Number(e.target.value))}
            className="startrit-input w-1/2 rounded border px-3 py-2"
            placeholder="Max"
          />
        </div>

        {/* Duration Buttons */}
        <label className="block mb-2 font-medium">Duration</label>
        <div className="flex space-x-2 mb-4">
          {DURATION_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setDuration(duration === opt.value ? '' : opt.value)}
              className={`startrit-duration-btn px-3 py-1 rounded ${
                duration === opt.value ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Experience Level */}
        <label className="block mb-2 font-medium" htmlFor="experienceFilter">Experience Level</label>
        <select
          id="experienceFilter"
          value={experienceLevel}
          onChange={e => setExperienceLevel(e.target.value)}
          className="startrit-select w-full mb-4 rounded border px-3 py-2"
        >
          <option value="">All</option>
          {EXPERIENCE_LEVELS.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>

        {/* Posted By Verified */}
        <label className="inline-flex items-center mb-4">
          <input
            type="checkbox"
            checked={postedByVerified}
            onChange={e => setPostedByVerified(e.target.checked)}
            className="startrit-checkbox mr-2"
          />
          Verified Clients only
        </label>

        {/* Sort By */}
        <label className="block mb-2 font-medium" htmlFor="sortFilter">Sort By</label>
        <select
          id="sortFilter"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="startrit-select w-full mb-4 rounded border px-3 py-2"
        >
          <option value="">None</option>
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </aside>

      {/* Right: Content */}
      <main className="startrit-projects-content flex-1 flex flex-col">
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search projects by title, skill or keyword..."
        />


        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects found with current filters.</p>
        ) : (
          <ul className="startrit-project-list space-y-4">
            {projects.map(project => (
              <li key={project.id} className="startrit-project-card p-4 border rounded shadow hover:shadow-lg transition cursor-pointer">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p>Domain: {project.domain}</p>
                <p>Budget: ₹{project.budget.toLocaleString()}</p>
                <p>Duration: {project.durationWeeks} weeks</p>
                <p>Experience: {project.experienceLevel}</p>
                <p>Posted By: {project.postedByVerified ? 'Verified Client' : 'Client'}</p>
                <p>Bids: {project.bidsCount}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default BrowseProjects;
