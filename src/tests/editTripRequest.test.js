import Chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import sinon from 'sinon';
import sendGrid from '@sendgrid/mail';
import { onlineClients } from '../utils/socket';
import {
  userCredentials,
  updatedTripRequest,
  validTripId,
  invalidTripType,
  stopsMustBeProvided,
  tripWithInvalidCountry,
  invalidFromCity,
  invalidToCountry,
  invalidToCity,
  invalidAccommodationVote,
  invalidDeparture,
  returnDateNotAllowed,
  invalidReturnDate,
  reasonWithFewChars,
  notYourTripId,
  client
} from './mock/editTripRequestMock';
import { octopusbn } from './mock/tokens';
import io from 'socket.io-client';

Chai.use(chaiHttp);
Chai.should();

describe('Editing a trip request', () => {
  it('should sign in a user first', (done) => {
    Chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(userCredentials)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res);
        done();
      });
  });
  it('should deny when stops are of string type', (done) => {
    Chai
      .request(app)
      .patch(`/api/v1/trips/${validTripId}`)
      .set('x-access-token', `${octopusbn}`) 
      .send(stopsMustBeProvided)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('Provide stops');
        expect(res);
        done();
      });
  });
  it('should not allow invalid trip request type', (done) => {
    Chai
      .request(app)
      .patch(`/api/v1/trips/${validTripId}`)
      .set('x-access-token', `${octopusbn}`)
      .send(invalidTripType)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('Please provide a valid request type: [one way, return, multi city]');
        expect(res);
        done();
      });
  });
  it('should not allow trip request with invalid :fromCountry', (done) => {
    Chai
      .request(app)
      .patch(`/api/v1/trips/${validTripId}`)
      .set('x-access-token', `${octopusbn}`)
      .send(tripWithInvalidCountry)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('Please provide a valid from country: eg [KN, Rw, USA, UG, ...]');
        expect(res);
        done();
      });
  });
  it('should not allow trip request with invalid :fromCity', (done) => {
    Chai
      .request(app)
      .patch(`/api/v1/trips/${validTripId}`)
      .set('x-access-token', `${octopusbn}`)
      .send(invalidFromCity)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('Please provide a valid from city: eg [Kigali, kampala, ....]');
        expect(res);
        done();
      });
  });
  it('should not allow trip request with invalid :toCountry', (done) => {
    Chai
      .request(app)
      .patch(`/api/v1/trips/${validTripId}`)
      .set('x-access-token', `${octopusbn}`)
      .send(invalidToCountry)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('Please provide a valid to country: eg [USA, RW, UG, ...]');
        expect(res);
        done();
      });
  });
  it('should not allow trip request with invalid :toCity', (done) => {
    Chai
      .request(app)
      .patch(`/api/v1/trips/${validTripId}`)
      .set('x-access-token', `${octopusbn}`)
      .send(invalidToCity)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('Please provide a valid to CITY: eg [Kigali, kampala, ....]');
        expect(res);
        done();
      });
  });
  it('should not allow wrong accommodation vote', (done) => {
    Chai
      .request(app)
      .patch(`/api/v1/trips/${validTripId}`)
      .set('x-access-token', `${octopusbn}`)
      .send(invalidAccommodationVote)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('Please provide a valid accommodation value: [yes, no]');
        expect(res);
        done();
      });
  });
  it('should not allow departuring in past!', (done) => {
    Chai
      .request(app)
      .patch(`/api/v1/trips/${validTripId}`)
      .set('x-access-token', `${octopusbn}`)
      .send(invalidDeparture)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('Please provide a valid for departure, Date format must be YYYY-MM-DD');
        expect(res);
        done();
      });
  });
  it('should not allow return date on non return type trip', (done) => {
    Chai
      .request(app)
      .patch(`/api/v1/trips/${validTripId}`)
      .set('x-access-token', `${octopusbn}`)
      .send(returnDateNotAllowed)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('Only provide a return date on a return trip request');
        expect(res);
        done();
      });
  });
  it('should not allow return date before dparture date', (done) => {
    Chai
      .request(app)
      .patch(`/api/v1/trips/${validTripId}`)
      .set('x-access-token', `${octopusbn}`)
      .send(invalidReturnDate)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal(`Please provide valid date for return, date before or on ${invalidReturnDate.departureDate}`);
        expect(res);
        done();
      });
  });
  it('should restrict requester to provide trip reason below min allowed chars', (done) => {
    Chai
      .request(app)
      .patch(`/api/v1/trips/${validTripId}`)
      .set('x-access-token', `${octopusbn}`)
      .send(reasonWithFewChars)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('Please provide a reason (more than 20 char)');
        expect(res);
        done();
      });
  });
  it('should not allow user to edit others tgrip request', (done) => {
    Chai
      .request(app)
      .patch(`/api/v1/trips/${notYourTripId}`)
      .set('x-access-token', `${octopusbn}`)
      .send(updatedTripRequest)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
        expect(res.body.error).to.be.equal('Trip is not assigned to you!');
        expect(res);
        done();
      });
  });

  const socketURL = 'http://localhost:3000';

  const options = {
    transports: ['websocket'],
    'force new connection': true
  };

  const client = io.connect(socketURL, options);
  client.on('connect', () => {
    client.emit('connect_user', 'd01cf3f2-4601-4b53-8ffd-fd46b5ded623');
  });
  onlineClients.set('d01cf3f2-4601-4b53-8ffd-fd46b5ded623');

      it('should edit trip request like so', (done) => {
        Chai
          .request(app)
          .patch(`/api/v1/trips/${validTripId}`)
          .set('x-access-token', `${octopusbn}`)
          .send(updatedTripRequest)
          .end((err, res) => {
            expect(res.body.status).to.be.equal(200);
            expect(res.body.message).to.be.equal('Your trip request has been successfully edited!');
            expect(res);
            done();
          });
      });
  });
