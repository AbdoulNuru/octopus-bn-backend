import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';
import {
  trueAccommodation,
  noName,
  noCountry,
  noCity,
  noImageUrl,
  noAmenities,
  noAround,
  zeroAmenities
} from './mock/accommodationMock';
import { octopusbn } from './mock/tokens';
import notMock from './mock/notMock';
import AccommodaionController from '../controllers/accommodation';
import validateAccommodationAndRoom from '../middlewares/validateAccommodationAndRoom';
import { badTripMock } from './mock/notMock';

chai.use(chaiHttp);
const prefix = '/api/v1/accommodations';
describe('User input validation', () => {
  it('should not request trip without login', (done) => {
    chai.request(app)
    .post(`${prefix}`)
    .send(trueAccommodation)
    .end((err, res) => {
      expect(res.body).to.have.keys('status', 'error');
      expect(res.body.status).to.be.equal(403);
      expect(res.body.error).to.be.equal('Please log in or sign up to continue');
      expect(res);
      done();
    });
  });

  it('should return an error message if accommodation name is not given', (done) => {
    chai.request(app)
    .post(`${prefix}`)
    .set('x-access-token', `${octopusbn}`)
    .send(noName).end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should return an error message if accommodation country is not given', (done) => {
    chai.request(app)
    .post(`${prefix}`)
    .set('x-access-token', `${octopusbn}`)
    .send(noCountry)
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should return an error message if accommodation city is not given', (done) => {
    chai.request(app)
    .post(`${prefix}`)
    .set('x-access-token', `${octopusbn}`)
    .send(noCity).end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should return an error message if accommodation imageUrl is not given', (done) => {
    chai.request(app)
    .post(`${prefix}`)
    .send(noImageUrl)
    .set('x-access-token', `${octopusbn}`)
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should return an error message if accommodation amenities is not given', (done) => {
    chai.request(app)
    .post(`${prefix}`)
    .send(noAmenities)
    .set('x-access-token', `${octopusbn}`)
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should return an error message if accommodation around is not given', (done) => {
    chai.request(app)
    .post(`${prefix}`)
    .set('x-access-token', `${octopusbn}`)
    .send(noAround)
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should return an error message if accommodation zero amenities is not given', (done) => {
    chai.request(app)
    .post(`${prefix}`)
    .set('x-access-token', `${octopusbn}`)
    .send(zeroAmenities)
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should successfully record the accommodation', (done) => {
    chai.request(app)
    .post(`${prefix}`)
    .set('x-access-token', `${octopusbn}`)
    .send(trueAccommodation)
    .end((err, res) => {
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('status', 201);
      done();
    });
  });

    it('should return an error message if accommodation country is not given', (done) => {
    chai.request(app)
    .post(`${prefix}`)
    .set('x-access-token', `${octopusbn}`)
    .send(noCountry)
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });

  it('it should fail if something is wrong with creating an accomodation', async () => {
    const data = await AccommodaionController.create(notMock.request, notMock.response);
    expect(data.statusCode).to.be.equal(500);
  });

  it('it should fail if something is wrong with adding ratings to an accomodation', async () => {
    const data = await AccommodaionController.addRatings(notMock.request, notMock.response);
    expect(data.statusCode).to.be.equal(500);
  });

  it('it should fail if something is wrong with accomodation validation', async () => {
    const data = await validateAccommodationAndRoom(badTripMock.request, badTripMock.response);
    expect(data.request)
    expect(data.response)
    expect(data.statusCode).to.be.equal(500);
  });
});
