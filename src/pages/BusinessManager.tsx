import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Target, Settings, Plus, Calendar, Eye, MousePointer, ShoppingCart, Zap, PieChart, LineChart, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MOCK_IMAGES } from '@/lib/constants';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  name: string;
  status: 'Active' | 'Paused' | 'Completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  startDate: string;
  endDate: string;
  objective: string;
}

interface AdAccount {
  id: string;
  name: string;
  currency: string;
  balance: number;
  campaigns: number;
  status: 'Active' | 'Restricted';
}

interface BusinessAsset {
  id: string;
  name: string;
  type: 'Page' | 'Ad Account' | 'Pixel' | 'Catalog';
  status: 'Active' | 'Inactive';
  lastActivity: string;
}

const BusinessManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [businessAssets, setBusinessAssets] = useState<BusinessAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'Summer Sale Campaign',
        status: 'Active',
        budget: 5000,
        spent: 3250,
        impressions: 125000,
        clicks: 2500,
        conversions: 125,
        ctr: 2.0,
        cpc: 1.30,
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        objective: 'Conversions'
      },
      {
        id: '2',
        name: 'Brand Awareness Q1',
        status: 'Active',
        budget: 3000,
        spent: 1800,
        impressions: 89000,
        clicks: 1200,
        conversions: 45,
        ctr: 1.35,
        cpc: 1.50,
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        objective: 'Brand Awareness'
      },
      {
        id: '3',
        name: 'Product Launch',
        status: 'Paused',
        budget: 2000,
        spent: 2000,
        impressions: 45000,
        clicks: 900,
        conversions: 67,
        ctr: 2.0,
        cpc: 2.22,
        startDate: '2023-12-01',
        endDate: '2023-12-31',
        objective: 'Traffic'
      }
    ];

    const mockAdAccounts: AdAccount[] = [
      {
        id: '1',
        name: 'Main Business Account',
        currency: 'USD',
        balance: 1250.50,
        campaigns: 8,
        status: 'Active'
      },
      {
        id: '2',
        name: 'E-commerce Store',
        currency: 'USD',
        balance: 750.25,
        campaigns: 3,
        status: 'Active'
      }
    ];

    const mockAssets: BusinessAsset[] = [
      {
        id: '1',
        name: 'TechCorp Official Page',
        type: 'Page',
        status: 'Active',
        lastActivity: '2 hours ago'
      },
      {
        id: '2',
        name: 'Main Ad Account',
        type: 'Ad Account',
        status: 'Active',
        lastActivity: '1 hour ago'
      },
      {
        id: '3',
        name: 'Website Pixel',
        type: 'Pixel',
        status: 'Active',
        lastActivity: '30 minutes ago'
      },
      {
        id: '4',
        name: 'Product Catalog',
        type: 'Catalog',
        status: 'Active',
        lastActivity: '1 day ago'
      }
    ];

    setCampaigns(mockCampaigns);
    setAdAccounts(mockAdAccounts);
    setBusinessAssets(mockAssets);
    setLoading(false);
  }, []);

  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0);
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const avgCTR = totalClicks > 0 ? (totalClicks / totalImpressions * 100) : 0;
  const avgCPC = totalClicks > 0 ? (totalSpent / totalClicks) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Business Manager</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your business presence and advertising</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="accounts">Ad Accounts</TabsTrigger>
          <TabsTrigger value="assets">Business Assets</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12% from last month
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Impressions</p>
                    <p className="text-2xl font-bold">{(totalImpressions / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +8% from last month
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Clicks</p>
                    <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +15% from last month
                    </p>
                  </div>
                  <MousePointer className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversions</p>
                    <p className="text-2xl font-bold">{totalConversions}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +22% from last month
                    </p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Campaign Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.slice(0, 3).map((campaign) => (
                    <div key={campaign.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{campaign.name}</span>
                        <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Spent: ${campaign.spent}</span>
                        <span>Budget: ${campaign.budget}</span>
                      </div>
                      <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average CTR</span>
                    <span className="font-semibold">{avgCTR.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average CPC</span>
                    <span className="font-semibold">${avgCPC.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="font-semibold">{((totalConversions / totalClicks) * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cost per Conversion</span>
                    <span className="font-semibold">${(totalSpent / totalConversions).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-20 flex-col gap-2">
                  <Plus className="w-6 h-6" />
                  Create Campaign
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <BarChart3 className="w-6 h-6" />
                  View Reports
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Settings className="w-6 h-6" />
                  Account Settings
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Users className="w-6 h-6" />
                  Audience Insights
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Campaigns</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-gray-600">{campaign.objective}</p>
                    </div>
                    <Badge variant={campaign.status === 'Active' ? 'default' : campaign.status === 'Paused' ? 'secondary' : 'outline'}>
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="font-semibold">${campaign.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Spent</p>
                      <p className="font-semibold">${campaign.spent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Impressions</p>
                      <p className="font-semibold">{campaign.impressions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Clicks</p>
                      <p className="font-semibold">{campaign.clicks.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">CTR</p>
                      <p className="font-semibold">{campaign.ctr}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">CPC</p>
                      <p className="font-semibold">${campaign.cpc}</p>
                    </div>
                  </div>
                  
                  <Progress value={(campaign.spent / campaign.budget) * 100} className="mb-2" />
                  <p className="text-xs text-gray-500">
                    {((campaign.spent / campaign.budget) * 100).toFixed(1)}% of budget used
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Ad Accounts</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adAccounts.map((account) => (
              <Card key={account.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{account.name}</h3>
                    <Badge variant={account.status === 'Active' ? 'default' : 'destructive'}>
                      {account.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Balance</span>
                      <span className="font-semibold">${account.balance} {account.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Campaigns</span>
                      <span className="font-semibold">{account.campaigns}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Currency</span>
                      <span className="font-semibold">{account.currency}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Business Assets</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businessAssets.map((asset) => (
              <Card key={asset.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline">{asset.type}</Badge>
                    <Badge variant={asset.status === 'Active' ? 'default' : 'secondary'}>
                      {asset.status}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold mb-2">{asset.name}</h3>
                  <p className="text-sm text-gray-600">Last activity: {asset.lastActivity}</p>
                  
                  <Button size="sm" className="w-full mt-4">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Business Insights</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded">
                  <p className="text-gray-500">Performance chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Audience Demographics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Age 25-34</span>
                      <span className="text-sm font-semibold">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Age 35-44</span>
                      <span className="text-sm font-semibold">28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Age 18-24</span>
                      <span className="text-sm font-semibold">22%</span>
                    </div>
                    <Progress value={22} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Age 45+</span>
                      <span className="text-sm font-semibold">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Optimize Budget Allocation</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-200">Your Summer Sale Campaign is performing 22% better than average. Consider increasing its budget.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Target className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 dark:text-green-100">Expand Audience</h4>
                    <p className="text-sm text-green-700 dark:text-green-200">Your current audience is responding well. Try expanding to similar demographics.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-900 dark:text-orange-100">Schedule Optimization</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-200">Your ads perform best between 2-6 PM. Consider adjusting your ad schedule.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BusinessManager;