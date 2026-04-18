import { Body, Controller, Get, Post } from '@nestjs/common';
import { BrandVoiceService } from '@gitroom/nestjs-libraries/brand-voice/brand-voice.service';
import { GetOrgFromRequest } from '@gitroom/nestjs-libraries/user/org.from.request';
import { Organization } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Brand Voice')
@Controller('/brand-voice')
export class BrandVoiceController {
  constructor(private brandVoiceService: BrandVoiceService) {}

  @Get('/')
  async getBrandVoice(@GetOrgFromRequest() org: Organization) {
    return this.brandVoiceService.getBrandVoice(org.id);
  }

  @Post('/')
  async upsertBrandVoice(@GetOrgFromRequest() org: Organization, @Body() body: any) {
    return this.brandVoiceService.upsertBrandVoice(org.id, body);
  }
}
