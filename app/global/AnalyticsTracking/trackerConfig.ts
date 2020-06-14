import { DEFAULT_SITE_SECTION } from './constants';

interface nextJSProcess extends NodeJS.Process {
  browser: boolean;
}

const trackingConfig = () => ({
  page_url: (process as nextJSProcess).browser ? window.location.href : '',
  site_section: DEFAULT_SITE_SECTION,
});

export default trackingConfig;
