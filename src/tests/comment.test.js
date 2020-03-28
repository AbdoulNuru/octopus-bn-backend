import chai, {
  expect
} from 'chai';
import chaiHttp from 'chai-http';
import {
  describe,
  it
} from 'mocha';
import app from '../index';
import { aAtandela, testManager } from './mock/tokens';
import io from 'socket.io-client';
import { onlineClients } from '../utils/socket';

chai.use(chaiHttp);
const prefix = '/api/v1/requests/comments';
const id = '46e9bfdf-6d21-4fd8-8fc7-df654d615be1';

describe('', () => {
  it('should not allow someone to comment on a travel request with no comment provided', (done) => {
    chai.request(app)
    .post(`${prefix}?requestId=${id}`)
    .set('x-access-token', `${testManager}`)
    .end((err, res) => {
      expect(res.body.status).to.be.equal(400);
      expect(res);
      done();
    });
  });
  it('should not allow someone to comment on a travel request with a wrong ID', (done) => {
    chai
      .request(app)
      .post(`${prefix}?requestId=121212129jj2n2nbd`)
      .set('x-access-token', `${testManager}`)
      .send({
        comment: "hello, i thought that was the way it's supposed to be"
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });
  it('should not allow someone to comment on a travel request which does not belong to him', (done) => {
    chai
      .request(app)
      .post(`${prefix}?requestId=48e9bfdf-6d21-4fd8-8fc7-df654d615be1`)
      .set('x-access-token', `${testManager}`)
      .send({
        comment: "hello, i thought that was the way it's supposed to be"
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
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
    client.emit('connect_user', '0e11ed8c-a1a5-4f49-a3ca-450769bfa49o');
  });
  onlineClients.set('0e11ed8c-a1a5-4f49-a3ca-450769bfa49o');

  it('should allow someone to comment on a travel request', (done) => {
    chai
      .request(app)
      .post(`${prefix}?requestId=${id}`)
      .set('x-access-token', `${testManager}`)
      .send({
        comment: "hello, i thought that was the way it's supposed to be"
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(201);
        expect(res);
        done();
      });
  });
  client.on('connect', () => {
    client.emit('connect_user', 'd01cf3f2-4601-4b53-8ffd-fd46b5ded623');
  });
  onlineClients.set('d01cf3f2-4601-4b53-8ffd-fd46b5ded623');
  it('should allow someone to comment on a travel request', (done) => {
    chai
      .request(app)
      .post(`${prefix}?requestId=${id}`)
      .set('x-access-token', `${aAtandela}`)
      .send({
        comment: "hello, I am a user making a comment"
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(201);
        expect(res);
        done();
      });
  });
});
