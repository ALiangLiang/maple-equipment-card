// src/components/ui/button.tsx
export const Button = ({ children, onClick, variant = 'default' }) => {
  const base = 'px-3 py-1 rounded font-bold';
  const styles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button className={`${base} ${styles[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
};
