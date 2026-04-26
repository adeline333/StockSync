import React from 'react';
import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex font-sans bg-slate-100 dark:bg-slate-950 transition-colors duration-200">
      <Sidebar />

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#0EA5E9"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)"/>
        </svg>
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #0EA5E9 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #14B8A6 0%, transparent 70%)' }} />
      </div>

      <main className="flex-1 ml-64 flex flex-col min-h-screen relative z-10 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
