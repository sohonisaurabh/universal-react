/* eslint-disable no-underscore-dangle */
import { getTracker, setTrackerConfig } from '../helpers/initTracker';
import { trackActions } from '../helpers/trackerEvents';

describe('Utils', () => {
  it('check if tracker is intialized', () => {
    const config = getTracker();
    expect(config.instance).toBeDefined();
  });

  it('check if configurations are set to tracker', () => {
    const configObj = {
      initialConfigs: {},
      actions: [],
      callback: jest.fn(),
    };
    setTrackerConfig(configObj);

    const config = getTracker();

    expect(config).toEqual(expect.objectContaining(configObj));
  });

  it('trackActions()', () => {
    const { instance } = getTracker();
    const spy = jest.spyOn(instance, 'trackEvent');

    trackActions({ type: 'GET_DATA', data: { test: 'test' } });

    expect(spy).toHaveBeenCalledWith({ data: { test: 'test' }, type: 'GET_DATA' });
  });

  it('should throw error on trackActions() without type', () => {
    expect(() => trackActions({ data: { test: 'test' } })).toThrow();
  });
});
