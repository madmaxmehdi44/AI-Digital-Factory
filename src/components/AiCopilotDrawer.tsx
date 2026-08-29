import React, { useState } from "react";
import {
  Sparkles,
  Send,
  X,
  Terminal,
  Bot,
  User,
  Zap,
  HelpCircle,
  RefreshCw
} from "lucide-react";
import { fetchLowLatencyCopilot } from "../lib/geminiClient";

interface AiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeContext: string;
}

export const AiCopilotDrawer: React.FC<AiCopilotDrawerProps> = ({
  isOpen,
  onClose,
  activeContext
}) => {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string; time: string }>>([
    {
      role: "assistant",
      text: `Hello! I am your AI Operations Copilot powered by low-latency Gemini AI. Ask me anything about WordPress Gutenberg FSE development, WP-CLI automation, cPanel API integrations, Redis caching, or error remediation.`,
      time: "Now"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg = inputText;
    setInputText("");
    setMessages(prev => [...prev, { role: "user", text: userMsg, time: "Now" }]);
    setIsLoading(true);

    try {
      const res = await fetchLowLatencyCopilot({
        prompt: userMsg,
        context: activeContext
      });

      setMessages(prev => [...prev, { role: "assistant", text: res.response, time: "Now" }]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: `WP-CLI Optimization tip: You can verify cache status with 'wp redis status' or regenerate thumbnail WebP sets using 'wp media regenerate --yes'.`,
          time: "Now"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100">AI Operations Copilot</h3>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Low-Latency Gemini Engine</span>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 ${
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                m.role === "user" ? "bg-indigo-600 text-white" : "bg-emerald-600 text-white"
              }`}
            >
              {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                m.role === "user"
                  ? "bg-indigo-600 text-white font-medium rounded-tr-none"
                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none font-mono"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Copilot is formulating response...</span>
          </div>
        )}
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2 bg-slate-900/40 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono text-slate-400">
        <button
          onClick={() => setInputText("How do I activate Redis Object cache via WP-CLI?")}
          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:text-slate-200 whitespace-nowrap"
        >
          Redis WP-CLI
        </button>
        <button
          onClick={() => setInputText("What is the difference between theme.json v2 and v3 in WordPress 6.7?")}
          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:text-slate-200 whitespace-nowrap"
        >
          theme.json v3
        </button>
        <button
          onClick={() => setInputText("How do I fix HTTP 500 error after plugin update?")}
          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:text-slate-200 whitespace-nowrap"
        >
          Fix 500 Error
        </button>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Ask copilot about WP, DevOps, themes..."
          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
