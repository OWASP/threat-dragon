export default {
    version: '2.3.0',
    summary: {
        title: 'Online Payments Processing Platform',
        owner: 'A development team',
        description:
            'This threat model has been provided by the OWASP Threat Model Cookbook:\nthreat-model-cookbook/Flow Diagram/payment',
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
                title: 'Payment',
                diagramType: 'STRIDE',
                placeholder: 'New STRIDE diagram description',
                thumbnail: './public/content/images/thumbnail.stride.jpg',
                version: '2.3.0',
                cells: [
                    {
                        position: {
                            x: 360,
                            y: 325.0000000000001
                        },
                        size: {
                            width: 310,
                            height: 200
                        },
                        attrs: {
                            label: {
                                text: 'Customer /\nInternet'
                            }
                        },
                        visible: true,
                        shape: 'trust-boundary-box',
                        zIndex: -1,
                        id: '347f80ba-5755-47a5-9a1b-295fe75552b2',
                        data: {
                            type: 'tm.BoundaryBox',
                            name: 'Customer /\nInternet',
                            description: '',
                            isTrustBoundary: true,
                            hasOpenThreats: false
                        }
                    },
                    {
                        position: {
                            x: 20,
                            y: 620.0000000000045
                        },
                        size: {
                            width: 220,
                            height: 210
                        },
                        attrs: {
                            label: {
                                text: 'Merchant / Web'
                            }
                        },
                        visible: true,
                        shape: 'trust-boundary-box',
                        zIndex: -1,
                        id: 'd50ff0be-15cd-4ddb-80b3-37e06d71fcf2',
                        data: {
                            type: 'tm.BoundaryBox',
                            description: '',
                            isTrustBoundary: true,
                            hasOpenThreats: false,
                            name: 'Merchant / Web'
                        }
                    },
                    {
                        position: {
                            x: 670,
                            y: 680.0000000000048
                        },
                        size: {
                            width: 380,
                            height: 410
                        },
                        attrs: {
                            label: {
                                text: 'Stripe /\nWeb'
                            }
                        },
                        visible: true,
                        shape: 'trust-boundary-box',
                        zIndex: -1,
                        id: '4991548a-366e-4c45-87fc-487056f4379d',
                        data: {
                            type: 'tm.BoundaryBox',
                            name: 'Stripe /\nWeb',
                            description: '',
                            isTrustBoundary: true,
                            hasOpenThreats: false
                        }
                    },
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
                                text: 'Demo threat model for an online Payments Processing Platform\nprovided by the OWASP Threat Model Cookbook:\nthreat-model-cookbook/Flow Diagram/payment'
                            }
                        },
                        visible: true,
                        shape: 'td-text-block',
                        zIndex: 1,
                        id: 'f3ba6ded-7614-456e-b6b8-76d9f227e9de',
                        data: {
                            type: 'tm.Text',
                            name: 'Demo threat model for an online Payments Processing Platform\nprovided by the OWASP Threat Model Cookbook:\nthreat-model-cookbook/Flow Diagram/payment',
                            hasOpenThreats: false
                        }
                    },
                    {
                        position: {
                            x: 450,
                            y: 120
                        },
                        size: {
                            width: 130,
                            height: 60
                        },
                        attrs: {
                            text: {
                                text: 'Customer'
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
                                    id: 'd4f8b5d0-9d31-4bed-b945-a7e952eebf11'
                                },
                                {
                                    group: 'right',
                                    id: 'b0aaf075-ddb0-44c1-ae3c-8291734212c0'
                                },
                                {
                                    group: 'bottom',
                                    id: '5e2a440a-ee9d-47d6-a90a-69f9d6a2dada'
                                },
                                {
                                    group: 'left',
                                    id: 'c24543e9-80ee-4b6c-90b7-ef373b64b581'
                                }
                            ]
                        },
                        id: 'a10e3c57-dad4-4914-b702-a43d9bf13956',
                        data: {
                            type: 'tm.Actor',
                            name: 'Customer',
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
                            x: 450,
                            y: 375.0000000000001
                        },
                        size: {
                            width: 140,
                            height: 130
                        },
                        attrs: {
                            text: {
                                text: 'Customer Client'
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
                                    id: '74889663-70bf-4946-a4a2-833c19a536b5'
                                },
                                {
                                    group: 'right',
                                    id: '72e4da2f-9e3f-4c12-91ba-c33c542f492f'
                                },
                                {
                                    group: 'bottom',
                                    id: '4a561378-4f29-458f-b347-982d3b288912'
                                },
                                {
                                    group: 'left',
                                    id: '65b37177-809a-438d-844d-ab14c573e744'
                                }
                            ]
                        },
                        id: '313655e5-4832-4424-b13c-7a3618543737',
                        data: {
                            type: 'tm.Process',
                            name: 'Customer Client',
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
                                        text: '(1) Customer logs into\nthe merchant site',
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
                            name: '(1) Customer logs into\nthe merchant site',
                            description: 'OAuth',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: 'HTTPS',
                            threats: []
                        },
                        id: 'bd50f8ec-ce5d-477d-84e9-f50d1ebe4bc4',
                        source: {
                            cell: 'a10e3c57-dad4-4914-b702-a43d9bf13956',
                            port: 'c24543e9-80ee-4b6c-90b7-ef373b64b581'
                        },
                        target: {
                            cell: '313655e5-4832-4424-b13c-7a3618543737',
                            port: '65b37177-809a-438d-844d-ab14c573e744'
                        },
                        vertices: [
                            {
                                x: 250,
                                y: 210
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
                                        text: '(2) Customer proceeds to payment page\nto make a purchase',
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
                            name: '(2) Customer proceeds to payment page\nto make a purchase',
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
                        id: 'bed188fc-babc-4061-a122-dd2270adf37d',
                        source: {
                            cell: 'a10e3c57-dad4-4914-b702-a43d9bf13956',
                            port: '5e2a440a-ee9d-47d6-a90a-69f9d6a2dada'
                        },
                        target: {
                            cell: '313655e5-4832-4424-b13c-7a3618543737',
                            port: '74889663-70bf-4946-a4a2-833c19a536b5'
                        },
                        vertices: [
                            {
                                x: 490,
                                y: 230
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
                                        text: '(7) Customer provides card details\nand finalizes payment',
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
                            name: '(7) Customer provides card details\nand finalizes payment',
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
                        id: 'f01e4de9-a79b-460d-84dc-9e929e14946d',
                        source: {
                            cell: 'a10e3c57-dad4-4914-b702-a43d9bf13956',
                            port: 'b0aaf075-ddb0-44c1-ae3c-8291734212c0'
                        },
                        target: {
                            cell: '313655e5-4832-4424-b13c-7a3618543737',
                            port: '72e4da2f-9e3f-4c12-91ba-c33c542f492f'
                        },
                        vertices: [
                            {
                                x: 780,
                                y: 200
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
                                    name: 'block'
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
                                        text: '(3) Customer Client sends order intent\nincluding order amount\n(6) Return PaymentIntent to\nthe Customer Client',
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
                            name: '(3) Customer Client sends order intent\nincluding order amount\n(6) Return PaymentIntent to\nthe Customer Client',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: true,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: []
                        },
                        id: '48fa6630-5cd9-40e8-8f64-4cd134682065',
                        source: {
                            cell: '313655e5-4832-4424-b13c-7a3618543737',
                            port: '65b37177-809a-438d-844d-ab14c573e744'
                        },
                        target: {
                            cell: '9a109a12-5616-4a78-b268-96e2cf68e9b3',
                            port: '74889663-70bf-4946-a4a2-833c19a536b5'
                        },
                        vertices: [
                            {
                                x: 210,
                                y: 510
                            },
                            {
                                x: 140,
                                y: 550
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
                                        text: '(9) Attempt payment',
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
                            name: '(9) Attempt payment',
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
                        id: '6e2c1f8e-4f6f-44a7-9303-549d9329dbb6',
                        source: {
                            cell: '43b2bb57-8d50-479f-abf3-c9addd9aa295',
                            port: '65b37177-809a-438d-844d-ab14c573e744'
                        },
                        target: {
                            cell: '91a72b16-b05b-463a-b0c6-62fa2dd0f72b',
                            port: '65b37177-809a-438d-844d-ab14c573e744'
                        },
                        vertices: [
                            {
                                x: 740,
                                y: 900
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
                                        text: '(10) Payment Response',
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
                            name: '(10) Payment Response',
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
                        id: '9e576812-499d-407c-bf1e-114505d4bd77',
                        source: {
                            cell: '91a72b16-b05b-463a-b0c6-62fa2dd0f72b',
                            port: '72e4da2f-9e3f-4c12-91ba-c33c542f492f'
                        },
                        target: {
                            cell: '43b2bb57-8d50-479f-abf3-c9addd9aa295',
                            port: '72e4da2f-9e3f-4c12-91ba-c33c542f492f'
                        },
                        vertices: [
                            {
                                x: 920,
                                y: 880
                            },
                            {
                                x: 920,
                                y: 850
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
                                        text: '(11) Return the PaymentIntent\nwith status',
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
                            name: '(11) Return the PaymentIntent\nwith status',
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
                        id: '93d0c80f-02f1-4260-b498-e99d2cd200a9',
                        source: {
                            cell: '43b2bb57-8d50-479f-abf3-c9addd9aa295',
                            port: '74889663-70bf-4946-a4a2-833c19a536b5'
                        },
                        target: {
                            cell: '313655e5-4832-4424-b13c-7a3618543737',
                            port: '72e4da2f-9e3f-4c12-91ba-c33c542f492f'
                        },
                        vertices: [
                            {
                                x: 840,
                                y: 510
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
                                        text: '(8) Customer Client send Stripe\ne.ConfirmCardPayment()',
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
                            name: '(8) Customer Client send Stripe\ne.ConfirmCardPayment()',
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
                        id: '2ccf113d-6dfb-4dca-9f2c-1fcfa321decf',
                        source: {
                            cell: '313655e5-4832-4424-b13c-7a3618543737',
                            port: '4a561378-4f29-458f-b347-982d3b288912'
                        },
                        target: {
                            cell: '43b2bb57-8d50-479f-abf3-c9addd9aa295',
                            port: '65b37177-809a-438d-844d-ab14c573e744'
                        },
                        vertices: [
                            {
                                x: 560,
                                y: 560
                            }
                        ],
                        tools: {
                            items: [
                                'boundary',
                                'button-remove',
                                'vertices',
                                'source-arrowhead',
                                'target-arrowhead'
                            ],
                            name: null
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
                                        text: '(5) Return PaymentIntent\nto the Merchant',
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
                            name: '(5) Return PaymentIntent\nto the Merchant',
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
                        id: '3c3b4416-5b07-4b94-b73d-52f38137d29b',
                        source: {
                            cell: '43b2bb57-8d50-479f-abf3-c9addd9aa295',
                            port: '65b37177-809a-438d-844d-ab14c573e744'
                        },
                        target: {
                            cell: '9a109a12-5616-4a78-b268-96e2cf68e9b3',
                            port: '72e4da2f-9e3f-4c12-91ba-c33c542f492f'
                        },
                        vertices: [
                            {
                                x: 400,
                                y: 830
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
                                        text: '(4) Merchant sends order information\ninc amount and currency',
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
                            name: '(4) Merchant sends order information\ninc amount and currency',
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
                        id: 'bf0e4da4-150b-4f1a-b59d-3e82c7b03e91',
                        source: {
                            cell: '9a109a12-5616-4a78-b268-96e2cf68e9b3',
                            port: '72e4da2f-9e3f-4c12-91ba-c33c542f492f'
                        },
                        target: {
                            cell: '43b2bb57-8d50-479f-abf3-c9addd9aa295',
                            port: '65b37177-809a-438d-844d-ab14c573e744'
                        },
                        vertices: [
                            {
                                x: 330,
                                y: 690
                            },
                            {
                                x: 560,
                                y: 730
                            }
                        ]
                    },
                    {
                        position: {
                            x: 65,
                            y: 670.0000000000048
                        },
                        size: {
                            width: 130,
                            height: 130
                        },
                        attrs: {
                            text: {
                                text: 'Merchant\nWeb Server'
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
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
                                    id: '74889663-70bf-4946-a4a2-833c19a536b5'
                                },
                                {
                                    group: 'right',
                                    id: '72e4da2f-9e3f-4c12-91ba-c33c542f492f'
                                },
                                {
                                    group: 'bottom',
                                    id: '4a561378-4f29-458f-b347-982d3b288912'
                                },
                                {
                                    group: 'left',
                                    id: '65b37177-809a-438d-844d-ab14c573e744'
                                }
                            ]
                        },
                        id: '9a109a12-5616-4a78-b268-96e2cf68e9b3',
                        data: {
                            type: 'tm.Process',
                            name: 'Merchant\nWeb Server',
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
                            x: 780,
                            y: 720.0000000000045
                        },
                        size: {
                            width: 120,
                            height: 120
                        },
                        attrs: {
                            text: {
                                text: 'Stripe API service'
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
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
                                    id: '74889663-70bf-4946-a4a2-833c19a536b5'
                                },
                                {
                                    group: 'right',
                                    id: '72e4da2f-9e3f-4c12-91ba-c33c542f492f'
                                },
                                {
                                    group: 'bottom',
                                    id: '4a561378-4f29-458f-b347-982d3b288912'
                                },
                                {
                                    group: 'left',
                                    id: '65b37177-809a-438d-844d-ab14c573e744'
                                }
                            ]
                        },
                        id: '43b2bb57-8d50-479f-abf3-c9addd9aa295',
                        data: {
                            type: 'tm.Process',
                            name: 'Stripe API service',
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
                            x: 770,
                            y: 920
                        },
                        size: {
                            width: 130,
                            height: 130
                        },
                        attrs: {
                            text: {
                                text: 'Stripe\nPayment Service'
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
                                    id: '74889663-70bf-4946-a4a2-833c19a536b5'
                                },
                                {
                                    group: 'right',
                                    id: '72e4da2f-9e3f-4c12-91ba-c33c542f492f'
                                },
                                {
                                    group: 'bottom',
                                    id: '4a561378-4f29-458f-b347-982d3b288912'
                                },
                                {
                                    group: 'left',
                                    id: '65b37177-809a-438d-844d-ab14c573e744'
                                }
                            ]
                        },
                        id: '91a72b16-b05b-463a-b0c6-62fa2dd0f72b',
                        data: {
                            type: 'tm.Process',
                            name: 'Stripe\nPayment Service',
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
        threatTop: 0
    }
};
