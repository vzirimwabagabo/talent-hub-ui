import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllReviews } from "@/api/reviewApi";

interface ReviewItem {
  _id?: string;
  id?: string;
  reviewer?: {
    _id?: string;
    name?: string;
    avatar?: string;
  };
  rating?: number;
  comment?: string;
  createdAt?: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getAllReviews();
        setReviews(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Reviews</CardTitle>
          <CardDescription>See what others are saying about our platform.</CardDescription>
        </CardHeader>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-6 text-muted-foreground">Loading reviews...</CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-destructive">{error}</CardContent>
        </Card>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-muted-foreground">No reviews yet.</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => {
            const reviewerName = review.reviewer?.name || "Reviewer";
            const rating = review.rating ?? 0;
            const avatar = review.reviewer?.avatar || "/placeholder.svg";

            return (
              <Card key={review._id || review.id || index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={avatar} />
                      <AvatarFallback>{reviewerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{reviewerName}</p>
                      <div className="flex items-center">
                        {[...Array(rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                        ))}
                        {[...Array(Math.max(0, 5 - rating))].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-muted" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment || "No comment provided."}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reviews;
