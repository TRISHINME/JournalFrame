import React from 'react';
import { CognitiveAnalysis } from '../types';
import { Brain, Sparkles, AlertCircle, Lightbulb, Compass, CheckCircle2 } from 'lucide-react';

interface Props {
  analysis: CognitiveAnalysis;
  summary?: string;
  className?: string;
}

const BIAS_EXPLANATIONS: Record<string, string> = {
  'Catastrophizing': 'Anticipating the absolute worst possible outcome without considering realistic likelihoods.',
  'All-or-Nothing Thinking': 'Viewing situations in black-and-white extremes (perfection vs total failure).',
  'Emotional Reasoning': 'Assuming that because a feeling is strong, it must represent objective truth.',
  'Mental Filter': 'Fixating exclusively on negative details while filtering out positive evidence.',
  'Mind Reading': 'Assuming you know others\' negative thoughts or motives without confirmation.',
  'Should Statements': 'Imposing rigid, guilt-driven expectations ("I should have", "They must").',
  'Fortune Telling': 'Predicting future failure or disaster as an established fact.',
  'Personalization': 'Holding yourself disproportionately responsible for external events outside your control.',
  'Overgeneralization': 'Viewing a single negative event as a never-ending pattern of defeat.',
  'None Detected': 'Balanced, grounded perspective observed with clear reasoning.'
};

export const CognitiveAnalysisCard: React.FC<Props> = ({ analysis, summary, className = '' }) => {
  const biases = Array.isArray(analysis.biasesDetected) && analysis.biasesDetected.length > 0 
    ? analysis.biasesDetected 
    : ['None Detected'];

  return (
    <div className={`rounded-xl border border-[#222222] bg-[#0A0A0A] p-5 shadow-lg space-y-4 transition-all ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[#161616] text-[#AAAAAA] border border-[#222222]">
            <Brain className="w-3.5 h-3.5 text-[#F27D26]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777]">
            Cognitive Analysis
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] bg-[#F27D26] text-black px-1.5 py-0.5 font-bold uppercase tracking-wider rounded">
            Live
          </span>
          <span className="text-[10px] text-[#555555] font-mono">
            GEMINI-3.5-FLASH
          </span>
        </div>
      </div>

      {/* 2-Sentence Summary if provided */}
      {summary && (
        <div className="p-3.5 bg-[#111111] rounded-lg border border-[#1E1E1E]">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#666666] mb-1">
            <Sparkles className="w-3 h-3 text-[#F27D26]" />
            <span>Session Synthesis</span>
          </div>
          <p className="text-xs text-[#888888] leading-relaxed font-normal">{summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Dominant Emotion */}
        <div className="bg-[#111111] p-4 rounded-lg border border-[#222222] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase text-[#666666] font-bold tracking-widest">
                Dominant Emotion
              </span>
              <Compass className="w-3.5 h-3.5 text-[#555555]" />
            </div>
            <div className="text-base font-serif text-[#F27D26] italic">
              {analysis.dominantEmotion || 'Reflective Clarity'}
            </div>
          </div>
          <div className="w-full bg-[#222222] h-1 mt-3 rounded-full overflow-hidden">
            <div className="bg-[#F27D26] h-full w-[85%]"></div>
          </div>
        </div>

        {/* Biases Detected */}
        <div className="bg-[#111111] p-4 rounded-lg border border-[#222222]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase text-[#666666] font-bold tracking-widest">
              Biases Detected
            </span>
            <AlertCircle className="w-3.5 h-3.5 text-[#555555]" />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {biases.map((bias, idx) => {
              const isNone = bias.toLowerCase().includes('none');
              return (
                <div 
                  key={idx}
                  title={BIAS_EXPLANATIONS[bias] || 'Cognitive thought pattern identified in journal entry'}
                  className={`group relative inline-flex items-center gap-1 text-[9px] px-2 py-1 rounded bg-[#1A1A1A] border ${
                    isNone 
                      ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20' 
                      : 'border-[#333333] text-[#AAAAAA]'
                  } uppercase tracking-wider`}
                >
                  {isNone ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <span className="w-1 h-1 rounded-full bg-[#F27D26]"></span>}
                  <span>{bias}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reframing Tip */}
      {analysis.reframingTip && (
        <div className="bg-[#111111] p-4 rounded-lg border border-[#F27D26]/20 bg-gradient-to-br from-[#111111] to-[#1a130e]">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-[#F27D26]" />
            <span className="text-[10px] uppercase text-[#F27D26] font-bold tracking-widest">
              Reframing Tip &amp; CBT Perspective
            </span>
          </div>
          <p className="text-xs leading-relaxed text-[#AAAAAA] italic font-serif">
            {analysis.reframingTip}
          </p>
        </div>
      )}
    </div>
  );
};
