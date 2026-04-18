import React from 'react';
import { HtmlComponent } from '@gitroom/frontend/components/layout/html.component';
import { VariableContextComponent } from '@gitroom/react/helpers/variable.context';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <VariableContextComponent
          storageProvider={
            (process.env.STORAGE_PROVIDER || 'local') as 'local' | 'cloudflare'
          }
          environment={process.env.NODE_ENV || 'production'}
          backendUrl={process.env.NEXT_PUBLIC_BACKEND_URL || ''}
          plontoKey={process.env.NEXT_PUBLIC_POLOTNO || ''}
          stripeClient={process.env.STRIPE_PUBLISHABLE_KEY || ''}
          billingEnabled={!!process.env.STRIPE_PUBLISHABLE_KEY}
          discordUrl={process.env.NEXT_PUBLIC_DISCORD_SUPPORT || ''}
          frontEndUrl={process.env.FRONTEND_URL || ''}
          isGeneral={!!process.env.IS_GENERAL}
          genericOauth={!!process.env.POSTIZ_GENERIC_OAUTH}
          oauthLogoUrl={process.env.NEXT_PUBLIC_POSTIZ_OAUTH_LOGO_URL || ''}
          oauthDisplayName={
            process.env.NEXT_PUBLIC_POSTIZ_OAUTH_DISPLAY_NAME || ''
          }
          uploadDirectory={
            process.env.NEXT_PUBLIC_UPLOAD_STATIC_DIRECTORY || ''
          }
          cloudflareUrl={process.env.CLOUDFLARE_BUCKET_URL || ''}
          mainUrl={process.env.MAIN_URL || ''}
          mcpUrl={process.env.MCP_URL}
          dub={false}
          facebookPixel={process.env.NEXT_PUBLIC_FACEBOOK_PIXEL || ''}
          telegramBotName={process.env.TELEGRAM_BOT_NAME || ''}
          neynarClientId={process.env.NEYNAR_CLIENT_ID || ''}
          isSecured={!process.env.NOT_SECURED}
          disableImageCompression={false}
          disableXAnalytics={false}
          sentryDsn={process.env.NEXT_PUBLIC_SENTRY_DSN || ''}
          extensionId={process.env.EXTENSION_ID || ''}
          language="en"
          transloadit={[]}
        >
          <HtmlComponent />
          <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
            {children}
          </div>
        </VariableContextComponent>
      </body>
    </html>
  );
}
