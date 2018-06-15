# Scraper

## endpoints
### /xpath
 - parameters
   - url: the url to scrape **required**
   - xpath: xpath string to use **required**
   - waitTime: how long to wait for the page to render
   - collection: collection passed to the crawler
   - subcollection: subcollection passed to the crawler
   - function: function passed to the crawler,
   - synchronization: synchronization passed to the crawler
   - enqueueType: enqueueType passed to the crawler
   - crawlType: crawlType passed to the crawler
   - forceAllow: forceAllow passed to the crawler

### /node
 - parameters
   - url: the url to scrape **required**
   - node: the node in the form of a querySelector to use **required**
   - collection: collection passed to the crawler
   - subcollection: subcollection passed to the crawler
   - function: function passed to the crawler,
   - synchronization: synchronization passed to the crawler
   - enqueueType: enqueueType passed to the crawler
   - crawlType: crawlType passed to the crawler
   - forceAllow: forceAllow passed to the crawler


## config.js
 - all below should be encapsulated inside `module.exports = { ... }`
 - apiUrl
   - type: string
   - description: the url the request will be sent to after scraping the url specified in the initial request
 - username
   - type: string
   - description: username to use when authenticating to the external service
 - password
   - type: string
   - description: password to use when authenticating to the external service
 - dataReplacements:
   - type: array of { replaceThis: 'x', withThis: 'y' }
   - example: [{ replaceThis: '//', withThis: '' }],
   - description: replace substrings of each scraped item
 - port
   - type: number
   - description: the port the server will run on

## Installation
### Dependencies
 - NodeJS version 8 or above
### Linux
 - run `sudo apt-get install -y xvfb x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps clang libdbus-1-dev libgtk2.0-dev libnotify-dev libgnome-keyring-dev libgconf2-dev libasound2-dev libcap-dev libcups2-dev libxtst-dev libxss1 libnss3-dev gcc-multilib g++-multilib`
 - copy server files to desired directory
 - run `npm install` inside the directory
 - create `config.js` with the format specified above
 - run with `xvfb-run node index.js`