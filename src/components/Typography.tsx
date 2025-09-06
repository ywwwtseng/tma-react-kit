import { Typography as ReactKitTypography, type TypographyProps as ReactKitTypographyProps } from '@ywwwtseng/react-kit';
import { useTMAI18n } from '../store/TMAI18nContext';

interface TypographyProps extends ReactKitTypographyProps {
  i18n?: string;
  params?: Record<string, string | number>;
}

export function Typography({ i18n, params, children, ...props }: TypographyProps) {
  const { t } = useTMAI18n();

  return (
    <ReactKitTypography {...props}>{i18n ? t(i18n, params) : children}</ReactKitTypography>
  );
}
