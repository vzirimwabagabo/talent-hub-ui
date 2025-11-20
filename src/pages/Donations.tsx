import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

const Donations = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">My Donations</CardTitle>
          <CardDescription>Track your contribution history.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Donation history and management features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Donations;
