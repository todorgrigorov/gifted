# gifted

## Summary

This is a front-end coding challenge with create-react-app.
It provides infinite list of gifs via the GIPHY Public API with virtualization & searching.
The list can be of single gif as well as in columns, mimicking the GIPHY web site.
The UI is based on Uber's design language https://baseweb.design/.

## Build & Run

    yarn install && yarn build && serve -s build

OR

    npm install && npm build && serve -s build
    
The app should be running on **localhost:5000**

## API Reference

App consists of 2 main components and some service code.

* Header component for title, search bar & views toggle
* Feed component for the gif lists

## Tests

    yarn test

OR

    npm test

## TODOs

* Show no data found/end of list message in UI
* Display GIF's title in UI
* Handle connection failures and show message in UI, e.g. "API is down"
* Check if the search input can be triggered via Enter key
* Implement GIF caching
* Implement image download cancellation when searching
