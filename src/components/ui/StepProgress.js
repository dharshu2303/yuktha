"use client";

export default function StepProgress({ currentStep, totalSteps = 5 }) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full progress-bar-gradient rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
      />
    </div>
  );
}
