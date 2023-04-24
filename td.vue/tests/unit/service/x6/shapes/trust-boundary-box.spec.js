import trustBoundaryBox from '@/service/x6/shapes/trust-boundary-box.js';

describe('service/x6/shapes/trust-boundary-box.js', () => {
  let victim;

  beforeEach(() => {
    victim = new trustBoundaryBox.TrustBoundaryBox();
    victim.setAttrByPath = jest.fn();
    victim.getAttrByPath = jest.fn();
  });

  it('can create the object', () => {
    expect(victim.constructor.name).toEqual('TrustBoundaryBox');
  });

  describe('setName', () => {
    it('sets the name', () => {
      const name = 'tbbName';
      victim.setName(name);
      expect(victim.setAttrByPath).toHaveBeenCalledWith('headerText/text', name);
    });
  });

  describe('getLabel', () => {
    it('gets the label', () => {
      victim.getLabel();
      expect(victim.getAttrByPath).toHaveBeenCalledWith('headerText/text');
    });
  });

  describe('setLabel', () => {
    it('sets the label', () => {
      const name = 'tbbName';
      victim.setLabel(name);
      expect(victim.setAttrByPath).toHaveBeenCalledWith('headerText/text', name);
    });
  });

  describe('updateStyle', () => {
    it('is a function', () => {
      expect(typeof victim.updateStyle).toEqual('function');
    });

    it('does not throw an error', () => {
      expect(() => victim.updateStyle()).not.toThrow();
    });
  });
});
