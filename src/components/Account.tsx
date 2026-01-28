import { Canvas } from '@ywwwtseng/react-kit';
import { useTMASDK } from '../providers/TMASDKProvider';

export function Avatar({
  style,
  size = 40,
}: {
  style?: React.CSSProperties;
  size?: number;
}) {
  const { avatar, user } = useTMASDK();

  if (avatar) {
    return (
      <Canvas
        className="animate-fade-in flex items-center justify-center border border-border rounded-full"
        image={avatar}
        size={size}
        style={style}
      />
    );
  }

  return (
    <div
      className="animate-fade-in flex items-center justify-center border border-border rounded-full"
      style={{
        width: size,
        height: size,
        ...style,
      }}
    >
      <span className="text-lg font-semibold">
        {user?.first_name?.[0] || ''}
      </span>
    </div>
  );
}

export const Account = {
  Avatar,
};
