GraphQL Over HTTP
-----------------

Note: **Stage 1: Proposal** 
This spec is under active development. For more information, please see the [Roadmap](https://github.com/APIs-guru/graphql-over-http/blob/master/ROADMAP.md) or [how to get involved](https://github.com/APIs-guru/graphql-over-http/blob/master/INTERESTED_DEVELOPERS.md).
You can find our community in the [graphql-over-http channel](https://graphql.slack.com/archives/CRTKLUZRT) on the [GraphQL Foundation slack](https://graphql-slack.herokuapp.com/).

---

# GraphQL over HTTP

**Introduction**

HTTP is the most common choice as the client-server protocol when using GraphQL because of its ubiquity.
However the [GraphQL specification](https://graphql.github.io/graphql-spec/) deliberately does not specify the transport layer.

The closest thing to an official specification is the article [Serving over HTTP](https://graphql.org/learn/serving-over-http/).
Leading implementations on both client and server have mostly upheld those best practices and thus established
a de-facto standard that is commonly used throughout the ecosystem.

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

Serving GraphQL over HTTP provides the ability to use the full advantages of GraphQL with the rich feature set of HTTP.
Carrying GraphQL in HTTP does not mean that GraphQL overrides existing semantics of HTTP,
but rather that the semantics of GraphQL over HTTP map naturally to HTTP semantics.

GraphQL naturally follows the HTTP request/response message model,
providing a GraphQL request in an HTTP request and GraphQL response in an HTTP response.

# URL

A GraphQL over HTTP compliant server MUST designate at least one URL that handles GraphQL requests.

A GraphQL schema allows clients to know the available operations on a GraphQL server.
Clients can discover the schema by sending an introspection query, which the server MUST answer with a proper response. 

The schema on a single URL MAY not be the same for every client.
For example, certain fields could be restricted to authenticated users or alpha testers.

All Queries and Mutations a client discovered in the schema MUST be available on the same URL.
That means the client can send all their GraphQL requests to a single endpoint.

Multiple URLs MAY exist on a server to handle GraphQL requests, potentially serving different
but self-sufficient schemas. The same GraphQL schema MAY be available on multiple URLs on the server.

Those URLs MAY also be used for other purposes, as long as they don't conflict with the
server's responsibility to handle GraphQL requests.

It is RECOMMENDED to end the path component of the URL with `/graphql`, for example:

```url example
http://example.com/graphql
```

```url example
http://product.example.com/graphql
```

```url example
http://example.com/product/graphql
```

# Serialization Format

Similar to the GraphQL specification this specification does not require a specific serialization format.
For consistency and ease of notation, examples of the response are given in JSON throughout the spec.

# Request

The GraphQL HTTP server SHOULD handle the HTTP GET and POST methods.
Additionally, GraphQL MAY be used in combination with other HTTP request methods.

## Request Parameters

A request for execution should contain the following request parameters:

* {query} - A Document containing GraphQL Operations and Fragments to execute.
* {operationName} - (*Optional*): The name of the Operation in the Document to execute.
* {variables} - (*Optional*): Values for any Variables defined by the Operation.
* {extensions} - (*Optional*): This entry is reserved for implementors to extend the protocol however they see fit.

Note: depending on the serialization format used, values of the aforementioned parameters can be
encoded differently but their names and semantics must stay the same.

Note: specifying `null` in JSON (or equivalent values in other formats) as values for optional request parameters is equivalent to not specifying them at all.

Note: {variables} and {extensions}, if set, must have a map as its value.

## GET

For HTTP GET requests, the query parameters should be provided in the query component of the request URL in the form of
`key=value` pairs with `&` symbol as a separator and both the key and value should have their "reserved" characters percent-encoded as specified in [section 2 of RFC3986](https://tools.ietf.org/html/rfc3986#section-2).
The unencoded value of the {variables} parameter should be represented as a JSON-encoded string.

GET requests can be used for executing ONLY queries. If the values of {query} and {operationName} indicates that a non-query operation is to be executed, the server should immediately respond with an error status code, and halt execution.

For example, if we wanted to execute the following GraphQL query:

```graphql example
query ($id: ID!) {
  user(id:$id) {
    name
  }
}
```

With the following query variables:

```graphql example
{
  id:"QVBJcy5ndXJ1"
}
```

This request could be sent via an HTTP GET as follows:

```url example
http://example.com/graphql?query=query(%24id%3A%20ID!)%7Buser(id%3A%24id)%7Bname%7D%7D&variables=%7B%22id%22%3A%22QVBJcy5ndXJ1%22%7D
```

Note: {query} and {operationName} parameters are encoded as raw strings in the query component. Therefore if the query string contained `operationName=null` then it should be interpreted as the {operationName} being the string `"null"`. If a literal `null` is desired, the parameter (e.g. {operationName}) should be omitted.

## POST

A standard GraphQL POST request should have a body which contains values of the request parameters encoded according to
the value of `Content-Type` header.

For example if the `Content-Type` is `application/json` then the request body may be:

```json example
{
  "query": "query($id: ID!){user(id:$id){name}}",
  "variables": { "id": "QVBJcy5ndXJ1" }
}
```

Note: both query and mutation operations can be sent over POST requests.

# Response

When a GraphQL server receives a request, it must return a well‐formed response. The server’s
response describes the result of executing the requested operation if successful, and describes
any errors encountered during the request.

## Body

If the server's response contains a body it should follow the requirements for [GraphQL response](https://graphql.github.io/graphql-spec/June2018/#sec-Response).

Note: For any non-2XX response, the client should not rely on the body to be in GraphQL format since the source of the response
may not be the GraphQL server but instead some intermediary such as API gateways, firewalls, etc.

## Status Codes

If the response has Content-Type GraphQL and contains a non-null `data` entry,
then it MUST have status code `2xx`, and it SHOULD have status code `200`.

If the response has Content-Type GraphQL and has a non-`2xx` status code,
the `data` entry must be either:
- equal to `null`
- not present

Note: The result of executing a GraphQL operation may contain partial data as well as encountered errors.
Errors that happen during execution of the GraphQL operation typically become part of the result,
as long as the server is still able to produce a well-formed response.

In case of errors that completely prevent the successful execution of the request,
the server SHOULD respond with the appropriate status code depending on the concrete error condition.

There are four types of validation errors:

1. Unparseable or invalid request body, for example `NONSENSE` or `{"qeury": "{__typename}"}`
2. GraphQL Specification document validation errors (valid syntax, no loops in fragments, etc)
3. Custom document validations that can be performed before execution (e.g. graphql-depth-limit)
4. Runtime validations performed by resolvers (e.g. during the execution of the GraphQL operation).

Error types 1. and 2. prevent execution of the request in its entirety; they MUST result in
status code `4xx` or `5xx`, and SHOULD result in status code `400` (Bad Request). Types 3. and 4. may still allow partial execution; they
MUST result in status code `2xx`, and SHOULD result in status code `200` (Okay).

If a client is not allowed to access the schema, the server MUST respond with
status code `4xx`, SHOULD respond with `401` (Unauthorized) or `403` (Forbidden) as appropriate, and MAY respond with status code `404` (Not Found) if security concerns demand it.

If the server failed unexpectedly, it MUST respond with the appropriate `5xx` status code.
