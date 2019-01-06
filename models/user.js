/*id": 1,
 "email": "john@example.com",
  "name": "John Doe",
  "phone_number": "98xxxxxxxx",
  "setup_incomplete": false,
  "employer_id": 1,
  "authentication_token": "newt0k3n",
  "approval_limit": 0,

  */
  function User () {
  	this.id = "";
  	this.email = "";
  	this.name = "";
  	this.phone_number = "";
  	this.setup_incomplete = false;
  	this.employer_id = 1;
  	this.authentication_token = "";
  	this.approval_limit = 0;
  	this.companies = [];
  }

  User.prototype.getUserLogin = function (username, password, callback) {
  	try {
    	var URL = CONST_URL.LOGIN;
     	var objRef = this;

      var userRequest = {"email" : username, "password" : password};
      fetch(URL, {
        method: "POST",
        body: JSON.stringify(userRequest),
        headers: {
          "Content-Type": "application/json"
        },
      }).then(function(response){
        if (response.status==200) {
          //console.debug('Budgets Returned correct state');
          return response.json();
          } else {
            console.log("error", response.statusText);
            callback(false);
          }
      }).then(function(json){
        objRef.userCallBack(json);
        console.log("check",this.check);
        callback(true);
      })
      
    } catch (err) {
        callback(false);
        throw new Error("Error status 2000. Could not get user details. " + err.message);
    }
    
}

User.prototype.getCurrentUser = function (authentication_token, callback) {
    try {
      var URL = CONST_URL.CURRENTUSER;
      var objRef = this;
      fetch(URL, {
        method: "GET",
        headers: {
          'authentication_token': authentication_token,
          "Content-Type": "application/json"
        }
      }).then(function(response){
        if (response.status==200) {
            return response.json();
            } else {
              console.log("error", response.statusText);
              callback(false);
            }
        }).then(function(json){
          objRef.userCallBack(json);
          callback(true);
        })

    } catch (err) {
        callback(false);
        throw new Error("Error status 2000. Could not get user details. " + err.message);
    }
    
}
	
User.prototype.userCallBack = function (json) {

  try {
    var obj = json;

    if (obj) {
		  this.id = obj.id;
		  this.email = obj.email;
		  this.name = obj.name;
  		this.phone_number = obj.phone_number;
  		this.setup_incomplete = obj.setup_incomplete;
 	 	  this.employer_id = obj.employer_id;
  		this.authentication_token = obj.authentication_token;
  		this.approval_limit = obj.approval_limit;
  		this.companies = obj.companies;
    }
  } catch (err) {
      throw new Error(err.message);
  }
 }
