import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { BookOpen, GraduationCap, Clock, PlayCircle, CheckCircle, Star } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MusicTheory = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/courses`);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Set demo courses for now
      setCourses([
        {
          id: '1',
          title: 'Music Theory Fundamentals',
          description: 'Learn the basics of music theory including notes, scales, and intervals.',
          category: 'Theory',
          difficulty: 'Beginner',
          content: `
            <h2>Introduction to Music Theory</h2>
            <p>Music theory is the study of the practices and possibilities of music. It provides a framework for understanding how music works.</p>
            
            <h3>The Musical Alphabet</h3>
            <p>Music uses seven letter names: A, B, C, D, E, F, G. These letters repeat infinitely.</p>
            
            <h3>Sharps and Flats</h3>
            <p>Between most letter names, we have sharps (#) and flats (♭):</p>
            <ul>
              <li>A, A#/B♭, B, C, C#/D♭, D, D#/E♭, E, F, F#/G♭, G, G#/A♭</li>
            </ul>
            
            <h3>Intervals</h3>
            <p>An interval is the distance between two notes. The most common intervals are:</p>
            <ul>
              <li>Unison (0 semitones)</li>
              <li>Minor 2nd (1 semitone)</li>
              <li>Major 2nd (2 semitones)</li>
              <li>Minor 3rd (3 semitones)</li>
              <li>Major 3rd (4 semitones)</li>
              <li>Perfect 4th (5 semitones)</li>
              <li>Tritone (6 semitones)</li>
              <li>Perfect 5th (7 semitones)</li>
              <li>Octave (12 semitones)</li>
            </ul>
          `
        },
        {
          id: '2',
          title: 'Major and Minor Scales',
          description: 'Understanding the construction and application of major and minor scales.',
          category: 'Theory',
          difficulty: 'Beginner',
          content: `
            <h2>Major and Minor Scales</h2>
            
            <h3>The Major Scale</h3>
            <p>The major scale follows the pattern: Whole-Whole-Half-Whole-Whole-Whole-Half</p>
            <p>C Major Scale: C - D - E - F - G - A - B - C</p>
            
            <h3>Scale Degrees</h3>
            <p>Each note in a scale has a number and name:</p>
            <ul>
              <li>1st degree: Tonic (Do)</li>
              <li>2nd degree: Supertonic (Re)</li>
              <li>3rd degree: Mediant (Mi)</li>
              <li>4th degree: Subdominant (Fa)</li>
              <li>5th degree: Dominant (Sol)</li>
              <li>6th degree: Submediant (La)</li>
              <li>7th degree: Leading Tone (Ti)</li>
            </ul>
            
            <h3>The Natural Minor Scale</h3>
            <p>The natural minor scale follows: Whole-Half-Whole-Whole-Half-Whole-Whole</p>
            <p>A Minor Scale: A - B - C - D - E - F - G - A</p>
          `
        },
        {
          id: '3',
          title: 'Basic Chord Theory',
          description: 'Learn how to build and understand triads and seventh chords.',
          category: 'Harmony',
          difficulty: 'Intermediate',
          content: `
            <h2>Basic Chord Theory</h2>
            
            <h3>What is a Chord?</h3>
            <p>A chord is three or more different notes played simultaneously.</p>
            
            <h3>Triads</h3>
            <p>The most basic chords are triads, built using the 1st, 3rd, and 5th degrees of a scale.</p>
            
            <h4>Major Triad</h4>
            <p>Major 3rd + Minor 3rd = Major Triad</p>
            <p>C Major: C - E - G</p>
            
            <h4>Minor Triad</h4>
            <p>Minor 3rd + Major 3rd = Minor Triad</p>
            <p>C Minor: C - E♭ - G</p>
            
            <h4>Diminished Triad</h4>
            <p>Minor 3rd + Minor 3rd = Diminished Triad</p>
            <p>C Diminished: C - E♭ - G♭</p>
            
            <h4>Augmented Triad</h4>
            <p>Major 3rd + Major 3rd = Augmented Triad</p>
            <p>C Augmented: C - E - G#</p>
          `
        },
        {
          id: '4',
          title: 'Rhythm and Time Signatures',
          description: 'Understanding rhythm, beat, and time signatures in music.',
          category: 'Rhythm',
          difficulty: 'Beginner',
          content: `
            <h2>Rhythm and Time Signatures</h2>
            
            <h3>Beat and Tempo</h3>
            <p>Beat is the regular pulse in music. Tempo is how fast or slow the beat is.</p>
            
            <h3>Note Values</h3>
            <ul>
              <li>Whole note = 4 beats</li>
              <li>Half note = 2 beats</li>
              <li>Quarter note = 1 beat</li>
              <li>Eighth note = 1/2 beat</li>
              <li>Sixteenth note = 1/4 beat</li>
            </ul>
            
            <h3>Time Signatures</h3>
            <p>Time signatures tell us how to count time in music.</p>
            
            <h4>4/4 Time</h4>
            <p>4 beats per measure, quarter note gets the beat</p>
            <p>Count: 1, 2, 3, 4</p>
            
            <h4>3/4 Time (Waltz Time)</h4>
            <p>3 beats per measure, quarter note gets the beat</p>
            <p>Count: 1, 2, 3</p>
            
            <h4>2/4 Time</h4>
            <p>2 beats per measure, quarter note gets the beat</p>
            <p>Count: 1, 2</p>
          `
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(courses.map(course => course.category))];

  const filteredCourses = activeTab === 'all' 
    ? courses 
    : courses.filter(course => course.category === activeTab);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'theory': return BookOpen;
      case 'harmony': return Star;
      case 'rhythm': return Clock;
      default: return GraduationCap;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSelectedCourse(null)}
            className="mb-6"
          >
            ← Back to Courses
          </Button>
          <div className="flex items-center space-x-4">
            <Badge className={getDifficultyColor(selectedCourse.difficulty)}>
              {selectedCourse.difficulty}
            </Badge>
            <Badge variant="outline">{selectedCourse.category}</Badge>
          </div>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-3xl font-crimson">{selectedCourse.title}</CardTitle>
            <CardDescription className="text-lg">{selectedCourse.description}</CardDescription>
            <Progress value={33} className="mt-4" />
            <p className="text-sm text-slate-600">Progress: 33% complete</p>
          </CardHeader>
          <CardContent>
            <div 
              className="theory-content prose max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedCourse.content }}
            />
            <div className="mt-8 pt-6 border-t flex justify-between">
              <Button variant="outline">← Previous Lesson</Button>
              <Button className="btn-animated bg-indigo-600 hover:bg-indigo-700">
                Next Lesson →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-text font-crimson">Music Theory Education</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Master music theory with our interactive lessons and comprehensive courses
        </p>
      </div>

      {/* Category Filter */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-lg mx-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-8">
          {filteredCourses.length === 0 ? (
            <Card className="glass">
              <CardContent className="text-center py-12">
                <GraduationCap className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No Courses Available</h3>
                <p className="text-slate-500">Check back later for new courses in this category.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const IconComponent = getCategoryIcon(course.category);
                return (
                  <Card key={course.id} className="glass card-hover group cursor-pointer" onClick={() => setSelectedCourse(course)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-crimson group-hover:text-indigo-600 transition-colors">
                            {course.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {course.description}
                          </CardDescription>
                        </div>
                        <IconComponent className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge className={getDifficultyColor(course.difficulty)}>
                            {course.difficulty}
                          </Badge>
                          <Badge variant="outline">{course.category}</Badge>
                        </div>
                        
                        <div className="flex items-center text-sm text-slate-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>~15 min read</span>
                        </div>
                        
                        <Button className="w-full btn-animated bg-indigo-600 hover:bg-indigo-700">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Start Learning
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Progress Overview */}
      <Card className="glass bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-800">
            <GraduationCap className="w-5 h-5 mr-2" />
            Your Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700">4</div>
              <div className="text-sm text-purple-600">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700">1</div>
              <div className="text-sm text-purple-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700">0</div>
              <div className="text-sm text-purple-600">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicTheory;