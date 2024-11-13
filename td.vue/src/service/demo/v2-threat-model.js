export default {
    'summary': {
        'title': 'Demo Threat Model',
        'owner': 'Mike Goodwin',
        'description': 'A sample model of a web application, with a queue-decoupled background process.',
        'id': 0
    },
    'detail': {
        'contributors': [
            {
                'name': 'Tom Brown'
            },
            {
                'name': 'Albert Moneypenny'
            }
        ],
        'diagrams': [
            {
                'cells': [
                    {
                        'position': {
                            'x': 565,
                            'y': 414
                        },
                        'size': {
                            'width': 160,
                            'height': 80
                        },
                        'attrs': {
                            'text': {
                                'text': 'Worker Config'
                            },
                            'topLine': {
                                'stroke': 'red',
                                'strokeWidth': 2.5,
                                'strokeDasharray': null
                            },
                            'bottomLine': {
                                'stroke': 'red',
                                'strokeWidth': 2.5,
                                'strokeDasharray': null
                            }
                        },
                        'shape': 'store',
                        'id': 'a25bbb4e-093f-4238-a620-31efdee452dc',
                        'zIndex': 1,
                        'data': {
                            'name': 'Worker Config',
                            'description': '',
                            'type': 'tm.Store',
                            'isTrustBoundary': false,
                            'outOfScope': false,
                            'reasonOutOfScope': '',
                            'threats': [
                                {
                                    'status': 'Open',
                                    'severity': 'High',
                                    'mitigation': 'Encrypt the DB credentials in the configuration file.\n\nExpire and replace the DB credentials regularly.',
                                    'description': 'The Background Worker configuration stores the credentials used by the worker to access the DB. An attacker could compromise the Background Worker and get access to the DB credentials.',
                                    'title': 'Accessing DB credentials',
                                    'type': 'Information disclosure',
                                    'modelType': 'STRIDE',
                                    'id': '7df716cd-a982-48a5-b4ed-800ccb670734'
                                }
                            ],
                            'hasOpenThreats': true,
                            'isALog': false,
                            'storesCredentials': true,
                            'isEncrypted': false,
                            'isSigned': false
                        }
                    },
                    {
                        'position': {
                            'x': 290,
                            'y': 420
                        },
                        'size': {
                            'width': 160,
                            'height': 80
                        },
                        'attrs': {
                            'text': {
                                'text': 'Database'
                            },
                            'topLine': {
                                'stroke': 'red',
                                'strokeWidth': 2.5,
                                'strokeDasharray': null
                            },
                            'bottomLine': {
                                'stroke': 'red',
                                'strokeWidth': 2.5,
                                'strokeDasharray': null
                            }
                        },
                        'shape': 'store',
                        'id': '936557f9-22e2-4bac-bb70-0089c5c2fbe1',
                        'zIndex': 2,
                        'data': {
                            'name': 'Database',
                            'description': '',
                            'type': 'tm.Store',
                            'isTrustBoundary': false,
                            'outOfScope': false,
                            'reasonOutOfScope': '',
                            'threats': [
                                {
                                    'status': 'Mitigated',
                                    'severity': 'High',
                                    'description': 'An attacker could make an query call on the DB,',
                                    'title': 'Unauthorised access',
                                    'type': 'Information disclosure',
                                    'mitigation': 'Require all queries to be authenticated.',
                                    'modelType': 'STRIDE',
                                    'id': '21fc4b20-ca29-4891-9691-d8f0331b2a11'
                                },
                                {
                                    'status': 'Open',
                                    'severity': 'Medium',
                                    'description': 'An attacker could obtain the DB credentials and use them to make unauthorised queries.',
                                    'title': 'Credential theft',
                                    'type': 'Information disclosure',
                                    'mitigation': 'Use a firewall to restrict access to the DB to only the Background Worker IP address.',
                                    'modelType': 'STRIDE',
                                    'id': 'e12765bf-ec61-47d8-8e9f-6bb3f5adab47'
                                }
                            ],
                            'hasOpenThreats': true,
                            'isALog': true,
                            'storesCredentials': false,
                            'isEncrypted': false,
                            'isSigned': false
                        }
                    },
                    {
                        'position': {
                            'x': 40,
                            'y': 420
                        },
                        'size': {
                            'width': 160,
                            'height': 80
                        },
                        'attrs': {
                            'text': {
                                'text': 'Web Application Config'
                            },
                            'topLine': {
                                'stroke': 'red',
                                'strokeWidth': 2.5,
                                'strokeDasharray': '4 3'
                            },
                            'bottomLine': {
                                'stroke': 'red',
                                'strokeWidth': 2.5,
                                'strokeDasharray': '4 3'
                            }
                        },
                        'shape': 'store',
                        'id': 'bdd3e115-4b92-4020-90b7-c3351dba292b',
                        'zIndex': 3,
                        'data': {
                            'name': 'Web Application Config',
                            'description': '',
                            'type': 'tm.Store',
                            'isTrustBoundary': false,
                            'outOfScope': true,
                            'reasonOutOfScope': '',
                            'threats': [
                                {
                                    'status': 'Open',
                                    'severity': 'High',
                                    'title': 'Credentials should be encrypted',
                                    'type': 'Information disclosure',
                                    'description': 'The Web Application Config stores credentials used by the Web App to access the message queue. These could be stolen by an attacker and used to read confidential data or place poison message on the queue.',
                                    'mitigation': 'The Message Queue credentials should be encrypted.',
                                    'modelType': 'STRIDE',
                                    'id': 'aaea0238-2984-4b25-8268-3798e63bed34'
                                }
                            ],
                            'hasOpenThreats': true,
                            'isALog': false,
                            'storesCredentials': true,
                            'isEncrypted': false,
                            'isSigned': false
                        }
                    },
                    {
                        'position': {
                            'x': 502,
                            'y': 13
                        },
                        'size': {
                            'width': 160,
                            'height': 80
                        },
                        'attrs': {
                            'text': {
                                'text': 'Message Queue'
                            },
                            'topLine': {
                                'stroke': 'red',
                                'strokeWidth': 2.5,
                                'strokeDasharray': null
                            },
                            'bottomLine': {
                                'stroke': 'red',
                                'strokeWidth': 2.5,
                                'strokeDasharray': null
                            }
                        },
                        'shape': 'store',
                        'id': 'ec574fb4-87e7-494b-88dc-2a3c99172067',
                        'zIndex': 4,
                        'data': {
                            'name': 'Message Queue',
                            'description': '',
                            'type': 'tm.Store',
                            'isTrustBoundary': false,
                            'outOfScope': false,
                            'reasonOutOfScope': '',
                            'threats': [
                                {
                                    'status': 'Open',
                                    'severity': 'Low',
                                    'title': 'Message secrecy',
                                    'type': 'Information disclosure',
                                    'description': 'The data flow between the Web Application and the Background Worker is not point-to-point and therefore end-to-end secrecy cannot be provided at the transport layer. Messages could be read by an attacker at rest in the Message Queue.',
                                    'mitigation': 'Use message level encryption for high sensitivity data (e.g. security tokens) in messages.',
                                    'modelType': 'STRIDE',
                                    'id': '7bc090cc-50a1-44aa-8481-5e4daaa6d8ba'
                                },
                                {
                                    'status': 'Open',
                                    'severity': 'Medium',
                                    'title': 'Message tampering',
                                    'type': 'Tampering',
                                    'description': 'Messages on the queue could be tampered with, causing incorrect processing by the Background Worker.',
                                    'mitigation': 'Sign all queue messages at the Web Server. Validate the message signature at the Background Worker and reject any message with a missing or invalid signature. Log any failed messages.',
                                    'modelType': 'STRIDE',
                                    'id': '52ba8c1d-8376-4ede-942d-e575d71eaef5'
                                },
                                {
                                    'status': 'Mitigated',
                                    'severity': 'High',
                                    'title': 'Fake messages could be placed on the queue',
                                    'type': 'Spoofing',
                                    'description': 'An attacker could put a fake message on queue, causing the Background Worker to do incorrect processing.',
                                    'mitigation': 'Restrict access to the queue to the IP addresses of the Web Server and Background Worker.\n\nImplement authentication on the queue endpoint.',
                                    'modelType': 'STRIDE',
                                    'id': 'b917c6dd-e2d5-455c-8b81-61407126abfa'
                                }
                            ],
                            'hasOpenThreats': true,
                            'isALog': false,
                            'storesCredentials': false,
                            'isEncrypted': false,
                            'isSigned': false
                        }
                    },
                    {
                        'position': {
                            'x': 560,
                            'y': 180
                        },
                        'size': {
                            'width': 100,
                            'height': 100
                        },
                        'attrs': {
                            'text': {
                                'text': 'Background\nWorker Process'
                            },
                            'body': {
                                'stroke': 'red',
                                'strokeWidth': 2.5,
                                'strokeDasharray': null
                            }
                        },
                        'shape': 'process',
                        'zIndex': 5,
                        'id': '3e75b596-9c70-41b6-a2cf-a15899c254d3',
                        'data': {
                            'name': 'Background\nWorker Process',
                            'description': '',
                            'type': 'tm.Process',
                            'isTrustBoundary': false,
                            'outOfScope': false,
                            'reasonOutOfScope': '',
                            'threats': [
                                {
                                    'status': 'Open',
                                    'severity': 'Medium',
                                    'title': 'Poison messages 1',
                                    'type': 'Denial of service',
                                    'description': 'An attacker could generate a malicious message that the Background Worker cannot process.',
                                    'mitigation': 'Implement a poison message queue where messages are placed after a fixed number of retries.',
                                    'modelType': 'STRIDE',
                                    'id': '1468b37f-3ff9-4079-8767-f33bbfe0a887'
                                },
                                {
                                    'status': 'Open',
                                    'severity': 'Medium',
                                    'mitigation': 'Validate the content of all messages, before processing. Reject any message that have invalid content and log the rejection. Do not log the malicious content - instead log a description of the error.',
                                    'type': 'Denial of service',
                                    'title': 'Poison messages 2',
                                    'description': 'An attacker could generate a malicious message that the Background Worker cannot process.',
                                    'modelType': 'STRIDE',
                                    'id': '3c8033db-0e51-42c0-afd0-d01d2ced4a14'
                                }
                            ],
                            'hasOpenThreats': true
                        }
                    },
                    {
                        'position': {
                            'x': 210,
                            'y': 180
                        },
                        'size': {
                            'width': 100,
                            'height': 100
                        },
                        'attrs': {
                            'text': {
                                'text': 'Web\nApplication'
                            },
                            'body': {
                                'stroke': '#333333',
                                'strokeWidth': 1,
                                'strokeDasharray': null
                            }
                        },
                        'shape': 'process',
                        'zIndex': 6,
                        'id': '0d9909ea-1398-4898-be81-cf1c808324dc',
                        'data': {
                            'name': 'Web\nApplication',
                            'description': '',
                            'type': 'tm.Process',
                            'isTrustBoundary': false,
                            'outOfScope': false,
                            'reasonOutOfScope': '',
                            'threats': [],
                            'hasOpenThreats': false
                        }
                    },
                    {
                        'position': {
                            'x': 40,
                            'y': 29
                        },
                        'size': {
                            'width': 160,
                            'height': 80
                        },
                        'attrs': {
                            'text': {
                                'text': 'Browser'
                            },
                            'body': {
                                'stroke': '#333333',
                                'strokeWidth': 1,
                                'strokeDasharray': null
                            }
                        },
                        'shape': 'actor',
                        'zIndex': 7,
                        'id': 'b394f9f7-07ca-42bc-b616-ad77c6fbfcce',
                        'data': {
                            'name': 'Browser',
                            'description': '',
                            'type': 'tm.Actor',
                            'isTrustBoundary': false,
                            'outOfScope': false,
                            'reasonOutOfScope': '',
                            'threats': [],
                            'hasOpenThreats': false,
                            'providesAuthentication': false
                        }
                    },
                    {
                        'shape': 'trust-boundary-curve',
                        'attrs': {
                            'line': {
                                'targetMarker': '',
                                'sourceMarker': ''
                            }
                        },
                        'width': 200,
                        'height': 100,
                        'zIndex': 10,
                        'connector': 'smooth',
                        'labels': [
                            {
                                'attrs': {
                                    'text': {
                                        'text': ''
                                    }
                                }
                            }
                        ],
                        'data': {
                            'type': 'tm.Boundary',
                            'name': '',
                            'description': '',
                            'isTrustBoundary': true,
                            'hasOpenThreats': false
                        },
                        'id': '0adc088b-ebb1-46be-af7b-36112c60c419',
                        'source': {
                            'x': 80,
                            'y': 220
                        },
                        'target': {
                            'x': 295,
                            'y': 51
                        },
                        'vertices': [
                            {
                                'x': 276,
                                'y': 149
                            }
                        ]
                    },
                    {
                        'shape': 'trust-boundary-curve',
                        'attrs': {
                            'line': {
                                'targetMarker': '',
                                'sourceMarker': ''
                            }
                        },
                        'width': 200,
                        'height': 100,
                        'zIndex': 10,
                        'connector': 'smooth',
                        'labels': [
                            {
                                'attrs': {
                                    'text': {
                                        'text': ''
                                    }
                                }
                            }
                        ],
                        'data': {
                            'type': 'tm.Boundary',
                            'name': '',
                            'description': '',
                            'isTrustBoundary': true,
                            'hasOpenThreats': false
                        },
                        'id': '6767506f-3d7f-4a5f-bbe2-ea03689d30fc',
                        'source': {
                            'x': 350,
                            'y': 10
                        },
                        'target': {
                            'x': 663,
                            'y': 156
                        },
                        'vertices': [
                            {
                                'x': 333,
                                'y': 117
                            },
                            {
                                'x': 432,
                                'y': 180
                            }
                        ]
                    },
                    {
                        'shape': 'flow',
                        'attrs': {
                            'line': {
                                'stroke': '#333333',
                                'strokeWidth': 1,
                                'targetMarker': {
                                    'name': 'block'
                                },
                                'strokeDasharray': null
                            }
                        },
                        'width': 200,
                        'height': 100,
                        'zIndex': 10,
                        'connector': 'smooth',
                        'data': {
                            'type': 'tm.Flow',
                            'name': 'Web Request',
                            'description': '',
                            'outOfScope': false,
                            'reasonOutOfScope': '',
                            'protocol': 'HTTP/S',
                            'isEncrypted': true,
                            'isPublicNetwork': true,
                            'hasOpenThreats': false,
                            'threats': [
                                {
                                    'status': 'Mitigated',
                                    'severity': 'High',
                                    'title': 'Data flow should use HTTP/S',
                                    'type': 'Information disclosure',
                                    'description': 'These requests are made over the public internet and could be intercepted by an attacker.',
                                    'mitigation': 'The requests should require HTTP/S. This will provide confidentiality and integrity. HTTP should not be supported.',
                                    'modelType': 'STRIDE',
                                    'id': '79cbaf10-e5a2-4fd6-9818-7f180a113938'
                                }
                            ],
                            'isTrustBoundary': false
                        },
                        'id': '2d84bfae-f1ed-49e5-8542-10a02f4a1c57',
                        'labels': [
                            {
                                'position': 0.5,
                                'attrs': {
                                    'label': {
                                        'text': 'Web Request (HTTP/S)'
                                    }
                                }
                            }
                        ],
                        'source': {
                            'cell': 'b394f9f7-07ca-42bc-b616-ad77c6fbfcce'
                        },
                        'target': {
                            'cell': '0d9909ea-1398-4898-be81-cf1c808324dc'
                        },
                        'vertices': [
                            {
                                'x': 245,
                                'y': 112
                            }
                        ]
                    },
                    {
                        'shape': 'flow',
                        'attrs': {
                            'line': {
                                'stroke': 'red',
                                'targetMarker': {
                                    'name': 'block'
                                },
                                'strokeDasharray': null
                            }
                        },
                        'width': 200,
                        'height': 100,
                        'zIndex': 10,
                        'connector': 'smooth',
                        'data': {
                            'type': 'tm.Flow',
                            'name': 'Put Message',
                            'description': '',
                            'outOfScope': false,
                            'reasonOutOfScope': '',
                            'protocol': '',
                            'isEncrypted': false,
                            'isPublicNetwork': false,
                            'hasOpenThreats': true,
                            'threats': [
                                {
                                    'status': 'Open',
                                    'severity': 'High',
                                    'description': 'These requests are made over the public internet and could be intercepted by an attacker.',
                                    'title': 'Data flow should use HTTP/S',
                                    'type': 'Information disclosure',
                                    'mitigation': 'The requests should require HTTP/S. This will provide confidentiality and integrity. HTTP should not be supported.',
                                    'modelType': 'STRIDE',
                                    'id': 'f8cc4477-653f-4e4a-a0cb-7b90f046fd7b'
                                }
                            ],
                            'isTrustBoundary': false
                        },
                        'id': 'c779a822-d4ec-4237-9191-fe7170b32956',
                        'labels': [
                            {
                                'position': 0.5,
                                'attrs': {
                                    'label': {
                                        'text': 'Put Message'
                                    }
                                }
                            }
                        ],
                        'source': {
                            'cell': '0d9909ea-1398-4898-be81-cf1c808324dc'
                        },
                        'target': {
                            'cell': 'ec574fb4-87e7-494b-88dc-2a3c99172067'
                        },
                        'vertices': [
                            {
                                'x': 351,
                                'y': 120
                            }
                        ]
                    },
                    {
                        'shape': 'flow',
                        'attrs': {
                            'line': {
                                'stroke': 'red',
                                'targetMarker': {
                                    'name': 'block'
                                },
                                'strokeDasharray': null
                            }
                        },
                        'width': 200,
                        'height': 100,
                        'zIndex': 10,
                        'connector': 'smooth',
                        'data': {
                            'type': 'tm.Flow',
                            'name': 'Message',
                            'description': '',
                            'outOfScope': false,
                            'reasonOutOfScope': '',
                            'protocol': '',
                            'isEncrypted': false,
                            'isPublicNetwork': false,
                            'hasOpenThreats': true,
                            'threats': [
                                {
                                    'status': 'Open',
                                    'severity': 'High',
                                    'mitigation': 'The requests should require HTTP/S. This will provide confidentiality and integrity. HTTP should not be supported.',
                                    'type': 'Information disclosure',
                                    'title': 'Data flow should use HTTP/S',
                                    'description': 'These requests are made over the public internet and could be intercepted by an attacker.',
                                    'modelType': 'STRIDE',
                                    'id': '2fcfb064-6a08-4771-9d9d-342639d63d7b'
                                }
                            ],
                            'isTrustBoundary': false
                        },
                        'id': '552b5603-41c9-4458-83f2-01a6490a41b8',
                        'labels': [
                            {
                                'position': 0.5,
                                'attrs': {
                                    'label': {
                                        'text': 'Message'
                                    }
                                }
                            }
                        ],
                        'source': {
                            'cell': 'ec574fb4-87e7-494b-88dc-2a3c99172067'
                        },
                        'target': {
                            'cell': '3e75b596-9c70-41b6-a2cf-a15899c254d3'
                        },
                        'vertices': [
                            {
                                'x': 544,
                                'y': 127
                            }
                        ]
                    },
                    {
                        'shape': 'flow',
                        'attrs': {
                            'line': {
                                'stroke': 'red',
                                'targetMarker': {
                                    'name': 'block'
                                },
                                'strokeDasharray': null
                            }
                        },
                        'width': 200,
                        'height': 100,
                        'zIndex': 10,
                        'connector': 'smooth',
                        'data': {
                            'type': 'tm.Flow',
                            'name': 'Worker Query Results',
                            'description': '',
                            'outOfScope': false,
                            'reasonOutOfScope': '',
                            'protocol': '',
                            'isEncrypted': false,
                            'isPublicNetwork': false,
                            'hasOpenThreats': true,
                            'threats': [
                                {
                                    'status': 'Open',
                                    'severity': 'Low',
                                    'title': 'Man in the middle attack',
                                    'type': 'Information disclosure',
                                    'mitigation': 'Enforce an encrypted connection at the DB server',
                                    'description': 'An attacker could intercept the DB queries in transit and obtain sensitive information, such as DB credentials, query parameters or query results (is unlikely since the data flow is over a private network).',
                                    'modelType': 'STRIDE',
                                    'id': '72b9712b-2c08-40b1-aea6-57604e82f5f4'
                                }
                            ],
                            'isTrustBoundary': false
                        },
                        'id': '1d981aac-90a7-464e-9491-3456bc6e593c',
                        'labels': [
                            {
                                'position': 0.5,
                                'attrs': {
                                    'label': {
                                        'text': 'Worker Query Results'
                                    }
                                }
                            }
                        ],
                        'source': {
                            'cell': '936557f9-22e2-4bac-bb70-0089c5c2fbe1'
                        },
                        'target': {
                            'cell': '3e75b596-9c70-41b6-a2cf-a15899c254d3'
                        },
                        'vertices': [
                            {
                                'x': 466,
                                'y': 347
                            }
                        ]
                    },
                    {
                        'shape': 'trust-boundary-curve',
                        'attrs': {
                            'line': {
                                'targetMarker': '',
                                'sourceMarker': ''
                            }
                        },
                        'width': 200,
                        'height': 100,
                        'zIndex': 10,
                        'connector': 'smooth',
                        'labels': [
                            {
                                'attrs': {
                                    'text': {
                                        'text': ''
                                    }
                                }
                            }
                        ],
                        'data': {
                            'type': 'tm.Boundary',
                            'name': '',
                            'description': '',
                            'isTrustBoundary': true,
                            'hasOpenThreats': false
                        },
                        'id': '4a7911c8-2493-46cc-960f-1b248b176d15',
                        'source': {
                            'x': 241,
                            'y': 444
                        },
                        'target': {
                            'x': 526,
                            'y': 465
                        },
                        'vertices': [
                            {
                                'x': 333,
                                'y': 288
                            },
                            {
                                'x': 488,
                                'y': 267
                            },
                            {
                                'x': 552,
                                'y': 339
                            }
                        ]
                    },
                    {
                        'shape': 'flow',
                        'attrs': {
                            'line': {
                                'stroke': '#333333',
                                'strokeWidth': 1,
                                'targetMarker': {
                                    'name': 'block'
                                },
                                'strokeDasharray': null
                            }
                        },
                        'width': 200,
                        'height': 100,
                        'zIndex': 10,
                        'connector': 'smooth',
                        'data': {
                            'type': 'tm.Flow',
                            'name': 'Web Response',
                            'description': '',
                            'outOfScope': false,
                            'reasonOutOfScope': '',
                            'protocol': 'HTTP/S',
                            'isEncrypted': true,
                            'isPublicNetwork': true,
                            'hasOpenThreats': false,
                            'threats': [
                                {
                                    'status': 'Mitigated',
                                    'severity': 'High',
                                    'title': 'Data flow should use HTTP/S',
                                    'type': 'Information disclosure',
                                    'description': 'These responses are over the public internet and could be intercepted by an attacker.',
                                    'mitigation': 'The requests should require HTTP/S. This will provide confidentiality and integrity. HTTP should not be supported.',
                                    'modelType': 'STRIDE',
                                    'id': '2cba4931-e49c-4d4c-ad7c-d2de4875f15a'
                                }
                            ],
                            'isTrustBoundary': false
                        },
                        'id': '28d7c778-8fdf-43d6-9461-b25281743883',
                        'labels': [
                            {
                                'position': 0.5,
                                'attrs': {
                                    'label': {
                                        'text': 'Web Response (HTTP/S)'
                                    }
                                }
                            }
                        ],
                        'source': {
                            'cell': '0d9909ea-1398-4898-be81-cf1c808324dc'
                        },
                        'target': {
                            'cell': 'b394f9f7-07ca-42bc-b616-ad77c6fbfcce'
                        },
                        'vertices': [
                            {
                                'x': 111,
                                'y': 175
                            }
                        ]
                    },
                    {
                        'shape': 'flow',
                        'attrs': {
                            'line': {
                                'stroke': '#333333',
                                'strokeWidth': 1,
                                'targetMarker': {
                                    'name': 'block'
                                },
                                'strokeDasharray': '2 2'
                            }
                        },
                        'width': 200,
                        'height': 100,
                        'zIndex': 10,
                        'connector': 'smooth',
                        'data': {
                            'type': 'tm.Flow',
                            'name': 'Read web app config',
                            'description': '',
                            'outOfScope': true,
                            'reasonOutOfScope': 'This data flow represents a read from the file system',
                            'protocol': '',
                            'isEncrypted': false,
                            'isPublicNetwork': false,
                            'hasOpenThreats': false,
                            'threats': [],
                            'isTrustBoundary': false
                        },
                        'id': '7e039c91-9a2e-4ded-890a-0d9bf06c8b47',
                        'labels': [
                            {
                                'position': 0.5,
                                'attrs': {
                                    'label': {
                                        'text': 'Read web app config'
                                    }
                                }
                            }
                        ],
                        'source': {
                            'cell': 'bdd3e115-4b92-4020-90b7-c3351dba292b'
                        },
                        'target': {
                            'cell': '0d9909ea-1398-4898-be81-cf1c808324dc'
                        },
                        'vertices': [
                            {
                                'x': 157,
                                'y': 292
                            }
                        ]
                    },
                    {
                        'shape': 'flow',
                        'attrs': {
                            'line': {
                                'stroke': '#333333',
                                'strokeWidth': 1,
                                'targetMarker': {
                                    'name': 'block'
                                },
                                'strokeDasharray': '2 2'
                            }
                        },
                        'width': 200,
                        'height': 100,
                        'zIndex': 10,
                        'connector': 'smooth',
                        'data': {
                            'type': 'tm.Flow',
                            'name': 'Read worker config',
                            'description': '',
                            'outOfScope': true,
                            'reasonOutOfScope': 'This data flow represents a read from the file system',
                            'protocol': '',
                            'isEncrypted': false,
                            'isPublicNetwork': false,
                            'hasOpenThreats': false,
                            'threats': [],
                            'isTrustBoundary': false
                        },
                        'id': '9c2171c8-f3aa-48db-91a4-3fa255b7c620',
                        'labels': [
                            {
                                'position': 0.5,
                                'attrs': {
                                    'label': {
                                        'text': 'Read worker config'
                                    }
                                }
                            }
                        ],
                        'source': {
                            'cell': 'a25bbb4e-093f-4238-a620-31efdee452dc'
                        },
                        'target': {
                            'cell': '3e75b596-9c70-41b6-a2cf-a15899c254d3'
                        },
                        'vertices': [
                            {
                                'x': 664,
                                'y': 320
                            }
                        ]
                    },
                    {
                        'shape': 'flow',
                        'attrs': {
                            'line': {
                                'stroke': '#333333',
                                'strokeWidth': 1,
                                'targetMarker': {
                                    'name': 'block'
                                },
                                'strokeDasharray': null
                            }
                        },
                        'width': 200,
                        'height': 100,
                        'zIndex': 10,
                        'connector': 'smooth',
                        'data': {
                            'type': 'tm.Flow',
                            'name': 'Queries',
                            'description': '',
                            'outOfScope': false,
                            'reasonOutOfScope': '',
                            'protocol': '',
                            'isEncrypted': true,
                            'isPublicNetwork': false,
                            'hasOpenThreats': false,
                            'threats': [],
                            'isTrustBoundary': false
                        },
                        'id': '8a9007e8-ae66-4568-84c7-9bcbc1e2fdab',
                        'labels': [
                            {
                                'position': 0.5,
                                'attrs': {
                                    'label': {
                                        'text': 'Queries'
                                    }
                                }
                            }
                        ],
                        'source': {
                            'cell': '0d9909ea-1398-4898-be81-cf1c808324dc'
                        },
                        'target': {
                            'cell': '936557f9-22e2-4bac-bb70-0089c5c2fbe1'
                        },
                        'vertices': [
                            {
                                'x': 311,
                                'y': 324
                            }
                        ]
                    },
                    {
                        'shape': 'flow',
                        'attrs': {
                            'line': {
                                'stroke': '#333333',
                                'strokeWidth': 1,
                                'targetMarker': {
                                    'name': 'block'
                                },
                                'strokeDasharray': null
                            }
                        },
                        'width': 200,
                        'height': 100,
                        'zIndex': 10,
                        'connector': 'smooth',
                        'data': {
                            'type': 'tm.Flow',
                            'name': 'Web App Query\nResults',
                            'description': '',
                            'outOfScope': false,
                            'reasonOutOfScope': '',
                            'protocol': '',
                            'isEncrypted': true,
                            'isPublicNetwork': false,
                            'hasOpenThreats': false,
                            'threats': [],
                            'isTrustBoundary': false
                        },
                        'id': 'd071f844-374b-4957-8664-4f53ec0807cc',
                        'labels': [
                            {
                                'position': 0.5,
                                'attrs': {
                                    'label': {
                                        'text': 'Web App Query\nResults'
                                    }
                                }
                            }
                        ],
                        'source': {
                            'cell': '936557f9-22e2-4bac-bb70-0089c5c2fbe1'
                        },
                        'target': {
                            'cell': '0d9909ea-1398-4898-be81-cf1c808324dc'
                        },
                        'vertices': [
                            {
                                'x': 377,
                                'y': 280
                            }
                        ]
                    },
                    {
                        'shape': 'flow',
                        'attrs': {
                            'line': {
                                'stroke': '#333333',
                                'strokeWidth': 1,
                                'targetMarker': {
                                    'name': 'block'
                                },
                                'strokeDasharray': null
                            }
                        },
                        'width': 200,
                        'height': 100,
                        'zIndex': 10,
                        'connector': 'smooth',
                        'data': {
                            'type': 'tm.Flow',
                            'name': 'Worker Queries',
                            'description': '',
                            'outOfScope': false,
                            'reasonOutOfScope': '',
                            'protocol': '',
                            'isEncrypted': false,
                            'isPublicNetwork': false,
                            'hasOpenThreats': false,
                            'threats': [],
                            'isTrustBoundary': false
                        },
                        'id': '7efaaa0f-402c-4fc7-b9b8-449cfdb10026',
                        'labels': [
                            {
                                'position': 0.5,
                                'attrs': {
                                    'label': {
                                        'text': 'Worker Queries'
                                    }
                                }
                            }
                        ],
                        'source': {
                            'cell': '3e75b596-9c70-41b6-a2cf-a15899c254d3'
                        },
                        'target': {
                            'cell': '936557f9-22e2-4bac-bb70-0089c5c2fbe1'
                        },
                        'vertices': [
                            {
                                'x': 552,
                                'y': 382
                            }
                        ]
                    }
                ],
                'version': '2.0',
                'title': 'Main Request Data Flow',
                'description': '',
                'thumbnail': './public/content/images/thumbnail.stride.jpg',
                'diagramType': 'STRIDE',
                'id': 0
            }
        ],
        'diagramTop': 0,
        'reviewer': 'Jane Smith',
        'threatTop': 0
    },
    'version': '2.0'
};
