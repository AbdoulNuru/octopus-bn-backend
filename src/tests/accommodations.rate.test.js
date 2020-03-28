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

const trueRatings = {
	"accommodationId":"c8e9428a-6d60-4083-8ce3-334c62afe72c",
	"rating": 3
}
chai.use(chaiHttp);
const prefix = '/api/v1/accommodations';
describe('RATE ACCOMMODATIONS', () => {
  it('should rate an accommodation successfully', (done) => {
    chai.request(app)
    .post(`${prefix}/rating`)
    .set('x-access-token', `${octopusbn}`)
    .send(trueRatings).end((err, res) => {
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('status', 201);
      done();
    });
  });
  it('should update ratings successfully', (done) => {
    chai.request(app)
    .post(`${prefix}/rating`)
    .set('x-access-token', `${octopusbn}`)
    .send(trueRatings).end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('status', 200);
      done();
    });
  });
  it('should not rate without proving data', (done) => {
    chai.request(app)
    .post(`${prefix}/rating`)
    .set('x-access-token', `${octopusbn}`)
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });

  it('should not rate without wrong rating', (done) => {
    chai.request(app)
    .post(`${prefix}/rating`)
    .set('x-access-token', `${octopusbn}`)
    .send({
      "accommodationId":"c8e9428a-6d60-4083-8ce3-334c62afe72c",
	    "rating": 10
    }).end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
});
