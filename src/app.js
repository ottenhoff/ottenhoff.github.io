/* global window, fetch */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import ControlPanel from './control-panel';

import {defaultMapStyle, dataLayer} from './map-style.js';
import {updatePercentiles, filterOppZones} from './utils';
import {fromJS} from 'immutable';
import {json as requestJson} from 'd3-request';

const MAPBOX_TOKEN = ''; // Set your mapbox token here

export default class App extends Component {

  state = {
    mapStyle: defaultMapStyle,
    score: 1,
    data: null,
    hoveredFeature: null,
    viewport: {
      latitude: 40.7831,
      longitude: -73.9112,
      zoom: 11,
      bearing: 0,
      pitch: 0,
      width: 500,
      height: 500
    }
  };

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();

    this._loadJsonData();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
      }
    });
  };

  _loadJsonData = () => {
    requestJson('./data/acs.geojson', (error, response) => {
      if (!error) {
        this._loadData(filterOppZones(response, this.state.score));
      }
    });
  }

  _loadData = data => {
    updatePercentiles(data, f => f.properties.urbanScore);

    const mapStyle = defaultMapStyle
      // Add geojson source to map
      .setIn(['sources', 'incomeByState'], fromJS({type: 'geojson', data}))
      // Add point layer to map
      .set('layers', defaultMapStyle.get('layers').push(dataLayer));

    this.setState({data, mapStyle});
  };

  _updateSettings = (name, value) => {
    if (name === 'score') {
      this.setState({score: value});

      // TODO: just filter existing state data instead of reloading it
      this._loadJsonData();

      const {data, mapStyle} = this.state;
    
      if (data) {
        updatePercentiles(data, f => f.properties.urbanScore);
        const newMapStyle = mapStyle.setIn(['sources', 'incomeByState', 'data'], fromJS(data));
        this.setState({mapStyle: newMapStyle});
      }
    }
  };

  _onViewportChange = viewport => this.setState({viewport});

  _onHover = event => {
    const {features, srcEvent: {offsetX, offsetY}} = event;
    const hoveredFeature = features && features.find(f => f.layer.id === 'data');

    this.setState({hoveredFeature, x: offsetX, y: offsetY});
  };

  _renderTooltip() {
    const {hoveredFeature, year, x, y} = this.state;

    return hoveredFeature && (
      <div className="tooltip" style={{left: x, top: y}}>
        <div>Name: {hoveredFeature.properties.name}</div>
        <div>GeoID: {hoveredFeature.properties.geoid}</div>
        <div>Score: {hoveredFeature.properties.urbanScore}</div>
        <div>Median Household Income: {hoveredFeature.properties.B19113001}</div>
      </div>
    );
  }

  render() {

    const {viewport, mapStyle} = this.state;

    return (
      <div>
        <MapGL
          {...viewport}
          mapStyle={mapStyle}
          onViewportChange={this._onViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onHover={this._onHover} >

          {this._renderTooltip()}

        </MapGL>

        <ControlPanel containerComponent={this.props.containerComponent}
          settings={this.state} onChange={this._updateSettings} />
      </div>
    );
  }

}
