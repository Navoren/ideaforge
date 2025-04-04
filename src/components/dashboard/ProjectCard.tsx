
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  lastUpdated: string;
  progress: number;
  tags: string[];
  collaborators?: number; // Made optional
}

const ProjectCard = ({
  id,
  title,
  description,
  category,
  lastUpdated,
  progress,
  tags,
}: ProjectCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden card-hover border border-gray-100">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="bg-primary-blue/10 text-primary-blue border-primary-blue/30">
            {category}
          </Badge>
          <div className="bg-gray-100 rounded-full h-2 w-24">
            <div
              className="bg-primary-blue rounded-full h-2"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <Link to={`/projects/${id}`}>
          <h3 className="mt-3 text-xl font-semibold text-gray-900 hover:text-primary-blue transition-colors">
            {title}
          </h3>
        </Link>
        <p className="mt-2 text-gray-600 line-clamp-2">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{lastUpdated}</span>
          </div>
        </div>
        <Link to={`/projects/${id}`} className="text-primary-blue hover:text-primary-blue/80 flex items-center text-sm font-medium">
          View Project <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
