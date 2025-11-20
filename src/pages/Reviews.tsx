import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Star, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const reviews = [
  {
    name: "Alice Johnson",
    rating: 5,
    comment: "Working with this platform has been a fantastic experience. The opportunities are top-notch and the community is very supportive.",
    avatar: "/placeholder.svg"
  },
  {
    name: "Bob Williams",
    rating: 4,
    comment: "A great place to find new talent. The matching algorithm is quite effective and has saved us a lot of time.",
    avatar: "/placeholder.svg"
  },
  {
    name: "Charlie Brown",
    rating: 5,
    comment: "I found my dream job through this platform. I couldn\'t be happier with the results.",
    avatar: "/placeholder.svg"
  }
];

const Reviews = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Reviews</CardTitle>
          <CardDescription>See what others are saying about our platform.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={review.avatar} />
                  <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <div className="flex items-center">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                    ))}
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-muted" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
