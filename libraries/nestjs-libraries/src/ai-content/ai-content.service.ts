import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';

@Injectable()
export class AiContentService {
  private readonly logger = new Logger(AiContentService.name);
  private readonly nvidiaApiKey = process.env.NVIDIA_API_KEY;
  private readonly nvidiaBaseUrl = 'https://integrate.api.nvidia.com/v1';

  constructor(private prisma: PrismaService) {}

  private async callNvidia(endpoint: string, data: any, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.post(`${this.nvidiaBaseUrl}${endpoint}`, data, {
          headers: {
            Authorization: `Bearer ${this.nvidiaApiKey}`,
            'Content-Type': 'application/json',
          },
        });
        return response.data;
      } catch (error: any) {
        this.logger.error(`NVIDIA API Error (attempt ${i + 1}): ${error.message}`);
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  async generateCaption(params: {
    organizationId: string;
    platform: string;
    topic: string;
    brandVoice: any;
    language: 'ar' | 'en' | 'both';
  }) {
    const { platform, topic, brandVoice, language, organizationId } = params;

    const platformInstructions = {
      Instagram: 'casual, emoji-rich, 5-10 hashtags',
      LinkedIn: 'professional, no emoji, thought leadership',
      TikTok: 'hook in first line, trending audio suggestion',
      X: 'punchy, under 240 chars, 1-2 hashtags',
      Twitter: 'punchy, under 240 chars, 1-2 hashtags',
      Snapchat: 'short, direct, Arabic-first',
    };

    const systemPrompt = `You are a social media expert for ${brandVoice.industry}. 
Tone: ${brandVoice.tone}.
Keywords: ${brandVoice.keywords || 'none'}.
Avoid words: ${brandVoice.avoidWords || 'none'}.
Platform: ${platform}. ${platformInstructions[platform] || ''}
Few-shot examples:
Arabic: ${brandVoice.arabicExamples || 'none'}
English: ${brandVoice.englishExamples || 'none'}
Goal: Generate a caption for: ${topic}.
Language requirement: ${language}.
Format result as JSON: { "captionAr": "...", "captionEn": "...", "hashtags": ["...", "..."], "suggestedImagePrompt": "..." }`;

    try {
      const result = await this.callNvidia('/chat/completions', {
        model: 'deepseek-ai/deepseek-v3.1-terminus',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate post for ${platform} about ${topic} in ${language} language.` },
        ],
        response_format: { type: 'json_object' },
      });

      const content = JSON.parse(result.choices[0].message.content);

      await this.logGeneration({
        organizationId,
        model: 'deepseek-ai/deepseek-v3.1-terminus',
        platform,
        language,
        promptTokens: result.usage?.prompt_tokens,
        completionTokens: result.usage?.completion_tokens,
        success: true,
      });

      return content;
    } catch (error: any) {
      this.logger.error(`Caption generation failed: ${error.message}`);
      await this.logGeneration({
        organizationId,
        model: 'deepseek-ai/deepseek-v3.1-terminus',
        platform,
        language,
        success: false,
        errorMessage: error.message,
      });
      return { captionAr: '', captionEn: '', hashtags: [], suggestedImagePrompt: '' };
    }
  }

  async generateImage(params: { organizationId: string; prompt: string; platform: string }) {
    const { prompt, platform, organizationId } = params;

    const dimensions = {
      Instagram: { width: 1024, height: 1024 },
      TikTok: { width: 1024, height: 1792 },
      LinkedIn: { width: 1200, height: 627 },
    };

    const { width, height } = dimensions[platform] || { width: 1024, height: 1024 };

    try {
      const result = await this.callNvidia('/images/generations', {
        model: 'stabilityai/stable-diffusion-3-medium',
        prompt,
        n: 1,
        size: `${width}x${height}`,
      });

      await this.logGeneration({
        organizationId,
        model: 'stabilityai/stable-diffusion-3-medium',
        platform,
        language: 'n/a',
        success: true,
      });

      return result.data[0].url || result.data[0].b64_json;
    } catch (error: any) {
      this.logger.error(`Image generation failed: ${error.message}`);
      await this.logGeneration({
        organizationId,
        model: 'stabilityai/stable-diffusion-3-medium',
        platform,
        language: 'n/a',
        success: false,
        errorMessage: error.message,
      });
      return '';
    }
  }

  async translateText(params: { organizationId: string; text: string; from: 'ar' | 'en'; to: 'ar' | 'en' }) {
    const { text, from, to, organizationId } = params;
    try {
      const result = await this.callNvidia('/chat/completions', {
        model: 'nvidia/riva-translate-4b-instruct-v1_1',
        messages: [
          { role: 'system', content: `Translate from ${from} to ${to}.` },
          { role: 'user', content: text },
        ],
      });

      await this.logGeneration({
        organizationId,
        model: 'nvidia/riva-translate-4b-instruct-v1_1',
        platform: 'n/a',
        language: to,
        success: true,
      });

      return { translatedText: result.choices[0].message.content };
    } catch (error: any) {
      this.logger.error(`Translation failed: ${error.message}`);
      return { translatedText: '' };
    }
  }

  async moderateContent(params: { organizationId: string; caption: string; platform: string }) {
    const { caption, platform, organizationId } = params;
    try {
      const result = await this.callNvidia('/chat/completions', {
        model: 'google/shieldgemma-9b',
        messages: [
          { role: 'system', content: 'You are a content safety moderator. Decide if the following caption is safe to post. Answer with JSON: { "safe": boolean, "reason": "string" }' },
          { role: 'user', content: caption },
        ],
        response_format: { type: 'json_object' },
      });

      const content = JSON.parse(result.choices[0].message.content);

      await this.logGeneration({
        organizationId,
        model: 'google/shieldgemma-9b',
        platform,
        language: 'n/a',
        success: true,
      });

      return content;
    } catch (error: any) {
      this.logger.error(`Moderation failed: ${error.message}`);
      return { safe: true };
    }
  }

  private async logGeneration(log: any) {
    try {
      await this.prisma.aiGenerationLog.create({
        data: {
          organizationId: log.organizationId,
          model: log.model,
          platform: log.platform,
          language: log.language,
          promptTokens: log.promptTokens,
          completionTokens: log.completionTokens,
          success: log.success,
          errorMessage: log.errorMessage,
        },
      });
    } catch (error: any) {
      this.logger.error(`Logging generation failed: ${error.message}`);
    }
  }
}
