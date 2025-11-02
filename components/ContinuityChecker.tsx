
import React, { useState, useCallback } from 'react';
import Card from './Card';
import { checkContinuityWithAI } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';

interface ContinuityIssue {
    type: string;
    severity: string;
    description: string;
}

interface ContinuityResult {
    continuity_maintained: boolean;
    confidence: number;
    issues: ContinuityIssue[];
}

const ImageUploader: React.FC<{ title: string; onFileSelect: (file: File | null) => void; imagePreviewUrl: string | null; }> = ({ title, onFileSelect, imagePreviewUrl }) => {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-vanguard-text-secondary mb-2">{title}</label>
            <div className="aspect-video w-full border-2 border-dashed border-vanguard-bg-tertiary rounded-lg flex items-center justify-center relative">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onFileSelect(e.target.files ? e.target.files[0] : null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {imagePreviewUrl ? (
                    <img src={imagePreviewUrl} alt="preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                    <div className="text-center text-vanguard-text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
                        <p className="mt-2 text-sm">Click to upload</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ContinuityChecker: React.FC = () => {
    const [shotA, setShotA] = useState<File | null>(null);
    const [shotB, setShotB] = useState<File | null>(null);
    const [shotAPreview, setShotAPreview] = useState<string | null>(null);
    const [shotBPreview, setShotBPreview] = useState<string | null>(null);
    const [result, setResult] = useState<ContinuityResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (file: File | null, setter: React.Dispatch<React.SetStateAction<File | null>>, previewSetter: React.Dispatch<React.SetStateAction<string | null>>) => {
        setter(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                previewSetter(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            previewSetter(null);
        }
    };

    const handleCheckContinuity = useCallback(async () => {
        if (!shotA || !shotB) {
            setError('Please upload both shots to compare.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const [base64A, base64B] = await Promise.all([
                fileToBase64(shotA),
                fileToBase64(shotB),
            ]);
            const responseText = await checkContinuityWithAI(base64A, shotA.type, base64B, shotB.type);
            const parsedResult = JSON.parse(responseText.replace(/```json\n?|\n?```/g, ''));
            setResult(parsedResult);
        } catch (err) {
            setError('Failed to analyze continuity. The AI might have returned an invalid response.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [shotA, shotB]);

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'glaring': return 'bg-vanguard-red';
            case 'noticeable': return 'bg-vanguard-yellow text-vanguard-bg';
            case 'minor': return 'bg-vanguard-text-secondary';
            default: return 'bg-gray-500';
        }
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-vanguard-text">AI Continuity Checker</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <Card title="Upload Shots">
                    <div className="space-y-6">
                        <ImageUploader title="Previous Shot (A)" onFileSelect={(f) => handleFileSelect(f, setShotA, setShotAPreview)} imagePreviewUrl={shotAPreview} />
                        <ImageUploader title="Current Shot (B)" onFileSelect={(f) => handleFileSelect(f, setShotB, setShotBPreview)} imagePreviewUrl={shotBPreview} />
                    </div>
                    <button
                        onClick={handleCheckContinuity}
                        disabled={isLoading || !shotA || !shotB}
                        className="mt-6 w-full bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-vanguard-text-secondary disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing...
                            </>
                        ) : 'Check Continuity'}
                    </button>
                    {error && <p className="text-vanguard-red mt-4 text-center">{error}</p>}
                </Card>
                <Card title="Continuity Report">
                    {!result && !isLoading && <p className="text-center text-vanguard-text-secondary h-full flex items-center justify-center">Upload two shots and click "Check Continuity" to see the report.</p>}
                     {isLoading && <p className="text-center text-vanguard-text-secondary h-full flex items-center justify-center">AI is analyzing frames...</p>}
                    {result && (
                        <div>
                            <div className={`p-4 rounded-lg mb-4 ${result.continuity_maintained ? 'bg-vanguard-green/20 border border-vanguard-green' : 'bg-vanguard-red/20 border border-vanguard-red'}`}>
                                <h3 className={`text-xl font-bold ${result.continuity_maintained ? 'text-vanguard-green' : 'text-vanguard-red'}`}>
                                    {result.continuity_maintained ? '✅ Continuity Maintained' : '❌ Continuity Broken'}
                                </h3>
                                <p className="text-sm">Confidence: { (result.confidence * 100).toFixed(1) }%</p>
                            </div>
                            {result.issues.length > 0 ? (
                                <ul className="space-y-3">
                                    {result.issues.map((issue, index) => (
                                        <li key={index} className="p-3 bg-vanguard-bg-tertiary rounded-md">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold capitalize">{issue.type}</p>
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${getSeverityColor(issue.severity)}`}>
                                                    {issue.severity}
                                                </span>
                                            </div>
                                            <p className="text-sm text-vanguard-text-secondary mt-1">{issue.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-vanguard-green">No continuity issues were detected.</p>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ContinuityChecker;
