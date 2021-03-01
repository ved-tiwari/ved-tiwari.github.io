/*
Developed by Ved Tiwari
Grade 10
Middletown High School
*/
fetch(
  "https://ipapi.co/json/"
)
  .then(function (resp) {
    return resp.json();
  })
  .then(function (data) {
    console.log("User IP");
    console.log(data);

    city = data.city;
    state = data.region;
    

    $("#cityState").html(city + ", " + state);
    $("#placeNameText").html(city)

    let latitude = data.latitude;
    let longitude = data.longitude;

    function buttonClick() {
      if ($("#input").val() == "") {
        alert("Please Enter a Valid Response")
      } else {
        fetch(
          `https://api.opencagedata.com/geocode/v1/json?key=a0fe819af6c344c7bd01b76b8aa2fe0a&q=${$(
            "#input"
          ).val()}&pretty=1`
        )
          .then(function (resp) {
            return resp.json();
          })
          .then(function (data) {
            
            console.log("Search Results")
            console.log(data);

            let select = document.getElementById("searchText")
            select.innerHTML = ""

            data.results.forEach(element => {
              let result = document.createElement("p")
              result.append(`${element.formatted.split(",")[0]}, ${element.components.state}`)
              result.onclick = function() {
                splittedValues = `${element.formatted.split(",")[0]}, ${element.components.state}`
                $("#input").val(splittedValues)

                $("#cityState").html(splittedValues)
                $("#placeNameText").html(splittedValues)
                
                latitude = element.geometry.lat
                longitude = element.geometry.lng
                $("#searchText").slideToggle()
                ranEvent(latitude, longitude)
              }
              $("#searchText").append(result)

            });
            $("#searchText").slideToggle()
            
          });
      }
    }

    $("#submit").click(buttonClick)
    
    $("#input").keypress(function (e) {
      if (e.which == 13) {
        $("#submit").click();
        return false;
      }
    });
    
    ranEvent()
     function ranEvent() {

      $("#map").attr(
        "src",
        `https://api.maptiler.com/maps/3f3e793f-7cd4-4139-9151-196dc28982c6/?key=MDtpeizbgO16GHjf4R8l#9.9/${latitude}/${longitude}`
      );
      
  
      fetch(
        `https://data.climacell.co/v4/timelines?location=${latitude}%2C${longitude}&fields=treeIndex&fields=grassIndex&fields=weedIndex&timesteps=1d&units=metric&apikey=yApnKqHUnbcKwhR10TKYK351d2NLMEwj`,
        {
          method: "GET",
          headers: {},
        }
      )
        .then(function (resp) {
          return resp.json();
        })
        .then(function (data) {
          console.log(data);
        });
  
      fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=97b0a6725137ba98de119874c4a71f42`
      )
        .then(function (resp) {
          return resp.json();
        })
        .then(function (data) {
          console.log("openweatherMap")
          console.log(data)

          $("#pm25").html(data.list[0].components.pm2_5)
          $("#o3").html(data.list[0].components.o3)
          $("#pm10").html(data.list[0].components.pm10)
          $("#no2").html(data.list[0].components.no2)
          $("#co").html(data.list[0].components.co)
          $("#so2").html(data.list[0].components.so2)
        });
      
        fetch(
          `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=dee8fa106c12fe115d25a905056f11d3328d3b3c`
        )
          .then(function (resp) {
            return resp.json();
          })
          .then(function (data) {
            console.log(data);
            let aqiNo = data.data.aqi;
  
            $("#aqi").html(aqiNo);
            $("#aqiText").html(aqiNo)
  
            let aqiStats = "";
            let color = "";
            let image = "";
  
            if (aqiNo >= 0 && aqiNo < 50) {
              aqiStats = "Good";
              color = "#57b744";
              image = "images/rangeGood.png"
            } else if (aqiNo >= 50 && aqiNo < 100) {
              aqiStats = "Moderate";
              color = "#f3eb1e";
              image = "images/rangeModerate1.png"
            } else if (aqiNo >= 100 && aqiNo <= 150) {
              $("#sensitiveGroups").html("")
              aqiStats = "Moderate for sensitive groups";
              color = "#f47e2a";
              image = "images/rangeModerate2.png"
            } else if (aqiNo >= 150 && aqiNo < 200) {
              aqiStats = "Unhealthy";
              color = "#ec1921";
              image = "images/rangeUnhealthy.png"
            } else if (aqiNo >= 200 && aqiNo < 250) {
              aqiStats = "Very Unhealthy";
              color = "#7a3779"
              image = "images/rangeUnhealthy.png"
            } else if (aqiNo >= 250) {
              aqiStats = "Hazerdous";
              color = "#4b0b23"
              image = "images/rangeHazerdous.png"
            }
  
            $("#aqiStatus").html(aqiStats).css("color", color)
            $("#aqiStatusText").html(aqiStats)
  
            $("#range").attr("src", image)
            
            let dominant = data.data.dominentpol
            $("#dominant").html(dominant.toUpperCase())
            
            if(aqiStats == "Good") {
              $("#general").html("Air Quality is satisfactory and poses little to no risk.")
              $(".paragraph").html("Air Quality is satisfactory and poses little to no risk")
            } else if (aqiStats == "Moderate") {
              $("#general").html("Air Quality is satisfactory and poses little to no risk.")
              $(".paragraph").html("Consider reducing prolonged or heavy exertion. Watch for symptoms such as coughing or shortness of breath.")
            } else if (aqiStats == "Moderate for sensitive groups") {
              $("#general").html("Air Quality is satisfactory and poses little to no risk.")
              $(".paragraph").html("Those who are particularly sensitive should limit their outdoor excercie to minimize discomfort and injuries.")
              $("#lung").html("Symptoms such as shortness of breath may indicate health concerns. If you have any of these, contact your healthcare provider")
            } else if (aqiStats == "Unhealthy") {
              $("#general").html("Reduce prolonged or heavy exertion. Take more breaks during all outdoor activities.")
              $(".paragraph").html("Avoid prolonged or heavy exertion. Move activities indoors or reschedule to a time when the air quality is better.")
            } else if (aqiStats == "Very Unhealthy") {
              $("#general").html("Avoid prolonged or heavy exertion. Consider moving activities indoors or rescheduling to a time when air quality is better.")
              $(".paragraph").html("Avoid ail physical activity outdoors. Move activities indoors or reschedule to a time when air quality is better.")
            } else if (aqiStats == "Hazerdous") {
              $("#general").html("Avoid all physical activity outdoors.")
              $(".paragraph").html("Remain indoors and keep activity levels low. Follow tips for keeping particle levels low indoors.")
            }

          });
          
        fetch(`https://data.climacell.co/v4/timelines?location=${latitude}%2C${longitude}&fields=treeIndex&fields=grassIndex&fields=weedIndex&timesteps=15m&units=metric&apikey=yApnKqHUnbcKwhR10TKYK351d2NLMEwj`,
        {
          method: "GET",
          headers: {},
        })
        .then(function (resp) {
          return resp.json();
        })
        .then(function (data) {
          console.log(data)

          var grassIndex = Math.round(data.data.timelines[0].intervals[0].values.grassIndex)
          var weedIndex = Math.round(data.data.timelines[0].intervals[0].values.weedIndex)
          var treeIndex = Math.round(data.data.timelines[0].intervals[0].values.treeIndex)

          $("#grassPollen").html(grassIndex)
          $("#weedPollen").html(weedIndex)
          $("#treePollen").html(treeIndex)

          var descGrass = ""
          var grassColor = ""
          if (grassIndex === 0) {
            descGrass = "None"
            grassColor = "lime"
          } else if (grassIndex === 1 || grassIndex === 2) {
            descGrass = "Low"
            grassColor = "#04c900"
          } else if (grassIndex === 3) {
            descGrass = "Moderate"
            grassColor = "yellow"
          } else if (grassIndex > 3) {
            descGrass = "High"
            grassColor = "red"
          }
          $("#grassDescription").html(descGrass).css("color", grassColor)

          var desctree = ""
          var treeColor = ""
          if (treeIndex === 0) {
            desctree = "None"
            treeColor = "lime"
          } else if (treeIndex === 1 || treeIndex === 2) {
            desctree = "Low"
            treeColor = "#04c900"
          } else if (treeIndex === 3) {
            desctree = "Moderate"
            treeColor = "yellow"
          } else if (treeIndex > 3) {
            desctree = "High"
            treeColor = "coral"
          }
          $("#treeDescription").html(desctree).css("color", treeColor)

          var descweed = ""
          var weedColor = ""
          if (weedIndex === 0) {
            descweed = "None"
            weedColor = "lime"
          } else if (weedIndex === 1 || weedIndex === 2) {
            descweed = "Low"
            weedColor = "#04c900"
          } else if (weedIndex === 3) {
            descweed = "Moderate"
            weedColor = "yellow"
          } else if (weedIndex > 3) {
            descweed = "High"
            weedColor = "coral"
          }
          $("#weedDescription").html(descweed).css("color", weedColor)

          

        })

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=97b0a6725137ba98de119874c4a71f42`,
        {
          method: "GET",
          headers: {},
        })
        .then(function (resp) {
          return resp.json();
        })
        .then(function (data) {
          console.log("Weather");
          console.log(data);

          $("#weatherCityName").html(data.name);
          $("#weatherImage").attr(
            "src",
            `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
          );

          var weatherStatus = data.weather[0].description;
          weatherStatus = weatherStatus
            .toLowerCase()
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ");

          $("#weatherStatus").html(weatherStatus);
          $("#temperature").html("Temperature: " + `${data.main.temp}` + "&#xb0; F")
          $("#feelsLike").html("Feels Like: " + `${data.main.feels_like}` + "&#xb0; F")
          $("#humidity").html("Humidity: " + `${data.main.humidity}`)
          $("#pressure").html("Pressure : " + `${data.main.pressure}`)

        })
          
    }
    
  });


counter = 0
$("#generalLabel").click(function() {
  counter += 1

  if(counter%2 == 0) {
    $("#generalIcon").attr("name", "chevron-up-outline")
  } else {
    $("#generalIcon").attr("name", "chevron-down-outline")
  }

  $("#general").slideToggle()
})

counter = 0
$("#activeLabel").click(function() {
  counter += 1

  if(counter%2 == 0) {
    $("#activeIcon").attr("name", "chevron-down-outline")
  } else {
    $("#activeIcon").attr("name", "chevron-up-outline")
  }

  $("#active").slideToggle()
})

$("#childrenLabel").click(function() {
  counter += 1

  if(counter%2 == 0) {
    $("#childrenIcon").attr("name", "chevron-down-outline")
  } else {
    $("#childrenIcon").attr("name", "chevron-up-outline")
  }

  $("#children").slideToggle()
})

$("#elderlyLabel").click(function() {
  counter += 1

  if(counter%2 == 0) {
    $("#elderlyIcon").attr("name", "chevron-down-outline")
  } else {
    $("#elderlyIcon").attr("name", "chevron-up-outline")
  }

  $("#elderly").slideToggle()
})

$("#lungLabel").click(function() {
  counter += 1

  if(counter%2 == 0) {
    $("#lungIcon").attr("name", "chevron-down-outline")
  } else {
    $("#lungIcon").attr("name", "chevron-up-outline")
  }

  $("#lung").slideToggle()
})

$("#learnMore").click(function() {
  $("#learnMoreHREF").click()
})

$("#aqiTab").click(function() {
  $("#grassCard").slideUp()
  $("#treeCard").slideUp()
  $("#weedCard").slideUp()

  $("#weatherCard").slideUp()

  $(this).css("border-bottom", "#ff6f00 solid")
  $("#pollenTab").css("border-bottom", "none")
  $("#weatherTab").css("border-bottom", "none")
})

$("#pollenTab").click(function() {
  $("#grassCard").slideToggle()
  $("#treeCard").slideToggle()
  $("#weedCard").slideToggle()

  $("#weatherCard").slideUp()

  $(this).css("border-bottom", "#ff6f00 solid")
  $("#aqiTab").css("border-bottom", "none")
  $("#weatherTab").css("border-bottom", "none")
})

$("#weatherTab").click(function() {
  $("#grassCard").slideUp()
  $("#treeCard").slideUp()
  $("#weedCard").slideUp()

  $("#weatherCard").slideToggle()
  $(this).css("border-bottom", "#ff6f00 solid")
  $("#pollenTab").css("border-bottom", "none")
  $("#aqiTab").css("border-bottom", "none")
})

$("#xBtn").click(function() {
  $(".alert").slideToggle()
  $("#whitespace").css("display", "block")
})
