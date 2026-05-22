const express = require('express');
const client = require('prom-client');

const app = express();

// Enable default metrics
client.collectDefaultMetrics();

// Home Route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CI/CD Dashboard</title>
      <style>
        body {
          margin: 0;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          font-family: Arial, sans-serif;
        }

        .box {
          text-align: center;
          color: white;
          padding: 50px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          backdrop-filter: blur(10px);
        }

        h1 {
          font-size: 40px;
          margin: 0;
          color: #00ffcc;
        }

        p {
          font-size: 18px;
          margin-top: 10px;
        }

        .badge {
          margin-top: 15px;
          display: inline-block;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid #00ffcc;
          color: #00ffcc;
          font-size: 13px;
        }
      </style>
    </head>

    <body>
      <div class="box">
        <h1>CI/CD PIPELINE RUNNING 🚀</h1>
        <p>GitHub . Jenkins . Docker . Deploy To Server</p>
        <div class="badge">DEPLOYMENT ACTIVE</div>
      </div>
    </body>
    </html>
  `);
});

// Metrics Route for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Start Server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
