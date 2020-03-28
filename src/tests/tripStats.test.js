import Chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { blaisefr } from './mock/tokens';

Chai.use(chaiHttp);
Chai.should();

describe('Barefoot nomad should allow multi city trips', () => {
  it('It should show trip statistics if a user is logged in', (done) => {
    Chai
      .request(app)
      .get('/api/v1/trips/stats/2020-01-01/2020-08-01')
      .set('x-access-token', `${blaisefr}`)
      .end((err, res) => {
        res.body.should.have.status(200);
        res.body.should.have.property('message', 'Your travel requests statistics between the given dates');
        res.body.should.have.property('data');
        done();
      });
  });

  it('It should not show trip statistics if the from date is not valid', (done) => {
    Chai
      .request(app)
      .get('/api/v1/trips/stats/noo/2020-08-01')
      .set('x-access-token', `${blaisefr}`)
      .end((err, res) => {
        res.body.should.have.status(400);
        res.body.should.have.property('error', 'The from date is required and the format is YYYY-MM-DD');
        done();
      });
  });

  it('It should not show trip statistics if the until date is not valid', (done) => {
    Chai
      .request(app)
      .get('/api/v1/trips/stats/2020-01-01/noo')
      .set('x-access-token', `${blaisefr}`)
      .send({
        from: '2020-01-01',
        until: 'noo',
      })
      .end((err, res) => {
        res.body.should.have.status(400);
        res.body.should.have.property('error', 'The until date is required and the format is YYYY-MM-DD');
        done();
      });
  });
});
