import {
  AnalyticsData,
  AuthTokenDetails,
  PostDetails,
  PostResponse,
  SocialProvider,
} from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { SocialAbstract } from '@gitroom/nestjs-libraries/integrations/social.abstract';
import { WhatsappDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/whatsapp.dto';
import { Integration } from '@prisma/client';
import axios from 'axios';

export class WhatsappProvider extends SocialAbstract implements SocialProvider {
  identifier = 'whatsapp';
  name = 'WhatsApp Business';
  isBetweenSteps = false;
  scopes = [];
  editor = 'normal' as const;
  maxLength() {
    return 4096;
  }
  dto = WhatsappDto;

  async refreshToken(refresh_token: string): Promise<AuthTokenDetails> {
    return {
      refreshToken: '',
      expiresIn: 0,
      accessToken: '',
      id: '',
      name: '',
      picture: '',
      username: '',
    };
  }

  async generateAuthUrl() {
    return {
      url: '',
      codeVerifier: '',
      state: '',
    };
  }

  async authenticate(params: {
    code: string;
    codeVerifier: string;
    refresh?: string;
  }) {
    // For WhatsApp, we usually use a manual token or API key setup for now
    return {
      id: 'manual',
      name: 'WhatsApp Account',
      accessToken: params.code,
      refreshToken: '',
      expiresIn: 3600 * 24 * 365,
      picture: '',
      username: '',
    };
  }

  async post(
    id: string,
    accessToken: string,
    postDetails: PostDetails<WhatsappDto>[]
  ): Promise<PostResponse[]> {
    const [firstPost] = postDetails;
    const phoneNumberId = id; // Assuming ID is the phone number ID

    try {
      const response = await axios.post(
        `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: firstPost.settings?.phoneNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
          type: 'text',
          text: { body: firstPost.message },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return [
        {
          id: firstPost.id,
          postId: response.data.messages[0].id,
          releaseURL: '',
          status: 'success',
        },
      ];
    } catch (error) {
      throw new Error(`WhatsApp post failed: ${error.message}`);
    }
  }

  async comment(): Promise<PostResponse[]> {
    return [];
  }

  async analytics(): Promise<AnalyticsData[]> {
    return [];
  }

  async postAnalytics(): Promise<AnalyticsData[]> {
    return [];
  }
}
