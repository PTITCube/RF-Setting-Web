import React from 'react';
import { Radio, BookOpen, Github, Code2, ExternalLink } from 'lucide-react';

export default function Header({ onOpenGuide, onOpenCode }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and Titles */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 text-white">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white">
                PTITCube RF Configurator
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                v1.2.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Công cụ cấu hình tham số không dây Ebyte E32 & Ashining AS32
            </p>
          </div>
        </div>

        {/* Action badges and navigation */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenCode}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mã C++ Arduino</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Sơ đồ chân & M0/M1</span>
          </button>

          <a
            href="https://github.com/PTITCube/RF-Setting-Web"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Github className="w-3.5 h-3.5 text-slate-300" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
