# Scraper

## endpoints
### /xpath
 - scrapes a page for all elements matching the specified xpath and sends a request to the apiUrl specified in config.
 - parameters
   - url: the url to scrape **required**
   - xpath: xpath string to use **required**
   - waitTime: time to wait before scraping HTML
   - collection: collection passed to the crawler
   - subcollection: subcollection passed to the crawler
   - function: function passed to the crawler,
   - synchronization: synchronization passed to the crawler
   - enqueueType: enqueueType passed to the crawler
   - crawlType: crawlType passed to the crawler
   - forceAllow: forceAllow passed to the crawler

### /node
 - scrapes a page for all elements matching the specified query selector and sends a request to the apiUrl specified in config.
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

### /fullHtml
 - returns the full html of a URL after waiting the specified time
 - parameters
   - url: the url to scrape **required**
   - waitTime: time to wait before scraping HTML
   - replacements: comma delimited replacements (i.e. ?replacements=a,b means a will be replaced with b in the result)

---

## config.js
A config.js file is required in the root directory of the scraper for it to function correctly.
All values specified below should be encapsulated inside `module.exports = { ... }`.
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
 - isProduction
   - type: boolean
   - description: if disabled, informational and error logging to the console will be disabled
### example:
```javascript
module.exports = {
  apiUrl: 'http://myUrl.com/best/api/ever',
  username: 'someusername',
  password: 'somepassword',
  dataReplacements: [{ replaceThis: '//', withThis: '' }, { replaceThis: 'href="', withThis: 'href="yourUrlGoesHere' }],
  port: 3031,
  isProduction: true
};
```

---

## Installation
### Dependencies
 - NodeJS version 8 or above
### Linux
 - run `sudo apt-get install -y xvfb x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps clang libdbus-1-dev libgtk2.0-dev libnotify-dev libgnome-keyring-dev libgconf2-dev libasound2-dev libcap-dev libcups2-dev libxtst-dev libxss1 libnss3-dev gcc-multilib g++-multilib`
 - copy server files to desired directory
 - run `npm install` inside the directory
 - create `config.js` with the format specified above
 - run with `xvfb-run node index.js`