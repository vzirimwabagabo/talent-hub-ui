import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const talentProfiles = [
  {
    name: "Jane Doe",
    avatar: "/placeholder.svg",
    skills: ["UI/UX Design", "React", "Node.js"],
    experienceLevel: "Intermediate",
    availability: "Part-time",
    bio: "A passionate designer with a knack for creating beautiful and intuitive user experiences."
  },
  {
    name: "John Smith",
    avatar: "/placeholder.svg",
    skills: ["Data Science", "Python", "Machine Learning"],
    experienceLevel: "Expert",
    availability: "Full-time",
    bio: "A data scientist with a strong background in statistical analysis and predictive modeling."
  }
];

const Talent = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Browse Talent</CardTitle>
          <CardDescription>Find the right talent for your next project.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {talentProfiles.map((profile, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-lg">{profile.name}</p>
                  <p className="text-sm text-muted-foreground">{profile.experienceLevel}</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">{profile.bio}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills.map((skill, i) => (
                  <Badge key={i} variant="secondary">{skill}</Badge>
                ))}
              </div>
              <Button className="w-full">
                View Profile <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Talent;
