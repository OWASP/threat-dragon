export default {
    version: '2.3.0',
    summary: {
        title: 'Online Battle Royale Games',
        owner: 'A development team',
        description:
            'This threat model has been provided by the OWASP Threat Model Cookbook:\nthreat-model-cookbook/Flow Diagram/online-battleroyale-game',
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
                title: 'Battle Royale',
                diagramType: 'STRIDE',
                placeholder: 'New STRIDE diagram description',
                thumbnail: './public/content/images/thumbnail.stride.jpg',
                version: '2.3.0',
                cells: [
                    {
                        position: {
                            x: 99.99999999999892,
                            y: 100.00000000000125
                        },
                        size: {
                            width: 580,
                            height: 360
                        },
                        attrs: {
                            label: {
                                text: "Player's local machine"
                            }
                        },
                        visible: true,
                        shape: 'trust-boundary-box',
                        zIndex: -1,
                        id: '2b5a68fd-42be-49f5-b987-e6479a00c4a8',
                        data: {
                            type: 'tm.BoundaryBox',
                            name: "Player's local machine",
                            description: '',
                            isTrustBoundary: true,
                            hasOpenThreats: false
                        }
                    },
                    {
                        position: {
                            x: 99.99999999999818,
                            y: 658.0000000000035
                        },
                        size: {
                            width: 690,
                            height: 520
                        },
                        attrs: {
                            label: {
                                text: 'Production network'
                            }
                        },
                        visible: true,
                        shape: 'trust-boundary-box',
                        zIndex: -1,
                        id: '539a7d02-c5c3-4a1d-9dd8-e0fff7c034aa',
                        data: {
                            type: 'tm.BoundaryBox',
                            name: 'Production network',
                            description: '',
                            isTrustBoundary: true,
                            hasOpenThreats: false
                        }
                    },
                    {
                        position: {
                            x: 905,
                            y: 658.0000000000036
                        },
                        size: {
                            width: 250,
                            height: 250
                        },
                        attrs: {
                            label: {
                                text: 'Corp network'
                            }
                        },
                        visible: true,
                        shape: 'trust-boundary-box',
                        zIndex: -1,
                        id: '238818b4-5437-4af9-8abc-24e7de68def9',
                        data: {
                            type: 'tm.BoundaryBox',
                            name: 'Corp network',
                            description: '',
                            isTrustBoundary: true,
                            hasOpenThreats: false
                        },
                        tools: {
                            items: ['boundary', 'button-remove'],
                            name: null
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
                                text: 'Demo threat model for the online Battle Royale Games\nprovided by the OWASP Threat Model Cookbook:\nthreat-model-cookbook/Flow Diagram/online-battleroyale-game'
                            }
                        },
                        visible: true,
                        shape: 'td-text-block',
                        zIndex: 1,
                        id: 'f3ba6ded-7614-456e-b6b8-76d9f227e9de',
                        data: {
                            type: 'tm.Text',
                            name: 'Demo threat model for the online Battle Royale Games\nprovided by the OWASP Threat Model Cookbook:\nthreat-model-cookbook/Flow Diagram/online-battleroyale-game',
                            hasOpenThreats: false
                        }
                    },
                    {
                        position: {
                            x: 150,
                            y: 150.00000000000003
                        },
                        size: {
                            width: 120,
                            height: 70
                        },
                        attrs: {
                            text: {
                                text: 'Player'
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
                                    id: '7e6bae63-0a26-4731-ab25-a465e5a5ca08'
                                },
                                {
                                    group: 'right',
                                    id: 'f56f4532-96ff-4e83-a15e-cb42c7d08acd'
                                },
                                {
                                    group: 'bottom',
                                    id: '50f96610-a4b2-41b7-bfaa-10b1358d2758'
                                },
                                {
                                    group: 'left',
                                    id: 'f3c52142-02cf-4ade-8ae7-6deb3a8411bd'
                                }
                            ]
                        },
                        id: 'a692ea06-22a1-40eb-9f05-bf8c7701465a',
                        data: {
                            type: 'tm.Actor',
                            name: 'Player',
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
                            x: 480,
                            y: 170
                        },
                        size: {
                            width: 140,
                            height: 70
                        },
                        attrs: {
                            text: {
                                text: 'Anonymous WWW\nuser-agent'
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'actor',
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
                                    id: '7e6bae63-0a26-4731-ab25-a465e5a5ca08'
                                },
                                {
                                    group: 'right',
                                    id: 'f56f4532-96ff-4e83-a15e-cb42c7d08acd'
                                },
                                {
                                    group: 'bottom',
                                    id: '50f96610-a4b2-41b7-bfaa-10b1358d2758'
                                },
                                {
                                    group: 'left',
                                    id: 'f3c52142-02cf-4ade-8ae7-6deb3a8411bd'
                                }
                            ]
                        },
                        id: '2f0e801f-29b6-46e1-ada8-d9ef87209a82',
                        data: {
                            type: 'tm.Actor',
                            name: 'Anonymous WWW\nuser-agent',
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
                            x: 370,
                            y: 330
                        },
                        size: {
                            width: 90,
                            height: 90
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
                                    id: 'ee9ba098-7f44-42d5-a853-6836385b6689'
                                },
                                {
                                    group: 'right',
                                    id: '36698aaa-a3db-4ea9-858e-5b2f5d2714ad'
                                },
                                {
                                    group: 'bottom',
                                    id: '27dcb0dc-7bc9-4584-85cb-64d9b3445164'
                                },
                                {
                                    group: 'left',
                                    id: '957ad777-d425-4022-ab0e-6c955d6c49c9'
                                }
                            ]
                        },
                        id: '00a04c2d-3977-4778-8f65-fcc3f97623b9',
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
                            x: 155,
                            y: 330
                        },
                        size: {
                            width: 110,
                            height: 110
                        },
                        attrs: {
                            text: {
                                text: 'Game client'
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
                                    id: 'ee9ba098-7f44-42d5-a853-6836385b6689'
                                },
                                {
                                    group: 'right',
                                    id: '36698aaa-a3db-4ea9-858e-5b2f5d2714ad'
                                },
                                {
                                    group: 'bottom',
                                    id: '27dcb0dc-7bc9-4584-85cb-64d9b3445164'
                                },
                                {
                                    group: 'left',
                                    id: '957ad777-d425-4022-ab0e-6c955d6c49c9'
                                }
                            ]
                        },
                        id: '8cff8bec-3c68-4ed4-b58e-43869f84b37b',
                        data: {
                            type: 'tm.Process',
                            name: 'Game client',
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
                                        text: 'Uses Launch',
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
                            name: 'Uses Launch',
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
                        id: '25129732-6f36-4769-8ff9-773556767c0d',
                        source: {
                            cell: 'a692ea06-22a1-40eb-9f05-bf8c7701465a',
                            port: '50f96610-a4b2-41b7-bfaa-10b1358d2758'
                        },
                        target: {
                            cell: '00a04c2d-3977-4778-8f65-fcc3f97623b9',
                            port: 'ee9ba098-7f44-42d5-a853-6836385b6689'
                        },
                        vertices: [
                            {
                                x: 340,
                                y: 270
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
                                        text: 'Uses Launch',
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
                            name: 'Uses Launch',
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
                        id: '28c940e9-3b8a-4307-a25f-07b8790ebc70',
                        source: {
                            cell: 'a692ea06-22a1-40eb-9f05-bf8c7701465a',
                            port: '50f96610-a4b2-41b7-bfaa-10b1358d2758'
                        },
                        target: {
                            cell: '8cff8bec-3c68-4ed4-b58e-43869f84b37b',
                            port: '957ad777-d425-4022-ab0e-6c955d6c49c9'
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
                        id: '2a8b3cf6-8c1a-4e3d-871b-783a34847151',
                        source: {
                            cell: '2f0e801f-29b6-46e1-ada8-d9ef87209a82',
                            port: '50f96610-a4b2-41b7-bfaa-10b1358d2758'
                        },
                        target: {
                            cell: '8d6c497a-5e19-4033-bcad-3203030497d5',
                            port: 'ee4ed67e-a5e8-4674-9a79-143196994593'
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
                            protocol: 'HTTPS',
                            threats: []
                        },
                        id: '94baf350-b304-4368-953c-4ab6a8e60a1d',
                        source: {
                            cell: '00a04c2d-3977-4778-8f65-fcc3f97623b9',
                            port: '27dcb0dc-7bc9-4584-85cb-64d9b3445164'
                        },
                        target: {
                            cell: '8d6c497a-5e19-4033-bcad-3203030497d5',
                            port: 'ee4ed67e-a5e8-4674-9a79-143196994593'
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
                            protocol: 'TCP 1235',
                            threats: []
                        },
                        id: '20b87b2c-bc78-497e-bc90-43b75a6ca1b8',
                        source: {
                            cell: '8cff8bec-3c68-4ed4-b58e-43869f84b37b',
                            port: '27dcb0dc-7bc9-4584-85cb-64d9b3445164'
                        },
                        target: {
                            cell: 'f18cd79c-cb5f-493b-bbdf-73b2b889941d',
                            port: 'dc5d6903-a065-4dec-a01b-b525a4c84993'
                        },
                        vertices: [
                            {
                                x: 130,
                                y: 580
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
                            protocol: 'TCP 1234',
                            threats: []
                        },
                        id: '11abbe85-b321-4fe5-8521-82ba50f73e65',
                        source: {
                            cell: '8cff8bec-3c68-4ed4-b58e-43869f84b37b',
                            port: '27dcb0dc-7bc9-4584-85cb-64d9b3445164'
                        },
                        target: {
                            cell: 'fbee63e6-0698-4796-a3c8-d5947043fb78',
                            port: 'ee4ed67e-a5e8-4674-9a79-143196994593'
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
                        id: '0ac8d63d-8412-49ac-990f-117050680550',
                        source: {
                            cell: 'fbee63e6-0698-4796-a3c8-d5947043fb78',
                            port: '3dcf2c58-a62e-4983-b172-9ad04e012f2b'
                        },
                        target: {
                            cell: 'd00d65da-23ff-46df-ba9d-266075e87ae4',
                            port: 'e56f41c7-e045-45d4-9d9c-d475f8260c80'
                        },
                        vertices: [
                            {
                                x: 410,
                                y: 960
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
                        id: '93ddaebb-9021-486f-a076-1969c1a7ca73',
                        source: {
                            cell: '8d6c497a-5e19-4033-bcad-3203030497d5',
                            port: '3dcf2c58-a62e-4983-b172-9ad04e012f2b'
                        },
                        target: {
                            cell: 'd00d65da-23ff-46df-ba9d-266075e87ae4',
                            port: '8a525d9b-44a2-4547-b867-1b9c645f4d21'
                        },
                        vertices: [
                            {
                                x: 610,
                                y: 880
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
                        id: '1e32a4f0-cc98-46be-aff0-375f41aa7877',
                        source: {
                            cell: '1d564201-cc13-49f3-aed0-15ccfab69e9f',
                            port: '3dcf2c58-a62e-4983-b172-9ad04e012f2b'
                        },
                        target: {
                            cell: 'd00d65da-23ff-46df-ba9d-266075e87ae4',
                            port: '8a525d9b-44a2-4547-b867-1b9c645f4d21'
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
                        id: '25de0965-c7f0-4b26-bf66-ef4015c03c83',
                        source: {
                            cell: '4b36c08d-8d07-4b68-9654-b772317322c8',
                            port: '3dcf2c58-a62e-4983-b172-9ad04e012f2b'
                        },
                        target: {
                            cell: 'd00d65da-23ff-46df-ba9d-266075e87ae4',
                            port: 'fd62bf4a-4c5c-4361-9f62-776a96c5ffc0'
                        },
                        vertices: [
                            {
                                x: 720,
                                y: 1020
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
                        id: '2b01cc4b-63ad-466d-827a-0ca0d3068e7c',
                        source: {
                            cell: '8d6c497a-5e19-4033-bcad-3203030497d5',
                            port: '3dcf2c58-a62e-4983-b172-9ad04e012f2b'
                        },
                        target: {
                            cell: '1d564201-cc13-49f3-aed0-15ccfab69e9f',
                            port: 'ee4ed67e-a5e8-4674-9a79-143196994593'
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
                        id: '63368478-98ab-4fd8-ba46-b0b683e6b749',
                        source: {
                            cell: 'fbee63e6-0698-4796-a3c8-d5947043fb78',
                            port: 'd9c88c72-a8f7-4a97-94e2-c805f6738c9a'
                        },
                        target: {
                            cell: '1d564201-cc13-49f3-aed0-15ccfab69e9f',
                            port: 'ee4ed67e-a5e8-4674-9a79-143196994593'
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
                                        text: 'R/O',
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
                            name: 'R/O',
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
                        id: 'a4e57fc4-74da-4110-bbc7-47b1f53ae8f8',
                        source: {
                            cell: '1d564201-cc13-49f3-aed0-15ccfab69e9f',
                            port: '3dcf2c58-a62e-4983-b172-9ad04e012f2b'
                        },
                        target: {
                            cell: 'acf72d1f-bc61-4e1e-86c7-e6f391d4a99c',
                            port: '8a525d9b-44a2-4547-b867-1b9c645f4d21'
                        },
                        vertices: [
                            {
                                x: 380,
                                y: 1010
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
                                        text: 'R/W',
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
                            name: 'R/W',
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
                        id: '23ffacff-5eb8-4952-952b-0eedbfd9dcd6',
                        source: {
                            cell: 'f18cd79c-cb5f-493b-bbdf-73b2b889941d',
                            port: '3dcf2c58-a62e-4983-b172-9ad04e012f2b'
                        },
                        target: {
                            cell: 'acf72d1f-bc61-4e1e-86c7-e6f391d4a99c',
                            port: '8a525d9b-44a2-4547-b867-1b9c645f4d21'
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
                        id: '7c16a7bb-138e-4121-b9aa-f942dbd26a7b',
                        source: {
                            cell: '2e6b5a7b-0c65-4ae7-8935-78af2b4c9a16',
                            port: 'dc5d6903-a065-4dec-a01b-b525a4c84993'
                        },
                        target: {
                            cell: '4b36c08d-8d07-4b68-9654-b772317322c8',
                            port: 'd9c88c72-a8f7-4a97-94e2-c805f6738c9a'
                        },
                        tools: {
                            items: [
                                'boundary',
                                'button-remove',
                                'vertices',
                                'source-arrowhead',
                                'target-arrowhead'
                            ],
                            name: null
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
                        id: '389fcd22-2862-45df-9dbe-3213e9cb6672',
                        source: {
                            cell: 'fbee63e6-0698-4796-a3c8-d5947043fb78',
                            port: 'dc5d6903-a065-4dec-a01b-b525a4c84993'
                        },
                        target: {
                            cell: 'f18cd79c-cb5f-493b-bbdf-73b2b889941d',
                            port: 'ee4ed67e-a5e8-4674-9a79-143196994593'
                        },
                        vertices: [
                            {
                                x: 270,
                                y: 800
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
                        id: 'bcef43d0-a7bc-45f5-88f0-9e2a4dc06419',
                        source: {
                            cell: 'f18cd79c-cb5f-493b-bbdf-73b2b889941d',
                            port: '3dcf2c58-a62e-4983-b172-9ad04e012f2b'
                        },
                        target: {
                            cell: 'd00d65da-23ff-46df-ba9d-266075e87ae4',
                            port: 'e56f41c7-e045-45d4-9d9c-d475f8260c80'
                        },
                        vertices: []
                    },
                    {
                        position: {
                            x: 190,
                            y: 858.0000000000035
                        },
                        size: {
                            width: 130,
                            height: 120
                        },
                        attrs: {
                            text: {
                                text: 'Game Servers'
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
                                    id: 'ee4ed67e-a5e8-4674-9a79-143196994593'
                                },
                                {
                                    group: 'right',
                                    id: 'd9c88c72-a8f7-4a97-94e2-c805f6738c9a'
                                },
                                {
                                    group: 'bottom',
                                    id: '3dcf2c58-a62e-4983-b172-9ad04e012f2b'
                                },
                                {
                                    group: 'left',
                                    id: 'dc5d6903-a065-4dec-a01b-b525a4c84993'
                                }
                            ]
                        },
                        id: 'f18cd79c-cb5f-493b-bbdf-73b2b889941d',
                        data: {
                            type: 'tm.Process',
                            name: 'Game Servers',
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
                            x: 310,
                            y: 730
                        },
                        size: {
                            width: 90,
                            height: 80
                        },
                        attrs: {
                            text: {
                                text: 'Lobby'
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
                                    id: 'ee4ed67e-a5e8-4674-9a79-143196994593'
                                },
                                {
                                    group: 'right',
                                    id: 'd9c88c72-a8f7-4a97-94e2-c805f6738c9a'
                                },
                                {
                                    group: 'bottom',
                                    id: '3dcf2c58-a62e-4983-b172-9ad04e012f2b'
                                },
                                {
                                    group: 'left',
                                    id: 'dc5d6903-a065-4dec-a01b-b525a4c84993'
                                }
                            ]
                        },
                        id: 'fbee63e6-0698-4796-a3c8-d5947043fb78',
                        data: {
                            type: 'tm.Process',
                            name: 'Lobby',
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
                            x: 480,
                            y: 700
                        },
                        size: {
                            width: 100,
                            height: 100
                        },
                        attrs: {
                            text: {
                                text: 'Website Stats'
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
                                    id: 'ee4ed67e-a5e8-4674-9a79-143196994593'
                                },
                                {
                                    group: 'right',
                                    id: 'd9c88c72-a8f7-4a97-94e2-c805f6738c9a'
                                },
                                {
                                    group: 'bottom',
                                    id: '3dcf2c58-a62e-4983-b172-9ad04e012f2b'
                                },
                                {
                                    group: 'left',
                                    id: 'dc5d6903-a065-4dec-a01b-b525a4c84993'
                                }
                            ]
                        },
                        id: '8d6c497a-5e19-4033-bcad-3203030497d5',
                        data: {
                            type: 'tm.Process',
                            name: 'Website Stats',
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
                            x: 450,
                            y: 860
                        },
                        size: {
                            width: 90,
                            height: 90
                        },
                        attrs: {
                            text: {
                                text: 'API REST'
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
                                    id: 'ee4ed67e-a5e8-4674-9a79-143196994593'
                                },
                                {
                                    group: 'right',
                                    id: 'd9c88c72-a8f7-4a97-94e2-c805f6738c9a'
                                },
                                {
                                    group: 'bottom',
                                    id: '3dcf2c58-a62e-4983-b172-9ad04e012f2b'
                                },
                                {
                                    group: 'left',
                                    id: 'dc5d6903-a065-4dec-a01b-b525a4c84993'
                                }
                            ]
                        },
                        id: '1d564201-cc13-49f3-aed0-15ccfab69e9f',
                        data: {
                            type: 'tm.Process',
                            name: 'API REST',
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
                            x: 650,
                            y: 810
                        },
                        size: {
                            width: 90,
                            height: 90
                        },
                        attrs: {
                            text: {
                                text: 'Moderation\nWebsite'
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'process',
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
                                    id: 'ee4ed67e-a5e8-4674-9a79-143196994593'
                                },
                                {
                                    group: 'right',
                                    id: 'd9c88c72-a8f7-4a97-94e2-c805f6738c9a'
                                },
                                {
                                    group: 'bottom',
                                    id: '3dcf2c58-a62e-4983-b172-9ad04e012f2b'
                                },
                                {
                                    group: 'left',
                                    id: 'dc5d6903-a065-4dec-a01b-b525a4c84993'
                                }
                            ]
                        },
                        id: '4b36c08d-8d07-4b68-9654-b772317322c8',
                        data: {
                            type: 'tm.Process',
                            name: 'Moderation\nWebsite',
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
                            x: 978,
                            y: 740
                        },
                        size: {
                            width: 110,
                            height: 110
                        },
                        attrs: {
                            text: {
                                text: 'Customer\nSupport'
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
                                    id: 'ee4ed67e-a5e8-4674-9a79-143196994593'
                                },
                                {
                                    group: 'right',
                                    id: 'd9c88c72-a8f7-4a97-94e2-c805f6738c9a'
                                },
                                {
                                    group: 'bottom',
                                    id: '3dcf2c58-a62e-4983-b172-9ad04e012f2b'
                                },
                                {
                                    group: 'left',
                                    id: 'dc5d6903-a065-4dec-a01b-b525a4c84993'
                                }
                            ]
                        },
                        id: '2e6b5a7b-0c65-4ae7-8935-78af2b4c9a16',
                        data: {
                            type: 'tm.Process',
                            name: 'Customer\nSupport',
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
                            x: 205,
                            y: 1086
                        },
                        size: {
                            width: 120,
                            height: 60
                        },
                        attrs: {
                            text: {
                                text: 'Stats\nDatabase'
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
                                    id: '8a525d9b-44a2-4547-b867-1b9c645f4d21'
                                },
                                {
                                    group: 'right',
                                    id: 'fd62bf4a-4c5c-4361-9f62-776a96c5ffc0'
                                },
                                {
                                    group: 'bottom',
                                    id: '77337f91-5abc-477c-840f-a92fc4aaad0b'
                                },
                                {
                                    group: 'left',
                                    id: 'e56f41c7-e045-45d4-9d9c-d475f8260c80'
                                }
                            ]
                        },
                        id: 'acf72d1f-bc61-4e1e-86c7-e6f391d4a99c',
                        data: {
                            type: 'tm.Store',
                            name: 'Stats\nDatabase',
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
                            x: 435,
                            y: 1070
                        },
                        size: {
                            width: 230,
                            height: 60
                        },
                        attrs: {
                            text: {
                                text: 'Player Database'
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
                        zIndex: 18,
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
                                    id: '8a525d9b-44a2-4547-b867-1b9c645f4d21'
                                },
                                {
                                    group: 'right',
                                    id: 'fd62bf4a-4c5c-4361-9f62-776a96c5ffc0'
                                },
                                {
                                    group: 'bottom',
                                    id: '77337f91-5abc-477c-840f-a92fc4aaad0b'
                                },
                                {
                                    group: 'left',
                                    id: 'e56f41c7-e045-45d4-9d9c-d475f8260c80'
                                }
                            ]
                        },
                        id: 'd00d65da-23ff-46df-ba9d-266075e87ae4',
                        data: {
                            type: 'tm.Store',
                            name: 'Player Database',
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
                    }
                ]
            }
        ],
        diagramTop: 0,
        reviewer: 'A security architect',
        threatTop: 0
    }
};
