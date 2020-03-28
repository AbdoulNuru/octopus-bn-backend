/* eslint-disable import/no-extraneous-dependencies */
import Chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import {
  invalidUuid, managerCredentials,
  nonExistTripId, tripIdNotAssigned,
  approvedRequestId
} from './mock/rejectTripMock';
import { octopususer, testManager } from './mock/tokens';
import { tripInpendingMode, WithNoManagerRole, rejectedTripId } from './mock/approveTripMock';
import io from 'socket.io-client';
import { onlineClients } from '../utils/socket';

Chai.use(chaiHttp);
Chai.should();

describe('Approving a trip request', () => {
  it('should not allow non-manager users to approve a trip', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${invalidUuid}/approve`)
      .set('x-access-token', `${octopususer}`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
        expect(res.body.error).to.be.equal('Please you should be a manager');
        done();
      });
  });

  it('should fail when trip request ID is not valid', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${invalidUuid}/approve`)
      .set('x-access-token', `${testManager}`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('Please use a valid trip request ID');
        done();
      });
  });
  it('should fail when trip request ID is not found', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${nonExistTripId}/approve`)
      .set('x-access-token', `${testManager}`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.be.equal('Trip request is not found');
        done();
      });
  });
  it('should fail when trip request is not assigned to manager', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${tripIdNotAssigned}/approve`)
      .set('x-access-token', `${testManager}`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
        expect(res.body.error).to.be.equal('Trip is not assigned to you!');
        done();
      });
  });
  it('should deny when trip is already rejected', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${rejectedTripId}/approve`)
      .set('x-access-token', `${testManager}`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
        expect(res.body.error).to.be.equal('Trip has been already rejected!');
        done();
      });
  });
  it('should not fire up approval when a trip is already approved', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${approvedRequestId}/approve`)
      .set('x-access-token', `${testManager}`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
        expect(res.body.error).to.be.equal('Trip has been already approved');
        done();
      });
  });
  
    const socketURL = 'http://localhost:3000';

    const options = {
      transports: ['websocket'],
      'force new connection': true
    };

    before(async() => {
    const client = io.connect(socketURL, options);
    client.on('connect', () => {
      client.emit('connect_user', '0e11ed8c-a1a5-4f49-a3ca-450769bfa49o');
    });
    onlineClients.set('0e11ed8c-a1a5-4f49-a3ca-450769bfa49o');
  });
  it('should approve the trip request', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${tripInpendingMode}/approve`)
      .set('x-access-token', `${testManager}`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('Trip request is successfully approved');
        done();
      });
  });
});
