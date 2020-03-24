# Test Suite

These are the description of the test that we intend to build. This document is a scaffold until we have the tests implemented. At that point, the code itself will become the documentation. 

## Requests

Server expense serialization format to be declared in the content-type of the request. 

Server should validate the content-type based in the request to ensure it's a content type (serialization format) that it supports 
* Return `415 Unsupported Media Type` otherwise

A GET method should be successful
* Attempt a GET method request for introspection
   query (serialized as URL encoded key-value pair)

A POST method should be successful
* Attempt a POST method for introspection
   query (serialized in body)

A GET method with query, operationName and variable should be successful

A POST method with query, operationName and variable should be successful

## Responses

A 200 response should include a body. The body should include at least a `data` attribute or an `errors` attribute.

If no `Accept` header is sent in the request the server MAY choose whatever serialization format it defaults to. 

The server SHOULD include a `content-type` header in the response to indicate what serialization format was used in the response.

If `Accept` header is given in the request, the server should serialize the body in the response according to one of the content-types in the `Accepted` HTTP header.

If all of the content-types listed in `Accept` are not supported by the server there are two valid options: return a 406 or return in the default content-type.

> If the header field is
   present in a request and none of the available representations for
   the response have a media type that is listed as acceptable, the
   origin server can either honor the header field by sending a 406 (Not
   Acceptable) response or disregard the header field by treating the
   response as if it is not subject to content negotiation.
   [HTTP 1.1 Accept](https://tools.ietf.org/html/rfc7231#section-5.3.2)


Server may response with non-200 status codes

Syntax error in the query should result in either a 200 with an `error` attribute in the body or a 400 response. 