const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Health AI API Gateway is running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
