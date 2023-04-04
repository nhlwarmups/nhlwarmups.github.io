import { filter, sortJerseys } from './filter.js';
import { loadFilters, loadPreviews, loadOptions, loadSubpage } from './template.js';

// keep track of filters to implement
let teamFilters = new Set();
let seasonFilters = new Set();
let catFilters = new Set();
let filters = [catFilters, teamFilters, seasonFilters];
let types = ["cat", "team", "season"];
let jerseys; 

const jerseySet = {};

window.addEventListener('pageshow', function() {
    const searchParams = new URLSearchParams(window.location.search);
    const subpageId = searchParams.get('id');
    
    if (subpageId) {
        const jersey = jerseySet[subpageId - 1];
        var url = `${window.location.pathname}?${searchParams.toString()}`;
        loadSubpage(jersey);
        //document.getElementById('home').style.display = 'block';
    } else {
        //document.getElementById('home').style.display = 'block';
    }
});

window.onload = function() {
    clearCheckboxes("all");
}

$(document).ready(function(e) {
    $("#clear-filters").hide();

    window.addEventListener('popstate', function() {
        // Loop through all the checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function(checkbox) {
          // Uncheck the checkbox
          checkbox.checked = false;
        });
      });  

    var currPage = 1;

    // init jerseys
    jerseys = [];
    for (var i = 0; i < jsonObject.jerseys.length; i++) {
        makeJerseys(jsonObject.jerseys[i], i, jerseys, jerseySet);
    }

    var categories = new Set();
    var teams = new Set();
    var seasons = new Set();

    categories = getCategories(jerseys, categories);
    teams = getTeams(jerseys, teams);
    seasons = getSeasons(jerseys, seasons);

    // load filters
    loadOptions([categories, teams, seasons], types);
    
    // load grid
    load(jerseys, currPage, filters);

    $('#cat input').on('click', function() {
        if ($(this).is(':checked')) {
            catFilters.add($(this).attr('id'));
        } else {
            catFilters.delete($(this).attr('id'));
        }
        filters[0] = catFilters;
        toggleClear();
        load(jerseys, 1, filters);
    });   

    $('#team input').on('click', function() {
        if ($(this).is(':checked')) {
            teamFilters.add($(this).attr('id'));
        } else {
            teamFilters.delete($(this).attr('id'));
        }
        filters[1] = teamFilters;
        toggleClear();
        load(jerseys, 1, filters);
    });   

    $('#season input').on('click', function() {
        if ($(this).is(':checked')) {
            seasonFilters.add($(this).attr('id'));
        } else {
            seasonFilters.delete($(this).attr('id'));
        }
        filters[2] = seasonFilters;
        toggleClear();
        load(jerseys, 1, filters);
    });   

    // click on page number
    $('#page-container').on('click', '.page-item.num', function() {
        currPage = this.textContent;
        load(jerseys, currPage, filters);
    });     

    // click on prev button
    $('#page-container').on('click', '#prev-button', function() {
        if (currPage > 1) { currPage--; }
        load(jerseys, currPage, filters);
    });   

    // click on next button
    $('#page-container').on('click', '#next-button', function() {
        if (currPage < getNumPages()) { currPage++; }
        load(jerseys, currPage, filters);
    });   

    // select sort
    $('#sort-select').on('change', function() {
        load(sortJerseys(jerseys), currPage, filters);
    });

    // clear cat filters
    $('#filters').on('click', '#clear-filters-cat', function() {
        clearCheckboxes("cat");
        load(sortJerseys(jerseys), currPage, filters);
        $("#clear-filters-cat").hide();
    });

    // clear team filters
    $('#filters').on('click', '#clear-filters-team', function() {
        clearCheckboxes("team");
        load(sortJerseys(jerseys), currPage, filters);
        $("#clear-filters-team").hide();
    });

    // clear season filters
    $('#filters').on('click', '#clear-filters-season', function() {
        clearCheckboxes("season");
        load(sortJerseys(jerseys), currPage, filters);
        $("#clear-filters-season").hide();
    });

    // clear season filters
    $('#filters').on('click', '#clear-filters-all', function() {
        clearCheckboxes("all");
        load(sortJerseys(jerseys), currPage, filters);
        $("#clear-filters-cat").hide();
        $("#clear-filters-team").hide();
        $("#clear-filters-season").hide();
        $("#clear-filters-all").hide();
    });
      
    // route to detail page
    // old code
    /*$('#jersey').on('click', '.preview', function() {
        const id = this.getAttribute('data-subpage');
        const jersey = jerseySet[id - 1];

        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('id', id);
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        history.pushState({ subpageId: id }, '', newUrl);

        loadSubpage(jersey);
        document.getElementById('home').style.display = 'block';
    });*/
});

function toggleClear() {
    const numFilters = filters[0].size + filters[1].size + filters[2].size;
    if (numFilters > 0) {
        $("#clear-filters").show();
    } else {
        $("#clear-filters").hide();
    }
}

function getNumPages() {
    return ($('#page-container').children('li').length - 2);
}

function clearCheckboxes(type) {
    const checkboxes = document.querySelectorAll(`input[type="checkbox"]:checked`);
    var isAll = false;

    if (type == "all") {
        isAll = true;
    }

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked == true && (checkboxes[i].getAttribute('data-label') == type || isAll)) {
            checkboxes[i].click();
        }
    }
  }  

function load(jerseys, currPage, filters) {    
    loadFilters(filters, types);
    toggleClear();
    const filteredJerseys = sortJerseys(jerseys).filter(jersey => {
        return (filter(filters[0], [jersey.category]) & 
                filter(filters[1], [jersey.team]) &
                filter(filters[2], jersey.seasons));
    });

    var scrollPos = $(window).scrollTop();
    loadPreviews(filteredJerseys, currPage);
    setTimeout(function() {
        $(window).scrollTop(scrollPos);
      }, 100);          
}

function getSeasons(jerseys, seasons) {
    jerseys.forEach((i) => {
        var seasonVals = i.seasons;
        for (var i = 0; i < seasonVals.length; i++) {
            seasons.add(seasonVals[i]);
        }
    });
    return Array.from(seasons).sort();
}

function getTeams(jerseys, teams) {
    jerseys.forEach(i => teams.add(i.team));
    return Array.from(teams).sort();
}

function getCategories(jerseys, categories) {
    jerseys.forEach(i => categories.add(i.category));
    return Array.from(categories).sort();
}

function makeJerseys(data, i, jerseys, jerseySet) {
    var days_worn = (data.day_worn).split(", ");

    for (var j = 0; j < days_worn.length; j++) {
        days_worn[j] = new Date(days_worn[j]);
    }

    var socials = {}
    if (data.website != "") {
        socials["website"] = data.website;
    }
    if (data.ig != "") {
        socials["ig"] = data.ig;
    }
    if (data.shop != "") {
        socials["shop"] = data.shop;
    }   

    var a_embed = [];
    var m_embed = [];
    var artist_embeds =(data.artist_embed).split(", ");
    var misc_embeds =(data.misc_embed).split(", ");

    artist_embeds.forEach(e => { if (e != "") { a_embed.push(e); } });
    misc_embeds.forEach(e => { if (e != "") { m_embed.push(e); } });

    const jersey = {
        id: data.id,
        team_id: data.team_id,
        event: data.event,
        team: data.team,
        team_full: data.team_full, // team_full: [data.team_full, data.base_color]
        category: data.category,
        seasons: (data.seasons).split(", "),
        date: days_worn,
        date_pretty: (data.day_worn_pretty).split("; "),
        artist: data.artist,
        org_name: (data.org_name).split(", "),
        org_url: (data.org_url).split(", "),
        statement: data.statement,
        source: data.source,
        notes: data.notes,
        socials: socials,
        img_urls: (data.img_urls).split(", "),
        a_embed: a_embed,
        m_embed: m_embed,
    }  
    jerseys.push(jersey);
    jerseySet[i] = jersey;
}