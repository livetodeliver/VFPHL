'use strict';

//const apiKey_vegguide = ''; 
const searchURL_vegguide = 'https://www.vegguide.org//search/by-address/Philadelphia,+PA/filter/category_id=1;';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
 
    $('#results-list').append(
      `<li><h3>${responseJson.entries[i].name}</h3>
      <li>${responseJson.entries[i].veg_level_description}</li>
      <li>${responseJson.entries[i].address1}</li>
      <li><a href='${responseJson.entries[i].website}'>${responseJson.entries[i].website}</a></li>
      <li>${responseJson.entries[i].short_description}</li>` 
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function getRestaurants() {
    const vegLevel = $('#js-veg-level').val();
    //const address = $('#js-address').val();
    const neighborhoods = $('#js-neighborhoods').val();
    const foodTypes = $('#js-foodTypes').val();
    const wheelchairAcc = $('#js-wheelchair').val();
    const accRes = $('#js-accepts-res').val();
    const attr = $('.js-attributes').val();
  const params = {
    veg_level: vegLevel,
    accepts_reservations: accRes,
    is_wheelchair_accessible: wheelchairAcc,
    cuisines_id: foodTypes,
    neighborhood: neighborhoods,
    attribute_id: attr,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL_vegguide + '?' + queryString;

  console.log(url);

  fetch(url, {
    headers: {
        'User-Agent': 'Vegan-Friendly PHL App v1.0',
        'Access-Control-Allow-Origin': "*"
    }
})
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const vegLevel = $('#js-veg-level').val();
    //const address = $('#js-address').val();
    const neighborhoods = $('#js-neighborhoods').val();
    const foodTypes = $('#js-foodTypes').val();
    const wheelchairAcc = $('#js-wheelchair').val();
    const accRes = $('#js-accepts-res').val();
    const attr = $('.js-attributes').val();
    getRestaurants(vegLevel, neighborhoods, foodTypes, wheelchairAcc, accRes, attr);
  });
}

$(watchForm);