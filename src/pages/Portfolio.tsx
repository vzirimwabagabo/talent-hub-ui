import { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createPortfolioItem, deletePortfolioItem, getMyPortfolioItems, type PortfolioItem } from '@/api/portfolioApi';

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadPortfolio = async () => {
    setError(null);
    try {
      const data = await getMyPortfolioItems();
      setItems(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load portfolio items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const totalProjects = useMemo(() => items.length, [items]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName.trim()) {
      setError('Project name is required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const created = await createPortfolioItem({
        projectName: projectName.trim(),
        description: description.trim() || undefined,
        projectUrl: projectUrl.trim() || undefined,
        technologies: technologies
          .split(',')
          .map((tech) => tech.trim())
          .filter(Boolean),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      setItems((prev) => [created, ...prev]);
      setProjectName('');
      setDescription('');
      setProjectUrl('');
      setTechnologies('');
      setStartDate('');
      setEndDate('');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to create portfolio item.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deletePortfolioItem(itemId);
      setItems((prev) => prev.filter((item) => (item._id || item.id) !== itemId));
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to delete portfolio item.');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl mb-1">My Portfolio</CardTitle>
          <CardDescription>Showcase your real projects and technologies.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-muted/20">
              <p className="text-sm text-muted-foreground">Total Projects</p>
              <p className="text-2xl font-bold mt-1">{totalProjects}</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/20">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-sm mt-1">{loading ? 'Loading...' : 'Synced with backend'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Project</CardTitle>
          <CardDescription>Add a project to your portfolio.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem} className="space-y-4">
            <Input
              label="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project name"
              required
            />

            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project description"
            />

            <Input
              label="Project URL"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              placeholder="https://example.com"
            />

            <Input
              label="Technologies"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="React, Node.js, MongoDB"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Add Project'}
            </Button>
          </form>
          {error && <p className="text-sm text-destructive mt-3">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Items</CardTitle>
          <CardDescription>Your saved project portfolio.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading portfolio items...</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground">No portfolio items yet.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const itemId = item._id || item.id || '';
                return (
                  <li key={itemId} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">
                          {item.projectUrl ? (
                            <a href={item.projectUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                              {item.projectName}
                            </a>
                          ) : (
                            item.projectName
                          )}
                        </h3>
                        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                        <p className="text-sm">
                          <span className="font-medium">Technologies:</span> {item.technologies?.join(', ') || 'N/A'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(item.startDate && new Date(item.startDate).toLocaleDateString()) || 'N/A'} - {(item.endDate && new Date(item.endDate).toLocaleDateString()) || 'Present'}
                        </p>
                      </div>
                      {itemId && (
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(itemId)}>
                          Delete
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
