const app = require('./app');
const connectDB = require('./config/db');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`GoviHanda server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
});
