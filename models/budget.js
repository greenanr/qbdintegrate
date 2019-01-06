
// Budget holding class
// "id": 1,
// "company_id": 1,
// "name": "Test",
// "amount": "100.0",
// "cost_code": null,
// "cost_type": null,
// "archived": false,
// "currency_id": 1,
// "base_amount": "100.0",
// "base_rate": "1.0",
// "allow_anyone_to_approve_a_po": false,
// "start_date": null,
// "end_date": null,
// "summary": "Test"

function Budget () {
	this.id = "";
	this.company_id = "";
	this.name = "";
	this.amount = "";
	this.cost_code = "";
	this.cost_type = "";
	this.archived = false;
	this.currency_id = "";
	this.base_amount = "";
	this.base_rate = "";
	this.allow_anyone_to_approve_a_po = false;
	this.start_date = "";
	this.end_date = "";
	this.summary = "";

}

Budget.prototype.getId = function() {
	return this.id;
}

Budget.prototype.setId = function(ID) {
	this.id = ID;
}

Budget.prototype.getCompanyId = function() {
	return this.company_id;
}

Budget.prototype.setCompanyId = function(CompanyID) {
	this.company_id = CompanyID;
}

Budget.prototype.getName = function() {
	return this.name;
}

Budget.prototype.setName = function(Name) {
	this.name = Name;
}

Budget.prototype.getAmount = function() {
	return this.amount;
}

Budget.prototype.setAmount = function(Amount) {
	this.amount = Amount;
}

Budget.prototype.getCostCode = function() {
	return this.cost_code;
}

Budget.prototype.setCostCode = function(CostCode) {
	this.cost_code = CostCode;
}

Budget.prototype.getCostType = function() {
	return this.cost_type;
}

Budget.prototype.setCostType = function(CostType) {
	this.cost_type = CostType;
}

Budget.prototype.getArchived = function() {
	return this.archived;
}

Budget.prototype.setArchived = function(Archived) {
	this.archived = Archived;
}

Budget.prototype.getCurrencyId = function() {
	return this.currency_id;
}

Budget.prototype.setCurrencyId = function(CurrencyId) {
	this.currency_id = CurrencyId;
}

Budget.prototype.getBaseAmount = function() {
	return this.base_amount;
}

Budget.prototype.setBaseAmount = function(BaseAmount) {
	this.base_amount = BaseAmount;
}

Budget.prototype.getBaseRate = function() {
	return this.base_rate;
}

Budget.prototype.setBaseRate = function(BaseRate) {
	this.base_rate = BaseRate;
}

Budget.prototype.getAllowAnyoneToApprove = function() {
	return this.allow_anyone_to_approve_a_po;
}

Budget.prototype.setAllowAnyoneToApprove = function(AllowAnyoneToApprove) {
	this.allow_anyone_to_approve_a_po = AllowAnyoneToApprove;
}

Budget.prototype.getStartDate = function() {
	return this.start_date;
}

Budget.prototype.setStartDate = function(StartDate) {
	this.start_date = StartDate;
}

Budget.prototype.getEndDate = function() {
	return this.end_date;
}

Budget.prototype.setEndDate = function(EndDate) {
	this.end_date = EndDate;
}

Budget.prototype.getSummary = function() {
	return this.summary;
}

Budget.prototype.setSummary = function(Summary) {
	this.summary = Summary;
}