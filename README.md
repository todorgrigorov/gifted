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

## Code Points

App consists of 2 main components and some service code.

* **Header** component for title, search bar & views toggle
* **Feed** component for the gif lists
* Feed lists are built with baseweb's Block component as a grid layout
* Depending on the view, the quality of the displayed gifs is changed for performance gain
* **BottomScrollListener** is a third-party component which is used to detect browser scroll
* For simplicity sake, communication between the Header & Feed components is done via basic event emitter interface, rather than Redux or other React API
* When the views are switched, no additional requests are made -- rather, the data in the state is accomodated for displaying in 1 or 3 lists
* When searching, the request to the remote API is made on input blur
* **axios** is used as http client for all requests
* **url-builder** is a simple service to construct urls by given path & query parameters (if any)
* In the single gif feed, the width of the items is fixed, while the height is determined by the aspect of the incoming gif
* The layout for the 3 column view is actually built with 5 columns -- the left most and right most acting as "buffer" by aggregating the remaining width of the page via flex layout
* Gifs can be seen enlarged in their original quality by clicking over, which pops open a modal window

## Tests

    yarn test

OR

    npm test

## TODOs

* Validation for the search input
* Handle connection failures and show message in UI, e.g. "API is down"
* Check if the search input can be triggered via Enter key
* Implement GIF caching
* Implement image download cancellation when searching
* Implement priority rendering
* Do not "render" gifs while they are not in sight for performance gain
