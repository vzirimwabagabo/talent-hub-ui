import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";
import api from "@/api/apiConfig";

interface TalentProfile {
  _id?: string;
  id?: string;
  bio?: { en?: string; fr?: string; sw?: string; rw?: string } | string;
  skills?: string[];
  experienceLevel?: string;
  availability?: string;
  user?: {
    _id?: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
}

const Talent = () => {
  const [talentProfiles, setTalentProfiles] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await api.get<{ data: TalentProfile[] }>('/talent');
        setTalentProfiles(response.data.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load talent profiles.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Browse Talent</CardTitle>
          <CardDescription>Find the right talent for your next project.</CardDescription>
        </CardHeader>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-6 flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading talent profiles...
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-destructive">{error}</CardContent>
        </Card>
      ) : talentProfiles.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-muted-foreground">No talent profiles available yet.</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {talentProfiles.map((profile) => {
            const name = profile.user?.name || "Talent Profile";
            const avatar = profile.user?.avatar || "/placeholder.svg";
            const bio = typeof profile.bio === "string" ? profile.bio : profile.bio?.en || "No bio available yet.";
            const skills = profile.skills?.length ? profile.skills : ["Career support", "Professional development"];

            return (
              <Card key={profile._id || profile.id}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-16 w-16 mr-4">
                      <AvatarImage src={avatar} />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg">{name}</p>
                      <p className="text-sm text-muted-foreground">{profile.experienceLevel || "Professional"}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{bio}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skills.map((skill, i) => (
                      <Badge key={`${skill}-${i}`} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                  <Button className="w-full" onClick={() => window.location.href = '/register'}>
                    View Profile <ExternalLink className="h-4 w-4 ml-2" />
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

export default Talent;
