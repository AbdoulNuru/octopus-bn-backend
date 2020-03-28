import Chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { blaisefr } from './mock/tokens'

Chai.use(chaiHttp);
Chai.should();

describe('Barefoot nomad should allow to search for accommodations', () => {
  it('It should show accommodation search results if a user is logged in', (done) => {
    Chai
      .request(app)
      .get('/api/v1/accommodations/search?page=1&limit=5&searchKey=Kampala')
      .set('x-access-token', `${blaisefr}`)
      .end((err, res) => {
        res.body.should.have.status(200);
        res.body.should.have.property('message', 'Accommodation search results');
        done();
      });
  });

  it('should not show accommodation search results if the params are wrong', (done) => {
    Chai
      .request(app)
      .get('/api/v1/accommodations/search?page=1&limit=5&searchKey=    ')
      .set('x-access-token', `${blaisefr}`)
      .end((err, res) => {
        res.body.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });
});
