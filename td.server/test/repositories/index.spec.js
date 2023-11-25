import bitbucketthreatmodelrepository from "../../src/repositories/bitbucketthreatmodelrepository";
import { expect } from 'chai';
import githubthreatmodelrepository from "../../src/repositories/githubthreatmodelrepository";
import repositories from "../../src/repositories";

describe('repositories/index.js', () => {

    describe('getSpecific', () =>{
        it("should return the githubrepository", () =>{
            const provider = repositories.getSpecific("githubthreatmodelrepository")
            expect(provider).to.satisfy(function(p){
                return Object.prototype.toString.call(p) ===  Object.prototype.toString.call(githubthreatmodelrepository);
            });
        });
        it("should return the bitbucketrepository", () =>{
            const provider = repositories.getSpecific("bitbucketthreatmodelrepository")
            expect(provider).to.satisfy(function(p){
                return Object.prototype.toString.call(p) ===  Object.prototype.toString.call(bitbucketthreatmodelrepository);
            });
        });

        it("should return an error for a not supported repository", () =>{
            expect(() => repositories.getSpecific("notreal")).to.throw('Unknown provider: notreal');
        });

    })
});