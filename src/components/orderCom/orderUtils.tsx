import { CheckCircle, Clock, Truck, XCircle } from "lucide-react";

export const getStatusColor = (status: string) => {
  if (status === "delivered") return "green";
  if (status === "handed_over") return "blue";
  if (status === "processing") return "orange";
  if (status === "cancelled") return "red";
  return "gray";
};

export const getStatusLabel = (status: string) => {
  if (status === "handed_over") return "Handed Over";
  if (status === "processing") return "Processing";
  if (status === "delivered") return "Delivered";
  if (status === "cancelled") return "Cancelled";
  return "Pending";
};

export const getStatusMessage = (status: string) => {
  if (status === "handed_over")
    return "Your order has been handed over to the delivery/COD service.";
  if (status === "processing") return "Admin is preparing your order.";
  if (status === "delivered") return "Your order has been delivered.";
  if (status === "cancelled") return "This order has been cancelled.";
  return "Your order is waiting for admin review.";
};

export const getStatusIcon = (status: string) => {
  if (status === "delivered") return <CheckCircle size={18} />;
  if (status === "handed_over") return <Truck size={18} />;
  if (status === "cancelled") return <XCircle size={18} />;
  return <Clock size={18} />;
};

export const CANCELLATION_WINDOW_MS = 24 * 60 * 60 * 1000;

export const canCancelOrder = (order: any) => {
  if (!order?.created_at) return false;
  if (
    order.status === "cancelled" ||
    order.status === "delivered" ||
    order.status === "handed_over"
  ) {
    return false;
  }

  return (
    Date.now() - new Date(order.created_at).getTime() <= CANCELLATION_WINDOW_MS
  );
};
