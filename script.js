$(document).ready(function() {

    var cities = [];

    $("#currentCity").hide();
    $("#fiveDay").hide();

    function currentCityForecast(city) {
        var APIkey = "5c8704425ab92241862cff6ff022e5b2";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            var weatherIcon = response.weather[0].icon;
            var date = $("<h2>").text(moment().format('1'));
            var icon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;

            $("#currentCityName").text(response.name);
            $("#currentCityName").append(date);
            $("#currentCityName").append(icon);
            $("#currentCityTemp").text(tempF.toFixed(2) + " \u00B0F");
            $("#currentCityHumid").text(response.main.humidity + "%");
            $("#currentCityWind").text(response.wind.speed + "MPH");

            var lat = response.coord.lat
            var lon = response.coord.lon
            queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIkey + "&lat=" + lat + "&lon=" + lon; 
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response) {
                var uvIndex = response.value;
                $("#currentCityUV").removeClass("favorable");
                $("#currentCityUV").removeClass("moderate");
                $("#currentCityUV").removeClass("severe");
                    if (uvIndex <= 2.9) {
                        $("#currentCityUV").addClass("favorable");
                    } else if (uvIndex >= 3 && uvIndex <= 7.9) {
                        $("#currentCityUV").addClass("moderate");
                    } else {
                        $("#currentCityUV").addClass("severe");
                    };

                    $("#currentCityUV").text(response.value);
        });

        $("#currentCity").show();   
        }); 
    };

    function fiveDayForecast(city){
        var APIkey = "5c8704425ab92241862cff6ff022e5b2"
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIkey;
    
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            var counter = 1
            for(var i=0; i < response.list.length; i += 8){
                var date = moment(response.list[i].dt_txt).format("l");
                var weatherIcon = response.list[i].weather[0].icon;
                var tempF = (response.list[i].main.temp - 273.15) * 1.80 + 32;
                    
                $("#date" + counter).text(date);
                $("#icon" + counter).attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
                $("#temp" + counter).text(tempF.toFixed(2) + " \u00B0F");
                $("#humid" + counter).text(response.list[i].main.humidity + "%"); 
                counter++;

            };

            $("#fiveDay").show();   
        });
    };

    function createCityLists(city){
        var cityLi = $("<li>").text(city)
        cityLi.addClass("cityList");
        $("#cityList").append(cityLi); 
    };

    function renderCities(){
        $("#cityList").empty();
        for (var i = 0; i < cities.length; i++) { 
            createCityLists(cities[i]);
        };
    };

    function weather(city){
        currentCityForecast(city);
        fiveDayForecast(city);
    };

    function init() {
        var storedCities = JSON.parse(localStorage.getItem("searches"));
    
        if (storedCities) {
            cities = storedCities;
            renderCities();
            weather(cities[cities.length -1]);
        }; 
    };
    init();

    $("#searchBtn").click(function(){
        var cityInputs = $(this).siblings("#userInput").val().trim();
        $("#userInput").val("");
        if (cityInputs !== ""){
            if (cities.indexOf(cityInputs)== -1){
                cities.push(cityInputs);
                localStorage.setItem("searches",JSON.stringify(cities));
                createCityLists(cityInputs);
            };
            
            weather(cityInputs);
        };
    });

    $("#cityList").on("click", ".cityList", function(){
        var cityOnButton = $(this).text();
        weather(cityOnButton);
    });

});