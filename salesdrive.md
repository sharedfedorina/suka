<?php
        
$_salesdrive_url = "https://comoyo.salesdrive.me/handler/";
$_salesdrive_headers = [
    "Content-Type: application/json",
    "X-Api-Key: Ycxui0h7tqIgGn3EJi1AcBgUaTpnXSgpJ4U-AUldjbFFepXWHuj2QQ3ekCpgX76Yz"
];

$products = [];
            
$products[0]["id"] = ""; // id товару
$products[0]["name"] = ""; // назва товару
$products[0]["costPerItem"] = ""; // ціна
$products[0]["amount"] = ""; // кількість
$products[0]["description"] = ""; // опис товарної позиції в заявці
$products[0]["discount"] = ""; // знижка, задається в % або в абсолютній величині
$products[0]["sku"] = ""; // артикул (SKU) товару
                            
$_salesdrive_values = [
    "getResultData" => "1", // Отримувати дані створеної заявки (0 - не отримувати, 1 - отримувати)
    "products"=>$products, //Товари/Послуги
    "comment"=>"", // Коментар
    "externalId"=>"", // Зовнішній номер заявки
    "fName"=>"", // Ім'я
    "lName"=>"", // Прізвище
    "mName"=>"", // По батькові
    "phone"=>"", // Телефон
    "email"=>"", // E-mail
    "con_comment"=>"", // Коментар
    "shipping_method"=>"", // Спосіб доставки
    "payment_method"=>"", // Спосіб оплати
    "shipping_address"=>"", // Адреса доставки
    "novaposhta"=> [
        "ServiceType" => "", // можливі значення: Warehouse, Doors
        "payer" => "", // можливі значення: "sender", "recipient"
        "area" => "", // область російською або українською мовою, або Ref області в системі Нової пошти
        "region" => "", // район російською або українською мовою (використовується тільки якщо cityNameFormat=settlement)
        "city" => "", // назва міста російською чи українською мовою, або Ref міста у старій чи новій адресній системі системі Нової пошти. Під час передачі назви міста: у режимі cityNameFormat=short слід передавати лише назву міста; у режимі cityNameFormat=full слід передавати назву міста у старій адресній системі Нової Пошти.
        "cityNameFormat" => "", // можливі значення: "full" (за замовчуванням), "short"
        "WarehouseNumber" => "", // відділення Нової Пошти в одному з форматів: номер, опис, Ref
        "Street" => "", // назва і тип вулиці, або Ref вулиці в системі Нової пошти
        "BuildingNumber" => "", // номер будинку
        "Flat" => "", // номер квартири
        "ttn" => "" // ТТН
    ],
    "costPrice"=>"", // Собівартість
    "ukrposhta"=> [
        "ServiceType" => "", // можливі значення: Warehouse, Doors
        "payer" => "", // можливі значення: "sender", "recipient"
        "type" => "", // можливі значення: express, standard
        "city" => "", // місто російською або українською мовою, або CITY_ID Укрпошти
        "WarehouseNumber" => "", // номер відділення Укрпошти
        "Street" => "", // STREET_ID Укрпошти
        "BuildingNumber" => "", // номер будинку
        "Flat" => "", // номер квартири
        "ttn" => "" // ТТН
    ],
    "sajt"=>"", // Сайт
    "organizationId"=>"", // id організації
    "shipping_costs"=>"", // Витрати на доставку
    "rozetka_delivery"=> [
        "WarehouseNumber" => "", // ідентифікатор відділення Rozetka у форматі "6c80609b-a33d-4554-afec-c29392a8be58"
        "payer" => "", // можливі значення: "sender", "recipient"
        "ttn" => "" // ТТН
    ],
    "meest"=> [
        "ServiceType" => "", // можливі значення: Warehouse, Doors
        "payer" => "", // можливі значення: "sender", "recipient"
        "area" => "", // область українською або російською мовою
        "city" => "", // місто українською або російською мовою
        "WarehouseNumber" => "", // відділення Meest в одному з форматів: номер або br_id
        "ttn" => "" // ТТН
    ],
    "dateOfBirth"=>"", // Дата народження (приймаються формати: ДД.ММ.РРРР, ДД.ММ, ДД.ММ.РР, РРРР-ММ-ДД)
    "stockId"=>"", // id складу
    "utmSourceFull"=>isset($_COOKIE["prodex24source_full"])?$_COOKIE["prodex24source_full"]:"",
    "utmSource"=>isset($_COOKIE["prodex24source"])?$_COOKIE["prodex24source"]:"",
    "utmMedium"=>isset($_COOKIE["prodex24medium"])?$_COOKIE["prodex24medium"]:"",
    "utmCampaign"=>isset($_COOKIE["prodex24campaign"])?$_COOKIE["prodex24campaign"]:"",
    "utmContent"=>isset($_COOKIE["prodex24content"])?$_COOKIE["prodex24content"]:"",
    "utmTerm"=>isset($_COOKIE["prodex24term"])?$_COOKIE["prodex24term"]:"",
    "utmPage"=>isset($_SERVER["HTTP_REFERER"])?$_SERVER["HTTP_REFERER"]:"",
];

$_salesdrive_ch = curl_init();
curl_setopt($_salesdrive_ch, CURLOPT_URL, $_salesdrive_url);
curl_setopt($_salesdrive_ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($_salesdrive_ch, CURLOPT_HTTPHEADER, $_salesdrive_headers);
curl_setopt($_salesdrive_ch, CURLOPT_SAFE_UPLOAD, true);
curl_setopt($_salesdrive_ch, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt($_salesdrive_ch, CURLOPT_POST, 1);
curl_setopt($_salesdrive_ch, CURLOPT_POSTFIELDS, json_encode($_salesdrive_values));
curl_setopt($_salesdrive_ch, CURLOPT_TIMEOUT, 15);

$_salesdrive_res = curl_exec($_salesdrive_ch); 



Відстеження джерел переходів
(function() {
 function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"
    ))
    return matches ? decodeURIComponent(matches[1]) : undefined
 }

 function setCookie(name, value, props) {
    props = props || {}
    var exp = props.expires
    if (typeof exp == "number" && exp) {
       var d = new Date()
       d.setTime(d.getTime() + exp * 1000 * 86400)
       exp = props.expires = d
    }
    if(exp && exp.toUTCString) { props.expires = exp.toUTCString() }

    value = decodeURIComponent(value)
    var updatedCookie = name + "=" + value
    for(var propName in props){
       updatedCookie += "; " + propName
       var propValue = props[propName]
       if(propValue !== true){ updatedCookie += "=" + propValue }
    }
    document.cookie = updatedCookie
 }

 function parseURL(url) {
    var a =  document.createElement("a");
    a.href = url;
    return {
       source: url,
       protocol: a.protocol.replace(":",""),
       host: a.hostname,
       port: a.port,
       query: a.search,
       params: (function(){
          var ret = {},
             seg = a.search.replace(/^\?/,"").split("&"),
             len = seg.length, i = 0, s;
          for (;i<len;i++) {
             if (!seg[i]) { continue; }
             s = seg[i].split("=");
             ret[s[0]] = s[1];
          }
          return ret;
       })(),
       file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,""])[1],
       hash: a.hash.replace("#",""),
       path: a.pathname.replace(/^([^\/])/,"/$1"),
       relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,""])[1],
       segments: a.pathname.replace(/^\//,"").split("/")
    };
 }

 function parseGetParams() {
    var $_GET = {};
    var __GET = window.location.search.substring(1).split("&");
    for(var i=0; i<__GET.length; i++) {
       var getVar = __GET[i].split("=");
       $_GET[getVar[0]] = typeof(getVar[1])=="undefined" ? "" : decodeURIComponent(getVar[1]);
    }

    return $_GET;
 }

 function setCookieThisDomain(hostname_arr, i)
 {
    var this_domain_tmp = hostname_arr.slice(i).join(".");
    var cookie_param = {expires: 365, path: "/", domain: "." + this_domain_tmp}
    setCookie("prodex24cur_domain", this_domain_tmp, cookie_param);
    var tmp_m = getCookie("prodex24cur_domain");
    if (typeof(tmp_m) == "undefined")
    {
       i--;
       if (i < 0)
          return;

       setCookieThisDomain(hostname_arr, i);
    }
 }

 var hostname = location.host || location.hostname;
 var hostname_arr = hostname.split(".");
 var len = hostname_arr.length - 2;
 setCookieThisDomain(hostname_arr, len);
 this_domain = getCookie("prodex24cur_domain");
 var cookie_param = {expires: 365, path: "/", domain: "." + this_domain};
 var refer = document.referrer || location.referrer;
 var get = parseGetParams();
 var myURL = parseURL(refer);
 myURLhost = myURL.host;

 if (typeof(get.utm_source) != "undefined" || typeof(get.utm_medium) != "undefined" || typeof(get.utm_campaign) != "undefined" || typeof(get.utm_content) != "undefined" || typeof(get.utm_term) != "undefined" || typeof(get.yclid) != "undefined" || typeof(get.gclid) != "undefined")
 {
    setCookie("prodex24source", get.utm_source || "", cookie_param);
    if (typeof(get.utm_source) == "undefined")
    {
       if (typeof(get.gclid) != "undefined")
       {setCookie("prodex24source", "google", cookie_param);}
    }

    setCookie("prodex24medium", get.utm_medium || "", cookie_param);
    if (typeof(get.utm_medium) == "undefined")
    {
       if (typeof(get.yclid) != "undefined")
       {setCookie("prodex24medium", "cpc", cookie_param);}
       if (typeof(get.gclid) != "undefined")
       {setCookie("prodex24medium", "cpc", cookie_param);}
    }
    setCookie("prodex24campaign", get.utm_campaign || "", cookie_param);
    setCookie("prodex24content", get.utm_content || "", cookie_param);
    setCookie("prodex24term", get.utm_term || "", cookie_param);

    if (refer && myURLhost.indexOf(window.location.hostname) == -1 && window.location.hostname.indexOf(myURLhost) == -1)
    {setCookie("prodex24source_full", refer || "", cookie_param);}
 }
 else if (refer)
 {
    if  (myURLhost.indexOf(window.location.hostname) == -1 && window.location.hostname.indexOf(myURLhost) == -1)
    {
       setCookie("prodex24source_full", refer, cookie_param);
       var domain = myURL.host.replace(/^www\./i, "");
       setCookie("prodex24source", domain, cookie_param);

       if (typeof(get.gclid) != "undefined")
       {setCookie("prodex24medium", "cpc", cookie_param);}
       else if (/^(((google|search\.yahoo|yandex|bing)(\.[^.]+)+)|(rambler\.ru)|(ukr\.net)|(mail\.ru))$/i.test(domain))
       {setCookie("prodex24medium", "organic", cookie_param);}
       else
       {setCookie("prodex24medium", "referral", cookie_param);}

       setCookie("prodex24campaign", "", cookie_param);
       setCookie("prodex24content", "", cookie_param);
       setCookie("prodex24term", "", cookie_param);

    }
 }
})();


Пояснення
products
Формат передачі даних про товари в замовленні:

products[0]['id'] - id товару
products[0]['name'] - назва товару
products[0]['costPerItem'] - ціна за одиницю
products[0]['amount'] - кількість
products[0]['description'] - опис (наприклад: розмір, колір)
products[0]['discount'] - знижка, задається в % або в абсолютній величині
products[0]['sku'] - артикул (SKU) товару
products[1]['id'] - id товару
products[1]['name'] - назва товару
products[1]['costPerItem'] - ціна за одиницю
products[1]['amount'] - кількість
products[1]['description'] - опис (наприклад: розмір, колір)
products[1]['discount'] - знижка, задається в % або в абсолютній величині
products[1]['sku'] - артикул (SKU) товару

