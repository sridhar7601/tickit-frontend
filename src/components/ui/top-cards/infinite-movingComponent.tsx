"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "../top-cards/infinite-moving-cards";

 function InfiniteMovingCard() {
  return (
    <div className="h-20rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="left"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    ImageUrl:"https://i.pinimg.com/564x/95/45/4a/95454a0bfb23e0ef73a1533f13c4c980.jpg",    
    name: "Charles Dickens",
    title: "A Tale of Two Cities",
  },
  {
    ImageUrl:"https://i.pinimg.com/564x/1d/62/6a/1d626a7b844201f1e3354a0f7cdb263a.jpg",    
    name: "William Shakespeare",
    title: "Hamlet",
  },
  {
    ImageUrl: "https://i.pinimg.com/564x/6a/ed/26/6aed267fb1ca0c6ad395f51282644e7f.jpg",
    name: "Edgar Allan Poe",
    title: "A Dream Within a Dream",
  },
  {
    ImageUrl:"https://i.pinimg.com/564x/66/21/34/6621347b722cfcb7a4cef7fb23bb5291.jpg",  
    name: "Jane Austen",
    title: "Pride and Prejudice",
  },
  {
    ImageUrl:"https://i.pinimg.com/564x/4c/be/c9/4cbec9948da68c62bc87996725e2f54e.jpg",
    name: "Herman Melville",
    title: "Moby-Dick",
  },
];
export default InfiniteMovingCard;