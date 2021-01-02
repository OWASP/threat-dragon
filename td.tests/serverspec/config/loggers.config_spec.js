'use strict';

var request = require('supertest');
var finish_test = require('../supertest-jasmine');

describe('loggers config tests', function() {
    
    var app;
    var loggers;
    
    beforeEach(function() {
        app = require('express')();
        loggers = require('../../../td/config/loggers.config');
    });
    
    it('should set the logger on requests', function(done) {

        loggers.config(app);
        app.get('/test', function(req, res){
            expect(req.log).toBeDefined();
            res.status(200).send('result');
        });
        
        request(app)
        .get('/test')
        .expect(200)
        .end(finish_test(done));
    });
    
    it('should log to stdout', function() {
        var testMessage = 'test log';
        var logger = loggers.logger;
        spyOn(process.stdout, 'write').and.callThrough();
        logger.info(testMessage);
        var message = JSON.parse(process.stdout.write.calls.argsFor(0)[0]);
        expect(message.name).toEqual('threatdragon');
        expect(message.msg).toEqual(testMessage);
    });
});