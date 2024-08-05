import React from 'react';
import { ClipLoader } from 'react-spinners';

interface SpinnerProps {
  loading: boolean;
  size?: number; // Optional size prop to customize spinner size
  color?: string; // Optional color prop to customize spinner color
}

const Spinner: React.FC<SpinnerProps> = ({ loading, size = 50, color = '#ffffff' }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <ClipLoader
        color={color}
        loading={loading}
        size={size}
      />
    </div>
  );
};

export default Spinner;
