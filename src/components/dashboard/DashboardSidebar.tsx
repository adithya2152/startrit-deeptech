import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  MessageSquare,
  Star,
  CreditCard,
  FileText,
  Bookmark,
  HelpCircle,
  Calculator,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const DashboardSidebar = ({ activeSection, onSectionChange }: DashboardSidebarProps) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "tasklist", label: "Tasklist", icon: CheckSquare, path: "/task-list" },
    { id: "projects", label: "My Projects", icon: FolderOpen, path: "/my-projects" },
    { id: "inbox", label: "Inbox", icon: MessageSquare, path: "/inbox" },
    { id: "feedback", label: "Feedback", icon: Star, path: "/feedback" },
    { id: "credits", label: "Free Credit", icon: CreditCard, path: "/credits" }, // ✅ updated
    { id: "updates", label: "Project Updates", icon: FileText, path: "/project-updates" },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark, path: "/bookmarks" },
    { id: "doubts", label: "Ask Query", icon: HelpCircle, path: "/ask-doubt" },
    { id: "pricing", label: "Pricing Tool", icon: Calculator, path: "/pricing-tool" }, // ✅ updated
  ];

  return (
    <div className="w-52 bg-white shadow-sm border-r border-gray-200 h-full">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left font-medium",
                  isActive && "bg-blue-50 text-blue-700 hover:bg-blue-50"
                )}
                onClick={() => {
                  onSectionChange(item.id);
                  if (item.path) navigate(item.path);
                }}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;
