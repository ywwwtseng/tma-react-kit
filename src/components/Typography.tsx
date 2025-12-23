import {
  Typography as ReactKitTypography,
  type TypographyProps as ReactKitTypographyProps,
  useI18n,
} from '@ywwwtseng/react-kit';

interface TypographyProps extends ReactKitTypographyProps {
  i18n?: string;
  params?: Record<string, string | number>;
}

export function Typography({ i18n, params, children, ...props }: TypographyProps) {
  const { t } = useI18n();

  return (
    <ReactKitTypography {...props}>{i18n ? t(i18n, params) : children}</ReactKitTypography>
  );
}
