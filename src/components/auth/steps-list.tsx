"use client";

import { CheckCircle2, Circle } from "lucide-react";

const steps = [
  {
    title: "STEP 1",
    description: "Lorem ipsum dolor sit amet, consectetur.",
    completed: true,
  },
  {
    title: "STEP 2",
    description: "Lorem ipsum dolor sit amet, consectetur.",
    completed: true,
  },
  {
    title: "STEP 3",
    description: "Lorem ipsum dolor sit amet, consectetur.",
    completed: true,
  },
  {
    title: "STEP 4",
    description: "Lorem ipsum dolor sit amet, consectetur.",
    completed: false,
  },
];

export default function StepsTimeline() {
  return (
    <div className="relative ml-8">
      <div
        className="absolute top-0 left-4 h-full w-0.5 bg-gray-300"
        style={{ height: "calc(100% - 2rem)" }}
      />
      {steps.map((step, index) => (
        <div key={index} className="flex items-start mb-6 relative">
          <div className="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-300">
            {step.completed ? (
              <CheckCircle2 className="text-black rounded-full p-1" size={24} />
            ) : (
              <Circle className="text-black" size={24} />
            )}
          </div>
          <div className="ml-12">
            <h4 className="text-white text-sm font-bold">{step.title}</h4>
            <p className="text-gray-300 text-sm">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
