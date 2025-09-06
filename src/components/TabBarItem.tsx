import { useState, type ReactNode, CSSProperties } from 'react';

import { postEvent } from '@telegram-apps/sdk-react';
import { useTMAI18n } from '../store/TMAI18nContext';

export function TabBarItem({
  icon,
  text,
  isActive = false,
  onClick,
  style,
}: {
  icon: ReactNode;
  text: string;
  isActive?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  const { t } = useTMAI18n();
  const [isActivating, setIsActivating] = useState(false);

  return (
    <button
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
        fontSize: '12px',
        whiteSpace: 'nowrap',
        ...style,
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
