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
        controller.getAllReadings(function (err, readings) {
          should.not.exist(err);
          should.exist(readings);
          readings.should.have.property('ambientTemperature').length(0);
          readings.should.have.property('irTemperature').length(0);
          readings.should.have.property('luminosity').length(0);
          readings.should.have.property('pressure').length(0);
          readings.should.have.property('humidity').length(1);
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
          controller.getAllReadings(function (err, readings) {
            should.not.exist(err);
            should.exist(readings);
            readings.should.have.property('ambientTemperature').length(1);
            readings.should.have.property('irTemperature').length(1);
            readings.should.have.property('humidity').length(2);
            readings.should.have.property('pressure').length(1);
            readings.should.have.property('luminosity').length(1);
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
