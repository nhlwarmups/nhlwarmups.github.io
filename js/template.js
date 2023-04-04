import { loadPages } from './pagination.js';
import { filterPage } from './pagination.js';

const nameColors = {
    'Anaheim Ducks': '#F47A38',
    'Arizona Coyotes': '#8C2633',
    'Boston Bruins': '#000000',
    'Buffalo Sabres': '#003087',
    'Calgary Flames': '#D2001C',
    'Carolina Hurricanes': '#CE1126',
    'Chicago Blackhawks': '#CF0A2C',
    'Colorado Avalanche': '#6F263D',
    'Columbus Blue Jackets': '#002654',
    'Dallas Stars': '#006847',
    'Detroit Red wings': '#CE1126',
    'Edmonton Oilers': '#041E42',
    'Florida Panthers': '#041E42',
    'Los Angeles Kings': '#111111',
    'Minnesota Wild': '#154734',
    'Montreal Canadiens': '#AF1E2D',
    'Nashville Predators': '#041E42',
    'New York Rangers': '#0038A8',
    'New Jersey Devils': '#CE1126',
    'New York Islanders': '#00539B',
    'Ottawa Senators': '#000000',
    'Philadelphia Flyers': '#F74902',
    'Pittsburgh Penguins': '#000000',
    'San Jose Sharks': '#006D75',
    'Seattle Kraken': '#68A2B9',
    'St. Louis Blues': '#002F87',
    'Tampa Bay Lightning': '#002868',
    'Toronto Maple Leafs': '#00205B',
    'Vancouver Canucks': '#00205B',
    'Vegas Golden Knights': '#333F42',
    'Washington Capitols': '#041E42',
    'Winnipeg Jets': '#041E42',
}

const seasonColors = {
    '2022-23': ['#f5f0f0', '#d15c62'],
    '2021-22': ['#f5f3f0', '#d97d41'],
    '2020-21': ['#f4f5f0', '#cfb534'],
    '2019-20': ['#f0f5f2', '#53b874'],
    '2018-19': ['#f0f3f5', '#5390b8'],
    '2017-18': ['#f3f0f5', '#7b53b8'],
}

const filterColors = {
    'black': ['#000', '#fff'],
    'blue': ['#2d67ed', '#fff'],
    'green': ['18b534', '#fff'],
    'grey': ['#eee', '#8c8c8c'],
    'orange': ['#f0851a', '#fff'],
    'white': ['#fff', '#22'],
    'yellow': ['#f7de4d', '#222'],
    'purple': ['a455ed', '#fff'],
    'red': ['#f04937', '#fff'],
}

export function loadPreviews(jerseys, currPage) {
    //var container = $('#jersey');
    const tempContainer = document.createElement('div');
    
    filterPage(jerseys, currPage).forEach(function(jersey) {
        var card = document.createElement('div');
        card.className = "preview";
        card.setAttribute('data-subpage', jersey.id);

        var link = document.createElement('a');
        link.href = `/?id=${jersey.id}`;
        link.className = "card-link";
        link.innerHTML = `
                ${displaySeasons(jersey.seasons)}
                <img class="thumbnail-img" src="imgs/thumb-sml/${jersey.team_id}.png" alt="${jersey.team_full} jersey design for ${jersey.event}" />
                <div class="info">
                    <div style="flex-grow: 1;">
                        <div class="event"> <strong>${jersey.event}</strong> </div>
                        <div class="artist"> With ${jersey.artist} </div>
                    </div>
                <div class="logo-container">
                    <img src="imgs/logos/${jersey.team.toLowerCase()}.png" class="preview-logo" alt="${jersey.team_full} logo" />
                </div>
            </div>`;

        card.appendChild(link);
        tempContainer.appendChild(card);
    });

    $('#jersey').html(tempContainer.innerHTML);
    loadPages(jerseys, currPage, "top");
    loadPages(jerseys, currPage, "bottom");
}

function displaySeasons(seasons) {
    var seasonContainer = document.createElement('div');
    seasonContainer.className = "season-container";

    for (var i = 0; i < seasons.length; i++) {
        var season = document.createElement('div');
        season.className = "season";
        season.innerHTML = `${seasons[i]}`;
        season.style.backgroundColor = seasonColors[seasons[i]][0];
        season.style.color = seasonColors[seasons[i]][1];
        seasonContainer.appendChild(season);
    }

    return seasonContainer.outerHTML;
}

export function loadOptions(lists, types) {
    for (let i = 0; i < types.length; i++) {
        const gridContainer = document.createElement('div');
        gridContainer.className = `grid-${types[i]}`;
        var options = lists[i];

        for (let j = 0; j < options.length; j++) {
            var o = document.createElement('div');
            o.className = "form-check";
            o.innerHTML = `
                <input type="checkbox" name="filter" class="form-check-input" id="${options[j]}" data-label="${types[i]}">`;
            if (types[i] == "team") {
                o.innerHTML += `<label class="label" for="${options[j]}"> <img src="./imgs/logos/${options[j].toLowerCase()}.png" class="filter-logo" /> ${options[j]} </label>`;
            } else if (types[i] == "color") {
                var bg = filterColors[options[j]][0];
                var color = filterColors[options[j]][1];
                o.innerHTML += `<label class="label color-label" style="background-color: ${bg}; color: ${color};" for="${options[j]}"> ${options[j]} </label>`;
            } else {
                o.innerHTML += `<label class="label" for="${options[j]}"> ${options[j]} </label>`;
            }            
            gridContainer.appendChild(o);
        }
        document.getElementById(types[i]).appendChild(gridContainer);
    }
}

export function loadFilters(filters, types) {
    var numCat = 0;
    const tempContainer = document.createElement('div');

    for (var i = 0; i < types.length; i++) {
        if (filters[i].size > 0) {
            $(`#${types[i]}-count`).html(`(${filters[i].size})`);
        } else {
            $(`#${types[i]}-count`).html(``);
        }
    }

    for (var i = 0; i < filters.length; i++) {
        var toJoin = Array.from(filters[i]);
        if (toJoin.length > 0) {
            numCat++;
            var filterString = toJoin.join(', ');
            var currButton = document.createElement('button');
            currButton.id = "clear-filters-" + types[i];
            currButton.innerHTML = `<div class="filter-string"> ${filterString} </div>
               <div> <span aria-hidden="true">&times;</span> </div>`;
            tempContainer.appendChild(currButton);    
        }
    }

    if (numCat > 1) {
        var clearButton = document.createElement('button');
        clearButton.id = "clear-filters-all";
        clearButton.innerHTML = `<div class="filter-string"> Clear all </div>
           <div> <span aria-hidden="true">&times;</span> </div>`;

        tempContainer.appendChild(clearButton);    
    }

    $("#filters").html(tempContainer.innerHTML);
}

// for later, filter navigation
/* 
    <div class="row">
        <div class="col path">
            <p> <a href="/search=">${jersey.team_full}</a> / <a href="">${(jersey.seasons).join(", ")}</a> / <a href="">${jersey.category}</a> </p>
        </div>
    </div>
*/

// https://pbs.twimg.com/media/${imgs[i]}?format=jpg&name=orig
function getImageGal(jersey) {
    const imageGallery = document.createElement('div');
    imageGallery.id = "image-container";

    for (var i = 0; i < jersey.img_urls.length; i++) {
        var imageContainer = document.createElement('div');
        imageContainer.setAttribute('data-toggle', 'modal');
        imageContainer.setAttribute('data-target', '#galleryModal');

        var image = document.createElement('img');
        image.className = 'image-container-preview';
        image.setAttribute('src', `https://pbs.twimg.com/media/${jersey.img_urls[i]}?format=jpg&name=small`);
        image.setAttribute('alt', `${jersey.team_full} warm-up jersey details for ${jersey.event}`);
        image.id = "gal-" + i;

        imageContainer.appendChild(image);
        imageGallery.appendChild(imageContainer);
    }

    return imageGallery.outerHTML;
}

function getSocials(jersey) {
    //in support of <a href="${jersey.org_url}">${jersey.org_name}
    var socials = [];

    if ("website" in jersey.socials) {
        // <a href="[url]">Website</a>
        socials.push(`<a href="${jersey.socials["website"]}">Website</a>`);
    }

    if ("ig" in jersey.socials) {
        // <a href="https://www.instagram.com/[id]">Instagram</a>
        socials.push(`<a href="https://www.instagram.com/${jersey.socials["ig"]}">Instagram</a>`);
    }

    if ("shop" in jersey.socials) {
        // <a href="[url]">Website</a>
        socials.push(`<a href="${jersey.socials["shop"]}">Shop</a>`);
    }

    var socialsContainer;

    if (socials.length > 0) {
        socialsContainer = document.createElement('li');
        // Artist: Website / Instagram / Shop
        socialsContainer.innerHTML = `Artist links: ${socials.join(" / ")}`;
        return socialsContainer.outerHTML;
    } else {
        return "";
    }
}

function getOrg(jersey) {
    if (jersey.org_name[0] != "") {
        var orgs = []
        for (var i = 0; i < jersey.org_name.length; i++) {
            var curr = `<a href="${jersey.org_url[i]}">${jersey.org_name[i]}</a>`;
            orgs.push(curr);
        }
        return (`in support of ${orgs.join(" and ")}`);
    } else {
        return "";
    }
}

export async function loadSubpage(jersey) {
    document.title = jersey.event;
    var subpageDiv = $('<div>');
    var socials = getSocials(jersey);
    var imageGal = getImageGal(jersey);
    var org = getOrg(jersey);
    var html = `
    <div class="container" id="subpage">
        <div class="row">
            <div class="col-md-6"> <!-- main info -->
                <div class="card thumbnail">
                    <div class="info">
                        <div class="info-line">
                            <img src="imgs/logos/${jersey.team.toLowerCase()}.png" class="logo" alt="${jersey.team_full} logo" />
                            <span class="team" style="color: ${nameColors[jersey.team_full]}">${jersey.team_full}</span> 
                        </div>
                        <div class="title">
                            <h2 class="event">${jersey.event}</h2>
                            <span class="season">${(jersey.seasons).join(", ")}</span>
                        </div>
                        <span class="date">Worn ${(jersey.date_pretty).join(", ")}</span>
                    </div>
                    <div class="thumbnail-container"> <img src="imgs/thumbnails/${jersey.team_id}.png" alt="${jersey.team_full} jersey design for ${jersey.event}" /> </div>
                    <span id="thumbnail-caption">With <b>${jersey.artist}</b> ${org}</span>
                </div>
                <div id="video-anchor-a"> </div>
            </div>
            
            <div class="col-md-6"> <!-- extra info -->
                <div class="quote">
                    <h3 class="section-title"> Statement </h3>
                    <blockquote>
                        <p> ${jersey.statement} <a href="${jersey.source}">(Read more)</a> </p>
                    </blockquote>
                </div>
    
                <h3 class="section-title"> Notes </h3>
                <div class="notes card">
                    <ul>
                       ${socials}
                       ${jersey.notes}
                    </ul>
                </div>

                <div class="modal fade" id="galleryModal" tabindex="-1">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                
                            <div class="modal-body">
                                <img src="" style="width: 100%;" > 
                            </div>
                        </div>
                    </div>
                </div>
            
                <div class="image-gallery" style="text-align: left;">
                    <h3 class="section-title"> Gallery </h3>
                    ${imageGal}
                </div>

                <div id="video-anchor-m"> </div>
            </div>
        </div>
    </div>`;
    subpageDiv.html(html);
    var container = $('#home');
    container.empty().append(subpageDiv);

    loadTweets(jersey.a_embed, jersey.m_embed);

    // replace img for modal
    $('.image-container-preview').on('click', function() {
        const imageSrc = $(this).attr('src');

        const galleryModal = $('#galleryModal');
        const modalImage = galleryModal.find('.modal-body img');
        modalImage.attr('src', imageSrc.replace("small", "large"));
      });    
}

function loadTweets(a_embed, m_embed) {
    const artistEmbedContainer = document.createElement('div');
    artistEmbedContainer.className = "video-section";

    if (a_embed.length > 0) {
        for (var i = 0; i < a_embed.length; i++) {
            const embed = `<blockquote class="twitter-tweet">
            <a href="https://twitter.com/x/status/${a_embed[i]}"></a> 
            </blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`;  
            artistEmbedContainer.insertAdjacentHTML("beforeend", embed);
        }
    } 
    console.log(artistEmbedContainer.outerHTML);
    $('#video-anchor-a').append(artistEmbedContainer.outerHTML);

    const miscEmbedContainer = document.createElement('div');
    miscEmbedContainer.className = "video-section";
    if (m_embed.length > 0) {
        for (var i = 0; i < m_embed.length; i++) {
            const embed = `<blockquote class="twitter-tweet">
            <a href="https://twitter.com/x/status/${m_embed[i]}"></a> 
            </blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`;  
            miscEmbedContainer.insertAdjacentHTML("beforeend", embed);
        }
    } 
    console.log(miscEmbedContainer.outerHTML);
    $('#video-anchor-m').append(miscEmbedContainer.outerHTML);
}