
import { GoogleGenAI, Modality, Type, FunctionDeclaration } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the CyberPeace SAATHI, an AI assistant dedicated to digital safety and cybersecurity, representing the CyberPeace Foundation. SAATHI stands for Secure Agentic AI for Threat Handling & Intelligence.

CORE CAPABILITIES:
1. MULTILINGUAL: Detect user language (English, Hindi, Kannada, Tamil, etc.) and respond in the SAME language.
2. CYBERSECURITY EXPERT: Help prevent/respond to cybercrime. Refer to these specific recent news items if relevant:
   - Kohli AI Voice: Fake video of Virat Kohli using AI voice for remarks on Prasidh Krishna. (Source: https://cyberpeace.org/resources/blogs/fake-video-uses-ai-voice-to-falsely-attribute-remarks-on-prasidh-krishna-to-virat-kohli)
   - Meta/WhatsApp AI: Italy's Antitrust action against Meta regarding WhatsApp AI chatbot competition law. (Source: https://cyberpeace.org/resources/blogs/italys-antitrust-action-against-meta-what-the-whatsapp-ai-chatbot-order-means-for-competition-law)
   - PM Modi AI Video: AI-generated video falsely attributing saffronisation remarks to PM Modi. (Source: https://cyberpeace.org/resources/blogs/ai-generated-video-falsely-attributes-saffronisation-remark-to-pm-modi)
3. ACTION ORIENTED (CRITICAL): 
   - If a user wants to file a complaint or says they've been scammed, collect these details: Name, Type of Scam, Contact Info, and a detailed description.
   - IN TEXT CHAT MODE: Once you have these 4 pieces of information, you MUST output this EXACT technical snippet at the VERY END: [COMPLAINT_TRIGGER: {"victimName": "...", "scamType": "...", "details": "...", "contactInfo": "..."}]
   - IN VOICE MODE: Once you have these 4 pieces of information, call the 'triggerComplaintDialog' tool. DO NOT output the technical snippet ([COMPLAINT_TRIGGER...]) in your speech or transcription. Just tell the user you are opening the summary for them.
4. GROUNDED: Use the Google Search tool for all queries about latest scams, helpline numbers, and general cybersecurity news.

GUIDELINES:
- Be empathetic and professional.
- Mention you are a CyberPeace Bot.
- Website: https://cyberpeace.org/
- NEVER output raw JSON or technical tags to the user.
`;

const complaintTool: FunctionDeclaration = {
  name: 'triggerComplaintDialog',
  parameters: {
    type: Type.OBJECT,
    description: 'Triggers a visual complaint summary and submission dialog for the user.',
    properties: {
      victimName: { type: Type.STRING, description: 'The name of the victim.' },
      scamType: { type: Type.STRING, description: 'The category of the scam (e.g., Phishing, Financial Fraud).' },
      details: { type: Type.STRING, description: 'A detailed description of what happened.' },
      contactInfo: { type: Type.STRING, description: 'Email or phone number of the victim.' },
    },
    required: ['victimName', 'scamType', 'details', 'contactInfo'],
  },
};

export const getGeminiClient = () => {
  const apiKey = "<Gemini_Key>";
  return new GoogleGenAI({ apiKey });
};

export const createChatSession = (language?: string) => {
  const ai = getGeminiClient();
  let instruction = SYSTEM_INSTRUCTION;
  if (language) {
    instruction += `\n\nIMPORTANT: The user has selected ${language} as their preferred language. You MUST respond ONLY in ${language}.`;
  }

  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: instruction,
      tools: [{ googleSearch: {} }],
    },
  });
};

export const LIVE_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';

export const getLiveConfig = () => ({
  model: LIVE_MODEL,
  config: {
    responseModalities: [Modality.AUDIO],
    speechConfig: {
      voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
    },
    systemInstruction: SYSTEM_INSTRUCTION,
    tools: [{ functionDeclarations: [complaintTool] }],
    outputAudioTranscription: {},
    inputAudioTranscription: {},
  },
});
