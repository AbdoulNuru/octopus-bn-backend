import Chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { blaiseen } from './mock/tokens';

Chai.use(chaiHttp);
Chai.should();

describe('Barefoot nomad should show a particular accommodation', () => {
  it('It should login successfuly', (done) => {
    Chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'blaisefr@gmail.com',
        password: 'password',
      })
      .end((err, res) => {
        res.body.should.have.status(200);
        done();
      });
  });

  it('should get one accommodation with the given id', (done) => {
    Chai
      .request(app)
      .get('/api/v1/accommodations/c8e9428a-6d60-4083-8ce3-334c62afe72c')
      .set('x-access-token', `${blaiseen}`)
      .end((err, res) => {
        res.body.should.have.status(200);
        res.body.should.have.property('message', 'Accommodation retrieved successfully');
        done();
      });
  });

  it('should not get one accommodation if the given id don\'t exist', (done) => {
    Chai
      .request(app)
      .get('/api/v1/accommodations/c8e9428a-6d60-4083-8ce3-334c62afe72')
      .set('x-access-token', `${blaiseen}`)
      .end((err, res) => {
        res.body.should.have.status(404);
        res.body.should.have.property('error', 'No accommodation found with the given id');
        done();
      });
  });

  it('should not get accommodation if the params are wrong', (done) => {
    Chai
      .request(app)
      .get('/api/v1/accommodations?page=1&limit=5&id=   ')
      .set('x-access-token', `${blaiseen}`)
      .end((err, res) => {
        res.body.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('should not get accommodation if it does\'t exist', (done) => {
    Chai
      .request(app)
      .get('/api/v1/accommodations/likes/3478r65863868')
      .set('x-access-token', `${blaiseen}`)
      .end((err, res) => {
        res.body.should.have.status(404);
        res.body.should.have.property('error');
        done();
      });
  });

  it('should give a like to an existing accommodation', (done) => {
    Chai
      .request(app)
      .get('/api/v1/accommodations/likes/c8e9428a-6d60-4083-8ce3-334c62afe72c')
      .set('x-access-token', `${blaiseen}`)
      .end((err, res) => {
        res.body.should.have.status(200);
        done();
      });
  });
});
