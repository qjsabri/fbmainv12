import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'windy';
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    day: string;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'windy';
    high: number;
    low: number;
  }>;
}

const WeatherWidget = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock weather data
        const mockWeather: WeatherData = {
          location: 'San Francisco, CA',
          temperature: 18,
          condition: 'sunny',
          high: 21,
          low: 14,
          humidity: 65,
          windSpeed: 12,
          forecast: [
            { day: 'Mon', condition: 'sunny', high: 21, low: 14 },
            { day: 'Tue', condition: 'cloudy', high: 19, low: 13 },
            { day: 'Wed', condition: 'rainy', high: 17, low: 12 },
            { day: 'Thu', condition: 'cloudy', high: 18, low: 13 },
            { day: 'Fri', condition: 'sunny', high: 22, low: 15 }
          ]
        };
        
        setWeather(mockWeather);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError('Failed to load weather data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWeather();
    
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-6 h-6 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-6 h-6 text-blue-500" />;
      case 'snowy': return <CloudSnow className="w-6 h-6 text-blue-300" />;
      case 'stormy': return <CloudLightning className="w-6 h-6 text-purple-500" />;
      case 'windy': return <Wind className="w-6 h-6 text-gray-400" />;
      default: return <Cloud className="w-6 h-6 text-gray-500" />;
    }
  };

  const convertTemp = (temp: number): number => {
    return unit === 'fahrenheit' ? Math.round((temp * 9/5) + 32) : temp;
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  const handleViewFullWeather = () => {
    navigate('/weather');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-base font-semibold flex items-center">
            <Cloud className="w-5 h-5 mr-2" />
            <span>Weather</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-24 bg-gray-200 rounded mb-2 dark:bg-gray-700"></div>
            <div className="h-6 w-32 bg-gray-200 rounded dark:bg-gray-700"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-base font-semibold flex items-center">
            <Cloud className="w-5 h-5 mr-2" />
            <span>Weather</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">Unable to load weather data</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-3">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          <div className="flex items-center">
            {getWeatherIcon(weather.condition)}
            <span className="ml-2">Weather</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleUnit}
            className="text-xs h-6 px-2"
          >
            °{unit === 'celsius' ? 'C' : 'F'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-medium text-sm dark:text-gray-100">{weather.location}</h3>
            <div className="flex items-center mt-1">
              <Thermometer className="w-3 h-3 text-gray-500 mr-1 dark:text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                H: {convertTemp(weather.high)}° L: {convertTemp(weather.low)}°
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold dark:text-white">
            {convertTemp(weather.temperature)}°
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          {weather.forecast.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-xs font-medium mb-1 dark:text-gray-300">{day.day}</span>
              <div className="mb-1">{getWeatherIcon(day.condition)}</div>
              <span className="text-xs dark:text-gray-300">{convertTemp(day.high)}°</span>
            </div>
          ))}
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between dark:border-gray-700 dark:text-gray-400">
          <span>Humidity: {weather.humidity}%</span>
          <span>Wind: {weather.windSpeed} km/h</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-3 text-blue-600 dark:text-blue-400"
          onClick={handleViewFullWeather}
        >
          View Full Forecast
        </Button>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;