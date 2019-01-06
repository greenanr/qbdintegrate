function PurchaseOrder() {
	this.ID = "";
	this.Commit = "draft";
	this.Company_Id = "";
	this.Approval_Key = "";
	this.Department_ID = "";
	this.Department_Name = "";
	this.Supplier_ID = "";
	this.Supplier_Name = "";
	this.Status = "";
	this.Creator_ID = "";
	this.Currency_ID = "";
	this.Creator_Name = "";
	this.Amount = 0;
	this.Created_At = "";
	this.Updated_At = "";
	this.Notes = "";
	this.Total_Net_Amount = 0;
	this.Total_Gross_Amount = 0;
	this.Base_Gross_Amount = 0;
	this.Delivery_Status = "";
	this.Delivered_On = "";
	this.Custom_Fields = "";
	this.Share_Key = "";
	this.Archived = false;
	this.Conversion_Rate = 1;
	this.Keywords = "";
	this.Self_Approved = false;
	this.PurchaseOrderItems = [];

}

PurchaseOrder.prototype.getCompanyId  = function() {
	return this.Company_Id;
}

PurchaseOrder.prototype.setCompanyId  = function(CompanyID) {
	this.Company_Id = CompanyID;
}

PurchaseOrder.prototype.getApprovalKey = function() {
	return this.Approval_Key;
}

PurchaseOrder.prototype.setApprovalKey = function(ApprovalKey) {
	this.Approval_Key = ApprovalKey;
}

PurchaseOrder.prototype.setSupplierID = function(SupplierID) {
	this.Supplier_ID = SupplierID;
}

PurchaseOrder.prototype.getSupplierID = function() {
	return this.Supplier_ID;
}

PurchaseOrder.prototype.setSupplierName = function(SupplierName) {
	this.Supplier_Name = SupplierName;
}

PurchaseOrder.prototype.getSupplierName = function() {
	return this.Supplier_Name;
}

PurchaseOrder.prototype.getCommit = function() {
	return this.Commit;
}

PurchaseOrder.prototype.setCommit = function(commit) {
	this.Commit = commit;
}

PurchaseOrder.prototype.getStatus = function() {
	return this.Status;
}

PurchaseOrder.prototype.setStatus = function(status) {
	this.Status = status;
}

PurchaseOrder.prototype.getCreatorID = function() {
	return this.Creator_ID;
}

PurchaseOrder.prototype.setCreatorID = function(creatorID) {
	this.Creator_ID = creatorID;
}

PurchaseOrder.prototype.getNotes = function() {
	return this.Notes;
}

PurchaseOrder.prototype.setNotes = function(_Notes) {
	this.Notes = _Notes;
}

PurchaseOrder.prototype.getCurrencyId = function() {
	return this.Currency_ID;
}

PurchaseOrder.prototype.setCurrencyId = function(CurrencyID) {
	this.Currency_ID = CurrencyID;
}

PurchaseOrder.prototype.getDepartmentId = function() {
	return this.Department_ID;
}

PurchaseOrder.prototype.setDepartmentId = function(DepartmentID) {
	this.Department_ID = DepartmentID;
}

PurchaseOrder.prototype.addPurchaseOrderItem = function(purchaseOrderItem) {
	this.PurchaseOrderItems.push (purchaseOrderItem);
}

PurchaseOrder.prototype.setPurchaseOrderItems = function(purchaseOrderItems) {
	this.PurchaseOrderItems = purchaseOrderItems;
}

PurchaseOrder.prototype.getPurchaseOrderItems = function() {
	return this.PurchaseOrderItems;
}

function getJSON(purchaseOrder) {
	var poi = purchaseOrder.getPurchaseOrderItems();
	var purchase_order_items_attributes = poi.map((item)=>{
		return {
			item_number: item.getItemNumber(),
			description: item.getDescription(),
			budget_id: item.getBudgetId().toString(),
			vat:  item.getVat(),
			status: item.getStatus(),
			quantity: item.getQuantity().toString(),
			unit_price: item.getUnitPrice(),
			tax_rate_id : item.getTaxRateId()
		}
	})
	var strJSON = {
		commit : purchaseOrder.getCommit(),
		purchase_order : {
			creator_id:purchaseOrder.getCreatorID(),
			status : purchaseOrder.getStatus(),
			supplier_name : purchaseOrder.getSupplierName(),
			notes : purchaseOrder.getNotes(),
			company_id : purchaseOrder.getCompanyId(),
			currency_id : purchaseOrder.getCurrencyId(),
			department_id : purchaseOrder.getDepartmentId(),
			purchase_order_items_attributes : purchase_order_items_attributes
		}
	};
   	return JSON.stringify(strJSON);
}

