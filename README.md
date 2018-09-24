# React Deck-GL

This is a minimal standalone version of the [TripsLayer example](https://deck.gl/#/examples/custom-layers/trip-routes)
on [deck.gl](http://deck.gl) website and has roundtrip.

[Demo](https://react-deck-gl.herokuapp.com/)

I customized this project so you can deploy to heroku easily if you want.

## Install and Run
Copy the content of this folder to your project. Run
```
- Clone
git clone https://github.com/Big-Silver/react-mapbox-roundTrip
- Setup
npm install
- Run
npm run webpack-start  // webpack server - local
npm start  // node server.js - heroku
```

### Data format
Sample data is stored in [deck.gl Example Data](https://github.com/uber-common/deck.gl-data/tree/master/examples/trips). To use your own data, checkout
the [documentation of TripsLayer](https://github.com/uber/deck.gl/tree/master/modules/experimental-layers/src/trips-layer).
