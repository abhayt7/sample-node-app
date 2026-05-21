const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CI/CD Pipeline</title>
      <style>
        body {
          margin: 0;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          font-family: Arial, sans-serif;
        }

        .box {
          text-align: center;
          color: white;
          padding: 40px;
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.3);
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }

        h1 {
          font-size: 50px;
          margin: 0;
        }

        p {
          font-size: 22px;
          margin-top: 15px;
        }
      </style>
    </head>

    <body>
      <div class="box">
        <h1>CI/CD SUCCESS 🚀</h1>
        <p>Pipeline Working Successfully!</p>
      </div>
    </body>
    </html>
  `);
});

app.listen(3000, () => console.log('Server running on port 3000'));
