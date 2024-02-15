"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episodesList = $("#episodesList");

const BASE_URL = 'https://api.tvmaze.com/';
const MISSING_IMG_URL = 'https://tinyurl.com/tv-missing';



/*
fetching and awaiting, fetching will be getting list of shows matching our
search term.
will probably have to enter specific params to our api url
*/

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchTerm) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const response = await fetch(`${BASE_URL}search/shows?q=${searchTerm}`);
  const showsArray = await response.json();

  const showDetailsArray = showsArray.map((elem) => ({
    id: elem.show.id,
    name: elem.show.name,
    summary: elem.show.summary,
    image: elem.show.image ? elem.show.image.medium : MISSING_IMG_URL,
  }));

  return showDetailsArray;
}


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();

  for (const show of shows) {
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}



/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm(evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {

  const response = await fetch(`${BASE_URL}shows/${id}/episodes`);
  const episodesArray = await response.json();

  const episodeDetailsArray = episodesArray.map((elem) => ({
    id: elem.id,
    name: elem.name,
    season: elem.season,
    number: elem.number,
    rating: elem.rating.average,
  }));

  return episodeDetailsArray

}


/** Write a clear docstring for this function... */

function displayEpisodes(episodes) {
  for (let episode of episodes) {
    const name = episode.name;
    const season = episode.season;
    const number = episode.number;
    const rating = episode.rating;

    $episodesList.append($(
      `<li>${name}(season:${season}, number ${number}, rating ${rating}</li>`
      ));
  }
}

// add other functions that will be useful / match our structure & design
/*
store id of show we're getting
event delegation
*/
function searchEpisodesAndDisplay() {
  const showID = $(`button .id`).closest()

}

