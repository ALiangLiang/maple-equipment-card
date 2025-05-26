// src/components/ui/card.tsx
export const Card = ({ children, className = '', ref  }) => (
  <div className={`rounded shadow-md ${className}`} ref={ref}>{children}</div>
);

export const CardContent = ({ children }) => (
  <div className="p-4">{children}</div>
);
