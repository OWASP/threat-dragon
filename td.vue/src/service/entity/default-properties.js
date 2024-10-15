const actor = {
    type: 'tm.Actor',
    name: 'Actor',
    description: '',
    outOfScope: false,
    reasonOutOfScope: '',
    hasOpenThreats: false,
    providesAuthentication: false,
    threats: []
};

const boundary = {
    type: 'tm.Boundary',
    name: 'Trust Boundary',
    description: '',
    isTrustBoundary: true
};

const boundaryBox = {
    type: 'tm.BoundaryBox',
    name: 'Trust Boundary',
    description: '',
    isTrustBoundary: true
};

const flow = {
    type: 'tm.Flow',
    name: 'Data Flow',
    description: '',
    outOfScope: false,
    reasonOutOfScope: '',
    hasOpenThreats: false,
    isBidirectional: false,
    isEncrypted: false,
    isPublicNetwork: false,
    protocol: '',
    threats: []
};

const tmProcess = {
    type: 'tm.Process',
    name: 'Process',
    description: '',
    outOfScope: false,
    reasonOutOfScope: '',
    hasOpenThreats: false,
    handlesCardPayment: false,
    handlesGoodsOrServices: false,
    isWebApplication: false,
    privilegeLevel: '',
    threats: []
};

const store = {
    type: 'tm.Store',
    name: 'Store',
    description: '',
    outOfScope: false,
    reasonOutOfScope: '',
    hasOpenThreats: false,
    isALog: false,
    isEncrypted: false,
    isSigned: false,
    storesCredentials: false,
    storesInventory: false,
    threats: []
};

const text = {
    type: 'tm.Text',
    name: 'Descriptive text'
};

const propsByType = {
    'tm.Actor': actor,
    'tm.Boundary': boundary,
    'tm.BoundaryBox': boundaryBox,
    'tm.Flow': flow,
    'tm.FlowStencil': flow,
    'tm.Process': tmProcess,
    'tm.Store': store,
    'tm.Text': text
};

const getByType = (type) => {
    if (!Object.keys(propsByType).some(x => x === type)) {
        throw new Error(`Unknown entity: ${type}`);
    }
    return propsByType[type];
};

export default {
    actor,
    boundary,
    boundaryBox,
    flow,
    getByType,
    store,
    text,
    tmProcess
};
