
import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AccessibleButton from '../components/AccessibleButton';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="p-8">
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-gray-300 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
            <p className="text-gray-600">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="space-y-3">
            <AccessibleButton
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </AccessibleButton>
            <AccessibleButton
              onClick={() => window.location.href = '/'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </AccessibleButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
