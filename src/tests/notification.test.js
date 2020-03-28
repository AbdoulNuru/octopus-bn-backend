import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import sendGrid from '@sendgrid/mail';
import io from 'socket.io-client';
import { tripRequestsMock } from './mock/tripRequestsMock';
import notMock from './mock/notMock';
import tripsController from '../controllers/tripsController';
import commentsController from '../controllers/commentsController';
import app from '../index';
import { onlineClients } from '../utils/socket';
import { rusimbipatrick, itsafact57 } from './mock/tokens';

chai.use(chaiHttp);

describe('Notifications', () => {
  it('It should request a trip to save a notification in the db', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${rusimbipatrick}`)
      .send(tripRequestsMock)
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'message', 'data');
        expect(res.body.status).to.be.equal(201);
        expect(res.body.message).to.be.equal('La demande de voyage a bien été créée');
        expect(res);
        done();
      });
  });

  it('It should return update notification preferences', (done) => {
    chai
      .request(app)
      .put('/api/v1/notifications/preferences')
      .set('x-access-token', `${rusimbipatrick}`)
      .send({
        notifyByEmail: 'true'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.keys('status', 'message');
        expect(res.body.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('Préférences modifiées avec succès');
        expect(res);
        done();
      });
  });

  before(async () => {
    const socketURL = 'http://localhost:3000';

    const options = {
      transports: ['websocket'],
      'force new connection': true
    };

    const client = io.connect(socketURL, options);
    client.on('connect', () => {
      client.emit('connect_user', '0e22ed1c-a1a5-4f49-a4ca-000732bfa49o');
    });
    await onlineClients.set('0e22ed1c-a1a5-4f49-a4ca-000732bfa49o');
    sinon.stub(sendGrid, 'send').returns({
      to: 'itsafact57@gmail.com',
      from: 'barefoot@noreply',
      subject: 'New trip request',
      text: 'Hello, Octopus.',
      html: 'emailTemplate'
    });
  });
  after(() => {
    sinon.restore();
  });

  it('It should return unread notifications ', (done) => {
    chai
      .request(app)
      .get('/api/v1/notifications/unread')
      .set('x-access-token', `${itsafact57}`)
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body.status).to.be.equal(200);
        expect(res);
        done();
      });
  });

  it('It should return all notifications ', (done) => {
    chai
      .request(app)
      .get('/api/v1/notifications/unread')
      .set('x-access-token', `${itsafact57}`)
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body.status).to.be.equal(200);
        expect(res);
        done();
      });
  });

  it('it should fail if something is wrong with notifications', async () => {
    const data = await tripsController.createTrip(notMock.request, notMock.response);
    expect(data.statusCode).to.be.equal(500);
  });

  it('it should fail if something is wrong with notifications', async () => {
    const data = await tripsController.multiCityTrip(notMock.request, notMock.response);
    expect(data.statusCode).to.be.equal(500);
  });
  it('it should fail if something is wrong with notifications', async () => {
    const data = await tripsController.availRequests(notMock.request, notMock.response);
    expect(data.statusCode).to.be.equal(500);
  });
  it('it should fail if something is wrong with notifications', async () => {
    const data = await tripsController.availRequests(notMock.request, notMock.response);
    expect(data.statusCode).to.be.equal(500);
  });
  it('it should fail if something is wrong with notifications', async () => {
    const data = await tripsController.getOnetripRequest(notMock.request, notMock.response);
    expect(data.statusCode).to.be.equal(500);
  });
  it('it should fail if something is wrong with notifications', async () => {
    const data = await tripsController.rejectTrip(notMock.request, notMock.response);
    expect(data.statusCode).to.be.equal(500);
  });
  it('it should fail if something is wrong with comment notifications', async () => {
    const data = await new commentsController().addComment(notMock.request, notMock.response);
    expect(data.statusCode).to.be.equal(500);
  });
});
