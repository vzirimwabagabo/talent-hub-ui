// src/pages/Donations.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar } from 'lucide-react';
import { getDonations, createDonation } from '@/api/donationApi';
import { Donation } from '@/types/donation';
import { toast } from '@/components/ui/use-toast';

export default function Donations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // Fetch donations on mount
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await getDonations();
        setDonations(data);
      } catch (error) {
        console.error('Failed to load donations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load donation history.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 1) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid donation amount (minimum $1).',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const newDonation = await createDonation({
        amount: numAmount,
        description: description.trim() || undefined,
      });
      setDonations([newDonation, ...donations]); // Optimistic update
      setAmount('');
      setDescription('');
      toast({
        title: 'Donation successful!',
        description: `Thank you for your generous donation of $${numAmount}.`,
      });
    } catch (error: any) {
      console.error('Donation failed:', error);
      toast({
        title: 'Donation failed',
        description: error.response?.data?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Your Donations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">${totalDonated}</div>
              <div className="text-sm text-muted-foreground">Total Donated</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{donations.length}</div>
              <div className="text-sm text-muted-foreground">Donations Made</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold">❤️</div>
              <div className="text-sm text-muted-foreground">Thank You!</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Make a Donation */}
      <Card>
        <CardHeader>
          <CardTitle>Make a Donation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDonate} className="space-y-4">
            <Input
              label="Amount ($)"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
            <Input
              label="Message (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., For scholarships"
            />
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Processing...' : 'Donate Now'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Donation History */}
      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading donations...</p>
          ) : donations.length === 0 ? (
            <p className="text-muted-foreground">You haven't made any donations yet.</p>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-start justify-between p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors"
                >
                  <div>
                    <div className="font-semibold">${donation.amount}</div>
                    {donation.description && (
                      <p className="text-sm text-muted-foreground mt-1">{donation.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center justify-end">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(donation.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}