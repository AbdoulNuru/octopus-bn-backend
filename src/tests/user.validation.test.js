import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';

chai.use(chaiHttp);
const prefix = '/api/v1/auth';
const strongPassword = 'TC866XY9EHEGz!+P'

describe('User input validation', () => {
  it('should return an error message if firstName is not given', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        lastName: 'johanes',
        email: 'email@gmail.com',
        password: strongPassword,
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.deep.equal(['First name is required']);
        expect(res.body).to.have.property('status', 422);
        done();
      });
  });
  it('should return an error message when the firstName isn\'t only letter', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        firstName: 'wess12*',
        lastName: 'johanes',
        email: 'email@gmail.com',
        password: strongPassword,
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.deep.equal(['First name must only contain letters']);
        expect(res.body).to.have.property('status', 422);
        done();
      });
  });
  it('should return an error message if lastName is not given', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        firstName: 'johanes',
        email: 'email@gmail.com',
        password: strongPassword,
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.deep.equal(['Last name is required']);
        expect(res.body).to.have.property('status', 422);
        done();
      });
  });
  it('should return an error message when the lastName isn\'t only letter', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        firstName: 'wess',
        lastName: 'johanes12',
        email: 'email@gmail.com',
        password: strongPassword,
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.deep.equal(['Last name must only contain letters']);
        expect(res.body).to.have.property('status', 422);
        done();
      });
  });
  it('should return an error message if email is not given', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        firstName: 'johanes',
        lastName: 'mukudwa',
        password: strongPassword,
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.deep.equal(['email is required']);
        expect(res.body).to.have.property('status', 422);
        done();
      });
  });
  it('should return an error message if email provided is invalid', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        firstName: 'johanes',
        lastName: 'mukudwa',
        email: '234.',
        password: strongPassword,
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.deep.equal(['email should be valid']);
        expect(res.body).to.have.property('status', 422);
        done();
      });
  });
  it('should return an error message if email is already taken', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        firstName: 'johanes',
        lastName: 'mukudwa',
        email: 'octopus@andela.com',
        password: strongPassword,
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.deep.equal('email already taken');
        expect(res.body).to.have.property('status', 409);
        done();
      });
  });
  it('should return an error message if password is not given', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        firstName: 'johanes',
        lastName: 'mukudwa',
        email: 'jean@gmail.com',
        password: ''
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('status', 422);
        done();
      });
  });
  it('should return an error message if password is not only alphanumeric', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        firstName: 'johanes',
        lastName: 'mukudwa',
        email: 'jean@gmail.com',
        password: 'jkfbdkhjs',
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.deep.equal(['Please enter a password at least 8 character and contain At least one uppercase.At least one lower case.At least one special character.']);
        expect(res.body).to.have.property('status', 422);
        done();
      });
  });
  it('should return an error message if password length is less than 8', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        firstName: 'johanes',
        lastName: 'mukudwa',
        email: 'jean@gmail.com',
        password: '243df',
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('status', 422);
        done();
      });
  });
});
