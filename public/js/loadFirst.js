
/*
function getGroups()
{
var group = "";
//empty div
    
 var refThree = new Firebase('https://todofyp.firebaseio.com/');
  var listRef = refThree.child("listItems");
// Attach an asynchronous callback to read the data at our posts reference
refThree.on("value", function(snapshot) {
  document.getElementById('groupContainer').innerHTML = "";
  group = snapshot.child("listItems").val();
  for(var groupName in group)
  {
    console.log(groupName);
    $('<div/>').prepend($('<div class="groupName" id="'+ groupName +'" onclick="changeGroup(this.id);">').text(groupName)).appendTo($('.groupContainer'));
    //$('.groupContainer').html($('<div class="groupName">').text(groupName));
  }

  //console.log(group);

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

}


function changeGroup(id)
{
    localStorage.setItem('groupID', id);
    window.location.href = "https://todofyp.firebaseapp.com";


}
*/











