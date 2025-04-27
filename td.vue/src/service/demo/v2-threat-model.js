export default {
    summary: {
        title: 'Demo Threat Model',
        owner: 'Mike Goodwin',
        description:
            'A sample model of a web application, with a queue-decoupled background process.',
        id: 0
    },
    detail: {
        contributors: [
            {
                name: 'Tom Brown'
            },
            {
                name: 'Albert Moneypenny'
            }
        ],
        diagrams: [
            {
                cells: [
                    {
                        position: {
                            x: 685,
                            y: 420
                        },
                        size: {
                            width: 160,
                            height: 80
                        },
                        attrs: {
                            text: {
                                text: 'Worker Config'
                            },
                            topLine: {
                                stroke: 'red',
                                strokeWidth: 2.5,
                                strokeDasharray: null
                            },
                            bottomLine: {
                                stroke: 'red',
                                strokeWidth: 2.5,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'store',
                        zIndex: 1,
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
                                    id: 'bd52b788-ae39-4575-be16-b5e42cfd992c'
                                },
                                {
                                    group: 'right',
                                    id: 'f28e07e9-964c-4111-80aa-93c476484719'
                                },
                                {
                                    group: 'bottom',
                                    id: '8372282d-b537-4e0b-9c65-a7be3c5d119e'
                                },
                                {
                                    group: 'left',
                                    id: 'dc438367-f1cf-4799-8128-6d6a535d9954'
                                }
                            ]
                        },
                        id: 'a25bbb4e-093f-4238-a620-31efdee452dc',
                        data: {
                            name: 'Worker Config',
                            description: '',
                            type: 'tm.Store',
                            isTrustBoundary: false,
                            outOfScope: false,
                            reasonOutOfScope: '',
                            threats: [
                                {
                                    status: 'Open',
                                    severity: 'High',
                                    mitigation:
                                        'Encrypt the DB credentials in the configuration file.\n\nExpire and replace the DB credentials regularly.',
                                    description:
                                        'The Background Worker configuration stores the credentials used by the worker to access the DB. An attacker could compromise the Background Worker and get access to the DB credentials.',
                                    title: 'Accessing DB credentials',
                                    type: 'Information disclosure',
                                    modelType: 'STRIDE',
                                    id: '7df716cd-a982-48a5-b4ed-800ccb670734'
                                }
                            ],
                            hasOpenThreats: true,
                            isALog: false,
                            storesCredentials: true,
                            isEncrypted: false,
                            isSigned: false
                        }
                    },
                    {
                        position: {
                            x: 290,
                            y: 420
                        },
                        size: {
                            width: 160,
                            height: 80
                        },
                        attrs: {
                            text: {
                                text: 'Database'
                            },
                            topLine: {
                                stroke: 'red',
                                strokeWidth: 2.5,
                                strokeDasharray: null
                            },
                            bottomLine: {
                                stroke: 'red',
                                strokeWidth: 2.5,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'store',
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
                                    id: '53d28f73-ae36-48eb-8f50-dc7f7d045411'
                                },
                                {
                                    group: 'right',
                                    id: '277d0ad9-37e2-4f30-94ce-b131c6b9a418'
                                },
                                {
                                    group: 'bottom',
                                    id: '894e6839-04e1-427b-b73d-915af9e454ea'
                                },
                                {
                                    group: 'left',
                                    id: '89bd027f-7cf1-45a9-b649-7ced87a6ec50'
                                }
                            ]
                        },
                        id: '936557f9-22e2-4bac-bb70-0089c5c2fbe1',
                        data: {
                            name: 'Database',
                            description: '',
                            type: 'tm.Store',
                            isTrustBoundary: false,
                            outOfScope: false,
                            reasonOutOfScope: '',
                            threats: [
                                {
                                    status: 'Mitigated',
                                    severity: 'High',
                                    description: 'An attacker could make an query call on the DB,',
                                    title: 'Unauthorised access',
                                    type: 'Information disclosure',
                                    mitigation: 'Require all queries to be authenticated.',
                                    modelType: 'STRIDE',
                                    id: '21fc4b20-ca29-4891-9691-d8f0331b2a11'
                                },
                                {
                                    status: 'Open',
                                    severity: 'Medium',
                                    description:
                                        'An attacker could obtain the DB credentials and use them to make unauthorised queries.',
                                    title: 'Credential theft',
                                    type: 'Information disclosure',
                                    mitigation:
                                        'Use a firewall to restrict access to the DB to only the Background Worker IP address.',
                                    modelType: 'STRIDE',
                                    id: 'e12765bf-ec61-47d8-8e9f-6bb3f5adab47'
                                }
                            ],
                            hasOpenThreats: true,
                            isALog: true,
                            storesCredentials: false,
                            isEncrypted: false,
                            isSigned: false
                        }
                    },
                    {
                        position: {
                            x: 40,
                            y: 420
                        },
                        size: {
                            width: 160,
                            height: 80
                        },
                        attrs: {
                            text: {
                                text: 'Web Application Config'
                            },
                            topLine: {
                                stroke: 'red',
                                strokeWidth: 2.5,
                                strokeDasharray: '4 3'
                            },
                            bottomLine: {
                                stroke: 'red',
                                strokeWidth: 2.5,
                                strokeDasharray: '4 3'
                            }
                        },
                        visible: true,
                        shape: 'store',
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
                                    id: '2eda1388-0f3c-467e-8a25-ff3d6c10d886'
                                },
                                {
                                    group: 'right',
                                    id: 'a50679a2-ecf0-419d-8547-8fd5caf4f460'
                                },
                                {
                                    group: 'bottom',
                                    id: 'dd4b80ab-a4ed-4b11-a2eb-984e6fcc0e63'
                                },
                                {
                                    group: 'left',
                                    id: 'e51ac87e-55a9-45d3-b78e-108b0c5f9214'
                                }
                            ]
                        },
                        id: 'bdd3e115-4b92-4020-90b7-c3351dba292b',
                        data: {
                            name: 'Web Application Config',
                            description: '',
                            type: 'tm.Store',
                            isTrustBoundary: false,
                            outOfScope: true,
                            reasonOutOfScope: '',
                            threats: [
                                {
                                    status: 'Open',
                                    severity: 'High',
                                    title: 'Credentials should be encrypted',
                                    type: 'Information disclosure',
                                    description:
                                        'The Web Application Config stores credentials used by the Web App to access the message queue. These could be stolen by an attacker and used to read confidential data or place poison message on the queue.',
                                    mitigation:
                                        'The Message Queue credentials should be encrypted.',
                                    modelType: 'STRIDE',
                                    id: 'aaea0238-2984-4b25-8268-3798e63bed34'
                                }
                            ],
                            hasOpenThreats: true,
                            isALog: false,
                            storesCredentials: true,
                            isEncrypted: false,
                            isSigned: false
                        }
                    },
                    {
                        position: {
                            x: 600,
                            y: 13
                        },
                        size: {
                            width: 160,
                            height: 80
                        },
                        attrs: {
                            text: {
                                text: 'Message Queue'
                            },
                            topLine: {
                                stroke: 'red',
                                strokeWidth: 2.5,
                                strokeDasharray: null
                            },
                            bottomLine: {
                                stroke: 'red',
                                strokeWidth: 2.5,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'store',
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
                                    id: 'b68feecb-4446-40c3-9bff-b69b4b61793d'
                                },
                                {
                                    group: 'right',
                                    id: '436560be-01e0-4420-a43a-3c8d9475adbc'
                                },
                                {
                                    group: 'bottom',
                                    id: '75055468-071a-454c-b349-41695e0867ed'
                                },
                                {
                                    group: 'left',
                                    id: 'c2464df8-d099-4fa9-9dca-511e81ba84fa'
                                }
                            ]
                        },
                        id: 'ec574fb4-87e7-494b-88dc-2a3c99172067',
                        data: {
                            name: 'Message Queue',
                            description: '',
                            type: 'tm.Store',
                            isTrustBoundary: false,
                            outOfScope: false,
                            reasonOutOfScope: '',
                            threats: [
                                {
                                    status: 'Open',
                                    severity: 'Low',
                                    title: 'Message secrecy',
                                    type: 'Information disclosure',
                                    description:
                                        'The data flow between the Web Application and the Background Worker is not point-to-point and therefore end-to-end secrecy cannot be provided at the transport layer. Messages could be read by an attacker at rest in the Message Queue.',
                                    mitigation:
                                        'Use message level encryption for high sensitivity data (e.g. security tokens) in messages.',
                                    modelType: 'STRIDE',
                                    id: '7bc090cc-50a1-44aa-8481-5e4daaa6d8ba'
                                },
                                {
                                    status: 'Open',
                                    severity: 'Medium',
                                    title: 'Message tampering',
                                    type: 'Tampering',
                                    description:
                                        'Messages on the queue could be tampered with, causing incorrect processing by the Background Worker.',
                                    mitigation:
                                        'Sign all queue messages at the Web Server. Validate the message signature at the Background Worker and reject any message with a missing or invalid signature. Log any failed messages.',
                                    modelType: 'STRIDE',
                                    id: '52ba8c1d-8376-4ede-942d-e575d71eaef5'
                                },
                                {
                                    status: 'Mitigated',
                                    severity: 'High',
                                    title: 'Fake messages could be placed on the queue',
                                    type: 'Spoofing',
                                    description:
                                        'An attacker could put a fake message on queue, causing the Background Worker to do incorrect processing.',
                                    mitigation:
                                        'Restrict access to the queue to the IP addresses of the Web Server and Background Worker.\n\nImplement authentication on the queue endpoint.',
                                    modelType: 'STRIDE',
                                    id: 'b917c6dd-e2d5-455c-8b81-61407126abfa'
                                }
                            ],
                            hasOpenThreats: true,
                            isALog: false,
                            storesCredentials: false,
                            isEncrypted: false,
                            isSigned: false
                        }
                    },
                    {
                        position: {
                            x: 685,
                            y: 180
                        },
                        size: {
                            width: 100,
                            height: 100
                        },
                        attrs: {
                            text: {
                                text: 'Background\nWorker Process'
                            },
                            body: {
                                stroke: 'red',
                                strokeWidth: 2.5,
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
                                    id: '883bb50a-85e6-4e0e-bd73-2bf5cde499bd'
                                },
                                {
                                    group: 'right',
                                    id: '6dba1ee3-4b58-477f-bd6e-3f0febe9274c'
                                },
                                {
                                    group: 'bottom',
                                    id: '342d39e4-1f53-4702-862b-64f1de0d2dab'
                                },
                                {
                                    group: 'left',
                                    id: '0723398e-17a2-4211-a7e6-d6c9cb9d6778'
                                }
                            ]
                        },
                        id: '3e75b596-9c70-41b6-a2cf-a15899c254d3',
                        data: {
                            name: 'Background\nWorker Process',
                            description: '',
                            type: 'tm.Process',
                            isTrustBoundary: false,
                            outOfScope: false,
                            reasonOutOfScope: '',
                            threats: [
                                {
                                    status: 'Open',
                                    severity: 'Medium',
                                    title: 'Poison messages 1',
                                    type: 'Denial of service',
                                    description:
                                        'An attacker could generate a malicious message that the Background Worker cannot process.',
                                    mitigation:
                                        'Implement a poison message queue where messages are placed after a fixed number of retries.',
                                    modelType: 'STRIDE',
                                    id: '1468b37f-3ff9-4079-8767-f33bbfe0a887'
                                },
                                {
                                    status: 'Open',
                                    severity: 'Medium',
                                    mitigation:
                                        'Validate the content of all messages, before processing. Reject any message that have invalid content and log the rejection. Do not log the malicious content - instead log a description of the error.',
                                    type: 'Denial of service',
                                    title: 'Poison messages 2',
                                    description:
                                        'An attacker could generate a malicious message that the Background Worker cannot process.',
                                    modelType: 'STRIDE',
                                    id: '3c8033db-0e51-42c0-afd0-d01d2ced4a14'
                                }
                            ],
                            hasOpenThreats: true
                        }
                    },
                    {
                        position: {
                            x: 220,
                            y: 180
                        },
                        size: {
                            width: 100,
                            height: 100
                        },
                        attrs: {
                            text: {
                                text: 'Web\nApplication'
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'process',
                        zIndex: 6,
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
                                    id: '5becd2ed-4db6-4a3e-97ff-3dbb792c0343'
                                },
                                {
                                    group: 'right',
                                    id: '9acd737c-ec30-40df-bdfb-27fa9bdc6642'
                                },
                                {
                                    group: 'bottom',
                                    id: 'dbab1143-a4f8-4b16-9619-8a1bb0a92d4f'
                                },
                                {
                                    group: 'left',
                                    id: 'c6926a6e-d59a-433c-a09d-23c5ead1987f'
                                }
                            ]
                        },
                        id: '0d9909ea-1398-4898-be81-cf1c808324dc',
                        data: {
                            name: 'Web\nApplication',
                            description: '',
                            type: 'tm.Process',
                            isTrustBoundary: false,
                            outOfScope: false,
                            reasonOutOfScope: '',
                            threats: [],
                            hasOpenThreats: false
                        }
                    },
                    {
                        position: {
                            x: 10,
                            y: 30
                        },
                        size: {
                            width: 160,
                            height: 80
                        },
                        attrs: {
                            text: {
                                text: 'Browser'
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1,
                                strokeDasharray: null
                            }
                        },
                        visible: true,
                        shape: 'actor',
                        zIndex: 7,
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
                                    id: 'a14d824f-d4be-4f41-91aa-5e47256ccd86'
                                },
                                {
                                    group: 'right',
                                    id: 'e508a4d1-e4e2-46f0-b136-e073d9f8f06a'
                                },
                                {
                                    group: 'bottom',
                                    id: 'b300e390-f80d-4c82-ab80-ea9848041a5f'
                                },
                                {
                                    group: 'left',
                                    id: 'b21da16d-0259-47a1-8c52-ef1121ccef63'
                                }
                            ]
                        },
                        id: 'b394f9f7-07ca-42bc-b616-ad77c6fbfcce',
                        data: {
                            name: 'Browser',
                            description: '',
                            type: 'tm.Actor',
                            isTrustBoundary: false,
                            outOfScope: false,
                            reasonOutOfScope: '',
                            threats: [],
                            hasOpenThreats: false,
                            providesAuthentication: false
                        }
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: 'red',
                                targetMarker: {
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
                                        text: 'Put Message',
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
                                position: 0.5
                            }
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'Put Message',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: true,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: [
                                {
                                    status: 'Open',
                                    severity: 'High',
                                    description:
                                        'These requests are made over the public internet and could be intercepted by an attacker.',
                                    title: 'Data flow should use HTTP/S',
                                    type: 'Information disclosure',
                                    mitigation:
                                        'The requests should require HTTP/S. This will provide confidentiality and integrity. HTTP should not be supported.',
                                    modelType: 'STRIDE',
                                    id: 'f8cc4477-653f-4e4a-a0cb-7b90f046fd7b'
                                }
                            ],
                            isTrustBoundary: false
                        },
                        id: 'c779a822-d4ec-4237-9191-fe7170b32956',
                        source: {
                            cell: '0d9909ea-1398-4898-be81-cf1c808324dc'
                        },
                        target: {
                            cell: 'ec574fb4-87e7-494b-88dc-2a3c99172067'
                        },
                        vertices: [
                            {
                                x: 351,
                                y: 120
                            }
                        ]
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: 'red',
                                targetMarker: {
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
                                        text: 'Message',
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
                                position: 0.5
                            }
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'Message',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: true,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: [
                                {
                                    status: 'Open',
                                    severity: 'High',
                                    mitigation:
                                        'The requests should require HTTP/S. This will provide confidentiality and integrity. HTTP should not be supported.',
                                    type: 'Information disclosure',
                                    title: 'Data flow should use HTTP/S',
                                    description:
                                        'These requests are made over the public internet and could be intercepted by an attacker.',
                                    modelType: 'STRIDE',
                                    id: '2fcfb064-6a08-4771-9d9d-342639d63d7b'
                                }
                            ],
                            isTrustBoundary: false
                        },
                        id: '552b5603-41c9-4458-83f2-01a6490a41b8',
                        source: {
                            cell: 'ec574fb4-87e7-494b-88dc-2a3c99172067'
                        },
                        target: {
                            cell: '3e75b596-9c70-41b6-a2cf-a15899c254d3'
                        },
                        vertices: [
                            {
                                x: 630,
                                y: 130
                            }
                        ]
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: 'red',
                                targetMarker: {
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
                                        text: 'Worker Query Results',
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
                                position: 0.5
                            }
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'Worker Query Results',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: true,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: [
                                {
                                    status: 'Open',
                                    severity: 'Low',
                                    title: 'Man in the middle attack',
                                    type: 'Information disclosure',
                                    mitigation: 'Enforce an encrypted connection at the DB server',
                                    description:
                                        'An attacker could intercept the DB queries in transit and obtain sensitive information, such as DB credentials, query parameters or query results (is unlikely since the data flow is over a private network).',
                                    modelType: 'STRIDE',
                                    id: '72b9712b-2c08-40b1-aea6-57604e82f5f4'
                                }
                            ],
                            isTrustBoundary: false
                        },
                        id: '1d981aac-90a7-464e-9491-3456bc6e593c',
                        source: {
                            cell: '936557f9-22e2-4bac-bb70-0089c5c2fbe1'
                        },
                        target: {
                            cell: '3e75b596-9c70-41b6-a2cf-a15899c254d3'
                        },
                        vertices: [
                            {
                                x: 466,
                                y: 347
                            }
                        ]
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                strokeWidth: 1,
                                targetMarker: {
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
                                        text: 'Web Response (HTTP/S)',
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
                                position: 0.5
                            }
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'Web Response',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: true,
                            isPublicNetwork: true,
                            protocol: 'HTTP/S',
                            threats: [
                                {
                                    status: 'Mitigated',
                                    severity: 'High',
                                    title: 'Data flow should use HTTP/S',
                                    type: 'Information disclosure',
                                    description:
                                        'These responses are over the public internet and could be intercepted by an attacker.',
                                    mitigation:
                                        'The requests should require HTTP/S. This will provide confidentiality and integrity. HTTP should not be supported.',
                                    modelType: 'STRIDE',
                                    id: '2cba4931-e49c-4d4c-ad7c-d2de4875f15a'
                                }
                            ],
                            isTrustBoundary: false
                        },
                        id: '28d7c778-8fdf-43d6-9461-b25281743883',
                        source: {
                            cell: '0d9909ea-1398-4898-be81-cf1c808324dc'
                        },
                        target: {
                            cell: 'b394f9f7-07ca-42bc-b616-ad77c6fbfcce'
                        },
                        vertices: [
                            {
                                x: 90,
                                y: 170
                            }
                        ]
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                strokeWidth: 1,
                                targetMarker: {
                                    name: 'block'
                                },
                                strokeDasharray: '2 2'
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
                                        text: 'Read web app config',
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
                                position: 0.5
                            }
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'Read web app config',
                            description: '',
                            outOfScope: true,
                            reasonOutOfScope:
                                'This data flow represents a read from the file system',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: [],
                            isTrustBoundary: false
                        },
                        id: '7e039c91-9a2e-4ded-890a-0d9bf06c8b47',
                        source: {
                            cell: 'bdd3e115-4b92-4020-90b7-c3351dba292b'
                        },
                        target: {
                            cell: '0d9909ea-1398-4898-be81-cf1c808324dc'
                        },
                        vertices: [
                            {
                                x: 157,
                                y: 292
                            }
                        ]
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                strokeWidth: 1,
                                targetMarker: {
                                    name: 'block'
                                },
                                strokeDasharray: '2 2'
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
                                        text: 'Read worker config',
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
                                position: 0.5
                            }
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'Read worker config',
                            description: '',
                            outOfScope: true,
                            reasonOutOfScope:
                                'This data flow represents a read from the file system',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: [],
                            isTrustBoundary: false
                        },
                        id: '9c2171c8-f3aa-48db-91a4-3fa255b7c620',
                        source: {
                            cell: 'a25bbb4e-093f-4238-a620-31efdee452dc'
                        },
                        target: {
                            cell: '3e75b596-9c70-41b6-a2cf-a15899c254d3'
                        },
                        vertices: [
                            {
                                x: 810,
                                y: 310
                            }
                        ]
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                strokeWidth: 1,
                                targetMarker: {
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
                                        text: 'Queries',
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
                                position: 0.5
                            }
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'Queries',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: true,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: [],
                            isTrustBoundary: false
                        },
                        id: '8a9007e8-ae66-4568-84c7-9bcbc1e2fdab',
                        source: {
                            cell: '0d9909ea-1398-4898-be81-cf1c808324dc'
                        },
                        target: {
                            cell: '936557f9-22e2-4bac-bb70-0089c5c2fbe1'
                        },
                        vertices: [
                            {
                                x: 311,
                                y: 324
                            }
                        ]
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                strokeWidth: 1,
                                targetMarker: {
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
                                        text: 'Web App Query\nResults',
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
                                position: 0.5
                            }
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'Web App Query\nResults',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: true,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: [],
                            isTrustBoundary: false
                        },
                        id: 'd071f844-374b-4957-8664-4f53ec0807cc',
                        source: {
                            cell: '936557f9-22e2-4bac-bb70-0089c5c2fbe1'
                        },
                        target: {
                            cell: '0d9909ea-1398-4898-be81-cf1c808324dc'
                        },
                        vertices: [
                            {
                                x: 377,
                                y: 280
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
                                        text: 'Worker Queries',
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
                            name: 'Worker Queries',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: [],
                            isTrustBoundary: false
                        },
                        id: '7efaaa0f-402c-4fc7-b9b8-449cfdb10026',
                        source: {
                            cell: '3e75b596-9c70-41b6-a2cf-a15899c254d3'
                        },
                        target: {
                            cell: '936557f9-22e2-4bac-bb70-0089c5c2fbe1'
                        },
                        vertices: [
                            {
                                x: 560,
                                y: 400
                            }
                        ]
                    },
                    {
                        shape: 'trust-boundary-curve',
                        attrs: {
                            line: {
                                targetMarker: '',
                                sourceMarker: ''
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
                                    },
                                    text: {
                                        text: ''
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
                            name: '',
                            description: '',
                            isTrustBoundary: true,
                            hasOpenThreats: false
                        },
                        id: '6767506f-3d7f-4a5f-bbe2-ea03689d30fc',
                        source: {
                            x: 350,
                            y: 10
                        },
                        target: {
                            x: 810,
                            y: 150
                        },
                        vertices: [
                            {
                                x: 333,
                                y: 117
                            },
                            {
                                x: 432,
                                y: 180
                            }
                        ]
                    },
                    {
                        shape: 'trust-boundary-curve',
                        attrs: {
                            line: {
                                targetMarker: '',
                                sourceMarker: ''
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
                                    },
                                    text: {
                                        text: ''
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
                            name: '',
                            description: '',
                            isTrustBoundary: true,
                            hasOpenThreats: false
                        },
                        id: '4a7911c8-2493-46cc-960f-1b248b176d15',
                        source: {
                            x: 230,
                            y: 520
                        },
                        target: {
                            x: 660,
                            y: 510
                        },
                        vertices: [
                            {
                                x: 320,
                                y: 280
                            },
                            {
                                x: 590,
                                y: 250
                            },
                            {
                                x: 660,
                                y: 350
                            }
                        ]
                    },
                    {
                        shape: 'trust-boundary-curve',
                        attrs: {
                            line: {
                                targetMarker: '',
                                sourceMarker: ''
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
                                    },
                                    text: {
                                        text: ''
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
                            name: '',
                            description: '',
                            isTrustBoundary: true,
                            hasOpenThreats: false
                        },
                        id: '0adc088b-ebb1-46be-af7b-36112c60c419',
                        source: {
                            x: 40,
                            y: 240
                        },
                        target: {
                            x: 290,
                            y: 10
                        },
                        vertices: [
                            {
                                x: 276,
                                y: 149
                            }
                        ]
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                strokeWidth: 1,
                                targetMarker: {
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
                                        text: 'Web Request (HTTP/S)',
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
                                position: 0.5
                            }
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'Web Request',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: true,
                            isPublicNetwork: true,
                            protocol: 'HTTP/S',
                            threats: [
                                {
                                    status: 'Mitigated',
                                    severity: 'High',
                                    title: 'Data flow should use HTTP/S',
                                    type: 'Information disclosure',
                                    description:
                                        'These requests are made over the public internet and could be intercepted by an attacker.',
                                    mitigation:
                                        'The requests should require HTTP/S. This will provide confidentiality and integrity. HTTP should not be supported.',
                                    modelType: 'STRIDE',
                                    id: '79cbaf10-e5a2-4fd6-9818-7f180a113938'
                                }
                            ],
                            isTrustBoundary: false
                        },
                        id: '2d84bfae-f1ed-49e5-8542-10a02f4a1c57',
                        source: {
                            x: 180,
                            y: 70
                        },
                        target: {
                            cell: '0d9909ea-1398-4898-be81-cf1c808324dc'
                        },
                        vertices: [
                            {
                                x: 190,
                                y: 80
                            },
                            {
                                x: 190,
                                y: 110
                            },
                            {
                                x: 210,
                                y: 130
                            }
                        ]
                    },
                    {
                        position: {
                            x: 760,
                            y: 60.00000000000041
                        },
                        size: {
                            width: 310,
                            height: 70
                        },
                        attrs: {
                            text: {
                                text: 'A Demo Threat Model\nshowing an example web application,\nwith a queue-decoupled background process'
                            }
                        },
                        visible: true,
                        shape: 'td-text-block',
                        zIndex: 11,
                        id: '4fee5fea-0c82-4ea5-a925-7c6d3257101e',
                        data: {
                            type: 'tm.Text',
                            name: 'A Demo Threat Model\nshowing an example web application,\nwith a queue-decoupled background process',
                            hasOpenThreats: false
                        }
                    }
                ],
                version: '2.3.0',
                title: 'Main Request Data Flow',
                description: '',
                thumbnail: './public/content/images/thumbnail.stride.jpg',
                diagramType: 'STRIDE',
                id: 0
            }
        ],
        diagramTop: 0,
        reviewer: 'Jane Smith',
        threatTop: 0
    },
    version: '2.3.0'
};
