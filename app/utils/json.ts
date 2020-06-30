//@ts-ignore
import he from 'he';

/*
 * Converts html escaped strings to json
 */
export const stringToArray = (stringData: string) => {
  if (stringData) {
    try {
      const stringDecoded = he.decode(stringData);
      const stringToJson = JSON.parse(stringDecoded) || [];
      return stringToJson.constructor === Array ? stringToJson : [];
    } catch (err) {
      // Consider returning a message here that something went wrong
      return false;
    }
  }
  return false;
};

/*
 * Converts html escaped strings to object
 */
export const stringToObject = (stringData: string) => {
  if (stringData) {
    try {
      const stringDecoded = he.decode(stringData);
      const stringToJson = JSON.parse(stringDecoded) || {};
      return stringToJson !== null && typeof stringToJson === 'object' ? stringToJson : {};
    } catch (err) {
      // Consider returning a message here that something went wrong
      return false;
    }
  }
  return false;
};
