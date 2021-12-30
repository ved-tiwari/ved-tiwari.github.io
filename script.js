// Use matchMedia to check the user preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

toggleDarkTheme(prefersDark.matches);

// Listen for changes to the prefers-color-scheme media query
prefersDark.addListener((mediaQuery) => toggleDarkTheme(mediaQuery.matches));

// Add or remove the "dark" class based on if the media query matches
function toggleDarkTheme(shouldAdd) {
  document.body.classList.toggle('dark', shouldAdd);
}

//display date
var date = new Date();
var currDate = date.getDate();
var currMonth = date.getMonth();
var currYear = date.getFullYear();
var affix;

//convert numbers to month
switch(currMonth) {
  case 0: currMonth = "January";
    break;
  case 1: currMonth = "Febuary";
    break;
  case 2: currMonth = "March";
    break;
  case 3: currMonth = "April";
    break;
  case 4: currMonth = "May";
    break;
  case 5: currMonth = "June";
    break;
  case 6: currMonth = "July";
    break;
  case 7: currMonth = "August";
    break;
  case 8: currMonth = "September";
    break;
  case 9: currMonth = "October";
    break;
  case 10: currMonth = "November";
    break;
  case 11: currMonth = "December";
    break;
}
//Change affix based on date
switch(currDate) {
  case 1: affix = "st";
    break;
  case 2: affix = "nd";
    break;
  case 3: affix = "rd";
    break;
  default: affix = "th";
}
$("#date").html(currMonth + " " + currDate + affix + ", " + currYear);
