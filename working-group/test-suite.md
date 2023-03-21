🚨 **WARNING** 🚨 This proposed test suite is out of date and does not reflect the current status of the spec. For a more up to date test suite, please see [graphql-http audits](https://github.com/graphql/graphql-http#audits) or the testing tool at [graphql-http.com](https://graphql-http.com/). This document only exists for historical reasons.

# Automated Test Suite

> These are the descriptions of the tests that we intend to build. This document is a scaffold until we have the tests implemented. At that point, the code itself will become the documentation and this document will be removed.

| Instruction in specification | Meaning | Result of test failure |
|---|---|---|
| MUST | Required behavior | ERROR
| SHOULD | Recommended behavior | WARNING
| MAY  | Allowed behavior  | NONE

The tests described below indicate whether they will raise an ERROR or a WARNING if the assertion is violated. In order for a server to be marked as fully compliant it must receive no ERROR assertion failures when this automated test suite is run. In order to have a 100% scored-card the server must receive no ERROR or WARNING assertion failures when this automated test suite is run. 

## Requests

A GET method SHOULD be successful
* Send a GET HTTP request for introspection
  * **WARNING** Assert that the server returns a 200 HTTP response


A GET method with `query`, `operationName` and `variables` SHOULD be successful
* Send a GET HTTP request for introspection using `query`, `operationName`, and `variables`. These should encoded as key-value pairs as query params. `variables` must be a URL-encoded valid JSON string.
  * **WARNING** Assert that the server returns a 200 HTTP response

At least one of either a POST or a GET method MUST be successful
* Send a GET HTTP request for introspection AND send a POST HTTP request for introspection:
  * **ERROR** Assert that the server returns a 200 HTTP response to one of the requests

A POST method SHOULD be successful
* Send a POST HTTP request for introspection
  * **WARNING** Assert that the server returns a 200 HTTP response

A POST method with `query`, `operationName` and `variables` SHOULD be successful
* Send a POST HTTP request for introspection using `query`, `operationName`, and `variables`. These will be encoded as a JSON object.
  * **WARNING** Assert that the server returns a 200 HTTP response


## Responses

A 200 HTTP response to a request without a specified content-type MUST include a body and MUST indicate the encoding with the `content-type` HTTP header.
* Send a GraphQL query in an HTTP request without an `Accept` header. May be a GET or POST, based on which is supported by this server.
  * **ERROR** Assert that the HTTP response includes an HTTP Header `Content-type: application/graphql+json`
  * **ERROR** Assert that the HTTP response body is valid JSON containing at least a non-null `data` or a non-null `error` top-level attribute.
    * This header MAY include encoding information (e.g. `Content-type: application/graphql-json; charset=utf-8`)

Servers MUST respect the content type requested in the `Accept` HTTP header in the request.
* Send a GraphQL query in an HTTP request with HTTP Header `Accept: application/graphql+json`.
  * **ERROR** Assert that the HTTP response includes an HTTP Header `Content-type: application/graphql+json`
  * **ERROR** Assert that the HTTP response body is valid JSON
* Send a GraphQL query in an HTTP request with HTTP Header `Accept: unknown/content-type`, and invalid and unsupported content-type
  * **ERROR** Assert that either:
    * The HTTP response is `406 Not Acceptable`; OR
    * The HTTP response includes an HTTP Header `Content-type: application/graphql+json` and the HTTP response body is valid JSON

A syntax error in the query MUST result in either a 200 and a body with an  `error` attribute OR a 400 response
* Send a GraphQL query with a valid structured request, but an invalid GraphQL query document. Include an `Accept: application/graphql-json` to ensure we receive JSON-encoded body.
  * **ERROR** Assert that either
    * The server responds with a 200 HTTP response and a JSON document containing a non-null `errors` top level attribute; OR
    * The server responds with a 400 HTTP response
