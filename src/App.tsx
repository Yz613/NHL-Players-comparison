import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, X, BarChart3, Swords } from 'lucide-react';
import { comparePlayers } from './lib/gemini';
import { ComparisonResult } from './types';
import { ComparisonTable } from './components/ComparisonTable';
import { RadarChartComponent } from './components/RadarChart';
import { Summary } from './components/Summary';
import { nhlPlayers } from './data/players';

export default function App() {
  const [players, setPlayers] = useState<string[]>(['', '']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'team'>('name');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setFocusedIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSuggestions = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const filtered = nhlPlayers.filter(p => 
      !query || 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.team.toLowerCase().includes(lowerQuery)
    );
    
    return filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'team') {
        const teamCompare = a.team.localeCompare(b.team);
        if (teamCompare !== 0) return teamCompare;
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  };

  const handleAddPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, '']);
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length > 2) {
      const newPlayers = [...players];
      newPlayers.splice(index, 1);
      setPlayers(newPlayers);
    }
  };

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const handleCompare = async () => {
    const validPlayers = players.filter(p => p.trim() !== '');
    if (validPlayers.length < 2) {
      setError('Please enter at least 2 players to compare.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await comparePlayers(validPlayers);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to compare players. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-6"
          >
            <Swords className="w-8 h-8 text-blue-400" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4"
          >
            NHL Head-to-Head
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            Compare up to 4 NHL players using advanced analytics, points per game, and defensive metrics to see who truly dominates the ice.
          </motion.p>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm mb-12"
          ref={containerRef}
        >
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2 text-sm bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Sort suggestions by:</span>
              <button 
                onClick={() => setSortBy('name')} 
                className={`transition-colors ${sortBy === 'name' ? 'text-blue-400 font-semibold' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Name
              </button>
              <span className="text-slate-700">|</span>
              <button 
                onClick={() => setSortBy('team')} 
                className={`transition-colors ${sortBy === 'team' ? 'text-blue-400 font-semibold' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Team
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {players.map((player, index) => {
              const suggestions = getSuggestions(player);
              const showSuggestions = focusedIndex === index && (player.length > 0 || suggestions.length > 0);

              return (
                <div key={index} className="relative group">
                  <input
                    type="text"
                    value={player}
                    onChange={(e) => handlePlayerChange(index, e.target.value)}
                    onFocus={() => setFocusedIndex(index)}
                    placeholder={`Player ${index + 1}`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                  {players.length > 2 && (
                    <button
                      onClick={() => handleRemovePlayer(index)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove player"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {showSuggestions && (
                    <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                      {suggestions.length > 0 ? (
                        <ul className="py-1">
                          {suggestions.map((p, i) => (
                            <li key={i}>
                              <button
                                onClick={() => {
                                  handlePlayerChange(index, p.name);
                                  setFocusedIndex(null);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-slate-700/50 transition-colors flex justify-between items-center group/item"
                              >
                                <span className="font-medium text-slate-200 group-hover/item:text-white">{p.name}</span>
                                <span className="text-xs text-slate-400 group-hover/item:text-slate-300">{p.team}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="px-4 py-3 text-sm text-slate-400 text-center">
                          No players found. You can still compare custom names!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            
            {players.length < 4 && (
              <button
                onClick={handleAddPlayer}
                className="flex items-center justify-center gap-2 border border-dashed border-slate-700 rounded-xl px-4 py-3 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Add Player</span>
              </button>
            )}
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleCompare}
              disabled={loading || players.filter(p => p.trim() !== '').length < 2}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Stats...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5" />
                  <span>Compare Players</span>
                </>
              )}
            </button>
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
          </div>
        </motion.div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <Summary result={result} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ComparisonTable players={result.players} />
              </div>
              <div className="lg:col-span-1">
                <RadarChartComponent players={result.players} />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
