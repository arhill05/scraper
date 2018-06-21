require('dotenv').config();
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const errorCodes = require('./errorCodes');
const configRoutes = require('./server/routes/configRoutes')
const scraperRoutes = require('./server/routes/scraperRoutes');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use('/api/config', configRoutes)
app.use('/scrape', scraperRoutes)

const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port || 3000, () => {
  console.log(`Scraper listening on port ${port}`);
});
