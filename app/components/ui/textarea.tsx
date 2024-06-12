// components/ui/textarea.tsx
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: React.FC<TextareaProps> = ({ className = '', ...props }) => {
  return <textarea className={`resize-none ${className}`} {...props} />;
};
