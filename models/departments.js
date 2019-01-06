function Departments () {

}

Departments.prototype.getDepartments = function(authentication_token, app_company_id, callback) {
    try {
        var app_companyid = parseInt(app_company_id);
        var URL = CONST_URL.DEPARTMENTS;
        fetch(URL, {
            method: "GET",
            headers: {
                'authentication_token': authentication_token,
                'app_company_id': app_company_id,
                "Content-Type": "application/json"
            }
        }).then(function(response){
            if(response.status == 200){
                return response.json();
            }else{
                console.log("error", response);
            }
        }).then(function(json){
            callback(json);
        })
    } catch (err) {
        console.log("Error trying to get Suppliers: "+err);
     }
}