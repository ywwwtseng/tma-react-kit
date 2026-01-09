import { useEffect } from 'react';
import { useNavigate } from '@ywwwtseng/react-kit';
import { isTMA, on } from '@tma.js/bridge';
import { useTMASDK } from '../store/TMASDKContext';

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
    }
  }, [is_visible]);
}