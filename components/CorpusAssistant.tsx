import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { corpus } from '../data/allDocuments';
import { chatWithCorpusStream } from '../services/geminiService';
import Card from './Card';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const elements = content.split('\n').map((line, i) => {
    if (line.startsWith('### ')) {
      return <h3 key={i} className="text-lg font-semibold mt-4 mb-2">{line.substring(4)}</h3>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={i} className="text-xl font-bold mt-5 mb-3">{line.substring(3)}</h2>;
    }
    if (line.startsWith('# ')) {
      return <h1 key={i} className="text-2xl font-bold mt-6 mb-4">{line.substring(2)}</h1>;
    }
    if (line.startsWith('* ')) {
      return <li key={i} className="ml-4 list-disc">{line.substring(2)}</li>;
    }
    const parts = line.split(/(\*\*.*?\*\*)/g).filter(part => part);
    const renderedParts = parts.map((part, pIndex) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pIndex}>{part.substring(2, part.length - 2)}</strong>;
      }
      return part;
    });
    return <p key={i}>{renderedParts}</p>;
  });

  return <div className="prose prose-invert prose-sm max-w-none text-vanguard-text whitespace-pre-wrap">{elements}</div>;
};


const CorpusAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I am The Vanguard's production assistant. How can I help you with your project documents today?" }
  ]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (question: string) => {
    if (!question.trim()) return;

    setIsLoading(true);
    const newMessages: Message[] = [...messages, { role: 'user', content: question }];
    setMessages(newMessages);
    setUserInput('');

    try {
      const stream = chatWithCorpusStream(question, corpus);
      let fullResponse = '';
      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = fullResponse;
          return updated;
        });
      }
    } catch (error) {
      console.error("Failed to get response from AI:", error);
      setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(userInput);
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-vanguard-text">Corpus Assistant</h1>
        <p className="text-vanguard-text-secondary mt-2">Ask questions about your project documents. The AI will provide answers based on the entire corpus of uploaded screenplays, bibles, and notes.</p>
      </div>
      <div className="flex-1 flex flex-col bg-vanguard-bg-secondary rounded-lg border border-vanguard-bg-tertiary shadow-lg overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-vanguard-accent text-white' : 'bg-vanguard-bg-tertiary'}`}>
                   {msg.role === 'model' ? <MarkdownRenderer content={msg.content} /> : <p>{msg.content}</p>}
                </div>
              </div>
            ))}
             {isLoading && messages[messages.length-1]?.role === 'user' && (
                 <div className="flex justify-start">
                     <div className="max-w-xl p-3 rounded-lg bg-vanguard-bg-tertiary">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-vanguard-accent rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-vanguard-accent rounded-full animate-pulse [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-vanguard-accent rounded-full animate-pulse [animation-delay:0.4s]"></div>
                        </div>
                     </div>
                 </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
        <div className="p-4 border-t border-vanguard-bg-tertiary">
          <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask about the script, characters, or production plan..."
              className="flex-1 bg-vanguard-bg text-vanguard-text p-3 rounded-md border border-vanguard-bg-tertiary focus:ring-2 focus:ring-vanguard-accent focus:outline-none"
              disabled={isLoading}
              aria-label="Chat input"
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-vanguard-text-secondary disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CorpusAssistant;