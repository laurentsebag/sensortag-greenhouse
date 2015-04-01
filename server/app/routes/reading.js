var controller = require('../controllers/reading');

module.exports = function (app) {
  app.get('/api/reading/', function(req, res) {
    var ifModifiedSince = req.headers['if-modified-since'];

    controller.getAllReadings({since: ifModifiedSince}, function (err, readings) {
      if (err) {
        res.status(500).json({message: 'Internal server error'});
        return;
      }

      if (readings === null) {
        res.status(304).json({message: 'Not modified'});
        return;
      }

      res.json(readings);
    });
  });
};
