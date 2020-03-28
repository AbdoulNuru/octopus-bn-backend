import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';
import { tripRequestsMock, wrongTrip } from './mock/tripRequestsMock';
import { newReqReturnWrong, newReqReturn } from './mock/tripRequestsReturnMock.js';
import { blaiseen, rusimbipatrick } from './mock/tokens';
import { badTripMock } from './mock/notMock';
import notMock from './mock/notMock';
import tripsController from '../controllers/tripsController';

chai.use(chaiHttp);

describe('trips', () => {
    it('should not request trip without login', (done) => {
        chai
            .request(app)
            .post('/api/v1/trips/request')
            .send(tripRequestsMock)
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'error');
                expect(res.body.status).to.be.equal(403);
                expect(res.body.error).to.be.equal('Please log in or sign up to continue');
                expect(res);
                done();
            });
    });

    it('It should not allow request trip without providing data', (done) => {
        chai
            .request(app)
            .post('/api/v1/trips/request')
            .set('x-access-token', `${blaiseen}`)
            .send(wrongTrip)
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'error');
                expect(res.body.status).to.be.equal(400);
                expect(res);
                done();
            });
    });
    it('It should request trip successfully', (done) => {
        chai
            .request(app)
            .post('/api/v1/trips/request')
            .set('x-access-token', `${blaiseen}`)
            .send(tripRequestsMock)
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'message', 'data');
                expect(res.body.status).to.be.equal(201);
                expect(res.body.message).to.be.equal('Travel request successfully created');
                expect(res);
                done();
            });
    });
    it('It should not request two way trip with no proper return date', (done) => {
        chai
            .request(app)
            .post('/api/v1/trips/request')
            .set('x-access-token', `${blaiseen}`)
            .send(newReqReturnWrong)
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'error');
                expect(res.body.status).to.be.equal(400);
                expect(res);
                done();
            });
    });
    it('It should not allow request trip without providing type date', (done) => {
        chai
            .request(app)
            .post('/api/v1/trips/request')
            .set('x-access-token', `${blaiseen}`)
            .send({
                fromCountry: 'rw',
                fromCity: 'Kigali',
                toCountry: 'USA',
                toCity: 'Texas',
                departureDate: '2050-06-17',
                accommodation: 'yes',
                reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
            })
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'error');
                expect(res.body.status).to.be.equal(400);
                expect(res);
                done();
            });
    });
    it('It should not allow request trip without providing a from country', (done) => {
        chai
            .request(app)
            .post('/api/v1/trips/request')
            .set('x-access-token', `${blaiseen}`)
            .send({
                type: 'one way',
                fromCity: 'Kigali',
                toCountry: 'USA',
                toCity: 'Texas',
                departureDate: '2050-06-17',
                accommodation: 'yes',
                reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
            })
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'error');
                expect(res.body.status).to.be.equal(400);
                expect(res);
                done();
            });
    });
    it('It should not allow request trip without providing a from city', (done) => {
        chai
            .request(app)
            .post('/api/v1/trips/request')
            .set('x-access-token', `${blaiseen}`)
            .send({
                type: 'one way',
                fromCountry: 'rw',
                toCountry: 'USA',
                toCity: 'Texas',
                departureDate: '2050-06-17',
                accommodation: 'yes',
                reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
            })
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'error');
                expect(res.body.status).to.be.equal(400);
                expect(res);
                done();
            });
    });
    it('It should not allow request trip without providing a to country', (done) => {
        chai
            .request(app)
            .post('/api/v1/trips/request')
            .set('x-access-token', `${blaiseen}`)
            .send({
                type: 'one way',
                fromCountry: 'rw',
                fromCity: 'Kigali',
                toCity: 'Texas',
                departureDate: '2050-06-17',
                accommodation: 'yes',
                reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
            })
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'error');
                expect(res.body.status).to.be.equal(400);
                expect(res);
                done();
            });
    });
    it('It should not allow request trip without providing a to city', (done) => {
        chai
            .request(app)
            .post('/api/v1/trips/request')
            .set('x-access-token', `${blaiseen}`)
            .send({
                type: 'one way',
                fromCountry: 'rw',
                fromCity: 'Kigali',
                toCountry: 'USA',
                departureDate: '2050-06-17',
                accommodation: 'yes',
                reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
            })
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'error');
                expect(res.body.status).to.be.equal(400);
                expect(res);
                done();
            });
    });
    it('It should not allow request trip without providing a reason', (done) => {
        chai
            .request(app)
            .post('/api/v1/trips/request')
            .set('x-access-token', `${blaiseen}`)
            .send({
                type: 'return',
                fromCountry: 'rw',
                fromCity: 'Kigali',
                toCountry: 'USA',
                toCity: 'Texas',
                departureDate: '2020-06-17',
                returnDate: '2020-06-15',
                accommodation: 'yes',
            })
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'error');
                expect(res.body.status).to.be.equal(400);
                expect(res);
                done();
            });
    });
    it('It should not allow request trip without providing proper date', (done) => {
        chai
            .request(app)
            .post('/api/v1/trips/request')
            .set('x-access-token', `${blaiseen}`)
            .send({
                type: 'return',
                fromCountry: 'rw',
                fromCity: 'Kigali',
                toCountry: 'USA',
                toCity: 'Texas',
                departureDate: '2020-06-17',
                returnDate: '2020-06-15',
                accommodation: 'yes',
                reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
            })
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'error');
                expect(res.body.status).to.be.equal(400);
                expect(res);
                done();
            });
    });
    it('It should not allow request trip without providing proper date', (done) => {
        chai
            .request(app)
            .post('/api/v1/trips/request')
            .set('x-access-token', `${blaiseen}`)
            .send({
                type: 'return',
                fromCountry: 'rw',
                fromCity: 'Kigali',
                toCountry: 'USA',
                toCity: 'Texas',
                departureDate: '2020-06-17',
                returnDate: '2020-06-20',
                accommodation: 'hello',
                reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
            })
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'error');
                expect(res.body.status).to.be.equal(400);
                expect(res);
                done();
            });
    });

    it('It should not allow request trip without providing proper date', (done) => {
        chai
            .request(app)
            .post('/api/v1/trips/request')
            .set('x-access-token', `${blaiseen}`)
            .send({
                type: 'return',
                fromCountry: 'rw',
                fromCity: 'Kigali',
                toCountry: 'USA',
                toCity: 'Texas',
                departureDate: '2020-06-17',
                returnDate: '2000-06-20',
                accommodation: 'yes',
                reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
            })
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'error');
                expect(res.body.status).to.be.equal(400);
                expect(res);
                done();
            });
    });

    it('It should not allow request trip without providing proper date', (done) => {
        chai
            .request(app)
            .post('/api/v1/trips/request')
            .set('x-access-token', `${blaiseen}`)
            .send({
                type: 'return',
                fromCountry: 'rw',
                fromCity: 'Kigali',
                toCountry: 'USA',
                toCity: 'Texas',
                departureDate: '2020-06-17',
                returnDate: '20-06-20',
                accommodation: 'yes',
                reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
            })
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'error');
                expect(res.body.status).to.be.equal(400);
                expect(res);
                done();
            });
    });

    it('It should not allow request trip without providing proper date', (done) => {
        chai
            .request(app)
            .post('/api/v1/trips/request')
            .set('x-access-token', `${blaiseen}`)
            .send({
                type: 'return',
                fromCountry: 'rw',
                fromCity: 'Kigali',
                toCountry: 'USA',
                toCity: 'Texas',
                departureDate: '2020-06-17',
                returnDate: '',
                accommodation: 'yes',
                reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
            })
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'error');
                expect(res.body.status).to.be.equal(400);
                expect(res);
                done();
            });
    });

    it('It should not allow request trip without providing proper date', (done) => {
        chai
            .request(app)
            .post('/api/v1/trips/request')
            .set('x-access-token', `${blaiseen}`)
            .send({
                type: 'return',
                fromCountry: 'rw',
                fromCity: 'Kigali',
                toCountry: 'USA',
                toCity: 'Texas',
                departureDate: '2020-06-17',
                returnDate: '',
                accommodation: 'yes',
                reason: 'not enough'
            })
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'error');
                expect(res.body.status).to.be.equal(400);
                expect(res);
                done();
            });
    });

    it('It should not allow request trip without providing proper date', (done) => {
        chai
            .request(app)
            .post('/api/v1/trips/request')
            .set('x-access-token', `${blaiseen}`)
            .send({
                type: 'return',
                fromCountry: 'rw',
                fromCity: 'Kigali',
                toCountry: 'USA',
                toCity: 'Texas',
                departureDate: '2020-06-17',
                returnDate: '',
                accommodation: 'yes',
                reason: ''
            })
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'error');
                expect(res.body.status).to.be.equal(400);
                expect(res);
                done();
            });
    });


    it('It should request return trip way successfully', (done) => {
        chai
            .request(app)
            .post('/api/v1/trips/request')
            .set('x-access-token', `${blaiseen}`)
            .send(newReqReturn)
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'message', 'data');
                expect(res.body.status).to.be.equal(201);
                expect(res.body.message).to.be.equal('Travel request successfully created');
                expect(res);
                done();
            });
    });
    it('It should retrieve requests successfully', (done) => {
        chai
            .request(app)
            .get('/api/v1/trips/request')
            .set('x-access-token', `${blaiseen}`)
            .send(newReqReturn)
            .end((err, res) => {

                expect(res.body).to.have.keys('status', 'message', 'data', 'info');
                expect(res.body.status).to.be.equal(200);
                expect(res.body.message).to.be.equal('Requests retrieved successfully');
                expect(res);
                done();
            });
    });
    it('It should not allow get with wrong params ', (done) => {
        chai
            .request(app)
            .get('/api/v1/trips/request?page=-2&limit=3')
            .set('x-access-token', `${blaiseen}`)
            .send(newReqReturn)
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'error');
                expect(res.body.status).to.be.equal(400);
                expect(res.body.error).to.be.equal('Invalid params (search data)');
                expect(res);
                done();
            });
    });

  it('should not request trip without login', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .send(tripRequestsMock)
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(403);
        expect(res.body.error).to.be.equal('Please log in or sign up to continue');
        expect(res);
        done();
      });
  });

  it('It should not allow request trip without providing data', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send(wrongTrip)
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });
  it('It should request trip successfully', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send(tripRequestsMock)
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'message', 'data');
        expect(res.body.status).to.be.equal(201);
        expect(res.body.message).to.be.equal('Travel request successfully created');
        expect(res);
        done();
      });
  });
  it('It should not request two way trip with no proper return date', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send(newReqReturnWrong)
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });
  it('It should not allow request trip without providing type date', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send({
        fromCountry: 'rw',
        fromCity: 'Kigali',
        toCountry: 'USA',
        toCity: 'Texas',
        departureDate: '2050-06-17',
        accommodation: 'yes',
        reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });
  it('It should not allow request trip without providing a from country', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send({
        type: 'one way',
        fromCity: 'Kigali',
        toCountry: 'USA',
        toCity: 'Texas',
        departureDate: '2050-06-17',
        accommodation: 'yes',
        reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });
  it('It should not allow request trip without providing a from city', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send({
        type: 'one way',
        fromCountry: 'rw',
        toCountry: 'USA',
        toCity: 'Texas',
        departureDate: '2050-06-17',
        accommodation: 'yes',
        reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });
  it('It should not allow request trip without providing a to country', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send({
        type: 'one way',
        fromCountry: 'rw',
        fromCity: 'Kigali',
        toCity: 'Texas',
        departureDate: '2050-06-17',
        accommodation: 'yes',
        reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });
  it('It should not allow request trip without providing a to city', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send({
        type: 'one way',
        fromCountry: 'rw',
        fromCity: 'Kigali',
        toCountry: 'USA',
        departureDate: '2050-06-17',
        accommodation: 'yes',
        reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });
  it('It should not allow request trip without providing a reason', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send({
        type: 'return',
        fromCountry: 'rw',
        fromCity: 'Kigali',
        toCountry: 'USA',
        toCity: 'Texas',
        departureDate: '2020-06-17',
        returnDate: '2020-06-15',
        accommodation: 'yes',
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });
  it('It should not allow request trip without providing proper date', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send({
        type: 'return',
        fromCountry: 'rw',
        fromCity: 'Kigali',
        toCountry: 'USA',
        toCity: 'Texas',
        departureDate: '2020-06-17',
        returnDate: '2020-06-15',
        accommodation: 'yes',
        reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });
  it('It should not allow request trip without providing proper date', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send({
        type: 'return',
        fromCountry: 'rw',
        fromCity: 'Kigali',
        toCountry: 'USA',
        toCity: 'Texas',
        departureDate: '2020-06-17',
        returnDate: '2020-06-20',
        accommodation: 'hello',
        reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });

  it('It should not allow request trip without providing proper date', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send({
        type: 'return',
        fromCountry: 'rw',
        fromCity: 'Kigali',
        toCountry: 'USA',
        toCity: 'Texas',
        departureDate: '2020-06-17',
        returnDate: '2000-06-20',
        accommodation: 'yes',
        reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });

  it('It should not allow request trip without providing proper date', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send({
        type: 'return',
        fromCountry: 'rw',
        fromCity: 'Kigali',
        toCountry: 'USA',
        toCity: 'Texas',
        departureDate: '2020-06-17',
        returnDate: '20-06-20',
        accommodation: 'yes',
        reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });

  it('It should not allow request trip without providing proper date', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send({
        type: 'return',
        fromCountry: 'rw',
        fromCity: 'Kigali',
        toCountry: 'USA',
        toCity: 'Texas',
        departureDate: '2020-06-17',
        returnDate: '',
        accommodation: 'yes',
        reason: 'the employee needs to attend a conference where the presence of a company representative is needed'
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });

  it('It should not allow request trip without providing proper date', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send({
        type: 'return',
        fromCountry: 'rw',
        fromCity: 'Kigali',
        toCountry: 'USA',
        toCity: 'Texas',
        departureDate: '2020-06-17',
        returnDate: '',
        accommodation: 'yes',
        reason: 'not enough'
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });

  it('It should not allow request trip without providing proper date', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send({
        type: 'return',
        fromCountry: 'rw',
        fromCity: 'Kigali',
        toCountry: 'USA',
        toCity: 'Texas',
        departureDate: '2020-06-17',
        returnDate: '',
        accommodation: 'yes',
        reason: ''
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });


  it('It should request return trip way successfully', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send(newReqReturn)
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'message', 'data');
        expect(res.body.status).to.be.equal(201);
        expect(res.body.message).to.be.equal('Travel request successfully created');
        expect(res);
        done();
      });
  });
  it('It should retrieve requests successfully', (done) => {
    chai
      .request(app)
      .get('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send(newReqReturn)
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'message', 'data', 'info');
        expect(res.body.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('Requests retrieved successfully');
        expect(res);
        done();
      });
  });
  it('It should not allow get with wrong params ', (done) => {
    chai
      .request(app)
      .get('/api/v1/trips/request?page=-2&limit=3')
      .set('x-access-token', `${blaiseen}`)
      .send(newReqReturn)
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('Invalid params (search data)');
        expect(res);
        done();
      });
  });

  it('It should not allow request trip without valid dates', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send({
        type: 'return',
        fromCountry: 'rw',
        fromCity: 'Kigali',
        toCountry: 'USA',
        toCity: 'Texas',
        departureDate: '2020-06-yty',
        returnDate: '2020-06-20',
        accommodation: 'yes',
        reason: 'visit the product owners and demo the project'
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });

  it('It should not allow request trip without valid type', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send({
        type: 'one way',
        fromCountry: 'rw',
        fromCity: 'Kigali',
        toCountry: 'USA',
        toCity: 'Texas',
        departureDate: '2022-06-16',
        returnDate: '2022-06-20',
        accommodation: 'yes',
        reason: 'visit the product owners and demo the project'
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });

  it('It should not allow request trip without a reason', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .set('x-access-token', `${blaiseen}`)
      .send({
        type: 'return',
        fromCountry: 'rw',
        fromCity: 'Kigali',
        toCountry: 'USA',
        toCity: 'Texas',
        departureDate: '2022-06-16',
        returnDate: '2022-06-20',
        accommodation: 'yes',
        reason: 'vi'
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });

    it('It should get one trip request ', (done) => {
        chai
            .request(app)
            .get('/api/v1/trips/5086bfdb-37d3-4b03-99f6-1889e33aa048')
            .set('x-access-token', `${rusimbipatrick}`)
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'message');
                expect(res.body.status).to.be.equal(200);
                expect(res);
                done();
            });
    });

    it('It should send error message if trip request is not found', (done) => {
        chai
            .request(app)
            .get('/api/v1/trips/5086bfdb-3')
            .set('x-access-token', `${rusimbipatrick}`)
            .end((err, res) => {
                expect(res.body).to.have.keys('status', 'error');
                expect(res.body.status).to.be.equal(404);
                expect(res);
                done();
            });
    });

  it('It should get one trip request ', (done) => {
    chai
      .request(app)
      .get('/api/v1/trips/5086bfdb-37d3-4b03-99f6-1889e33aa048')
      .set('x-access-token', `${rusimbipatrick}`)
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'message');
        expect(res.body.status).to.be.equal(200);
        expect(res);
        done();
      });
  });

  it('It should send error message if trip request is not found', (done) => {
    chai
      .request(app)
      .get('/api/v1/trips/5086bfdb-3')
      .set('x-access-token', `${rusimbipatrick}`)
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(404);
        expect(res);
        done();
      });
  });

  it('it should fail if something is wrong with getting trip requests', async () => {
    const data = await tripsController.getTrips(badTripMock.request, badTripMock.response);
    expect(data.statusCode).to.be.equal(500);
  });

  it('it should fail if something is wrong with searching trip requests', async () => {
    const data = await tripsController.searchTrips(badTripMock.request, notMock.response);
    expect(data.statusCode).to.be.equal(500);
  });
});
