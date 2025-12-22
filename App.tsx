
import React, { useState, useEffect } from 'react';
import { AppState, ControlButton, DashboardPage, ActionType } from './types';
import { COLORS, ICONS } from './constants';
import { executor } from './services/automationService';
import { generateMacroSteps } from './services/geminiService';

const INITIAL_PAGES: DashboardPage[] = [
  {
    id: 'p1',
    name: 'Genel',
    buttons: [
      { id: 'b1', label: 'Chrome', color: 'bg-blue-600', icon: 'CHROME', steps: [{ id: 's1', type: ActionType.OPEN_URL, value: 'https://google.com', description: 'Chrome aç' }] },
      { id: 'b2', label: 'Steam', color: 'bg-indigo-600', icon: 'STEAM', steps: [{ id: 's2', type: ActionType.LAUNCH_APP, value: 'steam', description: 'Steam başlat' }] }
    ]
  }
];

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('nexus_state');
    return saved ? JSON.parse(saved) : {
      currentPageId: 'p1',
      pages: INITIAL_PAGES,
      isEditMode: false,
      isExecuting: false,
      pcIpAddress: localStorage.getItem('pc_ip') || '',
      connectionStatus: 'disconnected'
    };
  });

  const [editingBtn, setEditingBtn] = useState<ControlButton | null>(null);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    localStorage.setItem('nexus_state', JSON.stringify(state));
    if (state.pcIpAddress) localStorage.setItem('pc_ip', state.pcIpAddress);
  }, [state]);

  const handleAction = async (btn: ControlButton) => {
    if (state.isEditMode) {
      setEditingBtn(btn);
      return;
    }
    setState(s => ({ ...s, isExecuting: true }));
    await executor.executeSequence(btn.steps, state.pcIpAddress);
    setState(s => ({ ...s, isExecuting: false }));
  };

  const handleAiGenerate = async () => {
    if (!prompt || !editingBtn) return;
    const steps = await generateMacroSteps(prompt);
    setEditingBtn({ ...editingBtn, steps });
    setPrompt('');
  };

  const saveButton = () => {
    if (!editingBtn) return;
    setState(s => ({
      ...s,
      pages: s.pages.map(p => ({
        ...p,
        buttons: p.buttons.map(b => b.id === editingBtn.id ? editingBtn : b)
      }))
    }));
    setEditingBtn(null);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#020617] text-slate-100 font-sans select-none p-safe">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-slate-800/50 backdrop-blur-xl sticky top-0 z-30">
        <div>
          <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">NEXUS REMOTE</h1>
          <input 
            className="bg-transparent text-[10px] font-mono text-slate-500 outline-none w-32"
            placeholder="IP Giriniz..."
            value={state.pcIpAddress}
            onChange={e => setState(s => ({ ...s, pcIpAddress: e.target.value }))}
          />
        </div>
        <button 
          onClick={() => setState(s => ({ ...s, isEditMode: !s.isEditMode }))}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${state.isEditMode ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-300'}`}
        >
          {state.isEditMode ? 'DÜZENLEME AÇIK' : 'DÜZENLE'}
        </button>
      </header>

      {/* Grid */}
      <main className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4 content-start pb-24">
        {state.pages.find(p => p.id === state.currentPageId)?.buttons.map(btn => (
          <button
            key={btn.id}
            onClick={() => handleAction(btn)}
            className={`${btn.color} aspect-square rounded-3xl p-6 flex flex-col items-center justify-center gap-3 shadow-2xl active:scale-95 transition-transform relative group overflow-hidden`}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity" />
            <span className="text-4xl">{ICONS[btn.icon] || ICONS.DEFAULT}</span>
            <span className="font-bold text-sm tracking-tight">{btn.label}</span>
            {state.isEditMode && <div className="absolute top-3 right-3 bg-white/20 p-1 rounded-full text-[8px]">⚙️</div>}
          </button>
        ))}
        
        {state.isEditMode && (
          <button 
            className="aspect-square border-2 border-dashed border-slate-700 rounded-3xl flex items-center justify-center text-slate-500 text-3xl"
            onClick={() => {
              const newBtn = { id: Date.now().toString(), label: 'Yeni', color: 'bg-slate-700', icon: 'DEFAULT', steps: [] };
              setState(s => ({
                ...s,
                pages: s.pages.map(p => p.id === s.currentPageId ? { ...p, buttons: [...p.buttons, newBtn] } : p)
              }));
            }}
          >
            +
          </button>
        )}
      </main>

      {/* Modal - Editor */}
      {editingBtn && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl">
            <h2 className="text-2xl font-black mb-6">Butonu Yapılandır</h2>
            
            <div className="space-y-4">
              <input 
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 ring-blue-500"
                placeholder="Buton Adı"
                value={editingBtn.label}
                onChange={e => setEditingBtn({...editingBtn, label: e.target.value})}
              />

              <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
                <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-2">AI Makro Oluşturucu</label>
                <div className="flex gap-2">
                  <input 
                    className="flex-1 bg-transparent border-b border-blue-500/30 outline-none text-sm py-1"
                    placeholder="Örn: Youtube'u aç ve LoFi müzik çal"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                  />
                  <button onClick={handleAiGenerate} className="bg-blue-500 p-2 rounded-xl text-xs font-bold">Üret</button>
                </div>
              </div>

              <div className="max-h-32 overflow-y-auto space-y-2">
                {editingBtn.steps.map(s => (
                  <div key={s.id} className="text-[10px] bg-slate-800/50 p-2 rounded-lg text-slate-400">
                    <span className="text-emerald-400 font-bold mr-2">{s.type}</span> {s.description}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={saveButton} className="flex-1 bg-emerald-600 font-bold py-4 rounded-2xl shadow-lg">Kaydet</button>
                <button onClick={() => setEditingBtn(null)} className="flex-1 bg-slate-800 font-bold py-4 rounded-2xl">İptal</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Execution Indicator */}
      {state.isExecuting && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          <span className="text-xs font-black uppercase tracking-widest">Komut Yürütülüyor</span>
        </div>
      )}
    </div>
  );
}
