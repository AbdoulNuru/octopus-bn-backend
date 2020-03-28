import Chai from 'chai';
import chaiHttp from 'chai-http';
import setLanguage from 'utils/international';
import app from '../index';
import {
  cities, wrongCity1, wrongCity2, wrongCity3, wrongCity4, wrongCity5, wrongCity6,
  wrongCity7, wrongCity8, wrongCity9, wrongCity10, wrongCity11
} from './mock/multiCityMock';
import { blaiseen } from './mock/tokens';

Chai.use(chaiHttp);
Chai.should();

describe('Barefoot nomad should allow multi city trips', () => {
  it('It should send a multi city trip request', (done) => {
    Chai
      .request(app)
      .post('/api/v1/trips/multi-city')
      .set('x-access-token', `${blaiseen}`)
      .send(cities)
      .end((err, res) => {
        res.body.should.have.status(201);
        res.body.should.have.property('message', 'Your multi city trip request has been recorded');
        done();
      });
  });

  it('It should not send a multi city trip request if there are validation errors', (done) => {
    Chai
      .request(app)
      .post('/api/v1/trips/multi-city')
      .set('x-access-token', `${blaiseen}`)
      .send(wrongCity1)
      .end((err, res) => {
        res.body.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('It should not send a multi city trip request if there are validation errors2', (done) => {
    Chai
      .request(app)
      .post('/api/v1/trips/multi-city')
      .set('x-access-token', `${blaiseen}`)
      .send(wrongCity2)
      .end((err, res) => {
        res.body.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('It should not send a multi city trip request if there are validation errors4', (done) => {
    Chai
      .request(app)
      .post('/api/v1/trips/multi-city')
      .set('x-access-token', `${blaiseen}`)
      .send(wrongCity3)
      .end((err, res) => {
        res.body.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('It should not send a multi city trip request if there are validation errors5', (done) => {
    Chai
      .request(app)
      .post('/api/v1/trips/multi-city')
      .set('x-access-token', `${blaiseen}`)
      .send(wrongCity4)
      .end((err, res) => {
        res.body.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('It should not send a multi city trip request if there are validation errors6', (done) => {
    Chai
      .request(app)
      .post('/api/v1/trips/multi-city')
      .set('x-access-token', `${blaiseen}`)
      .send(wrongCity5)
      .end((err, res) => {
        res.body.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('It should not send a multi city trip request if there are validation errors7', (done) => {
    Chai
      .request(app)
      .post('/api/v1/trips/multi-city')
      .set('x-access-token', `${blaiseen}`)
      .send(wrongCity6)
      .end((err, res) => {
        res.body.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('It should not send a multi city trip request if there are validation errors8', (done) => {
    Chai
      .request(app)
      .post('/api/v1/trips/multi-city')
      .set('x-access-token', `${blaiseen}`)
      .send(wrongCity7)
      .end((err, res) => {
        res.body.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('It should not send a multi city trip request if there are validation errors9', (done) => {
    Chai
      .request(app)
      .post('/api/v1/trips/multi-city')
      .set('x-access-token', `${blaiseen}`)
      .send(wrongCity8)
      .end((err, res) => {
        res.body.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('It should not send a multi city trip request if there are validation errors10', (done) => {
    Chai
      .request(app)
      .post('/api/v1/trips/multi-city')
      .set('x-access-token', `${blaiseen}`)
      .send(wrongCity9)
      .end((err, res) => {
        res.body.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('It should not send a multi city trip request if there are validation errors11', (done) => {
    Chai
      .request(app)
      .post('/api/v1/trips/multi-city')
      .set('x-access-token', `${blaiseen}`)
      .send(wrongCity10)
      .end((err, res) => {
        res.body.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('It should not send a multi city trip request if there are validation errors12', (done) => {
    Chai
      .request(app)
      .post('/api/v1/trips/multi-city')
      .set('x-access-token', `${blaiseen}`)
      .send(wrongCity11)
      .end((err, res) => {
        res.body.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });
});
