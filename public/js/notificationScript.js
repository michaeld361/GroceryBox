
//TODO
/*
- need to get device tokens
- store device tokens in array
- foreach through array and send push notifications
*/



 var myDataRef = new Firebase('https://todofyp.firebaseio.com/listItems');
 myDataRef.on('child_changed', function(snapshot) {
        var message = snapshot.val();
        var groupMarked = snapshot.key();
       console.log(groupMarked + ' is the key');
        getUsersInGroup(groupMarked);

 });


function getUsersInGroup(groupMarked)
{
  var userDeviceTokens = [];
var userNotiRef = new Firebase("https://todofyp.firebaseio.com/users/");
    userNotiRef.on("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
    var usersInGroup = childSnapshot.val();
    var userGroupInGroup = usersInGroup.groupID;
    var userNameInGroup = usersInGroup.Name;
    var userDeviceToken = usersInGroup.deviceToken;
    var userNotificationStatus = usersInGroup.notificationStatus;
    var usersInGroupArray = userGroupInGroup.split(",");
    //for each user in the group

    if(userNotificationStatus != 'NO')
    {
    for(var i = 0; i < usersInGroupArray.length; i++)
    {
      if(usersInGroupArray[i] == groupMarked)
      {
        console.log(userNameInGroup + ' got sent a push notificaiton');
        userDeviceTokens.push(userDeviceToken);
      }
    }
	}

   })
 });

}



     



         //sendNotification(message.name, message.text);
         //console.log('List Item Added');