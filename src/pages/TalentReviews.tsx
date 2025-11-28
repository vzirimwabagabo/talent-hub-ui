// src/pages/TalentReviews.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, User, Pencil, Trash2 } from 'lucide-react';
import {
  getReviewsByTalent,
  createReview,
  updateReview,
  deleteReview,
} from '@/api/reviewApi';
import { Review, ReviewFormData } from '@/types/review';
import { toast } from '@/components/ui/use-toast';

const STAR_COUNT = 5;

export default function TalentReviews() {
  const { id: talentId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  // For editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  useEffect(() => {
    if (!talentId) return;
    const fetchReviews = async () => {
      try {
        const data = await getReviewsByTalent(talentId);
        setReviews(data);
      } catch (error) {
        console.error('Failed to load reviews:', error);
        toast({
          title: 'Error',
          description: 'Could not load reviews.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [talentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (rating < 1) {
      toast({ title: 'Please select a rating', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const newReview = await createReview(talentId!, { rating, comment });
      setReviews([newReview, ...reviews]);
      setRating(0);
      setComment('');
      toast({ title: 'Thank you for your review!' });
    } catch (error: any) {
      console.error('Review failed:', error);
      toast({
        title: 'Failed to submit review',
        description: error.response?.data?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditStart = (review: Review) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment || '');
  };

  const handleEditSubmit = async (reviewId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editRating < 1) return;

    setSubmitting(true);
    try {
      const updated = await updateReview(reviewId, {
        rating: editRating,
        comment: editComment,
      });
      setReviews(reviews.map(r => (r.id === reviewId ? updated : r)));
      setEditingId(null);
      toast({ title: 'Review updated!' });
    } catch (error: any) {
      toast({
        title: 'Failed to update review',
        description: error.response?.data?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter(r => r.id !== reviewId));
      toast({ title: 'Review deleted.' });
    } catch (error: any) {
      toast({
        title: 'Failed to delete review',
        description: error.response?.data?.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const hasReviewed = reviews.some(r => r.reviewer.id === user?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Reviews</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex">
            {[...Array(STAR_COUNT)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(parseFloat(averageRating))
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="font-medium">{averageRating}</span>
          <span className="text-muted-foreground">({reviews.length} reviews)</span>
        </div>
      </div>

      {/* Submit Review */}
      {user && !hasReviewed && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Rating</label>
                <div className="flex">
                  {[...Array(STAR_COUNT)].map((_, i) => {
                    const currentRating = hoverRating || rating;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i + 1)}
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-2xl focus:outline-none"
                        aria-label={`Rate ${i + 1} star${i === 0 ? '' : 's'}`}
                      >
                        <Star
                          className={`h-8 w-8 ${
                            i < currentRating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                  rows={3}
                  maxLength={1000}
                  placeholder="Share your experience..."
                />
              </div>

              <Button type="submit" disabled={submitting || rating === 0}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-muted-foreground">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 border rounded-lg bg-card">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{review.reviewer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Edit/Delete for own reviews */}
                      {user?.id === review.reviewer.id && (
                        <>
                          {editingId === review.id ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditStart(review)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(review.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {editingId === review.id ? (
                    <form onSubmit={(e) => handleEditSubmit(review.id, e)} className="mt-3 space-y-3">
                      <div className="flex">
                        {[...Array(STAR_COUNT)].map((_, i) => {
                          const currentRating = editRating;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setEditRating(i + 1)}
                              className="text-2xl focus:outline-none"
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  i < currentRating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full p-2 border rounded-md bg-background text-sm"
                        rows={2}
                        maxLength={1000}
                        placeholder="Update your comment..."
                      />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm" disabled={submitting}>
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(null)}
                          disabled={submitting}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex mt-1">
                        {[...Array(STAR_COUNT)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      {review.comment && (
                        <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}