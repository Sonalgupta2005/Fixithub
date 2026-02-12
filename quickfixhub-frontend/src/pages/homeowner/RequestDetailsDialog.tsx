import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ServiceRequest, ServiceStatus } from '@/types';
import {
  Calendar,
  MapPin,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Wrench,
  DollarSign,
  FileText,
  Phone,
  Mail,
} from 'lucide-react';

interface RequestDetailsDialogProps {
  request: ServiceRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<
  ServiceStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: {
    label: 'Pending',
    color: 'bg-warning/10 text-warning border-warning/20',
    icon: Clock,
  },
  offered: {
    label: 'Finding Provider',
    color: 'bg-warning/10 text-warning border-warning/20',
    icon: Clock,
  },
  accepted: {
    label: 'Accepted',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    icon: CheckCircle,
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-accent/10 text-accent border-accent/20',
    icon: Wrench,
  },
  completed: {
    label: 'Completed',
    color: 'bg-success/10 text-success border-success/20',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-destructive/10 text-destructive border-destructive/20',
    icon: AlertCircle,
  },
  expired: {
    label: 'No Provider Available',
    color: 'bg-muted/10 text-muted border-muted/20',
    icon: AlertCircle,
  },
};

const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({
  request,
  open,
  onOpenChange,
}) => {
  if (!request) return null;

  const status = statusConfig[request.status];
  const StatusIcon = status.icon;

  const showProviderDetails = ['accepted', 'in_progress', 'completed'].includes(
    request.status
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="capitalize">{request.service_type} Service</span>
            <Badge className={`${status.color} border`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </h4>
            <p className="text-foreground">{request.description}</p>
          </div>

          {/* Schedule & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Scheduled
              </h4>
              <p className="text-foreground font-medium">
                {request.preferred_date}
              </p>
              {request.preferred_time && (
                <p className="text-sm text-muted-foreground">
                  {request.preferred_time}
                </p>
              )}
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </h4>
              <p className="text-foreground font-medium">{request.address}</p>
            </div>
          </div>

          {/* Provider Details */}
          {showProviderDetails && request.provider_name && (
            <div className="border border-accent/20 bg-accent/5 rounded-lg p-4">
              <h4 className="text-sm font-medium text-accent mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Assigned Provider
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {request.provider_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Service Provider
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-accent/10">
                  <a 
                    href="tel:+1555-0123" 
                    className="flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors"
                  >
                    <Phone className="w-4 h-4 text-accent" />
                    {request.provider_phone}
                  </a>
                  <a 
                    href="mailto:provider@example.com" 
                    className="flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors"
                  >
                    <Mail className="w-4 h-4 text-accent" />
                    {request.provider_email}
                  </a>
                </div>
              </div>
          )}

            
          

          {/* Estimated Cost */}
          {request.estimatedCost != null && (
            <div className="flex items-center gap-3 bg-success/5 border border-success/20 rounded-lg p-4">
              <DollarSign className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Estimated Cost</p>
                <p className="text-lg font-semibold text-success">
                  ${request.estimatedCost}
                </p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="text-xs text-muted-foreground border-t border-border pt-4">
            <p>Created: {new Date(request.created_at).toLocaleString()}</p>
            <p>Last Updated: {new Date(request.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsDialog;
