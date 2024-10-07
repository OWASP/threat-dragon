import { Graph } from '@antv/x6';

export const ports = {
    groups: {
        top: {
            position: 'top',
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#5F95FF',
                    strokeWidth: 1,
                    fill: '#fff',
                    style: {
                        visibility: 'hidden'
                    }
                }
            }
        },
        right: {
            position: 'right',
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#5F95FF',
                    strokeWidth: 1,
                    fill: '#fff',
                    style: {
                        visibility: 'hidden'
                    }
                }
            }
        },
        bottom: {
            position: 'bottom',
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#5F95FF',
                    strokeWidth: 1,
                    fill: '#fff',
                    style: {
                        visibility: 'hidden'
                    }
                }
            }
        },
        left: {
            position: 'left',
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#5F95FF',
                    strokeWidth: 1,
                    fill: '#fff',
                    style: {
                        visibility: 'hidden'
                    }
                }
            }
        }
    },
    items: [
        {
            group: 'top'
        },
        {
            group: 'right'
        },
        {
            group: 'bottom'
        },
        {
            group: 'left'
        }
    ]
};

Graph.registerNode(
    'customRect',
    {
        inherit: 'rect',
        width: 66,
        height: 36,
        attrs: {
            body: {
                strokeWidth: 1,
                stroke: '#5F95FF',
                fill: '#EFF4FF'
            },
            text: {
                fontSize: 12,
                fill: '#262626'
            }
        },
        ports: { ...ports }
    },
    true
);
