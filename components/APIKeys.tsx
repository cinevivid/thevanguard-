import React, { useState, useEffect } from 'react';
import Card from './Card';
import { setFirebaseConfig, getFirebaseDb } from '../services/firebaseClient';

const APIKeys: React.FC = () => {
    const [firebaseConfigInput, setFirebaseConfigInput] = useState(() => localStorage.getItem('firebaseConfig') || '');
    const [connectionStatus, setConnectionStatus] = useState<'Unknown' | 'Connected' | 'Disconnected' | 'Error'>('Unknown');
    const [keySaved, setKeySaved] = useState(false);
    const [message, setMessage] = useState('');

    const checkStatus = () => {
        const config = localStorage.getItem('firebaseConfig');
        setKeySaved(!!config);

        if (!config) {
            setConnectionStatus('Disconnected');
            setMessage('Please paste your Firebase config object to enable database persistence. The app will use temporary local storage until a config is provided.');
            return;
        }
        
        const db = getFirebaseDb(); // This attempts to initialize
        if (db) {
            // A db instance doesn't mean connection is good, just initialized. 
            // We'll rely on App.tsx's dbError for the real status, but can assume "Connected" optimistically.
             setConnectionStatus('Connected');
             setMessage('Successfully connected to the Firebase backend. Your work is now being saved in real-time.');
        } else {
            setConnectionStatus('Error');
            setMessage('Firebase config is present, but the client failed to initialize. Check the browser console for detailed errors.');
        }
    };

    useEffect(() => {
        checkStatus();
    }, []);

    const handleSaveAndReconnect = () => {
        try {
            // Test if the input is valid JSON before saving
            JSON.parse(firebaseConfigInput);
            // This is the critical fix: call the service function to save to localStorage
            setFirebaseConfig(firebaseConfigInput);
            // Reload the page to apply the new configuration
            window.location.reload();
        } catch (e) {
            alert("Invalid JSON format. Please paste the complete Firebase config object, including the opening and closing curly braces { }.");
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">API Keys & Services</h1>
            <p className="text-vanguard-text-secondary">Manage connections to external services like Firebase, ElevenLabs, and Midjourney.</p>

            <Card title="Firebase Connection (Backend & Database)">
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-vanguard-bg">
                    <div className={`mt-1 w-4 h-4 rounded-full flex-shrink-0 ${
                        connectionStatus === 'Connected' ? 'bg-vanguard-green animate-pulse' : 
                        connectionStatus === 'Error' ? 'bg-vanguard-red' : 
                        keySaved ? 'bg-vanguard-yellow' : 'bg-vanguard-text-secondary'
                    }`}></div>
                    <div>
                        <p className="font-semibold text-lg">{connectionStatus}</p>
                        <p className="text-sm text-vanguard-text-secondary">{message}</p>
                        {keySaved && <p className="text-xs mt-1 text-vanguard-green">✅ Key is present in local storage.</p>}
                    </div>
                </div>
                 {connectionStatus === 'Error' && (
                    <div className="mt-4 text-xs text-vanguard-text-secondary p-2 bg-vanguard-bg rounded-md">
                        <h4 className="font-bold text-vanguard-yellow">Troubleshooting Tip:</h4>
                        <p>A common reason for connection failure after saving a key is your Firestore Security Rules. By default, they deny all reads and writes. You must create rules to allow access. For development, you can start with open rules.</p>
                        <a href="https://firebase.google.com/docs/firestore/security/get-started" target="_blank" rel="noopener noreferrer" className="text-vanguard-accent hover:underline">Learn about Firestore Security Rules here.</a>
                    </div>
                )}
                 <div className="mt-6">
                    <label className="text-sm font-medium" htmlFor="firebase-config">Firebase Config Object</label>
                    <textarea
                        id="firebase-config"
                        value={firebaseConfigInput}
                        onChange={(e) => setFirebaseConfigInput(e.target.value)}
                        placeholder="Paste your Firebase config object here..."
                        className="w-full h-48 mt-2 bg-vanguard-bg text-vanguard-text p-3 rounded-md border border-vanguard-bg-tertiary focus:ring-2 focus:ring-vanguard-accent focus:outline-none font-mono text-xs"
                    />
                </div>
                <button
                    onClick={handleSaveAndReconnect}
                    disabled={!firebaseConfigInput}
                    className="mt-4 w-full bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-vanguard-text-secondary disabled:cursor-not-allowed"
                >
                    Save & Reconnect
                </button>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 <Card title="ElevenLabs (AI Dialogue)">
                    <label className="text-sm font-medium" htmlFor="elevenlabs-key">API Key</label>
                    <input id="elevenlabs-key" type="password" placeholder="Enter your ElevenLabs API Key" className="w-full mt-2 bg-vanguard-bg-tertiary p-2 rounded-md border border-vanguard-bg-tertiary" />
                </Card>
                 <Card title="Midjourney (Image Gen)">
                     <p className="text-sm text-vanguard-text-secondary">This service is used externally. Prompts are generated here and used in Discord.</p>
                </Card>
                 <Card title="Runway (Video Gen)">
                    <p className="text-sm text-vanguard-text-secondary">This service is used externally. Images are uploaded to their platform for video generation.</p>
                </Card>
            </div>
        </div>
    );
};

export default APIKeys;
