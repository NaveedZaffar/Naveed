
import React from 'react';
import { ImageIcon, Wand2, Download, AlertTriangle, Loader2 } from 'lucide-react';
import { generateAuditVisual } from '../services/geminiService';

const AuditVisualizer: React.FC = () => {
  const [prompt, setPrompt] = React.useState('A hyper-modern manufacturing plant with smart energy grids and transparent glass facades showing efficiency metrics.');
  const [size, setSize] = React.useState<"1K" | "2K" | "4K">("1K");
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        const hasKey = await aistudio.hasSelectedApiKey();
        if (!hasKey) {
          // Open dialog to select key. Instructions state we proceed after trigger.
          await aistudio.openSelectKey();
        }
      }
      
      const url = await generateAuditVisual(prompt, size);
      if (url) {
        setImageUrl(url);
      } else {
        setError("Generation failed. Try a different prompt.");
      }
    } catch (err: any) {
      console.error(err);
      // Handling 403/404 errors as per guidelines
      if (err.message?.includes("PERMISSION_DENIED") || err.message?.includes("Requested entity was not found")) {
        setError("Access Denied. Please ensure you have selected a valid paid project key.");
        const aistudio = (window as any).aistudio;
        if (aistudio) {
          await aistudio.openSelectKey();
        }
      } else {
        setError("Service unavailable. Verify your API key and network connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col">
      <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-200" />
            AI Report Visuals
          </h2>
          <p className="text-emerald-100 text-[10px] mt-1 uppercase font-semibold">Gemini 3 Pro Image (1K/2K/4K)</p>
        </div>
      </div>

      <div className="p-6 flex-grow space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visual Concept</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none h-20 transition-all"
            placeholder="Describe the desired visual for your report..."
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-grow">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Resolution</label>
            <select 
              value={size}
              onChange={(e) => setSize(e.target.value as any)}
              className="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="1K">Standard (1K)</option>
              <option value="2K">High Def (2K)</option>
              <option value="4K">Ultra HD (4K)</option>
            </select>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="mt-5 flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            Generate
          </button>
        </div>

        <div className="relative aspect-video bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-200 group">
          {imageUrl ? (
            <>
              <img src={imageUrl} alt="AI Visual" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                 <button 
                   onClick={() => {
                     const link = document.createElement('a');
                     link.href = imageUrl;
                     link.download = 'audit-visual.png';
                     link.click();
                   }}
                   className="p-3 bg-white rounded-full shadow-xl hover:scale-110 transition-transform"
                 >
                   <Download className="w-5 h-5 text-emerald-600" />
                 </button>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Asset preview area</p>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-[11px] font-medium animate-in fade-in slide-in-from-top-1">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
      </div>
      
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-[9px] text-slate-400 text-center italic">
          Requires paid API key. Visit <a href="https://ai.google.dev/gemini-api/docs/billing" className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">billing documentation</a> for setup.
        </p>
      </div>
    </div>
  );
};

export default AuditVisualizer;
