import { Module } from '@nestjs/common';
import { BrandVoiceService } from './brand-voice.service';

@Module({
  providers: [BrandVoiceService],
  exports: [BrandVoiceService],
})
export class BrandVoiceModule {}
