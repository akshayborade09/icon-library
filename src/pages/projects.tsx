import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LeftNavigation from '../components/layout/LeftNavigation';
import PageHeader from '../components/layout/PageHeader';
import { AssetProvider } from '../contexts/AssetContext';
import { Search, Plus } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  assetCount: number;
}

interface Asset {
  id: number;
  name: string;
  preview: string;
  downloads: number;
  size?: string;
}

function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'E-commerce Icons',
        description: 'Complete set of icons for online shopping platform',
        createdAt: '2024-01-15',
        assetCount: 24
      },
      {
        id: '2',
        name: 'Finance Dashboard',
        description: 'UI components and icons for banking application',
        createdAt: '2024-01-10',
        assetCount: 18
      },
      {
        id: '3',
        name: 'Healthcare System',
        description: 'Medical icons and illustrations for patient portal',
        createdAt: '2024-01-05',
        assetCount: 32
      },
      {
        id: '4',
        name: 'Travel App Icons',
        description: 'Navigation and booking icons for travel booking platform',
        createdAt: '2024-01-01',
        assetCount: 28
      }
    ];
    setProjects(mockProjects);
  }, []);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = () => {
    console.log('Create project clicked');
    // Handle create project logic
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  if (projects.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <LeftNavigation collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <div className="flex-1 overflow-hidden">
          <div className="animate-pulse px-6 py-8">
            <div className="max-w-[1400px] mx-auto">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <LeftNavigation collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title="Projects"
          description="Manage and organize your design assets"
          actions={
            <button
              onClick={handleCreateProject}
              className="group h-9 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              Create Project
            </button>
          }
        />

        {/* Scrollable Content - Match dashboard content padding with max-width container */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-[1400px] mx-auto px-10">
            {/* Search bar above project list */}
            <div className="mb-6">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-all duration-200 group-hover:text-blue-500 group-focus-within:text-blue-500" />
                <input
                  type="search"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleProjectClick(project.id)}
                    className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-gray-600 mt-1 mb-3">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <span>{project.assetCount} assets</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white text-sm">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery 
                      ? `No projects match "${searchQuery}". Try adjusting your search.`
                      : "You haven't created any projects yet."
                    }
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={handleCreateProject}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Create Your First Project
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Projects() {
  const handleAssetClick = (asset: Asset, type: string) => {
    console.log('Asset clicked:', asset, type);
  };

  const handleCreateProject = () => {
    console.log('Create project clicked');
  };

  return (
    <AssetProvider 
      handleAssetClick={handleAssetClick}
      handleCreateProject={handleCreateProject}
    >
      <ProjectsPage />
    </AssetProvider>
  );
} 