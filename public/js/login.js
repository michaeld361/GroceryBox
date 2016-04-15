
var userEmail = '';
var userName = '';
var deviceToken = '';
var userInitials = '';
var uid = 0;


//login seciton

$('.loginBtn').click(function(){
  var ref = new Firebase("https://todofyp.firebaseio.com");
  var loginEmail = document.getElementById('loginEmail').value;
  var loginPass = document.getElementById('loginPass').value;

ref.authWithPassword({
  email    : loginEmail,
  password : loginPass
}, authHandler);
});



//Login with Google
$('#loginGoogle').click(function(){
var ref = new Firebase("https://todofyp.firebaseio.com");
ref.authWithOAuthPopup("google", function(error, authData) 
{ 
  if (error) {
    console.log("Login Failed!", error);
  } else {
    var findUser = new Firebase("https://todofyp.firebaseio.com/users/" + authData.uid);
    findUser.on("value", function(snapshot) {
      var doesUserExist = snapshot.exists();
      
      if(doesUserExist)
      {
        window.location.href = "https://todofyp.firebaseapp.com/";
      }
      else
      {
        userName = authData.google.displayName;
        setUserGroupGoogleAuth(authData.uid, authData.google.email);
      }
    })


  }

}, {
  remember: "default",
  scope: "email"
});
});





// Create a callback to handle the result of the authentication

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



function setUserGroupGoogleAuth(uid, userEmail)
{
//get initials
  var initials = userName.match(/\b(\w)/g);
var userInitials = initials.join('');


        var userID = uid;
      var groupArray = [];
      var userGroup = groupArray.toString();
      var notificationStatus = 'YES';
      var mealPlanGroupID = '';
      var disabledNotifications = "";
      var myDataRef = new Firebase('https://todofyp.firebaseio.com/');
      var listRef = myDataRef.child("users");
      var groupRef = listRef.child(userID);
      $(document).ready(function(){
        groupRef.set({groupID: userGroup, Name: userName, initials: userInitials, Email: userEmail, deviceToken: deviceToken, notificationStatus: notificationStatus, disabledNotifications : disabledNotifications, mealPlanGroupID: mealPlanGroupID});
         window.location.href = "https://todofyp.firebaseapp.com/";
      })
}



function setUserGroup(uid, userEmail)
{

//get initials
var initials = userName.match(/\b(\w)/g);
var userInitials = initials.join('');

var userID = uid;
var groupArray = [];
var userGroup = groupArray.toString();
var notificationStatus = 'YES';
var mealPlanGroupID = '';
var disabledNotifications = "";
var myDataRef = new Firebase('https://todofyp.firebaseio.com/');
      var listRef = myDataRef.child("users");
      var groupRef = listRef.child(userID);
      $(document).ready(function(){
        groupRef.set({groupID: userGroup, Name: userName, initials: userInitials, Email: userEmail, deviceToken: deviceToken, notificationStatus: notificationStatus, disabledNotifications : disabledNotifications, mealPlanGroupID: mealPlanGroupID});
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