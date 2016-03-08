

var userGroup = '';
var groupID = '';
var myDataRef = new Firebase('https://todofyp.firebaseio.com/' + 'listItems/');
var userID = '';
var itemTrigger = 0;


if(localStorage.getItem('groupID') !== null || localStorage.getItem('groupID') !== 0)
{
  groupID = localStorage.getItem('groupID');
  console.log('Your Group: ' + groupID);
  changeGroup(groupID);
  }

//Login 
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
    ref45.unauth();
    window.location.href = "https://todofyp.firebaseapp.com/login.html";
}

// Register the callback to be fired every time auth state changes
var ref45 = new Firebase("https://todofyp.firebaseio.com");
ref45.onAuth(authDataCallback);






//notificaiton - website
function getNotifications(groupNots, notificationCount)
{

var group = groupNots;


      var myNotRef = new Firebase(myDataRef + '/' + group);
      myNotRef.once("value", function(snapshot) {
        // The callback function will get called twice, once for "fred" and once for "barney"
        snapshot.forEach(function(childSnapshot) {
          // key will be "fred" the first time and "barney" the second time
          var key = childSnapshot.key();
          // childData will be the actual contents of the child
          var childData = childSnapshot.val();
          var timeAdded = childData.time;
          var userRef = new Firebase('https://todofyp.firebaseio.com/presence/' + userID)
          userRef.on('value', function(snapshot) {
        if (snapshot.val() < timeAdded) {
          console.log('you have a new notification');
          notificationCount++;
          console.log(notificationCount);
          document.getElementById('notificationDesktop').innerHTML = '<div class="notificationCountIcon">' + notificationCount + '</div>';
          document.getElementById('notificationPanel').innerHTML += '<div class="notificationAlert">New item added to: ' + group + '</div>';

    }
  })
        });
      });


}






//






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






















// get groups
function getSubscribedGroups(userID)
{
var notificationCount = 0;
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

    getNotifications(groupArray[i], notificationCount);

  }
    

   

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});



}















function changeGroup(groupDiv)
{
    localStorage.setItem('groupID', groupDiv);
    console.log('group switched to ' + groupDiv);
    userGroup = groupDiv;
    document.getElementById('groupHeader').innerHTML = groupDiv;
    getUsersInGroup(userGroup);
    spyItem();
}





      function addItem(e)
      {
        if (e.keyCode == 13) 
        {
            updateGroupSelected();
        }
      }


function updateGroupSelected()
{

      console.log('Your Group2: ' + userGroup);
      var groupRef = new Firebase(myDataRef + '/' + userGroup);
      console.log('groupRef: ' + groupRef);
          var name = userDisplayName;
          var text = $('#messageInput').val();
          var defaultStatus = 'nrl';
          if(text != '')
          {
          var currentTime = Firebase.ServerValue.TIMESTAMP;
          groupRef.push({name: name, text: text, groupID: userGroup, status: defaultStatus, time: currentTime}, onComplete);
          console.log('Item Added: ' + text);
          text = '';
          $('#messageInput').val('');
          }
spyItem();
}



function onComplete()
{
  console.log('SAVED IN DB');
}


    
      


function spyItem()
{

        document.getElementById('listItems').innerHTML = "";
        var myRef = new Firebase(myDataRef + '/' + userGroup);
        myRef.on('child_added', function(snapshot) {

            console.log('item added to ' + userGroup);
            var message = snapshot.val();
            var key = snapshot.key();
            displayChatMessage(message.name, message.text, message.status, key);
            ItemsAddedByOthers(message.time, message.text, key);
           // urgentIcon(message.name, message.text, message.status, key);
          });

        if(itemTrigger != 1)
        {
           myRef.on('child_removed', function(snapshot) {
        var message = snapshot.val();
        var key = snapshot.key();
        removeListItemUI(message.name, message.text, key);
       });
         }

            
        }




function displayChatMessage(name, text, status, key) {
        $('<div/>').prepend($('<div class="listItem" onMouseDown="removeListItemDB(this.id)" id="'+ key +'">').text(text)).appendTo($('.listItems'));
        $('.listItems')[0].scrollTop = $('.listItems')[0].scrollHeight;
        $('</div>').text();


          if(status == 'urg')
          {
             $('#' + key).append('<div class="urgentIcon"></div>');
          }

      }













      // remove item from db and listItems
      function removeListItemUI(name, text, key)
      {

       // $('.listItem').child(text).remove();
       console.log('key: ' + key);
        console.log('item removed: ' + text);
        $( "#" + key ).css( "text-decoration", "line-through" );
        $( "#" + key ).css( "opacity", "0.6" );
      }




            function removeListItemDB(id)
      {
        if(itemTrigger == 1)
        {
          setItemUrgent(id);
        }
        else
          {
        console.log(userGroup + " --V-- " + id);
        var deleteRef = new Firebase("https://todofyp.firebaseio.com/listItems/" + userGroup + "/" + id);
        deleteRef.remove();
          }
      }


function setTrigger()
{

  if(itemTrigger == 1)
  {
    itemTrigger = 0;
  $('.urgentBtn').css('border', '1px solid #d64841');
  }
  else
  {
  itemTrigger = 1;
  $('.urgentBtn').css('border', '2px solid #d64841');
  }

}

function setItemUrgent(id)
{

  var setStatusRef = new Firebase("https://todofyp.firebaseio.com/listItems/" + userGroup + "/" + id);
  setStatusRef.update({ status: 'urg'}, onFinish);
}


function onFinish()
{
  console.log('item set to Urgent');
}





      //alert user when item set to urgent

 //alert user when item set to urgent
 

 // Attach an asynchronous callback to read the data at our posts reference
 myDataRef.on("child_changed", function(snapshot) {
   var itemStatus = snapshot.key();
   if (groupString.indexOf(itemStatus) >= 0)
 {
  var groupUrgentRef = new Firebase('https://todofyp.firebaseio.com/listItems/' + itemStatus);
  groupUrgentRef.once("child_changed", function(snapshot) {
   var itemStatus = snapshot.val();
   var key = snapshot.key();
   var hitmebaby = itemStatus.status;
   if(hitmebaby != 'nrl')
   {
       $('#' + key).append('<div class="urgentIcon"></div>');
 }
 })
   }
 }, function (errorObject) {
   console.log("The read failed: " + errorObject.code);
 });






 //items added while offline

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













function createGroup()
{
  var myDetails = userID;
  var newGroupName = document.getElementById('createGroup').value;
  var ref = new Firebase('https://todofyp.firebaseio.com/users/' + myDetails);
  var newGroup = groupString + ',' + newGroupName;
  ref.child('groupID').set(newGroup);

/*
  var createGroupNotificationRef = new Firebase('https://todofyp.firebaseio.com/users/' + myDetails + '/' + 'notificationSubscription/' + newGroupName);
  createGroupNotificationRef.push({'groupID': newGroupName, 'recievePush': 'YES'}, completeSuc);
*/
}

/*
function completeSuc()
{
  console.log('noti created');
}
*/

function createGroupDesktop()
{
  var myDetails = userID;
  var newGroupName = document.getElementById('createGroupDesktop').value;
  var ref = new Firebase('https://todofyp.firebaseio.com/users/' + myDetails);
  var newGroup = groupString + ',' + newGroupName;
  ref.child('groupID').set(newGroup);

}



 $('.createGroup').keypress(function (e) {
        if (e.keyCode == 13) {
            createGroup();
            $('#createGroup').val('');
}
});

  $('.createGroupDesktop').keypress(function (e) {
        if (e.keyCode == 13) {
            createGroupDesktop();
            $('#createGroupDesktop').val('');
}
});





    function getUsersInGroup(userGroup)
    {
    document.getElementById('usersInGroup').innerHTML = '';
    var ref28 = new Firebase("https://todofyp.firebaseio.com/users/");
    ref28.on("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
    var usersInGroup = childSnapshot.val();
    var userGroupInGroup = usersInGroup.groupID;
    var userNameInGroup = usersInGroup.Name;
    var usersInGroupArray = userGroupInGroup.split(",");
    //for each user in the group
    for(var i = 0; i < usersInGroupArray.length; i++)
    {
      if(usersInGroupArray[i] == userGroup)
      {
        console.log(userNameInGroup + ' is in your group');
        document.getElementById('usersInGroup').innerHTML += '<div class="userInGroupIcon"><div class="userOffline"></div>' + userNameInGroup + '<div class="toggleNotificstions"></div>' + '</div>';
      }
    }
   })
 });

}




