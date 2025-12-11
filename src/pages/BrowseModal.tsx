import { X, Search, Briefcase, User } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BrowseModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const closeModal = () => setIsOpen(false);

  const handleProjectsClick = () => {
    closeModal();
    navigate('/browse/projects');
  };

  const handleFreelancersClick = () => {
    closeModal();
    navigate('/browse/freelancers');
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-3xl rounded-xl bg-white/80 backdrop-blur-md shadow-xl p-6 md:p-8 space-y-8 border border-gray-200 relative">
          
          {/* Close Button */}
          <button onClick={closeModal} className="absolute top-4 right-4 text-gray-600 hover:text-black">
            <X size={20} />
          </button>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search projects or freelancers…"
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/60 text-sm font-medium placeholder-gray-400 bg-white/70 backdrop-blur-sm"
            />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Projects Card */}
            <div className="bg-white/90 border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <Briefcase className="text-[#6C63FF]" size={28} />
                <h2 className="text-xl font-bold text-gray-800">Projects</h2>
              </div>
              <p className="text-gray-600 mb-4">Explore exciting new project opportunities now!</p>
              <Button
                variant="default"
                className="bg-gradient-to-r from-[#6C63FF] to-[#8E7CFF] text-white w-full"
                onClick={handleProjectsClick}
              >
                Browse Projects
              </Button>
            </div>

            {/* Freelancers Card */}
            <div className="bg-white/90 border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <User className="text-[#6C63FF]" size={28} />
                <h2 className="text-xl font-bold text-gray-800">Freelancers</h2>
              </div>
              <p className="text-gray-600 mb-4">Find top-rated freelancers for your project</p>
              <Button
                variant="default"
                className="bg-gradient-to-r from-[#6C63FF] to-[#8E7CFF] text-white w-full"
                onClick={handleFreelancersClick}
              >
                Find Freelancers
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BrowseModal;
