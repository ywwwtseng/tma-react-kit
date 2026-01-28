import { useEffect } from 'react';
import { useNavigate } from '@ywwwtseng/react-kit';
import { isTMA, on } from '@tma.js/bridge';
import { useTMASDK } from '../providers/TMASDKProvider';

export function useBackButton(is_visible: boolean) {
  const navigate = useNavigate();
  const { setupBackButton } = useTMASDK();

  useEffect(() => {
    if (isTMA()) {
      setupBackButton(is_visible);

      const off = on('back_button_pressed', () => {
        navigate(-1);
      });

      return () => {
        off();
      };
    } else {
      if (typeof window !== 'undefined') {
        (window as any).navigate = navigate;
      }
    }
  }, [is_visible]);
}