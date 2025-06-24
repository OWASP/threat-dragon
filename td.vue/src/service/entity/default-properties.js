import { tc } from '@/i18n/index.js';

const actor = {
    size: {
        width: 150,
        height: 80
    },
    label: tc('threatmodel.shapes.actor'),
    shape: 'actor',
    zIndex: 0,
    data: {
        type: 'tm.Actor',
        name: 'Actor',
        description: '',
        isTrustBoundary: false,
        outOfScope: false,
        reasonOutOfScope: '',
        hasOpenThreats: false,
        providesAuthentication: false,
        threats: []
    }
};

const boundary = {
    attrs: {
        label: tc('threatmodel.shapes.trustBoundary')
    },
    shape: 'trust-boundary',
    zIndex: 10,
    data: {
        type: 'tm.Boundary',
        name: tc('threatmodel.shapes.trustBoundary'),
        description: '',
        isTrustBoundary: true,
        hasOpenThreats: false
    }
};

const boundaryBox = {
    attrs: {
        label: tc('threatmodel.shapes.trustBoundary')
    },
    shape: 'trust-boundary-box',
    zIndex: 10,
    data: {
        type: 'tm.BoundaryBox',
        name: tc('threatmodel.shapes.trustBoundary'),
        description: '',
        isTrustBoundary: true,
        hasOpenThreats: false
    }
};

const flow = {
    attrs: {
        label: tc('threatmodel.shapes.flow'),
        line: {
            strokeWidth: 1.5,
            sourceMarker: null,
            targetMarker: 'block'
        }
    },
    shape: 'flow',
    zIndex: 10,
    width: 200,
    height: 100,
    connector: 'smooth',
    data: {
        type: 'tm.Flow',
        name: tc('threatmodel.shapes.flow'),
        description: '',
        outOfScope: false,
        isTrustBoundary: false,
        reasonOutOfScope: '',
        hasOpenThreats: false,
        isBidirectional: false,
        isEncrypted: false,
        isPublicNetwork: false,
        protocol: '',
        threats: []
    }
};

const process = {
    size: {
        width: 100,
        height: 100
    },
    shape: 'process',
    zIndex: 0,
    data: {
        type: 'tm.Process',
        name: tc('threatmodel.shapes.process'),
        description: '',
        outOfScope: false,
        isTrustBoundary: false,
        reasonOutOfScope: '',
        hasOpenThreats: false,
        handlesCardPayment: false,
        handlesGoodsOrServices: false,
        isWebApplication: false,
        privilegeLevel: '',
        threats: []
    }
};

const store = {
    size: {
        width: 150,
        height: 75
    },
    attrs: {
        text: {
            text: tc('threatmodel.shapes.store'),
        },
        topLine: {
            strokeWidth: 1.5,
            strokeDasharray: null
        },
        bottomLine: {
            strokeWidth: 1.5,
            strokeDasharray: null
        }
    },
    shape: 'store',
    zIndex: 0,
    data: {
        type: 'tm.Store',
        name: tc('threatmodel.shapes.store'),
        description: '',
        outOfScope: false,
        isTrustBoundary: false,
        reasonOutOfScope: '',
        hasOpenThreats: false,
        isALog: false,
        isEncrypted: false,
        isSigned: false,
        storesCredentials: false,
        storesInventory: false,
        threats: []
    }
};

const text = {
    size: {
        width: 190,
        height: 80
    },
    shape: 'td-text-block',
    zIndex: 0,
    data: {
        type: 'tm.Text',
        name: tc('threatmodel.shapes.text'),
        hasOpenThreats: false
    }
};

const propsByType = {
    'tm.Actor': actor.data,
    'tm.Boundary': boundary.data,
    'tm.BoundaryBox': boundaryBox.data,
    'tm.Flow': flow.data,
    'tm.FlowStencil': flow.data,
    'tm.Process': process.data,
    'tm.Store': store.data,
    'tm.Text': text.data
};

const defaultData = (type) => {
    if (!Object.keys(propsByType).some(x => x === type)) {
        throw new Error(`Unknown entity: ${type}`);
    }
    return JSON.parse(JSON.stringify(propsByType[type]));
};

export default {
    defaultData
};
