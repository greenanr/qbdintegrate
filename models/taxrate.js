function Taxrate() {
}

Taxrate.prototype.getTaxRate = function(authentication_token, app_company_id    ) {
    var app_companyid = parseInt(app_company_id);
    var URL = CONST_URL.COMPANY+app_companyid;
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
        var default_taxrate_id = json.company_setting.default_tax_rate_id;
        console.log("id is", default_taxrate_id);
        chrome.storage.sync.set({
            defaultTaxRateID : default_taxrate_id
        })
    })
}