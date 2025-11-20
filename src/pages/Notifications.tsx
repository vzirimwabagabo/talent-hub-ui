import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const notifications = [
  {
    title: "New Job Application",
    description: "You have a new application for the Software Engineer role.",
    time: "10 minutes ago",
    read: false
  },
  {
    title: "Profile matched",
    description: "Your profile has been matched with a new opportunity.",
    time: "1 hour ago",
    read: false
  },
  {
    title: "Message from Recruiter",
    description: "You have a new message from a recruiter at Google.",
    time: "3 hours ago",
    read: true
  }
];

const Notifications = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <Bell className="h-8 w-8 mr-2" />
            Notifications
          </CardTitle>
          <CardDescription>Manage your notifications.</CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <Card key={index} className={`flex items-center justify-between p-6 ${notification.read ? 'bg-muted/50' : ''}`}>
            <div>
              <p className="font-semibold">{notification.title}</p>
              <p className="text-sm text-muted-foreground">{notification.description}</p>
              <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
            </div>
            {!notification.read && (
              <Button variant="ghost" size="icon">
                <Check className="h-5 w-5" />
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
