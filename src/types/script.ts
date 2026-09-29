export interface Scene {
  id: number;
  act: 'intro' | 'desarrollo' | 'cierre';
  actTitle: string;
  timecode: string;
  durationSec: number;
  shotType: 'PG' | 'PMC' | 'PP' | 'PD' | 'DRON' | 'TRAVELLING';
  shotName: string;
  cameraMovement: string;
  lighting: string;
  videoDescription: string;
  visualCuesSENA: string;
  audioVoiceover: string;
  audioSpeaker: string;
  sfxAndMusic: string;
  locationTip: string;
  propsRequired: string[];
  imageAsset?: string;
  lowerThird?: {
    title: string;
    subtitle: string;
  };
}

export interface PainPoint {
  id: string;
  title: string;
  icon: string;
  statOrFact: string;
  problem: string;
  impactMiPyme: string;
  solutionSENA: string;
  digitalTool: string;
  category: 'operativa' | 'financiera' | 'competitiva' | 'estrategica';
}

export interface MethodologyStep {
  step: number;
  title: string;
  description: string;
  senaRole: string;
  deliverable: string;
  tools: string[];
}

export interface ScriptFormat {
  id: 'master' | 'reels' | 'linkedin';
  name: string;
  aspectRatio: string;
  duration: string;
  targetAudience: string;
  hook: string;
  scriptBody: string;
  callToAction: string;
  distributionTips: string[];
}
