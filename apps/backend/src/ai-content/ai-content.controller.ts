import { Body, Controller, Post, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AiContentService } from '@gitroom/nestjs-libraries/ai-content/ai-content.service';
import { BrandVoiceService } from '@gitroom/nestjs-libraries/brand-voice/brand-voice.service';
import { GetOrgFromRequest } from '@gitroom/nestjs-libraries/user/org.from.request';
import { Organization } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { SubscriptionGuard } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.guard';

@ApiTags('AI Content')
@Controller('/ai')
@UseGuards(SubscriptionGuard)
export class AiContentController {
  constructor(
    private aiContentService: AiContentService,
    private brandVoiceService: BrandVoiceService
  ) {}

  @Post('/generate-caption')
  async generateCaption(@GetOrgFromRequest() org: Organization, @Body() body: any) {
    const brandVoice = await this.brandVoiceService.getBrandVoice(org.id);
    if (!brandVoice) {
      throw new HttpException('Brand voice not set up. Please complete onboarding.', HttpStatus.BAD_REQUEST);
    }
    return this.aiContentService.generateCaption({
      organizationId: org.id,
      platform: body.platform,
      topic: body.topic,
      brandVoice,
      language: body.language,
    });
  }

  @Post('/generate-image')
  async generateImage(@GetOrgFromRequest() org: Organization, @Body() body: any) {
    return this.aiContentService.generateImage({
      organizationId: org.id,
      prompt: body.prompt,
      platform: body.platform,
    });
  }

  @Post('/translate')
  async translate(@GetOrgFromRequest() org: Organization, @Body() body: any) {
    return this.aiContentService.translateText({
      organizationId: org.id,
      text: body.text,
      from: body.from,
      to: body.to,
    });
  }
}
