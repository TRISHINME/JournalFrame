import React, { useState, useMemo } from 'react';
import { JournalEntry, UserProfile } from '../types';
import { deleteEntry } from '../services/api';
import { CognitiveAnalysisCard } from './CognitiveAnalysisCard';
import { Search, Trash2, Calendar, Brain, Download, ChevronDown, ChevronUp, Database, Sparkles } from 'lucide-react';

interface Props {
  user: UserProfile;
  entries: JournalEntry[];
  onDeleteSuccess: (id: string) => void;
  loading: boolean;
  onRefresh: () => void;
}

export const EntriesHistory: React.FC<Props> = ({
  user,
  entries,
  onDeleteSuccess,
  loading,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBiasFilter, setSelectedBiasFilter] = useState<string>('all');
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Extract unique biases across all entries
  const availableBiases = useMemo(() => {
    const biasSet = new Set<string>();
    entries.forEach((e) => {
      e.cognitiveAnalysis?.biasesDetected?.forEach((b) => {
        if (b && b !== 'None Detected') biasSet.add(b);
      });
    });
    return Array.from(biasSet);
  }, [entries]);

  // Filtered entries based on search and bias tag
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchSearch =
        searchTerm === '' ||
        entry.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.reply.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.summary?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchBias =
        selectedBiasFilter === 'all' ||
        entry.cognitiveAnalysis?.biasesDetected?.includes(selectedBiasFilter);

      return matchSearch && matchBias;
    });
  }, [entries, searchTerm, selectedBiasFilter]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this tenant journal log from Firestore?')) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteEntry(user.token, id);
      onDeleteSuccess(id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete entry');
    } finally {
      setDeletingId(null);
    }
  };

  const exportAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `gemini-journal-${user.uid}-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="p-6 bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-[0.15em] text-[#E0E0E0]">
              Journal Vault &amp; Cognitive Logs
            </h2>
          </div>
          <p className="text-[11px] text-[#666666] mt-1">
            Persisted exclusively under <code className="font-mono text-[#888888]">/journals/{user.uid}/entries</code>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="px-3 py-1.5 bg-[#141414] hover:bg-[#1A1A1A] text-[#888888] hover:text-[#E0E0E0] border border-[#222222] text-xs font-medium rounded uppercase tracking-wider transition-colors"
          >
            Refresh Logs
          </button>
          {entries.length > 0 && (
            <button
              onClick={exportAsJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E0E0E0] hover:bg-white text-black text-xs font-bold rounded uppercase tracking-wider transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reflections, insights, reframing tips..."
            className="w-full pl-9 pr-4 py-2 bg-[#111111] border border-[#222222] rounded-lg text-xs text-[#E0E0E0] placeholder:text-[#555555] focus:outline-none focus:border-[#F27D26] transition-all"
          />
        </div>

        {availableBiases.length > 0 && (
          <select
            value={selectedBiasFilter}
            onChange={(e) => setSelectedBiasFilter(e.target.value)}
            className="px-3 py-2 bg-[#111111] border border-[#222222] rounded-lg text-xs text-[#AAAAAA] focus:outline-none focus:border-[#F27D26]"
          >
            <option value="all">All Cognitive Patterns</option>
            {availableBiases.map((bias) => (
              <option key={bias} value={bias}>
                {bias}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Entries List */}
      {loading ? (
        <div className="p-12 text-center bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A]">
          <div className="w-5 h-5 border-2 border-[#F27D26] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-[#666666]">Querying tenant-isolated logs from Firestore...</p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="p-12 text-center bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] space-y-3">
          <Brain className="w-8 h-8 text-[#333333] mx-auto" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#888888]">No Journal Entries Found</h3>
          <p className="text-xs text-[#555555] max-w-sm mx-auto">
            {searchTerm || selectedBiasFilter !== 'all'
              ? 'Try adjusting your search query or cognitive filter.'
              : 'Begin a reflection session in the Reflect & Chat tab to start logging your cognitive journal.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const isExpanded = expandedEntryId === entry.id;
            return (
              <div
                key={entry.id}
                className="bg-[#0A0A0A] rounded-xl border border-[#1A1A1A] overflow-hidden shadow-xs hover:border-[#2A2A2A] transition-all"
              >
                {/* Entry Header Preview */}
                <div
                  onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                  className="p-5 cursor-pointer flex items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 text-[#666666] font-mono text-[10px]">
                        <Calendar className="w-3 h-3 text-[#555555]" />
                        {new Date(entry.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      {entry.cognitiveAnalysis?.dominantEmotion && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#141414] text-[#F27D26] border border-[#F27D26]/30">
                          {entry.cognitiveAnalysis.dominantEmotion}
                        </span>
                      )}

                      {entry.cognitiveAnalysis?.biasesDetected?.map((bias, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider border ${
                            bias.toLowerCase().includes('none')
                              ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30'
                              : 'bg-[#161616] text-[#AAAAAA] border-[#2A2A2A]'
                          }`}
                        >
                          {bias}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm font-serif italic text-[#E0E0E0] line-clamp-2 leading-snug">
                      "{entry.message}"
                    </p>

                    {entry.summary && (
                      <p className="text-xs text-[#777777] line-clamp-2">
                        <span className="font-medium text-[#999999]">Summary: </span>
                        {entry.summary}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => handleDelete(entry.id, e)}
                      disabled={deletingId === entry.id}
                      className="p-2 text-[#555555] hover:text-rose-400 hover:bg-[#1A1A1A] rounded transition-colors"
                      title="Delete entry from tenant storage"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button className="p-2 text-[#555555] hover:text-[#CCCCCC] rounded">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 border-t border-[#161616] space-y-4 bg-[#080808]">
                    {/* User Prompt */}
                    <div className="p-4 bg-[#111111] rounded-lg border border-[#222222]">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#666666] block mb-1">
                        Your Journal Reflection
                      </span>
                      <p className="text-sm font-serif italic text-[#E0E0E0] whitespace-pre-wrap leading-relaxed">
                        {entry.message}
                      </p>
                    </div>

                    {/* Gemini Reply */}
                    <div className="p-4 bg-[#111111] rounded-lg border border-[#222222]">
                      <div className="flex items-center gap-1.5 mb-2 text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Gemini 3.5 Flash Response</span>
                      </div>
                      <p className="text-sm text-[#CCCCCC] whitespace-pre-wrap leading-relaxed">
                        {entry.reply}
                      </p>
                    </div>

                    {/* Cognitive & Sentiment Card */}
                    {entry.cognitiveAnalysis && (
                      <CognitiveAnalysisCard
                        analysis={entry.cognitiveAnalysis}
                        summary={entry.summary}
                      />
                    )}

                    <div className="text-[10px] font-mono text-[#555555] pt-1">
                      Path: /journals/{entry.uid}/entries/{entry.id}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
