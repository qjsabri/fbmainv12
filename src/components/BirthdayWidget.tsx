import React, { useState } from 'react';
import { Gift, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MOCK_IMAGES } from '@/lib/constants';

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

  const handleWishHappyBirthday = (_name: string) => {
    // Birthday wish sent
  };

  if (birthdays.length === 0) return null;

  return (
    <Card>
      <CardHeader className="p-3">
        <CardTitle className="text-sm sm:text-base font-semibold flex items-center">
          <Gift className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-pink-500" />
          <span>Birthdays</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-3">
          {todaysBirthdays.map((birthday) => (
            <div key={birthday.id} className="flex items-center space-x-3 p-2 bg-pink-50 rounded-lg">
              <div className="relative">
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                  <AvatarImage src={birthday.avatar} />
                  <AvatarFallback>{birthday.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                  <Gift className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-xs sm:text-sm text-gray-900">
                  {birthday.name}
                  {birthday.age && (
                    <span className="text-gray-500"> turns {birthday.age}</span>
                  )}
                </p>
                <p className="text-xs text-pink-600 line-clamp-1">Today is their birthday! 🎉</p>
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
            <div key={birthday.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
              <Avatar className="w-8 h-8">
                <AvatarImage src={birthday.avatar} />
                <AvatarFallback>{birthday.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900">{birthday.name}</p>
                <p className="text-xs text-gray-500">Birthday coming up</p>
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