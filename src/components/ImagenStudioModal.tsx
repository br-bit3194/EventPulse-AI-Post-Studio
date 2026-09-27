import React, { useState } from 'react';
import { ConferencePhoto } from '../types';

interface ImagenStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  defaultHighlights: string;
  onImageGenerated: (photo: ConferencePhoto) => void;
}

export const ImagenStudioModal: React.FC<ImagenStudioModalProps> = ({
  isOpen,
  onClose,
  eventName,
  defaultHighlights,
  onImageGenerated,
}) => {
  const [stylePreset, setStylePreset] = useState<string>('Keynote Stage');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '1:1'>('16:9');
  const [prompt, setPrompt] = useState<string>(
    `High-tech keynote stage at ${eventName} with holographic displays showcasing distributed agentic workflows, packed auditorium of founders and engineers, cinematic 4K lighting`
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVisual, setGeneratedVisual] = useState<ConferencePhoto | null>(null);

  if (!isOpen) return null;

  const presets = [
    {
      id: 'Keynote Stage',
      name: 'Main Keynote Stage',
      icon: 'stadium',
      desc: 'Massive auditorium, stage presenter, giant neon screen with summit branding',
    },
    {
      id: 'AI Architecture',
      name: 'AI Neural Blueprint',
      icon: 'hub',
      desc: 'Gleaming 3D data pipeline, agentic swarm nodes, futuristic holographic layout',
    },
    {
      id: 'Executive Mixer',
      name: 'VIP Networking Lounge',
      icon: 'wine_bar',
      desc: 'Modern glass conference lounge overlooking San Francisco skyline',
    },
    {
      id: 'Holographic Badge',
      name: 'Holographic Pass & Badge',
      icon: 'badge',
      desc: 'Floating summit pass with laser engraving and high-energy luminescent graphics',
    },
  ];

  const handlePresetSelect = (presetName: string) => {
    setStylePreset(presetName);
    if (presetName === 'Keynote Stage') {
      setPrompt(
        `High-tech keynote auditorium stage at ${eventName} with holographic displays showcasing distributed AI workflows, audience clapping, cinematic 4K lighting`
      );
    } else if (presetName === 'AI Architecture') {
      setPrompt(
        `Abstract futuristic 3D visualization of enterprise agentic pipeline, glowing neural connections, cybernetic blue and emerald lighting, ${eventName}`
      );
    } else if (presetName === 'Executive Mixer') {
      setPrompt(
        `Executives and founders networking in an elegant summit pavilion lounge, modern architectural glass with twilight city lights, ${eventName}`
      );
    } else if (presetName === 'Holographic Badge') {
      setPrompt(
        `Close up macro shot of an official futuristic VIP summit lanyard badge for ${eventName}, glowing holographic microchips, sharp focus`
      );
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          stylePreset,
          aspectRatio,
          eventName,
        }),
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        const newPhoto: ConferencePhoto = {
          id: `imagen-${Date.now()}`,
          url: data.imageUrl,
          label: `${stylePreset} (Imagen)`,
          caption: `${eventName} • Generated with Imagen 3`,
          isAiGenerated: true,
          modelUsed: data.model || 'imagen-3.0-generate-002',
        };
        setGeneratedVisual(newPhoto);
      }
    } catch (err) {
      console.error('Error generating image with Imagen:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAttachAndClose = () => {
    if (generatedVisual) {
      onImageGenerated(generatedVisual);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#004e98] to-[#0466c2] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[24px]">palette</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline text-lg sm:text-xl font-bold text-[#1c1b1b]">
                  Imagen 3 Visual Studio
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#d5e3ff] text-[#001b3c] text-[10px] font-bold">
                  Google Imagen AI
                </span>
              </div>
              <p className="text-xs text-[#414752]">Generate branded conference visual assets for your LinkedIn post</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#414752] hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Style Presets */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider">
            Choose Visual Style Preset
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presets.map((p) => {
              const isSelected = stylePreset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePresetSelect(p.id)}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#d5e3ff]/40 border-[#004e98] ring-1 ring-[#004e98]'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  type="button"
                >
                  <span className={`material-symbols-outlined text-[20px] ${isSelected ? 'text-[#004e98]' : 'text-[#414752]'}`}>
                    {p.icon}
                  </span>
                  <span className="text-xs font-bold text-[#1c1b1b] leading-tight">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex items-center justify-between bg-[#f6f3f2] p-3 rounded-xl border border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#1c1b1b]">Aspect Ratio</span>
            <span className="text-[11px] text-[#414752]">Optimized for desktop and mobile LinkedIn feeds</span>
          </div>
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-gray-200 shadow-2xs">
            <button
              onClick={() => setAspectRatio('16:9')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                aspectRatio === '16:9' ? 'bg-[#004e98] text-white shadow-xs' : 'text-[#414752] hover:text-[#1c1b1b]'
              }`}
              type="button"
            >
              16:9 (Banner)
            </button>
            <button
              onClick={() => setAspectRatio('1:1')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                aspectRatio === '1:1' ? 'bg-[#004e98] text-white shadow-xs' : 'text-[#414752] hover:text-[#1c1b1b]'
              }`}
              type="button"
            >
              1:1 (Square)
            </button>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider">
              Visual Generation Prompt
            </label>
            <span className="text-[11px] text-[#414752]">Auto-tuned with {eventName} branding</span>
          </div>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-[#f6f3f2] focus:bg-white p-3 rounded-xl text-xs text-[#1c1b1b] border border-gray-200 focus:border-[#0466c2] outline-none leading-relaxed transition-all"
            placeholder="Describe the visual scene..."
          />
        </div>

        {/* Preview of Generated Visual */}
        {generatedVisual && (
          <div className="flex flex-col gap-2 p-3 bg-[#f6f3f2] rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1c1b1b] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#006c49]">check_circle</span>
                Generated Visual Ready
              </span>
              <span className="text-[10px] text-[#004e98] font-bold">16:9 High-Res Output</span>
            </div>
            <div className="w-full h-52 rounded-lg overflow-hidden relative shadow-sm border border-gray-200">
              <img
                src={generatedVisual.url}
                alt="Generated visual"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/80 text-white text-[11px] backdrop-blur-xs flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[13px] text-[#6cf8bb]">auto_awesome</span>
                <span>{generatedVisual.caption}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#414752] hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2.5 rounded-xl bg-[#004e98] hover:bg-[#004e98]/90 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
              type="button"
            >
              <span className={`material-symbols-outlined text-[16px] ${isGenerating ? 'animate-spin' : ''}`}>
                {isGenerating ? 'sync' : 'auto_awesome'}
              </span>
              <span>{isGenerating ? 'Rendering with Imagen...' : 'Generate Visual with Imagen'}</span>
            </button>

            {generatedVisual && (
              <button
                onClick={handleAttachAndClose}
                className="px-4 py-2.5 rounded-xl bg-[#006c49] hover:bg-[#005236] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                <span>Attach to LinkedIn Post</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
