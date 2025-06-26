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
        name: tc('threatmodel.shapes.actor'),
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
        line: {
            stroke: '#333333',
            strokeWidth: 1.5,
            targetMarker: {
                name: 'block'
            },
            sourceMarker: {
                name: ''
            },
            strokeDasharray: null
        }
    },
    shape: 'flow',
    width: 200,
    height: 100,
    labels: [
	  {
	    markup: [
	      {
	        tagName: 'ellipse',
	        selector: 'labelBody'
	      },
	      {
	        tagName: 'text',
	        selector: 'labelText'
	      }
	    ],
	    attrs: {
	      labelText: {
	        text: '',
	        textAnchor: 'middle',
	        textVerticalAnchor: 'middle'
	      },
	      labelBody: {
	        ref: 'labelText',
	        refRx: '50%',
	        refRy: '60%',
	        fill: '#fff',
	        strokeWidth: 0
	      }
	    },
	    position: {
	      distance: 0.5,
	      args: {
	        keepGradient: true,
	        ensureLegibility: true
	      }
	    }
	  }
    ],

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
    },
    source: {cell: '', port: ''},
    target: {cell: '', port: ''},
    vertices: []
};

const process = {
    size: {
        width: 100,
        height: 100
    },
    attrs: {
        text: {
            text: tc('threatmodel.shapes.process'),
        },
        body: {
            stroke: '#333333',
            strokeWidth: 1.5,
            strokeDasharray: null
        }
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
    'tm.Actor': actor,
    'tm.Boundary': boundary,
    'tm.BoundaryBox': boundaryBox,
    'tm.Flow': flow,
    'tm.FlowStencil': flow,
    'tm.Process': process,
    'tm.Store': store,
    'tm.Text': text
};

const defaultData = (type) => {
    if (!Object.keys(propsByType).some(x => x === type)) {
        throw new Error(`Unknown entity: ${type}`);
    }
    return JSON.parse(JSON.stringify(propsByType[type].data));
};

const defaultEntity = (type) => {
    if (!Object.keys(propsByType).some(x => x === type)) {
        throw new Error(`Unknown entity: ${type}`);
    }
    return JSON.parse(JSON.stringify(propsByType[type]));
};

export default {
    defaultData,
    defaultEntity
};
