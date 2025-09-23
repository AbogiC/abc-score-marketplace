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
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Music,
  Search,
  Filter,
  Play,
  Download,
  Eye,
  Upload,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const SheetMusicLibrary = () => {
  const { user } = useAuth();
  const [sheetMusic, setSheetMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [previewPdf, setPreviewPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    composer: "",
    genre: "",
    difficulty: "",
    price: "",
    description: "",
    pdfFile: null,
    audioFile: null,
  });

  useEffect(() => {
    fetchSheetMusic();
  }, []);

  const fetchSheetMusic = async () => {
    try {
      const sheetMusicRef = collection(db, "sheet-music");
      const querySnapshot = await getDocs(sheetMusicRef);
      const sheetMusicData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSheetMusic(sheetMusicData);
    } catch (error) {
      console.error("Error fetching sheet music:", error);
      toast.error("Failed to load sheet music");
    } finally {
      setLoading(false);
    }
  };

  const filteredMusic = sheetMusic.filter((sheet) => {
    const matchesSearch =
      sheet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheet.composer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre =
      selectedGenre === "all" || sheet.genre === selectedGenre;
    const matchesDifficulty =
      selectedDifficulty === "all" || sheet.difficulty === selectedDifficulty;

    return matchesSearch && matchesGenre && matchesDifficulty;
  });

  const genres = [...new Set(sheetMusic.map((sheet) => sheet.genre))];
  const difficulties = ["Beginner", "Intermediate", "Advanced"];

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

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const playAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
      toast.error("Failed to play audio sample");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to add sheet music");
      return;
    }
    setSubmitting(true);
    try {
      let pdfUrl = "";
      let audioUrl = "";
      if (formData.pdfFile) {
        pdfUrl = formData.pdfFile.name;
      }
      if (formData.audioFile) {
        audioUrl = formData.audioFile.name;
      }
      await addDoc(collection(db, "sheet-music"), {
        title: formData.title,
        composer: formData.composer,
        genre: formData.genre,
        difficulty: formData.difficulty,
        price: parseFloat(formData.price),
        description: formData.description,
        pdf_url: pdfUrl,
        sample_mp3_url: audioUrl,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user.uid,
      });
      toast.success("Sheet music added successfully");
      setIsModalOpen(false);
      setFormData({
        title: "",
        composer: "",
        genre: "",
        difficulty: "",
        price: "",
        description: "",
        pdfFile: null,
        audioFile: null,
      });
      fetchSheetMusic();
    } catch (error) {
      console.error("Error adding sheet music:", error);
      toast.error("Failed to add sheet music");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-text font-crimson">
          Sheet Music Library
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse our collection of high-quality sheet music with PDF previews
          and audio samples
        </p>
      </div>

      {/* Filters */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted" />
              <Input
                placeholder="Search by title or composer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger>
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="btn-animated">
                  <Upload className="w-4 h-4 mr-2" />
                  Add Sheet Music
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Sheet Music</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new sheet music to the library.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="composer">Composer</Label>
                    <Input
                      id="composer"
                      value={formData.composer}
                      onChange={(e) =>
                        setFormData({ ...formData, composer: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="genre">Genre</Label>
                    <Input
                      id="genre"
                      value={formData.genre}
                      onChange={(e) =>
                        setFormData({ ...formData, genre: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) =>
                        setFormData({ ...formData, difficulty: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map((diff) => (
                          <SelectItem key={diff} value={diff}>
                            {diff}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pdfFile">PDF File</Label>
                    <Input
                      id="pdfFile"
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        setFormData({ ...formData, pdfFile: e.target.files[0] })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="audioFile">Audio File</Label>
                    <Input
                      id="audioFile"
                      type="file"
                      accept=".mp3,.wav,.ogg"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          audioFile: e.target.files[0],
                        })
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? "Adding..." : "Add Sheet Music"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Sheet Music Grid */}
      {filteredMusic.length === 0 ? (
        <Card className="glass">
          <CardContent className="text-center py-12">
            <Music className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No Sheet Music Found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMusic.map((sheet) => (
            <Card key={sheet.id} className="glass card-hover group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-crimson group-hover:text-primary transition-colors">
                      {sheet.title}
                    </CardTitle>
                    <CardDescription className="font-medium text-muted-foreground">
                      by {sheet.composer}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={`${getDifficultyColor(
                        sheet.difficulty
                      )} border-0`}
                    >
                      {sheet.difficulty}
                    </Badge>
                    <span className="text-lg font-bold text-primary">
                      ${sheet.price?.toFixed(2) || "0.00"}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {sheet.description}
                  </p>

                  <div className="flex items-center space-x-2">
                    {sheet.pdf_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewPdf(sheet.pdf_url)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    )}
                    {sheet.sample_mp3_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => playAudio(sheet.sample_mp3_url)}
                        className="flex-1"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Listen
                      </Button>
                    )}
                  </div>

                  <Button className="w-full btn-animated">
                    <Download className="w-4 h-4 mr-2" />
                    Purchase & Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* PDF Preview Modal */}
      {previewPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">PDF Preview</h3>
              <Button variant="ghost" onClick={() => setPreviewPdf(null)}>
                ×
              </Button>
            </div>
            <div className="p-4">
              <Document
                file={previewPdf}
                onLoadSuccess={onDocumentLoadSuccess}
                className="pdf-viewer"
              >
                <Page pageNumber={1} width={600} />
              </Document>
              {numPages && numPages > 1 && (
                <p className="text-center mt-2 text-muted-foreground">
                  Page 1 of {numPages} (Preview only)
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SheetMusicLibrary;
