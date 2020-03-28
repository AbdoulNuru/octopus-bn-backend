import Chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { blaisefr } from './mock/tokens';

Chai.use(chaiHttp);
Chai.should();

describe('Barefoot nomad should allow marking all notifications as read', () => {
  it('It should mark all unread notifications as read', (done) => {
    Chai
      .request(app)
      .put('/api/v1/notifications/readAll')
      .set('x-access-token', `${blaisefr}`)
      .end((err, res) => {
        res.body.should.have.status(200);
        res.body.should.have.property('message', 'all your unread notifications was marked as read');
        done();
      });
  });
});
