import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';

interface Freelancer {
  id: string;
  name: string;
  techDomain: string;
  country: string;
  hourlyRate: number;
  verified: boolean;
  rating: number; // 1-5 stars
  lastActiveAt: string; // ISO date
}

const TECH_DOMAIN_OPTIONS = ['AI', 'IoT', 'Embedded Systems', 'Robotics', 'Blockchain'];
const COUNTRY_OPTIONS = ['India', 'USA', 'Germany', 'UK', 'Canada']; // Ideally fetched dynamically from profile/user
const RATING_FILTERS = [
  { label: '4★+', value: 4 },
  { label: '3★+', value: 3 },
];
const SORT_OPTIONS = [
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Recently Active', value: 'recently_active' },
];

const BrowseFreelancers: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state from URL params
  const [searchText, setSearchText] = useState(() => searchParams.get('search') || '');
  const [techDomain, setTechDomain] = useState(() => searchParams.get('techDomain') || '');
  const [country, setCountry] = useState(() => searchParams.get('country') || '');
  const [minRate, setMinRate] = useState(() => Number(searchParams.get('minRate')) || 0);
  const [maxRate, setMaxRate] = useState(() => Number(searchParams.get('maxRate')) || 10000);
  const [verifiedOnly, setVerifiedOnly] = useState(() => searchParams.get('verifiedOnly') === 'true');
  const [minRating, setMinRating] = useState(() => Number(searchParams.get('minRating')) || 0);
  const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || '');

  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(false);

  // Update URL params on filter change
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchText) params.search = searchText;
    if (techDomain) params.techDomain = techDomain;
    if (country) params.country = country;
    if (minRate) params.minRate = minRate.toString();
    if (maxRate && maxRate !== 10000) params.maxRate = maxRate.toString();
    if (verifiedOnly) params.verifiedOnly = 'true';
    if (minRating) params.minRating = minRating.toString();
    if (sortBy) params.sort = sortBy;

    setSearchParams(params);
  }, [searchText, techDomain, country, minRate, maxRate, verifiedOnly, minRating, sortBy, setSearchParams]);

  // Fetch freelancers (simulate backend)
  useEffect(() => {
    setLoading(true);

    const dummyFreelancers: Freelancer[] = [
      {
        id: 'f1',
        name: 'Alice Johnson',
        techDomain: 'AI',
        country: 'India',
        hourlyRate: 1000,
        verified: true,
        rating: 4.5,
        lastActiveAt: '2025-07-21T08:00:00Z',
      },
      {
        id: 'f2',
        name: 'Bob Smith',
        techDomain: 'Embedded Systems',
        country: 'USA',
        hourlyRate: 1500,
        verified: false,
        rating: 3.9,
        lastActiveAt: '2025-07-18T09:30:00Z',
      },
      // Add more dummy freelancers
    ];

    let filtered = dummyFreelancers.filter(f =>
      (!searchText || f.name.toLowerCase().includes(searchText.toLowerCase())) &&
      (!techDomain || f.techDomain === techDomain) &&
      (!country || f.country === country) &&
      f.hourlyRate >= minRate &&
      f.hourlyRate <= maxRate &&
      (!verifiedOnly || f.verified) &&
      f.rating >= minRating
    );

    switch(sortBy) {
      case 'top_rated':
        filtered.sort((a,b) => b.rating - a.rating);
        break;
      case 'newest':
        // No date info, assume dummy does not support this
        break;
      case 'price_asc':
        filtered.sort((a,b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'recently_active':
        filtered.sort((a,b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime());
        break;
    }

    setFreelancers(filtered);
    setLoading(false);
  }, [searchText, techDomain, country, minRate, maxRate, verifiedOnly, minRating, sortBy]);

  return (
    <div className="startrit-browse-freelancers p-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Filters Sidebar */}
      <aside className="startrit-freelancers-filters flex-shrink-0 w-full md:w-64 bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>

        {/* Tech Domain */}
        <label className="block mb-2 font-medium" htmlFor="techDomainFilter">Tech Domain</label>
        <select
          id="techDomainFilter"
          value={techDomain}
          onChange={e => setTechDomain(e.target.value)}
          className="startrit-select w-full mb-4 rounded border px-3 py-2"
        >
          <option value="">All</option>
          {TECH_DOMAIN_OPTIONS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Country */}
        <label className="block mb-2 font-medium" htmlFor="countryFilter">Country</label>
        <select
          id="countryFilter"
          value={country}
          onChange={e => setCountry(e.target.value)}
          className="startrit-select w-full mb-4 rounded border px-3 py-2"
        >
          <option value="">All</option>
          {COUNTRY_OPTIONS.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Hourly Rate */}
        <label className="block mb-2 font-medium">Hourly Rate (₹)</label>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="number"
            min={0}
            value={minRate}
            onChange={e => setMinRate(Number(e.target.value))}
            className="startrit-input w-1/2 rounded border px-3 py-2"
            placeholder="Min"
          />
          <input
            type="number"
            min={0}
            value={maxRate}
            onChange={e => setMaxRate(Number(e.target.value))}
            className="startrit-input w-1/2 rounded border px-3 py-2"
            placeholder="Max"
          />
        </div>

        {/* Verified Developer */}
        <label className="inline-flex items-center mb-4">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={e => setVerifiedOnly(e.target.checked)}
            className="startrit-checkbox mr-2"
          />
          Verified Developers only
        </label>

        {/* Rating Stars Filter */}
        <label className="block mb-2 font-medium">Minimum Rating</label>
        <select
          value={minRating}
          onChange={e => setMinRating(Number(e.target.value))}
          className="startrit-select w-full mb-4 rounded border px-3 py-2"
        >
          <option value={0}>Any</option>
          {RATING_FILTERS.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

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

      {/* Content */}
      <main className="startrit-freelancers-content flex-1 flex flex-col">
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search freelancers by name, skill or keyword..."
        />

        {loading ? (
          <p>Loading freelancers...</p>
        ) : freelancers.length === 0 ? (
          <p>No freelancers found with current filters.</p>
        ) : (
          <ul className="startrit-freelancer-list space-y-4">
            {freelancers.map(f => (
              <li key={f.id} className="startrit-freelancer-card p-4 border rounded shadow hover:shadow-lg transition cursor-pointer">
                <h3 className="text-lg font-semibold">{f.name}</h3>
                <p>Domain: {f.techDomain}</p>
                <p>Country: {f.country}</p>
                <p>Hourly Rate: ₹{f.hourlyRate.toLocaleString()}</p>
                <p>Verified: {f.verified ? 'Yes' : 'No'}</p>
                <p>Rating: {f.rating.toFixed(1)} ★</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default BrowseFreelancers;
