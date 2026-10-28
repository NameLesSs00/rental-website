okay now here is the plan first of all we after we book we will use this new endpoint the
POST
/api/payments/initialize
Initialize Paymob payment for a booking and retrieve the Unified Checkout URL


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
Request containing Booking ID

{
  "bookingId": "07724db2-842e-46ea-951e-ad010b7f69ea"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://rentaltech.premiumasp.net/api/payments/initialize' \
  -H 'accept: application/json' \
  -H 'Accept-Language: en' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InN1cGVyYWRtaW5AcHJvcGVydHltYW5hZ2VtZW50LmNvbSIsInVzZXJJZCI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsInVzZXJOYW1lIjoic3VwZXJhZG1pbiIsImZ1bGxOYW1lIjoiU3VwZXIgQWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdXBlckFkbWluIiwiZXhwIjoxNzkzMTE3OTA0LCJpc3MiOiJQcm9wZXJ0eU1hbmFnZW1lbnRBUEkiLCJhdWQiOiJQcm9wZXJ0eU1hbmFnZW1lbnRDbGllbnRzIn0.FmBrtBluPCtMqVjlInYaGzQqZwHok6CwZTt7sz3dToY' \
  -H 'Content-Type: application/json' \
  -d '{
  "bookingId": "6d6aeacc-b0ba-4aca-a4e2-dce5838b9cfe"
}'
Request URL
https://rentaltech.premiumasp.net/api/payments/initialize
Server response
Code	Details
200	
Response body
Download
{
  "data": {
    "paymentId": "7a08332c-bb58-48bc-8793-6e03cd357c1b",
    "bookingId": "6d6aeacc-b0ba-4aca-a4e2-dce5838b9cfe",
    "bookingNumber": "BK-000117",
    "payPalOrderId": "640806472",
    "providerOrderId": "640806472",
    "approveUrl": "https://accept.paymob.com/unifiedcheckout/?publicKey=egy_pk_test_vzFIi703p3QjptQKTQACStHySHdjPszY&clientSecret=egy_csk_test_865ab8bfd1dc3b2be52376a999ff2d99",
    "checkoutUrl": "https://accept.paymob.com/unifiedcheckout/?publicKey=egy_pk_test_vzFIi703p3QjptQKTQACStHySHdjPszY&clientSecret=egy_csk_test_865ab8bfd1dc3b2be52376a999ff2d99",
    "amount": 672.11,
    "currency": "EGP",
    "bookingStatus": "PendingPayment",
    "paymentStatus": "Pending"
  },
  "isSuccess": true,
  "message": "Paymob payment initialized successfully",
  "errors": [],
  "type": 200
}
we will take the link here nad redirect it to the website but before that we want to give him a notifctoin so that it tell him in all langues he has 5 mins to pay or booking will be cancled okay
after he pay he will be redcirect to our website with this link
https://www.google.com/?id=561792180&pending=false&amount_cents=44807&success=true&is_auth=false&is_capture=false&is_standalone_payment=true&is_voided=false&is_refunded=false&is_3d_secure=true&integration_id=5177247&profile_id=1058389&has_parent_transaction=false&order=640800700&created_at=2026-10-27T18%3A29%3A22.475425&currency=EGP&merchant_commission=0&accept_fees=0&discount_details=%5B%5D&amount_cents_int=44807&is_void=false&is_refund=false&error_occured=false&refunded_amount_cents=0&refunded_amount_cents_int=0&captured_amount=0&captured_amount_int=0&settlement_amount_cents_int=0&accept_fees_cents_int=0&vat_cents_int=0&updated_at=2026-10-27T18%3A29%3A43.920098&is_settled=false&bill_balanced=false&is_bill=false&owner=1997347&merchant_order_id=72c8327e-1201-4e1b-8f45-fdb6518ee891&data.message=Approved&source_data.type=card&source_data.pan=1111&source_data.sub_type=Visa&acq_response_code=00&txn_response_code=APPROVED&hmac=3fb38b0bb7041647b0eab6964c3d0976deeb50165df3a755f24dec67a371d81f0a1a4df4c5f91b8dfc81faf1aa561408bc6607adbc20b775983b7f7c65459264

the google will be our domain but we can see that the url shows that the &success=true so that the rest is done we should save the bookingNumber so that we could show it in the page for the success and show all of the data like how much did he pay and any info extra if success is false then the page for the C:\Users\VIP\Desktop\work\rental-website\app\[locale]\(code)\payment\success success will also be called that means we will not use the cancel at all and we should handle that in the success too okay?
also here are more endpoints in case data changed fom the defalt schma 

GET
/api/payments/booking/{bookingId}
Get all payments for a booking


Parameters
Cancel
Name	Description
bookingId *
string($uuid)
(path)
Booking ID

07724db2-842e-46ea-951e-ad010b7f69ea
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
  'https://rentaltech.premiumasp.net/api/payments/booking/07724db2-842e-46ea-951e-ad010b7f69ea' \
  -H 'accept: application/json' \
  -H 'Accept-Language: en' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InN1cGVyYWRtaW5AcHJvcGVydHltYW5hZ2VtZW50LmNvbSIsInVzZXJJZCI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsInVzZXJOYW1lIjoic3VwZXJhZG1pbiIsImZ1bGxOYW1lIjoiU3VwZXIgQWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdXBlckFkbWluIiwiZXhwIjoxNzkzMTE3OTA0LCJpc3MiOiJQcm9wZXJ0eU1hbmFnZW1lbnRBUEkiLCJhdWQiOiJQcm9wZXJ0eU1hbmFnZW1lbnRDbGllbnRzIn0.FmBrtBluPCtMqVjlInYaGzQqZwHok6CwZTt7sz3dToY'
Request URL
https://rentaltech.premiumasp.net/api/payments/booking/07724db2-842e-46ea-951e-ad010b7f69ea
Server response
Code	Details
200	
Response body
Download
{
  "data": [
    {
      "id": "c1bf0fa1-4860-428d-b9b9-3b7b5b40249b",
      "bookingId": "07724db2-842e-46ea-951e-ad010b7f69ea",
      "bookingExtensionId": null,
      "amount": 72,
      "currency": "USD",
      "provider": 3,
      "providerName": "Cash",
      "paymentType": 1,
      "paymentTypeName": "Booking",
      "payPalOrderId": null,
      "providerOrderId": null,
      "payPalCaptureId": null,
      "transactionId": "ADMIN-PAIDALL-03bb1388bcb247bc80b2480f726aa027",
      "payerEmail": null,
      "status": 3,
      "statusName": "Paid",
      "failureReason": null,
      "createdAtUtc": "2026-10-27T15:30:54.4060338",
      "paidAt": "2026-10-27T15:30:54.364372",
      "refundedAt": null
    },
    {
      "id": "72c8327e-1201-4e1b-8f45-fdb6518ee891",
      "bookingId": "07724db2-842e-46ea-951e-ad010b7f69ea",
      "bookingExtensionId": null,
      "amount": 448.07,
      "currency": "EGP",
      "provider": 4,
      "providerName": "Paymob",
      "paymentType": 1,
      "paymentTypeName": "Booking",
      "payPalOrderId": "640800700",
      "providerOrderId": "640800700",
      "payPalCaptureId": "561792180",
      "transactionId": "561792180",
      "payerEmail": "1111",
      "status": 3,
      "statusName": "Paid",
      "failureReason": null,
      "createdAtUtc": "2026-10-27T15:28:52.0221737",
      "paidAt": "2026-10-27T15:29:43.7119357",
      "refundedAt": null
    }
  ],
  "isSuccess": true,
  "message": null,
  "errors": [],
  "type": 200
}
Response
GET
/api/property-bookings/{id}
Get property booking by ID with complete details


Parameters
Cancel
Name	Description
id *
string($uuid)
(path)
Booking ID

07724db2-842e-46ea-951e-ad010b7f69ea
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
  'https://rentaltech.premiumasp.net/api/property-bookings/07724db2-842e-46ea-951e-ad010b7f69ea' \
  -H 'accept: application/json' \
  -H 'Accept-Language: en' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InN1cGVyYWRtaW5AcHJvcGVydHltYW5hZ2VtZW50LmNvbSIsInVzZXJJZCI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsInVzZXJOYW1lIjoic3VwZXJhZG1pbiIsImZ1bGxOYW1lIjoiU3VwZXIgQWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdXBlckFkbWluIiwiZXhwIjoxNzkzMTE3OTA0LCJpc3MiOiJQcm9wZXJ0eU1hbmFnZW1lbnRBUEkiLCJhdWQiOiJQcm9wZXJ0eU1hbmFnZW1lbnRDbGllbnRzIn0.FmBrtBluPCtMqVjlInYaGzQqZwHok6CwZTt7sz3dToY'
Request URL
https://rentaltech.premiumasp.net/api/property-bookings/07724db2-842e-46ea-951e-ad010b7f69ea
Server response
Code	Details
200	
Response body
Download
{
  "data": {
    "id": "07724db2-842e-46ea-951e-ad010b7f69ea",
    "bookingId": "07724db2-842e-46ea-951e-ad010b7f69ea",
    "bookingNumber": "BK-000116",
    "status": 2,
    "statusName": "Confirmed",
    "bookingSource": "Website",
    "bookingSourceName": "Website",
    "calculatedPrice": 0,
    "actualPrice": null,
    "effectivePrice": 0,
    "totalPrice": 80,
    "requiredPaymentAmount": 8,
    "paidAmount": 80,
    "remainingAmount": 0,
    "createdAtUtc": "2026-10-27T15:28:32.3666738",
    "confirmedAt": "2026-10-27T15:29:43.7377104",
    "completedAt": null,
    "property": {
      "propertyId": "689dd5a2-0028-4404-b1dd-798b87a94b00",
      "propertyNumber": "PR-000011",
      "propertyName": "Aldau - Studio - Unit 3211",
      "address": "NA, Hurghada, Egypt"
    },
    "guest": {
      "fullName": "xvcfds",
      "email": "test@123.com",
      "phone": "12312312",
      "person": 1
    },
    "stay": {
      "checkIn": "2026-11-01",
      "checkOut": "2026-11-03",
      "numberOfNights": 2
    },
    "price": {
      "totalPrice": 80,
      "pricePerNight": 40
    }
  },
  "isSuccess": true,
  "message": null,
  "errors": [],
  "type": 200
}

POST
/api/property-bookings/{bookingId}/mark-as-paid-all
Administrative endpoint to mark the remaining Property Booking balance as fully paid


Parameters
Cancel
Name	Description
bookingId *
string($uuid)
(path)
Booking ID

07724db2-842e-46ea-951e-ad010b7f69ea+
Accept-Language
string
(header)
Preferred language for response localization (en, fr, de, ru, ar). Default: en.


en
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://rentaltech.premiumasp.net/api/property-bookings/07724db2-842e-46ea-951e-ad010b7f69ea/mark-as-paid-all' \
  -H 'accept: application/json' \
  -H 'Accept-Language: en' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InN1cGVyYWRtaW5AcHJvcGVydHltYW5hZ2VtZW50LmNvbSIsInVzZXJJZCI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsInVzZXJOYW1lIjoic3VwZXJhZG1pbiIsImZ1bGxOYW1lIjoiU3VwZXIgQWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdXBlckFkbWluIiwiZXhwIjoxNzkzMTE3OTA0LCJpc3MiOiJQcm9wZXJ0eU1hbmFnZW1lbnRBUEkiLCJhdWQiOiJQcm9wZXJ0eU1hbmFnZW1lbnRDbGllbnRzIn0.FmBrtBluPCtMqVjlInYaGzQqZwHok6CwZTt7sz3dToY' \
  -d ''
Request URL
https://rentaltech.premiumasp.net/api/property-bookings/07724db2-842e-46ea-951e-ad010b7f69ea/mark-as-paid-all
Server response
Code	Details
200	
Response body
Download
{
  "data": {
    "id": "07724db2-842e-46ea-951e-ad010b7f69ea",
    "bookingId": "07724db2-842e-46ea-951e-ad010b7f69ea",
    "bookingNumber": "BK-000116",
    "status": 2,
    "statusName": "Confirmed",
    "bookingSource": "Website",
    "bookingSourceName": "Website",
    "calculatedPrice": 0,
    "actualPrice": null,
    "effectivePrice": 0,
    "totalPrice": 80,
    "requiredPaymentAmount": 8,
    "paidAmount": 80,
    "remainingAmount": 0,
    "createdAtUtc": "2026-10-27T15:28:32.3666738",
    "confirmedAt": "2026-10-27T15:29:43.7377104",
    "completedAt": null,
    "property": {
      "propertyId": "689dd5a2-0028-4404-b1dd-798b87a94b00",
      "propertyNumber": "PR-000011",
      "propertyName": "Aldau - Studio - Unit 3211",
      "address": "NA, Hurghada, Egypt"
    },
    "guest": {
      "fullName": "xvcfds",
      "email": "test@123.com",
      "phone": "12312312",
      "person": 1
    },
    "stay": {
      "checkIn": "2026-11-01",
      "checkOut": "2026-11-03",
      "numberOfNights": 2
    },
    "price": {
      "totalPrice": 80,
      "pricePerNight": 40
    }
  },
  "isSuccess": true,
  "message": "Booking marked as fully paid successfully.",
  "errors": [],
  "type": 200
}
now all of that was the changes could you create a full plan so that we could implment the diffrent stuff that is add to the app ? could you create a plan for it ?