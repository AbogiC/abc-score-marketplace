import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Music, Clock, TrendingUp, BookOpen, Play, Users, Star, Library, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const { user } = useAuth();
  const [latestMusic, setLatestMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSheets: 0,
    totalCourses: 0,
    recentActivity: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/dashboard/latest`);
      const data = await response.json();
      setLatestMusic(data.latest_sheet_music || []);
      
      // Mock stats for demo
      setStats({
        totalSheets: data.latest_sheet_music?.length || 0,
        totalCourses: 12,
        recentActivity: 5
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-text font-crimson">
          Welcome back, {user?.displayName || user?.fullName || 'Musician'}!
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Discover the latest sheet music additions and continue your musical journey
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sheet Music</CardTitle>
            <Music className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSheets}+</div>
            <p className="text-xs text-muted-foreground">Available in library</p>
          </CardContent>
        </Card>

        <Card className="glass card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Theory Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Interactive lessons</p>
          </CardContent>
        </Card>

        <Card className="glass card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-muted-foreground">Updates this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Latest Sheet Music */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold font-crimson text-slate-800">Latest Sheet Music</h2>
          <Button asChild className="btn-animated bg-indigo-600 hover:bg-indigo-700">
            <Link to="/library">View All</Link>
          </Button>
        </div>

        {latestMusic.length === 0 ? (
          <Card className="glass">
            <CardContent className="text-center py-12">
              <Music className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No Sheet Music Yet</h3>
              <p className="text-slate-500 mb-4">Be the first to add some sheet music to the library!</p>
              <Button asChild className="btn-animated">
                <Link to="/library">Browse Library</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestMusic.map((sheet) => (
              <Card key={sheet.id} className="glass card-hover group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-crimson group-hover:text-indigo-600 transition-colors">
                        {sheet.title}
                      </CardTitle>
                      <CardDescription className="font-medium text-slate-600">
                        by {sheet.composer}
                      </CardDescription>
                    </div>
                    {sheet.sample_mp3_url && (
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={`${getDifficultyColor(sheet.difficulty)} border-0`}>
                        {sheet.difficulty}
                      </Badge>
                      <span className="text-lg font-bold text-indigo-600">
                        ${sheet.price?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {sheet.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(sheet.created_at)}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                        <span>{sheet.genre}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass card-hover bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center text-indigo-800">
              <Library className="w-5 h-5 mr-2" />
              Explore Library
            </CardTitle>
            <CardDescription>Browse our extensive collection of sheet music</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="btn-animated bg-indigo-600 hover:bg-indigo-700 w-full">
              <Link to="/library">Browse Sheet Music</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass card-hover bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800">
              <GraduationCap className="w-5 h-5 mr-2" />
              Learn Theory
            </CardTitle>
            <CardDescription>Master music theory with interactive lessons</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="btn-animated bg-purple-600 hover:bg-purple-700 w-full">
              <Link to="/theory">Start Learning</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;