import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center">
      {/* Abstract Background SVG Elements from Mockup */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <svg fill="none" viewBox="0 0 1280 832" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
          <path d="M900 200L1100 400L950 650" stroke="#E2E8F0" strokeWidth="2" />
          <path d="M1100 400L1250 300" stroke="#E2E8F0" strokeWidth="2" />
          <defs>
            <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1100 400) rotate(90) scale(180)">
              <stop stopColor="#0EA5E9" />
              <stop offset="1" stopColor="#F8FAFC" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="1100" cy="400" r="180" stroke="url(#paint0_radial)" strokeWidth="40" strokeOpacity="0.05" />
          <circle cx="900" cy="200" r="100" fill="#F1F5F9" />
          <circle cx="950" cy="650" r="60" fill="#F1F5F9" />
          <circle cx="1100" cy="400" r="6" fill="#0EA5E9" />
          <circle cx="900" cy="200" r="4" fill="#14B8A6" />
          <circle cx="1250" cy="300" r="4" fill="#0EA5E9" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-7xl px-8 flex flex-col justify-center min-h-[500px]">
        {/* Modern Logo */}
        <div className="mb-8">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="16" fill="url(#logo_gradient)" />
            <path d="M20 32C20 25.3726 25.3726 20 32 20V32H20Z" fill="white" />
            <path d="M44 32C44 38.6274 38.6274 44 32 44V32H44Z" fill="white" fillOpacity="0.6" />
            <path d="M32 32H44C44 25.3726 38.6274 20 32 20V32Z" fill="white" fillOpacity="0.3" />
            <path d="M32 32H20C20 38.6274 25.3726 44 32 44V32Z" fill="white" fillOpacity="0.8" />
            <defs>
              <linearGradient id="logo_gradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0EA5E9" />
                <stop offset="1" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Text Content */}
        <h1 className="text-7xl font-extrabold text-slate-800 tracking-tight mb-4">
          StockSync.
        </h1>
        <p className="text-3xl text-slate-500 font-normal mb-10 max-w-2xl">
          Intelligent Multi-Location Inventory Reconciliation.
        </p>

        {/* Prepared For Badge */}
        <div className="flex items-center mb-10">
          <div className="bg-white border border-slate-200 rounded-lg px-6 py-3 flex items-center shadow-sm">
            <span className="text-slate-400 font-medium text-sm mr-2">Prepared for:</span>
            <span className="text-slate-700 font-semibold text-sm">B Special Business Ltd</span>
          </div>
        </div>

        {/* CTA Button */}
        <div>
          <Link
            to="/login"
            className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-sky-500 to-teal-500 rounded-xl hover:from-sky-400 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 overflow-hidden shadow-[0_10px_20px_rgba(14,165,233,0.3)] hover:shadow-[0_15px_25px_rgba(14,165,233,0.4)] hover:-translate-y-0.5"
          >
            Get Started
            <svg className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="text-slate-400 text-sm border-t border-slate-200 pt-6 px-12 max-w-7xl w-full text-center">
          © 2026 StockSync. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Welcome;
