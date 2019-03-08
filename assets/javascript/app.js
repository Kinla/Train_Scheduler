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

$("#submit").on("click", function (event){
    event.preventDefault();

    // Grab values
    var name = $("#name").val();
    var destination = $("#destination").val();
    var firstTrain = $("#firstTrain").val();
    var frequency = $("#frequency").val();
    console.log(name, destination, firstTrain, frequency);

    // Calculate next arrival
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment(moment().add(tMinutesTillTrain, "minutes")).format("hh:mm A");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));


    //Store on firebase
    trainList.push({
        "name": name,
        "destination": destination,
        "frequency": frequency,
        "nextTrain": nextTrain,
        "minutesAway": tMinutesTillTrain
    });
    console.log(name, destination, frequency, nextTrain, tMinutesTillTrain)
    
    displayTrainInfo();

    // Clear form
    $("#name").val("");
    $("#destination").val("");
    $("#firstTrain").val("");
    $("#frequency").val("");
});

//display train info
function displayTrainInfo (){
    $("#table").empty();
    trainList.on("child_added", function(childSnapshot) {
        var train = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var frequency = childSnapshot.val().frequency;
        var nextTrain = childSnapshot.val().nextTrain;
        var minutesAway = childSnapshot.val().minutesAway;
        var key = childSnapshot.key
        console.log(train, destination, frequency, nextTrain, minutesAway, key)
    
        //Display on page
        var row = "<tr><td>" + train + "</td><td>" 
                    + destination + "</td><td>" 
                    + frequency + "</td><td>" 
                    + nextTrain + "</td><td>" 
                    + minutesAway 
                    + "</td><td><button class='btn btn-primary removeTrain' id='" + key + "'>x</button>"
                    + "</td><td><button class='btn btn-primary updateTrain' data-toggle='modal' data-target='#newInfo' id='" + key + "'>x</button></td></tr>";

        $("#table").append(row)
    });
    

}

//Remove Train
$(document).on("click", ".removeTrain", function(){
    var key = $(this).attr("id")
    var trainInfo = trainList.child(key).remove()
    console.log("working on remove:" + key, trainInfo)

    displayTrainInfo();
});


//Associate update button to modal - map KEY
$('#newInfo').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var  key = button.attr("id") 
    var modal =$(this)
    modal.find('.modal-title').attr("id", key)
  })


//Update Train
$('#updateTrain').on("click", function(event){
    event.preventDefault();

    var key = $(this).closest("#newInfo").find('.modal-title').attr("id")
    var frequency = $(this).closest("#newInfo").find("#updateFrequency").val();
    var firstTrain = $(this).closest("#newInfo").find("#updateFirstTrain").val();

    // Calculate next arrival
    var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;

    // Next Train
    var nextTrain = moment(moment().add(tMinutesTillTrain, "minutes")).format("hh:mm A");

    console.log("last:" + key, frequency, nextTrain, tMinutesTillTrain)
    
    //Store on firebase
    database.ref("trainList/" + key).update({
        "frequency": frequency,
        "nextTrain": nextTrain,
        "minutesAway": tMinutesTillTrain
    });
    

    displayTrainInfo();

    // Clear form

    $("#updateFirstTrain").val("");
    $("#updateFrequency").val("");

});


//Ready document
$(document).ready(function(){
    displayTrainInfo();
})