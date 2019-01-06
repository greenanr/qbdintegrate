function Suppliers () {
	this.supplierList = [];

}

Suppliers.prototype.getSuppliers = function (authentication_token, app_company_id, departmentID, supListCallBack) {
    try {
        console.log("Getting Suppliers with companyid: "+app_company_id)
        var URL = CONST_URL.SUPPLIERS;
        if(departmentID) {
            URL = URL+"?department_id="+ departmentID;
        }
        var objRef = this;
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
            }
        }).then(function(json){
            objRef.supplierCallBack(json);
            supListCallBack(json);
        })
 } catch (err) {
    console.log("Error trying to get Suppliers: "+err);
 }
}

Suppliers.prototype.getSupplierList = function () {
	return this.supplierList;
}

Suppliers.prototype.setSupplierList = function (SupplierList) {
	return this.supplierList = SupplierList;
}


Suppliers.prototype.supplierCallBack = function (json) {
    
    var obj = json;
    if (obj) {
        for (var x=0; x < obj.length; x++) {    
            if (!obj[x].archived) {
                this.supplierList.push(new Array(obj[x].id, obj[x].name));
            }
        }
    }
} 




