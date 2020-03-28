import Chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { blaiseen } from './mock/tokens';

Chai.use(chaiHttp);
Chai.should();

describe('Get most traveled destination tests', () => {
  it('Should not allow unauthenticated user to see most traveled centres', (done) => {
    Chai
      .request(app)
      .get('/api/v1/accommodations/most-traveled-centres')
      .end((err, res) => {
        res.body.should.have.status(403);
        res.body.should.have.property('error', 'Please log in or sign up to continue');
        done();
      });
  });

  it('Should return successfully if most traveled centres are found', (done) => {
    Chai
      .request(app)
      .get('/api/v1/accommodations/most-traveled-centres')
      .set('x-access-token', `${blaiseen}`)
      .end((err, res) => {
        res.body.should.have.status(200);
        res.body.should.have.property('message', 'Trending centres are retrieved successfully');
        res.body.should.have.property('data');
        done();
      });
  });
});
