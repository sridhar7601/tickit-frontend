import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "./animated-modal.tsx";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import MultiStepLoaderDemo from "../step-loader/multi-step-loader";

interface AnimatedModalDemoProps {
  bookingData: any;
  handleBookTicket: () => void;
  onClose?: () => void;
}

interface ConfirmationData {
  id: string;
  userId: string;
  showId: string;
  tickets: string[];
  totalPrice: number;
  status: string;
}

const AnimatedModalDemo: React.FC<AnimatedModalDemoProps> = ({ bookingData, onClose }) => {
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const handlePaymentMethodChange = (method: string) => {
    if (selectedPaymentMethod === method) {
      setSelectedPaymentMethod(""); // Deselect if clicked again
    } else {
      setSelectedPaymentMethod(method); // Select the chosen method
    }
  };

  const handleCompletePayment = async () => {
    const token = localStorage.getItem('token'); // Get token from localStorage

    if (!selectedPaymentMethod || !bookingData?.id) return;
    setIsLoading(true);
    try {
      // Trigger the payment API
      const paymentResponse = await fetch(
        `//34.222.114.62:8080/api/bookings/${bookingData.id}/pay`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Add Bearer token here
          },
          body: JSON.stringify({ paymentMode: selectedPaymentMethod }),
        }
      );
      const paymentResult = await paymentResponse.json();

      // If payment is successful, show loader and then trigger the confirmation API
      if (paymentResult.status === "SUCCESS") {
        setShowLoader(true);

        // Wait for 6 seconds while showing the loader
        await new Promise((resolve) => setTimeout(resolve, 6000));
        const token = localStorage.getItem('token'); // Get token from localStorage

        // Trigger the confirmation API
        const confirmResponse = await fetch(
          `//34.222.114.62:8080/api/bookings/${bookingData.id}/confirm`,
          {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Add Bearer token here
            },
          }
        );
        const confirmationResult = await confirmResponse.json();
        setConfirmationData(confirmationResult);

        if (confirmationResult.status === "CONFIRMED") {
          toast.success("Booking confirmed successfully!");
          navigate('/my-bookings');
        } else {
          navigate('/my-bookings');
          toast.error("Booking confirmation failed. Please try again.");
        }
      } else {
        toast.error("Payment failed, Contact admin.");
        navigate('/my-bookings');
      }
    } catch (error) {
      console.error("Payment or confirmation failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      setShowLoader(false);
    }
  };

  // const handleOpenModal = () => {
  //   setIsModalOpen(true);
  //   handleBookTicket();
  // };

  const handleCloseModal = () => {
    // setIsModalOpen(false);
    setSelectedPaymentMethod("");
    setConfirmationData(null);
    onClose?.(); // Call the onClose prop if it exists
  };

  return (
    <div className="py-6 flex items-center justify-center">
      <Modal>
        <ModalTrigger
          className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn"
        
        >
          <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
            Book your Ticket
          </span>
          <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
            🍿🎬
          </div>
        </ModalTrigger>
        <ModalBody>
          <ModalContent>
            {showLoader ? (
              <MultiStepLoaderDemo />
            ) : (
              <>
                <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-extrabold text-center mb-8">
                  Secure Your Spot for{" "}
                  <span className="inline-flex items-center px-2 py-1 rounded-lg bg-gradient-to-r from-purple-400 to-pink-600 text-white border border-purple-300 dark:border-neutral-700 dark:bg-gradient-to-r dark:from-purple-600 dark:to-pink-700">
                    <span className="whitespace-nowrap">Movie Night / Day</span>
                  </span>{" "}
                  with Just a Few Clicks! 🍿🎬
                </h4>

                {confirmationData ? (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold">Booking Confirmation</h2>
                    <p className="text-lg text-neutral-600 dark:text-neutral-100">
                      ID: {confirmationData.id}
                    </p>
                    <p>User ID: {confirmationData.userId}</p>
                    <p>Show ID: {confirmationData.showId}</p>
                    <p>Seats: {confirmationData.tickets.join(", ")}</p>
                    <p>
                      Total Price: ${confirmationData.totalPrice.toFixed(2)}
                    </p>
                    <p>Status: {confirmationData.status}</p>
                  </div>
                ) : (
                  bookingData && (
                    <div className="text-center">
                      <h2 className="text-2xl font-bold">Booking Summary</h2>
                      <p className="text-lg text-neutral-600 dark:text-neutral-100">
                        ID: {bookingData.id}
                      </p>
                      <p>User ID: {bookingData.userId}</p>
                      <p>Show ID: {bookingData.showId}</p>
                      <p>Seats: {bookingData.tickets.join(", ")}</p>
                      <p>Total Price: ${bookingData.totalPrice.toFixed(2)}</p>
                      <p>Subtotal: ${bookingData.subtotal.toFixed(2)}</p>
                      <p>
                        Convenience Fee: $
                        {bookingData.convenienceFee.toFixed(2)}
                      </p>
                      <p>Tax: ${bookingData.tax.toFixed(2)}</p>
                      <p>Status: {bookingData.status}</p>
                    </div>
                  )
                )}

                {!confirmationData && (
                  <div className="mt-4">
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Payment Method</FormLabel>
                      <RadioGroup>
                        {[
                          "CREDIT_CARD",
                          "DEBIT_CARD",
                          "NET_BANKING",
                          "UPI",
                        ].map(
                          (method) =>
                            (selectedPaymentMethod === "" ||
                              selectedPaymentMethod === method) && (
                              <FormControlLabel
                                key={method}
                                value={method}
                                control={
                                  <Radio
                                    checked={selectedPaymentMethod === method}
                                  />
                                }
                                label={method.replace("_", " ")}
                                onClick={() =>
                                  handlePaymentMethodChange(method)
                                }
                              />
                            )
                        )}
                      </RadioGroup>
                    </FormControl>
                  </div>
                )}
              </>
            )}
          </ModalContent>
          <ModalFooter className="gap-4">
            <button
              className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            {!confirmationData && !showLoader && (
              <button
                className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28"
                onClick={handleCompletePayment}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Complete Payment"}
              </button>
            )}
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default AnimatedModalDemo;