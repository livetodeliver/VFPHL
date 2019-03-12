'use strict';

// Collapsible Search Navigation Menu 

const coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        let content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}

const searchURL_vegguide = 'https://www.vegguide.org/search/';



function displayResults(responseJson) {
    // if there are previous results, remove them
    console.log(responseJson, status);
    $('#results-list').empty();
    // iterate through the items array
    if (responseJson.entry_count !== 0) {

        for (let i = 0; i < responseJson.entries.length; i++) {

            let listItem = "";

            listItem = `
                <span class="liRestaurantName">${responseJson.entries[i].name}</span>`;

            if (responseJson.entries[i].website) {
                listItem = listItem + `<span class="liWebsite"><a href='${responseJson.entries[i].website}'><img src="link.png" alt="Website link icon"></a><span>`;
            }

            listItem = listItem + `<span class="liVeglev">Veg-Friendliness: ${responseJson.entries[i].veg_level_description}</span>`;

            if (responseJson.entries[i].neighborhood) {
                listItem = listItem + `<span class="liNeighborhoods">Neighborhood: ${responseJson.entries[i].neighborhood}</span>`;
            }

            listItem = listItem + `<span class="liAddress">${responseJson.entries[i].address1}</span>
            <span class="liDescription">Description: ${responseJson.entries[i].short_description}</span>`;


            if (responseJson.entries[i].tags) {
                listItem = listItem + `<span class="liTags">Additional Features: ${responseJson.entries[i].tags}</span>`;
            }

            $('#results-list').append(
                `<li class="entry" data-name="${responseJson.entries[i].name}">${listItem}</li>`
            )
        };

    } else {
        $('#results-list').append(
            `<li>No Results Found</li>`
        );
    }

    $('#results').removeClass('hidden');


};

//Formats search parameters and calls API for results

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
    return queryItems.join(';');
}

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
    const url = searchURL_vegguide + location + '/filter/unit=mile;distance=2;veg_level=' + vegLevel + ';category_id=1;' + queryString;

    console.log(url);

    return fetch(url, {
            headers: {
                //'User-Agent': 'Vegan-Friendly PHL App v1.0',
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .then(x => {
            $('html, body').animate({
                scrollTop: ($('#results').offset().top)
            });
            console.log('something');
        })
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

$('form').submit(event => {
    event.preventDefault();
    getRestaurants();  
});

// Loads Google Map 

let map;
let service;
let infowindow;
let markers = [];

function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 39.952583,
            lng: -75.165222
        },
        zoom: 12
    });

    infowindow = new google.maps.InfoWindow();

    // Calls Places API to match results from the VegGuide response
    // to corresponding Place ID and location.
    //Checks that the PlacesServiceStatus is OK, and adds a marker.

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            let marker = new google.maps.Marker({
                map: map,
                location: map.center,
                place: {
                    placeId: results[0].place_id,
                    location: results[0].geometry.location
                }
            });
            markers.push(marker);
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent('<div><strong>' + results[0].name + '</strong>' + '<br>' + results[0].formatted_address + '</div>');
                infowindow.open(map, this);
            });
        } else {
            window.alert('Location Not Found');
        }

        google.maps.event.addDomListener(window, 'load', initialize);
        return map;
    }

    $('body').on('click', 'li', function () {
        $('html, body').animate({
            scrollTop: ($('#results').offset().top)
        });
        addMarker($(this).data('name'));
    })

    $("#clearMarkers").click(function () {
        clearMarkers();
    })

    $("#showMarkers").click(function () {
        showMarkers();
    })

    $("#deleteMarkers").click(function () {
        deleteMarkers();
    })

    const addMarker = (location) => {
        let request = {
            location: {
                lat: 39.952583,
                lng: -75.165222
            },
            radius: '24000',
            query: location,
            fields: ['name', 'geometry', 'formatted_address', 'permanently_closed'],
        };
        console.log(map.center);
        let service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);
    }


    function setMapOnAll(map) {
        for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
        setMapOnAll(null);
    }

    // Shows any markers currently in the array.
    function showMarkers() {
        setMapOnAll(map);
    }

    // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
        clearMarkers();
        markers = [];
    }
}