import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, MapPin, Droplets, Compass, Search, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface WeatherData {
  location: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'windy';
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  visibility: number;
  sunrise: string;
  sunset: string;
  forecast: Array<{
    day: string;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'windy';
    high: number;
    low: number;
    chanceOfRain: number;
  }>;
  hourly: Array<{
    time: string;
    temperature: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'windy';
  }>;
}

const Weather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    fetchWeather('San Francisco, CA');
  }, []);

  const fetchWeather = async (location: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock weather data
      const mockWeather: WeatherData = {
        location,
        temperature: 18,
        condition: 'sunny',
        high: 21,
        low: 14,
        humidity: 65,
        windSpeed: 12,
        windDirection: 'NW',
        pressure: 1012,
        visibility: 10,
        sunrise: '6:45 AM',
        sunset: '7:30 PM',
        forecast: [
          { day: 'Today', condition: 'sunny', high: 21, low: 14, chanceOfRain: 0 },
          { day: 'Mon', condition: 'cloudy', high: 19, low: 13, chanceOfRain: 20 },
          { day: 'Tue', condition: 'rainy', high: 17, low: 12, chanceOfRain: 80 },
          { day: 'Wed', condition: 'cloudy', high: 18, low: 13, chanceOfRain: 30 },
          { day: 'Thu', condition: 'sunny', high: 22, low: 15, chanceOfRain: 0 },
          { day: 'Fri', condition: 'sunny', high: 23, low: 16, chanceOfRain: 0 },
          { day: 'Sat', condition: 'cloudy', high: 20, low: 14, chanceOfRain: 10 }
        ],
        hourly: [
          { time: 'Now', temperature: 18, condition: 'sunny' },
          { time: '1 PM', temperature: 19, condition: 'sunny' },
          { time: '2 PM', temperature: 20, condition: 'sunny' },
          { time: '3 PM', temperature: 21, condition: 'sunny' },
          { time: '4 PM', temperature: 20, condition: 'cloudy' },
          { time: '5 PM', temperature: 19, condition: 'cloudy' },
          { time: '6 PM', temperature: 18, condition: 'cloudy' },
          { time: '7 PM', temperature: 17, condition: 'cloudy' },
          { time: '8 PM', temperature: 16, condition: 'cloudy' }
        ]
      };
      
      setWeather(mockWeather);
      toast.success(`Weather loaded for ${location}`);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Failed to load weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeather(searchQuery);
    }
  };

  const getWeatherIcon = (condition: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeMap = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-10 h-10'
    };
    
    const sizeClass = sizeMap[size];
    
    switch (condition) {
      case 'sunny': return <Sun className={`${sizeClass} text-yellow-500`} />;
      case 'cloudy': return <Cloud className={`${sizeClass} text-gray-500`} />;
      case 'rainy': return <CloudRain className={`${sizeClass} text-blue-500`} />;
      case 'snowy': return <CloudSnow className={`${sizeClass} text-blue-300`} />;
      case 'stormy': return <CloudLightning className={`${sizeClass} text-purple-500`} />;
      case 'windy': return <Wind className={`${sizeClass} text-gray-400`} />;
      default: return <Cloud className={`${sizeClass} text-gray-500`} />;
    }
  };

  const convertTemp = (temp: number): number => {
    return unit === 'fahrenheit' ? Math.round((temp * 9/5) + 32) : temp;
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">Weather</h1>
        <p className="text-gray-600 dark:text-gray-300">Check current weather and forecast</p>
      </div>
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <Button type="submit">Search</Button>
          <Button 
            variant="outline" 
            onClick={toggleUnit}
            className="min-w-20 dark:border-gray-600 dark:text-gray-200"
          >
            °{unit === 'celsius' ? 'C' : 'F'}
          </Button>
        </form>
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="p-8 flex justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-16 w-16 bg-gray-200 rounded-full mb-4 dark:bg-gray-700"></div>
              <div className="h-8 w-48 bg-gray-200 rounded mb-2 dark:bg-gray-700"></div>
              <div className="h-4 w-32 bg-gray-200 rounded dark:bg-gray-700"></div>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">Unable to load weather data</h3>
            <p className="text-gray-600 mb-4 dark:text-gray-400">{error}</p>
            <Button onClick={() => fetchWeather('San Francisco, CA')}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : weather ? (
        <div className="space-y-6">
          {/* Current Weather */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="mr-4">
                    {getWeatherIcon(weather.condition, 'lg')}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{convertTemp(weather.temperature)}°</h2>
                    <p className="text-xl capitalize">{weather.condition}</p>
                    <div className="flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{weather.location}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-80">High</p>
                    <p className="text-xl font-semibold">{convertTemp(weather.high)}°</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Low</p>
                    <p className="text-xl font-semibold">{convertTemp(weather.low)}°</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Sunrise</p>
                    <p className="text-xl font-semibold">{weather.sunrise}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Sunset</p>
                    <p className="text-xl font-semibold">{weather.sunset}</p>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <Droplets className="w-5 h-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
                    <p className="font-medium dark:text-white">{weather.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Wind className="w-5 h-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Wind</p>
                    <p className="font-medium dark:text-white">{weather.windSpeed} km/h</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Compass className="w-5 h-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Direction</p>
                    <p className="font-medium dark:text-white">{weather.windDirection}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Eye className="w-5 h-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Visibility</p>
                    <p className="font-medium dark:text-white">{weather.visibility} km</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Forecast Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">7-Day Forecast</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg dark:text-white">Hourly Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-thin">
                    {weather.hourly.map((hour, index) => (
                      <div key={index} className="flex flex-col items-center min-w-[80px]">
                        <p className="text-sm font-medium dark:text-gray-300">{hour.time}</p>
                        <div className="my-2">
                          {getWeatherIcon(hour.condition)}
                        </div>
                        <p className="font-bold dark:text-white">{convertTemp(hour.temperature)}°</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="week" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg dark:text-white">7-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weather.forecast.map((day, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          index === 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 text-center">
                            <p className="font-medium dark:text-white">{day.day}</p>
                          </div>
                          <div>
                            {getWeatherIcon(day.condition)}
                          </div>
                          <div>
                            <p className="font-medium dark:text-white capitalize">{day.condition}</p>
                            {day.chanceOfRain > 0 && (
                              <p className="text-xs text-blue-600 dark:text-blue-400">{day.chanceOfRain}% chance of rain</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="font-bold dark:text-white">{convertTemp(day.high)}°</p>
                          <p className="text-gray-500 dark:text-gray-400">{convertTemp(day.low)}°</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
    </div>
  );
};



export default Weather;