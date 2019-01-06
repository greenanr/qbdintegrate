
//Budget holding class


function Budgets () {

	this.budgetList = [];
	this.iDsAndNames = [];
}


Budgets.prototype.getBudgets =  function(authentication_token, app_company_id, departmentID, budgetListCallBack) {
	try {
	this.budgetList = [];

	var URL = CONST_URL.BUDGETS;
	if(departmentID){
		URL = URL+"?department_id="+departmentID;
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
			objRef.budgetCallBack(json);
            budgetListCallBack(json);
		})
    } catch (err) {
    console.log("Error trying to get Suppliers: "+err);
 }
    
}

Budgets.prototype.getBudgetList = function () {
	return this.budgetList;
}

Budgets.prototype.getIdsAndNames = function () {
	return this.iDsAndNames;
}
	
Budgets.prototype.budgetCallBack = function (json)
{

	var obj = json;
    if (obj) {
    	for (var x=0; x < obj.length; x++) {
    	
    		if (!obj[x].archived) {
    			var budget = new Budget();

	    		budget.setId(obj[x].id);
				budget.setCompanyId(obj[x].company_id);
				budget.setName(obj[x].name);
				budget.setAmount(obj[x].amount);
				budget.setCostCode(obj[x].cost_code);
				budget.setCostType(obj[x].cost_type);
				budget.setArchived(obj[x].archived);
				budget.setCurrencyId(obj[x].currency_id);
				budget.setBaseAmount(obj[x].base_amount);
				budget.setBaseRate(obj[x].base_rate);
				budget.setAllowAnyoneToApprove(obj[x].allow_anyone_to_approve_a_po);
				budget.setStartDate(obj[x].start_date);
				budget.setEndDate(obj[x].end_date);
				budget.setSummary(obj[x].summary);
				this.budgetList.push(budget);
				this.iDsAndNames.push(new Array(obj[x].id, obj[x].name+( obj[x].cost_code && " : "+obj[x].cost_code)+(obj[x].cost_type && " : "+obj[x].cost_type)));
			}
    	}
    }
}