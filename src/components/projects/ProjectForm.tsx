import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const ProjectForm = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const categories = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'environment', label: 'Environment' },
    { value: 'education', label: 'Education' },
    { value: 'social', label: 'Social Impact' },
    { value: 'other', label: 'Other' },
  ];

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput.toLowerCase())) {
      setTags([...tags, tagInput.toLowerCase()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-600">Share your idea and find collaborators to help bring it to life.</p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <form className="space-y-6">
              <div>
                <Label htmlFor="project-title">Project Title</Label>
                <Input
                  id="project-title"
                  placeholder="Enter a descriptive title for your project"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="project-category">Category</Label>
                <Select>
                  <SelectTrigger id="project-category" className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="project-summary">Short Summary</Label>
                <Input
                  id="project-summary"
                  placeholder="One sentence summary of your project"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max 100 characters. This will appear in search results.
                </p>
              </div>

              <div>
                <Label htmlFor="project-description">Project Description</Label>
                <Textarea
                  id="project-description"
                  placeholder="Describe your project, the problem it solves, and its potential impact..."
                  className="mt-1 min-h-[150px]"
                />
              </div>

              <div>
                <Label htmlFor="github-link">GitHub Repository</Label>
                <Input
                  id="github-link"
                  placeholder="https://github.com/username/repository"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link to your project's GitHub repository (optional)
                </p>
              </div>

              <div>
                <Label htmlFor="project-tags">Tags</Label>
                <div className="flex mt-1">
                  <Input
                    id="project-tags"
                    placeholder="Add tags (press Enter after each tag)"
                    className="rounded-r-none"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                  />
                  <Button
                    type="button"
                    className="rounded-l-none bg-primary-blue"
                    onClick={addTag}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Add relevant tags to help others find your project.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <Badge key={tag} className="bg-gray-100 text-gray-700 flex items-center">
                      {tag}
                      <button
                        type="button"
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="skills-needed">Skills Needed</Label>
                <Textarea
                  id="skills-needed"
                  placeholder="List the skills and expertise you're looking for in collaborators..."
                  className="mt-1"
                />
              </div>

              <div className="pt-5 border-t border-gray-200 flex justify-end space-x-3">
                <Link to="/projects">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button className="bg-primary-blue" type="submit">
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;