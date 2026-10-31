GET
/api/properties
Get all properties


Parameters
Cancel
Name	Description
pageNumber
integer($int32)
(query)
1
pageSize
integer($int32)
(query)
10
Currency
string
(query)
USD
IsDeleted
boolean
(query)

--
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
  'https://rentaltech.premiumasp.net/api/properties?pageNumber=1&pageSize=10&Currency=USD&IsDeleted=false' \
  -H 'accept: application/json' \
  -H 'Accept-Language: en' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImVkODNjNzJhLTI1ZTctNGYyOC03NmIyLTA4ZGYwMDMyODYyOSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InBvbGE1c2FteTU1QGdtYWlsLmNvbSIsInVzZXJJZCI6ImVkODNjNzJhLTI1ZTctNGYyOC03NmIyLTA4ZGYwMDMyODYyOSIsInVzZXJOYW1lIjoicG9sYSIsImZ1bGxOYW1lIjoicG9sYSBwb2xhIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3VwZXJBZG1pbiIsImV4cCI6MTc5MzQ0NTUyMiwiaXNzIjoiUHJvcGVydHlNYW5hZ2VtZW50QVBJIiwiYXVkIjoiUHJvcGVydHlNYW5hZ2VtZW50Q2xpZW50cyJ9.iChkm898B08hVYXsiG0mfEgA3FDW_NettLSUCYw86yA'
Request URL
https://rentaltech.premiumasp.net/api/properties?pageNumber=1&pageSize=10&Currency=USD&IsDeleted=false
Server response
Code	Details
200	
Response body
Download
{
  "data": {
    "items": [
      {
        "id": "7b769750-a629-4b87-8a5c-cd2366a414bf",
        "propertyNumber": "PR-000034",
        "code": "406",
        "name": "Regency - Apartment - Unit 406",
        "bedroomNo": 1,
        "bathroomNo": 1,
        "size": 80,
        "capacity": 2,
        "basePriceInfo": {
          "baseAmount": 35,
          "baseCurrency": "USD",
          "amount": 35,
          "currency": "USD",
          "conversionRate": 1,
          "currencySymbol": "$"
        },
        "propertyType": 12,
        "propertyTypeName": "oneBedroom",
        "propertyStatus": "Dirty",
        "isAvailable": true,
        "isFeatured": false,
        "coverImageUrl": "uploads/properties/7b769750-a629-4b87-8a5c-cd2366a414bf/27713404-0748-48db-84ed-4e9798c793a6.webp",
        "city": "Hurghada",
        "country": "Egypt",
        "createdAtUtc": "2026-09-08T10:53:52.9876188"
      },
      {
        "id": "45e731a8-6d59-4b2f-a1d2-fe574e37fd05",
        "propertyNumber": "PR-000033",
        "code": "314",
        "name": "Regency - Apartment - Unit 314",
        "bedroomNo": 1,
        "bathroomNo": 1,
        "size": 80,
        "capacity": 2,
        "basePriceInfo": {
          "baseAmount": 35,
          "baseCurrency": "USD",
          "amount": 35,
          "currency": "USD",
          "conversionRate": 1,
          "currencySymbol": "$"
        },
        "propertyType": 12,
        "propertyTypeName": "oneBedroom",
        "propertyStatus": "Dirty",
        "isAvailable": true,
        "isFeatured": false,
        "coverImageUrl": "uploads/properties/45e731a8-6d59-4b2f-a1d2-fe574e37fd05/8cafabfb-9306-4687-8136-fc62272639c8.webp",
        "city": "Hurghada",
        "country": "Egypt",
        "createdAtUtc": "2026-09-08T10:53:29.6359028"
      },
      {
        "id": "fc388e9f-2751-407d-9558-d8ae8e0276ed",
        "propertyNumber": "PR-000032",
        "code": "21",
        "name": "westside village - Apartment - Unit 21",
        "bedroomNo": 2,
        "bathroomNo": 1,
        "size": 118,
        "capacity": 4,
        "basePriceInfo": {
          "baseAmount": 55,
          "baseCurrency": "USD",
          "amount": 55,
          "currency": "USD",
          "conversionRate": 1,
          "currencySymbol": "$"
        },
        "propertyType": 11,
        "propertyTypeName": "twoBedroom",
        "propertyStatus": "Dirty",
        "isAvailable": true,
        "isFeatured": false,
        "coverImageUrl": "uploads/properties/fc388e9f-2751-407d-9558-d8ae8e0276ed/283acdfd-58d9-4160-aecd-64548bbf3ec2.webp",
        "city": "Hurghada",
        "country": "Egypt",
        "createdAtUtc": "2026-09-08T10:52:27.9432885"
      },
      {
        "id": "af7649ae-5a7f-46f4-bfaf-d39fd6d592ee",
        "propertyNumber": "PR-000031",
        "code": "309",
        "name": "Regency - Apartment - Unit 309",
        "bedroomNo": 2,
        "bathroomNo": 2,
        "size": 100,
        "capacity": 4,
        "basePriceInfo": {
          "baseAmount": 55,
          "baseCurrency": "USD",
          "amount": 55,
          "currency": "USD",
          "conversionRate": 1,
          "currencySymbol": "$"
        },
        "propertyType": 11,
        "propertyTypeName": "twoBedroom",
        "propertyStatus": "Dirty",
        "isAvailable": true,
        "isFeatured": false,
        "coverImageUrl": "uploads/properties/af7649ae-5a7f-46f4-bfaf-d39fd6d592ee/22ced748-93ea-4ec2-9a25-4efe0e805acd.webp",
        "city": "Hurghada",
        "country": "Egypt",
        "createdAtUtc": "2026-09-08T10:51:52.7080761"
      },
      {
        "id": "ae280061-23ea-4d80-9068-4016c098165f",
        "propertyNumber": "PR-000030",
        "code": "24",
        "name": "westside village - Apartment - Unit 24",
        "bedroomNo": 1,
        "bathroomNo": 1,
        "size": 60,
        "capacity": 2,
        "basePriceInfo": {
          "baseAmount": 100,
          "baseCurrency": "USD",
          "amount": 100,
          "currency": "USD",
          "conversionRate": 1,
          "currencySymbol": "$"
        },
        "propertyType": 12,
        "propertyTypeName": "oneBedroom",
        "propertyStatus": "Clean",
        "isAvailable": true,
        "isFeatured": false,
        "coverImageUrl": "uploads/properties/ae280061-23ea-4d80-9068-4016c098165f/0d913800-2ef5-4552-a263-597f7f53add1.webp",
        "city": "Hurghada",
        "country": "Egypt",
        "createdAtUtc": "2026-09-08T10:50:35.5230234"
      },
      {
        "id": "d7d02a40-86f0-40b5-800b-c419e3faead3",
        "propertyNumber": "PR-000029",
        "code": "403",
        "name": "Regency - Apartment - Unit 403",
        "bedroomNo": 1,
        "bathroomNo": 1,
        "size": 80,
        "capacity": 2,
        "basePriceInfo": {
          "baseAmount": 35,
          "baseCurrency": "USD",
          "amount": 35,
          "currency": "USD",
          "conversionRate": 1,
          "currencySymbol": "$"
        },
        "propertyType": 12,
        "propertyTypeName": "oneBedroom",
        "propertyStatus": "Clean",
        "isAvailable": true,
        "isFeatured": false,
        "coverImageUrl": "uploads/properties/d7d02a40-86f0-40b5-800b-c419e3faead3/dfc69a20-f767-498f-a36f-82b498c4900a.webp",
        "city": "Hurghada",
        "country": "Egypt",
        "createdAtUtc": "2026-09-08T10:49:40.0609214"
      },
      {
        "id": "cb11aaaa-92f6-4d9f-81d6-c197b5bc11f2",
        "propertyNumber": "PR-000028",
        "code": "311",
        "name": "Regency - Apartment - Unit 311",
        "bedroomNo": 1,
        "bathroomNo": 1,
        "size": 1,
        "capacity": 2,
        "basePriceInfo": {
          "baseAmount": 35,
          "baseCurrency": "USD",
          "amount": 35,
          "currency": "USD",
          "conversionRate": 1,
          "currencySymbol": "$"
        },
        "propertyType": 12,
        "propertyTypeName": "oneBedroom",
        "propertyStatus": "Dirty",
        "isAvailable": true,
        "isFeatured": false,
        "coverImageUrl": "uploads/properties/cb11aaaa-92f6-4d9f-81d6-c197b5bc11f2/4c460514-d4d7-4701-91e3-ecff914662a8.webp",
        "city": "Hurghada",
        "country": "Egypt",
        "createdAtUtc": "2026-09-08T10:48:22.8174539"
      },
      {
        "id": "2b273a9e-6dc0-437b-a77f-965e861dc93e",
        "propertyNumber": "PR-000027",
        "code": "12413",
        "name": "Aldau - Apartment - Unit 12413",
        "bedroomNo": 1,
        "bathroomNo": 1,
        "size": 80,
        "capacity": 2,
        "basePriceInfo": {
          "baseAmount": 40,
          "baseCurrency": "USD",
          "amount": 40,
          "currency": "USD",
          "conversionRate": 1,
          "currencySymbol": "$"
        },
        "propertyType": 1,
        "propertyTypeName": "Apartment",
        "propertyStatus": "Dirty",
        "isAvailable": true,
        "isFeatured": false,
        "coverImageUrl": "uploads/properties/2b273a9e-6dc0-437b-a77f-965e861dc93e/a7d0af33-3610-4373-bba5-5232a64ce6ee.webp",
        "city": "Hurghada",
        "country": "Egypt",
        "createdAtUtc": "2026-09-08T10:46:22.473119"
      },
      {
        "id": "e35b495c-8584-4589-a128-aeecc471362d",
        "propertyNumber": "PR-000026",
        "code": "3213",
        "name": "Aldau - Apartment - Unit 3213",
        "bedroomNo": 1,
        "bathroomNo": 1,
        "size": 80,
        "capacity": 2,
        "basePriceInfo": {
          "baseAmount": 29,
          "baseCurrency": "USD",
          "amount": 29,
          "currency": "USD",
          "conversionRate": 1,
          "currencySymbol": "$"
        },
        "propertyType": 12,
        "propertyTypeName": "oneBedroom",
        "propertyStatus": "Clean",
        "isAvailable": true,
        "isFeatured": false,
        "coverImageUrl": "uploads/properties/e35b495c-8584-4589-a128-aeecc471362d/88c3b425-3955-4020-8134-15aed7a91409.webp",
        "city": "Hurghada",
        "country": "Egypt",
        "createdAtUtc": "2026-09-08T10:46:07.9862089"
      },
      {
        "id": "1d6515fe-b216-4983-8e0d-f7f0e2ba2756",
        "propertyNumber": "PR-000025",
        "code": "3314",
        "name": "Aldau - Apartment - Unit 3314",
        "bedroomNo": 1,
        "bathroomNo": 1,
        "size": 80,
        "capacity": 2,
        "basePriceInfo": {
          "baseAmount": 40,
          "baseCurrency": "USD",
          "amount": 40,
          "currency": "USD",
          "conversionRate": 1,
          "currencySymbol": "$"
        },
        "propertyType": 12,
        "propertyTypeName": "oneBedroom",
        "propertyStatus": "Clean",
        "isAvailable": true,
        "isFeatured": false,
        "coverImageUrl": "uploads/properties/1d6515fe-b216-4983-8e0d-f7f0e2ba2756/384ca025-eb54-43c6-bd06-04ffa8a18b8a.webp",
        "city": "Hurghada",
        "country": "Egypt",
        "createdAtUtc": "2026-09-08T10:45:19.248025"
      }
    ],
    "pageNumber": 1,
    "pageSize": 10,
    "totalCount": 34,
    "totalPages": 4,
    "hasPreviousPage": false,
    "hasNextPage": true
  },
  "isSuccess": true,
  "message": null,
  "errors": [],
  "type": 200
}
Response headers
 content-language: en 
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 10:19:29 GMT 
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
  "items": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "propertyNumber": "string",
      "code": "string",
      "name": "string",
      "bedroomNo": 0,
      "bathroomNo": 0,
      "size": 0,
      "capacity": 0,
      "basePriceInfo": {
        "baseAmount": 0,
        "baseCurrency": "string",
        "amount": 0,
        "currency": "string",
        "conversionRate": 0,
        "currencySymbol": "string"
      },
      "propertyType": 1,
      "propertyTypeName": "string",
      "propertyStatus": "string",
      "isAvailable": true,
      "isFeatured": true,
      "coverImageUrl": "string",
      "city": "string",
      "country": "string",
      "createdAtUtc": "2026-10-31T10:19:55.345Z"
    }
  ],
  "pageNumber": 0,
  "pageSize": 0,
  "totalCount": 0,
  "totalPages": 0,
  "hasPreviousPage": true,
  "hasNextPage": true
}
No links

GET
/api/properties/{id}
Get property by id



PUT
/api/properties/{id}
Update property



DELETE
/api/properties/{id}
Delete property


Parameters
Cancel
Name	Description
id *
string($uuid)
(path)
8fd44421-6bca-4c0a-ad69-f5bba111dfb9
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
  'https://rentaltech.premiumasp.net/api/properties/8fd44421-6bca-4c0a-ad69-f5bba111dfb9' \
  -H 'accept: */*' \
  -H 'Accept-Language: en' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImVkODNjNzJhLTI1ZTctNGYyOC03NmIyLTA4ZGYwMDMyODYyOSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InBvbGE1c2FteTU1QGdtYWlsLmNvbSIsInVzZXJJZCI6ImVkODNjNzJhLTI1ZTctNGYyOC03NmIyLTA4ZGYwMDMyODYyOSIsInVzZXJOYW1lIjoicG9sYSIsImZ1bGxOYW1lIjoicG9sYSBwb2xhIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3VwZXJBZG1pbiIsImV4cCI6MTc5MzQ0NTUyMiwiaXNzIjoiUHJvcGVydHlNYW5hZ2VtZW50QVBJIiwiYXVkIjoiUHJvcGVydHlNYW5hZ2VtZW50Q2xpZW50cyJ9.iChkm898B08hVYXsiG0mfEgA3FDW_NettLSUCYw86yA'
Request URL
https://rentaltech.premiumasp.net/api/properties/8fd44421-6bca-4c0a-ad69-f5bba111dfb9
Server response
Code	Details
200	
Response body
Download
{
  "isSuccess": true,
  "message": "Property deleted successfully",
  "errors": [],
  "type": 200
}
Response headers
 access-control-allow-origin: * 
 content-language: en 
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 10:19:07 GMT 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

No links

PUT
/api/properties/{id}/restore
Restore a soft-deleted property


Parameters
Cancel
Name	Description
id *
string($uuid)
(path)
8fd44421-6bca-4c0a-ad69-f5bba111dfb9
Accept-Language
string
(header)
Preferred language for response localization (en, fr, de, ru, ar). Default: en.


en
Execute
Clear
Responses
Curl

curl -X 'PUT' \
  'https://rentaltech.premiumasp.net/api/properties/8fd44421-6bca-4c0a-ad69-f5bba111dfb9/restore' \
  -H 'accept: */*' \
  -H 'Accept-Language: en' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImVkODNjNzJhLTI1ZTctNGYyOC03NmIyLTA4ZGYwMDMyODYyOSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InBvbGE1c2FteTU1QGdtYWlsLmNvbSIsInVzZXJJZCI6ImVkODNjNzJhLTI1ZTctNGYyOC03NmIyLTA4ZGYwMDMyODYyOSIsInVzZXJOYW1lIjoicG9sYSIsImZ1bGxOYW1lIjoicG9sYSBwb2xhIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3VwZXJBZG1pbiIsImV4cCI6MTc5MzQ0NTUyMiwiaXNzIjoiUHJvcGVydHlNYW5hZ2VtZW50QVBJIiwiYXVkIjoiUHJvcGVydHlNYW5hZ2VtZW50Q2xpZW50cyJ9.iChkm898B08hVYXsiG0mfEgA3FDW_NettLSUCYw86yA'
Request URL
https://rentaltech.premiumasp.net/api/properties/8fd44421-6bca-4c0a-ad69-f5bba111dfb9/restore
Server response
Code	Details
200	
Response body
Download
{
  "isSuccess": true,
  "message": "Property restored successfully",
  "errors": [],
  "type": 200
}
Response headers
 access-control-allow-origin: * 
 content-language: en 
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 10:19:54 GMT 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK