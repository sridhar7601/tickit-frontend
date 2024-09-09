"use client";
import { React, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "./animated-modal.tsx";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
// import Image from "next/image";
import { motion } from "framer-motion";
import MultiStepLoaderDemo from "../step-loader/multi-step-loader";

function AnimatedModalDemo({ bookingData, handleBookTicket }) {

  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const handlePaymentMethodChange = (method) => {
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
        `http://34.222.87.166:8080/api/bookings/${bookingData.id}/pay`,
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
          `http://34.222.87.166:8080/api/bookings/${bookingData.id}/confirm`,
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
          toast.error("Booking confirmation failed. Please try again.");
          navigate('/my-bookings');
        }
      } else {
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment or confirmation failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      setShowLoader(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    handleBookTicket();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPaymentMethod("");
    setConfirmationData(null);
  };

  return (
    <div className="py-6 flex items-center justify-center">
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalTrigger
          className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn"
          onClick={handleOpenModal}
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

const PlaneIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3z" />
    </svg>
  );
};

const VacationIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M17.553 16.75a7.5 7.5 0 0 0 -10.606 0" />
      <path d="M18 3.804a6 6 0 0 0 -8.196 2.196l10.392 6a6 6 0 0 0 -2.196 -8.196z" />
      <path d="M16.732 10c1.658 -2.87 2.225 -5.644 1.268 -6.196c-.957 -.552 -3.075 1.326 -4.732 4.196" />
      <path d="M15 9l-3 5.196" />
      <path d="M3 19.25a2.4 2.4 0 0 1 1 -.25a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 1 .25" />
    </svg>
  );
};

const ElevatorIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 4m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" />
      <path d="M10 10l2 -2l2 2" />
      <path d="M10 14l2 2l2 -2" />
    </svg>
  );
};

const FoodIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M20 20c0 -3.952 -.966 -16 -4.038 -16s-3.962 9.087 -3.962 14.756c0 -5.669 -.896 -14.756 -3.962 -14.756c-3.065 0 -4.038 12.048 -4.038 16" />
    </svg>
  );
};

const MicIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 12.9a5 5 0 1 0 -3.902 -3.9" />
      <path d="M15 12.9l-3.902 -3.899l-7.513 8.584a2 2 0 1 0 2.827 2.83l8.588 -7.515z" />
    </svg>
  );
};

const ParachuteIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M22 12a10 10 0 1 0 -20 0" />
      <path d="M22 12c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3c0 -1.66 -1.57 -3 -3.5 -3s-3.5 1.34 -3.5 3c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3" />
      <path d="M2 12l10 10l-3.5 -10" />
      <path d="M15.5 12l-3.5 10l10 -10" />
    </svg>
  );
};
export default AnimatedModalDemo;
