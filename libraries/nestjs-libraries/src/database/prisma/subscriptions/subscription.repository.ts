import { Injectable } from '@nestjs/common';
import {
  PrismaRepository,
  PrismaTransaction,
} from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import dayjs from 'dayjs';
import { Organization } from '@prisma/client';

@Injectable()
export class SubscriptionRepository {
  constructor(
    private readonly _subscription: PrismaRepository<'subscription'>,
    private readonly _organization: PrismaRepository<'organization'>,
    private readonly _user: PrismaRepository<'user'>,
    private readonly _credits: PrismaRepository<'credits'>,
    private _usedCodes: PrismaRepository<'usedCodes'>
  ) {}

  getUserAccount(userId: string) {
    return this._user.model.user.findFirst({
      where: { id: userId },
      select: { account: true, connectedAccount: true },
    });
  }

  getCode(code: string) {
    return this._usedCodes.model.usedCodes.findFirst({
      where: { code },
    });
  }

  updateAccount(userId: string, account: string) {
    return this._user.model.user.update({
      where: { id: userId },
      data: { account },
    });
  }

  getSubscriptionByOrganizationId(organizationId: string) {
    return this._subscription.model.subscription.findFirst({
      where: { organizationId },
    });
  }

  updateConnectedStatus(account: string, accountCharges: boolean) {
    return this._user.model.user.updateMany({
      where: { account },
      data: { connectedAccount: accountCharges },
    });
  }

  getCustomerIdByOrgId(organizationId: string) {
    return this._organization.model.organization.findFirst({
      where: { id: organizationId },
      select: { paymentId: true },
    });
  }

  checkSubscription(organizationId: string, subscriptionId: string) {
    return this._subscription.model.subscription.findFirst({
      where: {
        organizationId,
        moyasarId: subscriptionId,
      },
    });
  }

  deleteSubscriptionByCustomerId(customerId: string) {
    return this._subscription.model.subscription.deleteMany({
      where: {
        organization: {
          paymentId: customerId,
        },
      },
    });
  }

  updateCustomerId(organizationId: string, customerId: string) {
    return this._organization.model.organization.update({
      where: { id: organizationId },
      data: { paymentId: customerId },
    });
  }

  async getSubscriptionByOrgId(orgId: string) {
    return this._subscription.model.subscription.findFirst({
      where: { organizationId: orgId },
    });
  }

  async getSubscriptionByCustomerId(customerId: string) {
    return this._subscription.model.subscription.findFirst({
      where: {
        organization: { paymentId: customerId },
      },
    });
  }

  async getOrganizationByCustomerId(customerId: string) {
    return this._organization.model.organization.findFirst({
      where: { paymentId: customerId },
    });
  }

  async createOrUpdateSubscription(
    isTrailing: boolean,
    identifier: string,
    customerId: string,
    totalChannels: number,
    billing: string,
    period: string,
    cancelAt: number | null,
    code?: string,
    org?: { id: string }
  ) {
    const findOrg =
      org || (await this.getOrganizationByCustomerId(customerId))!;

    if (!findOrg) return;

    const planLimits: Record<string, { maxProfiles: number; maxPostsPerDay: number }> = {
      STANDARD: { maxProfiles: 2, maxPostsPerDay: 1 },
      TEAM:     { maxProfiles: 5, maxPostsPerDay: 3 },
      PRO:      { maxProfiles: 15, maxPostsPerDay: 999 },
      ULTIMATE: { maxProfiles: 999, maxPostsPerDay: 999 },
    };

    const limits = planLimits[billing] || { maxProfiles: 2, maxPostsPerDay: 1 };

    await this._subscription.model.subscription.upsert({
      where: { organizationId: findOrg.id },
      update: {
        plan: billing,
        status: 'active',
        moyasarId: identifier,
        maxProfiles: limits.maxProfiles,
        maxPostsPerDay: limits.maxPostsPerDay,
        currentPeriodEnd: cancelAt ? new Date(cancelAt * 1000) : null,
      },
      create: {
        organizationId: findOrg.id,
        plan: billing,
        status: 'active',
        moyasarId: identifier,
        maxProfiles: limits.maxProfiles,
        maxPostsPerDay: limits.maxPostsPerDay,
        currentPeriodEnd: cancelAt ? new Date(cancelAt * 1000) : null,
      },
    });

    await this._organization.model.organization.update({
      where: { id: findOrg.id },
      data: { isTrailing, allowTrial: false },
    });

    if (code) {
      await this._usedCodes.model.usedCodes.create({
        data: { code, orgId: findOrg.id },
      });
    }
  }

  getSubscriptionByIdentifier(identifier: string) {
    return this._subscription.model.subscription.findFirst({
      where: { moyasarId: identifier },
      include: { organization: true },
    });
  }

  getSubscription(organizationId: string) {
    return this._subscription.model.subscription.findFirst({
      where: { organizationId },
    });
  }

  async getCreditsFrom(
    organizationId: string,
    from: dayjs.Dayjs,
    type = 'ai_images'
  ) {
    const load = await this._credits.model.credits.groupBy({
      by: ['organizationId'],
      where: {
        organizationId,
        type,
        createdAt: { gte: from.toDate() },
      },
      _sum: { credits: true },
    });

    return load?.[0]?._sum?.credits || 0;
  }

  async useCredit<T>(
    org: Organization,
    type = 'ai_images',
    func: () => Promise<T>
  ) {
    const data = await this._credits.model.credits.create({
      data: { organizationId: org.id, credits: 1, type },
    });

    try {
      return await func();
    } catch (err) {
      await this._credits.model.credits.delete({
        where: { id: data.id },
      });
      throw err;
    }
  }

  setCustomerId(orgId: string, customerId: string) {
    return this._organization.model.organization.update({
      where: { id: orgId },
      data: { paymentId: customerId },
    });
  }
}