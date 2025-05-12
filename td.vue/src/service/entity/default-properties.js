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
    "hasUserPrompt": false,
    "mayContainMedia": false,
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
    "isLongTermAgentMemory": false
};

const agent = {
    type: 'tm.Agent',
    name: 'Agent',
    description: '',
    outOfScope: false,
    reasonOutOfScope: '',
    hasOpenThreats: false,
    threats: [],
    isTrusted: false,
    "hasConstraints": false,
    "hasLogging": false,
    "hasDynamicAdminPrivileges": false,
    "hasMultiDomainAccess": false,
    "canBeRegisteredByUser": false,
    "inheritsPrivileges": false,
    "usesAuth": false,
    "usesBehavioralAuth": false,
};

const tool = {
    type: 'tm.Tool',
    name: 'Tool',
    description: '',
    outOfScope: false,
    reasonOutOfScope: '',
    hasOpenThreats: false,
    threats: [],
    isTrusted: false,
    "isDangerous": false,
    "isApi": false,
    "usingParameters": false,
    "isAutomated": false,
    "requiresAdmin": false,
    "isResourceIntensive": false,
    "hasQuota": false,
    "executesAgentGeneratedCode":  false,
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
