export function filter(filters, attribute) {
  for (var i = 0; i < attribute.length; i++) {
    if (filters.size == 0 || filters.has(attribute[i])) { 
      return true; 
    }
  }
  return false;
}

export function sortJerseys(jerseys) {
  const sortValue = document.querySelector("#sort-select").value;
  
  if (sortValue === "team") {
      // sort by team and then artist
      jerseys.sort(function (a, b) {
        if (a.team > b.team) return 1;
        if (a.team < b.team) return -1;
        if (a.artist > b.artist) return 1;
        if (a.artist < b.artist) return -1;
      });
    } else if (sortValue === "event") {
      // sort by event and then artist
      jerseys.sort(function (a, b) {
        if (a.event > b.event) return 1;
        if (a.event < b.event) return -1;
        if (a.artist > b.artist) return 1;
        if (a.artist < b.artist) return -1;
      });
  } else if (sortValue === "day-new") {
      jerseys.sort((a, b) => (a.date[a.date.length-1] < b.date[b.date.length-1]) ? 1 : -1);
  } else if (sortValue === "day-old") {
    // if worn multiple years, use first date
      jerseys.sort((a, b) => (a.date[0] > b.date[0]) ? 1 : -1);
  }
  return jerseys;
}