import React from 'react';
import Card from './Card';
import { screenplay } from '../data/screenplay';
import { productionBible } from '../data/productionBible';
import { completionReport } from '../data/completionReport';
import { heroSequences } from '../data/heroSequences';
import { consistencyFormula } from '../data/consistencyFormula';
import { pitchDeck } from '../data/pitchDeck';
import { productionCalendar } from '../data/productionCalendar';
import { proofOfConcept } from '../data/proofOfConcept';
import { queryTemplates } from '../data/queryTemplates';
import { quickStartGuide } from '../data/quickStartGuide';
import { characterSynopsis } from '../data/characterSynopsis';
import { updatedRoadmap } from '../data/updatedRoadmap';
import { actOneBreakdown } from '../data/actOneBreakdown';
import { actTwoBreakdown } from '../data/actTwoBreakdown';
import { templateLibrary } from '../data/templateLibrary';
import { masterIndex } from '../data/masterIndex';
import { heroSequencesPhase1 } from '../data/heroSequencesPhase1';
import { standardSceneExamples } from '../data/standardSceneExamples';
import { vfxSpecs } from '../data/vfxSpecs';
import { deliverySummary } from '../data/deliverySummary';
import { grandmasDeathSequence } from '../data/grandmasDeathSequence';
import { allInOneStarter } from '../data/allInOneStarter';
import { masterIndexActs23 } from '../data/masterIndexActs23';
import { downloadGuide } from '../data/downloadGuide';
import { downloadAllFiles } from '../data/downloadAllFiles';
import { allInOneStarterPackage } from '../data/allInOneStarterPackage';
import { shotListDatabase } from '../data/shotListDatabase';
import { dialoguePolish } from '../data/dialoguePolish';
import { visualLookbook } from '../data/visualLookbook';
import { contactUpdateSummary } from '../data/contactUpdateSummary';
import { officialProductionInfo } from '../data/officialProductionInfo';


const DocumentCard: React.FC<{ title: string; subtitle: string; content: string; wordCount: number; }> = ({ title, subtitle, content, wordCount }) => (
    <Card title={title} className="flex flex-col">
        <h4 className="text-vanguard-accent font-bold">{subtitle}</h4>
        <div className="text-sm text-vanguard-text-secondary mt-1 mb-4">
            ~{wordCount.toLocaleString()} words
        </div>
        <pre className="flex-1 text-xs bg-vanguard-bg p-3 rounded-md overflow-hidden text-vanguard-text-secondary font-mono">
            {content.substring(0, 250)}...
        </pre>
        <button className="mt-4 w-full bg-vanguard-bg-tertiary hover:bg-vanguard-accent-hover/20 text-vanguard-text font-bold py-2 px-4 rounded-lg transition-colors duration-200">
            View Full Document
        </button>
    </Card>
);

const UploadCard: React.FC = () => (
     <Card title="Add to Corpus">
        <div className="flex flex-col items-center justify-center h-full text-center p-4 border-2 border-dashed border-vanguard-bg-tertiary rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-vanguard-text-secondary mb-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
            <p className="mb-4 text-vanguard-text-secondary">Upload screenplays, production notes, or character bibles to expand the AI's knowledge base.</p>
            <button className="w-full bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200">
                Upload Document
            </button>
        </div>
    </Card>
);


const DocumentManager: React.FC = () => {
    const documents = [
      { title: "Screenplay", subtitle: "The Vanguard", content: screenplay, wordCount: screenplay.split(/\s+/).length },
      { title: "Production Bible", subtitle: "Complete AI Production Bible", content: productionBible, wordCount: productionBible.split(/\s+/).length },
      { title: "Final Completion Report", subtitle: "Project Status & Index", content: completionReport, wordCount: completionReport.split(/\s+/).length },
      { title: "Hero Sequences 3-9", subtitle: "Essential Production Guide", content: heroSequences, wordCount: heroSequences.split(/\s+/).length },
      { title: "Midjourney Consistency Formula", subtitle: "Character Reference System for 95%+ Consistency", content: consistencyFormula, wordCount: consistencyFormula.split(/\s+/).length },
      { title: "Pitch Deck Materials", subtitle: "Logline, Synopsis & One-Sheet", content: pitchDeck, wordCount: pitchDeck.split(/\s+/).length },
      { title: "Production Calendar", subtitle: "7-Month Timeline with Specific Dates & Milestones", content: productionCalendar, wordCount: productionCalendar.split(/\s+/).length },
      { title: "Proof of Concept Short", subtitle: "5-Minute Standalone Scene", content: proofOfConcept, wordCount: proofOfConcept.split(/\s+/).length },
      { title: "Query Letter Templates", subtitle: "Manager/Agent Outreach", content: queryTemplates, wordCount: queryTemplates.split(/\s+/).length },
      { title: "Quick Start Guide", subtitle: "Start Production Today - No More Planning Needed", content: quickStartGuide, wordCount: quickStartGuide.split(/\s+/).length },
      { title: "Character Synopsis", subtitle: "Logline & Breakdowns", content: characterSynopsis, wordCount: characterSynopsis.split(/\s+/).length },
      { title: "Updated Pre-Production", subtitle: "Revised Script Roadmap", content: updatedRoadmap, wordCount: updatedRoadmap.split(/\s+/).length },
      { title: "Act One Breakdown", subtitle: "Complete Shot-by-Shot", content: actOneBreakdown, wordCount: actOneBreakdown.split(/\s+/).length },
      { title: "Act Two Breakdown", subtitle: "Complete Shot-by-Shot", content: actTwoBreakdown, wordCount: actTwoBreakdown.split(/\s+/).length },
      { title: "Template Library", subtitle: "45 Reusable Prompts", content: templateLibrary, wordCount: templateLibrary.split(/\s+/).length },
      { title: "Final Production Master Index", subtitle: "Complete Pre-Production Bible - Navigation & Tracking", content: masterIndex, wordCount: masterIndex.split(/\s+/).length },
      { title: "Hero Sequences: Phase 1", subtitle: "All Critical Sequences", content: heroSequencesPhase1, wordCount: heroSequencesPhase1.split(/\s+/).length },
      { title: "Standard Scene Examples", subtitle: "10 Fully Worked Scenes Using Template Library", content: standardSceneExamples, wordCount: standardSceneExamples.split(/\s+/).length },
      { title: "VFX Tech Specs", subtitle: "Shot-by-Shot Breakdown", content: vfxSpecs, wordCount: vfxSpecs.split(/\s+/).length },
      { title: "Pre-Production Roadmap", subtitle: "Complete Summary of Work Delivered", content: deliverySummary, wordCount: deliverySummary.split(/\s+/).length },
      { title: "Grandma's Death Sequence", subtitle: "Scene 035-037 Split-Screen", content: grandmasDeathSequence, wordCount: grandmasDeathSequence.split(/\s+/).length },
      { title: "Pre-Production Docs", subtitle: "Quick Access Navigation", content: allInOneStarter, wordCount: allInOneStarter.split(/\s+/).length },
      { title: "Acts 2 & 3 Roadmap", subtitle: "Master Index & Strategic Approach", content: masterIndexActs23, wordCount: masterIndexActs23.split(/\s+/).length },
      { title: "Download Guide", subtitle: "All Your Files - Organized & Ready to Download", content: downloadGuide, wordCount: downloadGuide.split(/\s+/).length },
      { title: "Download All Files", subtitle: "Working Download Links", content: downloadAllFiles, wordCount: downloadAllFiles.split(/\s+/).length },
      { title: "All-In-One Starter Package", subtitle: "Essentials Consolidated", content: allInOneStarterPackage, wordCount: allInOneStarterPackage.split(/\s+/).length },
      { title: "Complete Shot List Database", subtitle: "All 430 Shots - Production Tracker", content: shotListDatabase, wordCount: shotListDatabase.split(/\s+/).length },
      { title: "Dialogue Polish", subtitle: "Line-by-Line Notes & Professional Script Enhancement", content: dialoguePolish, wordCount: dialoguePolish.split(/\s+/).length },
      { title: "Director's Visual Lookbook", subtitle: "Cinematography, Color Palette & Aesthetic Vision", content: visualLookbook, wordCount: visualLookbook.split(/\s+/).length },
      { title: "Contact Info Update Summary", subtitle: "All Documents Updated with Official Credits", content: contactUpdateSummary, wordCount: contactUpdateSummary.split(/\s+/).length },
      { title: "Official Production Information", subtitle: "Contact Details & Credits", content: officialProductionInfo, wordCount: officialProductionInfo.split(/\s+/).length },
    ];


    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-vanguard-text">Document Management</h1>
            <p className="text-vanguard-text-secondary">This is the central knowledge base for your project. The AI will use these documents to provide context-aware analysis and suggestions across all modules.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {documents.map(doc => (
                    <DocumentCard key={doc.title} {...doc} />
                ))}
                <UploadCard />
            </div>
        </div>
    );
};

export default DocumentManager;