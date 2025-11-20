import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Analytics</CardTitle>
          <CardDescription>View key metrics and user engagement.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Analytics dashboards and reports will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
