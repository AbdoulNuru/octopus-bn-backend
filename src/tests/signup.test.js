import Chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sendGrid from '@sendgrid/mail';
import app from '../index';
import {
  user, token, email, role
} from './mock/user.mock';
import { abdoulniyigena } from './mock/tokens';

Chai.use(chaiHttp);
Chai.should();

describe('Barefoot nomad signup tests', () => {
  before(() => {
    sinon.stub(sendGrid, 'send').returns({
      to: 'nuruniyigena@gmail.com',
      from: 'barefoot@noreply',
      subject: 'Barefoot Nomad Confirmation email',
      text: 'Hello, Octopus.',
      html: 'emailTemplate'
    });
  });

  after(() => {
    sinon.restore();
  });

  it('users should be able to create accounts', (done) => {
    Chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.data.should.have.property('email', user.email);
        res.body.data.should.have.property('firstName', user.firstName);
        res.body.data.should.have.property('lastName', user.lastName);
        res.body.should.have.property('message');
        done();
      });
  });

  it('users should be able to verify their accounts', (done) => {
    Chai
      .request(app)
      .get(`/api/v1/auth/verify/${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message', 'Your account is verified, you can now login');
        done();
      });
  });

  it('User should be assigned roles', (done) => {
    Chai
      .request(app)
      .post('/api/v1/auth/assign-roles')
      .set('x-access-token', `${abdoulniyigena}`)
      .send({ email, role })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message', `Your role was upgraded to ${role}`);
        done();
      });
  });

  it('Do not assign roles to users who don\' exist', (done) => {
    Chai
      .request(app)
      .post('/api/v1/auth/assign-roles')
      .set('x-access-token', `${abdoulniyigena}`)
      .send({ email: 'jim@gmail.com', role })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error', 'The User you are assigning the role to don\'t exist');
        done();
      });
  });
});
