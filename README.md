# GraphQL over HTTP

*Current Working Draft*

**Introduction**

HTTP is the most common choice as the client-server protocol when using GraphQL because of its ubiquity.
However the [GraphQL specification](http://facebook.github.io/graphql/) deliberately does not specify the transport layer.
This specification is intended to fill this gap by specifying how GraphQL should be served over HTTP.
The main intention of this specification is to provide interoperability between different client libraries, tools
and server implementations.

**Copyright notice**

**TBD**

**Conformance**

A conforming implementation of GraphQL over HTTP must fulfill all normative requirements.
Conformance requirements are described in this document via both
descriptive assertions and key words with clearly defined meanings.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED",  "MAY", and "OPTIONAL" in the normative portions of
this document are to be interpreted as described in [IETF RFC 2119](https://tools.ietf.org/html/rfc2119).
These key words may appear in lowercase and still retain their meaning unless
explicitly declared as non-normative.

A conforming implementation of GraphQL over HTTP may provide additional functionality,
but must not where explicitly disallowed or it would otherwise result
in non-conformance.


**Non-Normative Portions**

All contents of this document are normative except portions explicitly
declared as non-normative.

Examples in this document are non-normative, and are presented to aid
understanding of introduced concepts and the behavior of normative portions of
the specification. Examples are either introduced explicitly in prose
(e.g. "for example") or are set apart in example or counter-example blocks,
like this:

```example
This is an example of a non-normative example.
```

```counter-example
This is an example of a non-normative counter-example.
```

Notes in this document are non-normative, and are presented to clarify intent,
draw attention to potential edge-cases and pit-falls, and answer common
questions that arise during implementation. Notes are either introduced
explicitly in prose (e.g. "Note: ") or are set apart in a note block, like this:

Note: This is an example of a non-normative note.

# Overview

Serving GraphQL over HTTP provides the ability to use then full advantages of GraphQL with the rich feature set of HTTP. Carrying GraphQL in HTTP does not mean that GraphQL overrides existing
semantics of HTTP but rather that the semantics of GraphQL over HTTP map naturally to HTTP semantics.

GraphQL naturally follows the HTTP request/response message model providing a GraphQL request in an HTTP request and
GraphQL response in an HTTP response.

# URL

A GraphQL server operates on a single URL and all GraphQL requests for a given service should be directed
at this URL. Other protocols may also use that URL.

It is recommended to end the path component of URL with `/graphql`, for example: `http://example.com/graphql` or `http://example.com/product/graphql`.

# Serialization Format

Similar to the GraphQL specification this specification does not require a specific serialization format.
For consistency and ease of notation, examples of the response are given in JSON throughout the spec.

# Request

The GraphQL HTTP server should handle the HTTP GET and POST methods.
Additionally, GraphQL MAY be used in combination with other HTTP request methods.

## Request Parameters
A request for execution should contain the following request parameters:

* `query` - A Document containing GraphQL Operations and Fragments to execute.
* `operationName` - [*Optional*]: The name of the Operation in the Document to execute.
* `variables` - [*Optional*]: Values for any Variables defined by the Operation.
* `extensions` - [*Optional*]: This entry is reserved for implementors to extend the protocol however they see fit.

Note: depending on the serialization format used, values of the aforementioned parameters can be
encoded differently but their names and semantics must stay the same.

Note: specifying `null` in JSON (or equivalent values in other formats) as values for optional request parameters is equal to not specifying them at all.

Note: variables and extensions, if set, must have a map as its value.

## GET

For HTTP GET requests, the query parameters should be provided in the query component of the request URL in the form of
`key=value` pairs with `&` symbol as a separator.
The value of the `variables` parameter should be represented as a JSON-encoded string.

GET requests can be used for executing ONLY queries. If the values of `query` and `operationName` indicates that a non-query operation is to be executed, the server should immediately respond with an error status code, and halt execution.

For example, if we wanted to execute the following GraphQL query:

```graphql
query ($id: ID!) {
  user(id:$id) {
    name
  }
}
```
With the following query variables:
``` graphql
{
  id:"QVBJcy5ndXJ1"
}
```
This request could be sent via an HTTP GET as follows:

```
http://example.com/graphql?query=query($id: ID!){user(id:$id){name}}&variables={"id":"QVBJcy5ndXJ1"}
```

Note: `query` and `operationName` parameters are encoded as raw strings in the query component. Therefore `null` should be interpreted as the string `"null"`.

## POST

A standard GraphQL POST request should have a body which contains values of the request parameters encoded according to
the value of `Content-Type` header.

For example if the `Content-Type` is `application/json` then the request body may be:

```json
{
  "query": "query($id: ID!){user(id:$id){name}}",
  "variables": { "id": "QVBJcy5ndXJ1" }
}
```

# Response

When a GraphQL server receives a request, it must return a well‐formed response. The server’s
response describes the result of executing the requested operation if successful, and describes
any errors encountered during the request.

## Body

If the server's response contains a body it should follow the requirements for [GraphQL response](http://facebook.github.io/graphql/October2016/#sec-Response).

Note: For any non-2XX response, the client should not rely on the body to be in GraphQL format since the source of the response
may not be the GraphQL server but instead some intermediary such as API gateways, firewalls, etc.

## Status Codes

If the `data` entry in the response has any value other than `null` (when the operation has successfully executed
without error) then the response should use the 200 (OK) status code.
If the operation failed before or during execution, due to a syntax error, missing information, validation error
or any other reason, then response should use the 4XX or 5XX status codes.
It is recommended to use the same error codes as the [reference implementation](https://github.com/graphql/express-graphql).
