import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';

@Injectable()
export class BrandVoiceService {
  constructor(private prisma: PrismaService) {}

  async getBrandVoice(organizationId: string) {
    return this.prisma.brandVoice.findUnique({
      where: { organizationId },
    });
  }

  async upsertBrandVoice(organizationId: string, data: any) {
    return this.prisma.brandVoice.upsert({
      where: { organizationId },
      update: data,
      create: { ...data, organizationId },
    });
  }
}
