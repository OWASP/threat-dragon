'use strict';

var jasmine = require('jasmine');
var request = require('supertest');
var express = require('express');
var finish_test = require('./helpers/supertest-jasmine');

describe('request parser tests', function() {
    
    var app;
    
    beforeEach(function() {
        
        app = express();
        require('../../td/config/parsers.config')(app);
        
    });
    
    it('should parse the json in the request body', function(done) {
        
        var id = 'id';
        var collection = ['1', '2', '3'];
        var nested = {n1: '1', n2: '2'};
        var body = {id: id, collection: collection, nested: nested};
        var bodyText = JSON.stringify(body);
        
        app.post('/', function(req, res) {
            expect(req.body.id).toEqual(id);
            expect(req.body.collection).toEqual(collection);
            expect(req.body.nested).toEqual(nested);
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
    
    it('should parse a url encoded body', function(done) {
        
        var id = 'id';
        var collection = ['1', '2', '3'];
        var nested = {n1: '1', n2: '2'};
        var body = {id: id, collection: collection, nested: nested};
        var bodyText = JSON.stringify(body);
        
        app.post('/', function(req, res) {
            expect(req.body.id).toEqual(id);
            expect(req.body["collection[0]"]).toEqual(collection[0]);
            expect(req.body["collection[1]"]).toEqual(collection[1]);
            expect(req.body["collection[2]"]).toEqual(collection[2]);
            expect(req.body["nested[n1]"]).toEqual(nested.n1);
            expect(req.body["nested[n2]"]).toEqual(nested.n2);
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
    
    it('should parse a cookie', function(done) {
        
        var cookieName = 'cookieName';
        var cookieValue = 'cookieValue';
        
        app.post('/', function(req, res) {
            expect(req.cookies[cookieName]).toEqual(cookieValue);
            res.status(200);
            res.send('result');
        });
        
        request(app)
            .post('/')
            .set('Cookie', cookieName + '=' + cookieValue)
            .send('body')
            .expect(200)
            .end(finish_test(done));
    });
});
