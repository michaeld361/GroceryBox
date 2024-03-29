

var userGroup = '';
var groupID = '';
var myDataRef = new Firebase('https://todofyp.firebaseio.com/' + 'listItems/');
var userID = '';
var itemTrigger = 0;
var groupArray = [];
var randomKey = '';
var recipeConstruct = [];
var nextRecipe = 0;
var nextRecipeMobile = 0;
var recipeData = '';
var recipeDataMobile = '';
var groupString = '';
var urlCount = 0;
var notifyUserPanel = 0;
var userInitials = '';
var isGuest = 0;
var commitalCount = 0;
//Login 
function authDataCallback(authData) {
  if(authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
    user = authData.uid
    userID = user.toString();
    getUserDetails(userID);
    getSubscribedGroups(userID);
  } else {
    var groupLink = getURLGroupID()["groupID"];
    if(groupLink == '' || groupLink == undefined)
{
    window.location.href = "https://todofyp.firebaseapp.com/login.html";
}
else if(groupLink != '' || groupLink != undefined)
{
  userID = 'Guest User';
  var cleansedGroupID = groupLink.replace("%20", " ");
  isGuest = 1;
  groupID = cleansedGroupID;
  changeGroup(groupID);

  if(isGuest == 1)
{
  $('.userIcon').css('opacity', '0.2');
  $('#mealPlanner').css('opacity', '0.2'); 
  $('#notificationDesktop').css('opacity', '0.2');    
  $('#settingsIcon').css('opacity', '0.2');
  $('.groupContainerTitle').css('opacity', '0.2');
  $('.createGroupContainer').css('opacity', '0.2');
  $('#userControls').css('display', 'none');
}
}

  }
}

if(localStorage.getItem('groupID') !== null || localStorage.getItem('groupID') !== 0)
{
  groupID = localStorage.getItem('groupID');
  console.log('Your Group: ' + groupID);
  changeGroup(groupID);
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
        snapshot.forEach(function(childSnapshot) {
        
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
  groupString = myName.groupID;
  userInitials = myName.initials;
  document.getElementById('avatar').innerHTML = userInitials;
  document.getElementById('userTitle').innerHTML = myName.Name;
  document.getElementById('profilePanelName').innerHTML = myName.Name;
  document.getElementById('profilePanelEmail').innerHTML = myName.Email;

getGroupByLink(userID);

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
  groupArray = groupString.split(",");
  console.log(groupArray);


   for(var i = 0; i < groupArray.length; i++)
  {
    console.log(groupArray[i]);
    //var removeIDString = groupArray[i].indexOf("----ID----");
    var splitGroupID = groupArray[i].split("----ID----")[0];
    console.log(splitGroupID);
    $('<div/>').prepend($('<div class="groupName" id="'+ groupArray[i] +'" onclick="changeGroup(this.id);">').text(splitGroupID)).appendTo($('#groupList'));
    //$('.groupContainer').html($('<div class="groupName">').text(groupName));
    $('<div/>').prepend($('<div class="groupName" id="'+ groupArray[i] +'" onclick="changeGroup(this.id);">').text(splitGroupID)).appendTo($('#groupListDesktop'));

    getNotifications(groupArray[i], notificationCount);
  }
    

   

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
}









function changeGroup(groupDiv)
{
  commitalCount = 0;
  itemTrigger = 0;
  $('.urgentBtn').css('border', '1px solid #d64841');
  notifyUserPanel = 0;
  document.getElementById('notifierContainer').innerHTML = ""
      document.getElementById('usersInGroup').innerHTML = "";
recipeConstruct = [];
    nextRecipe = 0;
    recipeData = '';
    localStorage.setItem('groupID', groupDiv);
    console.log('group switched to ' + groupDiv);
    userGroup = groupDiv;
    var splitGroupID = groupDiv.split("----ID----")[0];
    document.getElementById('groupHeader').innerHTML = splitGroupID;
    if($(window).width() < 750)
    {
    document.getElementById('pageTitle').innerHTML = splitGroupID;
    }
    getUsersInGroup(userGroup);
    console.log('groupME: ' + splitGroupID);
    groupID = groupDiv;
    spyItem();
}





      function addItem(e)
      {
        if (e.keyCode == 13) 
        {
          var text = $('#messageInput').val();
          if(text == " ")
          {
            //Do nothing
          }
          else
          {
            updateGroupSelected();
          }
        }
      }


function updateGroupSelected()
{

      console.log('Your Group2: ' + userGroup);
      var groupRef = new Firebase(myDataRef + '/' + userGroup);
      console.log('groupRef: ' + groupRef);
          var name = userInitials;
          var text = $('#messageInput').val();
          var defaultStatus = 'nrl';
          var commitalStatus = '';
          if(text != '')
          {
          var currentTime = Firebase.ServerValue.TIMESTAMP;
          groupRef.push({name: name, text: text, groupID: userGroup, status: defaultStatus,commitalStatus: commitalStatus, time: currentTime}, onComplete(groupRef));
          console.log('Item Added: ' + text);
          text = '';
          $('#messageInput').val('');
          }
spyItem();
}



function onComplete(groupRef)
{
  console.log('SAVED IN DB');
  groupRef.off();
}


    
      


function spyItem()
{

        document.getElementById('commitToItems').innerHTML = "";
        document.getElementById('remainingItems').innerHTML = "";
        var myRef = new Firebase(myDataRef + '/' + userGroup);
        myRef.on('child_added', function(snapshot) {
            console.log('item added to ' + userGroup);
            var message = snapshot.val();
            var key = snapshot.key();
            var userInitials = message.name;
            var priorityStatus = message.status;
            var committed = message.commitalStatus;
            displayChatMessage(message.name, userInitials, message.text, message.status, key, priorityStatus, committed);
            ItemsAddedByOthers(message.time, message.text, key, committed);
           // urgentIcon(message.name, message.text, message.status, key);
           recipeConstruct.push(message.text);
          },endSnapshot(myRef));

        if(itemTrigger != 1)
        {
           myRef.on('child_removed', function(snapshot) {
        var message = snapshot.val();
        var key = snapshot.key();
        removeListItemUI(message.name, message.text, key);
        undoChange(snapshot);
       });
         }
        }


function endSnapshot(myRef)
{

  $('.groupName').click(function(){
  var groupDiv = this.id;

  myRef.off('child_added');
  console.log('it is off!');
  changeGroup(groupDiv);

  //spyItem();
    });
}

function commitToItem(itemID)
{
   var r = confirm("Commit to buying this item");
    if (r == true) 
    { 
      var setStatusRef = new Firebase("https://todofyp.firebaseio.com/listItems/" + userGroup + "/" + itemID);
      setStatusRef.update({ commitalStatus: userInitials}, onFinish);
    }
  else {
        console.log('you are still in the group');
    }
}



function displayChatMessage(name, userInitials, text, status, key, priorityStatus, committed) {


  var lineThrough = $('#' + key).css('text-decoration');

        if(priorityStatus == 'urg' && committed == 'none')
        {
              commitalCount += 1;
            $('<div/>').prepend($('<div class="listItem" onMouseDown="commitToItem(this.id);" id="'+ key +'">').text(text)).prependTo($('#commitToItems'));
            $('#commitToItems')[0].scrollTop = $('#commitToItems')[0].scrollHeight;
            $('</div>').text();
        }
        else
        {
 
            $('<div/>').prepend($('<div class="listItem" onMouseDown="removeListItemDB(this.id)" id="'+ key +'">').text(text)).appendTo($('#remainingItems'));
            $('#remainingItems')[0].scrollTop = $('#remainingItems')[0].scrollHeight;
            $('</div>').text();
        }

        //if (lineThrough != 'line-through')
       // {
          if(status == 'urg')
          {
             $('#' + key).append('<div class="urgentIcon"></div>');
             //$('#' + key).prepend('<div class="addedByUser">' + userInitials + '</div>');
          }

          if(committed != "" && committed != "none")
          {
            $('#' + key).prepend('<div class="addedByUser">' + committed + '</div>');
          }
       // }
      //  else
      //  {
      //    alert('item marked as Urgent already');
       // }
       determineBreakerBar();
      }



function determineBreakerBar()
{
        if(commitalCount == 0)
        {
              $('.breakerBar').css('display', 'none');
              $('#commitalItems').css('display', 'none');
        }
        else
        {
              $('.breakerBar').css('display', 'block');
              $('#commitalItems').css('display', 'block');
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

      if(notifyUserPanel != 1)
    {
      notifyUserPanel = 1;
      lightbox3();
    }
  console.log(notifyUserPanel + " notifyer");

}

function setItemUrgent(id)
{

  var setStatusRef = new Firebase("https://todofyp.firebaseio.com/listItems/" + userGroup + "/" + id);
  setStatusRef.update({ status: 'urg', commitalStatus: 'none'}, onFinish);
}


function onFinish()
{
  console.log('item set to Urgent');
}




 // Attach an asynchronous callback to read the data at our posts reference
 myDataRef.on("child_changed", function(snapshot) {
   var itemStatus = snapshot.key();
   if (groupString.indexOf(itemStatus) >= 0)
 {
  var groupUrgentRef = new Firebase('https://todofyp.firebaseio.com/listItems/' + itemStatus);
  groupUrgentRef.once("child_changed", function(snapshot) {
   var itemStatus = snapshot.val();
   var key = snapshot.key();
   var mrkUrgent = itemStatus.status;
   if(mrkUrgent != 'nrl')
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

function ItemsAddedByOthers(timeAdded, text, key, committed)
{
  var timeOfAdd = timeAdded;
    var yourMessage = text;
    var itemID = key;
 // alert(timeOfAdd + " -- " + yourMessage);
var userRef = new Firebase('https://todofyp.firebaseio.com/presence/' + userID);
userRef.on('value', function(snapshot) {
  if (snapshot.val() < timeOfAdd) {
    // User is online, update UI.
    if(committed == "" || committed == "none")
    {
    document.getElementById(key).innerHTML += '<div class="newIcon">Recently Added</div>';
    }



    //alert('Newly Added: ' + yourMessage);
  } else {
    // User logged off at snapshot.val() - seconds since epoch.
  }
});


}













function createGroup()
{
  randomKey = "";

  var validationCount = 0;
  var myDetails = userID;
  var newGroupNameRaw = document.getElementById('createGroup').value;
  var newGroupName = newGroupNameRaw.replace(/[^a-zA-Z0-9 ]/g, "");
  if(newGroupName.length <= 16 && newGroupName.length >= 1 && newGroupName != '')
  {
  getRandomKey();
  newGroupName = newGroupName + "----ID----" + randomKey;
  var ref = new Firebase('https://todofyp.firebaseio.com/users/' + myDetails);
  var newGroup = groupString + ',' + newGroupName;
  ref.update({ groupID: newGroup});
  groupID = newGroupName;
  var splitGroupID = newGroupName.split("----ID----")[0];
  changeGroup(newGroupName);
  }
  else
  {
    alert('List names should be between 1 and 16 characters');
  }
}


function leaveGroup()
{
    var r = confirm("Are you sure you want to leave " + groupID);
    if (r == true) 
    {
        for(var i = 0; i < groupArray.length; i++)
        {
          if(groupArray[i] == groupID)
          {
          groupArray.splice(i, 1);
          var newGroup = groupArray.toString();
          var ref = new Firebase('https://todofyp.firebaseio.com/users/' + userID);
          ref.child('groupID').set(newGroup);
          alert('You Left ' + groupToLeave);
          }
        } 
}
  else {
        console.log('you are still in the group');
    }
}


function createGroupDesktop()
{
  randomKey = "";

  var validationCount = 0;
  var myDetails = userID;
  var newGroupNameRaw = document.getElementById('createGroupDesktop').value;
  var newGroupName = newGroupNameRaw.replace(/[^a-zA-Z0-9 ]/g, "");
  if(newGroupName.length <= 16 && newGroupName.length >= 1 && newGroupName != '')
  {
  getRandomKey();
  newGroupName = newGroupName + "----ID----" + randomKey;
  var ref = new Firebase('https://todofyp.firebaseio.com/users/' + myDetails);
  var newGroup = groupString + ',' + newGroupName;
  ref.update({ groupID: newGroup});
  groupID = newGroupName;
  var splitGroupID = newGroupName.split("----ID----")[0];
  changeGroup(newGroupName);
  }
  else
  {
    alert('List names should be between 1 and 16 characters');
  }
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

  $('#addGroupBtn').click(function() {
            createGroupDesktop();
            $('#createGroupDesktop').val('');
});




    function getUsersInGroup(userGroup)
    {
    document.getElementById('usersInGroup').innerHTML = '';
    var ref28 = new Firebase("https://todofyp.firebaseio.com/users/");
    ref28.once("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var userKey = childSnapshot.key();
    var usersInGroup = childSnapshot.val();
    var userGroupInGroup = usersInGroup.groupID;
    var userNameInGroup = usersInGroup.Name;
    var userInitials = usersInGroup.initials;
    var usersInGroupArray = userGroupInGroup.split(",");
    //for each user in the group
    for(var i = 0; i < usersInGroupArray.length; i++)
    {
      if(usersInGroupArray[i] == userGroup)
      {
        getNotificationSettings(usersInGroup, userKey);
        console.log(userNameInGroup + ' is in your group');
        document.getElementById('usersInGroup').innerHTML += '<div class="userInGroupIcon"><div class="userOffline"></div>' + userNameInGroup + '<div class="toggleNotificstions">' + userInitials + '</div>' + '</div>';
      }
    }
   })
 }, endGroupSnapshot(ref28));

}

function endGroupSnapshot(ref28)
{
  ref28.off('value');
  console.log('Group is off!');
}



function getNotificationSettings(usersInGroup, userKey)
{
  var deviceTokenForUser = usersInGroup.deviceToken;
  var username = usersInGroup.Name;
  var disabledGroup = usersInGroup.disabledNotifications;

  if(deviceTokenForUser == "")
  {
    document.getElementById('notifierContainer').innerHTML += '<div class="userSubjectContainer"><div class="userNotifierIcon greyedOut"></div><div class="userNotifierName">' + username + '</div><div class="userNotifierDevice">No Devices Registered</div></div>'
    $('.greyedOut').css('background-image','url("../img/notifierIconDisabled.png")');
  }
  else if(disabledGroup == groupID )
  {
        document.getElementById('notifierContainer').innerHTML += '<div class="userSubjectContainer"><div class="mobileNotiContainer"><div class="userNotifierName">' + username + '</div><div class="userNotifierDevice">Push Notification</div></div><div id="' + userKey + '" onclick="enableNotiStatus(this.id);" class="userNotifierDisable green">+</div></div>'
  }
  else
  {
        document.getElementById('notifierContainer').innerHTML += '<div class="userSubjectContainer"><div class="mobileNotiContainer"><div class="userNotifierName">' + username + '</div><div class="userNotifierDevice">Push Notification</div></div><div id="' + userKey + '" class="userNotifierDisable" onclick="changeNotiStatus(this.id);">X</div><div id="' + userKey + '" onclick="enableNotiStatus(this.id);" class="userNotifierEnable">+</div></div>'

  }
}

function changeNotiStatus(id)
{
  
//newGroupName = newGroupName + "----ID----" + randomKey;
  var ref = new Firebase('https://todofyp.firebaseio.com/users/' + id);
  ref.once("value", function(snapshot) {
  var usersDetails = snapshot.val();
  var userGroupString = usersDetails.disabledNotifications;
  //var userGroupArray = userGroupString.split(",");
    //var updatedGroup = userGroupArray.toString();
    ref.update({ disabledNotifications: groupID});
    $('.userNotifierDisable').css('display', 'none');
  $('.userNotifierEnable').fadeIn('fast');

});
}


function enableNotiStatus(id)
{
  
//newGroupName = newGroupName + "----ID----" + randomKey;
  var ref = new Firebase('https://todofyp.firebaseio.com/users/' + id);
  ref.once("value", function(snapshot) {
  var usersDetails = snapshot.val();
  var userGroupString = usersDetails.disabledNotifications;
  //var userGroupArray = userGroupString.split(",");
    //var updatedGroup = userGroupArray.toString();
    ref.update({ disabledNotifications: " "});
    $('.userNotifierEnable').css('display', 'none');
  $('.userNotifierDisable').fadeIn('fast');

});
}





$('#mealPlanner').click(function() {
    $('.mealPlanningPanel').slideToggle('fast');
    $('#lightsOut').fadeToggle('fast');
    //$('.profilePanel').slideUp('fast');
    getDayofWeek();
});



//Meal Plan Tab
var showMealPlanPage = document.getElementById('mealPlanTab');
showMealPlanPage.addEventListener('touchend', showMealPlanTab, false);
showMealPlanPage.addEventListener('click', showMealPlanTab, false);
showMealPlanPage.addEventListener('touchstart', function(e){ e.preventDefault(); }, false);

function showMealPlanTab()
{
      $('.wrap, #profileTab').removeClass('active2');
      $('.mealPlanningPanel').slideDown('fast');
      //$('.profilePanel').slideUp('fast');
      $('#lightsOut').fadeOut('fast');
      $('#pageTitle').html('Meal Plan');
      getDayofWeek();
}

//Meal Plan Tab
var showaddUser = document.getElementById('addUserMobile');
showaddUser.addEventListener('touchend', showAddUser, false);
showaddUser.addEventListener('click', showAddUser, false);
showaddUser.addEventListener('touchstart', function(e){ e.preventDefault(); }, false);

function showAddUser()
{
      $('.wrap, #profileTab').removeClass('active2');
      $('#addUserPanel').slideDown('fast');
      //$('.profilePanel').slideUp('fast');
      $('#lightsOut').fadeOut('fast');
      $('#pageTitle').html('Add User');
}


$('.userIcon').click(function(){
        $('.wrap, #profileTab').toggleClass('active2');
        $('#lightsOut').fadeToggle('fast');
});

//Profile Tab
var showProfilePage = document.getElementById('profileTab');
showProfilePage.addEventListener('touchend', showProfileTab, false);
showProfilePage.addEventListener('click', showProfileTab, false);
showProfilePage.addEventListener('touchstart', function(e){ e.preventDefault(); }, false);


var showRecipePage = document.getElementById('recipeTab');
showRecipePage.addEventListener('touchend', showRecipeTab, false);
showRecipePage.addEventListener('click', showRecipeTab, false);
showRecipePage.addEventListener('touchstart', function(e){ e.preventDefault(); }, false);


function showProfileTab()
{
      //$('.profilePanel').slideToggle('fast');
      $('#lightsOut').fadeToggle('fast');
      $('#addUserPanel').slideUp('fast');
      $('.mealPlanningPanel').slideUp('fast');
      $('#pageTitle').html('My Profile');

  
  $('.wrap, #profileTab').toggleClass('active2');


}

function showRecipeTab()
{
      //$('.profilePanel').slideToggle('fast');
      $('#lightsOut').fadeToggle('fast');
      $('.mealPlanningPanel').slideUp('fast');
      $('#addUserPanel').slideUp('fast');
      $('#pageTitle').html('Recipe Inspiration');

  
  $('.recipeWrap, #recipeTab').toggleClass('active2');


}





//List Tab
var showListPage = document.getElementById('listTab');
showListPage.addEventListener('touchend', showListTab, false);
showListPage.addEventListener('click', showListTab, false);
showListPage.addEventListener('touchstart', function(e){ e.preventDefault(); }, false);

function showListTab()
{
      $('.wrap, #profileTab').removeClass('active2');
      $('.profilePanel').slideUp('fast');
      $('#addUserPanel').slideUp('fast');
      $('.mealPlanningPanel').slideUp('fast');
      $('#lightsOut').fadeOut('fast');
      var splitGroupID = groupID.split("----ID----")[0];
      $('#pageTitle').html(splitGroupID);
}

function createMealPlan()
{

    getRandomKey();
    
    console.log(randomKey + ' ---haha loool');

var userRef = new Firebase('https://todofyp.firebaseio.com/users/' + userID)
          userRef.on('value', function(snapshot) {

            var userDetails = snapshot.val();
            var userMealPleanQuery = userDetails.mealPlanGroupID;
if(userMealPleanQuery != '')
{
  console.log('user has a meal plan');
  randomKey = userMealPleanQuery;
  getExistingMealPlan(randomKey);
}
else
{
  console.log('user does not have a meal plan');
var newPlanName = document.getElementById('mealPlanName').value;
$('#mealPlanName').css('display', 'none');
$('#createMealPlanBtn').css('display', 'none');

var mealPlanRef = new Firebase('https://todofyp.firebaseio.com/' + 'mealPlan/');
 mealPlanRef.push({name: newPlanName, admin: userID}, onSuccess);
}
});


}




function getMealPlan(buttonID)
{
  document.getElementById('mealPlan').innerHTML = '';
 // var mealPlanID = '-KC_blv7etV_jhbwqPI9';
  //console.log(mealPlanID);
  //var myMeal = mealPlanID;
//  console.log('my meal: ' + myMeal);
//  var mealPlanString = myMeal.toString();
  var whichDay = 'monday';
if(buttonID == 'mondayBtn')
{
whichDay = 'monday';
}
if(buttonID == 'tuesdayBtn')
{
whichDay = 'tuesday';
}
if(buttonID == 'wednesdayBtn')
{
whichDay = 'wednesday';
}
if(buttonID == 'thursdayBtn')
{
whichDay = 'thursday';
}
if(buttonID == 'fridayBtn')
{
whichDay = 'friday';
}
if(buttonID == 'saturdayBtn')
{
whichDay = 'saturday';
}
if(buttonID == 'sundayBtn')
{
whichDay = 'sunday';
}


    console.log(randomKey + ' RandomKey');
      var mealPlanRef = new Firebase('https://todofyp.firebaseio.com/mealPlan');
      var mealPlanGroupRef = mealPlanRef.child(randomKey);
       console.log('key 424: ' + mealPlanGroupRef.key());
       var mealPlanGroupID2 = mealPlanGroupRef.key();
       mealPlanForUser(mealPlanGroupID2);
        var dayRef = mealPlanGroupRef.child(whichDay);
          var name = userDisplayName;
          var text = $('#' + whichDay + 'Input').val();
          if(text != '')
          {
          var currentTime = Firebase.ServerValue.TIMESTAMP;
          dayRef.push({name: name, text: text, time: currentTime});
          console.log('Item Added: ' + text);
          $('#messageInput').val('');
          }

          document.getElementById(whichDay + 'PlanItems').innerHTML = '';
                mealPlanGroupRef.on('child_added', function(snapshot) {
                  console.log('child snap: ' + snapshot.key());
                  var dayToAppend = snapshot.key();
                  document.getElementById(dayToAppend + 'PlanItems').innerHTML = '';
                  snapshot.forEach(function(childSnapshot) {
                  var message = childSnapshot.val();
                  var key = childSnapshot.key();
                  console.log(key + ' -- ' + message.text);
                  displayMealPlan(message.name, message.text, dayToAppend);
          });
});

                
}


function getExistingMealPlan(randomKey)
{

    //document.getElementById(whichDay + 'PlanItems').innerHTML = '';
          var mealPlanRef = new Firebase('https://todofyp.firebaseio.com/mealPlan');
      var mealPlanGroupRef = mealPlanRef.child(randomKey);
                mealPlanGroupRef.on('value', function(snapshot) {
                  console.log('child snap: ' + snapshot.key());
                  snapshot.forEach(function(childSnapshot) {
                  var message = childSnapshot.val();
                  var key = childSnapshot.key();
                  var dayToAppend = childSnapshot.key();
                  console.log(key + ' -- ' + message.text);
                  displayMealPlan(message.name, message.text, dayToAppend);
          });
});
}



/*
function tuesdayPlan(mealPlanID)
{
        var mealPlanRef = new Firebase('https://todofyp.firebaseio.com/' + 'mealPlan/' + '/' + mealPlanID + '/tue');

            mealPlanRef.on('child_added', function(snapshot) {
            var message = snapshot.val();
            var key = snapshot.key();
            displayMealPlan(message.name, key);

          });

            wednesdayPlan(mealPlanID);
}

function wednesdayPlan(mealPlanID)
{
        var mealPlanRef = new Firebase('https://todofyp.firebaseio.com/' + 'mealPlan/' + '/' + mealPlanID + '/wed');

            mealPlanRef.on('child_added', function(snapshot) {
            var message = snapshot.val();
            var key = snapshot.key();
            displayMealPlan(message.name, key);

          });
}

*/









function displayMealPlan(name, text, dayToAppend) {

        $('<div/>').prepend($('<div class="mealItem">').text(text)).appendTo($('#' + dayToAppend + ' .mealPlanItems'));
        $('#mealPlan')[0].scrollTop = $('#mealPlan')[0].scrollHeight;
        $('</div>').text();

      }


function onSuccess()
{
  console.log('group created succcessfully');
}




function mealPlanForUser(mealPlanGroup)
{
  var setStatusRef = new Firebase("https://todofyp.firebaseio.com/users/" + userID);
  setStatusRef.update({ mealPlanGroupID: mealPlanGroup}, onSuccess);
}

function onSuccess()
{
  console.log('user mealplan saved');
}



function getRandomKey()
{

  var array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4','5','6','7','8','9','0','!','*','£'];

  for(var i = 0; i < 15; i++) { randomKey = randomKey + array[Math.floor(Math.random() * 40)]; }
    console.log(randomKey);
}




function getDayofWeek()
{

  var weeklyDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    var d = new Date();
    var n = d.getDay()
    //console.log('Todays Day: ' + weeklyDays[n]);
    var Day = weeklyDays[n];


    $('#' + Day).ready(function(){
      $('#' + Day).css('color', '#3a3a3a');
      $('#' + Day).css('opacity', '1.0');
    })

}







function addUser()
{
var userAdded = 0;

var checkEmail = document.getElementById('addUserTextBox').value;
if(checkEmail == "")
{
  checkEmail = document.getElementById('addUserEmailMobile').value;
}

if(checkEmail != '')
{
  var emailConfirmed = 'no';
    var myDataRef2 = new Firebase('https://todofyp.firebaseio.com/users');
      myDataRef2.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        
          
          var childData = childSnapshot.val();
          var userEmail = childData.Email;


          if(checkEmail == userEmail)
          {
          var userAddKey = childSnapshot.key();
          var userAddGroup = childData.groupID;
            console.log('found an email match: ' + userEmail);
            console.log('add user key: ' + userAddKey);
                  var newUserRef = myDataRef2.child(userAddKey);
                  var newGroup = userAddGroup + ',' + groupID;
                  //newUserRef.child('groupID').update(newGroup);
                  newUserRef.update({ groupID: newGroup});
                  console.log('user is now in group');
                  document.getElementById('addUserBtn2').onclick = function() { closeCurrentLightbox(); }
                  document.getElementById('addUserBtn2').innerHTML = "Back to List";
                  document.getElementById('addUserEmailDesc').innerHTML = "Member added to your list";
                  $('#addUserTextBox').css('display', 'none');
          }
          else
          {

            console.log('No user found');
          }
        });
      });
}

}



function closeCurrentLightbox()
{
    $('#lightsOut').fadeOut();
    $('.lightbox').fadeOut();
}


function lightbox()
{
document.body.scrollTop = document.documentElement.scrollTop = 0;
  $(document).ready(function(){
    $('html').css('overflow', 'hidden');
    $('#lightsOut').fadeIn();
    $('.lightbox').fadeIn();
  })
}


function lightbox2()
{
document.body.scrollTop = document.documentElement.scrollTop = 0;
  $(document).ready(function(){
    $('html').css('overflow', 'hidden');
    $('#lightsOut').fadeIn();
    $('.lightbox2').fadeIn();
  })
}

function lightbox3()
{
document.body.scrollTop = document.documentElement.scrollTop = 0;
  $(document).ready(function(){
    $('html').css('overflow', 'hidden');
    $('#lightsOut').fadeIn();
    $('.lightbox3').fadeIn();
  })
}


$('#lightsOut').click(function(){
  $('.wrap, #profileTab').removeClass('active2');
  $('html').css('overflow', 'initial');
  $('#lightsOut').fadeOut('fast');
  $('.lightbox').fadeOut('fast');
});


$('#closeLightbox').click(function(){
  $('html').css('overflow', 'initial');
  $('#lightsOut').fadeOut('fast');
  $('.lightbox').fadeOut('fast');
});


$('#closeRecipebox').click(function(){
  $('html').css('overflow', 'initial');
  $('#lightsOut').fadeOut('fast');
  $('.lightbox2').fadeOut('fast');
});



$('#mondayMealAdd').click(function(){
  $('#mondayMealAdd').css('display', 'none');
  $('#mondayBtn').css('display', 'block');
  $('#mondayInput').css('display', 'block');
})




$('#lightsOut').click(function(){
  //$('.wrap, #profileTab').removeClass('active2');
  $('html').css('overflow', 'initial');
  $('#lightsOut').fadeOut('fast');
  $('.lightbox2').fadeOut('fast');
  $('.lightbox3').fadeOut('fast');
});






function getRecipe()
{

    document.getElementById('refreshIcon').src = 'img/loadingGIF.svg';
if(nextRecipe != 0)
{
  nextRecipeInJSON();
}
else
{
var recipeString = recipeConstruct.join();
console.log(recipeString);

$.ajax({
    url: 'https://community-food2fork.p.mashape.com/search?key=a3fd68683903224dde5608cc027e33a5&q=' + recipeString, // The URL to the API. You can get this by clicking on "Show CURL example" from an API profile
    type: 'GET', // The HTTP Method
    data: {}, // Additional parameters here
    datatype: 'json',
    success: function(data) 
    { 
      recipeData = JSON.parse(data);
      nextRecipeInJSON();
     },
    error: function(err) { alert(err); },
    beforeSend: function(xhr) {
    xhr.setRequestHeader("X-Mashape-Authorization", "LktMh68JFamshRTztQfGxxWiHMaRp1M0iufjsng1SPMx9O0AfF"); // Enter here your Mashape key
    }
});
}  

}


function nextRecipeInJSON()
{
  if(nextRecipe >= 1)
  {
    $('#previousRecipe').css('display', 'block');
  }
  else
  {
      $('#previousRecipe').css('display', 'none');
  }


var titleData = recipeData.recipes[nextRecipe].title;
var titleData2 = recipeData.recipes[nextRecipe].source_url;
var titleData3 = recipeData.recipes[nextRecipe].image_url;
document.getElementById("recipeTitle").innerHTML = titleData;
document.getElementById("linkMe").href = titleData2;
document.getElementById("pic1").src = titleData3;

  document.getElementById('refreshIcon').src = 'img/refreshIcon.png';
nextRecipe++;
console.log('before' + nextRecipe);
}



$('#previousRecipe').click(function(){
    nextRecipe = nextRecipe - 2;
    console.log('after' + nextRecipe);
    nextRecipeInJSON();
})






function getRecipeMobile()
{

      document.getElementById('mobileRecipeRefresh').src = 'img/loadingGIF.svg';


if(nextRecipeMobile != 0)
{
  nextRecipeInJSONMobile();
}
else
{
var recipeString = recipeConstruct.join();
console.log(recipeString);

$.ajax({
    url: 'https://community-food2fork.p.mashape.com/search?key=a3fd68683903224dde5608cc027e33a5&q=' + recipeString, // The URL to the API. You can get this by clicking on "Show CURL example" from an API profile
    type: 'GET', // The HTTP Method
    data: {}, // Additional parameters here
    datatype: 'json',
    success: function(data) 
    { 
      recipeDataMobile = JSON.parse(data);

      nextRecipeInJSONMobile();
     },
    error: function(err) { alert(err); },
    beforeSend: function(xhr) {
    xhr.setRequestHeader("X-Mashape-Authorization", "LktMh68JFamshRTztQfGxxWiHMaRp1M0iufjsng1SPMx9O0AfF"); // Enter here your Mashape key
    }
});
}  

}



function nextRecipeInJSONMobile()
{
  if(nextRecipeMobile >= 1)
  {
    $('#previousRecipe').css('display', 'block');
  }
  else
  {
      $('#previousRecipe').css('display', 'none');
  }


var titleData = recipeDataMobile.recipes[nextRecipeMobile].title;
var titleData2 = recipeDataMobile.recipes[nextRecipeMobile].source_url;
var titleData3 = recipeDataMobile.recipes[nextRecipeMobile].image_url;
document.getElementById("recipeTitleMobile").innerHTML = titleData;
document.getElementById("linkMeMobile").href = titleData2;
document.getElementById("pic1Mobile").src = titleData3;
 document.getElementById('mobileRecipeRefresh').src = 'img/refreshIcon.png';

nextRecipeMobile++;
console.log('before' + nextRecipeMobile);
}





/*
var undo = new Firebase('https://todofyp.firebaseio.com/listItems/' + groupID);
undo.on('child_removed', function(deletedSnapshot) {
  undoChange(deletedSnapshot);
  deletedSnapshot = "";
});
*/

function undoChange(deletedSnapshot)
{
 $('#undoContainer').fadeIn('fast', function () {
    $(this).delay(2000).fadeOut('slow');

    $('#undoContainer').click(function(){
      var undoSnapshot = deletedSnapshot.val();
      var name = undoSnapshot.name;
      var text = undoSnapshot.text;
      var userGroup = undoSnapshot.groupID;
      var defaultStatus = undoSnapshot.status;
      var currentTime = undoSnapshot.time;
      var undoChange = new Firebase('https://todofyp.firebaseio.com/listItems/' + groupID);
      undoChange.push({name: name, text: text, groupID: userGroup, status: defaultStatus, time: currentTime}, onUndo);
    })


  });

}


function onUndo()
{
  console.log('changes have been undone');
}


function getLink()
{
  $('.addUserContainer').css('display', 'none');
  $('#getLink').css('display','none');
  $('.getLinkContainer').fadeIn('fast');
  $('#getEmail').fadeIn('fast');


var getLink = 'https://todofyp.firebaseapp.com/index.html?groupID=' + groupID;
document.getElementById('linkBox').value = getLink;

}



function getGroupByLink(myDetails)
{
if(urlCount == 0)
{
  urlCount = 1;
var groupLink = getURLGroupID()["groupID"];

if(groupLink != '' || groupLink != undefined)
{
  var cleansedGroupID = groupLink.replace("%20", " ");
  alert(cleansedGroupID);
  console.log("GROUPBITCH: " + groupString);
  var ref = new Firebase('https://todofyp.firebaseio.com/users/' + myDetails);
  var newGroup = groupString + ',' + cleansedGroupID;
  ref.update({ groupID: newGroup});
  groupID = cleansedGroupID;
  var splitGroupID = cleansedGroupID.split("----ID----")[0];
  changeGroup(cleansedGroupID);
  alert('new group joined');
}
}

}



function getURLGroupID() {
var vars = {};
var url = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
vars[key] = value;
});
return vars;
}







