import { useState, type PropsWithChildren, type ReactNode } from 'react';
import { postEvent } from '@telegram-apps/sdk-react';
import { useTMASDK } from '../store/TMASDKContext';
import { useTMAStore } from '../store/TMAStoreContext';
import { useTMAI18n } from '../store/TMAI18nContext';
import { Status } from '../constants';

export const HEADER_HEIGHT = 56;
export const TAB_BAR_HEIGHT = 60;

function Root({ children }: PropsWithChildren) {
  const { status } = useTMAStore();
  const { platform } = useTMASDK();
  const safeAreaBottom = platform === 'ios' ? 20 : 12;

  return (
    <div
      className={status !== Status.Loading ? 'animation-fade-in' : ''}
      style={{
      display: 'flex',
      opacity: 0,
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

function Header({ className, children }: PropsWithChildren<{ className?: string; }>) {
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
      {children}
    </div>
  )
}

function HeaderLeft({ className, children }: PropsWithChildren<{ className?: string; }>) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}>
      {children}
    </div>
  );
}

function HeaderRight({ className, children }: PropsWithChildren<{ className?: string; }>) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}>
      {children}
    </div>
  );
}

function Main({ className, children }: PropsWithChildren<{ className?: string; }>) {
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

function TabBar({ className, children }: PropsWithChildren<{ className?: string; }>) {
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
  icon,
  text,
  isActive = false,
  onClick,
}: {
  className?: string;
  icon: ReactNode;
  text: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const { t } = useTMAI18n();
  const [isActivating, setIsActivating] = useState(false);

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
        color: isActive || isActivating ? 'white' : '#7c7c7c',
        transition: 'color 200ms',
      }}
      onClick={() => {
        if (isActive || isActivating) return;

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
        justifyContent: 'center',
        transition: 'transform 200ms',
        transformOrigin: 'center',
        transform: isActivating ? 'scale(1.1)' : 'scale(1)',
      }}>
        {icon}
      </div>
      {t(text)}
    </button>
  );
}

export const Layout = {
  Root,
  Header,
  HeaderLeft,
  HeaderRight,
  Main,
  TabBar,
  TabBarItem,
};
