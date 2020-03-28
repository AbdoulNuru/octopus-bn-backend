import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import chaiHttp from 'chai-http';
import app from '../index';
import accommodationController from '../controllers/accommodation';
import invalid from './mock/socialInvalid';
import { octopusbn } from './mock/tokens';

chai.use(chaiHttp);

const prefix = '/api/v1/accommodations/feedback';
const id = 'd01cf3f2-4601-4b53-8ffd-fd46b6ded623';
const feedback = {
	feedback: 'real comment'
};
describe('ACCOMMODATION FEEDBACK', () => {
	it('should not profile feedback with no feedback provided', (done) => {
		chai
			.request(app)
			.post('/api/v1/accommodations/feedback?accommodationId=d01cf3f2-4601-4b53-8ffd-fd46b6ded623')
			.set('x-access-token', `${octopusbn}`)
			.end((err, res) => {
				expect(res.body).to.have.keys('status', 'error');
				expect(res).to.have.status(400);
				done();
			});
	});
	it('should not profile feedback with no accommodation id provided', (done) => {
		chai
			.request(app)
			.post('/api/v1/accommodations/feedback?accommodationId=null')
			.set('x-access-token', `${octopusbn}`)
			.send(feedback)
			.end((err, res) => {
				expect(res.body).to.have.keys('status', 'error');
				expect(res).to.have.status(400);
				done();
			});
	});
	it('should provide feedback successful', (done) => {
		chai
			.request(app)
			.post('/api/v1/accommodations/feedback?accommodationId=c8e9428a-6d60-4083-8ce3-334c58afe72c')
			.set('x-access-token', `${octopusbn}`)
			.send(feedback)
			.end((err, res) => {
				expect(res.body).to.have.keys('status', 'error');
				expect(res).to.have.status(404);
				done();
			});
    });
    //unity testing for 500 status
    it('should fail if req.user have no required data', async () => {
        const data = await accommodationController.feedback(invalid.request, invalid.response);
        expect(data.statusCode).to.be.equal(500);
      });

	it('should provide feedback successful', (done) => {
		chai
			.request(app)
			.post('/api/v1/accommodations/feedback?accommodationId=c8e9428a-6d60-4083-8ce3-334c62afe72c')
			.set('x-access-token', `${octopusbn}`)
			.send(feedback)
			.end((err, res) => {
				expect(res.body).to.have.keys('status', 'message');
				expect(res).to.have.status(201);
				done();
			});
	});
});
