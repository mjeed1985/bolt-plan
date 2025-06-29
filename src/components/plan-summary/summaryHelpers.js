import React from 'react';

export const getDisplayValue = (value, optionsArray, placeholder = "غير محدد") => {
  if (value === null || value === undefined || value === '') return placeholder;
  const foundOption = optionsArray.find(opt => opt.value === value);
  return foundOption ? foundOption.label : String(value);
};