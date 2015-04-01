var should = require('should'),
    mongoose = require('mongoose'),
    Reading = mongoose.model('Reading');

describe('Unit test', function () {
  describe('Model readings', function () {
    before(function () {
      Reading.remove({}, function (err) {
        should.not.exist(err);
      });
    });
    it('should not create a reading without a value', function (done) {
      var reading = new Reading({
        type: Reading.TYPE_LUMINOSITY
      });
      reading.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should not create a reading without a type', function (done) {
      var reading = new Reading({
        value: 13.5
      });
      reading.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should not create a reading with an invalid type', function (done) {
      var reading = new Reading({
        value: 13.5,
        type: 'invalid_type'
      });
      reading.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should only allow one reading for a given type/date', function (done) {
      var date = new Date(),
        type = Reading.TYPE_PRESSURE,
        reading = new Reading({
          date: date,
          type: type,
          value: 1010
        }),
        reading2 = new Reading({
          date: date,
          type: type,
          value: 1020
        });
      reading.save(function (err) {
        should.not.exist(err);
        reading2.save(function (err) {
          should.exist(err);
          done();
        });
      });
    });
    it('should allow same dates for different types', function (done) {
      var date = new Date(),
        reading = new Reading({
          date: date,
          type: Reading.TYPE_PRESSURE,
          value: 1010
        }),
        reading2 = new Reading({
          date: date,
          type: Reading.TYPE_LUMINOSITY,
          value: 1020
        });
      reading.save(function (err) {
        should.not.exist(err);
        reading2.save(function (err) {
          should.not.exist(err);
          done();
        });
      });
    });
    it('should allow to save a reading', function (done) {
      var reading = new Reading({
        value: 88.5,
        type: Reading.TYPE_HUMIDITY
      });
      reading.save(function (err, r) {
        should.not.exist(err);
        should.exist(r);
        r.should.have.property('value').equal(reading.value);
        r.should.have.property('type').equal(reading.type);
        r.should.have.property('date');
        done();
      });
    });
    it('should allow to give an optional date', function (done) {
      var reading = new Reading({
        value: 88.5,
        type: Reading.TYPE_HUMIDITY,
        date: new Date(Date.now() - 10000)
      });
      reading.save(function (err, r) {
        should.not.exist(err);
        should.exist(r);
        r.should.have.property('value').equal(reading.value);
        r.should.have.property('type').equal(reading.type);
        r.should.have.property('date').equal(reading.date);
        r.should.have.property('date').not.equal(new Date());
        done();
      });
    });
    after(function () {
      Reading.remove({}, function (err) {
        should.not.exist(err);
      });
    });
  });
});
