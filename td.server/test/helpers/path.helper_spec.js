import { expect } from 'chai';
import path from 'path';

import { upDir } from '../../src/helpers/path.helper.js';

describe('helpers/path.helper.js', () => {
    it('defines upDir as a string', () => {
        expect(upDir).to.be.a('string');
    });

    it('has an OS agnostic path separator', () => {
        expect(upDir).to.contain(path.sep);
    });
});