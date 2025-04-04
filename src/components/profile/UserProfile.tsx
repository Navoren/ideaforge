
import { Link } from 'react-router-dom';
import { User, Briefcase, MapPin, Mail, Link as LinkIcon, Edit, Bookmark, Users, GitBranch, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectCard from '../dashboard/ProjectCard';

const UserProfile = () => {
  // Sample user data
  const user = {
    name: 'Prakhar ',
    title: 'AI Researcher(to-be) | Data Scientist(may-be)',
    location: 'India, Chandani Chawk',
    email: 'Prakhar@example.com',
    website: 'Prakhar.dev',
    bio: 'Passionate AI researcher focused on developing machine learning solutions for environmental and agricultural challenges. Looking to collaborate on projects that have a positive impact on sustainability and food security.',
    skills: ['Machine Learning', 'Python', 'Data Analysis', 'TensorFlow', 'PyTorch', 'Computer Vision', 'NLP', 'Agriculture Tech'],
    interests: ['Sustainable Agriculture', 'Environmental Conservation', 'Ethical AI', 'Open Source'],
  };

  // Sample projects data
  const projects = [
    {
      id: '1',
      title: 'AI-Powered Crop Optimization System',
      description: 'Developing a machine learning system that analyzes soil conditions, weather patterns, and crop data to optimize farming yields in challenging environments.',
      category: 'Agriculture Tech',
      collaborators: 4,
      lastUpdated: '2 days ago',
      progress: 65,
      tags: ['machine-learning', 'agriculture', 'sustainability'],
    },
    {
      id: '2',
      title: 'Decentralized Education Platform',
      description: 'Creating a blockchain-based platform for educational credential verification and skill certification that works across borders.',
      category: 'EdTech',
      collaborators: 5,
      lastUpdated: '5 days ago',
      progress: 40,
      tags: ['blockchain', 'education', 'verification'],
    },
  ];

  // Sample papers data
  const papers = [
    {
      id: '1',
      title: 'Machine Learning Applications in Agricultural Yield Prediction: A Systematic Review',
      authors: 'Johnson, A., Rivera, A., et al.',
      journal: 'Journal of Agricultural Informatics',
      year: '2024',
      link: '#',
    },
    {
      id: '2',
      title: 'Neural Networks for Crop Disease Detection from Multispectral Imagery',
      authors: 'Rivera, A., Smith, J., et al.',
      journal: 'IEEE Transactions on Agricultural Engineering',
      year: '2023',
      link: '#',
    },
    {
      id: '3',
      title: 'Ethical Considerations in AI-Driven Agricultural Systems',
      authors: 'Rivera, A., Chen, L., et al.',
      journal: 'AI Ethics Journal',
      year: '2023',
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary-blue to-accent-green h-40" />
          <div className="relative px-6 py-6 sm:px-8 sm:py-8">
            <div className="absolute -top-16 left-6 sm:left-8">
              <div className="rounded-full bg-white p-1 shadow-lg">
                <div className="h-28 w-28 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center">
                  <User className="h-14 w-14 text-gray-500" />
                </div>
              </div>
            </div>
            <div className="pt-16 sm:flex sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.title}</p>
                <div className="mt-2 flex flex-wrap items-center text-gray-500 text-sm gap-y-1">
                  {user.location && (
                    <div className="flex items-center mr-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.email && (
                    <div className="flex items-center mr-4">
                      <Mail className="h-4 w-4 mr-1" />
                      <a href={`mailto:${user.email}`} className="hover:text-primary-blue">
                        {user.email}
                      </a>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center">
                      <LinkIcon className="h-4 w-4 mr-1" />
                      <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary-blue">
                        {user.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <Button variant="outline" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Connect
                </Button>
                <Button className="bg-primary-blue flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-8">
            {/* About */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">About</h2>
              <p className="text-gray-600">{user.bio}</p>
            </div>

            {/* Skills */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="bg-blue-50 text-primary-blue border-primary-blue/30">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Research Interests</h2>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest) => (
                  <Badge key={interest} variant="outline" className="bg-green-50 text-accent-green border-accent-green/30">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="projects" className="bg-white shadow rounded-lg overflow-hidden">
              <TabsList className="w-full border-b border-gray-200 p-0 h-auto">
                <TabsTrigger 
                  value="projects" 
                  className="flex-1 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary-blue data-[state=active]:shadow-none rounded-none"
                >
                  <GitBranch className="h-4 w-4 mr-2" />
                  Projects
                </TabsTrigger>
                <TabsTrigger 
                  value="papers" 
                  className="flex-1 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary-blue data-[state=active]:shadow-none rounded-none"
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Research Papers
                </TabsTrigger>
                <TabsTrigger 
                  value="experience" 
                  className="flex-1 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary-blue data-[state=active]:shadow-none rounded-none"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Experience
                </TabsTrigger>
              </TabsList>
              <TabsContent value="projects" className="p-6 space-y-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
                <div className="text-center">
                  <Link to="/projects/new">
                    <Button variant="outline" className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Project
                    </Button>
                  </Link>
                </div>
              </TabsContent>
              <TabsContent value="papers" className="p-6">
                <div className="space-y-4">
                  {papers.map((paper) => (
                    <div key={paper.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <h3 className="text-lg font-medium text-gray-900">
                        <a href={paper.link} className="hover:text-primary-blue">
                          {paper.title}
                        </a>
                      </h3>
                      <p className="text-gray-600 mt-1">{paper.authors}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {paper.journal} ({paper.year})
                        </div>
                        <Badge variant="outline" className="bg-accent-green/10 text-accent-green border-accent-green/30">
                          Published
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="experience" className="p-6">
                <div className="space-y-6">
                  <div className="relative pl-8 pb-6 border-l-2 border-gray-200">
                    <div className="absolute w-4 h-4 bg-primary-blue rounded-full -left-[9px] top-0" />
                    <div className="mb-1">
                      <div className="text-lg font-medium text-gray-900">Senior AI Researcher</div>
                      <div className="text-primary-blue font-medium">GreenTech AI Labs</div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">Jan 2022 - Present • San Francisco</div>
                    <p className="text-gray-600">
                      Leading research on machine learning applications for sustainable agriculture.
                      Developing models for crop yield prediction and resource optimization.
                    </p>
                  </div>
                  
                  <div className="relative pl-8 pb-6 border-l-2 border-gray-200">
                    <div className="absolute w-4 h-4 bg-gray-400 rounded-full -left-[9px] top-0" />
                    <div className="mb-1">
                      <div className="text-lg font-medium text-gray-900">Data Scientist</div>
                      <div className="text-gray-700 font-medium">AgriTech Solutions</div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">Mar 2019 - Dec 2021 • Boston</div>
                    <p className="text-gray-600">
                      Developed predictive models for crop disease detection using computer vision.
                      Built data pipelines for agricultural sensor networks.
                    </p>
                  </div>
                  
                  <div className="relative pl-8 pb-6">
                    <div className="absolute w-4 h-4 bg-gray-400 rounded-full -left-[9px] top-0" />
                    <div className="mb-1">
                      <div className="text-lg font-medium text-gray-900">Research Assistant</div>
                      <div className="text-gray-700 font-medium">University of California, Berkeley</div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">Sep 2017 - Feb 2019 • Berkeley</div>
                    <p className="text-gray-600">
                      Assisted in research on machine learning applications for environmental monitoring.
                      Co-authored 3 papers on AI in agricultural systems.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
