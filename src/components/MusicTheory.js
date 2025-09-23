import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  BookOpen,
  GraduationCap,
  Clock,
  PlayCircle,
  CheckCircle,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const MusicTheory = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [showAddCourseDialog, setShowAddCourseDialog] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "Theory",
    difficulty: "Beginner",
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
          `,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const coursesRef = collection(db, "courses");
      const querySnapshot = await getDocs(coursesRef);
      const coursesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(courses.map((course) => course.category))];

  const filteredCourses =
    activeTab === "all"
      ? courses
      : courses.filter((course) => course.category === activeTab);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "theory":
        return BookOpen;
      case "harmony":
        return Star;
      case "rhythm":
        return Clock;
      default:
        return GraduationCap;
    }
  };

  const handleNextLesson = () => {
    const currentIndex = courses.findIndex(
      (course) => course.id === selectedCourse.id
    );
    if (currentIndex < courses.length - 1) {
      setSelectedCourse(courses[currentIndex + 1]);
    }
  };

  const handlePreviousLesson = () => {
    const currentIndex = courses.findIndex(
      (course) => course.id === selectedCourse.id
    );
    if (currentIndex > 0) {
      setSelectedCourse(courses[currentIndex - 1]);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    const currentIndex = courses.findIndex(
      (course) => course.id === selectedCourse.id
    );
    const progress =
      courses.length > 0 ? ((currentIndex + 1) / courses.length) * 100 : 0;

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
            <CardTitle className="text-3xl font-crimson">
              {selectedCourse.title}
            </CardTitle>
            <CardDescription className="text-lg">
              {selectedCourse.description}
            </CardDescription>
            <Progress value={progress} className="mt-4" />
            <p className="text-sm text-muted-foreground">
              Progress: {Math.round(progress)}% complete
            </p>
          </CardHeader>
          <CardContent>
            <div
              className="theory-content prose max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedCourse.content }}
            />
            <div className="mt-8 pt-6 border-t flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousLesson}
                disabled={
                  courses.findIndex(
                    (course) => course.id === selectedCourse.id
                  ) === 0
                }
              >
                ← Previous Lesson
              </Button>
              <Button
                className="btn-animated"
                onClick={handleNextLesson}
                disabled={
                  courses.findIndex(
                    (course) => course.id === selectedCourse.id
                  ) ===
                  courses.length - 1
                }
              >
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
        <h1 className="text-4xl font-bold gradient-text font-crimson">
          Music Theory Education
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Master music theory with our interactive lessons and comprehensive
          courses
        </p>
        <Button
          onClick={() => setShowAddCourseDialog(true)}
          className="btn-animated"
        >
          Add Course
        </Button>
      </div>

      {/* Add Course Dialog */}
      <Dialog open={showAddCourseDialog} onOpenChange={setShowAddCourseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
                placeholder="Enter course title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                placeholder="Enter course description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <Select
                  value={newCourse.category}
                  onValueChange={(value) =>
                    setNewCourse({ ...newCourse, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Theory">Theory</SelectItem>
                    <SelectItem value="Harmony">Harmony</SelectItem>
                    <SelectItem value="Rhythm">Rhythm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Difficulty
                </label>
                <Select
                  value={newCourse.difficulty}
                  onValueChange={(value) =>
                    setNewCourse({ ...newCourse, difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Content (HTML)
              </label>
              <Textarea
                value={newCourse.content}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, content: e.target.value })
                }
                placeholder="Enter course content in HTML format"
                rows={10}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddCourseDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  const docRef = await addDoc(
                    collection(db, "courses"),
                    newCourse
                  );
                  const course = { ...newCourse, id: docRef.id };
                  setCourses([...courses, course]);
                  setShowAddCourseDialog(false);
                  setNewCourse({
                    title: "",
                    description: "",
                    category: "Theory",
                    difficulty: "Beginner",
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
          `,
                  });
                  toast.success("Course added successfully!");
                } catch (error) {
                  console.error("Error adding course:", error);
                  toast.error("Failed to add course");
                }
              }}
              className="btn-animated"
            >
              Add Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Filter */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-lg mx-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-8">
          {filteredCourses.length === 0 ? (
            <Card className="glass">
              <CardContent className="text-center py-12">
                <GraduationCap className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  No Courses Available
                </h3>
                <p className="text-slate-500">
                  Check back later for new courses in this category.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const IconComponent = getCategoryIcon(course.category);
                return (
                  <Card
                    key={course.id}
                    className="glass card-hover group cursor-pointer"
                    onClick={() => setSelectedCourse(course)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-crimson group-hover:text-primary transition-colors">
                            {course.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {course.description}
                          </CardDescription>
                        </div>
                        <IconComponent className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge
                            className={getDifficultyColor(course.difficulty)}
                          >
                            {course.difficulty}
                          </Badge>
                          <Badge variant="outline">{course.category}</Badge>
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>~15 min read</span>
                        </div>

                        <Button className="w-full btn-animated">
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
      <Card className="glass bg-accent border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <GraduationCap className="w-5 h-5 mr-2" />
            Your Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {courses.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Courses Available
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicTheory;
