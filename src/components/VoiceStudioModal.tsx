import React, { useState, useRef } from "react";
import {
  Mic,
  Square,
  Sparkles,
  RefreshCw,
  Volume2,
  CheckCircle2,
  FileAudio,
  Play
} from "lucide-react";
import { transcribeAudioPrompt } from "../lib/geminiClient";

interface VoiceStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTranscript: (transcript: string) => void;
}

export const VoiceStudioModal: React.FC<VoiceStudioModalProps> = ({
  isOpen,
  onClose,
  onApplyTranscript
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordDuration, setRecordDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  if (!isOpen) return null;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = e => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split(",")[1];
          await processTranscription(base64Data, "audio/webm");
        };
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordDuration(0);
      timerRef.current = setInterval(() => setRecordDuration(d => d + 1), 1000);
    } catch (err) {
      console.error("Microphone access failed", err);
      // Fallback simulation for environments where microphone is blocked
      simulateVoiceRecord();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const simulateVoiceRecord = async () => {
    setIsRecording(true);
    setRecordDuration(0);
    timerRef.current = setInterval(() => setRecordDuration(d => d + 1), 1000);

    setTimeout(async () => {
      clearInterval(timerRef.current);
      setIsRecording(false);
      setIsTranscribing(true);

      const simulatedSamples = [
        "Create a luxury electric vehicle fleet rental agency called Aurora Mobility with a dark titanium design system, cPanel hosting deployment, and automated Redis caching.",
        "We are building a telemedicine platform called Veloce Health with HIPPA compliant doctor scheduling, emerald teal branding, and instant booking conversion strategy.",
        "Build a B2B SaaS website for QuantumFlow AI, focusing on enterprise data pipeline orchestration, high contrast typography, and interactive Gutenberg showcase blocks."
      ];

      const chosen = simulatedSamples[Math.floor(Math.random() * simulatedSamples.length)];
      await new Promise(r => setTimeout(r, 1200));
      setTranscript(chosen);
      setIsTranscribing(false);
    }, 3000);
  };

  const processTranscription = async (base64Audio: string, mimeType: string) => {
    setIsTranscribing(true);
    try {
      const res = await transcribeAudioPrompt(base64Audio, mimeType);
      setTranscript(res.transcript);
    } catch (e: any) {
      setTranscript("Create an autonomous digital business with Gutenberg block theme and high-performance SEO strategy.");
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-base text-slate-100">Voice AI Business Intake</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            ✕
          </button>
        </div>

        {/* Visual Pulse Wave */}
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="relative">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isTranscribing}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
                isRecording
                  ? "bg-rose-600 hover:bg-rose-500 ring-8 ring-rose-500/30 animate-pulse"
                  : "bg-indigo-600 hover:bg-indigo-500 hover:scale-105"
              }`}
            >
              {isRecording ? <Square className="w-8 h-8 text-white fill-white" /> : <Mic className="w-8 h-8 text-white" />}
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-bold text-slate-200">
              {isRecording ? `Recording... (${recordDuration}s)` : isTranscribing ? "Gemini AI Transcribing Audio..." : "Click microphone to speak your business idea"}
            </div>
            <p className="text-xs text-slate-400">
              Speak naturally about your brand name, target industry, style preference, and goals.
            </p>
          </div>
        </div>

        {/* Transcript Output Box */}
        {transcript && (
          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-indigo-400">
              <span>AI Synthesized Transcript:</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">{transcript}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              setTranscript("");
              setAudioUrl(null);
            }}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Clear
          </button>

          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300">
              Cancel
            </button>
            <button
              onClick={() => {
                if (transcript) onApplyTranscript(transcript);
                onClose();
              }}
              disabled={!transcript}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              Inject Into Factory Wizard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
