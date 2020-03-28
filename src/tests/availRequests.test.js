import Chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { cities, wrongCities } from './mock/multiCityMock';
import { testManager} from './mock/tokens';

Chai.use(chaiHttp);
Chai.should();

describe('Barefoot nomad should allow managers to see the pending requests of users they manage', () => {
  it('It should avail trip requests', (done) => {
    Chai
      .request(app)
      .get('/api/v1/trips/avail-requests')
      .set('x-access-token', `${testManager}`)
      .end((err, res) => {
        res.body.should.have.status(200);
        done();
      });
  });
});
