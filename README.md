> **Stage 1: Proposal**
>
> This spec is under active development. For more information, please see the [Roadmap](ROADMAP.md) or [how to get involved](INTERESTED_DEVELOPERS.md).

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

Serving GraphQL over HTTP provides the ability to use the full advantages of GraphQL with the rich feature set of HTTP. Carrying GraphQL in HTTP does not mean that GraphQL overrides existing
semantics of HTTP but rather that the semantics of GraphQL over HTTP map naturally to HTTP semantics.

GraphQL naturally follows the HTTP request/response message model providing a GraphQL request in an HTTP request and
GraphQL response in an HTTP response.

# URL

A GraphQL server operates on a single URL and all GraphQL requests for a given service should be directed
at this URL. Other protocols may also use that URL.

It is recommended to end the path component of the URL with `/graphql`, for example: `http://example.com/graphql` or `http://example.com/product/graphql`.

# Serialization Format

The GraphQL specification allows for many [serialization formats to be implemented](https://spec.graphql.org/June2018/#sec-Serialization-Format). In practice JSON is the most common serialization format. In order to be compliant, servers and clients implementing GraphQL over HTTP must support JSON serialization.

## Content Types

The following are the officially recognized GraphQL content types to designate encoding JSON over HTTP.

| Name | Description |
| `application/graphql+json` | Required
| `application/json` | To support legacy clients

A server MUST support requests from clients with HTTP header `Content-Type: application/graphql+json`.

A server MAY support requests from clients with other content types.

A client MUST handle receiving responses with HTTP header `Content-Type: application/graphql+json` since any compliant server must support this type.

# Request

A server MUST accept either GET requests or POST requests.

A server SHOULD handle both GET and POST requests.

## Request Parameters

A request for execution should contain the following request parameters:

* `query` - A Document containing GraphQL Operations and Fragments to execute.
* `operationName` - [*Optional*]: The name of the Operation in the Document to execute.
* `variables` - [*Optional*]: Values for any Variables defined by the Operation.

Note: Be aware that `query` is a misleading name as it can contain a string describing the operation that may be either a query, a mutation or a subscription.

Note: depending on the serialization format used, values of the aforementioned parameters can be
encoded differently but their names and semantics must stay the same.

Note: specifying `null` in JSON (or equivalent values in other formats) as values for optional request parameters is equivalent to not specifying them at all.

## GET

For HTTP GET requests, the query parameters MUST be provided in the query component of the request URL in the form of
`key=value` pairs with `&` symbol as a separator and both the key and value should have their "reserved" characters percent-encoded as specified in [section 2 of RFC3986](https://tools.ietf.org/html/rfc3986#section-2).
The unencoded value of the `variables` parameter MUST be represented as a URL-encoded JSON string.

GET requests must ONLY be used for executing queries and MUST NOT be used for mutations or subscriptions.

Servers MUST return an _Error response_ if a GET request includes a `query` and `operationName` (if present) describing an operation other than a query, such as a mutation or subscription.

Clients MUST NOT send GET requests for non-query operations.

Clients SHOULD NOT send a `Content-type` header on a GET request.

### Example

For example, if we wanted to execute the following GraphQL query:

```graphql
query ($id: ID!) {
  user(id:$id) {
    name
  }
}
```

With the following query variables:

```json
{
  "id": "QVBJcy5ndXJ1"
}
```

This request could be sent via an HTTP GET as follows:

```
http://example.com/graphql?query=query(%24id%3A%20ID!)%7Buser(id%3A%24id)%7Bname%7D%7D&variables=%7B%22id%22%3A%22QVBJcy5ndXJ1%22%7D
```

Note: `query` and `operationName` parameters are encoded as raw strings in the query component. Therefore if the query string contained `operationName=null` then it should be interpreted as the `operationName` being the string `"null"`. If a literal `null` is desired, the parameter (e.g. `operationName`) should be omitted.

## POST

A GraphQL POST request instructs the server to perform a query, mutation or subscription operation. A GraphQL POST request should have a body which contains values of the request parameters encoded according to the value of `Content-Type` header of the request.

When sending a POST request to a GraphQL server a client MUST include a body.

A client MUST include a `content-type` with a POST request.

### Example

Given a POST request with a content type of `application/graphql+json` here is an example request body:

```json
{
  "query": "query($id: ID!){user(id:$id){name}}",
  "variables": { "id": "QVBJcy5ndXJ1" }
}
```

# Response

When a GraphQL server receives a request, it must return a well‐formed response. The server's
response describes the result of executing the requested operation if successful, and describes
any errors encountered during the request.

## Body

If the server's response contains a body it should follow the requirements for [GraphQL response](https://graphql.github.io/graphql-spec/June2018/#sec-Response).

A server MUST return a `Content-Type` HTTP Header with a value of a valid GraphQL content type. By default the response MUST be serialized as JSON and MUST include a  "Content-type: application/graphql+json` header.

If another content type is preferable to a client, it MAY include an `Accept` HTTP header listing other acceptable content types in order of preference. In this case a client SHOULD include `application/graphql+json` in the list, according to their preferred priority.

If no `Accept` header is given, the server MUST respond with a content type of `application/graphql+json`.

The server MUST respect the given `Accept` header and attempt to encode the respond in the first supported content type listed. According to the [HTTP 1.1 Accept](https://tools.ietf.org/html/rfc7231#section-5.3.2) specification, when a client does not include at least one supported content type in the `Accept` HTTP header, the server MAY choose to respond in one of several ways. The server MUST either:

1. Disregard the `Accept` header and respond with the default content type of `application/graphql`, specifying this in the `Content-type` header; OR
2. Respond with a `406 Not Acceptable` status code

Note: For any non-2XX response, the client should not rely on the body to be in GraphQL format since the source of the response
may not be the GraphQL server but instead some intermediary such as API gateways, firewalls, etc.

## Status Codes

If the `data` entry in the response has any value other than `null` (when the operation has successfully executed
without error) then the response should use the 200 (OK) status code.
If the operation failed before or during execution, due to a syntax error, missing information, validation error
or any other reason, then response should use the 4XX or 5XX status codes.
It is recommended to use the same error codes as the [reference implementation](https://github.com/graphql/express-graphql).
