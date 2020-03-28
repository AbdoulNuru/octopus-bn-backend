import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);

const prefix = '/api/v1/auth';
describe('Social Authentication', () => {
  it('should return return a message and status 200', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
        done();
      });
  });
});
