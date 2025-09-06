import { type PropsWithChildren, useEffect, useState, useRef } from 'react';
import { useTMAStore } from '../store/TMAStoreContext';
import { Status } from '../constants';

export interface LaunchLaunchScreenProps extends PropsWithChildren {
  duration?: number;
}

export function LaunchLaunchScreen({ children, duration = 2000 }: LaunchLaunchScreenProps) {
  const startTime = useRef(Date.now());
  const { status } = useTMAStore();
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (status === Status.Loading) {
      return;
    }

    const delay = duration - (Date.now() - startTime.current);

    if (delay > 0) {
      setTimeout(() => {
        setHide(true);
      }, delay);
    } else {
      setHide(true);
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
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        opacity: hide ? 0 : 1,
        pointerEvents: hide ? 'none' : 'auto',
        transition: 'opacity 0.3s ease-in-out',
      }}>
      <div
        className="animate-fade-in"
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