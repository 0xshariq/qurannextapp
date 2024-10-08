"use client";

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
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

// Types for verse data and search result data
interface VerseData {
  text: string; // Arabic text
  translation: string; // English/Urdu translation
  surah: {
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
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
  const [versePictureUrl, setVersePictureUrl] = useState<string>(""); // New state for image URL
  const [error, setError] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Toggle dark mode in the DOM
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Fetch verse data whenever surah, verse, or language changes
  useEffect(() => {
    fetchVerseData();
  }, [currentSurah, currentVerse, selectedLanguage]);

  // Function to fetch verse data from the API
  const fetchVerseData = async () => {
    if (
      !currentVerse ||
      isNaN(currentVerse) ||
      !currentSurah ||
      isNaN(currentSurah)
    ) {
      setError("Please enter valid surah and verse numbers");
      return;
    }

    setIsLoading(true);
    setError("");

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

      // Set the verse picture URL
      setVersePictureUrl(
        `https://cdn.islamic.network/quran/images/${currentSurah}_${currentVerse}.png`
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred");
      } else {
        setError("An unexpected error occurred");
      }
      setVerseData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers for navigating verses
  const nextVerse = () => {
    setCurrentVerse((prev) => prev + 1);
  };

  const previousVerse = () => {
    setCurrentVerse((prev) => Math.max(1, prev - 1));
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Handle search function
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError("");

    try {
      const lang = selectedLanguage === "ur" ? "ur.ahmedali" : "en.asad";
      const response = await fetch(
        `https://api.alquran.cloud/v1/search/${encodeURIComponent(
          searchQuery
        )}/${lang}`
      );
      if (!response.ok) {
        throw new Error("Search failed. Please try again.");
      }

      const result = await response.json();
      setSearchResults(result.data.matches);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred during search");
      } else {
        setError("An unexpected error occurred during search");
      }
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle click on a search result
  const handleSearchResultClick = (surah: number, verse: number) => {
    setCurrentSurah(surah);
    setCurrentVerse(verse);
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-amber-200 dark:border-slate-700 shadow-md">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-amber-600 dark:text-amber-400"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold flex items-center text-amber-800 dark:text-amber-200">
              <Book className="mr-2" /> Quran App
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
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 text-amber-600 dark:text-amber-400"
                onClick={handleSearch}
                disabled={isSearching} // Disable button when searching
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="text-amber-600 dark:text-amber-400"
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

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-lg border-amber-200 dark:border-slate-700">
          <CardContent className="p-6 space-y-6">
            {/* Surah, verse input, and language selection */}
            <div className="flex justify-between items-center">
              <Input
                type="number"
                value={currentSurah}
                onChange={(e) => setCurrentSurah(Number(e.target.value))}
                placeholder="Surah"
                className="w-24"
              />
              <Input
                type="number"
                value={currentVerse}
                onChange={(e) => setCurrentVerse(Number(e.target.value))}
                placeholder="Verse"
                className="w-24"
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
                onClick={handleSearch}
                variant="outline"
                className="border-amber-300 dark:border-slate-600 text-amber-700 dark:text-amber-300"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Error message */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Loading state */}
            {isLoading && <p className="text-gray-600">Loading...</p>}

            {/* Search results */}
            {searchResults.length > 0 && (
              <div className="mt-4">
                {searchResults.map((result) => (
                  <Button
                    key={`${result.surah.number}-${result.numberInSurah}`}
                    variant="link"
                    className="text-left"
                    onClick={() =>
                      handleSearchResultClick(
                        result.surah.number,
                        result.numberInSurah
                      )
                    }
                  >
                    {result.text} (Surah {result.surah.englishName}, Verse{" "}
                    {result.numberInSurah})
                  </Button>
                ))}
              </div>
            )}

            {/* Verse display */}
            {verseData && (
              <div className="text-center">
                <h2 className="text-xl font-bold text-amber-800 dark:text-amber-200">
                  {verseData.surah.name} ({currentVerse})
                </h2>
                {versePictureUrl && ( // Display the verse image
                  <Image
                    src={versePictureUrl}
                    alt={`Verse image for Surah ${currentSurah}, Verse ${currentVerse}`}
                    className="mx-auto mb-4 rounded-lg shadow-lg"
                    width={400} // Set the desired width
                    height={200} // Set the desired height
                  />
                )}

                <p className="text-lg text-right arabic-text">
                  {verseData.text}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {verseData.translation}
                </p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-4">
              <Button
                onClick={previousVerse}
                disabled={currentVerse === 1}
                className="text-amber-700 dark:text-amber-300"
              >
                <ChevronLeft /> Previous
              </Button>
              <Button
                onClick={nextVerse}
                className="text-amber-700 dark:text-amber-300"
              >
                Next <ChevronRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
