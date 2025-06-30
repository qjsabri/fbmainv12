import React, { useState } from 'react';
import { Gamepad2, Trophy, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MOCK_IMAGES } from '@/lib/constants';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Game {
  id: string;
  title: string;
  image: string;
  players: number;
  category: string;
  achievements?: number;
  totalAchievements?: number;
  lastPlayed?: string;
}

const GamingWidget = () => {
  const navigate = useNavigate();
  const [games] = useState<Game[]>([
    {
      id: '1',
      title: 'Word Puzzle Challenge',
      image: MOCK_IMAGES.POSTS[0],
      players: 125000,
      category: 'Puzzle',
      achievements: 8,
      totalAchievements: 15,
      lastPlayed: '2h ago'
    },
    {
      id: '2',
      title: 'City Builder',
      image: MOCK_IMAGES.POSTS[1],
      players: 89000,
      category: 'Strategy',
      achievements: 12,
      totalAchievements: 20,
      lastPlayed: '1d ago'
    }
  ]);

  const handlePlayGame = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      toast.success(`Playing ${game.title}`);
    }
  };

  const handleViewAll = () => {
    navigate('/gaming');
  };

  return (
    <Card className="hidden lg:block">
      <CardHeader className="p-3">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          <div className="flex items-center">
            <Gamepad2 className="w-5 h-5 mr-2" />
            <span>Gaming</span>
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
          {games.map((game) => (
            <div 
              key={game.id} 
              className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors dark:hover:bg-gray-700"
              onClick={() => handlePlayGame(game.id)}
            >
              <div className="flex space-x-3">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{game.title}</h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1 dark:text-gray-400">
                    <Users className="w-3 h-3" />
                    <span>{formatNumber(game.players)} players</span>
                    <Badge variant="outline" className="text-xs dark:border-gray-600">{game.category}</Badge>
                  </div>
                  {game.achievements && game.totalAchievements && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-300">
                        <Trophy className="w-3 h-3 text-yellow-500" />
                        <span>{game.achievements}/{game.totalAchievements}</span>
                      </div>
                      <Progress 
                        value={(game.achievements / game.totalAchievements) * 100} 
                        className="h-1 mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-blue-600 dark:text-blue-400 dark:border-gray-600"
            onClick={handleViewAll}
          >
            Discover Games
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export default GamingWidget;