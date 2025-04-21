"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PackageSchedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  available: boolean;
  status: string;
}

interface BookingFormProps {
  packageId: string;
  schedules: PackageSchedule[];
  basePrice: number;
  checkoutComponent: React.FC<{
    bookingData: {
      packageId: string;
      scheduleId: string;
      participants: number;
      totalPrice: number;
      contactInfo: ContactInfo;
    };
    onSuccess: (transactionId: string) => void;
    onError: (error: Error) => void;
  }>;
}

interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
}

export default function BookingForm({
  packageId,
  schedules,
  basePrice,
  checkoutComponent: CheckoutComponent,
}: BookingFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedSchedule, setSelectedSchedule] = useState<string>("");
  const [participants, setParticipants] = useState<string>("1");
  const [step, setStep] = useState<"select" | "contact" | "checkout">("select");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: "",
    email: "",
    phone: "",
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    if (session?.user) {
      setContactInfo({
        fullName: session.user.name || "",
        email: session.user.email || "",
        phone: "",
      });
    }
  }, [session]);

  // Get the selected schedule object
  const selectedScheduleData = schedules.find((s) => s.id === selectedSchedule);

  // Calculate total price
  const totalPrice =
    selectedScheduleData && selectedScheduleData.price
      ? Number(selectedScheduleData.price)
      : Number(basePrice);

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule) {
      toast.error("Please select a session date");
      return;
    }
    setStep("contact");
  };

  const handleProceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactInfo.fullName || !contactInfo.email || !contactInfo.phone) {
      toast.error("Please fill in all contact information");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setStep("checkout");
  };

  const handleBack = () => {
    if (step === "contact") setStep("select");
    else if (step === "checkout") setStep("contact");
  };

  const handlePaymentSuccess = (transactionId: string) => {
    toast.success("Payment successful! Your photography session is confirmed.");
    setBookingComplete(true);
    router.refresh();
  };

  const handlePaymentError = (error: Error) => {
    console.error("Payment error:", error);
    toast.error(`Payment failed: ${error.message}`);
    setIsSubmitting(false);
  };

  if (bookingComplete) {
    return (
      <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
        <h3 className="text-xl font-semibold text-green-700 mb-2">
          Session Booked!
        </h3>
        <p className="text-green-600 mb-4">
          Thank you for booking. We've sent the details to your email.
        </p>
        <Button
          onClick={() => router.push("/dashboard/client/bookings")}
          variant="outline"
        >
          View My Bookings
        </Button>
      </div>
    );
  }

  if (step === "contact") {
    return (
      <form
        onSubmit={handleProceedToCheckout}
        className="space-y-4 font-primary"
      >
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium mb-2">Session Summary</h3>
          <div className="text-sm space-y-1">
            <p>
              <span className="text-gray-500">Date:</span>{" "}
              {formatDate(new Date(selectedScheduleData?.date || ""))}
            </p>
            <p>
              <span className="text-gray-500">Time:</span>{" "}
              {new Date(
                selectedScheduleData?.startTime || ""
              ).toLocaleTimeString()}{" "}
              -{" "}
              {new Date(
                selectedScheduleData?.endTime || ""
              ).toLocaleTimeString()}
            </p>
            <p>
              <span className="text-gray-500">Total:</span>{" "}
              {formatCurrency(totalPrice)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Contact Information</h3>
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={contactInfo.fullName}
              onChange={handleContactInfoChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={contactInfo.email}
              onChange={handleContactInfoChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={contactInfo.phone}
              onChange={handleContactInfoChange}
              required
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button type="submit" className="flex-1">
            Continue to Payment
          </Button>
        </div>
      </form>
    );
  }

  if (step === "checkout") {
    return (
      <div className="space-y-4 font-primary">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium mb-2">Booking Summary</h3>
          <div className="text-sm space-y-1">
            <p>
              <span className="text-gray-500">Date:</span>{" "}
              {formatDate(new Date(selectedScheduleData?.date || ""))}
            </p>
            <p>
              <span className="text-gray-500">Time:</span>{" "}
              {new Date(
                selectedScheduleData?.startTime || ""
              ).toLocaleTimeString()}{" "}
              -{" "}
              {new Date(
                selectedScheduleData?.endTime || ""
              ).toLocaleTimeString()}
            </p>
            <p>
              <span className="text-gray-500">Contact:</span>{" "}
              {contactInfo.fullName}
            </p>
            <p>
              <span className="text-gray-500">Total:</span>{" "}
              {formatCurrency(totalPrice)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <CheckoutComponent
            bookingData={{
              packageId,
              scheduleId: selectedSchedule,
              participants: 1,
              totalPrice,
              contactInfo,
            }}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />

          <p className="text-xs text-gray-500 text-center">
            By completing this payment, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          className="w-full"
        >
          Back
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleContinue} className="font-primary">
      <div className="space-y-4">
        <div>
          <Label>Session Date & Time</Label>
          <Select value={selectedSchedule} onValueChange={setSelectedSchedule}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a date and time" />
            </SelectTrigger>
            <SelectContent>
              {schedules.length > 0 ? (
                schedules.map((schedule) => (
                  <SelectItem
                    key={schedule.id}
                    value={schedule.id}
                    disabled={!schedule.available}
                  >
                    {formatDate(new Date(schedule.date))} -{" "}
                    {new Date(schedule.startTime).toLocaleTimeString()} to{" "}
                    {new Date(schedule.endTime).toLocaleTimeString()}
                    {schedule.status !== "OPEN" && ` - ${schedule.status}`}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No available sessions
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full" disabled={!selectedSchedule}>
            Continue
          </Button>
        </div>
      </div>
    </form>
  );
}
