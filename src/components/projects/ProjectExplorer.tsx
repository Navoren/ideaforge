
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ProjectCard from '../dashboard/ProjectCard';
import Navbar from '@/components/layout/Navbar';
const ProjectExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Sample data for project categories
  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'tech', name: 'Technology' },
    { id: 'health', name: 'Healthcare' },
    { id: 'env', name: 'Environment' },
    { id: 'edu', name: 'Education' },
    { id: 'social', name: 'Social Impact' },
  ];

  // Sample data for projects
  const allProjects = [
    {
      id: '1',
      title: 'AI-Powered Crop Optimization System',
      description: 'Developing a machine learning system that analyzes soil conditions, weather patterns, and crop data to optimize farming yields in challenging environments.',
      category: 'Environment',
      lastUpdated: '2 days ago',
      progress: 65,
      tags: ['machine-learning', 'agriculture', 'sustainability'],
    },
    {
      id: '2',
      title: 'Decentralized Education Platform',
      description: 'Creating a blockchain-based platform for educational credential verification and skill certification that works across borders.',
      category: 'Education',
      lastUpdated: '5 days ago',
      progress: 40,
      tags: ['blockchain', 'education', 'verification'],
    },
    {
      id: '3',
      title: 'Biodegradable Microplastic Filter',
      description: 'Developing a cost-effective and scalable filter system that can remove microplastics from water using biodegradable materials.',
      category: 'Environment',
      lastUpdated: '1 week ago',
      progress: 75,
      tags: ['environment', 'filtration', 'sustainability'],
    },
    {
      id: '4',
      title: 'Neural Network for Medical Imaging Analysis',
      description: 'Project seeking ML engineers and healthcare professionals to build an advanced diagnostic tool for medical images.',
      category: 'Healthcare',
      lastUpdated: '3 days ago',
      progress: 30,
      tags: ['neural-networks', 'healthcare', 'imaging'],
    },
    {
      id: '5',
      title: 'Sustainable Urban Planning Tool',
      description: 'Developing an interactive tool for city planners to optimize for sustainability, livability, and climate resilience.',
      category: 'Environment',
      lastUpdated: '1 day ago',
      progress: 55,
      tags: ['cities', 'sustainability', 'planning'],
    },
    {
      id: '6',
      title: 'Accessible VR Education For All',
      description: 'Creating affordable VR educational experiences for underserved communities, focusing on science education.',
      category: 'Education',
      lastUpdated: '6 days ago',
      progress: 25,
      tags: ['virtual-reality', 'education', 'accessibility'],
    },
  ];

  // Filter projects based on search query and category
  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      activeFilter === 'all' || 
      project.category.toLowerCase() === activeFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Explorer</h1>
            <p className="text-gray-600">Discover innovative projects and find opportunities to collaborate.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/projects/new">
              <Button className="bg-primary-blue flex items-center">
                <Plus className="h-4 w-4 mr-2" /> Create Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                type="text" 
                placeholder="Search projects by name, description, or tags..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" /> Filters
              </Button>
              <Button variant="outline" className="flex items-center">
                <Sliders className="h-4 w-4 mr-2" /> Sort
              </Button>
            </div>
          </div>

          {/* Category filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.id}
                className={`cursor-pointer ${
                  activeFilter === category.id
                    ? 'bg-primary-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveFilter(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Project Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-lg font-medium text-gray-600">No projects found matching your criteria</div>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectExplorer;
