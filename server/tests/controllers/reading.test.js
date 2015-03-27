var should = require('should'),
  controller = require('../../app/controllers/reading');

describe('Unit test', function () {
  describe('Controller reading', function () {
    describe('Method getAllReadings', function () {
      it('should return all the readings', function (done) {
        controller.getAllReadings(function (err, readings) {
          should.not.exist(err);
          should.exist(readings);
          readings.should.have.property('ambientTemperature');
          readings.should.have.property('irTemperature');
          readings.should.have.property('luminosity');
          readings.should.have.property('pressure');
          readings.should.have.property('humidity');
          done();
        });
      });
    });
    describe('Method addReading', function () {
      var reading = {
        irTemperature: {
          date: new Date(),
          value: 0
        },
        ambientTemperature: {
          date: new Date(),
          value: 1
        },
        humidity: {
          date: new Date(),
          value: 2
        },
        pressure: {
          date: new Date(),
          value: 3
        },
        luminosity: {
          date: new Date(),
          value: 4
        }
      };

      it('should add readings to the model', function (done) {
        controller.addReading(reading, function (err) {
          should.not.exist(err);
          controller.getAllReadings(function (err, readings) {
            should.not.exist(err);
            should.exist(readings);
            readings.should.have.property('ambientTemperature').length(1);
            readings.should.have.property('irTemperature').length(1);
            readings.should.have.property('humidity').length(1);
            readings.should.have.property('pressure').length(1);
            readings.should.have.property('luminosity').length(1);
            done();
          });
        });
      });
    });
  });
});
