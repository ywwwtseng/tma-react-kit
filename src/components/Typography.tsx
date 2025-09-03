import * as ReactKit from '@ywwwtseng/react-kit';
import { useTMAI18n } from '../store/TMAI18nContext';

interface TypographyProps extends ReactKit.TypographyProps {
  i18n?: string;
  params?: Record<string, string | number>;
}

export function Typography({ i18n, params, children, ...props }: TypographyProps) {
  const { t } = useTMAI18n();

  return (
    <ReactKit.Typography {...props}>{i18n ? t(i18n, params) : children}</ReactKit.Typography>
  );
}
