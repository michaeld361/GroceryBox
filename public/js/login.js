
var userEmail = '';
var userName = '';
var deviceToken = '';



//login seciton

$('.loginBtn').click(function(){
  var ref = new Firebase("https://todofyp.firebaseio.com");
  var loginEmail = document.getElementById('loginEmail').value;
  var loginPass = document.getElementById('loginPass').value;

ref.authWithPassword({
  email    : loginEmail,
  password : loginPass
}, authHandler);
})
// Create a callback to handle the result of the authentication
var uid = 0;
function authHandler(error, authData) {
  if (error) {
    document.getElementById('validationMessage').innerHTML = error;
  } else {
    console.log("Authenticated successfully with payload:", authData);
    console.log("User ID: ", authData.uid);
    uid = authData.uid;
    //setUserGroup(uid);
    window.location.href = "https://todofyp.firebaseapp.com/";
  }
}






//Register Section
$('.registerBtn').click(function(){
var ref = new Firebase("https://todofyp.firebaseio.com");
userEmail = document.getElementById('regEmail').value;
userName = document.getElementById('regName').value;
var userPass = document.getElementById('regPass').value;

ref.createUser({
  email    : userEmail,
  password : userPass
}, function(error, userData) {
  if (error) {
    document.getElementById('validationMessageReg').innerHTML = error;
  } else {
    console.log("Successfully created user account with uid:", userData.uid);
    setUserGroup(userData.uid, userEmail);
    document.getElementById('validationMessage').innerHTML = 'Successfully registered - please login';
    $('#loginEmail').val(userEmail);
        $('html, body').animate({
        scrollTop: $(".loginPageContainer").offset().top
    }, 300);
  }
});
})






function setUserGroup(uid, userEmail)
{

//Do something to get device token, then store in users firebase profile.


var userID = uid;
var groupArray = [];
var userGroup = groupArray.toString();
var notificationStatus = 'YES';
var mealPlanGroupID = '';

var myDataRef = new Firebase('https://todofyp.firebaseio.com/');
      var listRef = myDataRef.child("users");
      var groupRef = listRef.child(userID);
      $(document).ready(function(){
        groupRef.set({groupID: userGroup, Name: userName, Email: userEmail, deviceToken: deviceToken, notificationStatus: notificationStatus, mealPlanGroupID: mealPlanGroupID});
      })
}





//Cordova Only
//Update user account with their device token
function setDeviceToken(uid)
{
  var myDetails = userID;
//  var newGroupName = document.getElementById('createGroup').value;
  var ref = new Firebase('https://todofyp.firebaseio.com/users/' + myDetails);
  var newGroup = groupString + ',' + newGroupName;
  ref.child('deviceToken').set(deviceToken);
  alert('Device Token saved');


}


$("#registerSectionButton").click(function() {
    $('html, body').animate({
        scrollTop: $(".registerSection").offset().top
    }, 300);
});