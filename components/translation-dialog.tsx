"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Copy, Check } from "lucide-react"

interface TranslationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  content: string
}

const LANGUAGES = [
  { value: "hi", label: "Hindi" },
  { value: "bn", label: "Bengali" },
  { value: "te", label: "Telugu" },
  { value: "ta", label: "Tamil" },
  { value: "mr", label: "Marathi" },
  { value: "gu", label: "Gujarati" },
  { value: "kn", label: "Kannada" },
  { value: "ml", label: "Malayalam" },
  { value: "pa", label: "Punjabi" },
  { value: "or", label: "Odia" },
]

export function TranslationDialog({ open, onOpenChange, title, content }: TranslationDialogProps) {
  const [language, setLanguage] = useState("hi")
  const [translationCopied, setTranslationCopied] = useState(false)
  const [translatedTitle, setTranslatedTitle] = useState("")
  const [translatedContent, setTranslatedContent] = useState("")

  // Simple mock translation function (for demo purposes)
  const translateText = () => {
    // This is a mock translation - in a real app, you would call a translation API
    setTranslatedTitle(`${title} (Translated to ${LANGUAGES.find((l) => l.value === language)?.label})`)
    setTranslatedContent(`${content} (Translated to ${LANGUAGES.find((l) => l.value === language)?.label})`)
  }

  const copyTranslationToClipboard = () => {
    const textToCopy = `${translatedTitle}\n\n${translatedContent}`
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setTranslationCopied(true)
        setTimeout(() => setTranslationCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
      })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" /> Translate Content
          </DialogTitle>
          <DialogDescription>Translate this article to your preferred language</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium">Select Language:</span>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="original" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="original">Original</TabsTrigger>
            <TabsTrigger value="translated">Translated</TabsTrigger>
          </TabsList>

          <TabsContent value="original" className="p-4 border rounded-md mt-2">
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-gray-700">{content}</p>
          </TabsContent>

          <TabsContent value="translated" className="p-4 border rounded-md mt-2">
            {translatedTitle || translatedContent ? (
              <>
                <h3 className="font-semibold mb-2">{translatedTitle}</h3>
                <p className="text-gray-700">{translatedContent}</p>
              </>
            ) : (
              <div className="text-center py-4">
                <p>Click "Translate" to see the translated content</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {translatedTitle && translatedContent ? (
            <Button onClick={copyTranslationToClipboard}>
              {translationCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" /> Copy Translation
                </>
              )}
            </Button>
          ) : (
            <Button onClick={translateText}>Translate</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

