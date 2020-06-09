import colors from './colors';
import zIndex, { zIndexType } from './zIndex';

const theme = {
  primaryColor: colors.WHITE_SMOKE,
};

const themes: {
  zIndex: zIndexType;
  theme: { primaryColor: string };
  deviceType?: string;
  hasRightGutter?: boolean;
} = {
  zIndex,
  theme,
};
export default themes;
