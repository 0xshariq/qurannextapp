"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Book,
  ChevronLeft,
  ChevronRight,
  Menu,
  Moon,
  Sun,
  Share2,
  Search,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface VerseData {
  text: string;
  translation: string;
  surah: {
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  };
}

interface SearchResult {
  surah: {
    number: number;
    englishName: string;
  };
  numberInSurah: number;
  text: string;
}

export default function Quran() {
  const [currentVerse, setCurrentVerse] = useState<number>(1);
  const [currentSurah, setCurrentSurah] = useState<number>(1);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [verseData, setVerseData] = useState<VerseData | null>(null);
  const [versePictureUrl, setVersePictureUrl] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    fetchVerseData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSurah, currentVerse, selectedLanguage]);

  const fetchVerseData = async () => {
    if (!currentVerse || isNaN(currentVerse) || !currentSurah || isNaN(currentSurah)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid surah and verse numbers",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const lang = selectedLanguage === "ur" ? "ur.ahmedali" : "en.asad";
      const response = await fetch(
        `https://api.alquran.cloud/v1/ayah/${currentSurah}:${currentVerse}/${lang}`
      );
      if (!response.ok) {
        throw new Error("Invalid verse number or API error");
      }

      const result = await response.json();
      setVerseData(result.data);
      setVersePictureUrl(
        `https://cdn.islamic.network/quran/images/${currentSurah}_${currentVerse}.png`
      );
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
      setVerseData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const nextVerse = () => {
    if (verseData && currentVerse < verseData.surah.numberOfAyahs) {
      setCurrentVerse((prev) => prev + 1);
    } else {
      setCurrentSurah((prev) => prev + 1);
      setCurrentVerse(1);
    }
  };

  const previousVerse = () => {
    if (currentVerse > 1) {
      setCurrentVerse((prev) => prev - 1);
    } else if (currentSurah > 1) {
      setCurrentSurah((prev) => prev - 1);
      setCurrentVerse(1); // Set to the last verse of the previous surah (this is a simplification)
    }
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      const lang = selectedLanguage === "ur" ? "ur.ahmedali" : "en.asad";
      const response = await fetch(
        `https://api.alquran.cloud/v1/search/${encodeURIComponent(searchQuery)}/${lang}`
      );
      if (!response.ok) {
        throw new Error("Search failed. Please try again.");
      }

      const result = await response.json();
      setSearchResults(result.data.matches);
    } catch (err) {
      toast({
        title: "Search Error",
        description: err instanceof Error ? err.message : "An unexpected error occurred during search",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchResultClick = (surah: number, verse: number) => {
    setCurrentSurah(surah);
    setCurrentVerse(verse);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleReset = () => {
    setCurrentSurah(1);
    setCurrentVerse(1);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}?surah=${currentSurah}&verse=${currentVerse}&lang=${selectedLanguage}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Quran Verse',
          text: `Check out this verse from the Quran: Surah ${currentSurah}, Verse ${currentVerse}`,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "The link to this verse has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-amber-200 dark:border-slate-700 shadow-md">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-amber-600 dark:text-amber-400"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold flex items-center text-amber-800 dark:text-amber-200">
              <Book className="mr-2" aria-hidden="true" /> Quran App
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search verses..."
                className="w-64 bg-amber-50 dark:bg-slate-800 border-amber-300 dark:border-slate-600 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                aria-label="Search verses"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 text-amber-600 dark:text-amber-400"
                onClick={handleSearch}
                disabled={isSearching}
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="text-amber-600 dark:text-amber-400"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-lg border-amber-200 dark:border-slate-700">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <Input
                type="number"
                value={currentSurah}
                onChange={(e) => setCurrentSurah(Number(e.target.value))}
                placeholder="Surah"
                className="w-24"
                aria-label="Surah number"
              />
              <Input
                type="number"
                value={currentVerse}
                onChange={(e) => setCurrentVerse(Number(e.target.value))}
                placeholder="Verse"
                className="w-24"
                aria-label="Verse number"
              />
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ur">Urdu</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleShare}
                variant="outline"
                className="border-amber-300 dark:border-slate-600 text-amber-700 dark:text-amber-300"
              >
                <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                Share
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-red-500 text-red-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                Reset
              </Button>
            </div>

            {isLoading && (
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-amber-600 dark:text-amber-400" />
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="mt-4 max-h-60 overflow-y-auto">
                {searchResults.map((result) => (
                  <Button
                    key={`${result.surah.number}-${result.numberInSurah}`}
                    variant="link"
                    className="text-left w-full justify-start"
                    onClick={() => handleSearchResultClick(result.surah.number, result.numberInSurah)}
                  >
                    {result.text} (Surah {result.surah.englishName}, Verse {result.numberInSurah})
                  </Button>
                ))}
              </div>
            )}

            {verseData && !isLoading && (
              <div className="text-center">
                <h2 className="text-xl font-bold text-amber-800 dark:text-amber-200">
                  Surah: {verseData.surah.name} (Verse {currentVerse})
                </h2>
                <div className="relative w-full aspect-[3/2] mt-4">
                  <Image
                    src={versePictureUrl}
                    alt={`Verse ${currentVerse} of Surah ${verseData.surah.name}`}
                    fill
                    className="rounded-lg shadow-lg object-contain"
                  />
                </div>
                <p className="mt-4 text-lg text-amber-800 dark:text-amber-200 font-arabic">
                  {verseData.text}
                </p>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {verseData.translation}
                </p>
                <div className="flex justify-between mt-4">
                  <Button onClick={previousVerse} disabled={currentSurah === 1 && currentVerse === 1}>
                    <ChevronLeft className="h-5 w-5 mr-2" aria-hidden="true" />
                    Previous
                  </Button>
                  <Button onClick={nextVerse}>
                    Next
                    <ChevronRight className="h-5 w-5 ml-2" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}