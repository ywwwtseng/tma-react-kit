import { type PropsWithChildren, useEffect, useRef, use } from 'react';
import { TMAInitContext } from '../store/TMAInitContext';
import { Status } from '../constants';

export interface LaunchScreenProps extends PropsWithChildren {
  duration?: number;
  onHide?: () => void;
}

export function LaunchScreen({
  children,
  duration = 2000,
  onHide,
}: LaunchScreenProps) {
  const startTime = useRef(Date.now());
  const { status } = use(TMAInitContext);

  useEffect(() => {
    if (status === Status.Loading) {
      return;
    }

    const delay = duration - (Date.now() - startTime.current);

    if (delay > 0) {
      setTimeout(() => {
        onHide?.();
      }, delay);
    } else {
      onHide?.();
    }
  }, [status]);

  return (
    <div
      style={{
        backgroundColor: 'black',
        zIndex: 2147483647,
        display: 'flex',
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      <div
        style={{
          transform: 'translateY(-27px)',
          display: 'flex',
          gap: '8px',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}
