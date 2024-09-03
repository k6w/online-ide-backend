require("dotenv").config();
const client = require("prom-client");
const http = require("http");

const register = new client.Registry();
const requestCounter = new client.Counter({
  name: "nodejs_requests_total",
  help: "Total number of requests",
});

register.registerMetric(requestCounter);

const metricsPort = process.env.METRICS_PORT || 9091;

const startMetricsServer = () => {
  http
    .createServer((req, res) => {
      if (req.url === "/metrics") {
        res.setHeader("Content-Type", register.contentType);
        res.end(register.metrics());
      } else {
        res.writeHead(404);
        res.end();
      }
    })
    .listen(metricsPort);
};

const registerMetrics = () => {
  const uptimeGauge = new client.Gauge({
    name: "nodejs_uptime_seconds",
    help: "Uptime of the application in seconds",
  });
  register.registerMetric(uptimeGauge);
  uptimeGauge.set(process.uptime());
};

module.exports = { startMetricsServer, registerMetrics };
