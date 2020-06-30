import colors from './colors';
import zIndex, { zIndexType } from './zIndex';

export interface ThemeType {
  zIndex: zIndexType;
  theme: { primaryColor: string };
  deviceType?: string;
  hasRightGutter?: boolean;
  primaryFontFamily?: string;
  baseFontSize?: string;
  letterSpacing?: string;
  fontNormal?: string;
  successColor?: string;
  secondary_textColor?: string;
}

const theme = {
  primaryColor: colors.WHITE_SMOKE,
};

const themes: ThemeType = {
  zIndex,
  theme,
};
export default themes;
