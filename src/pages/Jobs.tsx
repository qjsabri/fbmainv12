import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Search, Filter, Bookmark, Send, Building, Users, Star, TrendingUp, FileText, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MOCK_IMAGES } from '@/lib/constants';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  salary?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  applicants: number;
  companyLogo: string;
  isBookmarked: boolean;
  isApplied: boolean;
  experienceLevel: 'Entry' | 'Mid' | 'Senior';
  industry: string;
}

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'under_review' | 'interview_scheduled' | 'rejected' | 'accepted';
  lastUpdate: string;
  interviewDate?: string;
}

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recommendations, setRecommendations] = useState<Job[]>([]);

  useEffect(() => {
    // Mock job data
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$120,000 - $160,000',
        description: 'We are looking for a skilled Frontend Developer to join our dynamic team. You will be responsible for developing user-facing web applications using modern JavaScript frameworks.',
        requirements: ['5+ years React experience', 'TypeScript proficiency', 'CSS/SCSS expertise', 'Git version control'],
        benefits: ['Health insurance', 'Dental coverage', '401k matching', 'Flexible PTO', 'Remote work options'],
        postedDate: '2 days ago',
        applicants: 47,
        companyLogo: MOCK_IMAGES.COMPANY_1,
        isBookmarked: false,
        isApplied: false,
        experienceLevel: 'Senior',
        industry: 'Technology'
      },
      {
        id: '2',
        title: 'Marketing Manager',
        company: 'Growth Solutions',
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$80,000 - $100,000',
        description: 'Join our marketing team to drive brand awareness and lead generation. You will develop and execute marketing campaigns across multiple channels.',
        requirements: ['3+ years marketing experience', 'Digital marketing expertise', 'Analytics tools knowledge', 'Project management skills'],
        benefits: ['Health insurance', 'Dental coverage', 'Stock options', 'Professional development budget'],
        postedDate: '1 week ago',
        applicants: 23,
        companyLogo: MOCK_IMAGES.COMPANY_2,
        isBookmarked: true,
        isApplied: false,
        experienceLevel: 'Mid',
        industry: 'Marketing'
      },
      {
        id: '3',
        title: 'UX Designer',
        company: 'Design Studio',
        location: 'Remote',
        type: 'Contract',
        salary: '$60 - $80/hour',
        description: 'We need a talented UX Designer to help create intuitive and engaging user experiences for our clients. This is a 6-month contract with potential for extension.',
        requirements: ['Portfolio of UX work', 'Figma/Sketch proficiency', 'User research experience', 'Prototyping skills'],
        benefits: ['Flexible schedule', 'Remote work', 'Professional development'],
        postedDate: '3 days ago',
        applicants: 31,
        companyLogo: MOCK_IMAGES.COMPANY_3,
        isBookmarked: false,
        isApplied: true,
        experienceLevel: 'Mid',
        industry: 'Design'
      }
    ];
    
    // Mock application data
    const mockApplications = [
      {
        id: '1',
        jobId: '1',
        jobTitle: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        appliedDate: '2024-01-15',
        status: 'under_review',
        lastUpdate: '2024-01-18'
      },
      {
        id: '2',
        jobId: '3',
        jobTitle: 'UX Designer',
        company: 'Creative Studios',
        appliedDate: '2024-01-10',
        status: 'interview_scheduled',
        lastUpdate: '2024-01-16',
        interviewDate: '2024-01-22'
      },
      {
        id: '3',
        jobId: '5',
        jobTitle: 'Product Manager',
        company: 'StartupXYZ',
        appliedDate: '2024-01-05',
        status: 'rejected',
        lastUpdate: '2024-01-12'
      }
    ];

    // Mock recommendations based on user profile
    const mockRecommendations = mockJobs.slice(0, 3);

    setJobs(mockJobs);
    setApplications(mockApplications);
    setRecommendations(mockRecommendations);
    setSelectedJob(mockJobs[0]);
    setLoading(false);
  }, []);

  const handleBookmark = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
    ));
    toast.success('Job bookmarked!');
  };

  const handleApply = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isApplied: true } : job
    ));
    toast.success('Application submitted!');
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Jobs</h1>
        <p className="text-gray-600 dark:text-gray-400">Find your next opportunity</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
          <TabsTrigger value="recommendations">For You ({recommendations.length})</TabsTrigger>
          <TabsTrigger value="saved">Saved ({jobs.filter(j => j.isBookmarked).length})</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10 w-32"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {filteredJobs.map((job) => (
                <Card 
                  key={job.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedJob?.id === job.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={job.companyLogo} alt={job.company} />
                          <AvatarFallback>{job.company[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-sm">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(job.id);
                        }}
                      >
                        <Bookmark className={`w-4 h-4 ${job.isBookmarked ? 'fill-current text-blue-600' : ''}`} />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {job.postedDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{job.type}</Badge>
                      <Badge variant="outline" className="text-xs">{job.experienceLevel}</Badge>
                      {job.isApplied && <Badge className="text-xs bg-green-600">Applied</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Job Details */}
          <div className="lg:col-span-2">
            {selectedJob && (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={selectedJob.companyLogo} alt={selectedJob.company} />
                        <AvatarFallback>{selectedJob.company[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{selectedJob.title}</CardTitle>
                        <p className="text-lg text-gray-600">{selectedJob.company}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {selectedJob.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {selectedJob.postedDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {selectedJob.applicants} applicants
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleBookmark(selectedJob.id)}
                      >
                        <Bookmark className={`w-4 h-4 mr-2 ${selectedJob.isBookmarked ? 'fill-current' : ''}`} />
                        {selectedJob.isBookmarked ? 'Saved' : 'Save'}
                      </Button>
                      <Button
                        onClick={() => handleApply(selectedJob.id)}
                        disabled={selectedJob.isApplied}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {selectedJob.isApplied ? 'Applied' : 'Apply Now'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{selectedJob.type}</Badge>
                    <Badge variant="outline">{selectedJob.experienceLevel}</Badge>
                    <Badge variant="outline">{selectedJob.industry}</Badge>
                    {selectedJob.salary && (
                      <span className="flex items-center gap-1 text-green-600 font-semibold">
                        <DollarSign className="w-4 h-4" />
                        {selectedJob.salary}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Job Description</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedJob.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Benefits</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.benefits.map((benefit, index) => (
                        <Badge key={index} variant="outline">{benefit}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={selectedJob.companyLogo} alt={selectedJob.company} />
                        <AvatarFallback>{selectedJob.company[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{selectedJob.company}</h4>
                        <p className="text-sm text-gray-600">Technology Company • 1,000+ employees</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-current text-yellow-400" />
                          <span className="text-sm">4.5 • 127 reviews</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === 'applied' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.filter(job => job.isApplied).map((job) => (
            <Card key={job.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={job.companyLogo} alt={job.company} />
                    <AvatarFallback>{job.company[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </div>
                </div>
                <Badge className="bg-green-600 mb-2">Applied</Badge>
                <p className="text-sm text-gray-500">Applied {job.postedDate}</p>
              </CardContent>
            </Card>
          ))}
          {jobs.filter(job => job.isApplied).length === 0 && (
            <div className="col-span-full text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold mb-2">No applications yet</h3>
              <p className="text-gray-600">Start applying to jobs to see them here!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">My Applications</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {applications.map((application) => {
              const getStatusIcon = (status: string) => {
                switch (status) {
                  case 'under_review': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
                  case 'interview_scheduled': return <Calendar className="h-4 w-4 text-blue-500" />;
                  case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
                  case 'accepted': return <CheckCircle className="h-4 w-4 text-green-500" />;
                  default: return <FileText className="h-4 w-4 text-gray-500" />;
                }
              };
              
              const getStatusText = (status: string) => {
                switch (status) {
                  case 'under_review': return 'Under Review';
                  case 'interview_scheduled': return 'Interview Scheduled';
                  case 'rejected': return 'Not Selected';
                  case 'accepted': return 'Offer Received';
                  default: return 'Applied';
                }
              };
              
              return (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{application.jobTitle}</h3>
                        <p className="text-gray-600 mb-2">{application.company}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                          <span>Last update: {new Date(application.lastUpdate).toLocaleDateString()}</span>
                          {application.interviewDate && (
                            <span className="text-blue-600 font-medium">
                              Interview: {new Date(application.interviewDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(application.status)}
                        <span className="font-medium">{getStatusText(application.status)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {applications.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold mb-2">No applications yet</h3>
              <p className="text-gray-600">Start applying to jobs to track your applications here!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Recommended for You</h2>
              <p className="text-gray-600">Based on your profile and activity</p>
            </div>
            <Button variant="outline" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Update Preferences
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={job.companyLogo} alt={job.company} />
                      <AvatarFallback>{job.company[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.company}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <DollarSign className="h-3 w-3" />
                      {job.salary || 'Salary not disclosed'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      {job.postedDate}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    <Badge variant="secondary">{job.type}</Badge>
                    <Badge variant="outline">{job.experienceLevel}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Users className="h-3 w-3" />
                      {job.applicants} applicants
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBookmark(job.id)}
                      >
                        <Bookmark className={`h-3 w-3 ${job.isBookmarked ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApply(job.id)}
                        disabled={job.isApplied}
                      >
                        {job.isApplied ? 'Applied' : 'Apply'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.filter(job => job.isBookmarked).map((job) => (
            <Card key={job.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={job.companyLogo} alt={job.company} />
                    <AvatarFallback>{job.company[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{job.type}</Badge>
                  <Badge variant="outline">{job.experienceLevel}</Badge>
                </div>
                <p className="text-sm text-gray-500">{job.location} • {job.postedDate}</p>
              </CardContent>
            </Card>
          ))}
          {jobs.filter(job => job.isBookmarked).length === 0 && (
            <div className="col-span-full text-center py-12">
              <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold mb-2">No saved jobs</h3>
              <p className="text-gray-600">Save jobs you're interested in to view them here!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Job Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={MOCK_IMAGES.PROFILE_1} alt="Profile" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">John Doe</h3>
                <p className="text-gray-600">Software Developer</p>
                <p className="text-sm text-gray-500">San Francisco, CA</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Node.js', 'Python', 'AWS'].map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Experience</h4>
                <div className="space-y-3">
                  <div className="border-l-2 border-blue-600 pl-4">
                    <h5 className="font-medium">Senior Developer</h5>
                    <p className="text-sm text-gray-600">TechCorp • 2020 - Present</p>
                  </div>
                  <div className="border-l-2 border-gray-300 pl-4">
                    <h5 className="font-medium">Frontend Developer</h5>
                    <p className="text-sm text-gray-600">StartupXYZ • 2018 - 2020</p>
                  </div>
                </div>
              </div>
              
              <Button className="w-full">
                <Building className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Jobs;