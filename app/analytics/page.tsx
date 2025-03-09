'use client';

import { columns, Interaction } from '@/components/analytics/columns';
import { DataTable } from '@/components/analytics/data-table';
import MainLayout from '@/components/layouts/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Globe, MessageSquare, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<Interaction[]>([]);
  const [stats, setStats] = useState({
    totalInteractions: 0,
    uniqueUsers: 0,
    languages: 0,
    avgResponseTime: '0s',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics/store');
        const data = await response.json();
        setAnalyticsData(data.interactions || []);

        // Calculate stats
        const uniqueUsers = new Set(
          data.interactions.map((i: Interaction) => i.userId)
        ).size;
        const uniqueLanguages = new Set(
          data.interactions.map((i: Interaction) => i.language)
        ).size;

        setStats({
          totalInteractions: data.interactions.length,
          uniqueUsers,
          languages: uniqueLanguages,
          avgResponseTime: '0.5s',
        });
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/50">
        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Monitor user interactions and chat performance metrics
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Interactions
                </CardTitle>
                <MessageSquare className="h-5 w-5 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">
                  {stats.totalInteractions}
                </div>
                <p className="text-sm text-muted-foreground">
                  Total chat messages exchanged
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Unique Users
                </CardTitle>
                <Users className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">
                  {stats.uniqueUsers}
                </div>
                <p className="text-sm text-muted-foreground">
                  Distinct users served
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Languages
                </CardTitle>
                <Globe className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{stats.languages}</div>
                <p className="text-sm text-muted-foreground">
                  Active languages used
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Response Time
                </CardTitle>
                <Clock className="h-5 w-5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">
                  {stats.avgResponseTime}
                </div>
                <p className="text-sm text-muted-foreground">
                  Average bot response time
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-xl shadow-md">
            <div className="p-8">
              {/* <h2 className="text-xl font-semibold mb-6">
                Interaction History
              </h2> */}
              <DataTable columns={columns} data={analyticsData} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
