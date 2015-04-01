var mongoose = require('mongoose'),
  Promise = mongoose.Promise,
  Schema = mongoose.Schema,
  readingTypes = [
    'humidity',
    'luminosity',
    'pressure',
    'temp_ambient',
    'temp_ir'
  ];

var readingSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  value: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: readingTypes
  }
});

readingSchema.index({date: 1, type: 1}, {unique: true});

readingSchema.statics = {
  TYPE_HUMIDITY: readingTypes[0],
  TYPE_LUMINOSITY: readingTypes[1],
  TYPE_PRESSURE: readingTypes[2],
  TYPE_TEMP_AMBIENT: readingTypes[3],
  TYPE_TEMP_IR: readingTypes[4]
};

readingSchema.methods.promiseSave = function () {
  var promise = new Promise();
  this.save(function (err, reading) {
    if (err) {
      promise.reject(err);
      return;
    }

    promise.fulfill(reading);
  });
};

mongoose.model('Reading', readingSchema);
