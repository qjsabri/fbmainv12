import React, { useState, useCallback, useMemo } from 'react';
import { Play, Trophy, Users, Calendar, Star, TrendingUp, Gamepad2, Medal, Crown, Target, Zap, Gift, Sword, Shield, Timer, Award, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { formatNumber } from '@/lib/utils';
import { MOCK_IMAGES } from '@/lib/constants';

interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  players: number;
  isPlaying?: boolean;
  achievements?: number;
  totalAchievements?: number;
  lastPlayed?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  xp: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Tournament {
  id: string;
  name: string;
  game: string;
  startDate: string;
  endDate: string;
  prizePool: number;
  participants: number;
  maxParticipants: number;
  status: 'upcoming' | 'live' | 'ended';
  entryFee: number;
  gameMode: string;
}

interface GameSession {
  id: string;
  game: string;
  duration: number;
  score: number;
  achievements: string[];
  timestamp: string;
}

const Gaming = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [games] = useState<Game[]>([
    {
      id: '1',
      title: 'Word Puzzle Challenge',
      description: 'Test your vocabulary with challenging word puzzles',
      image: MOCK_IMAGES.POSTS[0],
      category: 'Puzzle',
      rating: 4.5,
      players: 125000,
      isPlaying: true,
      achievements: 8,
      totalAchievements: 15,
      lastPlayed: '2 hours ago'
    },
    {
      id: '2',
      title: 'City Builder',
      description: 'Build and manage your own virtual city',
      image: MOCK_IMAGES.POSTS[1],
      category: 'Strategy',
      rating: 4.8,
      players: 89000,
      achievements: 12,
      totalAchievements: 20,
      lastPlayed: '1 day ago'
    },
    {
      id: '3',
      title: 'Racing Championship',
      description: 'High-speed racing with friends',
      image: MOCK_IMAGES.POSTS[2],
      category: 'Racing',
      rating: 4.3,
      players: 234000
    },
    {
      id: '4',
      title: 'Farm Adventure',
      description: 'Grow crops and raise animals in this farming game',
      image: MOCK_IMAGES.POSTS[3],
      category: 'Simulation',
      rating: 4.6,
      players: 156000
    }
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Victory',
      description: 'Win your first game',
      icon: '🏆',
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      xp: 100,
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Word Master',
      description: 'Find 100 words in Word Puzzle Challenge',
      icon: '📝',
      unlocked: true,
      progress: 100,
      maxProgress: 100,
      xp: 250,
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'City Planner',
      description: 'Build a city with 10,000 population',
      icon: '🏙️',
      unlocked: false,
      progress: 7500,
      maxProgress: 10000,
      xp: 500,
      rarity: 'epic'
    },
    {
      id: '4',
      title: 'Speed Demon',
      description: 'Win 10 races in Racing Championship',
      icon: '🏎️',
      unlocked: false,
      progress: 6,
      maxProgress: 10,
      xp: 300,
      rarity: 'rare'
    },
    {
      id: '5',
      title: 'Tournament Champion',
      description: 'Win a tournament',
      icon: '👑',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      xp: 1000,
      rarity: 'legendary'
    }
  ]);

  const [tournaments] = useState<Tournament[]>([
    {
      id: '1',
      name: 'Word Puzzle Championship',
      game: 'Word Puzzle Challenge',
      startDate: '2024-01-15T18:00:00Z',
      endDate: '2024-01-15T22:00:00Z',
      prizePool: 10000,
      participants: 847,
      maxParticipants: 1000,
      status: 'live',
      entryFee: 5,
      gameMode: 'Speed Round'
    },
    {
      id: '2',
      name: 'City Builder Pro Series',
      game: 'City Builder',
      startDate: '2024-01-20T16:00:00Z',
      endDate: '2024-01-20T20:00:00Z',
      prizePool: 25000,
      participants: 234,
      maxParticipants: 500,
      status: 'upcoming',
      entryFee: 10,
      gameMode: 'Competitive Build'
    },
    {
      id: '3',
      name: 'Racing Weekly Cup',
      game: 'Racing Championship',
      startDate: '2024-01-10T19:00:00Z',
      endDate: '2024-01-10T23:00:00Z',
      prizePool: 5000,
      participants: 500,
      maxParticipants: 500,
      status: 'ended',
      entryFee: 2,
      gameMode: 'Time Trial'
    }
  ]);

  const [gameSessions] = useState<GameSession[]>([
    {
      id: '1',
      game: 'Word Puzzle Challenge',
      duration: 1800,
      score: 15420,
      achievements: ['1', '2'],
      timestamp: '2024-01-14T20:30:00Z'
    },
    {
      id: '2',
      game: 'City Builder',
      duration: 2400,
      score: 8750,
      achievements: [],
      timestamp: '2024-01-13T19:15:00Z'
    }
  ]);

  const [leaderboard] = useState([
    { rank: 1, name: 'Sarah Johnson', avatar: MOCK_IMAGES.AVATARS[0], score: 15420 },
    { rank: 2, name: 'Mike Chen', avatar: MOCK_IMAGES.AVATARS[1], score: 14890 },
    { rank: 3, name: 'Emma Wilson', avatar: MOCK_IMAGES.AVATARS[2], score: 14250 },
    { rank: 4, name: 'You', avatar: MOCK_IMAGES.AVATARS[1], score: 13980 },
    { rank: 5, name: 'David Kim', avatar: MOCK_IMAGES.AVATARS[3], score: 13750 }
  ]);

  const handlePlayGame = useCallback((gameId: string) => {
    const game = games.find(g => g.id === gameId);
    toast.success(`Starting ${game?.title}...`);
  }, [games]);

  const handleJoinTournament = useCallback((tournamentId: string) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (tournament?.status === 'upcoming') {
      toast.success(`Joined ${tournament.name}!`);
    } else if (tournament?.status === 'live') {
      toast.info(`${tournament.name} is already live!`);
    } else {
      toast.error('Tournament has ended.');
    }
  }, [tournaments]);

  const getRarityColor = useCallback((rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }, []);

  const totalXP = useMemo(() => {
    return achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);
  }, [achievements]);

  const handleLikeGame = (gameId: string) => {
    // Like game logic
    toast.success(`Liked ${games.find(g => g.id === gameId)?.title || 'game'}`);
  };

  const myGames = games.filter(game => game.isPlaying || game.achievements);
  const discoverGames = games.filter(game => !game.isPlaying && !game.achievements);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Game Center</h1>
        <p className="text-gray-600 dark:text-gray-300">Play games, earn achievements, and compete with friends</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="my-games">My Games ({myGames.length})</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Discover Games */}
        <TabsContent value="discover" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discoverGames.map((game) => (
              <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">{game.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 dark:text-white">{game.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 dark:text-gray-300">{game.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium dark:text-gray-200">{game.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{game.players.toLocaleString()} players</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={() => handlePlayGame(game.id)} className="flex-1">
                      <Play className="w-4 h-4 mr-2" />
                      Play Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLikeGame(game.id)}
                      className="dark:border-gray-600 dark:text-gray-200"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Games */}
        <TabsContent value="my-games" className="space-y-6">
          {myGames.length > 0 ? (
            <div className="space-y-4">
              {myGames.map((game) => (
                <Card key={game.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={game.image}
                        alt={game.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg dark:text-white">{game.title}</h3>
                        <p className="text-gray-600 text-sm dark:text-gray-300">{game.description}</p>
                        {game.lastPlayed && (
                          <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Last played: {game.lastPlayed}</p>
                        )}
                        {game.achievements && (
                          <div className="mt-2">
                            <div className="flex items-center space-x-2">
                              <Trophy className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm dark:text-gray-200">
                                {game.achievements}/{game.totalAchievements} achievements
                              </span>
                            </div>
                            <Progress 
                              value={(game.achievements / (game.totalAchievements || 1)) * 100} 
                              className="mt-1 h-2"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button onClick={() => handlePlayGame(game.id)}>
                          <Play className="w-4 h-4 mr-2" />
                          Continue
                        </Button>
                        <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-200">{game.category}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Gamepad2 className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No games yet</h3>
              <p className="text-gray-500 mb-4 dark:text-gray-400">Start playing games to see them here</p>
              <Button onClick={() => setActiveTab('discover')}>
                Discover Games
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`${achievement.unlocked ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/30' : 'dark:bg-gray-800 dark:border-gray-700'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${achievement.unlocked ? 'text-yellow-800 dark:text-yellow-400' : 'text-gray-900 dark:text-white'}`}>
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description}</p>
                      {!achievement.unlocked && achievement.progress && achievement.maxProgress && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1 dark:text-gray-400">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.maxProgress) * 100} 
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                    {achievement.unlocked && (
                      <Trophy className="w-6 h-6 text-yellow-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>Weekly Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((player) => (
                  <div
                    key={player.rank}
                    className={`flex items-center space-x-4 p-3 rounded-lg ${
                      player.name === 'You' ? 'bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      player.rank === 1 ? 'bg-yellow-500 text-white' :
                      player.rank === 2 ? 'bg-gray-400 text-white' :
                      player.rank === 3 ? 'bg-orange-500 text-white' :
                      'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {player.rank}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={player.avatar} />
                      <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className={`font-medium ${player.name === 'You' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                        {player.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold dark:text-white">{player.score.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Gaming;