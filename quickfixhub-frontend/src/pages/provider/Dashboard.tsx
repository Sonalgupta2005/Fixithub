import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ServiceRequest, ServiceStatus } from '@/types';
import {
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Star,
  DollarSign,
  Play,
  Check,
  X
} from 'lucide-react';

const API_BASE_URL = 'https://fixithub-uhlu.onrender.com/api/provider';

const statusConfig: Record<ServiceStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-warning/10 text-warning', icon: Clock },
  offered: { label: 'Offered', color: 'bg-warning/10 text-warning', icon: Clock },
  accepted: { label: 'Accepted', color: 'bg-blue-500/10 text-blue-600', icon: CheckCircle },
  in_progress: { label: 'In Progress', color: 'bg-accent/10 text-accent', icon: Briefcase },
  completed: { label: 'Completed', color: 'bg-success/10 text-success', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-destructive/10 text-destructive', icon: AlertCircle },
  expired: { label: 'Expired', color: 'bg-destructive/10 text-destructive', icon: AlertCircle },
};

const ProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  const [availableRequests, setAvailableRequests] = useState<ServiceRequest[]>([]);
  const [myJobs, setMyJobs] = useState<ServiceRequest[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'my-jobs'>('available');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [statsRes, availableRes, myJobsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/dashboard/summary`, { headers }),
          fetch(`${API_BASE_URL}/jobs/available`, { headers }),
          fetch(`${API_BASE_URL}/jobs/my`, { headers }),
        ]);

        const statsData = await statsRes.json();
        const availableData = await availableRes.json();
        const myJobsData = await myJobsRes.json();

        setStats([
          { label: 'Jobs Completed', value: statsData.stats.jobsCompleted, icon: CheckCircle, color: 'text-success' },
          { label: 'Active Jobs', value: statsData.stats.activeJobs, icon: Briefcase, color: 'text-accent' },
          { label: 'Rating', value: statsData.stats.rating, icon: Star, color: 'text-warning' },
          { label: 'Earnings', value: `$${statsData.stats.earnings}`, icon: DollarSign, color: 'text-success' },
        ]);

        setAvailableRequests(availableData.jobs || []);
        setMyJobs(myJobsData.jobs || []);
      } catch {
        toast({ title: 'Failed to load dashboard', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token, toast]);

  const handleAcceptJob = async (requestId: string) => {
    const res = await fetch(`${API_BASE_URL}/offers/${requestId}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      toast({ title: 'Failed to accept job', variant: 'destructive' });
      return;
    }

    toast({ title: 'Job Accepted!' });

    setAvailableRequests(prev => prev.filter(r => r._id !== requestId));

    const myJobsRes = await fetch(`${API_BASE_URL}/jobs/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const myJobsData = await myJobsRes.json();
    setMyJobs(myJobsData.jobs || []);
  };

  const handleReject = async (requestId: string) => {
    const res = await fetch(`${API_BASE_URL}/offers/${requestId}/reject`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      toast({ title: 'Failed to reject job', variant: 'destructive' });
      return;
    }

    toast({ title: 'Job Rejected!' });

    setAvailableRequests(prev => prev.filter(r => r._id !== requestId));
  };

  const handleStartJob = async (requestId: string) => {
    await fetch(`${API_BASE_URL}/jobs/${requestId}/start`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    setMyJobs(prev =>
      prev.map(j => j._id === requestId ? { ...j, status: 'in_progress' } : j)
    );

    toast({ title: 'Job Started' });
  };

  const handleCompleteJob = async (requestId: string) => {
    await fetch(`${API_BASE_URL}/jobs/${requestId}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    setMyJobs(prev => prev.filter(j => j._id !== requestId));

    toast({ title: 'Job Completed!' });
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-12 text-center text-muted-foreground">
          Loading dashboard...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">

          <div className="mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              Welcome back, {user?.name || 'Provider'}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Find new jobs and manage your ongoing work.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(stat => (
              <div key={stat.label} className="bg-card rounded-xl p-5 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-xl font-display font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'available'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              Available Jobs ({availableRequests.length})
            </button>

            <button
              onClick={() => setActiveTab('my-jobs')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'my-jobs'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              My Jobs ({myJobs.length})
            </button>
          </div>

          <div className="space-y-4">

            {activeTab === 'available' && availableRequests.map(request => (
              <div key={request._id} className="bg-card rounded-xl border border-border p-6">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg capitalize">
                      {request.service_type} Service
                    </h3>

                    <p className="mb-3">{request.description}</p>

                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span><Calendar className="inline w-4 h-4" /> {request.preferred_date}</span>
                      <span><MapPin className="inline w-4 h-4" /> {request.address}</span>
                      <span><User className="inline w-4 h-4" /> {request.user_name}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleReject(request._id)}
                    >
                      <X className="w-4 h-4 mr-1" /> Reject
                    </Button>

                    <Button variant="accent" onClick={() => handleAcceptJob(request._id)}>
                      Accept Job
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'my-jobs' && myJobs.map(job => {
              const status = statusConfig[job.status];
              const StatusIcon = status.icon;

              return (
                <div key={job._id} className="bg-card rounded-xl border border-border p-6">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg capitalize">
                        {job.service_type} Service
                      </h3>

                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${status.color}`}>
                        <StatusIcon className="w-3 h-3" /> {status.label}
                      </span>

                      <p className="mt-3">{job.description}</p>

                      <div className="mt-4 text-sm space-y-1">
                        <div><User className="inline w-4 h-4" /> {job.user_name}</div>
                        <div><Phone className="inline w-4 h-4" /> {job.user_phone}</div>
                        <div><Mail className="inline w-4 h-4" /> {job.user_email}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {job.status === 'accepted' && (
                        <Button onClick={() => handleStartJob(job._id)}>
                          <Play className="w-4 h-4 mr-2" /> Start Job
                        </Button>
                      )}

                      {job.status === 'in_progress' && (
                        <Button variant="default" onClick={() => handleCompleteJob(job._id)}>
                          <Check className="w-4 h-4 mr-2" /> Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProviderDashboard;