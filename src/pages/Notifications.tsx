import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Bell, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMyNotifications, markNotificationRead } from "@/api/notificationApi";

interface NotificationItem {
  _id?: string;
  id?: string;
  type?: string;
  message?: string;
  read?: boolean;
  createdAt?: string;
  link?: string;
}

const Notifications = () => {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async () => {
    try {
      const response = await getMyNotifications();
      setItems(response);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to load notifications right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (notificationId: string) => {
    try {
      await markNotificationRead(notificationId);
      setItems((current) =>
        current.map((item) =>
          (item._id || item.id) === notificationId ? { ...item, read: true } : item
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

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

      {loading ? (
        <Card>
          <CardContent className="p-6 flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading notifications...
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-destructive">{error}</CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-muted-foreground">No notifications yet.</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((notification) => {
            const id = notification._id || notification.id;
            const time = notification.createdAt ? new Date(notification.createdAt).toLocaleString() : "Recently";
            const isRead = !!notification.read;

            return (
              <Card key={id} className={`flex items-center justify-between p-6 ${isRead ? 'bg-muted/50' : ''}`}>
                <div>
                  <p className="font-semibold capitalize">{notification.type || "Update"}</p>
                  <p className="text-sm text-muted-foreground">{notification.message || "No message available."}</p>
                  <p className="text-xs text-muted-foreground mt-2">{time}</p>
                </div>
                {!isRead && id && (
                  <Button variant="ghost" size="icon" onClick={() => handleMarkRead(id)}>
                    <Check className="h-5 w-5" />
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
