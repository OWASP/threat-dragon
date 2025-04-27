export default {
    version: '2.3.0',
    summary: {
        title: 'Internet of Things (IoT) Device',
        owner: 'A development team',
        description:
            'This threat model has been provided by the OWASP Threat Model Cookbook:\nthreat-model-cookbook/Flow Diagram/iot-device',
        id: 0
    },
    detail: {
        contributors: [
            {
                name: 'development engineers'
            },
            {
                name: 'product managers'
            },
            {
                name: 'security architects'
            }
        ],
        diagrams: [
            {
                id: 0,
                title: 'IoT Device STRIDE diagram',
                diagramType: 'STRIDE',
                placeholder: 'New STRIDE diagram description',
                thumbnail: './public/content/images/thumbnail.stride.jpg',
                version: '2.3.0',
                cells: [
                    {
                        position: {
                            x: 190,
                            y: 10
                        },
                        size: {
                            width: 190,
                            height: 60
                        },
                        attrs: {
                            text: {
                                text: 'Demo threat model for an IoT Device\nprovided by the OWASP Threat Model Cookbook:\nthreat-model-cookbook/Flow Diagram/iot-device'
                            }
                        },
                        visible: true,
                        shape: 'td-text-block',
                        zIndex: 1,
                        id: 'f3ba6ded-7614-456e-b6b8-76d9f227e9de',
                        data: {
                            type: 'tm.Text',
                            name: 'Demo threat model for an IoT Device\nprovided by the OWASP Threat Model Cookbook:\nthreat-model-cookbook/Flow Diagram/iot-device',
                            hasOpenThreats: false
                        }
                    },
                    {
                        position: {
                            x: 30,
                            y: 170
                        },
                        size: {
                            width: 112.5,
                            height: 60
                        },
                        attrs: {
                            text: {
                                text: 'User'
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'actor',
                        zIndex: 2,
                        ports: {
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
                                    group: 'top',
                                    id: '85b849d0-1a60-42c0-95c7-68c7cb657cca'
                                },
                                {
                                    group: 'right',
                                    id: '7c85a09e-bc23-408b-b2ce-8771f8b94727'
                                },
                                {
                                    group: 'bottom',
                                    id: 'd25a2b7f-7c3f-4355-b23f-2df82d6b4652'
                                },
                                {
                                    group: 'left',
                                    id: 'fdfc2308-bb7e-43ac-a9db-f21f7f3ccd3f'
                                }
                            ]
                        },
                        id: '95963020-9749-4861-a73d-69252efe0607',
                        data: {
                            type: 'tm.Actor',
                            name: 'User',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            providesAuthentication: false,
                            threats: []
                        }
                    },
                    {
                        position: {
                            x: 270,
                            y: 210
                        },
                        size: {
                            width: 80,
                            height: 80
                        },
                        attrs: {
                            text: {
                                text: 'Browser'
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'process',
                        zIndex: 3,
                        ports: {
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
                                    group: 'top',
                                    id: '549318e4-376d-4873-a793-077756073bce'
                                },
                                {
                                    group: 'right',
                                    id: 'c93cbb9b-84ef-4fbc-ba75-a28d7c7cda53'
                                },
                                {
                                    group: 'bottom',
                                    id: 'ace92777-0435-4e46-9d19-cefc7a6991ef'
                                },
                                {
                                    group: 'left',
                                    id: '86591ad1-a3a9-4ba3-be23-0d95d7c6d2d0'
                                }
                            ]
                        },
                        id: 'f6a7e00e-50c6-4841-873d-e4b5ab8d3418',
                        data: {
                            type: 'tm.Process',
                            name: 'Browser',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: []
                        }
                    },
                    {
                        position: {
                            x: 55.99999999999994,
                            y: 420
                        },
                        size: {
                            width: 90,
                            height: 90
                        },
                        attrs: {
                            text: {
                                text: 'Mobile App'
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'process',
                        zIndex: 4,
                        ports: {
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
                                    group: 'top',
                                    id: '549318e4-376d-4873-a793-077756073bce'
                                },
                                {
                                    group: 'right',
                                    id: 'c93cbb9b-84ef-4fbc-ba75-a28d7c7cda53'
                                },
                                {
                                    group: 'bottom',
                                    id: 'ace92777-0435-4e46-9d19-cefc7a6991ef'
                                },
                                {
                                    group: 'left',
                                    id: '86591ad1-a3a9-4ba3-be23-0d95d7c6d2d0'
                                }
                            ]
                        },
                        id: '505cf96e-1c01-436a-902e-2bdc553f5ae8',
                        data: {
                            type: 'tm.Process',
                            name: 'Mobile App',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: []
                        }
                    },
                    {
                        position: {
                            x: 155.99999999999997,
                            y: 300
                        },
                        size: {
                            width: 90,
                            height: 90
                        },
                        attrs: {
                            text: {
                                text: 'My script'
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'process',
                        zIndex: 5,
                        ports: {
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
                                    group: 'top',
                                    id: '549318e4-376d-4873-a793-077756073bce'
                                },
                                {
                                    group: 'right',
                                    id: 'c93cbb9b-84ef-4fbc-ba75-a28d7c7cda53'
                                },
                                {
                                    group: 'bottom',
                                    id: 'ace92777-0435-4e46-9d19-cefc7a6991ef'
                                },
                                {
                                    group: 'left',
                                    id: '86591ad1-a3a9-4ba3-be23-0d95d7c6d2d0'
                                }
                            ]
                        },
                        id: '1c75b157-80ff-4371-9e70-53c2e08d2180',
                        data: {
                            type: 'tm.Process',
                            name: 'My script',
                            description: 'Python',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: []
                        }
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block'
                                },
                                sourceMarker: {
                                    name: ''
                                },
                                strokeDasharray: null
                            }
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
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
                            name: '',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: []
                        },
                        id: '1de38445-7e55-4d56-8f50-e952f2b3ebae',
                        source: {
                            cell: '95963020-9749-4861-a73d-69252efe0607',
                            port: 'd25a2b7f-7c3f-4355-b23f-2df82d6b4652'
                        },
                        target: {
                            cell: '1c75b157-80ff-4371-9e70-53c2e08d2180',
                            port: '86591ad1-a3a9-4ba3-be23-0d95d7c6d2d0'
                        },
                        vertices: [
                            {
                                x: 140,
                                y: 290
                            }
                        ]
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block'
                                },
                                sourceMarker: {
                                    name: ''
                                },
                                strokeDasharray: null
                            }
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
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
                            name: '',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: 'HTTP',
                            threats: []
                        },
                        id: 'f87ad0fe-7112-44f8-bafa-95aacf32f219',
                        source: {
                            cell: '95963020-9749-4861-a73d-69252efe0607',
                            port: '7c85a09e-bc23-408b-b2ce-8771f8b94727'
                        },
                        target: {
                            cell: 'f6a7e00e-50c6-4841-873d-e4b5ab8d3418',
                            port: '86591ad1-a3a9-4ba3-be23-0d95d7c6d2d0'
                        },
                        vertices: [
                            {
                                x: 210,
                                y: 240
                            }
                        ]
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block'
                                },
                                sourceMarker: {
                                    name: ''
                                },
                                strokeDasharray: null
                            }
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
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
                            name: '',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: []
                        },
                        id: '6c07f2c6-9950-4c05-853d-f1b13e5aff1c',
                        source: {
                            cell: '95963020-9749-4861-a73d-69252efe0607',
                            port: 'd25a2b7f-7c3f-4355-b23f-2df82d6b4652'
                        },
                        target: {
                            cell: '505cf96e-1c01-436a-902e-2bdc553f5ae8',
                            port: '549318e4-376d-4873-a793-077756073bce'
                        },
                        vertices: []
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block'
                                },
                                sourceMarker: {
                                    name: ''
                                },
                                strokeDasharray: null
                            }
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
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
                            name: 'Broadcast',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: 'UPnP',
                            threats: []
                        },
                        id: '6e7ed5e8-fa39-4f68-bac8-8c92aa929284',
                        source: {
                            cell: 'ce817f62-e1bb-4bd1-9688-d0bfc659e18c',
                            port: 'ace92777-0435-4e46-9d19-cefc7a6991ef'
                        },
                        target: {
                            cell: '505cf96e-1c01-436a-902e-2bdc553f5ae8',
                            port: 'ace92777-0435-4e46-9d19-cefc7a6991ef'
                        },
                        vertices: [
                            {
                                x: 250,
                                y: 570
                            }
                        ]
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block'
                                },
                                sourceMarker: {
                                    name: ''
                                },
                                strokeDasharray: null
                            }
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
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
                            name: 'HTTP',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: 'HTTP',
                            threats: []
                        },
                        id: '7208e01a-3bb4-4378-a89e-d0938726ec42',
                        source: {
                            cell: '1c75b157-80ff-4371-9e70-53c2e08d2180',
                            port: 'ace92777-0435-4e46-9d19-cefc7a6991ef'
                        },
                        target: {
                            cell: '784ee144-d1e0-4d67-9c90-216a6959c569',
                            port: '86591ad1-a3a9-4ba3-be23-0d95d7c6d2d0'
                        },
                        vertices: [
                            {
                                x: 255,
                                y: 400
                            }
                        ]
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block'
                                },
                                sourceMarker: {
                                    name: ''
                                },
                                strokeDasharray: null
                            }
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
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
                            name: 'HTTP',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: 'HTTP',
                            threats: []
                        },
                        id: 'f2e6fe81-c88b-4988-adbd-e075b87737a0',
                        source: {
                            cell: '505cf96e-1c01-436a-902e-2bdc553f5ae8',
                            port: 'c93cbb9b-84ef-4fbc-ba75-a28d7c7cda53'
                        },
                        target: {
                            cell: '784ee144-d1e0-4d67-9c90-216a6959c569',
                            port: '86591ad1-a3a9-4ba3-be23-0d95d7c6d2d0'
                        },
                        vertices: [
                            {
                                x: 230,
                                y: 470
                            }
                        ]
                    },
                    {
                        shape: 'trust-boundary-curve',
                        width: 200,
                        height: 100,
                        zIndex: 10,
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
                                        text: 'Internet',
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
                            type: 'tm.Boundary',
                            name: 'Internet',
                            description: '',
                            isTrustBoundary: true,
                            hasOpenThreats: false
                        },
                        id: 'ba970f89-050f-4ac8-9348-99e7ce31ef65',
                        source: {
                            x: 490,
                            y: 60
                        },
                        target: {
                            x: 430,
                            y: 630
                        },
                        vertices: [
                            {
                                x: 520,
                                y: 200
                            },
                            {
                                x: 520,
                                y: 310
                            },
                            {
                                x: 490,
                                y: 520
                            }
                        ]
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block'
                                },
                                sourceMarker: {
                                    name: ''
                                },
                                strokeDasharray: null
                            }
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
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
                            name: 'HTTPS',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: 'HTTPS',
                            threats: []
                        },
                        id: 'd4ac0618-f5f5-4403-a26e-05e1cf9b153f',
                        source: {
                            cell: 'f6a7e00e-50c6-4841-873d-e4b5ab8d3418',
                            port: 'c93cbb9b-84ef-4fbc-ba75-a28d7c7cda53'
                        },
                        target: {
                            cell: 'ed4c65fd-debe-4184-a61b-bd8811672471',
                            port: '86591ad1-a3a9-4ba3-be23-0d95d7c6d2d0'
                        },
                        vertices: []
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block'
                                },
                                sourceMarker: {
                                    name: ''
                                },
                                strokeDasharray: null
                            }
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
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
                            name: 'HTTPS',
                            description: 'Periodically send a GET request to the API',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: 'HTTPS',
                            threats: []
                        },
                        id: '0d5542d3-7cd1-466b-9977-be1bc390fa61',
                        source: {
                            cell: 'ce817f62-e1bb-4bd1-9688-d0bfc659e18c',
                            port: 'c93cbb9b-84ef-4fbc-ba75-a28d7c7cda53'
                        },
                        target: {
                            cell: 'a2f55276-c787-4145-a7f3-93bdd463638d',
                            port: '86591ad1-a3a9-4ba3-be23-0d95d7c6d2d0'
                        },
                        vertices: [
                            {
                                x: 540,
                                y: 525
                            }
                        ]
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block'
                                },
                                sourceMarker: {
                                    name: ''
                                },
                                strokeDasharray: null
                            }
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
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
                            name: 'Send command',
                            description:
                                'Periodically GET to the API and receive  a command to execute',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: []
                        },
                        id: 'a079af18-9e9b-4be2-a429-a50e5787ab5e',
                        source: {
                            cell: 'a2f55276-c787-4145-a7f3-93bdd463638d',
                            port: '549318e4-376d-4873-a793-077756073bce'
                        },
                        target: {
                            cell: 'ce817f62-e1bb-4bd1-9688-d0bfc659e18c',
                            port: 'c93cbb9b-84ef-4fbc-ba75-a28d7c7cda53'
                        },
                        vertices: [
                            {
                                x: 580,
                                y: 430
                            }
                        ]
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block'
                                },
                                sourceMarker: {
                                    name: ''
                                },
                                strokeDasharray: null
                            }
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
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
                            name: '',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: []
                        },
                        id: '5c28e977-ff20-472b-afa5-23bccce4f13e',
                        source: {
                            cell: 'a2f55276-c787-4145-a7f3-93bdd463638d',
                            port: 'c93cbb9b-84ef-4fbc-ba75-a28d7c7cda53'
                        },
                        target: {
                            cell: 'febc6c57-255e-457f-85cf-fdc3d70c1efc',
                            port: '5a3dbc84-cb3f-4307-915d-b45846c7c861'
                        },
                        vertices: []
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block'
                                },
                                sourceMarker: {
                                    name: ''
                                },
                                strokeDasharray: null
                            }
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
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
                            name: '',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: []
                        },
                        id: 'ff45cff8-394f-4703-b83c-998237997dbd',
                        source: {
                            cell: 'ed4c65fd-debe-4184-a61b-bd8811672471',
                            port: 'ace92777-0435-4e46-9d19-cefc7a6991ef'
                        },
                        target: {
                            cell: 'febc6c57-255e-457f-85cf-fdc3d70c1efc',
                            port: '3c00041a-da1d-4404-b7d0-1d1c59526f8b'
                        },
                        vertices: [
                            {
                                x: 650,
                                y: 340
                            }
                        ]
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block'
                                },
                                sourceMarker: {
                                    name: ''
                                },
                                strokeDasharray: null
                            }
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
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
                            name: '',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: []
                        },
                        id: '26bed594-da89-45a3-95e0-91dbd07db23a',
                        source: {
                            cell: 'ed4c65fd-debe-4184-a61b-bd8811672471',
                            port: 'c93cbb9b-84ef-4fbc-ba75-a28d7c7cda53'
                        },
                        target: {
                            cell: 'ccf9c030-638f-481b-8658-6b01a954f58d',
                            port: 'ace92777-0435-4e46-9d19-cefc7a6991ef'
                        },
                        vertices: [
                            {
                                x: 730,
                                y: 225
                            }
                        ]
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block'
                                },
                                sourceMarker: {
                                    name: ''
                                },
                                strokeDasharray: null
                            }
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
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
                            name: '',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: []
                        },
                        id: '0cddb1fb-0555-4a62-82a4-696c18ff5d58',
                        source: {
                            cell: 'ccf9c030-638f-481b-8658-6b01a954f58d',
                            port: '86591ad1-a3a9-4ba3-be23-0d95d7c6d2d0'
                        },
                        target: {
                            cell: '87790990-bb87-4be6-bafd-bbdd386d18cc',
                            port: 'c93cbb9b-84ef-4fbc-ba75-a28d7c7cda53'
                        },
                        vertices: []
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block'
                                },
                                sourceMarker: {
                                    name: ''
                                },
                                strokeDasharray: null
                            }
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
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
                            name: '',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: []
                        },
                        id: 'fb25103b-03ac-44db-accc-ecaeebff7cbe',
                        source: {
                            cell: 'ccf9c030-638f-481b-8658-6b01a954f58d',
                            port: 'ace92777-0435-4e46-9d19-cefc7a6991ef'
                        },
                        target: {
                            cell: 'febc6c57-255e-457f-85cf-fdc3d70c1efc',
                            port: '172d539c-f4c7-4274-b73d-d63c0e2f1743'
                        },
                        vertices: [
                            {
                                x: 817,
                                y: 250
                            }
                        ]
                    },
                    {
                        position: {
                            x: 350,
                            y: 405
                        },
                        size: {
                            width: 110,
                            height: 120
                        },
                        attrs: {
                            text: {
                                text: 'IoT Device'
                            },
                            body: {
                                stroke: 'red',
                                strokeWidth: 2.5,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'process',
                        zIndex: 11,
                        ports: {
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
                                    group: 'top',
                                    id: '549318e4-376d-4873-a793-077756073bce'
                                },
                                {
                                    group: 'right',
                                    id: 'c93cbb9b-84ef-4fbc-ba75-a28d7c7cda53'
                                },
                                {
                                    group: 'bottom',
                                    id: 'ace92777-0435-4e46-9d19-cefc7a6991ef'
                                },
                                {
                                    group: 'left',
                                    id: '86591ad1-a3a9-4ba3-be23-0d95d7c6d2d0'
                                }
                            ]
                        },
                        id: 'ce817f62-e1bb-4bd1-9688-d0bfc659e18c',
                        data: {
                            type: 'tm.Process',
                            name: 'IoT Device',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: true,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: [
                                {
                                    id: '46aaab10-d022-4719-b6f6-4fba2be9ff16',
                                    title: 'IoT configuration changed',
                                    status: 'Open',
                                    severity: 'Medium',
                                    type: 'Tampering',
                                    description:
                                        'The IoT configuration can be changed by a malicious actor',
                                    mitigation: 'The IoT configuration should be Read Only',
                                    modelType: 'STRIDE',
                                    new: false,
                                    number: 6,
                                    score: ''
                                }
                            ],
                            threatFrequency: {
                                spoofing: 0,
                                tampering: 1,
                                repudiation: 0,
                                informationDisclosure: 0,
                                denialOfService: 0,
                                elevationOfPrivilege: 0
                            }
                        }
                    },
                    {
                        position: {
                            x: 325,
                            y: 390
                        },
                        size: {
                            width: 60,
                            height: 60
                        },
                        attrs: {
                            text: {
                                text: 'Local\nAPI'
                            },
                            body: {
                                stroke: 'red',
                                strokeWidth: 2.5,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'process',
                        zIndex: 12,
                        ports: {
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
                                    group: 'top',
                                    id: '549318e4-376d-4873-a793-077756073bce'
                                },
                                {
                                    group: 'right',
                                    id: 'c93cbb9b-84ef-4fbc-ba75-a28d7c7cda53'
                                },
                                {
                                    group: 'bottom',
                                    id: 'ace92777-0435-4e46-9d19-cefc7a6991ef'
                                },
                                {
                                    group: 'left',
                                    id: '86591ad1-a3a9-4ba3-be23-0d95d7c6d2d0'
                                }
                            ]
                        },
                        id: '784ee144-d1e0-4d67-9c90-216a6959c569',
                        data: {
                            type: 'tm.Process',
                            name: 'Local\nAPI',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: true,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: [
                                {
                                    id: '5360c5a8-6c5a-4ea9-8fd4-bf4cfcae8e90',
                                    title: 'No AuthN',
                                    status: 'Open',
                                    severity: 'High',
                                    type: 'Elevation of privilege',
                                    description:
                                        'No authentication is needed to access the IoT device from the Python scripts',
                                    mitigation: 'Provide authentication for all scripting requests',
                                    modelType: 'STRIDE',
                                    new: false,
                                    number: 4,
                                    score: ''
                                },
                                {
                                    id: 'e95a7b8f-c373-4c38-a86c-0796c87131be',
                                    title: 'New STRIDE threat',
                                    status: 'Open',
                                    severity: 'TBA',
                                    type: 'Spoofing',
                                    description:
                                        'No authentication is needed to access the IoT device from the Mobile App',
                                    mitigation:
                                        'Provide authentication for all requests from the Browser',
                                    modelType: 'STRIDE',
                                    new: false,
                                    number: 5,
                                    score: ''
                                }
                            ],
                            threatFrequency: {
                                spoofing: 2,
                                tampering: 0,
                                repudiation: 0,
                                informationDisclosure: 0,
                                denialOfService: 0,
                                elevationOfPrivilege: 1
                            }
                        }
                    },
                    {
                        position: {
                            x: 340,
                            y: 80.00000000000009
                        },
                        size: {
                            width: 120,
                            height: 120
                        },
                        attrs: {
                            text: {
                                text: 'Social networks,\nWeather data,\netc'
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'process',
                        zIndex: 13,
                        ports: {
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
                                    group: 'top',
                                    id: '549318e4-376d-4873-a793-077756073bce'
                                },
                                {
                                    group: 'right',
                                    id: 'c93cbb9b-84ef-4fbc-ba75-a28d7c7cda53'
                                },
                                {
                                    group: 'bottom',
                                    id: 'ace92777-0435-4e46-9d19-cefc7a6991ef'
                                },
                                {
                                    group: 'left',
                                    id: '86591ad1-a3a9-4ba3-be23-0d95d7c6d2d0'
                                }
                            ]
                        },
                        id: '87790990-bb87-4be6-bafd-bbdd386d18cc',
                        data: {
                            type: 'tm.Process',
                            name: 'Social networks,\nWeather data,\netc',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: []
                        }
                    },
                    {
                        position: {
                            x: 590,
                            y: 190.00000000000009
                        },
                        size: {
                            width: 70,
                            height: 70
                        },
                        attrs: {
                            text: {
                                text: 'Web site'
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'process',
                        zIndex: 14,
                        ports: {
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
                                    group: 'top',
                                    id: '549318e4-376d-4873-a793-077756073bce'
                                },
                                {
                                    group: 'right',
                                    id: 'c93cbb9b-84ef-4fbc-ba75-a28d7c7cda53'
                                },
                                {
                                    group: 'bottom',
                                    id: 'ace92777-0435-4e46-9d19-cefc7a6991ef'
                                },
                                {
                                    group: 'left',
                                    id: '86591ad1-a3a9-4ba3-be23-0d95d7c6d2d0'
                                }
                            ]
                        },
                        id: 'ed4c65fd-debe-4184-a61b-bd8811672471',
                        data: {
                            type: 'tm.Process',
                            name: 'Web site',
                            description: 'PHP',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: []
                        }
                    },
                    {
                        position: {
                            x: 712,
                            y: 345
                        },
                        size: {
                            width: 120,
                            height: 60
                        },
                        attrs: {
                            text: {
                                text: 'MySQL\ndatabase'
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
                        visible: true,
                        shape: 'store',
                        zIndex: 15,
                        ports: {
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
                                    group: 'top',
                                    id: '172d539c-f4c7-4274-b73d-d63c0e2f1743'
                                },
                                {
                                    group: 'right',
                                    id: '7c9b0899-4fa0-4b0e-80cd-df9c3b66654e'
                                },
                                {
                                    group: 'bottom',
                                    id: '5a3dbc84-cb3f-4307-915d-b45846c7c861'
                                },
                                {
                                    group: 'left',
                                    id: '3c00041a-da1d-4404-b7d0-1d1c59526f8b'
                                }
                            ]
                        },
                        id: 'febc6c57-255e-457f-85cf-fdc3d70c1efc',
                        data: {
                            type: 'tm.Store',
                            name: 'MySQL\ndatabase',
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
                        }
                    },
                    {
                        position: {
                            x: 620,
                            y: 490
                        },
                        size: {
                            width: 70,
                            height: 70
                        },
                        attrs: {
                            text: {
                                text: 'Cloud\nAPI'
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'process',
                        zIndex: 16,
                        ports: {
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
                                    group: 'top',
                                    id: '549318e4-376d-4873-a793-077756073bce'
                                },
                                {
                                    group: 'right',
                                    id: 'c93cbb9b-84ef-4fbc-ba75-a28d7c7cda53'
                                },
                                {
                                    group: 'bottom',
                                    id: 'ace92777-0435-4e46-9d19-cefc7a6991ef'
                                },
                                {
                                    group: 'left',
                                    id: '86591ad1-a3a9-4ba3-be23-0d95d7c6d2d0'
                                }
                            ]
                        },
                        id: 'a2f55276-c787-4145-a7f3-93bdd463638d',
                        data: {
                            type: 'tm.Process',
                            name: 'Cloud\nAPI',
                            description: 'Node.js',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: [
                                {
                                    id: '67ce297f-083b-426b-b909-82e281b9c12d',
                                    title: 'SQL injection',
                                    status: 'Mitigated',
                                    severity: 'Medium',
                                    type: 'Tampering',
                                    description: 'Malicious SQL queries',
                                    mitigation:
                                        'Utilization of proper framework ORM (Object-Relational Mapping)',
                                    modelType: 'STRIDE',
                                    new: false,
                                    number: 7,
                                    score: ''
                                }
                            ],
                            threatFrequency: {
                                spoofing: 0,
                                tampering: 1,
                                repudiation: 0,
                                informationDisclosure: 0,
                                denialOfService: 0,
                                elevationOfPrivilege: 0
                            }
                        }
                    },
                    {
                        position: {
                            x: 742,
                            y: 60
                        },
                        size: {
                            width: 90,
                            height: 100
                        },
                        attrs: {
                            text: {
                                text: 'Cloud\nintegration'
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'process',
                        zIndex: 17,
                        ports: {
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
                                    group: 'top',
                                    id: '549318e4-376d-4873-a793-077756073bce'
                                },
                                {
                                    group: 'right',
                                    id: 'c93cbb9b-84ef-4fbc-ba75-a28d7c7cda53'
                                },
                                {
                                    group: 'bottom',
                                    id: 'ace92777-0435-4e46-9d19-cefc7a6991ef'
                                },
                                {
                                    group: 'left',
                                    id: '86591ad1-a3a9-4ba3-be23-0d95d7c6d2d0'
                                }
                            ]
                        },
                        id: 'ccf9c030-638f-481b-8658-6b01a954f58d',
                        data: {
                            type: 'tm.Process',
                            name: 'Cloud\nintegration',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: []
                        }
                    }
                ]
            }
        ],
        diagramTop: 0,
        reviewer: 'A security architect',
        threatTop: 7
    }
};
