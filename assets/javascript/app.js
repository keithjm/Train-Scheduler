// Initialize Firebase
var config = {
    apiKey: "AIzaSyD1Qb1BaQdHdyB6xQA0z3Xk3XPDBSixoiQ",
    authDomain: "train-scheduler-c911d.firebaseapp.com",
    databaseURL: "https://train-scheduler-c911d.firebaseio.com",
    projectId: "train-scheduler-c911d",
    storageBucket: "",
    messagingSenderId: "133883487092"
};

firebase.initializeApp(config);
var database = firebase.database();

database.ref().on("child_added", function(childSnapshot) {
    var name = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var firstTrain = childSnapshot.val().firstTrain
    var nextArrival = nextArrivalCalc(frequency, firstTrain);
    var minutesAway = minutesAwayCalc(frequency, firstTrain);
    var row = $("<tr>");
    row.append("<td>" + name + "</td>");
    row.append("<td>" + destination + "</td>");
    row.append("<td>" + frequency + "</td>");
    row.append("<td>" + nextArrival + "</td>");
    row.append("<td>" + minutesAway + "</td>");
    $("#train-table").append(row);
})

$("#submitBtn").on("click", function() {
    event.preventDefault();
    var name = $("#train-name").val().trim();
    var destination = $("#train-dest").val().trim();
    var firstTrain = $("#first-train").val().trim();
    var frequency = $("#train-freq").val().trim();
    //console.log(moment(firstTrain));
    var minutesAway = minutesAwayCalc(frequency, firstTrain);
    var nextArrival = nextArrivalCalc(frequency, firstTrain);
    //console.log(name,destination,firstTrain,frequency);
    database.ref().push({
        name: name,
        destination: destination,   
        frequency: frequency,
        firstTrain : firstTrain
    });
    $("#train-name").val("");
    $("#train-dest").val("");
    $("#first-train").val("");
    $("#train-freq").val("");
})

function nextArrivalCalc(frequency, firstTrain){
    var firstConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
    console.log(firstConverted);
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstConverted), "minutes");
    var tRemainder = diffTime % frequency;
    var tMinutesTillTrain = frequency - tRemainder
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    
    return moment(nextTrain).format("hh:mm");   
}
function minutesAwayCalc(frequency, firstTrain) {
    var firstConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
    console.log(firstConverted);
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstConverted), "minutes");
    var tRemainder = diffTime % frequency;
    var tMinutesTillTrain = frequency - tRemainder;
    return tMinutesTillTrain;
    
    console.log(tRemainder); 
}


