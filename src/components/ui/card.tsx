// src/components/ui/card.tsx
export const Card = ({ children, className = '', ref  }: {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}) => (
  <div className={`rounded shadow-md ${className}`} ref={ref}>{children}</div>
);

export const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4">{children}</div>
);
