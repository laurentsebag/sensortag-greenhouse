require('../../app/models/reading');

var should = require('should'),
  mongoose = require('mongoose'),
  Reading = mongoose.model('Reading'),
  controller = require('../../app/controllers/reading');

describe('Unit test', function () {
  describe('Controller reading', function () {
    before(function (done) {
      var reading = new Reading({
        value: 1,
        type: Reading.TYPE_HUMIDITY,
        date: new Date(0)
      });

      Reading.remove({}, function (err) {
        should.not.exist(err);
        reading.save(function (err) {
          should.not.exist(err);
          done();
        });
      });
    });
    describe('Method getAllReadings', function () {
      it('should return all the readings', function (done) {
        controller.getAllReadings(null, function (err, readings) {
          should.not.exist(err);
          should.exist(readings);
          readings.should.have.property(Reading.TYPE_TEMP_AMBIENT).length(0);
          readings.should.have.property(Reading.TYPE_TEMP_IR).length(0);
          readings.should.have.property(Reading.TYPE_LUMINOSITY).length(0);
          readings.should.have.property(Reading.TYPE_PRESSURE).length(0);
          readings.should.have.property(Reading.TYPE_HUMIDITY).length(1);
          var humidity = readings[Reading.TYPE_HUMIDITY][0];
          humidity.should.not.have.property('type');
          humidity.should.not.have.property('_id');
          done();
        });
      });
      it('should return null if there are no new readings since `since`', function (done) {
        controller.getAllReadings({since: new Date()}, function (err, readings) {
          should.not.exist(err);
          should.equal(readings, null);
          done();
        });
      });
    });
    describe('Method addReading', function () {
      var readings = {};
      readings[Reading.TYPE_TEMP_IR] = {
        date: new Date(),
        value: 0
      };
      readings[Reading.TYPE_TEMP_AMBIENT] = {
        date: new Date(),
        value: 1
      };
      readings[Reading.TYPE_HUMIDITY] = {
        date: new Date(),
        value: 2
      };
      readings[Reading.TYPE_PRESSURE] = {
        date: new Date(),
        value: 3
      };
      readings[Reading.TYPE_LUMINOSITY] = {
        date: new Date(),
        value: 4
      };

      it('should add readings to the model', function (done) {
        controller.addReadings(readings, function (err) {
          should.not.exist(err);
          controller.getAllReadings(null, function (err, readings) {
            should.not.exist(err);
            should.exist(readings);
            readings.should.have.property(Reading.TYPE_TEMP_AMBIENT).length(1);
            readings.should.have.property(Reading.TYPE_TEMP_IR).length(1);
            readings.should.have.property(Reading.TYPE_HUMIDITY).length(2);
            readings.should.have.property(Reading.TYPE_PRESSURE).length(1);
            readings.should.have.property(Reading.TYPE_LUMINOSITY).length(1);
            done();
          });
        });
      });
    });
    after(function (done) {
      Reading.remove({}, function (err) {
        should.not.exist(err);
        done();
      });
    });
  });
});
