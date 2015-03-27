var controller = require('../controllers/reading');

module.exports = function (app) {
  app.get('/api/reading/', function(req, res) {
    controller.getAllReadings(function (err, readings) {
      if (err) {
        res.status(500).json({message: 'Internal server error'});
        return;
      }

      res.json(readings);
    });
  });
};
