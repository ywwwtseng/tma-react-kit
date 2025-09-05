import { useEffect, useRef } from 'react';
import { useTMASDK } from '../store/TMASDKContext';

export function Avatar({ style, size = 40 }: {
  style?: React.CSSProperties;
  size?: number;
}) {
  const { avatar } = useTMASDK();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (avatar) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(avatar, 0, 0, size, size);
        }
      }
    }
  }, [avatar, size]);

  return (
    <canvas
      className="animation-fade-in"
      ref={canvasRef}
      style={{
        borderRadius: '100%',
        border: '1px solid #1F1F1F',
        ...style,
      }}
      width={size}
      height={size}
    />
  );
}

export const Account = {
  Avatar,
};
