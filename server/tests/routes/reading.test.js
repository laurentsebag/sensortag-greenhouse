var request = require('supertest'),
    should = require('should'),
    app = require('../../app/index'),
    PATH = '/api/reading';

describe('Unit test', function () {
  describe('Route reading', function () {
    describe('GET /api/reading/', function () {
      it('should return all the readings', function (done) {
        request(app)
          .get(PATH)
          .expect(200)
          .end(function (err, res) {
            should.not.exist(err);
            should.exist(res.body);
            res.body.should.have.property('irTemperature');
            res.body.should.have.property('ambientTemperature');
            res.body.should.have.property('humidity');
            res.body.should.have.property('pressure');
            res.body.should.have.property('luminosity');
            done();
          });
      });
    });
  });
});
