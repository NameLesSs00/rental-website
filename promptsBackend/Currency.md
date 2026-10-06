those are the new endpoints for the currenty control you should be create a plan so that we could add them to the system please add them like we just did to all of the other controls in the admin pages could you create a full plan for them using the same arch and smae everything ?

Currencies
Currency management endpoints for the global currency system. All prices in the system are stored in USD (base currency) and converted using these exchange rates.



GET
/api/currencies
Get all currencies


Parameters
Cancel
Name	Description
isActive
boolean
(query)
Optional filter for active currencies only


true
Accept-Language
string
(header)
Preferred language for response localization (en, fr, de, ru, ar). Default: en.


en
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://rentaltech.premiumasp.net/api/currencies?isActive=true' \
  -H 'accept: application/json' \
  -H 'Accept-Language: en' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InN1cGVyYWRtaW5AcHJvcGVydHltYW5hZ2VtZW50LmNvbSIsInVzZXJJZCI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsInVzZXJOYW1lIjoic3VwZXJhZG1pbiIsImZ1bGxOYW1lIjoiU3VwZXIgQWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdXBlckFkbWluIiwiZXhwIjoxNzkxMjk5ODA3LCJpc3MiOiJQcm9wZXJ0eU1hbmFnZW1lbnRBUEkiLCJhdWQiOiJQcm9wZXJ0eU1hbmFnZW1lbnRDbGllbnRzIn0.adJ-cpLYzrhDljD4cjv6bFFg2ro08O8a6kGzUKr7spM'
Request URL
https://rentaltech.premiumasp.net/api/currencies?isActive=true
Server response
Code	Details
200	
Response body
Download
{
  "data": [
    {
      "id": "33333333-3333-3333-3333-333333333333",
      "code": "EGP",
      "name": "Egyptian Pound",
      "symbol": "E£",
      "exchangeRate": 50,
      "decimalPlaces": 1,
      "isActive": true,
      "isBaseCurrency": false,
      "createdAtUtc": "2024-01-01T00:00:00",
      "updatedAtUtc": "2026-10-06T14:12:23.6071714"
    },
    {
      "id": "22222222-2222-2222-2222-222222222222",
      "code": "EUR",
      "name": "Euro",
      "symbol": "€",
      "exchangeRate": 0.92,
      "decimalPlaces": 2,
      "isActive": true,
      "isBaseCurrency": false,
      "createdAtUtc": "2024-01-01T00:00:00",
      "updatedAtUtc": null
    },
    {
      "id": "44444444-4444-4444-4444-444444444444",
      "code": "GBP",
      "name": "British Pound",
      "symbol": "£",
      "exchangeRate": 0.77,
      "decimalPlaces": 2,
      "isActive": true,
      "isBaseCurrency": false,
      "createdAtUtc": "2024-01-01T00:00:00",
      "updatedAtUtc": null
    },
    {
      "id": "55555555-5555-5555-5555-555555555555",
      "code": "RUB",
      "name": "Russian Ruble",
      "symbol": "₽",
      "exchangeRate": 80,
      "decimalPlaces": 2,
      "isActive": true,
      "isBaseCurrency": false,
      "createdAtUtc": "2024-01-01T00:00:00",
      "updatedAtUtc": null
    },
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "code": "USD",
      "name": "US Dollar",
      "symbol": "$",
      "exchangeRate": 1,
      "decimalPlaces": 2,
      "isActive": true,
      "isBaseCurrency": true,
      "createdAtUtc": "2024-01-01T00:00:00",
      "updatedAtUtc": null
    }
  ],
  "isSuccess": true,
  "message": null,
  "errors": [],
  "type": 200
}
Response headers
 content-language: en 
 content-type: application/json; charset=utf-8 
 date: Tue,06 Oct 2026 14:27:05 GMT 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

Media type

application/json
Controls Accept header.
Example Value
Schema
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "code": "string",
    "name": "string",
    "symbol": "string",
    "exchangeRate": 0,
    "decimalPlaces": 0,
    "isActive": true,
    "isBaseCurrency": true,
    "createdAtUtc": "2026-10-06T14:27:06.472Z",
    "updatedAtUtc": "2026-10-06T14:27:06.472Z"
  }
]
No links

POST
/api/currencies
Create a new currency


Creates a new currency with its exchange rate relative to USD.

Example: To create EUR with exchange rate where 1 USD = 0.92 EUR:

{
  "code": "EUR",
  "name": "Euro",
  "symbol": "€",
  "exchangeRate": 0.92,
  "decimalPlaces": 2
}
The exchange rate represents: 1 USD = [ExchangeRate] in target currency

USD must always have ExchangeRate = 1.0 (it's the base currency)
Exchange rate must be greater than 0
Currency code must be unique and exactly 3 characters
Parameters
Cancel
Reset
Name	Description
Accept-Language
string
(header)
Preferred language for response localization (en, fr, de, ru, ar). Default: en.


en
Request body

application/json
Currency creation data

{
  "code": "333",
  "name": "PolaUSD",
  "symbol": "PSD",
  "exchangeRate": 3,
  "decimalPlaces": 2
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://rentaltech.premiumasp.net/api/currencies' \
  -H 'accept: application/json' \
  -H 'Accept-Language: en' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InN1cGVyYWRtaW5AcHJvcGVydHltYW5hZ2VtZW50LmNvbSIsInVzZXJJZCI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsInVzZXJOYW1lIjoic3VwZXJhZG1pbiIsImZ1bGxOYW1lIjoiU3VwZXIgQWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdXBlckFkbWluIiwiZXhwIjoxNzkxMjk5ODA3LCJpc3MiOiJQcm9wZXJ0eU1hbmFnZW1lbnRBUEkiLCJhdWQiOiJQcm9wZXJ0eU1hbmFnZW1lbnRDbGllbnRzIn0.adJ-cpLYzrhDljD4cjv6bFFg2ro08O8a6kGzUKr7spM' \
  -H 'Content-Type: application/json' \
  -d '{
  "code": "333",
  "name": "PolaUSD",
  "symbol": "PSD",
  "exchangeRate": 3,
  "decimalPlaces": 2
}'
Request URL
https://rentaltech.premiumasp.net/api/currencies
Server response
Code	Details
201	
Response body
Download
{
  "data": {
    "id": "fdafb06c-c9f7-4e9f-b68a-0648778bbec5",
    "code": "333",
    "name": "PolaUSD",
    "symbol": "PSD",
    "exchangeRate": 3,
    "decimalPlaces": 2,
    "isActive": true,
    "isBaseCurrency": false,
    "createdAtUtc": "2026-10-06T14:25:56.1736034Z",
    "updatedAtUtc": null
  },
  "isSuccess": true,
  "message": null,
  "errors": [],
  "type": 200
}
Response headers
 access-control-allow-origin: * 
 content-language: en 
 content-type: application/json; charset=utf-8 
 date: Tue,06 Oct 2026 14:25:56 GMT 
 location: https://rentaltech.premiumasp.net/api/currencies/fdafb06c-c9f7-4e9f-b68a-0648778bbec5 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
201	
Created

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "code": "string",
  "name": "string",
  "symbol": "string",
  "exchangeRate": 0,
  "decimalPlaces": 0,
  "isActive": true,
  "isBaseCurrency": true,
  "createdAtUtc": "2026-10-06T14:27:06.478Z",
  "updatedAtUtc": "2026-10-06T14:27:06.478Z"
}
No links
400	
Bad Request

Media type

application/json
Example Value
Schema
{
  "type": "string",
  "title": "string",
  "status": 0,
  "detail": "string",
  "instance": "string",
  "additionalProp1": "string",
  "additionalProp2": "string",
  "additionalProp3": "string"
}
No links

GET
/api/currencies/{id}
Get currency by ID


Parameters
Cancel
Name	Description
id *
string($uuid)
(path)
Currency ID

fdafb06c-c9f7-4e9f-b68a-0648778bbec5
Accept-Language
string
(header)
Preferred language for response localization (en, fr, de, ru, ar). Default: en.


en
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://rentaltech.premiumasp.net/api/currencies/fdafb06c-c9f7-4e9f-b68a-0648778bbec5' \
  -H 'accept: application/json' \
  -H 'Accept-Language: en' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InN1cGVyYWRtaW5AcHJvcGVydHltYW5hZ2VtZW50LmNvbSIsInVzZXJJZCI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsInVzZXJOYW1lIjoic3VwZXJhZG1pbiIsImZ1bGxOYW1lIjoiU3VwZXIgQWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdXBlckFkbWluIiwiZXhwIjoxNzkxMjk5ODA3LCJpc3MiOiJQcm9wZXJ0eU1hbmFnZW1lbnRBUEkiLCJhdWQiOiJQcm9wZXJ0eU1hbmFnZW1lbnRDbGllbnRzIn0.adJ-cpLYzrhDljD4cjv6bFFg2ro08O8a6kGzUKr7spM'
Request URL
https://rentaltech.premiumasp.net/api/currencies/fdafb06c-c9f7-4e9f-b68a-0648778bbec5
Server response
Code	Details
200	
Response body
Download
{
  "data": {
    "id": "fdafb06c-c9f7-4e9f-b68a-0648778bbec5",
    "code": "333",
    "name": "PolaUSD",
    "symbol": "PSD",
    "exchangeRate": 3,
    "decimalPlaces": 2,
    "isActive": true,
    "isBaseCurrency": false,
    "createdAtUtc": "2026-10-06T14:25:56.1736034",
    "updatedAtUtc": null
  },
  "isSuccess": true,
  "message": null,
  "errors": [],
  "type": 200
}
Response headers
 content-language: en 
 content-type: application/json; charset=utf-8 
 date: Tue,06 Oct 2026 14:26:03 GMT 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "code": "string",
  "name": "string",
  "symbol": "string",
  "exchangeRate": 0,
  "decimalPlaces": 0,
  "isActive": true,
  "isBaseCurrency": true,
  "createdAtUtc": "2026-10-06T14:27:06.483Z",
  "updatedAtUtc": "2026-10-06T14:27:06.483Z"
}
No links
404	
Not Found

Media type

application/json
Example Value
Schema
{
  "type": "string",
  "title": "string",
  "status": 0,
  "detail": "string",
  "instance": "string",
  "additionalProp1": "string",
  "additionalProp2": "string",
  "additionalProp3": "string"
}
No links

PUT
/api/currencies/{id}
Update an existing currency


Updates currency details including exchange rate.

Rules:

USD exchange rate must always remain 1.0
Exchange rate must be greater than 0
You can activate/deactivate currencies via IsActive property
Parameters
Cancel
Reset
Name	Description
id *
string($uuid)
(path)
Currency ID

fdafb06c-c9f7-4e9f-b68a-0648778bbec5
Accept-Language
string
(header)
Preferred language for response localization (en, fr, de, ru, ar). Default: en.


en
Request body

application/json
Currency update data

{
  "name": "PolaUSD",
  "symbol": "PSD",
  "exchangeRate": 3,
  "decimalPlaces": 1,
  "isActive": true
}
Execute
Clear
Responses
Curl

curl -X 'PUT' \
  'https://rentaltech.premiumasp.net/api/currencies/fdafb06c-c9f7-4e9f-b68a-0648778bbec5' \
  -H 'accept: application/json' \
  -H 'Accept-Language: en' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InN1cGVyYWRtaW5AcHJvcGVydHltYW5hZ2VtZW50LmNvbSIsInVzZXJJZCI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsInVzZXJOYW1lIjoic3VwZXJhZG1pbiIsImZ1bGxOYW1lIjoiU3VwZXIgQWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdXBlckFkbWluIiwiZXhwIjoxNzkxMjk5ODA3LCJpc3MiOiJQcm9wZXJ0eU1hbmFnZW1lbnRBUEkiLCJhdWQiOiJQcm9wZXJ0eU1hbmFnZW1lbnRDbGllbnRzIn0.adJ-cpLYzrhDljD4cjv6bFFg2ro08O8a6kGzUKr7spM' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "PolaUSD",
  "symbol": "PSD",
  "exchangeRate": 3,
  "decimalPlaces": 1,
  "isActive": true
}'
Request URL
https://rentaltech.premiumasp.net/api/currencies/fdafb06c-c9f7-4e9f-b68a-0648778bbec5
Server response
Code	Details
200	
Response body
Download
{
  "data": {
    "id": "fdafb06c-c9f7-4e9f-b68a-0648778bbec5",
    "code": "333",
    "name": "PolaUSD",
    "symbol": "PSD",
    "exchangeRate": 3,
    "decimalPlaces": 1,
    "isActive": true,
    "isBaseCurrency": false,
    "createdAtUtc": "2026-10-06T14:25:56.1736034",
    "updatedAtUtc": "2026-10-06T14:26:45.1559785Z"
  },
  "isSuccess": true,
  "message": null,
  "errors": [],
  "type": 200
}
Response headers
 access-control-allow-origin: * 
 content-language: en 
 content-type: application/json; charset=utf-8 
 date: Tue,06 Oct 2026 14:26:44 GMT 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "code": "string",
  "name": "string",
  "symbol": "string",
  "exchangeRate": 0,
  "decimalPlaces": 0,
  "isActive": true,
  "isBaseCurrency": true,
  "createdAtUtc": "2026-10-06T14:27:06.489Z",
  "updatedAtUtc": "2026-10-06T14:27:06.489Z"
}
No links
400	
Bad Request

Media type

application/json
Example Value
Schema
{
  "type": "string",
  "title": "string",
  "status": 0,
  "detail": "string",
  "instance": "string",
  "additionalProp1": "string",
  "additionalProp2": "string",
  "additionalProp3": "string"
}
No links
404	
Not Found

Media type

application/json
Example Value
Schema
{
  "type": "string",
  "title": "string",
  "status": 0,
  "detail": "string",
  "instance": "string",
  "additionalProp1": "string",
  "additionalProp2": "string",
  "additionalProp3": "string"
}
No links

DELETE
/api/currencies/{id}
Delete a currency


Deletes a currency (soft delete following the project convention).

Important:

USD (base currency) cannot be deleted
Deletion is a soft delete - the currency is marked as deleted but remains in the database
Parameters
Cancel
Name	Description
id *
string($uuid)
(path)
Currency ID

fdafb06c-c9f7-4e9f-b68a-0648778bbec5
Accept-Language
string
(header)
Preferred language for response localization (en, fr, de, ru, ar). Default: en.


en
Execute
Clear
Responses
Curl

curl -X 'DELETE' \
  'https://rentaltech.premiumasp.net/api/currencies/fdafb06c-c9f7-4e9f-b68a-0648778bbec5' \
  -H 'accept: */*' \
  -H 'Accept-Language: en' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InN1cGVyYWRtaW5AcHJvcGVydHltYW5hZ2VtZW50LmNvbSIsInVzZXJJZCI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsInVzZXJOYW1lIjoic3VwZXJhZG1pbiIsImZ1bGxOYW1lIjoiU3VwZXIgQWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdXBlckFkbWluIiwiZXhwIjoxNzkxMjk5ODA3LCJpc3MiOiJQcm9wZXJ0eU1hbmFnZW1lbnRBUEkiLCJhdWQiOiJQcm9wZXJ0eU1hbmFnZW1lbnRDbGllbnRzIn0.adJ-cpLYzrhDljD4cjv6bFFg2ro08O8a6kGzUKr7spM'
Request URL
https://rentaltech.premiumasp.net/api/currencies/fdafb06c-c9f7-4e9f-b68a-0648778bbec5
Server response
Code	Details
200	
Response body
Download
{
  "data": true,
  "isSuccess": true,
  "message": null,
  "errors": [],
  "type": 200
}
Response headers
 access-control-allow-origin: * 
 content-language: en 
 content-type: application/json; charset=utf-8 
 date: Tue,06 Oct 2026 14:26:54 GMT 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

No links
400	
Bad Request

Media type

application/json
Example Value
Schema
{
  "type": "string",
  "title": "string",
  "status": 0,
  "detail": "string",
  "instance": "string",
  "additionalProp1": "string",
  "additionalProp2": "string",
  "additionalProp3": "string"
}
No links
404	
Not Found

Media type

application/json
Example Value
Schema
{
  "type": "string",
  "title": "string",
  "status": 0,
  "detail": "string",
  "instance": "string",
  "additionalProp1": "string",
  "additionalProp2": "string",
  "additionalProp3": "string"
}