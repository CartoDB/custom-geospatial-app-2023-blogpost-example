import { selectOsmCategory, selectYear, moveToCity } from "./map";
import { selectStory } from "./stories";

export function setupStorySelect(element:HTMLSelectElement) {
  element.addEventListener("change", () => selectStory(String(element.value)));
}

export function setupOsmCategorySelect(element:HTMLSelectElement) {
  element.addEventListener("change", () => selectOsmCategory(String(element.value)));
}

export function setupCityButtonsList(elements: HTMLButtonElement[]) {
  elements.forEach((element) => {
    element.addEventListener("click", () => moveToCity(String(element.value)));
  })
}

export function setupYearSelect(element:HTMLSelectElement) {
  element.addEventListener("change", () => selectYear(Number(element.value)));
}


