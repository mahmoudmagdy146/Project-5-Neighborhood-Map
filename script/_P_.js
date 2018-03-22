var map;
        var markers=[];
        var largeInfowindow;
        var init_data=[
            {
                title:'Colossus of Rhodes',
                location:{lat: 36.451066,lng: 28.225833}
            },
            {   title:'Great Pyramid of Giza',
                location:{lat: 29.979235,lng: 31.134202}
            },
            {
                title:'Hanging Gardens of Babylon',
                location:{lat: 48.919861,lng: 2.343222}
            },
            {
                title: 'Lighthouse of Alexandria',
                location: {lat: 38.790405, lng: -77.040581}
            },
            {
                title: 'Mausoleum at Halicarnassus',
                location: {lat: 37.037900, lng: 27.424100}
            },
            {
                title: 'Statue of Zeus at Olympia',
                location: {lat: 37.638459, lng: 21.629880}
            },
            {
                title: 'Temple of Artemis at Ephesus',
                location: {lat: 37.949739, lng: 27.364031}
            },
        ];
        
//to get the location
var Loction=function(data){
    this.title=ko.observable(data.title);
    this.location=ko.observable(data.location);
    this.marker=data.marker;
};

var init=function(){
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 25.0329694, lng: 121.5654177},
    zoom: 20
});
    largeInfowindow=new google.maps.InfoWindow();
    largeInfowindow=new google.maps.InfoWindow();
// The following group uses the location array to create an array of markers on initialize.
for(var i=0;i<init_data.length;i++){
// Get the position from the location array.
    var position=init_data[i].location;
    var title=init_data[i].title;
    // Create a marker per location, and put into markers array.
    var marker=new google.maps.Marker({
    position:position,
    title:title,
    animation:google.maps.Animation.DROP,
    id:i
});

// Push the marker to our array of markers.
    markers.push(marker);
    init_data[i].marker=marker;
    marker.addListener('click', openInfoWindow);
}
    showListings();
    ko.applyBindings(new ViewModel());
};
function openInfoWindow(){
        populateInfoWindow(this, largeInfowindow);
        animation(this);
    }

function animation(marker){
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){
    marker.setAnimation(null);},700);
}

// This function will loop through the markers array and display them all.
function showListings(){
    var bounds=new google.maps.LatLngBounds();
 // Extend the boundaries of the map for each marker and display the marker
    for(var i=0;i<markers.length;i++){
        markers[i].setMap(map);
        bounds.extend(markers[i].position); }
        map.fitBounds(bounds);
    }

// This function will loop through the listings and hide them all.
function hideListings(){
    for(var i=0;i<markers.length;i++){
            markers[i].setMap(null); }
    }

function populateInfoWindow(marker,infowindow){
// Check to make sure the infowindow is not already opened on this marker.
    if(infowindow.marker!=marker){
            infowindow.marker=marker;
// get wiki  api url
        var wikiUrl='http://en.wikipedia.org/w/api.php?action=opensearch&search='+marker.title+'&format=json&callback=wikiCallback';
        $.ajax({
        url:wikiUrl,
        dataType:"jsonp",
        jsonp:"callback",})
        .done(function(response){
        var article=response[1][0];
        url=('http://en.wikipedia.org/wiki/'+article);
// put data
        infowindow.setContent('<h4 class="iw-title">' + marker.title + '</h4>' +
                              '<br><div> <a href="'+url+'">'+marker.title+'</a></div>');
        infowindow.open(map,marker); })
        .fail(function(){
// put data
        infowindow.setContent('<br><div> N0 Data For this Location</div>');
        infowindow.open(map,marker); });
// Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
        infowindow.marker=null; });
    }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor){
    var markerImage=new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+markerColor+
    '|40|_|%E2%80%A2',
    new google.maps.Size(21,34),
    new google.maps.Point(0,0),
    new google.maps.Point(10,34),
    new google.maps.Size(21,34));
    return markerImage;
}

    var ViewModel=function(){
// Constructor creates a new map - only center and zoom are required.
    var self=this;
    this.visibleFilter=ko.observable(false);
    this.clickFilter=function(){
    self.visibleFilter(!self.visibleFilter()); };
    this.filter_data=function(){
// refresh data
    self.locations.removeAll();
    showListings();

if(self.filter()){
// if the user intered data in the input field , loop through the data
    for(var i=0;i<init_data.length;i++){
// remove marker from map if not match
        if(!init_data[i].title.toLowerCase().includes(this.filter().toLowerCase())){
            init_data[i].marker.setMap(null); }
        else{
    // add to the list
            self.locations.push(new Loction(init_data[i])); }
     }
}
    else{ // if there are no filter put the entire init_data
        ko_data(self.locations);}
};

    this.filter=ko.observable();
    this.locations=ko.observableArray([]);
    ko_data(this.locations);
        

// when click in name in the list open info window
    this.get_info_window=function(){
    populateInfoWindow(this.marker,largeInfowindow);
    animation(this.marker); };
        };
// enter the init_data to empty observableArray
    function ko_data(ko_locations){
        ko_locations.removeAll();
        init_data.forEach(function(location){
        ko_locations.push(new Loction(location));
    });
    }
        mapError = () => {
            alert("error load map please refresh the page to try again");
        };