import chai, {
    expect
  } from 'chai';
  import chaiHttp from 'chai-http';
  import {
    describe,
    it
  } from 'mocha';
  import app from '../index';
  import { testManager } from './mock/tokens';
  
  chai.use(chaiHttp);
  const prefix = '/api/v1/requests/comments';
  const id = '46e9bfdf-6d21-4fd8-8fc7-df654d615be1';
  
  describe('', () => {
    it('should not allow someone delete a comment that is not there', (done) => {
      chai.request(app)
      .delete(`${prefix}?commentId=c8e9428a-6d60-4073-8ce3-334c62afe72c`)
      .set('x-access-token', `${testManager}`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(404);
        expect(res);
        done();
      });
    });
    it('should delete comment successfully', (done) => {
      chai
      .request(app)
      .delete(`${prefix}?commentId=c8e9428a-6d60-4083-8ce3-334c62afe72c`)
      .set('x-access-token', `${testManager}`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res);
        done();
      });
    });
});
