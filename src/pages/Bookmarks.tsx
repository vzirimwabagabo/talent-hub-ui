import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Bookmark, Briefcase, ExternalLink } from "lucide-react";

const bookmarks = [
  {
    title: "Software Engineer at Google",
    company: "Google",
    type: "Opportunity",
    url: "#"
  },
  {
    title: "Product Designer at Facebook",
    company: "Facebook",
    type: "Opportunity",
    url: "#"
  },
  {
    title: "Data Scientist at Netflix",
    company: "Netflix",
    type: "Talent",
    url: "#"
  }
];

const Bookmarks = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <Bookmark className="h-8 w-8 mr-2" />
            Bookmarks
          </CardTitle>
          <CardDescription>
            Your saved opportunities and talent profiles.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {bookmarks.map((bookmark, index) => (
          <Card key={index}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-muted rounded-md mr-4">
                  {bookmark.type === "Opportunity" ? (
                    <Briefcase className="h-6 w-6 text-primary" />
                  ) : (
                    <Bookmark className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{bookmark.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {bookmark.company}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
