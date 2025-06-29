import React, { useState } from 'react';
import { Gift, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MOCK_IMAGES } from '@/lib/constants';
import { toast } from 'sonner';

interface Birthday {
  id: string;
  name: string;
  avatar: string;
  isToday: boolean;
  age?: number;
}

const BirthdayWidget = () => {
  const [birthdays] = useState<Birthday[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: MOCK_IMAGES.AVATARS[0],
      isToday: true,
      age: 28
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: MOCK_IMAGES.AVATARS[1],
      isToday: false
    }
  ]);

  const todaysBirthdays = birthdays.filter(b => b.isToday);
  const upcomingBirthdays = birthdays.filter(b => !b.isToday);

  const handleWishHappyBirthday = (name: string) => {
    toast.success(`Birthday wish sent to ${name}`);
  };

  if (birthdays.length === 0) return null;

  return (
    <Card>
      <CardHeader className="p-3">
        <CardTitle className="text-sm sm:text-base font-semibold flex items-center">
          <Gift className="w-5 h-5 mr-2" />
          <span>Birthdays</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-2">
          {todaysBirthdays.map((birthday) => (
            <div key={birthday.id} className="flex items-center space-x-3 p-2 bg-pink-50 rounded-lg dark:bg-pink-900/20">
              <div className="relative">
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                  <AvatarImage src={birthday.avatar} />
                  <AvatarFallback>{birthday.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 dark:bg-gray-800">
                  <Gift className="w-3 h-3 text-pink-500" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs sm:text-sm text-gray-900 truncate dark:text-white">
                  {birthday.name}
                  {birthday.age && (
                    <span className="text-gray-500"> turns {birthday.age}</span>
                  )}
                </p>
                <p className="text-xs text-pink-600 line-clamp-1 dark:text-pink-400">Today is their birthday! 🎉</p>
              </div>
              <Button 
                size="sm"
                onClick={() => handleWishHappyBirthday(birthday.name)} 
                className="bg-pink-500 hover:bg-pink-600 text-white text-xs h-6 sm:h-7 px-2 sm:px-3"
              >
                Wish
              </Button>
            </div>
          ))}

          {upcomingBirthdays.map((birthday) => (
            <div key={birthday.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg dark:hover:bg-gray-700">
              <Avatar className="w-8 h-8">
                <AvatarImage src={birthday.avatar} />
                <AvatarFallback>{birthday.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate dark:text-white">{birthday.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Birthday coming up</p>
              </div>
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BirthdayWidget;