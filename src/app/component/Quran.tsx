"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

// Define interfaces
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

export default function Quran() {
  const [currentVerse, setCurrentVerse] = useState<number>(1);
  const [currentSurah, setCurrentSurah] = useState<number>(1);
  const [verseData, setVerseData] = useState<VerseData | null>(null);
  const [versePictureUrl, setVersePictureUrl] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImageLarge, setIsImageLarge] = useState<boolean>(false);

  useEffect(() => {
    fetchVerseData();
  }, [currentSurah, currentVerse, selectedLanguage]);

  const fetchVerseData = async () => {
    if (
      !currentVerse ||
      isNaN(currentVerse) ||
      !currentSurah ||
      isNaN(currentSurah)
    ) {
      console.error("Invalid input: Surah or Verse number is invalid");
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
      const imgUrl = `https://cdn.islamic.network/quran/images/${currentSurah}_${currentVerse}.png`;
      setVersePictureUrl(imgUrl);

      // Preload the image and adjust layout based on image size
      const img = new window.Image(); // Explicitly use `window.Image` to access the global object
      img.src = imgUrl;
      img.onload = () => {
        // If the image height is more than 400px, enable scrolling
        setIsImageLarge(img.height > 400);
      };
    } catch (err) {
      console.error("Error fetching verse data:", err);
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
      setCurrentVerse(1);
    }
  };

  const handleReset = () => {
    setCurrentSurah(1);
    setCurrentVerse(1);
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        isImageLarge ? "overflow-y-auto" : "overflow-hidden"
      } bg-gradient-to-br from-amber-50 to-amber-100`}
    >
      <header className="sticky top-0 z-10 bg-white border-b border-amber-200 shadow-md">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center text-amber-800">
            Quran App
          </h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg border-amber-200">
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
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-red-500 text-red-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                Reset
              </Button>

              {/* Language selection dropdown */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2"
              >
                <option value="en">English</option>
                <option value="ur">Urdu</option>
              </select>
            </div>

            {isLoading && (
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-amber-600" />
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            )}

            {verseData && !isLoading && (
              <div className="text-center">
                <h2 className="text-xl font-bold text-amber-800">
                  Surah: {verseData.surah.name} (Verse {currentVerse})
                </h2>
                <div className="relative w-full mt-4" style={{ aspectRatio: '2 / 1', minHeight: '200px' }}>
                  <Image
                    src={versePictureUrl}
                    alt={`Verse ${currentVerse} of Surah ${verseData.surah.name}`}
                    layout="fill"
                    className="rounded-lg shadow-lg object-contain"
                  />
                </div>
                <p className="mt-4 text-lg text-amber-800 font-arabic">
                  {verseData.text}
                </p>
                <p className="mt-2 text-gray-600">{verseData.translation}</p>
                <div className="flex justify-between mt-4">
                  <Button
                    onClick={previousVerse}
                    disabled={currentSurah === 1 && currentVerse === 1}
                  >
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
