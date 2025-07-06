'use client';

import React from 'react';
import {
  Folder,
  Users,
  Calendar,
  Plus,
  ArrowRight,
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  assetCount: number;
  memberCount: number;
  lastUpdated: string;
  color: string;
  isRecent?: boolean;
}

const projects: Project[] = [
  {
    id: '1',
    name: 'Mobile App Icons',
    description: 'Icon set for the new mobile application',
    assetCount: 45,
    memberCount: 3,
    lastUpdated: '2 hours ago',
    color: 'bg-blue-500',
    isRecent: true,
  },
  {
    id: '2',
    name: 'Website Illustrations',
    description: 'Landing page illustrations and graphics',
    assetCount: 23,
    memberCount: 2,
    lastUpdated: '1 day ago',
    color: 'bg-purple-500',
  },
  {
    id: '3',
    name: 'Brand Assets',
    description: 'Company branding and logo variations',
    assetCount: 67,
    memberCount: 5,
    lastUpdated: '3 days ago',
    color: 'bg-green-500',
  },
  {
    id: '4',
    name: 'E-commerce Icons',
    description: 'Shopping and e-commerce related icons',
    assetCount: 89,
    memberCount: 4,
    lastUpdated: '1 week ago',
    color: 'bg-orange-500',
  },
];

interface ProjectsSectionProps {
  onCreateProject?: () => void;
}

export default function ProjectsSection({ onCreateProject }: ProjectsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
        <button className="text-sm text-blue-600 hover:text-blue-500 flex items-center gap-1">
          View All
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.slice(0, 3).map((project) => (
          <div key={project.id} className="card group cursor-pointer">
            <div className="card-content">
              <div className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${project.color} flex items-center justify-center`}>
                      <Folder className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {project.description}
                      </p>
                    </div>
                  </div>
                  {project.isRecent && (
                    <span className="badge badge-primary text-xs">
                      Recent
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Folder className="w-3 h-3" />
                    {project.assetCount} assets
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {project.memberCount} members
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {project.lastUpdated}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Create New Project Card */}
        <div 
          className="card group cursor-pointer border-dashed border-2 hover:border-blue-500"
          onClick={onCreateProject}
        >
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold mb-1 group-hover:text-blue-600 transition-colors">
              Create New Project
            </h3>
            <p className="text-xs text-gray-500">
              Start organizing your assets in a new project
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 