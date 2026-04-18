import { Controller, Get, Post, Body, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { MoyasarService } from '@gitroom/nestjs-libraries/services/moyasar.service';
import { PrismaService } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { GetOrgFromRequest } from '@gitroom/nestjs-libraries/user/org.from.request';
import { Organization } from '@prisma/client';
import { pricing } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/pricing';
import { ApiTags } from '@nestjs/swagger';
import dayjs from 'dayjs';

@ApiTags('Payments')
@Controller('/payments')
export class PaymentsController {
  constructor(
    private moyasarService: MoyasarService,
    private prisma: PrismaService
  ) {}

  @Post('/create-invoice')
  async createInvoice(
    @GetOrgFromRequest() org: Organization,
    @Body() body: { plan: string; interval: 'month' | 'year' }
  ) {
    const planConfig = pricing[body.plan];
    if (!planConfig) {
      throw new HttpException('Invalid plan', HttpStatus.BAD_REQUEST);
    }

    const amount = body.interval === 'month' ? planConfig.month_price : planConfig.year_price;
    const amountInHalalas = amount * 100;

    const invoice = await this.moyasarService.createInvoice({
      amount: amountInHalalas,
      currency: 'SAR',
      description: `AutoPost AI ${body.plan} Subscription (${body.interval}ly)`,
      callbackUrl: `${process.env.FRONTEND_URL}/billing/callback`,
      metadata: {
        organizationId: org.id,
        plan: body.plan,
        interval: body.interval,
      },
    });

    return { url: invoice.url };
  }

  @Get('/callback')
  async callback(@Query('id') paymentId: string, @Res() res: any) {
    const payment = await this.moyasarService.fetchPayment(paymentId);
    if (payment.status !== 'paid') {
      return res.redirect(`${process.env.FRONTEND_URL}/billing?error=payment_failed`);
    }

    const { organizationId, plan, interval } = payment.metadata;
    const planConfig = pricing[plan];

    await this.prisma.subscription.upsert({
      where: { organizationId },
      update: {
        plan,
        status: 'active',
        moyasarId: paymentId,
        currentPeriodEnd: dayjs().add(1, interval as any).toDate(),
        maxProfiles: planConfig.maxProfiles,
        maxPostsPerDay: planConfig.maxPostsPerDay,
      },
      create: {
        organizationId,
        plan,
        status: 'active',
        moyasarId: paymentId,
        currentPeriodEnd: dayjs().add(1, interval as any).toDate(),
        maxProfiles: planConfig.maxProfiles,
        maxPostsPerDay: planConfig.maxPostsPerDay,
      },
    });

    return res.redirect(`${process.env.FRONTEND_URL}/billing?success=true`);
  }
}
