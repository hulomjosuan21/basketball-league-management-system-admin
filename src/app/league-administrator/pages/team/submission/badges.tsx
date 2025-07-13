import {
  LucideIcon,
  Clock,
  CheckCircle2,
  XCircle,
  HandCoins,
  Banknote,
  MinusCircle,
  HelpCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type PaymentStatus = "Pending" | "Paid Online" | "Paid On Site" | "Waived";
export type SubmissionStatus = "Pending" | "Accepted" | "Rejected";

function isPaymentStatus(value: unknown): value is PaymentStatus {
  return ["Pending", "Paid Online", "Paid On Site", "Waived"].includes(value as string);
}

function isSubmissionStatus(value: unknown): value is SubmissionStatus {
  return ["Pending", "Accepted", "Rejected"].includes(value as string);
}

const paymentStatusMap: Record<PaymentStatus, { className: string; icon: LucideIcon }> = {
  Pending: { className: "bg-yellow-200 text-yellow-800", icon: Clock },
  "Paid Online": { className: "bg-green-200 text-green-800", icon: Banknote },
  "Paid On Site": { className: "bg-blue-200 text-blue-800", icon: HandCoins },
  Waived: { className: "bg-gray-200 text-gray-800", icon: MinusCircle },
};

const submissionStatusMap: Record<SubmissionStatus, { className: string; icon: LucideIcon }> = {
  Pending: { className: "bg-yellow-200 text-yellow-800", icon: Clock },
  Accepted: { className: "bg-green-200 text-green-800", icon: CheckCircle2 },
  Rejected: { className: "bg-red-200 text-red-800", icon: XCircle },
};

export function PaymentStatusBadge({ status }: { status: unknown }) {
  const fallback = { className: "bg-muted text-muted-foreground", icon: HelpCircle };

  const { className, icon: Icon } = isPaymentStatus(status)
    ? paymentStatusMap[status]
    : fallback;

  return (
    <Badge className={`inline-flex items-center gap-1 ${className}`}>
      <Icon className="h-4 w-4" />
      {String(status)}
    </Badge>
  );
}

export function SubmissionStatusBadge({ status }: { status: unknown }) {
  const fallback = { className: "bg-muted text-muted-foreground", icon: HelpCircle };

  const { className, icon: Icon } = isSubmissionStatus(status)
    ? submissionStatusMap[status]
    : fallback;

  return (
    <Badge className={`inline-flex items-center gap-1 ${className}`}>
      <Icon className="h-4 w-4" />
      {String(status)}
    </Badge>
  );
}
