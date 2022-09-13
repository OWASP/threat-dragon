const actor = {
    type: 'tm.Actor',
    name: 'Actor',
    description: '',
    outOfScope: false,
    reasonOutOfScope: '',
    providesAuthentication: false,
    hasOpenThreats: false,
    threats: []
};

const boundary = {
    type: 'tm.Boundary',
    name: '',
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
    protocol: '',
    isEncrypted: false,
    isPublicNetwork: false,
    hasOpenThreats: false,
    threats: []
};

const tmProcess = {
    type: 'tm.Process',
    name: 'Process',
    description: '',
    outOfScope: false,
    reasonOutOfScope: '',
    privilegeLevel: '',
    hasOpenThreats: false,
    threats: []
};

const store = {
    type: 'tm.Store',
    name: 'Store',
    description: '',
    outOfScope: false,
    reasonOutOfScope: '',
    isALog: false,
    storesCredentials: false,
    isEncrypted: false,
    isSigned: false,
    hasOpenThreats: false,
    threats: []
};

const text = {
    type: 'tm.Text',
    name: 'Arbitrary Text'
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
