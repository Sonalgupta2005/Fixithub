import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ServiceRequest, ServiceStatus } from '@/types';
import {
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  User,
  ArrowRight,
  X,
  Wrench,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RequestDetailsDialog from './RequestDetailsDialog';

const API_BASE_URL = 'https://fixithub-uhlu.onrender.com/api';

const statusConfig: Record<
  ServiceStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: { label: 'Pending', color: 'bg-warning/10 text-warning', icon: Clock },
  offered: { label: 'Offered', color: 'bg-warning/10 text-warning', icon: Clock },
  accepted: { label: 'Accepted', color: 'bg-blue-500/10 text-blue-600', icon: CheckCircle },
  in_progress: { label: 'In Progress', color: 'bg-accent/10 text-accent', icon: Wrench },
  completed: { label: 'Completed', color: 'bg-success/10 text-success', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-destructive/10 text-destructive', icon: AlertCircle },
  expired: { label: 'Expired', color: 'bg-destructive/10 text-destructive', icon: AlertCircle },
};

const HomeownerDashboard: React.FC = () => {
  const { user } = useAuth();

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // 🔥 FETCH REAL DATA
  useEffect(() => {
    fetch(`${API_BASE_URL}/service/my-requests`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRequests(data.requests);
        }
      })
      .catch(() => {
        setRequests([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: 'Active Requests',
      value: requests.filter(r =>
        ['pending', 'accepted', 'in_progress'].includes(r.status)
      ).length,
      icon: Clock,
    },
    {
      label: 'Completed',
      value: requests.filter(r => r.status === 'completed').length,
      icon: CheckCircle,
    },
    {
      label: 'Total Requests',
      value: requests.length,
      icon: Wrench,
    },
  ];
  const handleCancel = async (id: string) => {
    await fetch(`${API_BASE_URL}/service/requests/${id}/cancel`, {
      method: 'POST',
      credentials: 'include',
    });

    setRequests(prev =>
      prev.map(r => r._id === id ? { ...r, status: 'cancelled' } : r)
    );
    toast({
      title: 'Request Cancelled',
      description: 'Your service request has been cancelled successfully.',
    });
  };

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };
  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Welcome back, {user?.name|| 'Homeowner'}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your service requests and track their progress.
              </p>
            </div>
            <Button variant="accent" size="lg" asChild>
              <Link to="/homeowner/new-request">
                <Plus className="w-5 h-5 mr-2" />
                New Request
              </Link>
            </Button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {stats.map(stat => (
                  <div
                    key={stat.label}
                    className="bg-card rounded-xl p-6 border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-display font-bold text-foreground">
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Requests List */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Your Service Requests
                  </h2>
                </div>

                {requests.length === 0 ? (
                  <div className="p-12 text-center">
                    <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">
                      No requests yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first service request to get started.
                    </p>
                    <Button variant="accent" asChild>
                      <Link to="/homeowner/new-request">
                        <Plus className="w-4 h-4 mr-2" />
                        New Request
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {requests.map(request => {
                      const status = statusConfig[request.status];
                      const StatusIcon = status.icon;
                      const canCancel = ['offered', 'accepted'].includes(request.status);
                      const canViewDetails = ['accepted', 'in_progress', 'completed'].includes(request.status);

                      return (
                        <div
                          key={request._id}
                          className="p-6 hover:bg-secondary/30 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-foreground capitalize">
                                  {request.service_type} Service
                                </h3>
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
                                >
                                  <StatusIcon className="w-3 h-3" />
                                  {status.label}
                                </span>
                              </div>

                              <p className="text-muted-foreground text-sm mb-3 line-clamp-1">
                                {request.description}
                              </p>

                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4" />
                                  {request.preferred_date}
                                  {request.preferred_time &&
                                    ` at ${request.preferred_time}`}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <MapPin className="w-4 h-4" />
                                  {request.address}
                                </span>
                                {request.provider_name && (
                                  <span className="flex items-center gap-1.5">
                                    <User className="w-4 h-4" />
                                    {request.provider_name}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                             <div className="flex items-center gap-2">
                              
                              {canCancel && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                                  onClick={() => handleCancel(request._id)}
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              )}
                              {canViewDetails && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetails(request)}
                                >
                                  View Details <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {selectedRequest && (
  <RequestDetailsDialog
    request={selectedRequest}
    open={detailsOpen}
    onOpenChange={setDetailsOpen}
  />
)}

    </Layout>
  );
};

export default HomeownerDashboard;
