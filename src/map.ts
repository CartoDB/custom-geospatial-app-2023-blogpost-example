import maplibregl from 'maplibre-gl';
import { Deck, FlyToInterpolator } from '@deck.gl/core/typed';
import {
  BASEMAP,
  CartoLayer,
  setDefaultCredentials,
  MAP_TYPES,
  colorBins,
  colorCategories
} from '@deck.gl/carto/typed';
import { getLocation } from './locations'

// This is the CARTO authentication. You can find these values in the CARTO Workspace

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const accessToken = import.meta.env.VITE_API_ACCESS_TOKEN
setDefaultCredentials({ apiBaseUrl,  accessToken })

// Initial deck.gl configurations

const VIEW_STATE_TRANSITIONS = {
  transitionDuration: 1500,
  transitionInterpolator: new FlyToInterpolator()
}

const CITY_STATE_TRANSITIONS = {
  transitionDuration: 5000,
  transitionInterpolator: new FlyToInterpolator()
}

const INITIAL_VIEW_STATE: Record<string, Object>= {
  dynamicTiling: {
    latitude: 41.8097343,
    longitude: -110.5556199,
    zoom: 3.7,
    bearing: 0,
    pitch: 0,
    ...VIEW_STATE_TRANSITIONS
  },
  polygons: {
    latitude: 41.8097344,
    longitude: -110.5556199,
    zoom: 3.7,
    bearing: 0,
    pitch: 0,
    ...VIEW_STATE_TRANSITIONS
  },
  tileset: {
    latitude: 41.3974343,
    longitude: 2.1610199,
    zoom: 13,
    bearing: 10,
    pitch: 45,
    ...CITY_STATE_TRANSITIONS
  }

};

let deck : Deck;

// Render the right layers and initial view state each time a story is selected

let selectedStory = 'dynamicTiling';

export function selectStoryMap(story: string) {
  selectedStory = story;
  deck.setProps({
    initialViewState: INITIAL_VIEW_STATE[story]
  });
  render();
}

// Get the category to highlight

let selectedOsmCategory = 'Financial';

export function selectOsmCategory(category: string) {
  selectedOsmCategory = category;
  render();
}

// Filter the query based on the selected year

let selectedYear = 2010;

export function selectYear(year: number) {
  selectedYear = year;
  render();
}

// A longer query to aggregate points (accidents) in polygons (states)

const countAccidentsPerStateQuery = `

SELECT
    polygons.code_hasc as polygonid, any_value(polygons.geom) as geom,any_value(name) as state_name,
    count(points.year) count
  FROM \`carto-demo-data.demo_tables.usa_states_boundaries\` as polygons
  LEFT JOIN \`carto-demo-data.demo_tables.riskanalysis_railroad_accidents\` as points
    ON  ST_INTERSECTS(polygons.geom, points.geom) AND year=@selectedYear
  GROUP BY polygons.code_hasc

`

// For the tileset story, move the camera to a 3d view and update it based on the buttons

export function moveToCity(city: string) {
  const cityLocation = getLocation(city);

  const CITY_VIEW_STATE = {
    latitude: cityLocation?.latitude,
    longitude: cityLocation?.longitude,
    zoom: 13,
    bearing: 10,
    pitch: 45,
    ...CITY_STATE_TRANSITIONS
  };

  deck.setProps({
    initialViewState: CITY_VIEW_STATE
  });
  render();
}


// Our render function: it sets the deck.gl layers based on our inputs

export function render() {

  const layers = [
    new CartoLayer({
      id: 'pois',
      connection: 'carto_dw',
      type: MAP_TYPES.QUERY,
      data: 'SELECT * FROM carto-demo-data.demo_tables.osm_pois_usa',
      opacity: 1,
      getFillColor: colorCategories({
        attr: 'group_name',
        domain: [selectedOsmCategory],
        colors: [[3, 111, 226]],
        othersColor: [3, 111, 226, 100]
      }),
      getLineColor: colorCategories({
        attr: 'group_name',
        domain: [selectedOsmCategory],
        colors: [[255, 255, 255]],
        othersColor: [3, 111, 226, 0]
      }),
      getPointRadius: 50,
      getLineWidth: 10,
      pointRadiusMinPixels: 1,
      lineWidthMinPixels: 0.3,
      visible: selectedStory === 'dynamicTiling',
      updateTriggers: {
        getFillColor: selectedOsmCategory,
        getLineColor: selectedOsmCategory
      }
    }),
    new CartoLayer({
      id: 'states',
      connection: 'carto_dw',
      type: MAP_TYPES.QUERY,
      data: countAccidentsPerStateQuery,
      opacity: 0.8,
      getFillColor: colorBins({
        attr: 'count',
        domain: [0, 10, 30, 60, 100, 200],
        colors: 'PurpOr',
      }),
      getLineColor: [255, 255, 255],
      lineWidthMinPixels: 1,
      queryParameters: {'selectedYear' : selectedYear},
      visible: selectedStory === 'polygons'
    }),
    new CartoLayer({
      id: 'accidents',
      connection: 'carto_dw',
      type: MAP_TYPES.QUERY,
      data: 'SELECT * FROM carto-demo-data.demo_tables.riskanalysis_railroad_accidents WHERE year = @selectedYear',
      opacity: 0.8,
      getFillColor: [255, 255, 255],
      pointRadiusMinPixels: 1,
      radiusUnits: "pixels",
      getPointRadius: (d: any) => {
        return (d.properties.total_damage + 10) / 100
      },
      queryParameters: {'selectedYear' : selectedYear},
      visible: selectedStory === 'polygons'
    }),
    new CartoLayer({
      connection: 'carto_dw',
      type: MAP_TYPES.TILESET,
      data: 'cartobq.public_account.osm_buildings_tileset',
      getFillColor: [49,153,107],
      getLineColor: [244,177,52],
      getLineWidth: 3,
      opacity: 0.7,
      visible: selectedStory === 'tileset'
    })
  ]

  deck.setProps({
    layers: layers
  });

}

// the initial map function

export function createMap() {
  const map = new maplibregl.Map({
    container: 'map',
    style: BASEMAP.DARK_MATTER,
    interactive: false,
  });

  deck = new Deck({
    canvas: 'deck-canvas',
    initialViewState: INITIAL_VIEW_STATE,
    controller: true,
    layers: [],
  });

  deck.setProps({
    onViewStateChange: ({ viewState }) => {
      const { longitude, latitude, ...rest } = viewState;
      map.jumpTo({ center: [longitude, latitude], ...rest });
    },
  });
}
