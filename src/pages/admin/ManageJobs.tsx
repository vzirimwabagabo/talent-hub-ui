import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/badge';
import { deleteOpportunity, getAllOpportunities } from '@/api/opportunityApi';
import type { Opportunity } from '@/types/opportunity';
import { ArrowLeft, Calendar, Edit3, Home, Loader2, Plus, Search, Trash2 } from 'lucide-react';

const ManageJobs = () => {
	const navigate = useNavigate();
	const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [actionMessage, setActionMessage] = useState('');

	useEffect(() => {
		const loadJobs = async () => {
			setLoading(true);
			const result = await getAllOpportunities();
			setOpportunities(result?.opportunities || []);
			setLoading(false);
		};

		loadJobs();
	}, []);

	const filteredJobs = useMemo(() => {
		const term = search.trim().toLowerCase();
		if (!term) return opportunities;

		return opportunities.filter((job) =>
			job.title.toLowerCase().includes(term) ||
			job.description.toLowerCase().includes(term) ||
			job.category.toLowerCase().includes(term)
		);
	}, [opportunities, search]);

	const handleDelete = async (jobId: string) => {
		const confirmed = window.confirm('Delete this opportunity? This action cannot be undone.');
		if (!confirmed) return;

		const result = await deleteOpportunity(jobId);
		if (result?.success) {
			setOpportunities((current) => current.filter((job) => job.id !== jobId));
			setActionMessage('Opportunity deleted successfully.');
		} else {
			setActionMessage(result?.error || 'Failed to delete opportunity.');
		}

		window.setTimeout(() => setActionMessage(''), 2500);
	};

	return (
		<div className="space-y-6 max-w-6xl mx-auto">
			<div className="flex items-center justify-between gap-3">
				<div>
					<h1 className="text-3xl font-bold">Manage Jobs</h1>
					<p className="text-muted-foreground">Create, edit, and manage published opportunities.</p>
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
					<Button onClick={() => navigate('/admin/create-opportunity')}>
						<Plus className="mr-2 h-4 w-4" />
						New Job
					</Button>
				</div>
			</div>

			<Card>
				<CardContent className="pt-6">
					<div className="relative max-w-md">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search jobs by title, category, or description..."
							className="pl-10"
						/>
					</div>
				</CardContent>
			</Card>

			{actionMessage ? (
				<div className="rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
					{actionMessage}
				</div>
			) : null}

			{loading ? (
				<Card>
					<CardContent className="flex items-center gap-2 p-6 text-muted-foreground">
						<Loader2 className="h-4 w-4 animate-spin" />
						Loading opportunities...
					</CardContent>
				</Card>
			) : filteredJobs.length === 0 ? (
				<Card>
					<CardContent className="p-6 text-muted-foreground">
						No opportunities found.
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{filteredJobs.map((job) => (
						<Card key={job.id} className="border-border/50 shadow-sm">
							<CardHeader>
								<div className="flex items-start justify-between gap-3">
									<div>
										<CardTitle className="text-lg">{job.title}</CardTitle>
										<CardDescription className="mt-1 line-clamp-3">{job.description}</CardDescription>
									</div>
									<Badge variant={job.isActive ? 'default' : 'secondary'}>
										{job.isActive ? 'Active' : 'Inactive'}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
									<Badge variant="outline">{job.category}</Badge>
									{job.location ? <Badge variant="outline">{job.location}</Badge> : null}
								</div>
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<Calendar className="h-3.5 w-3.5" />
									Updated {new Date(job.updatedAt).toLocaleDateString()}
								</div>
								<div className="flex flex-wrap gap-2">
									<Button variant="outline" size="sm" onClick={() => navigate(`/opportunities/${job.id}`)}>
										View
									</Button>
									<Button variant="outline" size="sm" onClick={() => navigate(`/opportunities/${job.id}/edit`)}>
										<Edit3 className="mr-2 h-4 w-4" />
										Edit
									</Button>
									<Button variant="destructive" size="sm" onClick={() => handleDelete(job.id)}>
										<Trash2 className="mr-2 h-4 w-4" />
										Delete
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
};

export default ManageJobs;