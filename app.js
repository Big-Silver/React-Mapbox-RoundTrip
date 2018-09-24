/* global window */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL, {PolygonLayer} from 'deck.gl';
import {TripsLayer} from '@deck.gl/experimental-layers';
import trip from './trip.js';

const _ = require('lodash');

// Set your mapbox token here
const MAPBOX_TOKEN = "pk.eyJ1IjoiZGFuaWVsYmFsYW4xOTg5IiwiYSI6ImNqazZrYmQxZjFhZ3ozdnFnYmtuNnB2MTkifQ.vRS1P1-6nA9VXmmTzFaqvw"; // eslint-disable-line

// Source data CSV
const DATA_URL = {
  BUILDINGS:
    'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/buildings.json', // eslint-disable-line
  // TRIPS:
  //   'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/trips.json' // eslint-disable-line
  TRIPS: 'https://raw.githubusercontent.com/big-silver/react-mapbox-roundTrip/master/trip.json'
  // TRIPS: './trip.json'
};

const LIGHT_SETTINGS = {
  lightsPosition: [-74.05, 40.7, 8000, -73.5, 41, 5000],
  ambientRatio: 0.05,
  diffuseRatio: 0.6,
  specularRatio: 0.8,
  lightsStrength: [2.0, 0.0, 0.0, 0.0],
  numberOfLights: 2
};

export const INITIAL_VIEW_STATE = {
  longitude: -74,
  latitude: 40.72,
  zoom: 13,
  maxZoom: 16,
  pitch: 45,
  bearing: 0
};

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0
    };
  }

  componentDidMount() {
    this.convertRoundTrip(trip)
    this._animate();
  }

  componentWillUnmount() {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  convertRoundTrip (t) {  
    for (let i = 0; i < t.length; i++) {
      const temp = [];
      if(t[i].segments.length > 1){
        let time = t[i].segments[t[i].segments.length - 1][2];      
        for (let j = t[i].segments.length - 2; j >= 0; j-- ) {
          const s = _.cloneDeep(t[i].segments[j]);
          time = time + t[i].segments[j+1][2] - t[i].segments[j][2];
          s[2] = time;
          temp.push(s);
        }
        t[i].segments = t[i].segments.concat(temp);
        
      }
    }
       
    console.log(t);    
  }

  _animate() {
    const {
      loopLength = 3600, // unit corresponds to the timestamp in source data
      animationSpeed = 30 // unit time per second
    } = this.props;
    const timestamp = Date.now() / 1000;
    const loopTime = loopLength / animationSpeed;

    this.setState({
      time: ((timestamp % loopTime) / loopTime) * loopLength
    });
    this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
  }

  _renderLayers() {
    const {buildings = DATA_URL.BUILDINGS, trips = DATA_URL.TRIPS, trailLength = 180} = this.props;

    return [
      new TripsLayer({
        id: 'trips',
        data: trips,
        getPath: d => d.segments,
        getColor: d => (d.vendor === 0 ? [253, 128, 93] : [23, 184, 190]),
        opacity: 0.3,
        strokeWidth: 2,
        trailLength,
        currentTime: this.state.time
      }),
      // new PolygonLayer({
      //   id: 'buildings',
      //   data: buildings,
      //   extruded: true,
      //   wireframe: false,
      //   fp64: true,
      //   opacity: 0.5,
      //   getPolygon: f => f.polygon,
      //   getElevation: f => f.height,
      //   getFillColor: [74, 80, 87],
      //   lightSettings: LIGHT_SETTINGS
      // })
    ];
  }

  render() {
    const {viewState, controller = true, baseMap = true} = this.props;

    return (
      <DeckGL
        layers={this._renderLayers()}
        initialViewState={INITIAL_VIEW_STATE}
        viewState={viewState}
        controller={controller}
      >
        {baseMap && (
          <StaticMap
            reuseMaps
            mapStyle="mapbox://styles/mapbox/dark-v9"
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        )}
      </DeckGL>
    );
  }
}

export function renderToDOM(container) {
  render(<App />, container);
}
