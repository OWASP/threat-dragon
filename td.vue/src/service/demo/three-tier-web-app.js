export default {
    version: '2.4.0',
    summary: {
        title: 'Three Tier Web Application',
        owner: 'A development team',
        description:
            'This threat model has been provided by the OWASP Threat Model Cookbook:\nthreat-model-cookbook/IriusRisk/3-Tier-Web-App',
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
                title: 'Three Tier Web App',
                diagramType: 'STRIDE',
                placeholder: 'New STRIDE diagram description',
                thumbnail: './public/content/images/thumbnail.stride.jpg',
                version: '2.4.0',
                cells: [
                    {
                        position: {
                            x: 151.99999999999983,
                            y: 170.00000000000057
                        },
                        size: {
                            width: 250,
                            height: 200
                        },
                        attrs: {
                            label: {
                                text: 'Internet'
                            }
                        },
                        visible: true,
                        shape: 'trust-boundary-box',
                        id: 'a10125fd-004a-44d9-b4a8-dffb49de91c4',
                        zIndex: -1,
                        data: {
                            type: 'tm.BoundaryBox',
                            description: '',
                            isTrustBoundary: true,
                            hasOpenThreats: false
                        }
                    },
                    {
                        position: {
                            x: 563,
                            y: 180.00000000000057
                        },
                        size: {
                            width: 520,
                            height: 200
                        },
                        attrs: {
                            label: {
                                text: 'Public Cloud'
                            }
                        },
                        visible: true,
                        shape: 'trust-boundary-box',
                        id: 'c54864d8-740f-40cb-bbb9-6ba008a336b6',
                        zIndex: -1,
                        data: {
                            type: 'tm.BoundaryBox',
                            description: '',
                            isTrustBoundary: true,
                            hasOpenThreats: false
                        }
                    },
                    {
                        position: {
                            x: 190,
                            y: 75
                        },
                        size: {
                            width: 340,
                            height: 60
                        },
                        attrs: {
                            text: {
                                text: 'Three Tier Web Application\nprovided by the OWASP Threat Model Cookbook:\nthreat-model-cookbook/IriusRisk/3-Tier-Web-App'
                            }
                        },
                        visible: true,
                        shape: 'td-text-block',
                        id: 'a981b8ca-b1b4-4c63-a54e-3680f35dcb22',
                        zIndex: 2,
                        data: {
                            type: 'tm.Text',
                            name: 'Three Tier Web Application\nprovided by the OWASP Threat Model Cookbook:\nthreat-model-cookbook/IriusRisk/3-Tier-Web-App',
                            hasOpenThreats: false
                        }
                    },
                    {
                        position: {
                            x: 211.99999999999983,
                            y: 220.00000000000057
                        },
                        size: {
                            width: 130,
                            height: 120
                        },
                        attrs: {
                            text: {
                                text: 'Web UI'
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'process',
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
                                    id: '1099a13a-80f8-4e29-8747-acdf5d0f83f9'
                                },
                                {
                                    group: 'right',
                                    id: 'bedbb764-d505-4937-852b-150f4115f25d'
                                },
                                {
                                    group: 'bottom',
                                    id: '6db21897-b788-41ba-8e7e-159a17fddfeb'
                                },
                                {
                                    group: 'left',
                                    id: '2005b935-d71c-4970-85b5-be05f8c2ecd2'
                                }
                            ]
                        },
                        id: '5170eb10-abe9-48ec-8c74-b5ad508c28ef',
                        zIndex: 3,
                        data: {
                            type: 'tm.Process',
                            name: 'Web UI',
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
                            x: 587,
                            y: 220.00000000000057
                        },
                        size: {
                            width: 150,
                            height: 120
                        },
                        attrs: {
                            text: {
                                text: 'Web Service'
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'process',
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
                                    id: '1099a13a-80f8-4e29-8747-acdf5d0f83f9'
                                },
                                {
                                    group: 'right',
                                    id: 'bedbb764-d505-4937-852b-150f4115f25d'
                                },
                                {
                                    group: 'bottom',
                                    id: '6db21897-b788-41ba-8e7e-159a17fddfeb'
                                },
                                {
                                    group: 'left',
                                    id: '2005b935-d71c-4970-85b5-be05f8c2ecd2'
                                }
                            ]
                        },
                        id: '09b86abf-65dd-49c2-9746-0cf9282f82a1',
                        zIndex: 4,
                        data: {
                            type: 'tm.Process',
                            name: 'Web Service',
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
                            x: 893,
                            y: 225.00000000000057
                        },
                        size: {
                            width: 120,
                            height: 110
                        },
                        attrs: {
                            text: {
                                text: 'PostgresSQL'
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'process',
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
                                    id: '1099a13a-80f8-4e29-8747-acdf5d0f83f9'
                                },
                                {
                                    group: 'right',
                                    id: 'bedbb764-d505-4937-852b-150f4115f25d'
                                },
                                {
                                    group: 'bottom',
                                    id: '6db21897-b788-41ba-8e7e-159a17fddfeb'
                                },
                                {
                                    group: 'left',
                                    id: '2005b935-d71c-4970-85b5-be05f8c2ecd2'
                                }
                            ]
                        },
                        id: '97731369-531c-4c22-b017-8428cff90ac1',
                        zIndex: 5,
                        data: {
                            type: 'tm.Process',
                            name: 'PostgresSQL',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: [
                                {
                                    id: '264eeb9a-f5b3-4224-93e7-ac0cb72f20de',
                                    title: 'Store Sensitive Data',
                                    status: 'Mitigated',
                                    severity: 'High',
                                    type: 'Information disclosure',
                                    description:
                                        'Sensitive data is compromised if the host itself is compromised',
                                    mitigation: 'Risk transferred to the infrastructure team',
                                    modelType: 'STRIDE',
                                    new: false,
                                    number: 1,
                                    score: '7.5'
                                },
                                {
                                    id: 'b8bf0eca-5c7f-49a9-a8a3-fe9094aea72a',
                                    title: 'Store Sensitive Data',
                                    status: 'Mitigated',
                                    severity: 'Medium',
                                    type: 'Information disclosure',
                                    description:
                                        'Sensitive data is compromised if a backup of the data is compromised',
                                    mitigation:
                                        'This risk is accepted by the project team, since backup is handled by an external company',
                                    modelType: 'STRIDE',
                                    new: false,
                                    number: 2,
                                    score: ''
                                }
                            ],
                            threatFrequency: {
                                spoofing: 0,
                                tampering: 0,
                                repudiation: 0,
                                informationDisclosure: 2,
                                denialOfService: 0,
                                elevationOfPrivilege: 0
                            }
                        },
                        tools: {
                            items: ['boundary', 'button-remove'],
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
                        id: '76b24277-4066-42a3-b75f-6b3e2c5c9d28',
                        source: {
                            cell: '5170eb10-abe9-48ec-8c74-b5ad508c28ef',
                            port: 'bedbb764-d505-4937-852b-150f4115f25d'
                        },
                        target: {
                            cell: '09b86abf-65dd-49c2-9746-0cf9282f82a1',
                            port: '2005b935-d71c-4970-85b5-be05f8c2ecd2'
                        },
                        vertices: [
                            {
                                x: 470,
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
                        id: 'd67a2468-f1c7-4097-8e4a-656ec9f055dc',
                        source: {
                            cell: '09b86abf-65dd-49c2-9746-0cf9282f82a1',
                            port: '2005b935-d71c-4970-85b5-be05f8c2ecd2'
                        },
                        target: {
                            cell: '5170eb10-abe9-48ec-8c74-b5ad508c28ef',
                            port: 'bedbb764-d505-4937-852b-150f4115f25d'
                        },
                        vertices: [
                            {
                                x: 470,
                                y: 330
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
                            isBidirectional: true,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: []
                        },
                        id: '91ccf804-a9b8-45ca-ab35-992337903633',
                        source: {
                            cell: '09b86abf-65dd-49c2-9746-0cf9282f82a1',
                            port: 'bedbb764-d505-4937-852b-150f4115f25d'
                        },
                        target: {
                            cell: '97731369-531c-4c22-b017-8428cff90ac1',
                            port: '2005b935-d71c-4970-85b5-be05f8c2ecd2'
                        },
                        vertices: []
                    }
                ]
            }
        ],
        diagramTop: 1,
        reviewer: 'A product security team',
        threatTop: 2
    }
};
