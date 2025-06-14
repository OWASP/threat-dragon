/**
 * Maybe this should be merged with diagram.spec.js
 * Because it's so different in the setup it is separated for now
 */
import cells from '@/service/diagram/v1/cells.js';

describe('service/diagram/diagram.js', () => {
    let diagramMock;

    beforeEach(() => {
        diagramMock = {
            'title': 'Extended JSON Test',
            'thumbnail': 'foo.jpg',
            'diagramType': 'STRIDE',
            'id': '123',
            'diagramJson': {
                'cells': [
                    {
                        'type': 'tm.Store',
                        'size': {
                            'width': 160,
                            'height': 80
                        },
                        'position': {
                            'x': 637,
                            'y': 388
                        },
                        'angle': 0,
                        'id': 'a25bbb4e-093f-4238-a620-31efdee452dc',
                        'z': 1,
                        'threats': [
                            {
                                'status': 'Open',
                                'severity': 'High',
                                'mitigation': 'Test more often',
                                'description': 'Testing is good',
                                'title': 'Executing test',
                                'type': 'Information disclosure'
                            }
                        ],
                        'storesCredentials': true,
                        'hasOpenThreats': true,
                        'attrs': {
                            '.element-shape': {
                                'class': 'element-shape hasOpenThreats isInScope'
                            },
                            'text': {
                                'text': 'Worker Config'
                            },
                            '.undefined': {
                                'class': 'undefinedhasOpenThreats isInScope'
                            },
                            '.element-text': {
                                'class': 'element-text hasOpenThreats isInScope'
                            }
                        }
                    }
                ]
	    }
        };
    });

    describe('draw', () => {
        describe('v1', () => {
            let resp, mock;

	    it('applies the modelType STRIDE', () => {
                resp = cells.map(diagramMock);
                expect(resp.nodes[0].store.data.data.threats[0].modelType).toEqual('STRIDE');
	    });

	    it('applies the modelType STRIDE, despite having an invalid diagram type', () => {
                mock = diagramMock;
                mock.diagramType = 'FOO';
                resp = cells.map(diagramMock);
                /* because it is infered from the threat.type */
                expect(resp.nodes[0].store.data.data.threats[0].modelType).toEqual('STRIDE');
	    });

	    it('applies an empty modelType when diagramType and threat type have invalid values', () => {
                mock = diagramMock;
                mock.diagramType = 'FOO';
                mock.diagramJson.cells[0].threats[0].type = 'FOO';
                resp = cells.map(diagramMock);
                expect(resp.nodes[0].store.data.data.threats[0].modelType).toEqual('');
	    });

	    it('applies modelType STRIDE when diagramType is STRIDE and threat type has the value of another model', () => {
                mock = diagramMock;
                mock.diagramType = 'STRIDE';
                mock.diagramJson.cells[0].threats[0].type = 'Unawareness';
                resp = cells.map(diagramMock);
                expect(resp.nodes[0].store.data.data.threats[0].modelType).toEqual('STRIDE');
	    });
        });
    });
});
