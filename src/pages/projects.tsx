import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Clock, Users, ArrowRight, Plus } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  description: string;
  assetCount: number;
  memberCount: number;
  lastUpdated: string;
  color: string;
  thumbnail: string;
}

// Mock projects data
const mockProjects: Project[] = [
  {
    id: 1,
    name: "E-commerce UI Kit",
    description: "Complete UI components for online stores with shopping carts, product cards, checkout flows, and payment interfaces",
    assetCount: 45,
    memberCount: 3,
    lastUpdated: "2 hours ago",
    color: "from-blue-400 to-blue-600",
    thumbnail: "🛒"
  },
  {
    id: 2,
    name: "Banking App Icons",
    description: "Financial and payment related icons including credit cards, bank transfers, mobile payments, and security features",
    assetCount: 28,
    memberCount: 2,
    lastUpdated: "1 day ago",
    color: "from-green-400 to-green-600",
    thumbnail: "💳"
  },
  {
    id: 3,
    name: "Travel Illustrations",
    description: "Beautiful travel and adventure graphics featuring landmarks, transportation, accommodations, and activities",
    assetCount: 32,
    memberCount: 4,
    lastUpdated: "3 days ago",
    color: "from-purple-400 to-purple-600",
    thumbnail: "✈️"
  },
  {
    id: 4,
    name: "Social Media Pack",
    description: "Icons and templates for social platforms including Instagram stories, Facebook posts, Twitter headers, and TikTok content",
    assetCount: 67,
    memberCount: 5,
    lastUpdated: "1 week ago",
    color: "from-pink-400 to-pink-600",
    thumbnail: "📱"
  },
  {
    id: 5,
    name: "Dashboard Components",
    description: "Analytics and data visualization assets including charts, graphs, KPI cards, and interactive elements for admin panels",
    assetCount: 23,
    memberCount: 2,
    lastUpdated: "2 weeks ago",
    color: "from-orange-400 to-orange-600",
    thumbnail: "📊"
  },
  {
    id: 6,
    name: "Healthcare App UI",
    description: "Medical and healthcare user interface components with appointment booking, patient records, and telemedicine features",
    assetCount: 34,
    memberCount: 3,
    lastUpdated: "3 weeks ago",
    color: "from-red-400 to-red-600",
    thumbnail: "🏥"
  },
  {
    id: 7,
    name: "Education Platform",
    description: "E-learning and educational interface elements including course cards, progress tracking, quiz components, and certificates",
    assetCount: 41,
    memberCount: 6,
    lastUpdated: "1 month ago",
    color: "from-indigo-400 to-indigo-600",
    thumbnail: "📚"
  }
];

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const handleCreateProject = () => {
    // Handle create project functionality
    console.log('Create new project');
  };

  const handleProjectClick = (project: Project) => {
    // Handle project click
    console.log('Open project:', project.name);
  };

  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600 mt-1">Manage and organize your design projects</p>
            </div>
            <button
              onClick={handleCreateProject}
              className="group h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              <span className="font-medium">Create Project</span>
            </button>
          </div>

          {/* Search and Sort */}
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <input
                type="search"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200"
            >
              <option value="recent">Recently Updated</option>
              <option value="name">Name A-Z</option>
              <option value="assets">Most Assets</option>
              <option value="members">Most Members</option>
            </select>
          </div>

          {/* Projects Grid - Vertical Stack */}
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.01]"
              >
                <div className="p-6">
                  {/* Horizontal Layout */}
                  <div className="flex items-center gap-6">
                    {/* Project Thumbnail */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0`}>
                      <span className="text-3xl filter drop-shadow-sm">{project.thumbnail}</span>
                    </div>

                    {/* Project Info - Flex Grow */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                        
                        {/* Last Updated */}
                        <div className="flex items-center gap-1 text-xs text-gray-500 ml-4 flex-shrink-0">
                          <Clock className="h-3 w-3" />
                          {project.lastUpdated}
                        </div>
                      </div>

                      {/* Project Stats */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {project.assetCount} assets
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Users className="h-4 w-4" />
                            <span>{project.memberCount} members</span>
                          </div>
                        </div>
                        
                        {/* Arrow */}
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Create New Project Card */}
            <div
              onClick={handleCreateProject}
              className="group bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer hover:scale-[1.01]"
            >
              <div className="p-6">
                <div className="flex items-center gap-6">
                  {/* Plus Icon */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0 border-2 border-dashed border-gray-300 group-hover:border-blue-400">
                    <Plus className="h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                  </div>

                  {/* Create Project Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                      Create New Project
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Start a fresh project with your team and organize your design assets
                    </p>
                    
                    <div className="mt-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 group-hover:bg-blue-200 transition-colors duration-200">
                        Get Started →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-500">Try adjusting your search terms or create a new project.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
} 