import { expect } from 'chai';
import path from 'path';

import expressHelper from '../../src/helpers/express.helper.js';

describe('helpers/express.helper.js', () => {
    it('returns an express instance', () => {
        expect(expressHelper.getInstance()).not.to.be.undefined;
    });

    it('returns the favicon middleware', () => {
        expect(expressHelper.getFaviconMiddleware(path.join(__dirname, `..${path.sep}`, 'public', 'favicon.ico'))).not.to.be.undefined;
    });
});
