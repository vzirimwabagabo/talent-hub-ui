import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const volunteerProfiles = [
  {
    name: "Alice Smith",
    avatar: "/placeholder.svg",
    skills: ["Event Planning", "Fundraising", "Community Outreach"],
    interests: ["Education", "Environment", "Social Justice"],
    availability: "Part-time",
    bio: "A dedicated volunteer with a passion for making a positive impact in the community."
  },
  {
    name: "David Chen",
    avatar: "/placeholder.svg",
    skills: ["Graphic Design", "Social Media Marketing"],
    interests: ["Arts & Culture", "Animal Welfare"],
    availability: "Occasional",
    bio: "A creative individual looking to contribute design skills to meaningful causes."
  }
];

const Volunteer = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Browse Volunteers</CardTitle>
          <CardDescription>Find dedicated volunteers for your organization.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {volunteerProfiles.map((profile, index) => (
          <Card key={index}>
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
    </div>
  );
};

export default Volunteer;
