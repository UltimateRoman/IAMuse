import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={`rounded-lg shadow-xl overflow-hidden transition-transform transform hover:scale-105 border border-gray-200 ${className}`}
      onClick={onClick}
      style={{
        background: "linear-gradient(135deg, #f0f4f8, #d9e8f0)",
      }}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  onDetailsClick?: () => void;
  children?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title }) => {
  return (
    <div
      className="px-6 py-4 border-b flex items-center justify-between rounded-t-lg"
      style={{
        background: "linear-gradient(135deg, #6a5acd, #7b68ee)",
        color: "#fff",
      }}
    >
      <h2 className="text-lg font-semibold truncate">{title}</h2>
    </div>
  );
};


interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className,
}) => {
  return (
    <h3
      className={`text-lg font-bold ${className}`}
      style={{
        color: "#333",
        background:
          "linear-gradient(90deg, #ffa500, #ff4500)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </h3>
  );
};

interface CardContentProps {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ children }) => {
  return (
    <div
      className="p-8 text-gray-700"
      style={{
        background: "#fff",
        borderRadius: "0 0 8px 8px",
      }}
    >
      {children}
    </div>
  );
};
