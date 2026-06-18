import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, X, Send, Sparkles, MessageSquare, AlertTriangle, 
  CheckCircle, ArrowRight, ShieldCheck, Terminal 
} from 'lucide-react';
import { MonitoringZone } from '../types';

interface AICopilotProps {
  selectedZone: MonitoringZone | null;
  onNavigateToTab: (tab: string) => void;
}

interface Message {
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export default function AICopilot({ selectedZone, onNavigateToTab }: AICopilotProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'agent',
      text: "ENVIRONMENTAL COPROCESSOR ACTIVE.\n\nI am India's Environmental Intelligence Copilot. I have full baseline compliance telemetry of India's forest reserves, ecologically sensitive zones (ESZs), and registered mining boundaries.\n\nYou can select a location on the dashboard and ask:\n- 'Why is this location high risk?'\n- 'What action should authorities take?'\n- 'Summarize the environmental impact.'",
      timestamp: '12:06 UTC'
    }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const activeZone = selectedZone || {
    name: 'Hasdeo Forest Region',
    findings: 'Dense canopy loss detected across a contiguous pristine forest sector. High-resolution synthetic-aperture radar (SAR) indicates active bulldozer trails, mechanical equipment mobilization, and unauthorized perimeter expansion bordering critical elephant migration corridors within Hasdeo Arand.',
    recommendations: 'Immediately notify the MoEFCC Sub-Regional Office and Chhattisgarh State Forest Department to freeze clearings. Mobilize a drone monitoring flyover to map coordinates and issue immediate stop-work mandates under the Forest Conservation Act.',
    riskScore: 92,
    threatLevel: 'CRITICAL',
    vegetationLoss: 45.1,
    sizeHectares: 1420,
    region: 'Surguja & Korba Districts, Chhattisgarh'
  };

  // Realistic responsive generator with Indian compliance and MoEFCC frameworks
  const generateResponse = (prompt: string): string => {
    const promptLow = prompt.toLowerCase();

    // 1. Why is this location high risk?
    if (promptLow.includes('why') && promptLow.includes('risk')) {
      return `RISK CHARACTERIZATION REPORT IND- ${activeZone.name.toUpperCase()}:\n\nThis sector is logged at [${activeZone.threatLevel}] threat severity (Risk index: ${activeZone.riskScore}%) due to:\n1. Severe vegetation clearance (-${activeZone.vegetationLoss}% NDVI canopy regression) inside gazetted forest lines.\n2. Proximal disruption to pristine sub-basins or protected tiger/elephant migratory reserves.\n3. High density of unauthorized physical mechanical assets detected via synthetic aperture radar (SAR) overpasses. This violates notified Eco-Sensitive Zone (ESZ) guidelines.`;
    }

    // 2. What action should authorities take?
    if (promptLow.includes('action') || promptLow.includes('take') || promptLow.includes('authorities')) {
      return `RECOMMENDED COMPLIANCE & LEGAL REMEDIATION DIRECTIVES:\n\n1. Enforce Statutory Notices: Issue an immediate show-cause notice to ground operators under Section 2 of the Forest (Conservation) Act and the Environmental Protection Act.\n2. Field Mobilization: Direct District forest guards and State Pollution Control Board representatives to seize heavy machinery (earthmovers, rock pulverizers) and seal access lanes.\n3. Institutional Routing: Route orthorectified boundary violation maps to the State Collector and MoEFCC Sub-Divisional Office to initiate civil remediation and ecological damage recovery penalties.`;
    }

    // 3. Summarize the environmental impact.
    if (promptLow.includes('summarize') || promptLow.includes('impact') || promptLow.includes('environmental')) {
      return `ECOLOGICAL IMPACT AND INFRINGEMENT AUDIT SUMMARY:\n\n- Affected Sector: ${activeZone.name} (${activeZone.region})\n- Forest Canopy Impairment: -${activeZone.vegetationLoss}% local coverage loss over an active perimeter of ${activeZone.sizeHectares} hectares.\n- Core Violations: ${activeZone.findings}\n- Estimated Ecological Cost: High-level damage to endemic wildlife nesting zones, local topsoil fragmentation, and downstream riparian siltation, threatening village drinking supplies. Action has been assigned to coordinate reforestation offsets.`;
    }

    // Baseline response if other prompt
    return `Environmental Copilot registry log:\n\nThe current selected ecological target is [${activeZone.name}] located at ${activeZone.region}.\n\nPlease try asking one of the statutory query pathways:\n- "Why is this location high risk?"\n- "What action should authorities take?"\n- "Summarize the environmental impact."`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const rawText = textToSend || inputText;
    if (!rawText.trim()) return;

    if (!textToSend) setInputText('');

    const newMsg: Message = {
      sender: 'user',
      text: rawText,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);

    // Simulate thinking stream
    setTimeout(() => {
      setIsTyping(false);
      const replyText = generateResponse(rawText);
      const replyMsg: Message = {
        sender: 'agent',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono no-print">
      
      {/* 1. CLOSED FLOATING CHAT BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 border border-slate-750 hover:bg-teal-600 hover:border-teal-500 text-white rounded-full p-4 shadow-2xl transition-all duration-300 flex items-center gap-2 group ring-4 ring-teal-500/10 cursor-pointer"
        >
          <div className="relative">
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-teal-400 rounded-full animate-ping" />
            <Bot className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-xs font-bold whitespace-nowrap uppercase tracking-wider pr-1">
            COPILOT CHAT
          </span>
        </button>
      )}

      {/* 2. CHAT DIALOG CONTAINER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="w-80 sm:w-96 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative"
          >
            {/* Header section with active Indian Hotspot details */}
            <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between text-left select-none">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                  <Terminal className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                    <span>MoEFCC Assistant Copilot</span>
                    <span className="bg-teal-500/15 text-teal-400 font-mono text-[8px] py-0.5 px-1 rounded font-semibold border border-teal-500/25">IND v3.4</span>
                  </div>
                  <span className="text-[9px] text-slate-400 uppercase font-mono block tracking-normal max-w-[210px] truncate">
                    ZONE: {activeZone.name}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated message thread list */}
            <div 
              ref={scrollRef}
              className="flex-1 min-h-[300px] max-h-[360px] overflow-y-auto p-4 space-y-4 text-left bg-gradient-to-b from-slate-950 to-slate-900/60 scrollbar-thin scrollbar-thumb-slate-800"
            >
              {messages.map((m, idx) => {
                const isAgent = m.sender === 'agent';
                return (
                  <div key={idx} className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}>
                    <div className="flex items-center gap-1.5 mb-1 text-[8px] font-mono font-bold text-slate-550 uppercase">
                      <span>{isAgent ? 'COMPLIANCE COPROCESSOR' : 'REPRESENTATIVE CONTROLLER'}</span>
                      <span>&bull;</span>
                      <span>{m.timestamp}</span>
                    </div>

                    <div className={`p-3 rounded-xl text-xs max-w-[92%] leading-relaxed whitespace-pre-line ${
                      isAgent 
                        ? 'bg-slate-900 text-slate-200 border border-slate-800 font-sans font-light' 
                        : 'bg-teal-950 text-slate-100 font-mono border border-teal-850'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex flex-col items-start bg-transparent">
                  <span className="text-[8px] font-mono font-semibold text-slate-550 mb-0.5 animate-pulse">COMPASS ANALYZING SENSORS...</span>
                  <div className="flex gap-1 items-center bg-slate-900 border border-slate-800 p-2.5 px-4 rounded-xl">
                    <span className="w-1.5 h-1.5 bg-teal-405 rounded-full animate-bounce bg-teal-400" />
                    <span className="w-1.5 h-1.5 bg-teal-405 rounded-full animate-bounce delay-150 bg-teal-400" />
                    <span className="w-1.5 h-1.5 bg-teal-405 rounded-full animate-bounce delay-300 bg-teal-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Statutory Environmental Preset Questions */}
            <div className="px-3 pb-2 pt-1 border-t border-slate-900 bg-slate-950/80 flex flex-col gap-1 text-left select-none text-[10px]">
              <span className="text-[8px] text-slate-500 font-bold block mb-1 font-mono">FREQUENT REGULATORY QUERIES:</span>
              
              <button 
                onClick={() => handleSendMessage('Why is this location high risk?')}
                className="bg-slate-900 hover:bg-teal-950/40 hover:text-teal-300 text-slate-350 py-1 px-3.5 rounded-lg border border-slate-800 hover:border-teal-900 text-left transition-colors cursor-pointer truncate"
              >
                &bull; Why is this location high risk?
              </button>
              
              <button 
                onClick={() => handleSendMessage('What action should authorities take?')}
                className="bg-slate-900 hover:bg-teal-950/40 hover:text-teal-300 text-slate-350 py-1 px-3.5 rounded-lg border border-slate-800 hover:border-teal-900 text-left transition-colors cursor-pointer truncate"
              >
                &bull; What action should authorities take?
              </button>

              <button 
                onClick={() => handleSendMessage('Summarize the environmental impact.')}
                className="bg-slate-900 hover:bg-teal-950/40 hover:text-teal-300 text-slate-350 py-1 px-3.5 rounded-lg border border-slate-800 hover:border-teal-900 text-left transition-colors cursor-pointer truncate"
              >
                &bull; Summarize the environmental impact.
              </button>
            </div>

            {/* Custom Manual Input box */}
            <div className="p-3 border-t border-slate-900 bg-slate-900/40 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Ask Environmental AI Copilot..."
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 text-xs py-2 px-3 focus:outline-none focus:ring-1 focus:ring-teal-500 rounded-xl"
              />
              <button 
                onClick={() => handleSendMessage()}
                className="p-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-colors shadow-lg cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
