import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { PlayerStats } from '../types';

export function RadarChartComponent({ players }: { players: PlayerStats[] }) {
  // Normalize stats to 0-100 scale for radar chart
  const statsToChart = [
    { key: 'pointsPerGame', name: 'Offense (PPG)' },
    { key: 'corsiForPercentage', name: 'Possession (CF%)' },
    { key: 'expectedGoalsForPercentage', name: 'Quality (xGF%)' },
    { key: 'defensivePointShares', name: 'Defense (DPS)' },
    { key: 'hits', name: 'Physicality (Hits)' },
  ];

  const maxValues: Record<string, number> = {};
  statsToChart.forEach(stat => {
    maxValues[stat.key] = Math.max(...players.map(p => Number(p[stat.key as keyof PlayerStats]) || 0), 1); // avoid div by 0
  });

  const data = statsToChart.map(stat => {
    const dataPoint: any = { subject: stat.name };
    players.forEach(p => {
      const val = Number(p[stat.key as keyof PlayerStats]) || 0;
      if (stat.key.includes('Percentage')) {
         dataPoint[p.name] = val;
      } else {
         dataPoint[p.name] = (val / maxValues[stat.key]) * 100;
      }
    });
    return dataPoint;
  });

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-full min-h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-6">Relative Strengths</h3>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '0.5rem' }}
              itemStyle={{ color: '#e2e8f0' }}
              formatter={(value: number) => Math.round(value)}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {players.map((p, i) => (
              <Radar
                key={p.name}
                name={p.name}
                dataKey={p.name}
                stroke={colors[i % colors.length]}
                fill={colors[i % colors.length]}
                fillOpacity={0.3}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
