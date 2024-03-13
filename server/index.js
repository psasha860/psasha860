const express = require('express');
const cors = require('cors');
const { RateLimiterMemory } = require('rate-limiter-flexible');

const PORT = process.env.PORT || 3012;
const app = express();

const corsOptions = {
  origin: '*',
  methods: 'GET,POST',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());


let requestCount = 0;
setInterval(() => {
  requestCount = 0;
}, 1000);
const rateLimiter = new RateLimiterMemory({
  points: 50, // Кількість доступних точок (запитів)
  duration: 1, // Тривалість періоду (1 секунда)
});




app.post('/api', async (req, res) => {
  console.log(req.body)
  try {
    await rateLimiter.consume(req.ip);
    const { index } = req.body;
    const delay = Math.floor(Math.random() * 1000) + 1;
    await new Promise(resolve => setTimeout(resolve, delay));
    console.log(index)
    res.json(index);
  } catch (error) {
    if (error instanceof Error && error.message.includes('RateLimiterMemory')) {
      res.status(429).json('Too Many Requests');
    } else {
      console.error('Error:', error);
      res.status(500).json('Internal Server Error');
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
