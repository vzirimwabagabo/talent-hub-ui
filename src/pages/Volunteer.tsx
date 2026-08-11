import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { getPublicVolunteerProfiles, type PublicVolunteerProfile } from "@/api/volunteerApi";

const Volunteer = () => {
  const [profiles, setProfiles] = useState<PublicVolunteerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const res = await getPublicVolunteerProfiles();
        if (res.success) {
          setProfiles(res.data || []);
        } else {
          setError(res.error || 'Failed to load volunteer profiles');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Browse Volunteers</CardTitle>
          <CardDescription>Find dedicated volunteers for your organization.</CardDescription>
        </CardHeader>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-6 text-muted-foreground">Loading volunteer profiles...</CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-destructive">{error}</CardContent>
        </Card>
      ) : profiles.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-muted-foreground">
            No public volunteer profiles yet. Be the first to join and showcase your skills.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((profile) => (
          <Card key={profile.id}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-lg">{profile.name}</p>
                  <p className="text-sm text-muted-foreground">{profile.availability}</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">{profile.bio}</p>
              <div className="mb-4">
                <p className="font-semibold mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, i) => (
                    <Badge key={i} variant="outline">{interest}</Badge>
                  ))}
                </div>
              </div>
              <Button className="w-full mt-6">
                View Profile <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Button type="button" onClick={() => navigate('/register')}>
          Join as Volunteer
        </Button>
      </div>
    </div>
  );
};

export default Volunteer;
