import "./reset.css";
import "./style.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { createMap, render } from "./map";
import { setupStorySelect } from "./inputs";
import { selectStory } from "./stories";
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `

  <div class="context">

    <div class="card intro-card">

      <div class="intro-header">
        <h1>Custom App</h1>  
        <p class="subtitle">An example application built with CARTO + deck.gl </p>
      </div>

      <div class="intro-content">
        <p class="caption">Learn more in the <a href="https://carto.com/blog" target="_blank">CARTO blog</a> or <a href="github.com/code" target="_blank">view the code in Github</a>.<p>
        <p class="intro-text">All data in this map is coming live from queries and tables in our data warehouse: BigQuery, Snowflake, Redshift, PostgreSQL, Databricks...</p>
        <p class="overline">Choose a story:</p>
        <select name="storySelector" id="storySelector">
          <option value="dynamicTiling">Visualizing 1.4M points dynamically</option>
          <option value="polygons">Using live SQL to aggregate 1.4M points</option>
          <option value="tileset">Visualizing 10B points with a pregenerated tileset</option>
        </select>
      </div>
    </div>

    <div id="story-card" class="card story-card">

    </div>

  </div>

  <div id="map"></div>
  
  <canvas id="deck-canvas"></canvas>
`;
createMap();
render();
setupStorySelect(document.querySelector<HTMLSelectElement>("#storySelector"));
selectStory("dynamicTiling");

