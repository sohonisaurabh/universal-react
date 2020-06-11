/**
 * Cacheable Services List
 * (note: to remain in the object-in-array format for adding further config options)
 *
 * Example configuration:
 * {
 *    url: '/test/example',
 *    ...future configs (like individual timeout etc.)
 * }
 */

type CachaableServiceType = {
  url: string;
};
const CachableServices: Array<CachaableServiceType> = [];

export default CachableServices;
