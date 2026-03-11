import { PlayerStats } from '../types';

export function ComparisonTable({ players }: { players: PlayerStats[] }) {
  const stats = [
    { key: 'gamesPlayed', label: 'Games Played' },
    { key: 'goals', label: 'Goals' },
    { key: 'assists', label: 'Assists' },
    { key: 'points', label: 'Points' },
    { key: 'pointsPerGame', label: 'Points/Game' },
    { key: 'corsiForPercentage', label: 'Corsi For %', suffix: '%' },
    { key: 'expectedGoalsForPercentage', label: 'xGoals For %', suffix: '%' },
    { key: 'defensivePointShares', label: 'Def. Point Shares' },
    { key: 'hits', label: 'Hits' },
    { key: 'blocks', label: 'Blocks' },
    { key: 'timeOnIcePerGame', label: 'TOI/Game' },
  ];

  // Find best value for highlighting
  const getBestValueIndex = (statKey: keyof PlayerStats) => {
    if (statKey === 'timeOnIcePerGame') {
      // Parse MM:SS
      const toSeconds = (time: string) => {
        const [m, s] = time.split(':').map(Number);
        return m * 60 + s;
      };
      const values = players.map(p => toSeconds(p[statKey] as string));
      const max = Math.max(...values);
      return values.map((v, i) => v === max ? i : -1).filter(i => i !== -1);
    }
    
    const values = players.map(p => Number(p[statKey]));
    const max = Math.max(...values);
    return values.map((v, i) => v === max ? i : -1).filter(i => i !== -1);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-slate-800 bg-slate-950/50 text-slate-400 font-medium w-1/4">Stat</th>
              {players.map((p, i) => (
                <th key={i} className="p-4 border-b border-slate-800 bg-slate-950/50 font-semibold text-white">
                  <div className="text-lg">{p.name}</div>
                  <div className="text-xs text-slate-500 font-normal mt-1">{p.team} • {p.position}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {stats.map((stat) => {
              const bestIndices = getBestValueIndex(stat.key as keyof PlayerStats);
              
              return (
                <tr key={stat.key} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 text-slate-400 text-sm font-medium">
                    {stat.label}
                  </td>
                  {players.map((p, colIndex) => {
                    const isBest = bestIndices.includes(colIndex);
                    return (
                      <td key={colIndex} className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-mono ${
                          isBest 
                            ? 'bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20' 
                            : 'text-slate-300'
                        }`}>
                          {p[stat.key as keyof PlayerStats]}
                          {stat.suffix || ''}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
