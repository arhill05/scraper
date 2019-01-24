# Scraper

## endpoints
### /scrape/xpath
 - scrapes a page for all elements matching the specified xpath and sends a request to the apiUrl specified in config.
 - parameters
   - url: the url to scrape **required**
   - xpath: xpath string to use **required**
   - configKey: the key of the config file to use
   - waitTime: time to wait before scraping HTML
   - collection: collection passed to the crawler
   - subcollection: subcollection passed to the crawler
   - function: function passed to the crawler,
   - synchronization: synchronization passed to the crawler
   - enqueueType: enqueueType passed to the crawler
   - crawlType: crawlType passed to the crawler
   - forceAllow: forceAllow passed to the crawler

### /scrape/fullHtml
 - returns the full html of a URL after waiting the specified time
 - parameters
   - url: the url to scrape **required**
   - configKey: the key of the config file to use
   - waitTime: time to wait before scraping HTML
   - replacements: comma delimited replacements (i.e. ?replacements=a,b means a will be replaced with b in the result)

---

## .env
```
PORT=3031 // the port the program will run under
IS_PRODUCTION=false // setting to false will enable extensive logging
```
---

## Error Handling
The scraper will return errors with a status of 500 in the following structure:
```json
{
    "message": "An error has occurred",
    "error": "URL is invalid",
    "code": "E002",
    "stack": "Error: URL is invalid\n    at Object.exports.scrapeUrlForFullHtml ..."
}
```

**message** is a message related to the error

**error** is the actual cause of the error

**code** is a code representation of the error

**stack** is the full stack trace of the error. This is only included if `isProduction` is false in the config.

### Error Codes
 - E001 : Url is required
 - E002 : Url is invalid
 - E003 : xpath string is required
 - E004 : An error occurred in the context of the browser attempting to render the page at the specified URL. The error is included in the error message
 - E005 : An error occurred when attempting to make a request to the url specified in the config with the results of the scrape
 - E006 : The key for the config specified does not match a config in storage
 - E099 : An unknown error occurred

---

## Installation
### Dependencies
 - NodeJS version 8 or above
 - NPM Version 6 or above
### Linux
 - run `sudo apt-get install -y xvfb x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps clang libdbus-1-dev libgtk2.0-dev libnotify-dev libgnome-keyring-dev libgconf2-dev libasound2-dev libcap-dev libcups2-dev libxtst-dev libxss1 libnss3-dev gcc-multilib g++-multilib`
 - copy server files to desired directory
 - run `npm install` inside the directory
 - create `.env` with the format specified above
 - run with `xvfb-run node index.js`