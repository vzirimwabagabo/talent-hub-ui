import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getMatchRequestsForReview, updateMatchRequestStatus } from '@/api/matchRequestApi';
import type { MatchRequest } from '@/types/matchRequest';
import { ArrowLeft, Home, Loader2, Search, XCircle } from 'lucide-react';

const ReviewApplications = () => {
	const navigate = useNavigate();
	const [requests, setRequests] = useState<MatchRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [message, setMessage] = useState('');

	useEffect(() => {
		const loadRequests = async () => {
			setLoading(true);
			const result = await getMatchRequestsForReview();
			setRequests(result?.data || []);
			setLoading(false);
		};

		loadRequests();
	}, []);

	const filteredRequests = useMemo(() => {
		const term = search.trim().toLowerCase();
		if (!term) return requests;

		return requests.filter((request) => {
			const opportunityTitle = request.opportunity?.title || '';
			const requesterName = request.talent?.name || '';
			const supportText = request.message || '';

			return (
				opportunityTitle.toLowerCase().includes(term) ||
				requesterName.toLowerCase().includes(term) ||
				supportText.toLowerCase().includes(term)
			);
		});
	}, [requests, search]);

	const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
		const result = await updateMatchRequestStatus(id, status);
		if (result?.success) {
			setRequests((current) => current.map((request) => (request.id === id ? { ...request, status } : request)));
			setMessage(`Application ${status}.`);
		} else {
			setMessage(result?.error || 'Unable to update application status.');
		}

		window.setTimeout(() => setMessage(''), 2500);
	};

	return (
		<div className="space-y-6 max-w-6xl mx-auto">
			<div className="flex items-center justify-between gap-3">
				<div>
					<h1 className="text-3xl font-bold">Review Applications</h1>
					<p className="text-muted-foreground">Approve or reject incoming talent requests.</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="sm" onClick={() => navigate(-1)}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
					<Button variant="secondary" size="sm" onClick={() => navigate('/')}>
						<Home className="mr-2 h-4 w-4" />
						Home
					</Button>
				</div>
			</div>

			<Card>
				<CardContent className="pt-6">
					<div className="relative max-w-md">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by talent, job, or message..."
							className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						/>
					</div>
				</CardContent>
			</Card>

			{message ? (
				<div className="rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
					{message}
				</div>
			) : null}

			{loading ? (
				<Card>
					<CardContent className="flex items-center gap-2 p-6 text-muted-foreground">
						<Loader2 className="h-4 w-4 animate-spin" />
						Loading applications...
					</CardContent>
				</Card>
			) : filteredRequests.length === 0 ? (
				<Card>
					<CardContent className="p-6 text-muted-foreground">
						No applications to review yet.
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{filteredRequests.map((request) => {
						const status = request.status || 'pending';

						return (
							<Card key={request.id} className="border-border/50 shadow-sm">
								<CardHeader>
									<div className="flex items-start justify-between gap-3">
										<div>
											<CardTitle className="text-lg">{request.opportunity?.title || 'Opportunity request'}</CardTitle>
											<CardDescription className="mt-1">
												{request.talent?.name || 'Unknown talent'}
											</CardDescription>
										</div>
										<Badge variant={status === 'approved' ? 'default' : status === 'rejected' ? 'destructive' : 'secondary'}>
											{status}
										</Badge>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<p className="text-sm text-muted-foreground line-clamp-4">
										{request.message || 'No additional message provided.'}
									</p>
									<div className="flex flex-wrap gap-2">
										<Button
											size="sm"
											onClick={() => handleStatusChange(request.id, 'approved')}
											disabled={status === 'approved'}
										>
											<CheckCircle2 className="mr-2 h-4 w-4" />
											Approve
										</Button>
										<Button
											size="sm"
											variant="destructive"
											onClick={() => handleStatusChange(request.id, 'rejected')}
											disabled={status === 'rejected'}
										>
											<XCircle className="mr-2 h-4 w-4" />
											Reject
										</Button>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default ReviewApplications;