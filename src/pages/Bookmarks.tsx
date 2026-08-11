import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Bookmark, Briefcase, ExternalLink, Loader2 } from "lucide-react";
import { getUserBookmarks } from "@/api/bookmarkApi";

interface BookmarkItem {
  _id?: string;
  id?: string;
  itemType?: string;
  itemId?: {
    _id?: string;
    title?: string;
    name?: string;
    company?: string;
    location?: string;
  } | null;
  createdAt?: string;
}

const Bookmarks = () => {
  const [items, setItems] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const response = await getUserBookmarks();
        setItems(response);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Unable to load bookmarks right now.");
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);

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

      {loading ? (
        <Card>
          <CardContent className="p-6 flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading bookmarks...
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-destructive">{error}</CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-muted-foreground">
            You have not saved any bookmarks yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {items.map((bookmark, index) => {
            const title = bookmark.itemId?.title || bookmark.itemId?.name || "Untitled item";
            const company = bookmark.itemId?.company || bookmark.itemId?.location || "TalentHub";
            const type = bookmark.itemType || "Opportunity";
            const target = bookmark.itemId?._id || bookmark._id || "#";

            return (
              <Card key={bookmark._id || bookmark.id || index}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-muted rounded-md mr-4">
                      {type === "Opportunity" ? (
                        <Briefcase className="h-6 w-6 text-primary" />
                      ) : (
                        <Bookmark className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-sm text-muted-foreground">{company}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`/opportunities/${target}`} target="_self" rel="noopener noreferrer">
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
