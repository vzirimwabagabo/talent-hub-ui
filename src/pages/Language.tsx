
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Language {
  code: string;
  name: string;
}

const LanguagePage = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { languages: selectedLanguages, setLanguages: setSelectedLanguages } = useLanguage();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('/api/v1/languages');
        if (!response.ok) {
          throw new Error('Failed to fetch languages.');
        }
        const data = await response.json();
        setLanguages(data.data || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const toggleLanguage = (languageCode: string) => {
    const exists = selectedLanguages.includes(languageCode);
    const next = exists
      ? selectedLanguages.filter((code) => code !== languageCode)
      : [...selectedLanguages, languageCode];

    setSelectedLanguages(next.length > 0 ? next : ['en']);
  };

  const handleSave = () => {
    if (!selectedLanguages.length) {
      toast({
        title: "No Language Selected",
        description: "Please select at least one language before saving.",
        variant: "destructive",
      });
      return;
    }

    setSelectedLanguages(selectedLanguages);
    toast({
      title: "Languages Saved!",
      description: `Your preferred languages are: ${selectedLanguages.map((code) => languages.find((lang) => lang.code === code)?.name || code).join(', ')}.`,
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
      <div className="mb-4 flex gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button variant="secondary" onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Language Settings</CardTitle>
          <CardDescription>Select the languages you can read and work with.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-2xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {languages.map((lang) => {
                const isSelected = selectedLanguages.includes(lang.code);
                return (
                  <Button
                    key={lang.code}
                    type="button"
                    variant={isSelected ? 'default' : 'outline'}
                    className="justify-start px-4 py-3 h-auto"
                    onClick={() => toggleLanguage(lang.code)}
                  >
                    {lang.name}
                  </Button>
                );
              })}
            </div>
            <Button className="mt-4" onClick={handleSave}>Save Languages</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguagePage;
