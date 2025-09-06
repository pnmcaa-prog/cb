import React, { useState } from 'react';
import type { Adjustments } from '../types';
import AdjustmentSlider from './AdjustmentSlider';

interface EditorPanelProps {
  adjustments: Adjustments;
  onAdjustmentChange: (adjustments: Adjustments) => void;
  onPresetFilterApply: (adjustments: Partial<Adjustments>) => void;
  onReset: () => void;
  onSave: (format: 'png' | 'jpeg' | 'webp', quality?: number) => void;
  onQuickEdit: (prompt: string) => void;
  disabled: boolean;
}

const presetFilters = [
    { name: 'Vintage', adjustments: { saturate: 140, contrast: 110, brightness: 110, sepia: 30 }},
    { name: 'Grayscale', adjustments: { grayscale: 100, sepia: 0, saturate: 100 }},
    { name: 'Sepia', adjustments: { sepia: 100, grayscale: 0, saturate: 120, contrast: 90 }},
    { name: 'High-Con', adjustments: { contrast: 150, saturate: 120 }},
];

const quickEdits = [
    { name: 'Remove Blemishes', prompt: 'Subtly remove any blemishes or spots from the skin, keeping a natural look.'},
    { name: 'Smooth Skin', prompt: 'Gently smooth the skin texture, reducing wrinkles and pores for a soft-focus effect.'},
]

const EditorPanel: React.FC<EditorPanelProps> = ({ adjustments, onAdjustmentChange, onPresetFilterApply, onReset, onSave, disabled, onQuickEdit }) => {
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState(92);

  const handleAdjustment = (key: keyof Adjustments, value: number) => {
    onAdjustmentChange({ ...adjustments, [key]: value });
  };

  return (
    <div className={`bg-gray-800/50 rounded-2xl border border-gray-700 shadow-lg p-4 h-full flex flex-col gap-6 transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}>
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-300">Editor Tools</h2>
             <button onClick={onReset} disabled={disabled} className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 disabled:text-gray-500 disabled:cursor-not-allowed transition">Reset All</button>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-2 space-y-6 -mr-2">
            {/* Adjustments */}
            <CollapsibleSection title="Adjustments">
                <AdjustmentSlider label="Brightness" value={adjustments.brightness} onChange={(v) => handleAdjustment('brightness', v)} min={0} max={200} disabled={disabled}/>
                <AdjustmentSlider label="Contrast" value={adjustments.contrast} onChange={(v) => handleAdjustment('contrast', v)} min={0} max={200} disabled={disabled}/>
                <AdjustmentSlider label="Saturation" value={adjustments.saturate} onChange={(v) => handleAdjustment('saturate', v)} min={0} max={200} disabled={disabled}/>
            </CollapsibleSection>

            {/* AI Touch-up */}
            <CollapsibleSection title="AI Touch-up">
                <div className="grid grid-cols-2 gap-2">
                    {quickEdits.map(edit => (
                         <button key={edit.name} onClick={() => onQuickEdit(edit.prompt)} disabled={disabled} className="text-sm bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-md p-2 transition">{edit.name}</button>
                    ))}
                </div>
            </CollapsibleSection>
            
            {/* Filters */}
            <CollapsibleSection title="Filters">
                <div className="grid grid-cols-2 gap-2">
                    {presetFilters.map(filter => (
                         <button key={filter.name} onClick={() => onPresetFilterApply(filter.adjustments)} disabled={disabled} className="text-sm bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-md p-2 transition">{filter.name}</button>
                    ))}
                </div>
            </CollapsibleSection>

             {/* Export */}
            <CollapsibleSection title="Export">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="format-select" className="block text-sm font-medium text-gray-400 mb-1">Format</label>
                        <select id="format-select" value={format} onChange={(e) => setFormat(e.target.value as any)} disabled={disabled} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="png">PNG</option>
                            <option value="jpeg">JPEG</option>
                            <option value="webp">WEBP</option>
                        </select>
                    </div>
                    {(format === 'jpeg' || format === 'webp') && (
                        <div>
                             <label htmlFor="quality-slider" className="block text-sm font-medium text-gray-400 mb-1">Quality ({quality}%)</label>
                             <input type="range" id="quality-slider" min="1" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} disabled={disabled} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"/>
                        </div>
                    )}
                    <button onClick={() => onSave(format, quality)} disabled={disabled} className="w-full font-semibold rounded-lg transition duration-200 ease-in-out text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-2.5">
                        Save Image
                    </button>
                </div>
            </CollapsibleSection>
        </div>
    </div>
  );
};

const CollapsibleSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => {
    // For simplicity, sections are always open. A real implementation might use state to toggle.
    return (
        <div className="border-t border-gray-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</h3>
            <div className="space-y-4">{children}</div>
        </div>
    )
}

export default EditorPanel;
