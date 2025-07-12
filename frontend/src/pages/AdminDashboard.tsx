
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Shield, Users, MessageSquare, Download, Ban, Check, X, AlertTriangle } from 'lucide-react';

// Mock data
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', joinDate: '2024-01-01' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'active', joinDate: '2024-01-02' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', status: 'banned', joinDate: '2024-01-03' }
];

const mockSkills = [
  { id: '1', skill: 'JavaScript', user: 'John Doe', status: 'pending', type: 'offered' },
  { id: '2', skill: 'Inappropriate Content', user: 'Jane Smith', status: 'flagged', type: 'offered' },
  { id: '3', skill: 'Python', user: 'Bob Wilson', status: 'approved', type: 'wanted' }
];

const mockSwaps = [
  { id: '1', from: 'John Doe', to: 'Jane Smith', skillOffered: 'React', skillWanted: 'Python', status: 'pending', date: '2024-01-15' },
  { id: '2', from: 'Jane Smith', to: 'Bob Wilson', skillOffered: 'Design', skillWanted: 'JavaScript', status: 'accepted', date: '2024-01-14' },
  { id: '3', from: 'Bob Wilson', to: 'John Doe', skillOffered: 'Marketing', skillWanted: 'Web Dev', status: 'rejected', date: '2024-01-13' }
];

const AdminDashboard = () => {
  const [users, setUsers] = useState(mockUsers);
  const [skills, setSkills] = useState(mockSkills);
  const [swaps, setSwaps] = useState(mockSwaps);
  const [announcement, setAnnouncement] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleBanUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'banned' } : user
    ));
    toast({
      title: "User banned",
      description: "User has been banned from the platform",
    });
  };

  const handleUnbanUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'active' } : user
    ));
    toast({
      title: "User unbanned",
      description: "User has been restored to the platform",
    });
  };

  const handleApproveSkill = (skillId: string) => {
    setSkills(prev => prev.map(skill => 
      skill.id === skillId ? { ...skill, status: 'approved' } : skill
    ));
    toast({
      title: "Skill approved",
      description: "The skill has been approved",
    });
  };

  const handleRejectSkill = (skillId: string) => {
    setSkills(prev => prev.map(skill => 
      skill.id === skillId ? { ...skill, status: 'rejected' } : skill
    ));
    toast({
      title: "Skill rejected",
      description: "The skill has been rejected",
    });
  };

  const handleSendAnnouncement = () => {
    if (announcement.trim()) {
      toast({
        title: "Announcement sent",
        description: "Your announcement has been sent to all users",
        duration: 5000,
      });
      setAnnouncement('');
    }
  };

  const handleDownloadReport = (type: string) => {
    // Mock CSV download
    const data = type === 'users' ? users : type === 'swaps' ? swaps : skills;
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(item => Object.values(item).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${type}-report.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Report downloaded",
      description: `${type} report has been downloaded`,
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      banned: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      flagged: 'bg-orange-100 text-orange-800',
      accepted: 'bg-green-100 text-green-800'
    };
    return (
      <Badge className={styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredSwaps = filterStatus === 'all' ? swaps : swaps.filter(swap => swap.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
                <p className="text-gray-600">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Ban className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'banned').length}</p>
                <p className="text-gray-600">Banned Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{swaps.filter(s => s.status === 'accepted').length}</p>
                <p className="text-gray-600">Active Swaps</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{skills.filter(s => s.status === 'flagged').length}</p>
                <p className="text-gray-600">Flagged Skills</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="skills">Skill Moderation</TabsTrigger>
          <TabsTrigger value="swaps">Swap Monitoring</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">User Management</h2>
            <Button onClick={() => handleDownloadReport('users')}>
              <Download className="h-4 w-4 mr-2" />
              Download User Report
            </Button>
          </div>
          
          <div className="space-y-4">
            {users.map(user => (
              <Card key={user.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">Joined: {user.joinDate}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(user.status)}
                      {user.status === 'active' ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleBanUser(user.id)}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Ban User
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleUnbanUser(user.id)}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Unban User
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Skill Moderation</h2>
            <Button onClick={() => handleDownloadReport('skills')}>
              <Download className="h-4 w-4 mr-2" />
              Download Skills Report
            </Button>
          </div>
          
          <div className="space-y-4">
            {skills.map(skill => (
              <Card key={skill.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{skill.skill}</h3>
                      <p className="text-sm text-gray-600">By: {skill.user}</p>
                      <p className="text-xs text-gray-500">Type: {skill.type}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(skill.status)}
                      {skill.status === 'pending' || skill.status === 'flagged' ? (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApproveSkill(skill.id)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRejectSkill(skill.id)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="swaps" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Swap Monitoring</h2>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Swaps</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => handleDownloadReport('swaps')}>
                <Download className="h-4 w-4 mr-2" />
                Download Swaps Report
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredSwaps.map(swap => (
              <Card key={swap.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{swap.from}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-medium">{swap.to}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="text-green-600">Offers:</span> {swap.skillOffered} | 
                        <span className="text-blue-600 ml-2">Wants:</span> {swap.skillWanted}
                      </div>
                      <p className="text-xs text-gray-500">Date: {swap.date}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(swap.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Platform Announcement</CardTitle>
              <CardDescription>
                Send a message to all users on the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="announcement">Announcement Message</Label>
                <Textarea
                  id="announcement"
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="Enter your announcement message..."
                  className="mt-1"
                  rows={4}
                />
              </div>
              <Button 
                onClick={handleSendAnnouncement}
                disabled={!announcement.trim()}
                className="w-full"
              >
                Send Announcement
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
