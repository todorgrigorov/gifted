# gifted

## Summary

This is a front-end coding challenge with create-react-app.
It provides infinite list of gifs via the GIPHY Public API with virtualization & searching.
The list can be of single gif as well as in columns, mimicking the GIPHY web site.
The UI is based on Uber's design language https://baseweb.design/.

## Build & Run

    yarn build && serve -s build

OR

    npm start && serve -s build
    
The app should be running on **localhost:5000**.

## API Reference

Depending on the size of the project, if it is small and simple enough the reference docs can be added to the README. For medium size to larger projects it is important to at least provide a link to where the API reference docs live.

## Tests

    yarn test

OR

    npm test

## TODOs

* Show no data found/end of list message in UI;
* Display GIF's title in UI;
* Handle connection failures and show message in UI, e.g. "API is down";
* Check if the search input can be triggered via Enter key;
* Iimplement GIF caching;
* Implement image download cancelation when searching.
