export const isString = (v) => typeof v === 'string';

export const isNullish = (v) => v === null || v === undefined;

export const isObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);

export const isValidThreatModel = (model) => isObject(model) && Boolean(model.summary && isString(model.summary.title));

