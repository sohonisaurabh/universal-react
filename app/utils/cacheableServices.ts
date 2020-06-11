import cacheableServices from './servicesCache.config';

export const CACHEABLE_SERVICES_LIST = cacheableServices.map(service => service.url);
