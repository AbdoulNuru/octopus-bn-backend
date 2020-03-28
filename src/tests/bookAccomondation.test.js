import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';
import {
  accomoIdNotFound,
  roomIdNotFound,
  tripNotFound,
  safeBooking,
  logincredentials
} from './mock/bookAccomondation';
import { octopusbn } from './mock/tokens';

chai.use(chaiHttp);
const prefix = '/api/v1/accommodations/book';
describe('Booking accommondation', () => {
  it('should return accommondation is successfully booked', (done) => {
    chai.request(app)
    .post(`${prefix}`)
    .set('x-access-token', `${octopusbn}`)
    .send(safeBooking)
    .end((err, res) => {
      expect(res.body).to.have.keys('status', 'message');
      expect(res.body.status).to.be.equal(201);
      expect(res.body.message).to.be.equal('You have successfully booked your accommodation');
      expect(res);
      done();
    });
  });
  it('should return not found when accomondation does not exist', (done) => {
    chai.request(app)
    .post(`${prefix}`)
    .set('x-access-token', `${octopusbn}`)
    .send(accomoIdNotFound).end((err, res) => {
      expect(res.body).to.have.keys('status', 'error');
      expect(res.body.status).to.be.equal(404);
      expect(res.body.error).to.be.equal('Accomondation id is not found');
      expect(res);
      done();
    });
  });
  it('should return not found when room is not available', (done) => {
    chai.request(app)
    .post(`${prefix}`)
    .set('x-access-token', `${octopusbn}`)
    .send(roomIdNotFound)
    .end((err, res) => {
      expect(res.body).to.have.keys('status', 'error');
      expect(res.body.status).to.be.equal(404);
      expect(res.body.error).to.be.equal('Room id is not found');
      expect(res);
      done();
    });
  });
  it('should return not found when a trip request is not available', (done) => {
    chai.request(app)
    .post(`${prefix}`)
    .set('x-access-token', `${octopusbn}`)
    .send(tripNotFound)
    .end((err, res) => {
      expect(res.body).to.have.keys('status', 'error');
      expect(res.body.status).to.be.equal(404);
      expect(res.body.error).to.be.equal('Trip request is not found');
      expect(res);
      done();
    });
  });

  it('should return an error if check in date is invalid', (done) => {
    chai.request(app)
    .post(`${prefix}`)
    .set('x-access-token', `${octopusbn}`)
    .send({
      accommodationId: '49235c57-2153-4e65-8b2b-68c0502165ab',
      roomId: 'f1098fbf-fb64-422e-9133-57aee90ac75c',
      tripId: '81821f4e-0d90-460c-b8c5-17da573f5e19',
      checkIn: '05-2020-05',
      checkOut: '2020-05-05'
    })
    .end((err, res) => {
      expect(res.body).to.have.keys('status', 'error');
      expect(res.body.status).to.be.equal(400);
      expect(res.body.error).to.be.equal('Check in date must be valid');
      expect(res);
      done();
    });
  });

  it('should return an error if check out date is invalid', (done) => {
    chai.request(app)
    .post(`${prefix}`)
    .set('x-access-token', `${octopusbn}`)
    .send({
      accommodationId: '49235c57-2153-4e65-8b2b-68c0502165ab',
      roomId: 'f1098fbf-fb64-422e-9133-57aee90ac75c',
      tripId: '81821f4e-0d90-460c-b8c5-17da573f5e19',
      checkIn: '2020-05-05',
      checkOut: '05-2020-05'
    })
    .end((err, res) => {
      expect(res.body).to.have.keys('status', 'error');
      expect(res.body.status).to.be.equal(400);
      expect(res.body.error).to.be.equal('Please provide valid date for checking out, hint after or on 2020-05-05');
      expect(res);
      done();
    });
  });

  it('should return an error if check in date is not provided', (done) => {
    chai.request(app)
    .post(`${prefix}`)
    .set('x-access-token', `${octopusbn}`)
    .send({
      accommodationId: '49235c57-2153-4e65-8b2b-68c0502165ab',
      roomId: 'f1098fbf-fb64-422e-9133-57aee90ac75c',
      tripId: '81821f4e-0d90-460c-b8c5-17da573f5e19',
      checkIn: '',
      checkOut: '2020-05-05'
    })
    .end((err, res) => {
      expect(res.body).to.have.keys('status', 'error');
      expect(res.body.status).to.be.equal(400);
      expect(res.body.error).to.be.equal('Check in date must be valid');
      expect(res);
      done();
    });
  });

  it('should return an error if check out date is not provided', (done) => {
    chai.request(app)
    .post(`${prefix}`)
    .set('x-access-token', `${octopusbn}`)
    .send({
      accommodationId: '49235c57-2153-4e65-8b2b-68c0502165ab',
      roomId: 'f1098fbf-fb64-422e-9133-57aee90ac75c',
      tripId: '81821f4e-0d90-460c-b8c5-17da573f5e19',
      checkIn: '2020-05-05',
      checkOut: ''
    })
    .end((err, res) => {
      expect(res.body).to.have.keys('status', 'error');
      expect(res.body.status).to.be.equal(400);
      expect(res.body.error).to.be.equal('Please provide valid date for checking out, hint after or on 2020-05-05');
      expect(res);
      done();
    });
  });
});
