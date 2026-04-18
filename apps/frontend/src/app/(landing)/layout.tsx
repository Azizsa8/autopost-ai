import React from 'react';
import { HtmlComponent } from '@gitroom/frontend/components/layout/html.component';
import { VariableContextComponent } from '@gitroom/react/helpers/variable.context';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VariableContextComponent>
      <HtmlComponent />
      <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
        {children}
      </div>
    </VariableContextComponent>
  );
}
