var groupLink = getURLGroupID()["groupID"];
function authDataCallback(authData) {
  if(!authData && groupLink == '' || groupLink == undefined) {
   window.location.href = "https://todofyp.firebaseapp.com/login.html";
  } 
    
}


var ref45 = new Firebase("https://todofyp.firebaseio.com");
ref45.onAuth(authDataCallback);