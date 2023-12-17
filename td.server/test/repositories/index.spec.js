import bitbucketrepo from "../../src/repositories/bitbucketrepo";
import { expect } from 'chai';
import githubrepo from "../../src/repositories/githubrepo";
import repositories from "../../src/repositories";

describe('repositories/index.js', () => {

    describe('getSpecific', () =>{
        it("should return the githubrepository", () =>{
            const provider = repositories.getSpecific("githubrepo")
            expect(provider).to.satisfy(function(p){
                return Object.prototype.toString.call(p) ===  Object.prototype.toString.call(githubrepo);
            });
        });
        it("should return the bitbucketrepository", () =>{
            const provider = repositories.getSpecific("bitbucketrepo")
            expect(provider).to.satisfy(function(p){
                return Object.prototype.toString.call(p) ===  Object.prototype.toString.call(bitbucketrepo);
            });
        });

        it("should return an error for a not supported repository", () =>{
            expect(() => repositories.getSpecific("notreal")).to.throw('Unknown provider: notreal');
        });

    })
});