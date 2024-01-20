export const schema = {
    "$id": "https://owasp.org/www-project-threat-dragon/assets/schemas/owasp.threat-dragon.schema.V2.json",
    "title": "Threat Dragon model schema",
    "description": "The threat models used by OWASP Threat Dragon",
    "type": "object",
    "properties": {
      "version": {
        "description": "Threat Dragon version used in the model",
        "type": "string",
        "maxLength": 5
      },
      "summary": {
        "description": "Threat model project meta-data",
        "type": "object",
        "properties": {
          "description": {
            "description": "Description of the threat model used for report outputs",
            "type": "string"
          },
          "id": {
            "description": "A unique identifier for this main threat model object",
            "type": "integer",
            "minimum": 0
          },
          "owner": {
            "description": "The original creator or overall owner of the model",
            "type": "string"
          },
          "title": {
            "description": "Threat model title",
            "type": "string"
          }
        },
        "required": [ "title" ]
      },
      "detail": {
        "description": "Threat model definition",
        "type": "object",
        "properties": {
          "contributors": {
            "description": "An array of contributors to the threat model project",
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "description": "The name of the contributor",
                  "type": "string"
                }
              }
            }
          },
          "diagrams": {
            "description": "An array of single or multiple threat data-flow diagrams",
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "diagramType": {
                  "description": "The methodology used by the data-flow diagram",
                  "type": "string",
                  "minLength": 3
                },
                "id": {
                  "description": "The sequence number of the diagram",
                  "type": "integer",
                  "minimum": 0
                },
                "placeholder": {
                  "description": "The extended description of the diagram",
                  "type": "string"
                },
                "thumbnail": {
                  "description": "The path to the thumbnail image for the diagram",
                  "type": "string"
                },
                "title": {
                  "description": "The title of the data-flow diagram",
                  "type": "string"
                },
                "version": {
                  "description": "Threat Dragon version used in the diagram",
                  "type": "string",
                  "maxLength": 5
                },
                "cells": {
                  "description": "The individual diagram components",
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "attrs": {
                        "description": "The component display attributes",
                        "type": "object",
                        "properties": {
                          "body": {
                            "description": "The component stroke attributes",
                            "type": "object",
                            "properties": {
                              "stroke": {
                                "description": "The stroke color",
                                "type": "string"
                              },
                              "strokeWidth": {
                                "description": "The stroke width",
                                "type": "number"
                              },
                              "strokeDasharray": {
                                "description": "The stroke dash ratio",
                                "type": "string",
                                "nullable": true
                              }
                            },
                            "required": [ "stroke", "strokeWidth", "strokeDasharray" ]
                          },
                          "line": {
                            "description": "The component stroke attributes",
                            "type": "object",
                            "properties": {
                              "stroke": {
                                "description": "The stroke color",
                                "type": "string"
                              },
                              "strokeWidth": {
                                "description": "The stroke width",
                                "type": "number"
                              },
                              "sourceMarker": {
                                "description": "The line source marker",
                                "type": [ "object", "string" ],
                                "properties": {
                                  "name": {
                                    "description": "The source marker shape",
                                    "type": "string"
                                  }
                                },
                                "required": [ "name" ]
                              },
                              "strokeDasharray": {
                                "description": "The stroke dash ratio",
                                "type": "string",
                                "nullable": true
                              },
                              "targetMarker": {
                                "description": "The line target marker",
                                "type": [ "object", "string" ],
                                "properties": {
                                  "name": {
                                    "description": "The target marker shape",
                                    "type": "string"
                                  }
                                },
                                "required": [ "name" ]
                              }
                            },
                            "required": [ "targetMarker" ]
                          }
                        }
                      },
                      "data": {
                        "description": "The component parameters",
                        "type": "object",
                        "properties": {
                          "description": {
                            "description": "The component description",
                            "type": "string"
                          },
                          "handlesCardPayment": {
                            "description": "The component flag set if the process handles credit card payment",
                            "type": "boolean"
                          },
                          "handlesGoodsOrServices": {
                            "description": "The component flag set if the process is part of a retail site",
                            "type": "boolean"
                          },
                          "isALog": {
                            "description": "The component flag set if the store contains logs",
                            "type": "boolean"
                          },
                          "isBidirectional": {
                            "description": "The component flag set if it is not in scope",
                            "type": "boolean"
                          },
                          "isEncrypted": {
                            "description": "The data-flow flag set if is bidirectional",
                            "type": "boolean"
                          },
                          "isPublicNetwork": {
                            "description": "The data-flow flag set if it crosses a public network",
                            "type": "boolean"
                          },
                          "isSigned": {
                            "description": "The component flag set if the data store uses signatures",
                            "type": "boolean"
                          },
                          "isTrustBoundary": {
                            "description": "The flag set if the component is a trust boundary curve or trust boundary box",
                            "type": "boolean"
                          },
                          "isWebApplication": {
                            "description": "The component flag set if the process is a web application",
                            "type": "boolean"
                          },
                          "name": {
                            "description": "The component name",
                            "type": "string"
                          },
                          "outOfScope": {
                            "description": "The component flag set if it is not in scope",
                            "type": "boolean"
                          },
                          "privilegeLevel": {
                            "description": "The component's level of privilege/permissions",
                            "type": "string"
                          },
                          "protocol": {
                            "description": "The data-flow protocol",
                            "type": "string"
                          },
                          "providesAuthentication": {
                            "description": "The component flag set if the Actor provides Authentication",
                            "type": "boolean"
                          },
                          "reasonOutOfScope": {
                            "description": "The component description if out of scope",
                            "type": "string"
                          },
                          "storesCredentials": {
                            "description": "The component flag set if store contains credentials/PII",
                            "type": "boolean"
                          },
                          "storesInventory": {
                            "description": "The component flag set if store is part of a retail web application",
                            "type": "boolean"
                          },
                          "type": {
                            "description": "The component type",
                            "type": "string"
                          },
                          "hasOpenThreats": {
                            "description": "The component flag set if there are open threats",
                            "type": "boolean"
                          }
                        },
                        "required": [ "description", "hasOpenThreats", "name", "type" ]
                      },
                      "id": {
                        "description": "The component unique identifier (UUID)",
                        "type": "string",
                        "minLength": 36
                      },
                      "position": {
                        "description": "The component position",
                        "type": "object",
                        "properties": {
                          "x": {
                            "description": "The component horizontal position",
                            "type": "number"
                          },
                          "y": {
                            "description": "The component vertical position",
                            "type": "number"
                          }
                        },
                        "required": [ "x", "y" ]
                      },
                      "size": {
                        "description": "The component body size  (not line)",
                        "type": "object",
                        "properties": {
                          "height": {
                            "description": "The component height",
                            "type": "number",
                            "minimum": 10
                          },
                          "width": {
                            "description": "The component width",
                            "type": "number",
                            "minimum": 10
                          }
                        },
                        "required": [ "height", "width" ]
                      },
                      "connector": {
                        "description": "The  data flows and boundary geometry",
                        "type": "string"
                      },
                      "source": {
                        "description": "The component curve source",
                        "type": "object",
                        "properties": {
                          "cell": {
                            "description": "The data-flow source attachment point",
                            "type": "string"
                          },
                          "x": {
                            "description": "The boundary horizontal curve source",
                            "type": "integer"
                          },
                          "y": {
                            "description": "The boundary vertical curve source",
                            "type": "integer"
                          }
                        }
                      },
                      "target": {
                        "description": "The component curve target",
                        "type": "object",
                        "properties": {
                          "cell": {
                            "description": "The data-flow target attachment point",
                            "type": "string"
                          },
                          "x": {
                            "description": "The boundary horizontal curve target",
                            "type": "integer"
                          },
                          "y": {
                            "description": "The boundary vertical curve target",
                            "type": "integer"
                          }
                        }
                      },
                      "threats": {
                        "description": "The threats associated with the component",
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "description": {
                              "description": "The threat description",
                              "type": "string"
                            },
                            "mitigation": {
                              "description": "The threat mitigation",
                              "type": "string"
                            },
                            "modelType": {
                              "description": "The threat methodology type",
                              "type": "string"
                            },
                            "number": {
                              "description": "The unique number for the threat",
                              "type": "integer",
                              "minimum": 0
                            },
                            "score": {
                              "description": "The custom score/risk for the threat",
                              "type": "string"
                            },
                            "severity": {
                              "description": "The threat severity as High, Medium or Low",
                              "type": "string"
                            },
                            "status": {
                              "description": "The threat status as NA, Open or Mitigated",
                              "type": "string"
                            },
                            "threatId": {
                              "description": "The threat ID as a UUID",
                              "type": "string",
                              "minLength": 36
                            },
                            "title": {
                              "description": "The threat title",
                              "type": "string"
                            },
                            "type": {
                              "description": "The threat type, selection according to modelType",
                              "type": "string"
                            }
                          },
                          "required": [ "description", "mitigation", "severity", "status", "title", "type" ]
                        }
                      },   
                      "shape": {
                        "description": "The component shape",
                        "type": "string"
                      },
                      "visible": {
                        "description": "The component visibility",
                        "type": "boolean"
                      },
                      "vertices": {
                        "description": "The boundary or data-flow curve points",
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "x": {
                              "description": "The horizontal value of the curve point",
                              "type": "integer"
                            },
                            "y": {
                              "description": "The vertical value of the curve point",
                              "type": "integer"
                            }
                          },
                          "required": [ "x", "y" ]
                        }
                      },   
                      "zIndex": {
                        "description": "The component Z-plane",
                        "type": "integer"
                      }
                    },
                    "required": [ "id", "shape", "zIndex" ]
                  }
                }
              },
              "required": [ "cells", "diagramType", "id", "thumbnail", "title", "version" ]
            }
          },
          "diagramTop": {
            "description": "The highest diagram number in the threat model",
            "type": "integer",
            "minimum": 0
          },
          "reviewer": {
            "description": "The reviewer of the overall threat model",
            "type": "string"
          },
          "threatTop": {
            "description": "The highest threat number in the threat model",
            "type": "integer",
            "minimum": 0
          }
        },
        "required": [ "contributors", "diagrams", "diagramTop", "reviewer", "threatTop" ]
      }
    },
    "required": [ "version", "summary", "detail" ],
    additionalProperties: false
  }
  