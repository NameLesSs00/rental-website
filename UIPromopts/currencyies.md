now we need to create a plan so that the wat we show the currency should be changed most of our data now have this new object that is basePriceInfo using it we should show the currency that the user want after he selects the currecy he want from three locaotins that is the filter in the hero in the homepage and in teh filters in the filtes section in the rent and bug page and also in the single rent , bug page okay the new filter we make us be able to choose from all of the currency we have and we should view that in every place that this currey is at okay ?
that means in each and everyplace we have currency we need to make sure we change it right as needed
also note that when we create a buy prop now it should send the USD to be the deaflut and we should not let the user be able to change that when he creates a new buy prop and we will change it as need 

could you now create a full plan so that we show the pirces right as the user wishs to ?
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
          "amount": 1750,
          "currency": "EGP",
          "conversionRate": 50,
          "currencySymbol": "E£"
        },

        "data": {
    "id": "7b769750-a629-4b87-8a5c-cd2366a414bf",
    "propertyNumber": "PR-000034",
    "code": "406",
    "name": "Regency - Apartment - Unit 406",
    "description": "One bedroom apartment fully furnished with all the kitchen appliances 4th floor, located in regency towers complex el kawther district near promenade street ( mamsha ) and Sindbad hotel  80 square meters.",
    "bedroomNo": 1,
    "bathroomNo": 1,
    "roomNo": 406,
    "capacity": 2,
    "size": 80,
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
    "propertyStatus": 2,
    "propertyStatusName": "Dirty",
    "isAvailable": true,
    "isFeatured": false,
    "hasSeaView": false,
    "hasPoolView": false,
    "hasGardenView": false,
    "hasMountainView": false,
    "hasCityView": true,
    ..
        }

        GET
/api/properties/{id}
Get property by id


Parameters
Cancel
Name	Description
id *
string($uuid)
(path)
7b769750-a629-4b87-8a5c-cd2366a414bf
Currency
string
(query)
USD


 {
        "id": "ffef0525-6cc1-4785-dac6-08df1cb4ec0a",
        "propertyNumber": "PB-000003",
        "title": "studio pool view aldau heights",
        "priceInfo": {
          "baseAmount": 95000,
          "baseCurrency": "USD",
          "amount": 95000,
          "currency": "USD",
          "conversionRate": 1,
          "currencySymbol": "$"
        },
        "propertyTypeId": 3,
        "status": 1,
        "isFeatured": true,
        "isPublished": true,
        "bedrooms": 1,
        "bathrooms": 1,
        "area": 63,
        "coverImageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/e1fa1869-84c5-4c5d-9d05-8e27918ff817.webp",
        "city": "Hurghada 1",
        "areaName": "el kawther ",
        "category": null
      },

      GET
/api/property-buyings/{id}
Get property buying by id (Admin)


Parameters
Cancel
Name	Description
id *
string($uuid)
(path)
ffef0525-6cc1-4785-dac6-08df1cb4ec0a
Currency
string
(query)
EGP
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
  'https://rentaltech.premiumasp.net/api/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a?Currency=EGP' \
  -H 'accept: application/json' \
  -H 'Accept-Language: en' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InN1cGVyYWRtaW5AcHJvcGVydHltYW5hZ2VtZW50LmNvbSIsInVzZXJJZCI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsInVzZXJOYW1lIjoic3VwZXJhZG1pbiIsImZ1bGxOYW1lIjoiU3VwZXIgQWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdXBlckFkbWluIiwiZXhwIjoxNzkxMjk5ODA3LCJpc3MiOiJQcm9wZXJ0eU1hbmFnZW1lbnRBUEkiLCJhdWQiOiJQcm9wZXJ0eU1hbmFnZW1lbnRDbGllbnRzIn0.adJ-cpLYzrhDljD4cjv6bFFg2ro08O8a6kGzUKr7spM'
Request URL
https://rentaltech.premiumasp.net/api/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a?Currency=EGP
Server response
Code	Details
200	
Response body
Download
{
  "data": {
    "id": "ffef0525-6cc1-4785-dac6-08df1cb4ec0a",
    "propertyNumber": "PB-000003",
    "title": "studio pool view aldau heights",
    "description": "studio pool view at al dau heights on 3rd floor with furniture, maintenance paid. has big kitchen with all the kitchen appliances",
    "priceInfo": {
      "baseAmount": 95000,
      "baseCurrency": "USD",
      "amount": 4750000,
      "currency": "EGP",
      "conversionRate": 50,
      "currencySymbol": "E£"
    },
    "propertyTypeId": 3,
    "status": 1,
    "isFeatured": true,
    "isPublished": true,
    "bedrooms": 1,
    "bathrooms": 1,
    "floors": 3,
    "garage": 0,
    "area": 63,
    "yearBuilt": 2023,
    "latitude": 0,
    "longitude": 0,
    "videoUrl": "",
    "virtualTourUrl": "",
    "category": null,
    "address": {
      "id": "391c5d96-37ec-4f95-ba32-dcd033c50db9",
      "country": "Egypt",
      "state": "state",
      "city": "Hurghada 1",
      "area": "el kawther ",
      "street": "aldau heights phase ",
      "zipCode": "84511"
    },
    "images": [
      {
        "id": "8f2d5fae-b836-43ba-9ccb-f656e061c449",
        "imageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/d96cb450-d9cb-4148-b3ed-0bc20897b177.webp",
        "displayOrder": 1,
        "isCover": false
      },
      {
        "id": "6221ffa8-64ab-4be0-b1dc-5ca781448e48",
        "imageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/80b64ad2-57d8-4406-b712-7bcbe4c6bbcc.webp",
        "displayOrder": 2,
        "isCover": false
      },
      {
        "id": "285f13bf-8b16-4c78-b0ac-fba525825151",
        "imageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/f32b7b6f-9103-4b83-be2a-1e1b720b48b6.webp",
        "displayOrder": 3,
        "isCover": false
      },
      {
        "id": "a5983b1d-7b30-4abc-b78b-323f5f066e7e",
        "imageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/e1fa1869-84c5-4c5d-9d05-8e27918ff817.webp",
        "displayOrder": 4,
        "isCover": true
      },
      {
        "id": "97485c01-492f-4c32-b3ec-a26010d3ee0f",
        "imageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/31f08984-a6ef-4542-8d80-912ac3b40d12.webp",
        "displayOrder": 5,
        "isCover": false
      },
      {
        "id": "cfe053e3-23c3-4770-b18a-f39e13cb7db7",
        "imageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/c609c5aa-04ff-4de3-9f93-9795c7a20851.webp",
        "displayOrder": 6,
        "isCover": false
      },
      {
        "id": "9bc75913-50d2-4cb8-9230-91e5fcda6717",
        "imageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/f1467845-1cf7-46bb-98b9-5d9bec40976d.webp",
        "displayOrder": 7,
        "isCover": false
      },
      {
        "id": "377b41f4-3f58-47d7-b3de-16dde245514f",
        "imageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/814057ee-561f-43c2-bdcc-0d63a1f0cb11.webp",
        "displayOrder": 8,
        "isCover": false
      },
      {
        "id": "aea31d44-25e5-4dd1-a375-16cc6eb6b911",
        "imageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/d62cd24d-577e-418f-83e1-afede61b0c04.webp",
        "displayOrder": 9,
        "isCover": false
      },
      {
        "id": "db82b7c6-7f41-4dd5-a01b-8d6579d81669",
        "imageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/f25f8c9b-9714-4e5b-b25e-d9e0a7ed0e05.webp",
        "displayOrder": 10,
        "isCover": false
      },
      {
        "id": "41375bc0-20c6-446a-88cd-20bae5bcfb85",
        "imageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/071c0139-a4c9-42c6-b552-27cd4bcab847.webp",
        "displayOrder": 11,
        "isCover": false
      },
      {
        "id": "7cfcfb82-ae1e-42d6-97f1-3a233dfec393",
        "imageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/3488ff59-581a-47bb-83ea-be5166a2540e.webp",
        "displayOrder": 12,
        "isCover": false
      },
      {
        "id": "e3dfcc58-2a7b-4a49-bd95-58598ba1705c",
        "imageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/a1c282ef-0af2-4f0d-a7f2-935bfa9c8414.webp",
        "displayOrder": 13,
        "isCover": false
      },
      {
        "id": "84e891a0-af6f-433d-9524-980b639d2cf9",
        "imageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/cc64f4da-0306-4bd2-ad2a-454953dac4c3.webp",
        "displayOrder": 14,
        "isCover": false
      },
      {
        "id": "c5864dc5-82cf-4f59-820a-4adb9828c2cf",
        "imageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/3e266b02-efb4-4655-802f-aae0c02db4ee.webp",
        "displayOrder": 15,
        "isCover": false
      },
      {
        "id": "018bdbae-58a5-4a38-b4e2-c38bd2c2caa9",
        "imageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/c2e8b657-ad0d-4051-a912-5cf51c62611f.webp",
        "displayOrder": 16,
        "isCover": false
      },
      {
        "id": "aab9caa4-c0e5-4fd4-9f73-7fe569d74118",
        "imageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/a04b66c9-3203-46b0-92e2-8b4153ad9e13.webp",
        "displayOrder": 17,
        "isCover": false
      },
      {
        "id": "f41dd870-a48a-4069-9710-0dd25b5cf591",
        "imageUrl": "uploads/property-buyings/ffef0525-6cc1-4785-dac6-08df1cb4ec0a/c60e2d01-f021-4d60-ab61-20d2e4cb7ffb.webp",
        "displayOrder": 18,
        "isCover": false
      }
    ],
    "categoryValues": []
  },
  "isSuccess": true,
  "message": null,
  "errors": [],
  "type": 200
}
