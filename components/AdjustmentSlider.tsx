import React from 'react';

interface AdjustmentSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled: boolean;
}

const AdjustmentSlider: React.FC<AdjustmentSliderProps> = ({ label, value, onChange, min = 0, max = 200, disabled }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <span className="text-xs font-mono bg-gray-700 px-1.5 py-0.5 rounded">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:cursor-not-allowed disabled:accent-gray-500"
      />
    </div>
  );
};

export default AdjustmentSlider;
