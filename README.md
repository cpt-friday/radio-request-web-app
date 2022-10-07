# Radio Request Website
This is a web app and server package designed to add, save, and load song requests as well as tweet them out using the Twitter API

## Requirements
- NodeJS
- Terminal Application of some kind (Terminal or PowerShell)
- [Twitter API Tokens](https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api)

## Setup
- Open desired folder location in terminal
- Run `git clone https://github.com/cpt-friday/radio-request-web-app.git`
- Open server/config.js in a code editor
- Enter your API tokens in place of the placeholders

## Running the app
- Open local repo folder
- Run `npm start`

## How to use the app
1. Enter in the "Meta Strings"
    - Set of 4 strings used as templates for tweets
    - Enter in as one line with '\n' to signify a new line
    - Either import as JSON file, or enter them manually by pressing "Edit Tweet Strings"
    - Strings can be exported as JSON file
2. Enter in Song Requests
    - Enter in Song Name, Artist of Song, and name or twitter handle of requester
    - Press Submit to add request to block
    - Either add them in manually or import as JSON file
    - Export requests as JSON file (editing within program not currently supported)

## Publishing Tweets

### Meta Strings
- Press the button saying "Prepare X", corresponding to the meta string
- Tweet will appear in display and "Prepare X" button will disappear
- Press the "Launch Tweet" button to publish the tweet

### Requests
- Press the "Prepare Requests" button
- Requests will be prepared sequentially
- Press "Launch Tweet" to publish the request tweets
- Status of request in menu below will change depending on whether or not the request was published
- "Prepare Requests" button will disappear