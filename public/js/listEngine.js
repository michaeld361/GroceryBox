
var user = 0;
var userID = "";
var output;
var groupID = 0;
var myName = '';
var myGroups = '';
var groupString = '';
var userDisplayName = '';


// Create a callback which logs the current auth state

function authDataCallback(authData) {
  if(authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
    user = authData.uid
    userID = user.toString();
    getUserDetails(userID);
    getSubscribedGroups(userID);
  } else {
    console.log("User is logged out");
    window.location.href = "https://todofyp.firebaseapp.com/login.html";
  }
}

function logout()
{
    ref.unauth();
    window.location.href = "https://todofyp.firebaseapp.com/login.html";
}



// Register the callback to be fired every time auth state changes
var ref = new Firebase("https://todofyp.firebaseio.com");
ref.onAuth(authDataCallback);



function getUserDetails(userID)
{
var myDetails = userID;
 var ref = new Firebase('https://todofyp.firebaseio.com/users/' + myDetails);
// Attach an asynchronous callback to read the data at our posts reference
ref.on("value", function(snapshot) {
  myName = snapshot.val();
  userDisplayName = myName.Name;
  document.getElementById('userTitle').innerHTML = myName.Name;


}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});


}

function getSubscribedGroups(userID)
{

var windowWidth = $(window).width();
var myDetails = userID;
 var ref = new Firebase('https://todofyp.firebaseio.com/users/' + myDetails);
// Attach an asynchronous callback to read the data at our posts reference
ref.on("value", function(snapshot) {
  myGroups = snapshot.val();
  groupString = myGroups.groupID;
  document.getElementById('groupList').innerHTML = "";
  document.getElementById('groupListDesktop').innerHTML = "";
  var groupArray = groupString.split(",");
  console.log(groupArray);


   for(var i = 0; i < groupArray.length; i++)
  {
    console.log(groupArray[i]);

    $('<div/>').prepend($('<div class="groupName" id="'+ groupArray[i] +'" onclick="changeGroup(this.id);">').text(groupArray[i])).appendTo($('#groupList'));
    //$('.groupContainer').html($('<div class="groupName">').text(groupName));
    $('<div/>').prepend($('<div class="groupName" id="'+ groupArray[i] +'" onclick="changeGroup(this.id);">').text(groupArray[i])).appendTo($('#groupListDesktop'));

  }

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

}

function changeGroup(id)
{
    localStorage.setItem('groupID', id);
    window.location.href = "https://todofyp.firebaseapp.com";
}

function createGroup()
{
  var myDetails = userID;
  var newGroupName = document.getElementById('createGroup').value;
  var ref = new Firebase('https://todofyp.firebaseio.com/users/' + myDetails);
  var newGroup = groupString + ',' + newGroupName;
  ref.child('groupID').set(newGroup);
  alert('group added');


}





/*
var refTwo = new Firebase("https://todofyp.firebaseio.com/users/" + userID);
// Attach an asynchronous callback to read the data at our posts reference
refTwo.on("value", function(snapshot) {
  output = snapshot.val();
  groupID = output.groupID;
  localStorage.setItem('groupID', groupID);
  console.log(groupID);
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
*/



if(localStorage.getItem('groupID') !== null || localStorage.getItem('groupID') !== 0)
{
  groupID = localStorage.getItem('groupID');
  console.log('bro: ' + groupID);
  document.getElementById('groupHeader').innerHTML = groupID;
}



    // var userGroup = groupID.toString();


     if(groupID != 0)
     {
      var userGroup = groupID.toString();
      var myDataRef = new Firebase('https://todofyp.firebaseio.com/');
      var listRef = myDataRef.child("listItems");
      var groupRef = listRef.child(userGroup);
      var defaultStatus = 'nrl';
      $('#messageInput').keypress(function (e) {
        if (e.keyCode == 13) {
          
          var name = userDisplayName;
          var text = $('#messageInput').val();
          var currentTime = Firebase.ServerValue.TIMESTAMP;
          groupRef.push({name: name, text: text, groupID: userGroup, status: defaultStatus, time: currentTime});
          $('#messageInput').val('');
        }
      });
      groupRef.on('child_added', function(snapshot) {
        var message = snapshot.val();
        var key = snapshot.key();
        displayChatMessage(message.name, message.text, key);
        ItemsAddedByOthers(message.time, message.text, key);
      });




 groupRef.on('child_removed', function(snapshot) {
        var message = snapshot.val();
        var key = snapshot.key();
        removeListItemUI(message.name, message.text, key);
 });





      function displayChatMessage(name, text, key) {
        $('<div/>').prepend($('<div class="listItem" onMouseDown="removeListItemDB(this.id)" id="'+ key +'">').text(text)).appendTo($('.listItems'));
        $('.listItems')[0].scrollTop = $('.listItems')[0].scrollHeight;
        $('</div>').text();
      };

      function removeListItemUI(name, text, key)
      {
       // $('.listItem').child(text).remove();
       console.log('key: ' + key);
        console.log('item removed: ' + text);
        $( "#" + key ).css( "text-decoration", "line-through" );
        $( "#" + key ).css( "opacity", "0.6" );
      }


      
function doubletap(id) {

//$("#" + id).on("tap",function(){


      console.log(userGroup + " --V-- " + id);
        var deleteRef = new Firebase("https://todofyp.firebaseio.com/listItems/" + userGroup + "/" + id);
        deleteRef.remove();


//});
}








            function removeListItemDB(id)
      {

 doubletap(id);

}





var amOnline = new Firebase('https://todofyp.firebaseio.com/.info/connected');
var userRef = new Firebase('https://todofyp.firebaseio.com/presence/' + userID);
amOnline.on('value', function(snapshot) {
  if (snapshot.val()) {
    userRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
    //userRef.set(true);
  }
});


function ItemsAddedByOthers(timeAdded, text, key)
{
  var timeOfAdd = timeAdded;
    var yourMessage = text;
    var itemID = key;
 // alert(timeOfAdd + " -- " + yourMessage);
var userRef = new Firebase('https://todofyp.firebaseio.com/presence/' + userID);
userRef.on('value', function(snapshot) {
  if (snapshot.val() < timeOfAdd) {
    // User is online, update UI.

    document.getElementById(key).innerHTML += '<div class="newIcon">Recently Added</div>';



    //alert('Newly Added: ' + yourMessage);
  } else {
    // User logged off at snapshot.val() - seconds since epoch.
  }
});


}



 $('#createGroup').keypress(function (e) {
        if (e.keyCode == 13) {
            createGroup();
            $('#createGroup').val('');
}
})
}







