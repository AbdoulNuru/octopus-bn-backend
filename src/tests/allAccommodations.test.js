import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';
import { blaisefr } from './mock/tokens'

chai.use(chaiHttp);
chai.should();
describe('View all accommodations', () => {
  it('should get all accommodations if a user is signed in', (done) => {
    chai
      .request(app)
      .get('/api/v1/accommodations/all-accommodations?page=1&limit=5')
      .set('x-access-token', `${blaisefr}`)
      .end((err, res) => {
        res.body.should.have.status(200);
        res.body.should.have.property('message', 'All accommodations on barefoot nomad');
        done();
      });
  });

  it('should not get all accommodations if the params are wrong', (done) => {
    chai
      .request(app)
      .get('/api/v1/accommodations/all-accommodations?page=1&limit=thisiswrong')
      .set('x-access-token', `${blaisefr}`)
      .end((err, res) => {
        res.body.should.have.status(400);
        res.body.should.have.property('error'); 
        done();
      });
  });
});
