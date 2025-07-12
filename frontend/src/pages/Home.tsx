
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Star, MapPin, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data for users
const mockUsers = [
  {
    id: '1',
    name: 'Marc Demo',
    location: 'San Francisco, CA',
    profilePhoto: '',
    skillsOffered: ['Java Script', 'React'],
    skillsWanted: ['Python', 'Machine Learning'],
    availability: ['weekends'],
    rating: 3.4,
    isPublic: true
  },
  {
    id: '2',
    name: 'Michell',
    location: 'New York, NY',
    profilePhoto: '',
    skillsOffered: ['Java Script', 'React'],
    skillsWanted: ['Python', 'GraphQL'],
    availability: ['evenings'],
    rating: 2.5,
    isPublic: true
  },
  {
    id: '3',
    name: 'Joe Wills',
    location: 'Austin, TX',
    profilePhoto: '',
    skillsOffered: ['Java Script', 'React'],
    skillsWanted: ['Python', 'GraphQL'],
    availability: ['mornings', 'weekends'],
    rating: 4.0,
    isPublic: true
  },
  {
    id: '4',
    name: 'Sarah Chen',
    location: 'Seattle, WA',
    profilePhoto: '',
    skillsOffered: ['Python', 'Data Science', 'Machine Learning'],
    skillsWanted: ['React', 'UI/UX Design'],
    availability: ['evenings', 'weekends'],
    rating: 4.8,
    isPublic: true
  },
  {
    id: '5',
    name: 'Alex Rodriguez',
    location: 'Los Angeles, CA',
    profilePhoto: '',
    skillsOffered: ['UI/UX Design', 'Figma', 'Adobe Creative Suite'],
    skillsWanted: ['JavaScript', 'Web Development'],
    availability: ['mornings', 'evenings'],
    rating: 4.2,
    isPublic: true
  }
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3;

  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const matchesSearch = user.skillsOffered.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      ) || user.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAvailability = availabilityFilter === 'all' || 
        user.availability.includes(availabilityFilter);

      return matchesSearch && matchesAvailability && user.isPublic;
    });
  }, [searchTerm, availabilityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleRequest = (userId: string, userName: string) => {
    toast({
      title: "Request sent!",
      description: `Your swap request has been sent to ${userName}`,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Skill Match</h1>
        <p className="text-gray-600">Connect with others to exchange skills and knowledge</p>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by skill or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Times</SelectItem>
                <SelectItem value="mornings">Mornings</SelectItem>
                <SelectItem value="evenings">Evenings</SelectItem>
                <SelectItem value="weekends">Weekends</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* User Cards */}
      <div className="space-y-4">
        {currentUsers.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500">No users found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          currentUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.profilePhoto} alt={user.name} />
                      <AvatarFallback className="text-lg">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                        {user.location && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            {user.location}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-green-700 mb-1">Skills Offered:</p>
                          <div className="flex flex-wrap gap-1">
                            {user.skillsOffered.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-blue-700 mb-1">Skills Wanted:</p>
                          <div className="flex flex-wrap gap-1">
                            {user.skillsWanted.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {user.availability.join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(user.rating)}
                      <span className="text-sm text-gray-600 ml-1">{user.rating}/5</span>
                    </div>
                    <Button
                      onClick={() => handleRequest(user.id, user.name)}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white"
                    >
                      Request
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              className="w-10"
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
