// Add on-load event listener to call functions to populate the "theater" and "date" selections.

$(window).on( "load", getTheaters);

$("#submit").click(getSchedule);

/*This function first calls the getDates function to populate Date list, and then populates the Theater list through Finnkino XML-services. */
function getTheaters(){
    // Call getDates first, populate Dates list.
    getDates()
    var url = 'https://www.finnkino.fi/xml/TheatreAreas/';
    let theaterResponse = $.ajax(url, {async: false});
    theaterResponse = theaterResponse.responseXML;
    // Wait to get proper response.
      /* For every TheatreArea tag, get theatre value ('id') and name from XML response. Create option element (part of select list), set their innerHTML
        and value attributes, and append to the "select" list.*/
        for (i=0; i < theaterResponse.getElementsByTagName('TheatreArea').length; i += 1){
            let theatreValue = theaterResponse.getElementsByTagName('ID')[i].childNodes[0].nodeValue
            let theatreName = theaterResponse.getElementsByTagName('Name')[i].childNodes[0].nodeValue;
            let option = document.createElement('option');

            $(option).html(theatreName);
            $(option).attr("value", theatreValue);
            $("#theaters").append(option);
        }
    }
/*Function to get dates from Finnkino XML service and append them to the date (select type) list.*/
function getDates(){

    let url = 'https://www.finnkino.fi/xml/ScheduleDates/';
    let dateResponse = $.ajax(url, {async: false});
    dateResponse = dateResponse.responseXML;
    // Wait to get proper response.     
        /* Get all dates from XML response, modify them to include only yyyy-dd-mm. 
        Create option element, set innerHTML to date and append to Date List (select type).*/
        for (i=0; i < dateResponse.getElementsByTagName('dateTime').length; i += 1){
            let date = dateResponse.getElementsByTagName('dateTime')[i].childNodes[0].nodeValue;
            date = date.substring(0, 10);
            let option = document.createElement('option');
            $(option).html(date);
            $("#dates").append(option);
        }
    }



/*Function to build FinnKino XML API request from user input (theatre and date). Then */
function getSchedule(){
    let selectedDate = $("#dates").val();
    let selectedTheater = $("#theaters").val();
    let selectedDateDot = selectedDate.substring(8) + "." + selectedDate.substring(5,7) + "." + selectedDate.substring(0,4);
    //console.log('selectedTheater in getSchedule: ' + selectedTheater);
    let url = ("https://www.finnkino.fi/xml/Schedule/?&area=" + selectedTheater + "&dt=" + selectedDateDot);
    console.log('Url: ' + url);
    //console.log('selectedDate in getSchedule: ' + selectedDate);
    //console.log('SelectedDateDot:' + selectedDateDot);
    let scheduleResponse = $.ajax(url, {async: false});
    scheduleResponse = scheduleResponse.responseXML;
    // When response ready:
    //xhttp.onreadystatechange=function(){ if(xhttp.status == 200 && xhttp.readyState == 4){
        
        //console.log(scheduleResponse);

        // Create Table, table row and 'th' elements for headers.
        let table = document.createElement("TABLE");
        let headerRow =  document.createElement("tr");
        let startHeader = document.createElement("th");
        let endHeader = document.createElement("th");
        let titleHeader =  document.createElement("th");
        let productionYearHeader =  document.createElement("th");
        let genreHeader =  document.createElement("th");
        let imageHeader = document.createElement("th");

        // Set header HTML, append th's into tr, and tr into table.
        $(startHeader).html("Start Time");
        $(endHeader).html("End Time");
        $(titleHeader).html("Title");
        $(productionYearHeader).html("Production Year");
        $(genreHeader).html("Genre");
        $(imageHeader).html("Movie Image");

        $(headerRow).append(startHeader, endHeader, titleHeader, productionYearHeader, genreHeader, imageHeader);
        $(table).append(headerRow);
        //console.log(table);

        for (i=0; i< (scheduleResponse.getElementsByTagName('Show').length); i += 1){
            // Save values from appropriate XML response tags.

            let startTime = scheduleResponse.getElementsByTagName('Show')[i].childNodes[5].innerHTML;
            let endTime = scheduleResponse.getElementsByTagName('Show')[i].childNodes[9].innerHTML;
            let title = scheduleResponse.getElementsByTagName('Show')[i].childNodes[31].innerHTML;
            let productionYear = scheduleResponse.getElementsByTagName('Show')[i].childNodes[35].innerHTML;
            let genre = scheduleResponse.getElementsByTagName('Show')[i].childNodes[49].innerHTML;
            let img = scheduleResponse.getElementsByTagName('Show')[i].childNodes[73].childNodes[1].innerHTML;
            console.log("img: " + img);
            
            // Fix start and end time format.
            startT = startTime.substring(11,);
            endT = endTime.substring(11,);

            // Create row and td elements for the values.

            let row = document.createElement("tr");
            let start_ = document.createElement("td");
            let end_ = document.createElement("td");
            let title_ =  document.createElement("td");
            let productionYear_ =  document.createElement("td");
            let genre_ =  document.createElement("td");
            let img_ = document.createElement("img");
            //img_.setAttribute('src', img);
            // Test that image is a link:
            if (img.includes("http")){
                $(img_).attr('src', img);
                $(img_).addClass("rounded-circle");
            } else{
                $(img_).attr("src", "https://www.pikpng.com/pngl/m/106-1069399_iam-add-group1-sorry-no-image-available-clipart.png");
                $(img_).attr("heigh", "130");
                $(img_).attr("width", "130");
                $(img_).addClass("rounded-circle");
            };
            
            let image_ = document.createElement('td');
            image_.appendChild(img_);
        

            // Save values into 'td' elements.
            $(start_).html(startT);
            $(end_).html(endT);
            $(title_).html(title);
            $(productionYear_).html(productionYear);
            $(genre_).html(genre);
        
            // Append td's into current row, and row into the table.
            $(row).append(start_, end_, title_, productionYear_, genre_, image_);
            $(table).append(row);
        }
        // Create H2 element and set description. Append H2 and table elements to the output.
        let forDate = document.createElement('h2');
        // Bootstrap styling for table.
        $(table).addClass("table table-dark table-hover");
        //forDate.innerHTML = $("#theaters").options[$("#theaters").selectedIndex].text + ": " + selectedDate;
        let theater = $("#theaters option:selected").text();
        let date = $("#dates option:selected").text();
        $(forDate).html(theater + ": " + date);
        $(forDate).addClass("bg-info text-white");
        $("#output").append(forDate);
        $("#output").append(table);
    }