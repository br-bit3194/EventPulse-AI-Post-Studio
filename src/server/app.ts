import express, { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

export const app = express();

app.use(express.json({ limit: '10mb' }));

// CORS headers for universal cross-origin & Vercel deployment support
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (_req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// In-memory campaign state
export let currentCampaign = {
  id: 'TN-2025-V2',
  name: 'TechNova Global Summit 2025',
  format: 'hybrid',
  dates: 'Oct 14-16, 2025',
  location: 'San Francisco, CA & Virtual',
  organizerName: 'TechNova Media & Ventures Group',
  isOrganizerVerified: true,
  hashtags: ['#TechNova2025', '#AIFuture', '#TechSummit'],
  socialLinks: {
    linkedin: 'linkedin.com/company/technova-global',
    twitter: '@TechNovaHQ',
    website: 'https://summit.technova.io',
  },
  generatorSlug: 'https://eventpulse.ai/p/technova-2025',
  isPublicAccess: true,
  stats: {
    postsCreated: 1280,
    postsGrowth: '+24%',
    reachCount: '482.5K',
    reachNumeric: 482500,
    vipCount: '48 / 52',
    viralRate: '6.8%',
  },
};

export let livePosts = [
  {
    id: 'post-1',
    authorName: 'Sarah Lin',
    authorRole: 'Principal AI Architect • CloudScale',
    authorInitials: 'SL',
    timeAgo: '4m ago',
    timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
    content: '“Excited to be speaking at #TechNova2025 this afternoon on Distributed Neural Pipelines. What a turnout! Looking forward to networking with fellow founders and engineers.”',
    reactions: 142,
    comments: 19,
    reposts: 5,
    postUrl: 'https://www.linkedin.com',
  },
  {
    id: 'post-2',
    authorName: 'David Ross',
    authorRole: 'VP of Engineering • NextGen AI',
    authorInitials: 'DR',
    timeAgo: '12m ago',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    content: '“Incredible keynote kick-off at #TechNova2025. Key takeaway: agentic workflows are maturing faster than projected. Kudos to the organizers for an exceptional agenda.”',
    reactions: 89,
    comments: 8,
    reposts: 3,
    postUrl: 'https://www.linkedin.com',
  },
];

// Helper to get Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback high-converting templates if API key is not supplied or Gemini has transient error
function generateTemplatePost(highlights: string, tone: string, eventName: string, organizer: string, hashtags: string[]) {
  const tagsStr = hashtags.join(' ');
  const cleanHighlights = highlights.trim() || 'Attending inspiring keynote sessions and connecting with global tech innovators.';

  if (tone === 'grateful') {
    return `Unbelievable energy at #${eventName.replace(/[^a-zA-Z0-9]/g, '')} today! 🚀\n\nHuge thank you to the organizers at ${organizer} for curating such a forward-thinking agenda. The discussions around agentic AI workflows and next-generation infra made one thing clear: enterprise AI adoption is accelerating exponentially.\n\nThree big takeaways from Day 2:\n1️⃣ Autonomous agents are graduating from prototypes to production rails\n2️⃣ Vector retrieval latency dropped 10x year-over-year\n3️⃣ The community here in SF is buzzing with builders\n\nPersonal highlight: "${cleanHighlights}"\n\nLooking forward to tomorrow's panels!\n\n${tagsStr} #AIInnovation #TechSummit #ArtificialIntelligence #MachineLearning`;
  }

  if (tone === 'takeaways') {
    return `3 high-impact takeaways from ${eventName}: 💡\n\nAttending this week's summit completely reframed how we think about scale. Here is what you need to know:\n\n1. Production Realities: ${cleanHighlights}\n2. System Latency: Retrieval and agentic loops are converging at sub-100ms.\n3. Ecosystem Shift: Enterprise leaders are prioritizing reliability over raw parameter counts.\n\nWhat are you prioritizing in your tech stack this quarter?\n\nBig appreciation to ${organizer} for bringing the industry's sharpest minds together.\n\n${tagsStr} #EngineeringLeadership #TechInsights`;
  }

  if (tone === 'speaker') {
    return `Humbled and thrilled to take the stage at ${eventName}! 🎤\n\nSharing insights on modern infrastructure with a packed auditorium of brilliant builders was an unforgettable milestone.\n\nCore themes from my talk:\n• ${cleanHighlights}\n• Architecting for resilience in non-deterministic systems\n• Why team collaboration is the true differentiator in AI deployment\n\nThank you to ${organizer} for hosting such a world-class gathering. If we connected during the session or in the hallway, let's keep the conversation going in the comments!\n\n${tagsStr} #KeynoteSpeaker #TechConference #Leadership`;
  }

  // Professional default
  return `Reflecting on an exceptional experience at ${eventName} hosted by ${organizer}.\n\nThe conversations around modern tech architectures reinforced how rapidly our domain is evolving.\n\nKey perspective:\n"${cleanHighlights}"\n\nIn an industry dominated by rapid iteration, summits like this prove that shared knowledge and community collaboration remain our biggest assets.\n\n${tagsStr} #ExecutiveLeadership #EnterpriseTech #Networking`;
}

// Router containing all backend logic
const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString(), platform: process.env.VERCEL ? 'vercel-serverless' : 'node' });
});

// Campaign config
apiRouter.get('/campaign', (_req: Request, res: Response) => {
  res.json({ success: true, campaign: currentCampaign });
});

apiRouter.put('/campaign', (req: Request, res: Response) => {
  if (req.body) {
    currentCampaign = { ...currentCampaign, ...req.body };
  }
  res.json({ success: true, campaign: currentCampaign });
});

// Live feed posts
apiRouter.get('/posts', (_req: Request, res: Response) => {
  res.json({ success: true, posts: livePosts });
});

apiRouter.post('/posts', (req: Request, res: Response) => {
  const { authorName, authorRole, content, tone } = req.body;
  const newPost = {
    id: `post-${Date.now()}`,
    authorName: authorName || 'Elena Rostova',
    authorRole: authorRole || 'Head of AI Strategy at Synapse Labs',
    authorInitials: authorName ? authorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'ER',
    timeAgo: 'Just now',
    timestamp: new Date().toISOString(),
    content: content || 'Shared an update from the summit!',
    reactions: 1,
    comments: 0,
    reposts: 0,
    tone: tone || 'grateful',
    postUrl: 'https://www.linkedin.com',
  };
  livePosts.unshift(newPost);
  currentCampaign.stats.postsCreated += 1;
  res.json({ success: true, post: newPost, updatedStats: currentCampaign.stats });
});

// Gemini Post Generation
apiRouter.post('/generate-post', async (req: Request, res: Response) => {
  try {
    const {
      highlights = '',
      tone = 'grateful',
      eventName = currentCampaign.name,
      organizer = currentCampaign.organizerName,
      hashtags = currentCampaign.hashtags,
      authorName = 'Elena Rostova',
      authorRole = 'Head of AI Strategy',
    } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      const fallbackPost = generateTemplatePost(highlights, tone, eventName, organizer, hashtags);
      res.json({
        success: true,
        post: fallbackPost,
        model: 'template-fallback',
      });
      return;
    }

    const systemPrompt = `You are an elite LinkedIn content strategist specializing in crafting viral, high-engagement event attendance posts for executives, founders, engineers, and attendees at major technology conferences.
Rules:
1. Match the requested tone exactly:
   - "grateful": Deeply appreciative, celebrating organizers, calling out key speakers, energetic, warm, community-focused.
   - "takeaways": Structured, numbered bullets (1️⃣, 2️⃣, 3️⃣), insight-rich, actionable takeaways, provocative closing question.
   - "speaker": Authoritative yet humble speaker perspective, summary of their presentation, asking audience to connect.
   - "professional": Executive, polished, industry-trend framing, high credibility.
2. Ingest the user's specific takeaways or notes: "${highlights}". Weave them into the core of the post seamlessly.
3. Reference the event name "${eventName}" and the host/organizer "${organizer}".
4. Intersperse appropriate emojis naturally (1-4 emojis like 🚀, 💡, 🎤, 👏).
5. At the bottom, include the official campaign hashtags: ${hashtags.join(' ')}.
6. Keep the post concise, skimmable, with line breaks between paragraphs for mobile/desktop readability (around 600 - 900 characters).
7. Return ONLY the plain text of the post. Do not output markdown code blocks or quotes around the whole text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate a standout LinkedIn post for ${authorName} (${authorRole}) attending ${eventName}.`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const generatedText = response.text ? response.text.trim() : generateTemplatePost(highlights, tone, eventName, organizer, hashtags);

    res.json({
      success: true,
      post: generatedText,
      model: 'gemini-3.8-flash',
    });
  } catch (error) {
    console.error('Error generating post with Gemini:', error);
    const { highlights = '', tone = 'grateful', eventName = currentCampaign.name, organizer = currentCampaign.organizerName, hashtags = currentCampaign.hashtags } = req.body;
    const fallback = generateTemplatePost(highlights, tone, eventName, organizer, hashtags);
    res.json({
      success: true,
      post: fallback,
      model: 'template-fallback-on-error',
    });
  }
});

// Trending Hashtag Suggestion Route
apiRouter.post('/suggest-hashtags', async (req: Request, res: Response) => {
  try {
    const {
      eventName = currentCampaign.name,
      keywords = '',
      existingTags = currentCampaign.hashtags,
    } = req.body;

    const defaultSuggestions = [
      { tag: '#AgenticAI', volume: '142K posts', reason: 'High feed velocity among builders', score: 98 },
      { tag: '#EnterpriseAI', volume: '210K posts', reason: 'Top hashtag for executive reach', score: 95 },
      { tag: '#GenerativeAI', volume: '890K posts', reason: 'Broad discovery & global reach', score: 92 },
      { tag: '#VectorSearch', volume: '68K posts', reason: 'Trending technical architecture tag', score: 89 },
      { tag: '#TechLeadership', volume: '340K posts', reason: 'High reaction rate from VPs & Directors', score: 88 },
      { tag: '#LLMOps', volume: '54K posts', reason: 'Popular with production engineers', score: 86 },
      { tag: '#FutureOfTech', volume: '410K posts', reason: 'Strong cross-industry readership', score: 84 },
      { tag: '#SanFranciscoTech', volume: '72K posts', reason: 'Localized summit geographic viral boost', score: 82 },
    ];

    const ai = getGeminiClient();

    if (!ai) {
      const filtered = defaultSuggestions.filter(s => !existingTags.includes(s.tag));
      res.json({
        success: true,
        suggestions: filtered,
        model: 'heuristic-rules',
      });
      return;
    }

    const prompt = `You are a LinkedIn social algorithm expert. Analyze the following conference and attendee keywords, and suggest the top 6-8 trending, high-impact LinkedIn hashtags (beyond the official event hashtag) that maximize reach and algorithm distribution.
Event: ${eventName}
Attendee Key Highlights/Keywords: "${keywords}"
Existing Official Hashtags: ${existingTags.join(', ')}

Return a valid JSON array of objects with the exact schema:
[
  { "tag": "#HashtagName", "volume": "e.g. 120K posts", "reason": "brief 4-6 word reason why it's trending", "score": 95 }
]
Only output the raw JSON array. Do not include markdown code fence formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (response.text) {
      try {
        const parsed = JSON.parse(response.text.trim());
        if (Array.isArray(parsed) && parsed.length > 0) {
          res.json({
            success: true,
            suggestions: parsed,
            model: 'gemini-3.8-flash',
          });
          return;
        }
      } catch (err) {
        console.warn('Error parsing JSON from Gemini hashtags:', err);
      }
    }

    res.json({
      success: true,
      suggestions: defaultSuggestions.filter(s => !existingTags.includes(s.tag)),
      model: 'heuristic-fallback',
    });
  } catch (error) {
    console.error('Error suggesting hashtags:', error);
    res.json({
      success: true,
      suggestions: [
        { tag: '#AgenticAI', volume: '142K posts', reason: 'High feed velocity among builders', score: 98 },
        { tag: '#EnterpriseAI', volume: '210K posts', reason: 'Top hashtag for executive reach', score: 95 },
        { tag: '#TechLeadership', volume: '340K posts', reason: 'High reaction rate from VPs', score: 88 },
        { tag: '#GenerativeAI', volume: '890K posts', reason: 'Broad discovery & global reach', score: 92 },
      ],
      model: 'static-fallback',
    });
  }
});

// Branded Visual Generation Route
apiRouter.post('/generate-image', async (req: Request, res: Response) => {
  try {
    const {
      prompt = 'Futuristic AI keynote stage with neural network graphics and executive lighting',
      stylePreset = 'Keynote Stage',
      aspectRatio = '16:9',
      eventName = currentCampaign.name,
    } = req.body;

    const fullPrompt = `Professional conference visual for LinkedIn post. Subject: ${prompt}. Context: ${eventName}. Aesthetic: ${stylePreset}, high-end corporate tech conference, photorealistic, 4K resolution, cinematic lighting, ultra-detailed.`;

    const ai = getGeminiClient();

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: fullPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio === '1:1' ? '1:1' : '16:9',
            },
          },
        });

        for (const part of response?.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData && part.inlineData.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            res.json({
              success: true,
              imageUrl: `data:${mimeType};base64,${part.inlineData.data}`,
              caption: `${eventName} • Generated Visual (${stylePreset})`,
              model: 'gemini-3.1-flash-lite-image',
              prompt: fullPrompt,
            });
            return;
          }
        }
      } catch {
        // Free tier API keys don't have nano banana image generation quota; use curated visual preset
      }
    }

    // High quality themed fallbacks if image model has quota limits or offline
    const presetFallbackImages: Record<string, string> = {
      'Keynote Stage': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      'AI Architecture': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
      'Executive Mixer': 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
      'Holographic Badge': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    };

    const selectedFallback = presetFallbackImages[stylePreset] || presetFallbackImages['Keynote Stage'];

    res.json({
      success: true,
      imageUrl: selectedFallback,
      caption: `${eventName} • Branded Visual (${stylePreset})`,
      model: 'visual-preset-fallback',
      prompt: fullPrompt,
    });
  } catch (error) {
    console.error('Error in /api/generate-image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate visual',
    });
  }
});

// CSV Export route
apiRouter.get('/analytics/export', (_req: Request, res: Response) => {
  const csvRows = [
    ['Metric', 'Value', 'Details'],
    ['Campaign Name', currentCampaign.name, ''],
    ['Campaign ID', currentCampaign.id, ''],
    ['Total Posts Created', currentCampaign.stats.postsCreated, currentCampaign.stats.postsGrowth],
    ['Estimated LinkedIn Impressions', currentCampaign.stats.reachCount, 'Organic Reach'],
    ['Active VIPs / Speakers', currentCampaign.stats.vipCount, 'Official updates'],
    ['Viral Coefficient', currentCampaign.stats.viralRate, 'Avg feed interaction'],
    ['Hashtags', currentCampaign.hashtags.join('; '), 'Auto-injected in outputs'],
    ['Export Generated At', new Date().toISOString(), 'EventPulse Analytics'],
  ];

  const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="eventpulse-campaign-analytics.csv"');
  res.send(csvContent);
});

// Mount the apiRouter at both '/api' and '/' for complete route-matching compatibility
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
