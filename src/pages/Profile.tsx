import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

const TalentProfileView = () => {
  // For demonstration, static dummy data
  const profile = {
    name: "John Doe",
    bio: {
      en: "Full-stack developer passionate about social impact.",
    },
    skills: ["JavaScript", "React", "Node.js"],
    experienceLevel: "intermediate",
    availability: "freelance",
    portfolio: ["Portfolio Item 1", "Portfolio Item 2"]
  };

  return (
    <div className="min-h-screen bg-background p-8 flex justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl mb-2">My Profile</CardTitle>
          <CardDescription>View and manage your profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Basic Info */}
          <h2 className="text-xl font-semibold mb-2">Bio</h2>
          <p className="mb-4">{profile.bio.en}</p>

          {/* Skills */}
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Experience & Availability */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-semibold mb-1">Experience Level</h3>
              <p className="capitalize">{profile.experienceLevel}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Availability</h3>
              <p className="capitalize">{profile.availability}</p>
            </div>
          </div>

          {/* Portfolio */}
          <h2 className="text-xl font-semibold mb-2">Portfolio</h2>
          <ul className="list-disc list-inside space-y-1">
            {profile.portfolio.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TalentProfileView;
