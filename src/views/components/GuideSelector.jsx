import React from 'react';
import { Icons } from './Icons';
import { BEAT_GUIDES } from '../../utils/constants';

export const GuideSelector = ({ onSelect, onClose, activeGuide }) => (
  <div className="absolute top-20 right-4 z-40 bg-white border-4 border-indigo-200 rounded-3xl shadow-2xl w-72 overflow-hidden animate-fade-in text-slate-800">
    <div className="p-4 bg-indigo-100 border-b-2 border-indigo-200 flex justify-between items-center">
      <h3 className="font-black text-indigo-600 flex items-center gap-2"><Icons.Book /> Recipe Book</h3>
      <button onClick={onClose}><Icons.Close /></button>
    </div>
    <div className="p-3 space-y-2">
      <button onClick={() => onSelect(null)} className="w-full text-left p-4 rounded-2xl border-2 hover:bg-slate-50 border-slate-200 font-bold">My Own Beat</button>
      {BEAT_GUIDES.map((guide) => (
        <button key={guide.name} onClick={() => onSelect(guide)} className={`w-full text-left p-4 rounded-2xl border-2 ${activeGuide?.name === guide.name ? 'bg-indigo-500 text-white' : 'hover:bg-indigo-50 border-slate-200'}`}>
          <div className="font-bold">{guide.name}</div>
          <div className="text-xs opacity-80 mt-1">{guide.desc}</div>
        </button>
      ))}
    </div>
  </div>
);
