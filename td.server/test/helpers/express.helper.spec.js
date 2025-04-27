import { expect } from 'chai';
import path from 'path';
const _path = path;

import expressHelper from '../../src/helpers/express.helper.js';

describe('helpers/express.helper.js', () => {
    it('returns an express instance', () => {
        expect(expressHelper.getInstance()).not.to.be.undefined;
    });
});
