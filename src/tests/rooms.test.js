import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';
import { testManager } from './mock/tokens'
import {
  trueRoom,
  fakeAccommodationID,
  noType,
  noCurrency,
  noCost,
  exRoom,
  noAccommodationsID,
  noRoomNumber
} from './mock/roomsMock';
import { octopusbn } from './mock/tokens';

const { expect } = chai;
chai.use(chaiHttp);

const prefix = '/api/v1/accommodations';

describe('', () => {
  it('should return an error message if accommodation id is not found', (done) => {
    chai.request(app)
    .post(`${prefix}/room`)
    .set('x-access-token', `${octopusbn}`)
    .send(fakeAccommodationID).end((err, res) => {
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 404);
      done();
    });
  });
  it('should successfully add a new room', (done) => {
    chai.request(app)
    .post(`${prefix}/room`)
    .set('x-access-token', `${octopusbn}`)
    .send(trueRoom).end((err, res) => {
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('status', 201);
      done();
    });
  });
  it('should not add a new room if already exists', (done) => {
    chai.request(app)
    .post(`${prefix}/room`)
    .set('x-access-token', `${octopusbn}`)
    .send(exRoom).end((err, res) => {
      expect(res).to.have.status(422);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 422);
      done();
    });
  });
  it('should not add new room with no accommodationsID provided', (done) => {
    chai.request(app)
    .post(`${prefix}/room`)
    .set('x-access-token', `${octopusbn}`)
    .send(noAccommodationsID).end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should not add new room with no roomNumber provided', (done) => {
    chai.request(app)
    .post(`${prefix}/room`)
    .set('x-access-token', `${octopusbn}`)
    .send(noRoomNumber).end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should not add new room with no cost provided', (done) => {
    chai.request(app)
    .post(`${prefix}/room`)
    .set('x-access-token', `${octopusbn}`)
    .send(noCost).end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should not add new room with no currency provided', (done) => {
    chai.request(app)
    .post(`${prefix}/room`)
    .set('x-access-token', `${octopusbn}`)
    .send(noCurrency).end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should not add new room with no type provided', (done) => {
    chai.request(app)
    .post(`${prefix}/room`)
    .set('x-access-token', `${octopusbn}`)
    .send(noType).end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should not add new room with no accommodationsID provided', (done) => {
    chai.request(app)
    .post(`${prefix}/room`)
    .set('x-access-token', `${octopusbn}`)
    .send(noAccommodationsID)
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should not successfully add a new room if logged user is not a travel admin', (done) => {
    chai.request(app)
    .post(`${prefix}/room`)
    .set('x-access-token', `${testManager}`)
    .send(trueRoom)
    .end((err, res) => {
      expect(res).to.have.status(403);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 403);
      done();
    });
  });
});
