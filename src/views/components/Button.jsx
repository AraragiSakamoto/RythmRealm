import React from 'react';

export const Button = ({ children, onClick, className = "", variant = "primary", disabled = false, size = "md" }) => {
  const sizes = { sm: "px-3 py-1 text-sm rounded-xl", md: "px-6 py-3 rounded-2xl text-lg", lg: "px-8 py-4 rounded-3xl text-xl" };
  const variants = {
    primary: "bg-indigo-500 hover:bg-indigo-400 text-white border-b-8 border-indigo-700 active:border-b-0 active:translate-y-2",
    secondary: "bg-white hover:bg-slate-100 text-slate-700 border-b-8 border-slate-300 active:border-b-0 active:translate-y-2",
    success: "bg-green-500 hover:bg-green-400 text-white border-b-8 border-green-700 active:border-b-0 active:translate-y-2",
    danger: "bg-red-500 hover:bg-red-400 text-white border-b-8 border-red-700 active:border-b-0 active:translate-y-2",
    locked: "bg-slate-300 text-slate-500 border-b-8 border-slate-400 cursor-not-allowed"
  };
  return (
    <button onClick={disabled ? null : onClick} className={`font-black uppercase tracking-wide transition-all shadow-xl flex items-center justify-center gap-3 ${sizes[size]} ${variants[disabled ? 'locked' : variant]} ${className}`}>
      {children}
    </button>
  );
};
