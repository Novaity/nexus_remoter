import React, { useState, useEffect } from 'react';
import { AppState, ControlButton, ActionType, DashboardPage } from './types';
import { COLORS, ICONS } from './constants';
import { executor } from './services/automationService';
import { generateMacroSteps } from './services/geminiService';

const DEFAULT_PAGES: DashboardPage[] = [
  {
    id: 'main',
    name: 'PC Controller',
    buttons: [
      {
        id: '1',
        label: 'YouTube Aç',
        color: 'bg-red-600',
        icon: 'CHROME',
        steps: [{ id: 's1', type: ActionType.OPEN_URL, value: 'https://youtube.com', description: 'YouTube\'u aç' }]
      },
      {
        id: '2',
        label: 'Steam & CS2',
        color: 'bg-blue-600',
        icon: 'STEAM',
        steps: [{ id: 's2', type: ActionType.COMMAND, value: 'steam://rungameid/730', description: 'CS2 Başlat' }]
      },
      {
        id: '3',
        label: 'Google Chrome',
        color: 'bg-slate-700',
        icon: 'CHROME',
        steps: [{ id: 's3', type: ActionType.OPEN_URL, value: 'https://google.com', description: 'Google\'ı aç' }]
      }
    ]
  }
];

const ButtonCard: React.FC<{
  button: ControlButton;
  isEditMode: boolean;
  onPress: (btn: ControlButton) => void;
  onEdit: (btn: ControlButton) => void;
}> = ({ button, isEditMode, onPress, onEdit }) => {
  const IconComponent = (ICONS as any)[button.icon] || ICONS.DEFAULT;

  return (
    <button
      onClick={() => isEditMode ? onEdit(button) : onPress(button)}
      className={`relative aspect-square rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group ${button.color} shadow-lg shadow-black/30 hover:brightness-110`}
    >
      <IconComponent className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
      <span className="text-sm font-semibold text-white text-center leading-tight">
        {button.label}
      </span>
      {isEditMode && (
        <div className="absolute -top-1 -right-1 bg-white text-black p-1 rounded-full shadow-md">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      )}
    </button>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const savedIp = typeof localStorage !== 'undefined' ? localStorage.getItem('nexus_pc_ip') || '' : '';
    return {
      currentPageId: 'main',
      isEditMode: false,
      isExecuting: false,
      pcIpAddress: savedIp,
      connectionStatus: 'disconnected',
      pages: DEFAULT_PAGES
    };
  });

  const [editingButton, setEditingButton] = useState<ControlButton | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [tempIp, setTempIp] = useState(state.pcIpAddress);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (state.pcIpAddress) {
      checkConnection(state.pcIpAddress);
    }
  }, []);

  const checkConnection = async (ip: string) => {
    setState(prev => ({ ...prev, connectionStatus: 'connecting' }));
    try {
      const ok = await executor.testConnection(ip);
      setState(prev => ({ ...prev, connectionStatus: ok ? 'connected' : 'disconnected' }));
    } catch (e) {
      setState(prev => ({ ...prev, connectionStatus: 'disconnected' }));
    }
  };

  const handleSaveIp = () => {
    localStorage.setItem('nexus_pc_ip', tempIp);
    setState(prev => ({ ...prev, pcIpAddress: tempIp }));
    checkConnection(tempIp);
    setShowSettings(false);
  };

  const handleButtonPress = async (btn: ControlButton) => {
    if (state.isExecuting) return;
    setState(prev => ({ ...prev, isExecuting: true, lastExecutedAction: btn.label }));
    await executor.executeSequence(btn.steps, state.pcIpAddress);
    setTimeout(() => { setState(prev => ({ ...prev, isExecuting: false })); }, 500);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const newSteps = await generateMacroSteps(aiPrompt);
      if (editingButton) {
        setEditingButton({ ...editingButton, steps: newSteps });
      }
    } catch (err) {
      console.error(err);
      alert("AI Hatası: API Anahtarınızın GitHub Secrets kısmına doğru eklendiğinden emin olun.");
    } finally {
      setIsGenerating(false);
      setAiPrompt('');
    }
  };

  const currentPage = state.pages.find(p => p.id === state.currentPageId) || state.pages[0];

  if (!currentPage) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Yükleniyor...</div>;

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col bg-slate-900 border-x border-slate-800 shadow-2xl relative overflow-hidden text-white">
      {/* Header */}
      <header className="p-6 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSettings(true)} className="relative group">
            <div className={`absolute -inset-1 blur-sm opacity-50 rounded-full ${state.connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div className={`relative w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 border ${state.connectionStatus === 'connected' ? 'border-green-500/50' : 'border-red-500/50'}`}>
              <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
          </button>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">Nexus Remote</h1>
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${state.connectionStatus === 'connected' ? 'bg-green-500' : state.connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{state.pcIpAddress || 'BAĞLANTI YOK'}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setState(prev => ({ ...prev, isEditMode: !prev.isEditMode }))}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${state.isEditMode ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}
        >
          {state.isEditMode ? 'BİTTİ' : 'DÜZENLE'}
        </button>
      </header>

      {/* Main Grid */}
      <main className="flex-1 p-6 z-10 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          {currentPage.buttons.map(btn => (
            <ButtonCard 
              key={btn.id} 
              button={btn} 
              isEditMode={state.isEditMode}
              onPress={handleButtonPress}
              onEdit={(b) => setEditingButton(b)}
            />
          ))}
        </div>

        {state.isExecuting && (
          <div className="mt-8 p-4 bg-blue-600/10 border border-blue-500/30 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
            <span className="text-sm font-medium text-blue-300">Komut Gönderiliyor: {state.lastExecutedAction}</span>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="bg-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">PC Bağlantısı</h2>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 p-2"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" /></svg></button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">1. PC IP ADRESİNİZ</label>
                <input 
                  type="text" 
                  placeholder="Örn: 192.168.1.5"
                  value={tempIp}
                  onChange={e => setTempIp(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button onClick={handleSaveIp} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-transform active:scale-95">Kaydet ve Bağlan</button>
            </div>
          </div>
        </div>
      )}

      {/* Editing Modal */}
      {editingButton && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 w-full max-w-md h-[85vh] sm:h-auto rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border-t border-slate-700 sm:border flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Butonu Düzenle</h2>
              <button onClick={() => setEditingButton(null)} className="text-slate-400 p-2"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" /></svg></button>
            </div>
            <div className="space-y-4 overflow-y-auto flex-1 pr-1">
              <input 
                type="text" 
                placeholder="Buton İsmi"
                value={editingButton.label}
                onChange={e => setEditingButton({...editingButton, label: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none"
              />
              <div className="pt-4 border-t border-slate-700">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Yapay Zeka (Gemini)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="E.g. Chrome'u aç ve youtube'a gir"
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none"
                  />
                  <button onClick={handleAiGenerate} disabled={isGenerating} className="bg-blue-600 p-3 rounded-xl disabled:opacity-50 min-w-[50px] flex items-center justify-center">
                    {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                  </button>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                {editingButton.steps.map((step, idx) => (
                  <div key={step.id} className="bg-slate-900/50 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-500">{idx + 1}</span>
                      <p className="text-sm text-slate-200">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => {
                setState(prev => ({
                  ...prev,
                  pages: prev.pages.map(p => ({
                    ...p,
                    buttons: p.buttons.map(b => b.id === editingButton.id ? editingButton : b)
                  }))
                }));
                setEditingButton(null);
              }}
              className="mt-6 w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg"
            >
              Ayarları Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;