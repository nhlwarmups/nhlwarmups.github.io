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
      //jerseys.sort(function (a, b) {
      // sort by team and then artist
      //return a.team.localeCompare(b.team) || a.artist - b.artist;
      //});

      jerseys.sort(function (a, b) {

        // Sort by votes
        // If the first item has a higher number, move it down
        // If the first item has a lower number, move it up
        if (a.team > b.team) return 1;
        if (a.team < b.team) return -1;
      
        // If the votes number is the same between both items, sort alphabetically
        // If the first item comes first in the alphabet, move it up
        // Otherwise move it down
        if (a.artist > b.artist) return 1;
        if (a.artist < b.artist) return -1;
      
      });
  
     // jerseys.sort((a, b) => (a.team > b.team) ? 1 : -1);
  } else if (sortValue === "event") {
      //jerseys.sort((a, b) => (a.event > b.event) ? 1 : -1);

      // sort by event and then artist
     // jerseys.sort(function (a, b) {
    //    return a.event.localeCompare(b.event) || a.artist - b.artist;
      //});

      jerseys.sort(function (a, b) {

        // Sort by votes
        // If the first item has a higher number, move it down
        // If the first item has a lower number, move it up
        if (a.event > b.event) return 1;
        if (a.event < b.event) return -1;
      
        // If the votes number is the same between both items, sort alphabetically
        // If the first item comes first in the alphabet, move it up
        // Otherwise move it down
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