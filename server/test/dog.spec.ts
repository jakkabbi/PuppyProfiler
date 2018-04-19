import * as chai from 'chai';
import * as chaiHttp from 'chai-http';

process.env.NODE_ENV = 'test';
import { app } from '../app';
import Dog from '../models/dog';

const should = chai.use(chaiHttp).should();

describe('Dogs', () => {

  beforeEach(done => {
    Dog.remove({}, err => {
      done();
    });
  });

  describe('Backend tests for dogs', () => {

    it('should get all the dogs', done => {
      chai.request(app)
        .get('/api/dogs')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });

    it('should get dogs count', done => {
      chai.request(app)
        .get('/api/dogs/count')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('number');
          res.body.should.be.eql(0);
          done();
        });
    });

    it('should create new dog', done => {
      const dog = new Dog({user: 'test', dogName: 'www.forum.test'});
      chai.request(app)
        .post('/api/dog')
        .send(dog)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.a.property('dogName');
          res.body.should.have.a.property('dogUsername');
          res.body.should.have.a.property('dogPassword');
          done();
        });
    });

    it('should get a dog by its id', done => {
      const dog = new Dog({user: 'test', dogName: 'Dog'});
      dog.save((error, newDog) => {
        chai.request(app)
          .get(`/api/dog/${newDog.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('dogName');
            res.body.should.have.property('dogUsername');
            res.body.should.have.property('dogPassword');
            res.body.should.have.property('_id').eql(newDog.id);
            done();
          });
      });
    });

    it('should update a dog by its id', done => {
      const dog = new Dog({user: 'test', dogName: 'Dog'});
      dog.save((error, newDog) => {
        chai.request(app)
          .put(`/api/dog/${newDog.id}`)
          .send({ dogUsername: 5 })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    it('should delete a dog by its id', done => {
      const dog = new Dog({user: 'test', dogName: 'Dog'});
      dog.save((error, newDog) => {
        chai.request(app)
          .delete(`/api/dog/${newDog.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });

});
