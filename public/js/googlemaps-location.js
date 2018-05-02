// define map
var map;

// google map
function initMap() {

    // Create a new StyledMapType object, passing it an array of styles,
    // and the name to be displayed on the map type control.
    var styledMapType = new google.maps.StyledMapType(
        [
            {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ],
        {name: 'Styled Map'});

    var center = {lat: 49.947176, lng: 22.038865};

    // icon with properties
    var icon = {
        url: "/img/map-icon-blue.png"
    };

    map = new google.maps.Map(document.getElementById('map'), {
        scaleControl: true,
        center: center,
        zoom: 12,
        scrollwheel: false,
        mapTypeControl: false,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                'styled_map']
        }
    });

    // marker properties
    var marker = new google.maps.Marker({
        map: map,
        position: center,
        icon: icon,
        title: 'Fur-Bud Ryszard Pustelnik - Usługi budowlane'
    });

    var contentString = '<div><h3>Fur-Bud Ryszard Pustelnik</h3><p>Usługi budowlane</p><p>ul. Mickiewicza 45B Tyczyn</p></div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

}