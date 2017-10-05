$(document).ready(function() {
    var map = "";
    var markers = [];

    //handle form submission
    $("form").submit(function() {
        //make request to google maps API...
        //Choice of $.ajax over $.post is due to preference
        $.ajax({
            type: 'post',
            url: $(this).attr('action'),
            data: "location=" + $("#locate").val(),
            complete: function(data) {
                //parse JSON
                responseJSON = $.parseJSON(data.responseText);
                //set maps's center
                var center = '';
                //try getting client's location
                if (google.loader.ClientLocation){
                    center = new google.maps.LatLng(
                        google.loader.ClientLocation.latitude,
                        google.loader.ClientLocation.longitude
                    );
                    //if client's location is unavailable,
                    //set the queried location as the map's center point
                } else {
                    center = new google.maps.LatLng($("#locate").val());
                }
                var opts = {
                    zoom: 5,
                    center: center,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
                //create map
                var map = new google.maps.Map(document.getElementById("map_div"), opts);
                //geocoder instance
                geocoder = new google.maps.Geocoder();

                //create marker's and bind event listener's
                $.each(responseJSON.Placemark, function(key, val) {
                    geocoder.geocode( { 'address': val.address}, function(results, status) {

                        var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location,
                            title: val.address
                        });
                        markers.push(marker);
                        google.maps.event.addListener(marker, 'click', function() {
                            var infoWindow = new google.maps.InfoWindow({
                                content: val.address,
                                size: new google.maps.Size(50, 50),
                                position: marker.position
                            });
                            infoWindow.open(map);
                        });
                    });
                });
            }
        });
    });
});