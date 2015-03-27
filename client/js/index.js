(function () {
  'use strict';
  document.onready = function () {
    console.log("hello world");

    Chart.defaults.global.responsive = false;

    var convertData = function (inData) {
      var outData = {
        labels: [],
        data: []
      },
      i,
      dataLength = inData.length;

      for (i = 0; i < dataLength; ++i) {
        if (i % 5 === 0) {
          var date = new Date(inData[i].date);
          outData.labels.push(date.toLocaleTimeString());
        } else {
          outData.labels.push("");
        }
        outData.data.push(inData[i].value);
      }
      return outData;
    };

    var dataTemperature = {
      labels: [],
      datasets: [
        {
          label: "IR Temperature",
          fillColor: "rgba(220,20,20,0.2)",
          strokeColor: "rgba(220,20,20,1)",
          pointColor: "rgba(220,20,20,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,20,20,1)",
          data: []
        },
        {
          label: "Ambient Temperature",
          fillColor: "rgba(120,220,220,0.2)",
          strokeColor: "rgba(120,220,220,1)",
          pointColor: "rgba(120,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(120,220,220,1)",
          data: []
        }
      ]
    };
    var dataLuminosity = {
      labels: [],
      datasets: [
        {
          label: "Luminosity",
          fillColor: "rgba(20,220,20,0.2)",
          strokeColor: "rgba(20,220,20,1)",
          pointColor: "rgba(20,220,20,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(20,220,20,1)",
          data: []
        }
      ]
    };
    var dataPressure = {
      labels: [],
      datasets: [
        {
          label: "Barometric Pressure",
          fillColor: "rgba(20,20,220,0.2)",
          strokeColor: "rgba(20,220,220,1)",
          pointColor: "rgba(20,20,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(20,20,220,1)",
          data: []
        }
      ]
    };
    var dataHumidity = {
      labels: [],
      datasets: [
        {
          label: "Humidity",
          fillColor: "rgba(220,20,20,0.2)",
          strokeColor: "rgba(220,20,20,1)",
          pointColor: "rgba(220,20,20,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,20,20,1)",
          data: []
        }
      ]
    };

    var chartOptions = {
      pointDot: false
    };

    $.get('/api/reading', function (data) {
      console.log('got data', ir);
      var ir = convertData(data.irTemperature);
      var ambient = convertData(data.ambientTemperature);
      var luminosity = convertData(data.luminosity);
      var humidity = convertData(data.humidity);
      var pressure = convertData(data.pressure);


      dataTemperature.labels = ir.labels;
      dataTemperature.datasets[0].data = ir.data;
      dataTemperature.datasets[1].data = ambient.data;

      dataLuminosity.labels = luminosity.labels;
      dataLuminosity.datasets[0].data = luminosity.data;

      dataHumidity.labels = humidity.labels;
      dataHumidity.datasets[0].data = humidity.data;

      dataPressure.labels = pressure.labels;
      dataPressure.datasets[0].data = pressure.data;


      var ctx = document.getElementById("temperature").getContext("2d");
      var chartTemperature = new Chart(ctx).Line(dataTemperature, chartOptions);

      ctx = document.getElementById("luminosity").getContext("2d");
      var chartLuminosity = new Chart(ctx).Line(dataLuminosity, chartOptions);

      ctx = document.getElementById("pressure").getContext("2d");
      var chartPressure = new Chart(ctx).Line(dataPressure, chartOptions);

      ctx = document.getElementById("humidity").getContext("2d");
      var chartHumidity = new Chart(ctx).Line(dataHumidity, chartOptions);
    });
  };
}());
