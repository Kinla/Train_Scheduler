// Initialize Firebase
var config = {
    apiKey: "AIzaSyAgfhtrMsDfMhn2wZexm_wLanVuwNV2ksM",
    authDomain: "train-e35bc.firebaseapp.com",
    databaseURL: "https://train-e35bc.firebaseio.com",
    projectId: "train-e35bc",
    storageBucket: "",
    messagingSenderId: "11699951281"
  };
  firebase.initializeApp(config);

// Database
var database = firebase.database();

// Set up train folder
var trainList = database.ref("/trainList");

// Set up counter as train identifier
var trainNumber;

$("#submit").on("click", function (event){
    event.preventDefault();

    // Grab values
    var name = $("#name").val();
    var destination = $("#destination").val();
    var firstTrain = $("#firstTrain").val();
    var frequency = $("#frequency").val();
    console.log(name, destination, firstTrain, frequency);

    // Calculate next arrival
    var currentTime = moment();
    var timeArray = firstTrain.split(":");
    console.log(timeArray);
    var firstTrain = moment().hour(timeArray[0]).minute(timeArray[1]);
    console.log(currentTime, firstTrain);

    var timeDifference = currentTime.diff(firstTrain, "minutes");
    console.log(timeDifference);

    
    if (timeDifference > 0){
        var remainder = timeDifference % frequency;
        var timeAway = frequency - remainder;
        var nextTrain = moment(currentTime.add(timeAway, "minutes")).format("hh:mm A");
        console.log(remainder, timeAway, nextTrain);
    } else {
        var timeAway = - timeDifference;
        var nextTrain = moment(firstTrain).format("hh:mm A");
        console.log(timeAway, nextTrain);
        

    }


    // Clear form
    var name = $("#name").val("");
    var destination = $("#destination").val("");
    var firstTrain = $("#firstTrain").val("");
    var frequency = $("#frequency").val("");
})

