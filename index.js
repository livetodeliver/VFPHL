'use strict';


const searchURL_vegguide = 'https://www.vegguide.org/search/';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
  return queryItems.join(';');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array
  if (responseJson.entry_count !== 0) {

  for (let i = 0; i < responseJson.entries.length; i++){

    let listItem = "";

    listItem = `${responseJson.entries[i].name}
    Veg-Friendliness: ${responseJson.entries[i].veg_level_description}`;
   
    if (responseJson.entries[i].neighborhood) {
        listItem = listItem + 'Neighborhood:' + responseJson.entries[i].neighborhood;
    }

    listItem = listItem + `${responseJson.entries[i].address1}`;

    if (responseJson.entries[i].website) {
        listItem = listItem + `<a href='${responseJson.entries[i].website}'>${responseJson.entries[i].website}</a>`;
    }

    listItem = listItem + `${responseJson.entries[i].short_description}`;

    $('#results-list').append(
      `<li>${listItem}</li>` 
    )
};

  //display the results section  
  

} else {
    $('#results-list').append(
        `<li>No Results Found</li>` 
    );
}

$('#results').removeClass('hidden');

};

function getRestaurants() {  
  const params = {};
  const addParam = (key, value) => {
      if (value === true || value) {
          params[key] = value;
      }
  }
  
    let vegLevel = $('#js-veg-level').val();
    const neighborhoods = $('#js-neighborhoods').val();
    const foodTypes = $('#js-food-types').val();
    const attr = $('#js-attributes').val();

    let wheelchairAcc = undefined;
    if ($('#js-wheelchair').prop('checked')) {
        wheelchairAcc = 1;
    };
    let accRes = undefined;
    if ($('#js-accepts-res').prop('checked')) {
        accRes = 1;
    };

        addParam('accepts_reservations', accRes);
        addParam('is_wheelchair_accessible', wheelchairAcc);
        addParam('cuisine_id', foodTypes.toString());
        addParam('neighborhood', neighborhoods.toString());
        addParam('attribute_id', attr.toString());
  
    
  const queryString = formatQueryParams(params)
  let address = $('.js-address').val() + '+Philadelphia,+PA';
  let location = 'by-address/' + address;
  const url = searchURL_vegguide + location + '/filter/veg_level=' + vegLevel + ';category_id=1;' + queryString;
  
  console.log(url);

  fetch(url, {
    headers: {
        'User-Agent': 'Vegan-Friendly PHL App v1.0',
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
    getRestaurants();
  });
}

$(watchForm);



