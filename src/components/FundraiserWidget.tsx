import React, { useState } from 'react';
import { CircleDollarSign, Users, HeartHandshake, DollarSign, Globe, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Fundraiser {
  id: string;
  title: string;
  description: string;
  organizer: {
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  category: string;
  goal: number;
  raised: number;
  currency: string;
  daysLeft: number;
  image: string;
  supporters: number;
  isNonprofit: boolean;
}

const FundraiserWidget = () => {
  const navigate = useNavigate();
  const [fundraisers] = useState<Fundraiser[]>([
    {
      id: '1',
      title: 'Support Local Wildlife Conservation',
      description: 'Help us protect endangered species in our local ecosystem by supporting habitat restoration and conservation efforts.',
      organizer: {
        name: 'Nature Conservation Fund',
        avatar: MOCK_IMAGES.AVATARS[0],
        isVerified: true
      },
      category: 'Environment',
      goal: 10000,
      raised: 7850,
      currency: 'USD',
      daysLeft: 15,
      image: getSafeImage('POSTS', 2),
      supporters: 245,
      isNonprofit: true
    },
    {
      id: '2',
      title: 'Children\'s Hospital Medical Equipment',
      description: 'Help us purchase vital medical equipment for our children\'s hospital to improve care for our youngest patients.',
      organizer: {
        name: 'City Children\'s Hospital',
        avatar: MOCK_IMAGES.AVATARS[1],
        isVerified: true
      },
      category: 'Health',
      goal: 25000,
      raised: 18650,
      currency: 'USD',
      daysLeft: 21,
      image: getSafeImage('POSTS', 3),
      supporters: 532,
      isNonprofit: true
    }
  ]);

  const handleDonate = (fundraiserId: string, amount: number) => {
    const fundraiser = fundraisers.find(f => f.id === fundraiserId);
    if (fundraiser) {
      toast.success(`Thank you for your $${amount} donation to ${fundraiser.title}`);
    }
  };

  const handleShareFundraiser = (fundraiserId: string) => {
    const fundraiser = fundraisers.find(f => f.id === fundraiserId);
    if (fundraiser) {
      navigator.clipboard.writeText(`Check out this fundraiser: ${fundraiser.title}`);
      toast.success('Fundraiser link copied to clipboard');
    }
  };

  const handleViewAll = () => {
    navigate('/fundraisers');
    toast.info('Viewing all fundraisers');
  };

  return (
    <Card className="hidden lg:block">
      <CardHeader className="p-3">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          <div className="flex items-center">
            <CircleDollarSign className="w-5 h-5 mr-2" />
            <span>Fundraisers</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleViewAll}
            className="text-blue-600 text-xs dark:text-blue-400"
          >
            See All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-3">
          {fundraisers.map((fundraiser) => (
            <div key={fundraiser.id} className="p-2 bg-gray-50 rounded-lg dark:bg-gray-800">
              <div className="flex space-x-3">
                <img
                  src={fundraiser.image}
                  alt={fundraiser.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 truncate dark:text-gray-100">{fundraiser.title}</h4>
                  
                  <div className="flex items-center mt-1">
                    <Avatar className="w-4 h-4 mr-1">
                      <AvatarImage src={fundraiser.organizer.avatar} />
                      <AvatarFallback>{fundraiser.organizer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500 truncate dark:text-gray-400">
                      {fundraiser.organizer.name}
                      {fundraiser.organizer.isVerified && " ✓"}
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500 dark:text-gray-400">${fundraiser.raised.toLocaleString()} raised</span>
                      <span className="font-medium">${fundraiser.goal.toLocaleString()}</span>
                    </div>
                    <Progress value={(fundraiser.raised / fundraiser.goal) * 100} className="h-2 bg-gray-200 dark:bg-gray-700" />
                    <div className="flex items-center justify-between mt-1 text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        <Users className="w-3 h-3 inline mr-1" />
                        {fundraiser.supporters} supporters
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">{fundraiser.daysLeft} days left</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 h-7 text-xs mr-1"
                  onClick={() => handleDonate(fundraiser.id, 25)}
                >
                  <HeartHandshake className="w-3 h-3 mr-1" />
                  Donate
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 h-7 text-xs ml-1 dark:border-gray-600 dark:text-gray-200"
                  onClick={() => handleShareFundraiser(fundraiser.id)}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Share
                </Button>
              </div>
              
              {fundraiser.isNonprofit && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs dark:border-gray-600">
                    <Globe className="w-3 h-3 mr-1" />
                    Nonprofit
                  </Badge>
                </div>
              )}
            </div>
          ))}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-blue-600 dark:text-blue-400 dark:border-gray-600"
            onClick={() => toast.info('Create fundraiser feature coming soon')}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Create Fundraiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundraiserWidget;