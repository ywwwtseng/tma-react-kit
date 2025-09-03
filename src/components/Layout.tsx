import React from 'react';
import { postEvent } from '@telegram-apps/sdk-react';
import { useTMASDK } from '../store/TMASDKContext';

export const HEADER_HEIGHT = 56;
export const TAB_BAR_HEIGHT = 60;

function Root({ children }: React.PropsWithChildren) {
  const { platform } = useTMASDK();
  const safeAreaBottom = platform === 'ios' ? 20 : 12;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      paddingTop: HEADER_HEIGHT,
      paddingBottom: TAB_BAR_HEIGHT + safeAreaBottom,
      overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}

function Header({ className, logo, children }: React.PropsWithChildren<{ className?: string; logo: React.ReactElement; }>) {
  return (
    <div
      className={className}
      style={{
        width: '100vw',
        height: HEADER_HEIGHT,
        left: 0,
        top: 0,
        padding: '8px 16px',
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        
      }}>
      {logo}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Main({ className, children }: React.PropsWithChildren<{ className?: string; }>) {
  return (
    <div
      className={className}
      style={{
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {children}
    </div>
  );
} 

function TabBar({ className, children }: React.PropsWithChildren<{ className?: string; }>) {
  const { platform } = useTMASDK();
  const safeAreaBottom = platform === 'ios' ? 20 : 12;

  return (
    <div
      className={className}
      style={{
        width: '100vw',
        height: TAB_BAR_HEIGHT + safeAreaBottom,
        left: 0,
        bottom: 0,
        padding: '4px 32px 0px',
        position: 'fixed',
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'space-between',
      }}
    >
      {children}
    </div>
  );
}

function TabBarItem({
  className,
  icon: Icon,
  text,
  active = false,
  onClick,
}: {
  className?: string;
  icon: React.ElementType;
  text: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  const [isActivating, setIsActivating] = React.useState(false);

  return (
    <button
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none',
        gap: '2px',
        width: '54px',
        color: active || isActivating ? 'white' : '#7c7c7c',
        transition: 'color 200ms',
      }}
      onClick={() => {
        if (active || isActivating) return;

        postEvent('web_app_trigger_haptic_feedback', {
          type: 'impact',
          impact_style: 'light',
        });

        setIsActivating(true);
        setTimeout(() => {
          setIsActivating(false);
        }, 200);

        onClick?.();
      }}
    >
      <div style={{
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon width={28} height={28} />
      </div>
      {text}
    </button>
  );
}

TabBar.Item = TabBarItem;

export const Layout = {
  Root,
  Header,
  Main,
  TabBar,
};
