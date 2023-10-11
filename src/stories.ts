import { selectStoryMap, selectOsmCategory, selectYear, moveToCity } from './map';

// Content for the dynamic tiling story

const dynamicTilingStory = `

<p class="overline">✨👀 You're viewing</p>
<h2>1.4M Points of Interest</h2>
<p>This visualization is using <a href="https://carto.com/blog/dynamic-tiling-for-highly-performant-cloud-native-maps" rel="noopener noreferrer" target="_blank">Dynamic Tiling</a> to load millions of points of interest across the United States.</p>
<p>CARTO drastically reduces development and maintenance times for geospatial applications. POIs for the selected category are highlighted on the map using CARTO + deck.gl properties.</p>
<div class="layer-controls"> 
  <p class="overline">Highlight a category!</p>
  <select name="osmCategorySelector" id="osmCategorySelector">
  <option value="Financial">🏛️ Financial</option>
  <option value="Tourism">🏖️ Tourism</option>
  <option value="Sustenance">🍽️ Sustenance</option>
  <option value="Education">📚 Education</option>
  <option value="Transportation">🚈 Transportation</option>
  <option value="Healthcare">🏥 Healthcare</option>
  <option value="Civic amenities">🏫 Civic amenities</option>
  <option value="Entertainment, Arts & Culture">🎭 Entertainment, Arts & Culture</option>
  <option value="Others">❓ Others</option>

</select>
</div>
<p class="caption source">Source: OpenStreetMap</p>

`

// Content for the polygons + SQL story

const polygonsStory = `

<p class="overline">✨👀 You're viewing</p>
<h2>Rail accidents by state (via SQL)</h2>
<p>You can use SQL to query data directly from the app, including query parameters.</p>
<p>This increased flexibility makes CARTO a great solution to build geospatial applications.</p>
<div class="code-block">
  <code>SELECT * FROM carto-demo-data.demo_tables.riskanalysis_railroad_accidents WHERE year = @selectedYear</code>
</div>
<div class="layer-controls"> 
  <p class="overline">Choose a year to filter accidents</p>
  <select name="yearSelector" id="yearSelector">
    <option value="2010">2010</option>
    <option value="2011">2011</option>
    <option value="2012">2012</option>
    <option value="2013">2013</option>
  </select>
</div>
<p class="caption source">Source: U.S. DOT Federal Railway Administration</p>

`

// Content for the tileset story

const tilesetStory = `

<p class="overline">✨👀 You're viewing</p>
<h2>481M Polygons of Buildings</h2>
<p>This visualization is using <a href="https://docs.carto.com/carto-for-developers/guides/visualize-massive-datasets" rel="noopener noreferrer" target="_blank">pre-generated Tilesets</a> to load 481 million building footprints (polygons) across the entire world.</p>
<p>CARTO unlocks unparalleled scalability and performance in geospatial apps.</p>
<div class="layer-controls"> 
  <p class="overline">Take me to...</p>
  <div class="city-button-group">
    <button id="tokyo" value="tokyo">🇯🇵 Tokyo</button>
    <button id="newyork" value="newyork">🇺🇸 New York</button>
    <button id="barcelona" value="barcelona">🇪🇸 Barcelona</button>
  </div>
</div>
<p class="caption source">Source: OpenStreetMap</p>

`

// and the logic to switch between them

export function selectStory(value: string) {

  const storyCard = document.querySelector<HTMLDivElement>('#story-card');
  storyCard!.classList.remove('blue-bg','purple-bg','green-bg');

  if (value === 'dynamicTiling') {

    storyCard!.innerHTML = dynamicTilingStory;
    storyCard!.classList.add('blue-bg');
    const osmCategorySelector = document.querySelector<HTMLSelectElement>('#osmCategorySelector');
    osmCategorySelector?.addEventListener('change', () => selectOsmCategory(String(osmCategorySelector.value)));

  } else if (value === 'polygons') {

    storyCard!.innerHTML = polygonsStory;
    storyCard!.classList.add('purple-bg');
    const yearSelector = document.querySelector<HTMLSelectElement>('#yearSelector');
    yearSelector?.addEventListener('change', () => selectYear(Number(yearSelector.value)));

  } else if (value === 'tileset') {

    storyCard!.innerHTML = tilesetStory;
    storyCard!.classList.add('green-bg');
    const cityButtonsList = document.querySelectorAll<HTMLButtonElement>('.city-button-group button');

    cityButtonsList.forEach((element) => {
      element.addEventListener('click', () => moveToCity(String(element.value)));
    })
    
  }

  selectStoryMap(value);
}