наступна фаза найскладніша.
в першу чергу із-за того, що зараз вже ніч, і мені потрібно йти спати, бо завтра понеділок робочий, я і так з тобою всі вихідні просидів. тому тобі прийдеться самостійно в декілька ітерацій до ранку виконати цю задачу. чому в декілька ітерацій? бо тобі якимось чином потрібно буде самому все протестити, нічого не поламати і так далі. коли говорю протестити то саме маю на увазі як я перевіряю що ти робиш.
це найскладніше мабуть буде для тебе - в декілька ітерацій самого себе перевіряти поки не буде готовий результат. 
тому, для того, щоб до ранку ти зміг повністю віддати готовий продукт тобі потрібно буде зрозуміти зараз суть.
цей конструктор буде використовуватися для створення багатьох лендінгів зараз і в подальшому. тому він має конфігуруватися максимально гнучко. як ти розумієш я просто знайшов в інтернеті лендінг, який мені сподобався і на його основі я просто роблю конструктор, щоб і собі подібні красиві лендінги створювати під мій товар.
якщо ти пройдешся по всьому лендінгу то зможеш визначити всі змінні частини, або те, що буде потребувати конфігурування. описи, фото, картинки, коментарі і все-все-все, вплоть до футера, для зміни назви на свою компанію. 
також потрібно буде знайти як зроблені вискакуючі вікна з закликом зробити замовлення і як їх конфігурувати. 
максимально вичистити всі елементи які повєязані з іншою компанією.
тобто тобі потрібно буде самому пройти по назвах, хедерах, описах, картинках і так далі, внести це в конструктор, внести в конфіги і можливості зберігати і завантажувати, генерити перегляд і завантаження архіву, ще й зробити максимально сучано а не на от'єбісь.
я навіть не знаю, чи в тебе це вийде без керування зі сторони людини. спробуй створи план, створи план тестування, повернення до переробки, якщо потрібно. це амбіційно. контексту і токенів до ранку має вистачити.

додати інтеграцію при замовленні на мою CRM. 

доданий pixel  3670672943154298

<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.agent='plhoroshop';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,"script",
"https://connect.facebook.net/en_US/fbevents.js");
fbq('init', "{SYSTEM_ID}");
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id={SYSTEM_ID}&ev=PageView&noscript=1"
/></noscript>
<!-- End Facebook Pixel Code -->


https://salesdrive.com.ua/knowledge/api/order-add-api/
X-Api-Key	Ycxui0h7tqIgGn3EJi1AcBgUaTpnXSgpJ4U-AUldjbFFepXWHuj2QQ3ekCpgX76Yz
Content-Type	application/json
POST https://comoyo.salesdrive.me/handler/
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
shipping_method
Приймаються значення:

Параметр	Пояснення
id_10	Самовивоз
id_16	Укрпошта
id_9	Нова Пошта
Кур'єром Нової пошти	Кур'єром Нової пошти
Кур'єром по місту	Кур'єром по місту
Кур'єром по місту Київ	Кур'єром по місту Київ
Магазины Rozetka	Магазины Rozetka
Нова Пошта	Нова Пошта
Новою поштою	Новою поштою
Поштомат Нової пошти	Поштомат Нової пошти
Самовивіз	Самовивіз
Укрпоштою	Укрпоштою
payment_method
Приймаються значення:

Параметр	Пояснення
id_12	Післяплата
id_13	Безготівково
id_14	Картка Приватбанку
«Оплата частинами» ПриватБанку	«Оплата частинами» ПриватБанку
Безготівковий розрахунок	Безготівковий розрахунок
Готівкою	Готівкою
Онлайн-оплата банківською карткою	Онлайн-оплата банківською карткою
Онлайн-оплата банківською карткою (WayForPay)	Онлайн-оплата банківською карткою (WayForPay)
Пром-оплата	Пром-оплата
organizationId
Приймаються значення:

Параметр	Пояснення
1	ФОП Федоріна Юлія Григорівна
sajt
Приймаються значення:

Параметр	Пояснення
comoyo.online	comoyo.online
dresspolo.comoyo.online	dresspolo.comoyo.online
https://comoyo.online/	https://comoyo.online/
id_31	facebook.com
lookwise.online	lookwise.online
promo.comoyo.online	promo.comoyo.online
stockId
Приймаються значення:

Параметр	Пояснення
1	Офіс
2	Зима
3	Нова Пошта
----
реально скоро час ночі, завтра в офіс.
буду дуже вдячний, якщо побачу зранку відтестований, закомічений, production конструктор для лендінгів і нарешті запущу рекламу одягу.