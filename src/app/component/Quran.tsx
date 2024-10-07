"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Book, ChevronLeft, ChevronRight, Menu, Moon, Sun, Volume2 } from "lucide-react"

// Placeholder data for Quran verses
const quranVerses = [
  { number: 1, text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
  { number: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "All praise is due to Allah, Lord of the worlds." },
  { number: 3, text: "الرَّحْمَٰنِ الرَّحِيمِ", translation: "The Entirely Merciful, the Especially Merciful," },
  { number: 4, text: "مَالِكِ يَوْمِ الدِّينِ", translation: "Sovereign of the Day of Recompense." },
  { number: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation: "It is You we worship and You we ask for help." },
]

export default function Quran() {
  const [currentVerse, setCurrentVerse] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState(24)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const nextVerse = () => {
    setCurrentVerse((prev) => (prev + 1) % quranVerses.length)
  }

  const previousVerse = () => {
    setCurrentVerse((prev) => (prev - 1 + quranVerses.length) % quranVerses.length)
  }

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-amber-200 dark:border-slate-700 shadow-md">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-amber-600 dark:text-amber-400">
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold flex items-center text-amber-800 dark:text-amber-200">
              <Book className="mr-2" /> Quran App
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search verses..."
              className="w-64 bg-amber-50 dark:bg-slate-800 border-amber-300 dark:border-slate-600"
            />
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-amber-600 dark:text-amber-400">
              {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-lg border-amber-200 dark:border-slate-700">
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-amber-800 dark:text-amber-200">Surah Al-Fatihah</h2>
              <p className="text-sm text-amber-600 dark:text-amber-400">The Opening</p>
            </div>
            <div className="relative overflow-hidden">
              <div 
                className="text-right font-arabic leading-loose transition-all duration-300 ease-in-out"
                style={{ fontSize: `${fontSize}px` }}
              >
                {quranVerses[currentVerse].text}
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent to-white dark:to-slate-800 pointer-events-none"></div>
            </div>
            <div 
              className="text-xl text-amber-700 dark:text-amber-300 transition-opacity duration-300 ease-in-out"
              key={currentVerse}
            >
              {quranVerses[currentVerse].translation}
            </div>
            <div className="flex justify-between items-center pt-4">
              <Button onClick={previousVerse} variant="outline" className="border-amber-300 dark:border-slate-600 text-amber-700 dark:text-amber-300">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <span className="text-sm text-amber-600 dark:text-amber-400">
                Verse {quranVerses[currentVerse].number} of {quranVerses.length}
              </span>
              <Button onClick={nextVerse} variant="outline" className="border-amber-300 dark:border-slate-600 text-amber-700 dark:text-amber-300">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <Volume2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <Slider
                value={[fontSize]}
                min={16}
                max={40}
                step={1}
                onValueChange={(value) => setFontSize(value[0])}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-amber-100 dark:bg-slate-900 py-4 border-t border-amber-200 dark:border-slate-700">
        <div className="container mx-auto px-4 text-center text-sm text-amber-700 dark:text-amber-300">
          © {new Date().getFullYear()} Quran App. All rights reserved.
        </div>
      </footer>
    </div>
  )
}