interface Location {
  latitude: number;
  longitude: number;
}

const locations: Record<string, Location> = {
  newyork: {
    latitude: 40.7307343,
    longitude: -74.0056199
  },
  tokyo: {
    latitude: 35.6992343,
    longitude: 139.7203199
  },
  barcelona: {
    latitude: 41.3974343,
    longitude: 2.1610199
  }
};

export function getLocation(city: string): Location | undefined {
  return locations[city];
}