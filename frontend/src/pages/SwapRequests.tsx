
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Check, X, Star, Clock, User, Search } from 'lucide-react';

interface SwapRequest {
  id: string;
  fromUser: {
    id: string;
    name: string;
    profilePhoto: string;
    rating: number;
  };
  toUser: {
    id: string;
    name: string;
    profilePhoto: string;
    rating: number;
  };
  skillOffered: string;
  skillWanted: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message?: string;
  createdAt: string;
  isIncoming: boolean;
}

// Mock data
const mockRequests: SwapRequest[] = [
  {
    id: '1',
    fromUser: { id: '2', name: 'Marc Demo', profilePhoto: '', rating: 3.4 },
    toUser: { id: '1', name: 'John Doe', profilePhoto: '', rating: 4.5 },
    skillOffered: 'Java Script',
    skillWanted: 'Python',
    status: 'pending',
    message: 'I would love to learn Python from you!',
    createdAt: '2024-01-15',
    isIncoming: true
  },
  {
    id: '2',
    fromUser: { id: '1', name: 'John Doe', profilePhoto: '', rating: 4.5 },
    toUser: { id: '3', name: 'Sarah Chen', profilePhoto: '', rating: 4.8 },
    skillOffered: 'React',
    skillWanted: 'Machine Learning',
    status: 'accepted',
    createdAt: '2024-01-10',
    isIncoming: false
  },
  {
    id: '3',
    fromUser: { id: '4', name: 'Alex Rodriguez', profilePhoto: '', rating: 4.2 },
    toUser: { id: '1', name: 'John Doe', profilePhoto: '', rating: 4.5 },
    skillOffered: 'UI/UX Design',
    skillWanted: 'JavaScript',
    status: 'rejected',
    createdAt: '2024-01-08',
    isIncoming: true
  }
];

const SwapRequests = () => {
  const [requests, setRequests] = useState<SwapRequest[]>(mockRequests);
  const [statusFilter, setStatusFilter] = useState('all');
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' });
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(null);

  const filteredRequests = requests.filter(request => 
    statusFilter === 'all' || request.status === statusFilter
  );

  const incomingRequests = filteredRequests.filter(req => req.isIncoming && req.status === 'pending');
  const sentRequests = filteredRequests.filter(req => !req.isIncoming);
  const completedRequests = filteredRequests.filter(req => req.status === 'accepted');

  const handleAcceptRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'accepted' as const } : req
    ));
    toast({
      title: "Request accepted",
      description: "You can now coordinate your skill swap!",
    });
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' as const } : req
    ));
    toast({
      title: "Request rejected",
      description: "The request has been declined.",
    });
  };

  const handleSubmitFeedback = () => {
    if (selectedRequest && feedback.rating > 0) {
      setRequests(prev => prev.map(req => 
        req.id === selectedRequest.id ? { ...req, status: 'completed' as const } : req
      ));
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
      setFeedback({ rating: 0, comment: '' });
      setSelectedRequest(null);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 cursor-pointer ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
        onClick={() => interactive && onRate && onRate(i + 1)}
      />
    ));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const RequestCard = ({ request }: { request: SwapRequest }) => {
    const otherUser = request.isIncoming ? request.fromUser : request.toUser;
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={otherUser.profilePhoto} alt={otherUser.name} />
              <AvatarFallback>
                {otherUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
                {getStatusBadge(request.status)}
              </div>
              
              <div className="flex items-center gap-1">
                {renderStars(otherUser.rating)}
                <span className="text-sm text-gray-600 ml-1">{otherUser.rating}/5</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-green-600 font-medium">Offers:</span> {request.skillOffered}
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Wants:</span> {request.skillWanted}
                </div>
              </div>
              
              {request.message && (
                <p className="text-sm text-gray-600 italic">"{request.message}"</p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {new Date(request.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex gap-2">
              {request.isIncoming && request.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleAcceptRequest(request.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRejectRequest(request.id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
              
              {request.status === 'accepted' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedRequest(request)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Leave Feedback
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Rate Your Experience</DialogTitle>
                      <DialogDescription>
                        How was your skill swap with {otherUser.name}?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Rating</Label>
                        <div className="flex gap-1 mt-2">
                          {renderStars(feedback.rating, true, (rating) => 
                            setFeedback({ ...feedback, rating })
                          )}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="comment">Comment (optional)</Label>
                        <Textarea
                          id="comment"
                          value={feedback.comment}
                          onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                          placeholder="Share your experience..."
                          className="mt-1"
                        />
                      </div>
                      <Button 
                        onClick={handleSubmitFeedback} 
                        disabled={feedback.rating === 0}
                        className="w-full"
                      >
                        Submit Feedback
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Swap Requests</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="incoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="incoming">
            Incoming ({incomingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Sent ({sentRequests.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active Swaps ({completedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="space-y-4">
          {incomingRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No incoming requests</p>
              </CardContent>
            </Card>
          ) : (
            incomingRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No sent requests</p>
              </CardContent>
            </Card>
          ) : (
            sentRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {completedRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Check className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No active swaps</p>
              </CardContent>
            </Card>
          ) : (
            completedRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SwapRequests;
