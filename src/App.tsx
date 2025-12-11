
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "@/hooks/useAuth";
// import Index from "./pages/Index";
// import HireDevelopers from "./pages/HireDevelopers";
// import FindWork from "./pages/FindWork";
// import Login from "./pages/Login";
// import SignupClient from "./pages/SignupClient";
// import SignupDeveloper from "./pages/SignupDeveloper";
// import About from "./pages/About";
// import FAQs from "./pages/FAQs";
// import NotFound from "./pages/NotFound";
// import Auth from "./pages/Auth";
// import Dashboard from "./pages/Dashboard";
// import Profile from "./pages/Profile";
// import ProfileSetup1 from "./pages/ProfileSetup1";
// import ProfileSetup2 from "./pages/ProfileSetup2";
// import ProfileSetup3 from "./pages/ProfileSetup3";
// import ProfileSetup4 from "./pages/ProfileSetup4";
// import ProfileSetup5 from "./pages/ProfileSetup5";
// import ProfileSetup6 from "./pages/ProfileSetup6";
// import ProfileSetup7 from "./pages/ProfileSetup7";
// import ProfileSetup8 from "./pages/ProfileSetup8";
// import ProfileSetup9 from "./pages/ProfileSetup9";
// import MyProjects from "./pages/MyProjects";
// import Feedback from "./pages/Feedback";
// import ProjectUpdates from "./pages/ProjectUpdates";
// import Bookmarks from "./pages/Bookmarks";
// import TaskList from "./pages/TaskList";
// import Inbox from "./pages/Inbox";
// import AskDoubt from "./pages/AskDoubt";
// import DoubtDetail from "./pages/DoubtDetail";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <AuthProvider>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<Index />} />
//             <Route path="/hire-developers" element={<HireDevelopers />} />
//             <Route path="/find-work" element={<FindWork />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/auth" element={<Auth />} />
//             <Route path="/signup/client" element={<SignupClient />} />
//             <Route path="/signup/developer" element={<SignupDeveloper />} />
//             <Route path="/profile-setup/1" element={<ProfileSetup1 />} />
//             <Route path="/profile-setup/2" element={<ProfileSetup2 />} />
//             <Route path="/profile-setup/3" element={<ProfileSetup3 />} />
//             <Route path="/profile-setup/4" element={<ProfileSetup4 />} />
//             <Route path="/profile-setup/5" element={<ProfileSetup5 />} />
//             <Route path="/profile-setup/6" element={<ProfileSetup6 />} />
//             <Route path="/profile-setup/7" element={<ProfileSetup7 />} />
//             <Route path="/profile-setup/8" element={<ProfileSetup8 />} />
//             <Route path="/profile-setup/9" element={<ProfileSetup9 />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/my-projects" element={<MyProjects />} />
//             <Route path="/feedback" element={<Feedback />} />
//             <Route path="/project-updates" element={<ProjectUpdates />} />
//             <Route path="/bookmarks" element={<Bookmarks />} />
//             <Route path="/task-list" element={<TaskList />} />
//             <Route path="/inbox" element={<Inbox />} />
//             <Route path="/ask-doubt" element={<AskDoubt />} />
//             <Route path="/doubt/:doubtId" element={<DoubtDetail />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/faqs" element={<FAQs />} />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
//       </TooltipProvider>
//     </AuthProvider>
//   </QueryClientProvider>
// );

// // export default App;
// // 📦 Existing Imports
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "@/hooks/useAuth";

// // 📦 Import BrowseModal page
// import BrowseModal from "./pages/BrowseModal"; // ✅ Added

// // 📦 Other Page Imports
// import Index from "./pages/Index";
// import HireDevelopers from "./pages/HireDevelopers";
// import FindWork from "./pages/FindWork";
// import Login from "./pages/Login";
// import SignupClient from "./pages/SignupClient";
// import SignupDeveloper from "./pages/SignupDeveloper";
// import About from "./pages/About";
// import FAQs from "./pages/FAQs";
// import NotFound from "./pages/NotFound";
// import Auth from "./pages/Auth";
// import Dashboard from "./pages/Dashboard";
// import Profile from "./pages/Profile";

// // 📦 Profile Setup Pages
// import ProfileSetup1 from "./pages/ProfileSetup1";
// import ProfileSetup2 from "./pages/ProfileSetup2";
// import ProfileSetup3 from "./pages/ProfileSetup3";
// import ProfileSetup4 from "./pages/ProfileSetup4";
// import ProfileSetup5 from "./pages/ProfileSetup5";
// import ProfileSetup6 from "./pages/ProfileSetup6";
// import ProfileSetup7 from "./pages/ProfileSetup7";
// import ProfileSetup8 from "./pages/ProfileSetup8";
// import ProfileSetup9 from "./pages/ProfileSetup9";

// // 📦 Dashboard Sub-Pages
// import MyProjects from "./pages/MyProjects";
// import Feedback from "./pages/Feedback";
// import ProjectUpdates from "./pages/ProjectUpdates";
// import Bookmarks from "./pages/Bookmarks";
// import TaskList from "./pages/TaskList";
// import Inbox from "./pages/Inbox";
// import AskDoubt from "./pages/AskDoubt";
// import DoubtDetail from "./pages/DoubtDetail";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <AuthProvider>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <Routes>
//             {/* ✅ Existing Pages */}
//             <Route path="/" element={<Index />} />
//             <Route path="/hire-developers" element={<HireDevelopers />} />
//             <Route path="/find-work" element={<FindWork />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/auth" element={<Auth />} />
//             <Route path="/signup/client" element={<SignupClient />} />
//             <Route path="/signup/developer" element={<SignupDeveloper />} />
//             <Route path="/profile-setup/1" element={<ProfileSetup1 />} />
//             <Route path="/profile-setup/2" element={<ProfileSetup2 />} />
//             <Route path="/profile-setup/3" element={<ProfileSetup3 />} />
//             <Route path="/profile-setup/4" element={<ProfileSetup4 />} />
//             <Route path="/profile-setup/5" element={<ProfileSetup5 />} />
//             <Route path="/profile-setup/6" element={<ProfileSetup6 />} />
//             <Route path="/profile-setup/7" element={<ProfileSetup7 />} />
//             <Route path="/profile-setup/8" element={<ProfileSetup8 />} />
//             <Route path="/profile-setup/9" element={<ProfileSetup9 />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/my-projects" element={<MyProjects />} />
//             <Route path="/feedback" element={<Feedback />} />
//             <Route path="/project-updates" element={<ProjectUpdates />} />
//             <Route path="/bookmarks" element={<Bookmarks />} />
//             <Route path="/task-list" element={<TaskList />} />
//             <Route path="/inbox" element={<Inbox />} />
//             <Route path="/ask-doubt" element={<AskDoubt />} />
//             <Route path="/doubt/:doubtId" element={<DoubtDetail />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/faqs" element={<FAQs />} />

//             {/* ✅ New Route for Browse Modal */}
//             <Route path="/browse-modal" element={<BrowseModal />} /> {/* 👈 Added */}

//             {/* 404 Page */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
//       </TooltipProvider>
//     </AuthProvider>
//   </QueryClientProvider>
// );

// export default App;

// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "@/hooks/useAuth";

// // Pages
// import Index from "./pages/Index";
// import HireDevelopers from "./pages/HireDevelopers";
// import FindWork from "./pages/FindWork";
// import Login from "./pages/Login";
// import SignupClient from "./pages/SignupClient";
// import SignupDeveloper from "./pages/SignupDeveloper";
// import About from "./pages/About";
// import FAQs from "./pages/FAQs";
// import NotFound from "./pages/NotFound";
// import Auth from "./pages/Auth";
// import Dashboard from "./pages/Dashboard";
// import Profile from "./pages/Profile";

// // Profile Setup Steps
// import ProfileSetup1 from "./pages/ProfileSetup1";
// import ProfileSetup2 from "./pages/ProfileSetup2";
// import ProfileSetup3 from "./pages/ProfileSetup3";
// import ProfileSetup4 from "./pages/ProfileSetup4";
// import ProfileSetup5 from "./pages/ProfileSetup5";
// import ProfileSetup6 from "./pages/ProfileSetup6";
// import ProfileSetup7 from "./pages/ProfileSetup7";
// import ProfileSetup8 from "./pages/ProfileSetup8";
// import ProfileSetup9 from "./pages/ProfileSetup9";

// // Dashboard Subpages
// import MyProjects from "./pages/MyProjects";
// import Feedback from "./pages/Feedback";
// import ProjectUpdates from "./pages/ProjectUpdates";
// import Bookmarks from "./pages/Bookmarks";
// import TaskList from "./pages/TaskList";
// import Inbox from "./pages/Inbox";
// import AskDoubt from "./pages/AskDoubt";
// import DoubtDetail from "./pages/DoubtDetail";

// // Browse Section (NEW)
// import Browse from "./pages/BrowseModal";
// import BrowseProjects from "./pages/BrowseProjects";
// import BrowseFreelancers from "./pages/BrowseFreelancers";

// // Search Bar Component (used in browse pages)
// import SearchBar from "./components/SearchBar";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <AuthProvider>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <Routes>
//             {/* Public Pages */}
//             <Route path="/" element={<Index />} />
//             <Route path="/hire-developers" element={<HireDevelopers />} />
//             <Route path="/find-work" element={<FindWork />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/auth" element={<Auth />} />
//             <Route path="/signup/client" element={<SignupClient />} />
//             <Route path="/signup/developer" element={<SignupDeveloper />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/faqs" element={<FAQs />} />

//             {/* Profile Setup */}
//             <Route path="/profile-setup/1" element={<ProfileSetup1 />} />
//             <Route path="/profile-setup/2" element={<ProfileSetup2 />} />
//             <Route path="/profile-setup/3" element={<ProfileSetup3 />} />
//             <Route path="/profile-setup/4" element={<ProfileSetup4 />} />
//             <Route path="/profile-setup/5" element={<ProfileSetup5 />} />
//             <Route path="/profile-setup/6" element={<ProfileSetup6 />} />
//             <Route path="/profile-setup/7" element={<ProfileSetup7 />} />
//             <Route path="/profile-setup/8" element={<ProfileSetup8 />} />
//             <Route path="/profile-setup/9" element={<ProfileSetup9 />} />

//             {/* Dashboard Pages */}
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/my-projects" element={<MyProjects />} />
//             <Route path="/feedback" element={<Feedback />} />
//             <Route path="/project-updates" element={<ProjectUpdates />} />
//             <Route path="/bookmarks" element={<Bookmarks />} />
//             <Route path="/task-list" element={<TaskList />} />
//             <Route path="/inbox" element={<Inbox />} />
//             <Route path="/ask-doubt" element={<AskDoubt />} />
            
//             <Route path="/doubt/:doubtId" element={<DoubtDetail />} />
//             <Route path="/profile" element={<Profile />} />

//             {/* Browse Pages */}
//             <Route path="/browse" element={<Browse />} />
//             <Route path="/browse/projects" element={<BrowseProjects />} />
//             <Route path="/browse/freelancers" element={<BrowseFreelancers />} />

//             {/* 404 Fallback */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
//       </TooltipProvider>
//     </AuthProvider>
//   </QueryClientProvider>
// );

// export default App;
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Pages
import Index from "./pages/Index";
import HireDevelopers from "./pages/HireDevelopers";
import FindWork from "./pages/FindWork";
import Login from "./pages/Login";
import SignupClient from "./pages/SignupClient";
import SignupDeveloper from "./pages/SignupDeveloper";
import About from "./pages/About";
import FAQs from "./pages/FAQs";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import DeveloperProfile from "./pages/DeveloperProfile";
// Profile Setup Steps
import ProfileSetup1 from "./pages/ProfileSetup1";
import ProfileSetup2 from "./pages/ProfileSetup2";
import ProfileSetup3 from "./pages/ProfileSetup3";
import ProfileSetup4 from "./pages/ProfileSetup4";
import ProfileSetup5 from "./pages/ProfileSetup5";
import ProfileSetup6 from "./pages/ProfileSetup6";
import ProfileSetup7 from "./pages/ProfileSetup7";
import ProfileSetup8 from "./pages/ProfileSetup8";
import ProfileSetup9 from "./pages/ProfileSetup9";

// Dashboard Subpages
import MyProjects from "./pages/MyProjects";
import Feedback from "./pages/Feedback";
import ProjectUpdates from "./pages/ProjectUpdates";
import Bookmarks from "./pages/Bookmarks";
import TaskList from "./pages/TaskList";
import Inbox from "./pages/Inbox";
import AskDoubt from "./pages/AskDoubt";
import DoubtDetail from "./pages/DoubtDetail";

// Browse Section
import Browse from "./pages/BrowseModal";
import BrowseProjects from "./pages/BrowseProjects";
import BrowseFreelancers from "./pages/BrowseFreelancers";

// Posts & Blogs
import PostsPage from "./pages/post";
import BlogsPage from "./pages/blogs";

// Pricing Tool
import PricingTool from "./pages/pricing-tool";

// Optional: Global SearchBar Component
import SearchBar from "./components/SearchBar";

import AddSkillPage from './pages/AddSkillPage';
import AddExperiencePage from './pages/AddExperiencePage';
import AddEducationPage from './pages/AddEducationPage';
import AddCredentialPage from './pages/AddCredentialPage';


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Index />} />
            <Route path="/hire-developers" element={<HireDevelopers />} />
              <Route path="/developer/:id" element={<DeveloperProfile />} />
            <Route path="/find-work" element={<FindWork />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/signup/client" element={<SignupClient />} />
            <Route path="/signup/developer" element={<SignupDeveloper />} />
            <Route path="/about" element={<About />} />
            <Route path="/faqs" element={<FAQs />} />

            {/* Profile Setup */}
            <Route path="/profile-setup/1" element={<ProfileSetup1 />} />
            <Route path="/profile-setup/2" element={<ProfileSetup2 />} />
            <Route path="/profile-setup/3" element={<ProfileSetup3 />} />
            <Route path="/profile-setup/4" element={<ProfileSetup4 />} />
            <Route path="/profile-setup/5" element={<ProfileSetup5 />} />
            <Route path="/profile-setup/6" element={<ProfileSetup6 />} />
            <Route path="/profile-setup/7" element={<ProfileSetup7 />} />
            <Route path="/profile-setup/8" element={<ProfileSetup8 />} />
            <Route path="/profile-setup/9" element={<ProfileSetup9 />} />

            {/* Dashboard Pages */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-projects" element={<MyProjects />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/project-updates" element={<ProjectUpdates />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/task-list" element={<TaskList />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/ask-doubt" element={<AskDoubt />} />
            <Route path="/doubt/:doubtId" element={<DoubtDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pricing-tool" element={<PricingTool />} />

            {/* Browse Pages */}
            <Route path="/browse" element={<Browse />} />
            <Route path="/browse/projects" element={<BrowseProjects />} />
            <Route path="/browse/freelancers" element={<BrowseFreelancers />} />

            {/* Posts & Blogs */}
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/blogs" element={<BlogsPage />} />

            <Route path="/add-skill" element={<AddSkillPage />} />
            <Route path="/add-experience" element={<AddExperiencePage />} />
            <Route path="/add-education" element={<AddEducationPage />} />
            <Route path="/add-credential" element={<AddCredentialPage />} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

