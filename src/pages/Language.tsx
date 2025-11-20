
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext"; // Import the useLanguage hook

interface Language {
  code: string;
  name: string;
}

const LanguagePage = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { language, setLanguage } = useLanguage(); // Use the language context
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('/api/v1/languages');
        if (!response.ok) {
          throw new Error('Failed to fetch languages.');
        }
        const data = await response.json();
        setLanguages(data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const handleSave = () => {
    if (!selectedLanguage) {
      toast({
        title: "No Language Selected",
        description: "Please select a language before saving.",
        variant: "destructive",
      });
      return;
    }
    setLanguage(selectedLanguage); // Update the global language state
    toast({
      title: "Language Saved!",
      description: `Your preferred language has been set to ${languages.find(l => l.code === selectedLanguage)?.name}.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col items-center text-center text-destructive bg-destructive/10 p-6 rounded-lg">
          <AlertTriangle className="h-12 w-12 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Language Settings</CardTitle>
          <CardDescription>Select your preferred language.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Select onValueChange={setSelectedLanguage} defaultValue={selectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="mt-4" onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguagePage;
