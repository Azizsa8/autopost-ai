import { Injectable } from '@nestjs/common';
import { pricing } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/pricing';
import { PrismaService } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { MoyasarService } from '@gitroom/nestjs-libraries/services/moyasar.service';
import dayjs from 'dayjs';

@Injectable()
export class SubscriptionService {
  constructor(
    private prisma: PrismaService,
    private moyasarService: MoyasarService
  ) {}

  async getSubscriptionByOrganizationId(organizationId: string) {
    return this.prisma.subscription.findUnique({
      where: { organizationId },
    });
  }

  async createCheckoutLink(organizationId: string, plan: string) {
    const selectedPlan = pricing[plan];
    if (!selectedPlan) throw new Error('Invalid plan');

    const invoice = await this.moyasarService.createInvoice({
      amount: selectedPlan.month_price * 100, // Halalas
      currency: 'SAR',
      description: `AutoPost AI - ${plan} plan`,
      callbackUrl: `${process.env.FRONTEND_URL}/billing/callback`,
      metadata: {
        organizationId,
        plan,
      },
    });

    return { checkoutUrl: invoice.url };
  }

  async handleMoyasarWebhook(payload: any) {
    // Basic verification (in production, use Moyasar signature)
    const { id, status, amount, metadata } = payload;
    
    if (status === 'paid' && metadata?.organizationId) {
      const plan = metadata.plan;
      const selectedPlan = pricing[plan];

      await this.prisma.subscription.upsert({
        where: { organizationId: metadata.organizationId },
        update: {
          plan,
          status: 'active',
          moyasarId: id,
          currentPeriodEnd: dayjs().add(1, 'month').toDate(),
          maxProfiles: selectedPlan.maxProfiles,
          maxPostsPerDay: selectedPlan.maxPostsPerDay,
        },
        create: {
          organizationId: metadata.organizationId,
          plan,
          status: 'active',
          moyasarId: id,
          currentPeriodEnd: dayjs().add(1, 'month').toDate(),
          maxProfiles: selectedPlan.maxProfiles,
          maxPostsPerDay: selectedPlan.maxPostsPerDay,
        },
      });
    }
  }

  async cancelSubscription(organizationId: string) {
    return this.prisma.subscription.update({
      where: { organizationId },
      data: { status: 'cancelled' },
    });
  }

  async addSubscription(organizationId: string, userId: string, plan: string) {
    const selectedPlan = pricing[plan];
    if (!selectedPlan) throw new Error('Invalid plan');

    return this.prisma.subscription.upsert({
      where: { organizationId },
      update: {
        plan,
        status: 'active',
        currentPeriodEnd: dayjs().add(1, 'month').toDate(),
        maxProfiles: selectedPlan.maxProfiles,
        maxPostsPerDay: selectedPlan.maxPostsPerDay,
      },
      create: {
        organizationId,
        plan,
        status: 'active',
        currentPeriodEnd: dayjs().add(1, 'month').toDate(),
        maxProfiles: selectedPlan.maxProfiles,
        maxPostsPerDay: selectedPlan.maxPostsPerDay,
      },
    });
  }

  async checkCredits(org: any) {
    return 1000; // Mock credits
  }

  async useCredit(org: any, type: string, func: () => Promise<any>) {
    return func();
  }

  async getSubscription(organizationId: string) {
    return this.getSubscriptionByOrganizationId(organizationId);
  }

  async modifySubscriptionByOrg(organizationId: string, totalProfiles: number, plan: string) {
    return this.prisma.subscription.update({
      where: { organizationId },
      data: {
        plan,
        maxProfiles: totalProfiles,
      },
    });
  }

  async lifeTime(organizationId: string, make: boolean, plan: string) {
    const selectedPlan = pricing[plan];
    return this.prisma.subscription.upsert({
      where: { organizationId },
      update: {
        plan,
        status: 'active',
        isLifetime: true,
        maxProfiles: selectedPlan.maxProfiles,
        maxPostsPerDay: selectedPlan.maxPostsPerDay,
      },
      create: {
        organizationId,
        plan,
        status: 'active',
        isLifetime: true,
        maxProfiles: selectedPlan.maxProfiles,
        maxPostsPerDay: selectedPlan.maxPostsPerDay,
      },
    });
  }
}
