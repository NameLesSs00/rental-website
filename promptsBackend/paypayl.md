now we will create the payment for paymob the current one will not be used I want you to create a full plan so that we could implement it
here is everything you gonna need
client is : AdfzYyDZUkpur9p6EJfqEN_ec8hPU393mIm895owksoNSHPXrorOjpqnWYPQLlUyM6BV7Nnwm4TddqBband you should be using the SKD 
and the backend provide the following
PayPalPayments


POST
/api/payments/paypal/initialize


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
{
  "bookingId": "d0dfffd4-e24e-4dc9-9fab-49b54a925d48"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://rentaltech.premiumasp.net/api/payments/paypal/initialize' \
  -H 'accept: application/json' \
  -H 'Accept-Language: en' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InN1cGVyYWRtaW5AcHJvcGVydHltYW5hZ2VtZW50LmNvbSIsInVzZXJJZCI6IjkzNjE0MjY2LTFlN2QtNGRjZi1hMzBkLTA4ZGVmZGQ1ODQ5NCIsInVzZXJOYW1lIjoic3VwZXJhZG1pbiIsImZ1bGxOYW1lIjoiU3VwZXIgQWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdXBlckFkbWluIiwiZXhwIjoxNzkzNjM1MTcyLCJpc3MiOiJQcm9wZXJ0eU1hbmFnZW1lbnRBUEkiLCJhdWQiOiJQcm9wZXJ0eU1hbmFnZW1lbnRDbGllbnRzIn0.wcpVtDbII9XmAVsoVWJxaFHLoIdhQ9ZbbsFJs81GM18' \
  -H 'Content-Type: application/json' \
  -d '{
  "bookingId": "d0dfffd4-e24e-4dc9-9fab-49b54a925d48"
}'
Request URL
https://rentaltech.premiumasp.net/api/payments/paypal/initialize
Server response
Code	Details
503	
Error: response status is 503

Response body
Download
"PayPal is not enabled."
Response headers
 access-control-allow-origin: * 
 content-language: en 
 content-type: application/json; charset=utf-8 
 date: Mon,02 Nov 2026 15:06:10 GMT 
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
  "paymentId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "bookingId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "provider": "string",
  "orderId": "string",
  "amount": 0,
  "currency": "string",
  "status": "string"
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
503	
Service Unavailable

No links

POST
/api/payments/paypal/capture


Parameters
Try it out
Name	Description
Accept-Language
string
(header)
Preferred language for response localization (en, fr, de, ru, ar). Default: en.

Available values : en, fr, de, ru, ar

Default value : en


en
Request body

application/json
Example Value
Schema
{
  "orderId": "string"
}
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
  "paymentId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "bookingId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "provider": "string",
  "payPalOrderId": "string",
  "payPalCaptureId": "string",
  "amount": 0,
  "currency": "string",
  "paymentStatus": "string",
  "bookingStatus": "string"
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
503	
Service Unavailable
