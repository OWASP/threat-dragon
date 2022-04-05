export default `
{
  "summary": {
    "title": "Demo Threat Model",
    "owner": "Mike Goodwin",
    "description": "A sample model of a web application, with a queue-decoupled background process.",
    "id": 0
  },
  "detail": {
    "contributors": [
      {
        "name": "Tom Brown"
      },
      {
        "name": "Albert Moneypenny"
      }
    ],
    "diagrams": [
      {
        "cells": [
          {
            "position": {
              "x": 565,
              "y": 414
            },
            "size": {
              "width": 160,
              "height": 80
            },
            "attrs": {
              "text": {
                "text": "Worker Config"
              },
              "topLine": {
                "stroke": "red",
                "strokeWidth": 3,
                "strokeDasharray": null
              },
              "bottomLine": {
                "stroke": "red",
                "strokeWidth": 3,
                "strokeDasharray": null
              }
            },
            "shape": "store",
            "id": "a25bbb4e-093f-4238-a620-31efdee452dc",
            "zIndex": 1,
            "data": {
              "name": "Worker Config",
              "description": "",
              "type": "tm.Store",
              "isTrustBoundary": false,
              "outOfScope": false,
              "reasonOutOfScope": "",
              "threats": [
                {
                  "status": "Open",
                  "severity": "High",
                  "mitigation": "Encrypt the DB credentials in the configuration file.\n\nExpire and replace the DB credentials regularly.",
                  "description": "The Background Worker configuration stores the credentials used by the worker to access the DB. An attacker could compromise the Background Worker and get access to the DB credentials.",
                  "title": "Accessing DB credentials",
                  "type": "Information disclosure",
                  "modelType": "STRIDE",
                  "id": "051af553-a427-4131-9851-f2c90a3b2e38"
                }
              ],
              "hasOpenThreats": true,
              "isALog": false,
              "storesCredentials": true,
              "isEncrypted": false,
              "isSigned": false
            }
          },
          {
            "position": {
              "x": 290,
              "y": 420
            },
            "size": {
              "width": 160,
              "height": 80
            },
            "attrs": {
              "text": {
                "text": "Database"
              },
              "topLine": {
                "stroke": "red",
                "strokeWidth": 3,
                "strokeDasharray": null
              },
              "bottomLine": {
                "stroke": "red",
                "strokeWidth": 3,
                "strokeDasharray": null
              }
            },
            "shape": "store",
            "id": "936557f9-22e2-4bac-bb70-0089c5c2fbe1",
            "zIndex": 2,
            "data": {
              "name": "Database",
              "description": "",
              "type": "tm.Store",
              "isTrustBoundary": false,
              "outOfScope": false,
              "reasonOutOfScope": "",
              "threats": [
                {
                  "status": "Mitigated",
                  "severity": "High",
                  "description": "An attacker could make an query call on the DB,",
                  "title": "Unauthorised access",
                  "type": "Information disclosure",
                  "mitigation": "Require all queries to be authenticated.",
                  "modelType": "STRIDE",
                  "id": "61b1171d-482b-4786-8d18-56dc00b02b58"
                },
                {
                  "status": "Open",
                  "severity": "Medium",
                  "description": "An attacker could obtain the DB credentials ans use them to make unauthorised queries.",
                  "title": "Credential theft",
                  "type": "Information disclosure",
                  "mitigation": "Use a firewall to restrict access to the DB to only the Background Worker IP address.",
                  "modelType": "STRIDE",
                  "id": "7901fadc-0551-4238-840e-7600d1ce59a2"
                }
              ],
              "hasOpenThreats": true,
              "isALog": true,
              "storesCredentials": false,
              "isEncrypted": false,
              "isSigned": false
            }
          },
          {
            "position": {
              "x": 40,
              "y": 420
            },
            "size": {
              "width": 160,
              "height": 80
            },
            "attrs": {
              "text": {
                "text": "Web Application Config"
              },
              "topLine": {
                "stroke": "red",
                "strokeWidth": 3,
                "strokeDasharray": null
              },
              "bottomLine": {
                "stroke": "red",
                "strokeWidth": 3,
                "strokeDasharray": null
              }
            },
            "shape": "store",
            "id": "bdd3e115-4b92-4020-90b7-c3351dba292b",
            "zIndex": 3,
            "data": {
              "name": "Web Application Config",
              "description": "",
              "type": "tm.Store",
              "isTrustBoundary": false,
              "outOfScope": false,
              "reasonOutOfScope": "",
              "threats": [
                {
                  "status": "Open",
                  "severity": "High",
                  "title": "Credentials should be encrypted",
                  "type": "Information disclosure",
                  "description": "The Web Application Config stores credentials used  by the Web App to access the message queue. These could be stolen by an attacker and used to read confidential data or place poison message on the queue.",
                  "mitigation": "The Message Queue credentials should be encrypted.",
                  "modelType": "STRIDE",
                  "id": "7c93d838-eb0f-4373-8229-122a722cfcdb"
                }
              ],
              "hasOpenThreats": true,
              "isALog": false,
              "storesCredentials": true,
              "isEncrypted": false,
              "isSigned": false
            }
          },
          {
            "position": {
              "x": 502,
              "y": 13
            },
            "size": {
              "width": 160,
              "height": 80
            },
            "attrs": {
              "text": {
                "text": "Message Queue"
              },
              "topLine": {
                "stroke": "red",
                "strokeWidth": 3,
                "strokeDasharray": null
              },
              "bottomLine": {
                "stroke": "red",
                "strokeWidth": 3,
                "strokeDasharray": null
              }
            },
            "shape": "store",
            "id": "ec574fb4-87e7-494b-88dc-2a3c99172067",
            "zIndex": 4,
            "data": {
              "name": "Message Queue",
              "description": "",
              "type": "tm.Store",
              "isTrustBoundary": false,
              "outOfScope": false,
              "reasonOutOfScope": "",
              "threats": [
                {
                  "status": "Open",
                  "severity": "Low",
                  "title": "Message secrecy",
                  "type": "Information disclosure",
                  "description": "The data flow between the Web Application and the Background Worker is not point-to-point and therefore end-to-end secrecy cannot be provided at the transport layer. Messages could be read by an attacker at rest in the Message Queue.",
                  "mitigation": "Use message level encryption for high sensitivity data (e.g. security tokens) in messages.",
                  "modelType": "STRIDE",
                  "id": "dca31177-78b5-471c-aab0-01678008de43"
                },
                {
                  "status": "Open",
                  "severity": "Medium",
                  "title": "Message tampering",
                  "type": "Tampering",
                  "description": "Messages on the queue could be tampered with, causing incorrect processing by the Background Worker.",
                  "mitigation": "Sign all queue messages at the Web Server. Validate the message signature at the Background Worker and reject any message with a missing or invalid signature. Log any failed messages.",
                  "modelType": "STRIDE",
                  "id": "e2840e5b-f78b-4720-8e17-4d8f11fc257a"
                },
                {
                  "status": "Mitigated",
                  "severity": "High",
                  "title": "Fake messages could be placed on the queue",
                  "type": "Spoofing",
                  "description": "An attacker could put a fake message on queue, causing the Background Worker to do incorrect processing.",
                  "mitigation": "Restrict access to the queue to the IP addresses of the Web Server and Background Worker.\n\nImplement authentication on the queue endpoint.",
                  "modelType": "STRIDE",
                  "id": "2610b59d-9a76-4ecb-bf02-e1561d7b2ee4"
                }
              ],
              "hasOpenThreats": true,
              "isALog": false,
              "storesCredentials": false,
              "isEncrypted": false,
              "isSigned": false
            }
          },
          {
            "position": {
              "x": 560,
              "y": 180
            },
            "size": {
              "width": 100,
              "height": 100
            },
            "attrs": {
              "text": {
                "text": "Background\nWorker Process"
              },
              "body": {
                "stroke": "red",
                "strokeWidth": 3,
                "strokeDasharray": null
              }
            },
            "shape": "process",
            "zIndex": 5,
            "id": "3e75b596-9c70-41b6-a2cf-a15899c254d3",
            "data": {
              "name": "Background\nWorker Process",
              "description": "",
              "type": "tm.Process",
              "isTrustBoundary": false,
              "outOfScope": false,
              "reasonOutOfScope": "",
              "threats": [
                {
                  "status": "Open",
                  "severity": "Medium",
                  "title": "Poison messages 1",
                  "type": "Denial of service",
                  "description": "An attacker could generate a malicious message that the Background Worker cannot process.",
                  "mitigation": "Implement a poison message queue where messages are placed after a fixed number of retries.",
                  "modelType": "STRIDE",
                  "id": "5172e83b-055c-409a-b258-9c8c442bb959"
                },
                {
                  "status": "Open",
                  "severity": "Medium",
                  "mitigation": "Validate the content of all messages, before processing. Reject any message that have invalid content and log the rejection. Do not log the malicious content - instead log a description of the error.",
                  "type": "Denial of service",
                  "title": "Poison messages 2",
                  "description": "An attacker could generate a malicious message that the Background Worker cannot process.",
                  "modelType": "STRIDE",
                  "id": "c3606784-3a2e-4904-90bb-8351b9c628b8"
                }
              ],
              "hasOpenThreats": true
            }
          },
          {
            "position": {
              "x": 210,
              "y": 180
            },
            "size": {
              "width": 100,
              "height": 100
            },
            "attrs": {
              "text": {
                "text": "Web\nApplication"
              },
              "body": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "strokeDasharray": null
              }
            },
            "shape": "process",
            "zIndex": 6,
            "id": "0d9909ea-1398-4898-be81-cf1c808324dc",
            "data": {
              "name": "Web\nApplication",
              "description": "",
              "type": "tm.Process",
              "isTrustBoundary": false,
              "outOfScope": false,
              "reasonOutOfScope": "",
              "threats": [],
              "hasOpenThreats": false
            }
          },
          {
            "position": {
              "x": 40,
              "y": 29
            },
            "size": {
              "width": 160,
              "height": 80
            },
            "attrs": {
              "text": {
                "text": "Browser"
              },
              "body": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "strokeDasharray": null
              }
            },
            "shape": "actor",
            "zIndex": 7,
            "id": "b394f9f7-07ca-42bc-b616-ad77c6fbfcce",
            "data": {
              "name": "Browser",
              "description": "",
              "type": "tm.Actor",
              "isTrustBoundary": false,
              "outOfScope": false,
              "reasonOutOfScope": "",
              "threats": [],
              "hasOpenThreats": false,
              "providesAuthentication": false
            }
          },
          {
            "shape": "trust-broundary-curve",
            "attrs": {
              "line": {
                "targetMarker": "",
                "sourceMarker": ""
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "labels": [
              {
                "attrs": {
                  "text": {
                    "text": ""
                  }
                }
              }
            ],
            "data": {
              "type": "tm.Boundary",
              "name": "",
              "description": "",
              "isTrustBoundary": true,
              "hasOpenThreats": false
            },
            "id": "516aed02-3482-4800-b4c5-6d2ef29d5938",
            "source": {
              "x": 80,
              "y": 220
            },
            "target": {
              "x": 295,
              "y": 51
            },
            "vertices": [
              {
                "x": 276,
                "y": 149
              }
            ]
          },
          {
            "shape": "trust-broundary-curve",
            "attrs": {
              "line": {
                "targetMarker": "",
                "sourceMarker": ""
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "labels": [
              {
                "attrs": {
                  "text": {
                    "text": ""
                  }
                }
              }
            ],
            "data": {
              "type": "tm.Boundary",
              "name": "",
              "description": "",
              "isTrustBoundary": true,
              "hasOpenThreats": false
            },
            "id": "a82e33cd-0293-47bb-90a0-25bf0d15d2e5",
            "source": {
              "x": 350,
              "y": 10
            },
            "target": {
              "x": 663,
              "y": 156
            },
            "vertices": [
              {
                "x": 333,
                "y": 117
              },
              {
                "x": 432,
                "y": 180
              }
            ]
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "classic"
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Web Request",
              "description": "",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "protocol": "HTTP/S",
              "isEncrypted": true,
              "isPublicNetwork": true,
              "hasOpenThreats": false,
              "threats": [
                {
                  "status": "Mitigated",
                  "severity": "High",
                  "title": "Data flow should use HTTP/S",
                  "type": "Information disclosure",
                  "description": "These requests are made over the public internet and could be intercepted by an attacker.",
                  "mitigation": "The requests should require HTTP/S. This will provide confidentiality and integrity. HTTP should not be supported.",
                  "modelType": "STRIDE",
                  "id": "0618b3b0-2796-4945-b726-7b432da701c2"
                }
              ],
              "isTrustBoundary": false
            },
            "id": "9af640de-40b3-496c-be45-b039f40437d0",
            "labels": [
              {
                "position": 0.5,
                "attrs": {
                  "label": {
                    "text": "Web Request (HTTP/S)"
                  }
                }
              }
            ],
            "source": {
              "cell": "b394f9f7-07ca-42bc-b616-ad77c6fbfcce"
            },
            "target": {
              "cell": "0d9909ea-1398-4898-be81-cf1c808324dc"
            },
            "vertices": [
              {
                "x": 245,
                "y": 112
              }
            ]
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "targetMarker": {
                  "name": "classic"
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Put Message",
              "description": "",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "protocol": "",
              "isEncrypted": false,
              "isPublicNetwork": false,
              "hasOpenThreats": true,
              "threats": [
                {
                  "status": "Open",
                  "severity": "High",
                  "description": "These requests are made over the public internet and could be intercepted by an attacker.",
                  "title": "Data flow should use HTTP/S",
                  "type": "Information disclosure",
                  "mitigation": "The requests should require HTTP/S. This will provide confidentiality and integrity. HTTP should not be supported.",
                  "modelType": "STRIDE",
                  "id": "c32173bf-bbd7-42b5-ad10-a69c53e848fe"
                }
              ],
              "isTrustBoundary": false
            },
            "id": "f65d3bb5-75f2-4a7b-82b2-aaa6ba3c7941",
            "labels": [
              {
                "position": 0.5,
                "attrs": {
                  "label": {
                    "text": "Put Message"
                  }
                }
              }
            ],
            "source": {
              "cell": "0d9909ea-1398-4898-be81-cf1c808324dc"
            },
            "target": {
              "cell": "ec574fb4-87e7-494b-88dc-2a3c99172067"
            },
            "vertices": [
              {
                "x": 351,
                "y": 120
              }
            ]
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "targetMarker": {
                  "name": "classic"
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Message",
              "description": "",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "protocol": "",
              "isEncrypted": false,
              "isPublicNetwork": false,
              "hasOpenThreats": true,
              "threats": [
                {
                  "status": "Open",
                  "severity": "High",
                  "mitigation": "The requests should require HTTP/S. This will provide confidentiality and integrity. HTTP should not be supported.",
                  "type": "Information disclosure",
                  "title": "Data flow should use HTTP/S",
                  "description": "These requests are made over the public internet and could be intercepted by an attacker.",
                  "modelType": "STRIDE",
                  "id": "bfdf9655-bfef-41cb-b4f3-52e3941939db"
                }
              ],
              "isTrustBoundary": false
            },
            "id": "ebf2220f-eab0-490f-b8ee-967ac55ab717",
            "labels": [
              {
                "position": 0.5,
                "attrs": {
                  "label": {
                    "text": "Message"
                  }
                }
              }
            ],
            "source": {
              "cell": "ec574fb4-87e7-494b-88dc-2a3c99172067"
            },
            "target": {
              "cell": "3e75b596-9c70-41b6-a2cf-a15899c254d3"
            },
            "vertices": [
              {
                "x": 544,
                "y": 127
              }
            ]
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "red",
                "targetMarker": {
                  "name": "classic"
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Worker Query Results",
              "description": "",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "protocol": "",
              "isEncrypted": false,
              "isPublicNetwork": false,
              "hasOpenThreats": true,
              "threats": [
                {
                  "status": "Open",
                  "severity": "Low",
                  "title": "Man in the middle attack",
                  "type": "Information disclosure",
                  "mitigation": "Enforce an encrypted connection at the DB server",
                  "description": "An attacker could intercept the DB queries in transit and obtain sensitive information, such as DB credentials, query parameters or query results (is unlikely since the data flow is over a private network).",
                  "modelType": "STRIDE",
                  "id": "4a901d6a-73a8-457b-b9e9-60f70f38d510"
                }
              ],
              "isTrustBoundary": false
            },
            "id": "ce7a6ba0-c3ff-403d-8cfb-e795d92012fc",
            "labels": [
              {
                "position": 0.5,
                "attrs": {
                  "label": {
                    "text": "Worker Query Results"
                  }
                }
              }
            ],
            "source": {
              "cell": "936557f9-22e2-4bac-bb70-0089c5c2fbe1"
            },
            "target": {
              "cell": "3e75b596-9c70-41b6-a2cf-a15899c254d3"
            },
            "vertices": [
              {
                "x": 466,
                "y": 347
              }
            ]
          },
          {
            "shape": "trust-broundary-curve",
            "attrs": {
              "line": {
                "targetMarker": "",
                "sourceMarker": ""
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "labels": [
              {
                "attrs": {
                  "text": {
                    "text": ""
                  }
                }
              }
            ],
            "data": {
              "type": "tm.Boundary",
              "name": "",
              "description": "",
              "isTrustBoundary": true,
              "hasOpenThreats": false
            },
            "id": "d06e0c81-c1ff-4de6-b97c-01b360ee00c7",
            "source": {
              "x": 241,
              "y": 444
            },
            "target": {
              "x": 526,
              "y": 465
            },
            "vertices": [
              {
                "x": 333,
                "y": 288
              },
              {
                "x": 488,
                "y": 267
              },
              {
                "x": 552,
                "y": 339
              }
            ]
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "classic"
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Web Response",
              "description": "",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "protocol": "HTTP/S",
              "isEncrypted": true,
              "isPublicNetwork": true,
              "hasOpenThreats": false,
              "threats": [
                {
                  "status": "Mitigated",
                  "severity": "High",
                  "title": "Data flow should use HTTP/S",
                  "type": "Information disclosure",
                  "description": "These responses are over the public internet and could be intercepted by an attacker.",
                  "mitigation": "The requests should require HTTP/S. This will provide confidentiality and integrity. HTTP should not be supported.",
                  "modelType": "STRIDE",
                  "id": "13526873-87df-42f4-9b04-f48e3c7fe120"
                }
              ],
              "isTrustBoundary": false
            },
            "id": "f120fd0c-beaf-4a98-93b0-09af2dbf1cdf",
            "labels": [
              {
                "position": 0.5,
                "attrs": {
                  "label": {
                    "text": "Web Response (HTTP/S)"
                  }
                }
              }
            ],
            "source": {
              "cell": "0d9909ea-1398-4898-be81-cf1c808324dc"
            },
            "target": {
              "cell": "b394f9f7-07ca-42bc-b616-ad77c6fbfcce"
            },
            "vertices": [
              {
                "x": 111,
                "y": 175
              }
            ]
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "classic"
                },
                "strokeDasharray": "5 2"
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Read web app config",
              "description": "",
              "outOfScope": true,
              "reasonOutOfScope": "This data flow represents a read from the file system",
              "protocol": "",
              "isEncrypted": false,
              "isPublicNetwork": false,
              "hasOpenThreats": false,
              "threats": [],
              "isTrustBoundary": false
            },
            "id": "0b8714c9-9bef-4146-9a9a-d8c77d5839a0",
            "labels": [
              {
                "position": 0.5,
                "attrs": {
                  "label": {
                    "text": "Read web app config"
                  }
                }
              }
            ],
            "source": {
              "cell": "bdd3e115-4b92-4020-90b7-c3351dba292b"
            },
            "target": {
              "cell": "0d9909ea-1398-4898-be81-cf1c808324dc"
            },
            "vertices": [
              {
                "x": 157,
                "y": 292
              }
            ]
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "classic"
                },
                "strokeDasharray": "5 2"
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Read worker config",
              "description": "",
              "outOfScope": true,
              "reasonOutOfScope": "This data flow represents a read from the file system",
              "protocol": "",
              "isEncrypted": false,
              "isPublicNetwork": false,
              "hasOpenThreats": false,
              "threats": [],
              "isTrustBoundary": false
            },
            "id": "cde7939e-6481-429a-baf0-dff4e44423a9",
            "labels": [
              {
                "position": 0.5,
                "attrs": {
                  "label": {
                    "text": "Read worker config"
                  }
                }
              }
            ],
            "source": {
              "cell": "a25bbb4e-093f-4238-a620-31efdee452dc"
            },
            "target": {
              "cell": "3e75b596-9c70-41b6-a2cf-a15899c254d3"
            },
            "vertices": [
              {
                "x": 664,
                "y": 320
              }
            ]
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "classic"
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Queries",
              "description": "",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "protocol": "",
              "isEncrypted": true,
              "isPublicNetwork": false,
              "hasOpenThreats": false,
              "threats": [],
              "isTrustBoundary": false
            },
            "id": "c30e7660-b806-453a-901d-b438cdff28cb",
            "labels": [
              {
                "position": 0.5,
                "attrs": {
                  "label": {
                    "text": "Queries"
                  }
                }
              }
            ],
            "source": {
              "cell": "0d9909ea-1398-4898-be81-cf1c808324dc"
            },
            "target": {
              "cell": "936557f9-22e2-4bac-bb70-0089c5c2fbe1"
            },
            "vertices": [
              {
                "x": 311,
                "y": 324
              }
            ]
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "classic"
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Web App Query\nResults",
              "description": "",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "protocol": "",
              "isEncrypted": true,
              "isPublicNetwork": false,
              "hasOpenThreats": false,
              "threats": [],
              "isTrustBoundary": false
            },
            "id": "b2681629-be8f-464a-a658-1d1ec95b4d8c",
            "labels": [
              {
                "position": 0.5,
                "attrs": {
                  "label": {
                    "text": "Web App Query\nResults"
                  }
                }
              }
            ],
            "source": {
              "cell": "936557f9-22e2-4bac-bb70-0089c5c2fbe1"
            },
            "target": {
              "cell": "0d9909ea-1398-4898-be81-cf1c808324dc"
            },
            "vertices": [
              {
                "x": 377,
                "y": 280
              }
            ]
          },
          {
            "shape": "flow",
            "attrs": {
              "line": {
                "stroke": "#333333",
                "strokeWidth": 1,
                "targetMarker": {
                  "name": "classic"
                },
                "strokeDasharray": null
              }
            },
            "width": 200,
            "height": 100,
            "zIndex": 10,
            "connector": "smooth",
            "data": {
              "type": "tm.Flow",
              "name": "Worker Queries",
              "description": "",
              "outOfScope": false,
              "reasonOutOfScope": "",
              "protocol": "",
              "isEncrypted": false,
              "isPublicNetwork": false,
              "hasOpenThreats": false,
              "threats": [],
              "isTrustBoundary": false
            },
            "id": "9adb9cd4-60e4-4f1e-805b-a43a94913f55",
            "labels": [
              {
                "position": 0.5,
                "attrs": {
                  "label": {
                    "text": "Worker Queries"
                  }
                }
              }
            ],
            "source": {
              "cell": "3e75b596-9c70-41b6-a2cf-a15899c254d3"
            },
            "target": {
              "cell": "936557f9-22e2-4bac-bb70-0089c5c2fbe1"
            },
            "vertices": [
              {
                "x": 552,
                "y": 382
              }
            ]
          }
        ],
        "version": "2.0",
        "title": "Main Request Data Flow",
        "thumbnail": "./public/content/images/thumbnail.jpg",
        "id": 0
      }
    ],
    "reviewer": "Jane Smith"
  },
  "version": "2.0"
}`;
