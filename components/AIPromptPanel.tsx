import React from 'react';

interface AIPromptPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  canGenerate: boolean;
  responseText: string | null;
  disabled: boolean;
}

const AIPromptPanel: React.FC<AIPromptPanelProps> = ({
  prompt,
  setPrompt,
  onGenerate,
  isLoading,
  canGenerate,
  responseText,
  disabled
}) => {
  return (
    <div className={`bg-gray-800/50 rounded-2xl border border-gray-700 shadow-lg p-4 h-full flex flex-col gap-4 transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}>
        <h2 className="text-xl font-bold text-gray-300">AI Editor</h2>
        <div className="flex flex-col gap-4 flex-grow">
            <div className="flex flex-col gap-2 flex-grow">
                 <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-400">
                    Editing Instruction
                </label>
                <textarea
                    id="prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., add a pirate hat on the cat"
                    className="flex-grow bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none disabled:cursor-not-allowed"
                    rows={5}
                    disabled={disabled || isLoading}
                />
            </div>
            <button
                onClick={() => onGenerate()}
                disabled={!canGenerate || disabled}
                className={`w-full px-6 py-3 font-semibold rounded-lg transition duration-200 ease-in-out text-white
                    ${canGenerate ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 cursor-not-allowed'}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500`}
            >
                {isLoading ? 'Editing...' : 'Generate with AI'}
            </button>
        </div>
        {responseText && (
            <div className="bg-gray-900/70 p-3 rounded-lg border border-gray-700">
                <p className="text-sm font-medium text-gray-400 mb-1">AI Response:</p>
                <p className="text-sm text-gray-300 italic">{responseText}</p>
            </div>
        )}
    </div>
  );
};

export default AIPromptPanel;
