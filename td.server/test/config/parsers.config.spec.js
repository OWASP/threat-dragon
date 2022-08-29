import { expect } from 'chai';
import express from 'express';
import request from 'supertest';

import parsers from '../../src/config/parsers.config.js';

describe('config/parsers.config.js request parser', () => {
    let app;
    
    beforeEach(() => {
        app = express();
        parsers.config(app);
    });
    
    it('should parse the json in the request body', (done) => {
        const id = 'id';
        const collection = ['1', '2', '3'];
        const nested = {n1: '1', n2: '2'};
        const body = {id: id, collection: collection, nested: nested};
        const bodyText = JSON.stringify(body);
        
        app.post('/', function(req, res) {
            expect(req.body).to.deep.eq(body);
            res.status(200);
            res.send('result');
        });
        
        request(app)
            .post('/')
            .set('Content-Type', 'application/json')
            .send(bodyText)
            .expect(200)
            .end(done);
    });
    
    it('should parse a url encoded body', (done) => {
        const id = 'id';
        const collection = ['1', '2', '3'];
        const nested = {n1: '1', n2: '2'};
        const body = {id: id, collection: collection, nested: nested};
        
        app.post('/', function(req, res) {
            expect(req.body.collection[0]).to.eq(collection[0]);
            expect(req.body.collection[1]).to.eq(collection[1]);
            expect(req.body.collection[2]).to.eq(collection[2]);
            expect(req.body.nested.n1).to.eq(nested.n1);
            expect(req.body.nested.n2).to.eq(nested.n2);
            res.status(200);
            res.send('result');
        });

        request(app)
            .post('/')
            .type('form')
            .send(body)
            .expect(200)
            .end(done);
    });
});
