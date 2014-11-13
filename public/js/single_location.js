$(function(){
    // init headroom
    $("header").headroom();
    $('#myTab a:first').tab('show')
    $('#myTab1 a:first').tab('show')

});
/*
* check your brower supported HTML5 Geolocation
*/
function loadDemo(){
    var supported=true;
    if(navigator.geolocation){
        console.log('HTML5 Geolocation supported.')
    }else{
        console.log('HTML5 Geolocation is not supported in your browser.')
        supported=false;
    }
    return supported;
}


function showLocationMap(){
    navigator.geolocation.getCurrentPosition(show_map)
}


/*
* check your location one time
*/
function getCurrentLocation(){
    navigator.geolocation.getCurrentPosition(updateLocation,handleLocationError);
}
function updateLocation(position){
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var accuracy = position.coords.accuracy;
    var timestamp = position.timestamp;
    console.log('H'+latitude+'B'+longitude+'C'+accuracy);

    var now_date=new Date();
    console.log('Update time'+now_date.toLocaleDateString());
    console.log('update location position');
}
function handleLocationError(error){
    console.log(error.code+error.message)
    console.log('can not get position');
}

