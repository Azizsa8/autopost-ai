import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import dayjs from 'dayjs';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const org = request.org;

    if (!org) {
      return false;
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId: org.id },
    });

    // If no subscription record, create a 7-day free trial (Step 12 condition)
    if (!subscription) {
      await this.prisma.subscription.create({
        data: {
          organizationId: org.id,
          plan: 'starter',
          status: 'trialing',
          trialEndsAt: dayjs().add(7, 'day').toDate(),
          maxProfiles: 2,
          maxPostsPerDay: 1,
        },
      });
      return true;
    }

    const now = dayjs();

    // Check if trial expired
    if (subscription.status === 'trialing' && subscription.trialEndsAt && dayjs(subscription.trialEndsAt).isBefore(now)) {
      throw new HttpException('Free trial expired. Please subscribe to continue.', HttpStatus.PAYMENT_REQUIRED);
    }

    // Check if active or trialing
    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
      throw new HttpException('Active subscription required.', HttpStatus.PAYMENT_REQUIRED);
    }

    // Add subscription info to request for further checks (limit enforcement)
    request.subscription = subscription;

    return true;
  }
}
