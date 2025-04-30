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
    pRawUserData: false,
    threats: [],
    "isFunctionCall": false,
    "isHighFrequency": false,
    "resultsAreValidated": true
};

const actor = {
    type: 'tm.Actor',
    name: 'Actor',
    description: '',
    outOfScope: false,
    reasonOutOfScope: '',
    hasOpenThreats: false,
    providesAuthentication: false,
    threats: [],
    isTrusted: false
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
    threats: [],
    isTrusted: false,
    "hasShortTermMemory": false,
    "hasLongTermMemory": false,
    "executesGeneratedCode": false
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
    threats: [],
    isTrusted: false,
    "isSharedContext": false
};

const agent = {
    type: 'tm.Agent',
    name: 'Agent',
    description: '',
    outOfScope: false,
    reasonOutOfScope: '',
    hasOpenThreats: false,
    pQueryRewriting: false,
    pPromptTemplate: false,
    pAttachInstruction: false,
    pOutputSafetyFilter: false,
    pModifiesMemory: false,
    threats: [],
    isTrusted: false,
    "hasShortTermMemory": false,
    "hasLongTermMemory": false,
    "trustScore": 50,
    "isRogue": false
};

const tool = {
    type: 'tm.Tool',
    name: 'Tool',
    description: '',
    outOfScope: false,
    reasonOutOfScope: '',
    hasOpenThreats: false,
    pRequiresElevatedPrivileges: false,
    threats: [],
    isTrusted: false,
    "isExternal": false,
    "isDangerous": false,
    "requiresElevatedPrivileges": false
};





const text = {
    type: 'tm.Text',
    name: 'Descriptive text'
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

const propsByType = {
    'tm.Actor': actor,
    'tm.Agent': agent,
    'tm.Tool': tool,
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
    agent,
    boundary,
    boundaryBox,
    flow,
    getByType,
    store,
    text,
    tmProcess
};
