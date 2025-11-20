import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

interface PortfolioItem {
  projectName: string;
  description?: string;
  projectUrl?: string | null;
  technologies: string[];
  startDate?: string | null; // ISO date string
  endDate?: string | null;   // ISO date string
}

const dummyPortfolio: PortfolioItem[] = [
  {
    projectName: "Social Impact Web App",
    description: "A platform to connect volunteers and refugees.",
    projectUrl: "https://example.com/social-impact",
    technologies: ["React", "Node.js", "MongoDB", "TailwindCSS"],
    startDate: "2024-05-01",
    endDate: "2024-12-31",
  },
  {
    projectName: "Talent Management System",
    description: "Comprehensive talent profiles with portfolio and messaging.",
    projectUrl: null,
    technologies: ["Express", "TypeScript", "AWS S3"],
    startDate: "2025-03-15",
    endDate: null, // ongoing
  },
];

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background p-8 flex justify-center">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl mb-1">My Portfolio</CardTitle>
          <CardDescription>Showcase your skills and projects.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-6">
            {dummyPortfolio.map((item, idx) => (
              <li key={idx} className="border rounded-lg p-4 bg-white shadow-sm">
                <h3 className="text-xl font-semibold mb-1">
                  {item.projectUrl ? (
                    <a
                      href={item.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {item.projectName}
                    </a>
                  ) : (
                    item.projectName
                  )}
                </h3>
                {item.description && (
                  <p className="mb-2 text-gray-700">{item.description}</p>
                )}
                <div className="mb-2">
                  <strong>Technologies:</strong>{" "}
                  {item.technologies.join(", ")}
                </div>
                <div className="text-sm text-gray-500">
                  {item.startDate ? new Date(item.startDate).toLocaleDateString() : "N/A"}{" "}
                  -{" "}
                  {item.endDate ? new Date(item.endDate).toLocaleDateString() : "Present"}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
