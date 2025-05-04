import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Sliders, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import ProjectCard from '../dashboard/ProjectCard';
import Navbar from '@/components/layout/Navbar';
import { api, Project } from '@/services/api';

const ProjectExplorer = () => {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // API data state
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const PAGE_SIZE = 9;

  // Categories mapping
  const categoryMapping = {
    'all': 'All Projects',
    'technology': 'Technology',
    'healthcare': 'Healthcare',
    'environment': 'Environment',
    'education': 'Education',
    'social': 'Social Impact',
    'other': 'Other'
  };
  
  // Categories for UI
  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'technology', name: 'Technology' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'environment', name: 'Environment' },
    { id: 'education', name: 'Education' },
    { id: 'social', name: 'Social Impact' },
    { id: 'other', name: 'Other' },
  ];

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Convert page to skip value
        const skip = (currentPage - 1) * PAGE_SIZE;
        
        // Prepare category filter
        const categoryFilter = activeFilter !== 'all' ? activeFilter : undefined;
        
        // Fetch projects with search, filter, and pagination
        const response = await api.getProjects(
          currentPage,
          PAGE_SIZE,
          debouncedSearch || undefined,
          categoryFilter
        );
        
        setProjects(response.projects);
        setTotalPages(response.total_pages);
        setTotalProjects(response.total);
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError(err.response?.data?.detail || 'Failed to load projects');
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, [debouncedSearch, activeFilter, currentPage]);

  // Handle category filter change
  const handleCategoryChange = (categoryId: string) => {
    setActiveFilter(categoryId);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setActiveFilter('all');
    setCurrentPage(1);
  };

  // Format date for "last updated"
  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      const months = Math.floor(diffInDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
  };

  // Transform API projects to ProjectCard format
  const formattedProjects = projects.map(project => ({
    id: project.id.toString(),
    title: project.title,
    description: project.description,
    category: project.category,
    lastUpdated: formatLastUpdated(project.updated_at || project.created_at),
    progress: project.progress,
    tags: Array.isArray(project.tags) ? project.tags : (typeof project.tags === 'string' ? project.tags.split(',') : []),
    collaborators: project.collaborators ? project.collaborators.length : 0
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
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
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Error alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 animate-spin text-primary-blue" />
            <span className="ml-2 text-gray-600">Loading projects...</span>
          </div>
        )}

        {/* Project Results */}
        {!isLoading && (
          <>
            {formattedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formattedProjects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-lg font-medium text-gray-600">No projects found matching your criteria</div>
                <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {!isLoading && formattedProjects.length > 0 && totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                      }
                    }}
                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {/* Generate page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show up to 5 pages centered around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    // If 5 or fewer pages, show all
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    // If near start, show first 5
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // If near end, show last 5
                    pageNum = totalPages - 4 + i;
                  } else {
                    // Otherwise show current and 2 on each side
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                    className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            
            <div className="mt-2 text-center text-sm text-gray-600">
              Showing {formattedProjects.length} of {totalProjects} projects
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectExplorer;
