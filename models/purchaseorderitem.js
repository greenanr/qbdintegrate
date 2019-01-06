// "id": 1
// "description": "hello",
// "purchase_order_id": 1,
// "budget_id": 1,
// "budget_summary": "1100044 - Embajadores de marca Google en Retail Chromecast : F 9575 : TELEFONIA Y CELULARES",
// "gross_amount": "50.55",
// "vat": "1.1",
// "net_amount": "50.0",
// "status": "pending",
// "quantity": "1.0",
// "unit_price": "50.0",
// "item_number": null,
// "base_net_amount": "44.0795",
// "base_gross_amount": "44.564375",
// "gross_usd_amount": "50.55",
// "product_id": null,
// "received_quantity": null,
// "custom_field_values": []


function PurchaseOrderItem () {
	this.id = 0;
	this.description = "";
	this.default_tax_id = "";
	this.budget_id = "";
	this.budget_summary = "";
	this.gross_amount = "";
	this.vat = "";
	this.net_amount = "";
	this.status = "";
	this.quantity = 0;
	this.unit_price = "";
	this.item_number = "";
	this.base_net_amount = 0;
	this.base_gross_amount = 0;
	this.gross_usd_amount = "";
	this.product_id = "";
	this.received_quantity = 0;

}

PurchaseOrderItem.prototype.getID = function () {
	return this.id;
}

PurchaseOrderItem.prototype.setID = function (ID) {
	this.id = ID;
}

PurchaseOrderItem.prototype.setTaxRateId = function(default_taxId) {
	this.default_tax_id = default_taxId;
}

PurchaseOrderItem.prototype.getTaxRateId = function() {
	return this.default_tax_id;
}

PurchaseOrderItem.prototype.getDescription = function () {
	return this.description;
}

PurchaseOrderItem.prototype.setDescription = function (Description) {
	this.description = Description;
}

PurchaseOrderItem.prototype.getBudgetId = function () {
	return this.budget_id;
}

PurchaseOrderItem.prototype.setBudgetId = function (BudgetID) {
	this.budget_id = BudgetID;
}

PurchaseOrderItem.prototype.getBudgetSummary = function () {
	return this.budget_summary;
}

PurchaseOrderItem.prototype.setBudgetSummary = function (BudgetSummary) {
	this.budget_summary = BudgetSummary;
}

PurchaseOrderItem.prototype.getGrossAmount = function () {
	return this.gross_amount
}

PurchaseOrderItem.prototype.setGrossAmount = function (GrossAmount) {
	this.gross_amount = GrossAmount;
}
PurchaseOrderItem.prototype.getVat = function () {
	return this.vat;
}

PurchaseOrderItem.prototype.setVat = function (Vat) {
	this.vat = Vat;
}
PurchaseOrderItem.prototype.getNetAmount = function () {
	return this.net_amount;
}

PurchaseOrderItem.prototype.setNetAmount = function (NetAmount) {
	this.net_amount = NetAmount;
}
PurchaseOrderItem.prototype.getStatus = function () {
	return this.status;
}

PurchaseOrderItem.prototype.setStatus = function (Status) {
	this.status = Status;
}

PurchaseOrderItem.prototype.getQuantity = function () {
	return this.quantity;
}

PurchaseOrderItem.prototype.setQuantity = function (quantity) {
	this.quantity = quantity;
}

PurchaseOrderItem.prototype.getUnitPrice = function () {
	return this.unit_price;
}

PurchaseOrderItem.prototype.setUnitPrice = function (UnitPrice) {
	this.unit_price = UnitPrice;
}

PurchaseOrderItem.prototype.getItemNumber = function () {
	return this.item_number;
}

PurchaseOrderItem.prototype.setItemNumber = function (ItemNumber) {
	this.item_number = ItemNumber;
}

PurchaseOrderItem.prototype.getBaseNetAmount = function () {
	return this.base_net_amount;
}

PurchaseOrderItem.prototype.setBaseNetAmount = function (BaseNetAmount) {
	this.base_net_amount = BaseNetAmount;
}

PurchaseOrderItem.prototype.getBaseGrossAmount = function () {
	return this.base_gross_amount;
}

PurchaseOrderItem.prototype.setBaseGrossAmount= function (BaseGrossAmount) {
	this.base_gross_amount = BaseGrossAmount;
}

PurchaseOrderItem.prototype.getGrossUSDAmount = function () {
	return this.gross_usd_amount;
}

PurchaseOrderItem.prototype.setGrossUSDAmount = function (GrossUSDAmount) {
	this.gross_usd_amount = GrossUSDAmount;
}

PurchaseOrderItem.prototype.getProductId = function () {
	return this.product_id;
}

PurchaseOrderItem.prototype.setProductId = function (ProductId) {
	this.product_id = ProductId;
}

PurchaseOrderItem.prototype.getReceivedQuantity = function () {
	return this.received_quantity;
}

PurchaseOrderItem.prototype.setReceivedQuantity = function (ReceivedQuantity) {
	this.received_quantity = ReceivedQuantity;
}

PurchaseOrderItem.prototype.toJSON = function () {
    var strJSON = '{';
      
    if (getID() != "") {
      	strJSON = strJSON + getID();
      	strJSON = strJSON + ", ";
    }

    if (getDescription() != "") {
      	strJSON = strJSON + getDescription();
      	strJSON = strJSON + ", ";
    }

    if (getBudgetId() != "") {
      	strJSON = strJSON + getBudgetId();
      	strJSON = strJSON + ", ";
    }

	if (getBudgetSummary() != "") {
      	strJSON = strJSON + getBudgetSummary();
      	strJSON = strJSON + ", ";
    }

	if (getGrossAmount() != 0) {
      	strJSON = strJSON + getGrossAmount().toString();
      	strJSON = strJSON + ", ";
    }

    if (getVat() != 0) {
      	strJSON = strJSON + getVat().toString();
      	strJSON = strJSON + ", ";
    }

	if (getNetAmount() != 0) {
      	strJSON = strJSON + getNetAmount().toString();
      	strJSON = strJSON + ", ";
    }

	if (getStatus() != "") {
      	strJSON = strJSON + getStatus();
      	strJSON = strJSON + ", ";
    }        

	if (getQuantity() != 0) {
      	strJSON = strJSON + getQuantity().toString();
      	strJSON = strJSON + ", ";
    }

	if (getUnitPrice() != 0) {
      	strJSON = strJSON + getUnitPrice().toString();
      	strJSON = strJSON + ", ";
    }

    if (getItemNumber() != "") {
      	strJSON = strJSON + getItemNumber();
      	strJSON = strJSON + ", ";
    }  

    if (getBaseNetAmount() != 0) {
      	strJSON = strJSON + getBaseNetAmount().toString();
      	strJSON = strJSON + ", ";
    }

	if (getBaseGrossAmount() != 0) {
      	strJSON = strJSON + getBaseGrossAmount().toString();
      	strJSON = strJSON + ", ";
    }

	if (getGrossUSDAmount() != 0) {
      	strJSON = strJSON + getGrossUSDAmount().toString();
      	strJSON = strJSON + ", ";
    }

	if (getProductId() != 0) {
      	strJSON = strJSON + getProductId();
      	strJSON = strJSON + ", ";
    }

    if (getReceivedQuantity() != 0) {
      	strJSON = strJSON + getReceivedQuantity().toString();
    }

    strJSON = strJSON + " }";

    return strJSON;

}