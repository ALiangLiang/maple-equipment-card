import React from 'react';

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Radio: React.FC<RadioProps> = ({ label, ...props }) => (
  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
    <input type="radio" {...props} />
    {label}
  </label>
);

export default Radio;
