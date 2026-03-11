import { Trophy, ChevronRight } from 'lucide-react';
import { ComparisonResult } from '../types';

export function Summary({ result }: { result: ComparisonResult }) {
  const getMarginColor = (margin: string) => {
    switch (margin) {
      case 'Slight': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Moderate': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Significant': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Dominant': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      
      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-slate-950 border border-slate-800 rounded-2xl min-w-[200px]">
          <Trophy className="w-12 h-12 text-yellow-500 mb-4" />
          <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-1">Winner</div>
          <div className="text-2xl font-bold text-white text-center">{result.winner}</div>
          <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${getMarginColor(result.marginOfVictory)}`}>
            {result.marginOfVictory} Margin
          </div>
        </div>
        
        <div className="flex-1 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">The Verdict</h3>
            <p className="text-slate-300 leading-relaxed">
              {result.summary}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Key Differences</h4>
            <ul className="space-y-2">
              {result.keyDifferences.map((diff, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{diff}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
