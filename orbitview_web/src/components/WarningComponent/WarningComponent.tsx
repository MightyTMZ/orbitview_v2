import React from "react";

interface WarningComponentProps {
  message: string;
}

const WarningComponent = ({ message }: WarningComponentProps) => {
  return (
    <div className="flex items-center justify-between p-4 mb-4 text-yellow-800 bg-yellow-100 border border-yellow-200 rounded-md shadow-sm">
      <div className="flex items-center">
        <svg
          className="w-6 h-6 mr-3 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.29 3.86l-7.33 12.68c-.72 1.24.19 2.78 1.62 2.78h14.66c1.43 0 2.34-1.54 1.62-2.78L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01"
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default WarningComponent;
