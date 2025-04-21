"use client";

import { useEffect, useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  packageId: string;
  scheduleId: string;
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  onSuccess: (transactionId: string) => void;
}

export function PayPalButton({
  amount,
  currency = "USD",
  packageId,
  scheduleId,
  contactInfo,
  onSuccess,
}: PayPalButtonProps) {
  const [error, setError] = useState<string | null>(null);

  const createOrder = async () => {
    try {
      const response = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId,
          scheduleId,
          amount,
          currency,
          contactInfo,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();
      return order.id;
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Failed to create order. Please try again.");
      throw err;
    }
  };

  const onApprove = async (data: any) => {
    try {
      const response = await fetch(
        `/api/checkout/capture-payment?token=${data.orderID}`
      );

      if (!response.ok) {
        throw new Error("Payment capture failed");
      }

      const captureData = await response.json();
      onSuccess(captureData.id);
      toast.success("Payment successful!");
    } catch (err) {
      console.error("Error capturing payment:", err);
      setError("Payment failed. Please try again.");
      toast.error("Payment failed. Please try again.");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="w-full">
      <PayPalButtons
        style={{
          layout: "vertical",
          shape: "rect",
          label: "pay",
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => {
          console.error("PayPal error:", err);
          setError("Payment failed. Please try again.");
          toast.error("Payment failed. Please try again.");
        }}
      />
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
