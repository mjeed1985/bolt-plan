import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';

export const NumberStepper = ({ value, onChange, min = 0, max = 500, step = 1, id, disabled, className }) => {
  const handleIncrement = () => {
    const newValue = Math.min(max, Number(value) + step);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, Number(value) - step);
    onChange(newValue);
  };

  const handleChange = (e) => {
    let newValue = Number(e.target.value);
    if (isNaN(newValue)) {
      newValue = min;
    }
    newValue = Math.max(min, Math.min(max, newValue));
    onChange(newValue);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={disabled || Number(value) <= min}
        className="h-10 w-10 flex-shrink-0"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        id={id}
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="h-10 w-20 text-center appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={disabled || Number(value) >= max}
        className="h-10 w-10 flex-shrink-0"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};