## GraphQL Over HTTP

Note: **Stage 0: Preliminary** This spec is under active development, and not
ready for implementations yet. For more information, please see the
[Roadmap](https://github.com/graphql/graphql-over-http/blob/master/ROADMAP.md)
or
[how to get involved](https://github.com/graphql/graphql-over-http/blob/master/INTERESTED_DEVELOPERS.md).
You can find our community in the #graphql-over-http channel on the
[GraphQL Foundation Discord](https://discord.graphql.org).

---

# GraphQL over HTTP

**Introduction**

This specification details how services that wish to publish and consume GraphQL
APIs over HTTP should do so in order to maximize interoperability between
different client libraries, tools and server implementations.

The [GraphQL specification](https://graphql.github.io/graphql-spec/)
deliberately does not specify the transport layer, however HTTP is the most
common choice when serving GraphQL to remote clients due to its ubiquity.

Previous to this specification, the article
[Serving over HTTP](https://graphql.org/learn/serving-over-http/) on the
graphql.org website served as guidance, and leading implementations on both
client and server have mostly upheld those best practices and thus established a
de-facto standard that is commonly used throughout the ecosystem. This
specification aims to codify and expand on this work.

**Copyright notice**

Copyright © 2022-present, GraphQL contributors

THESE MATERIALS ARE PROVIDED “AS IS.” The parties expressly disclaim any
warranties (express, implied, or otherwise), including implied warranties of
merchantability, non-infringement, fitness for a particular purpose, or title,
related to the materials. The entire risk as to implementing or otherwise using
the materials is assumed by the implementer and user. IN NO EVENT WILL THE
PARTIES BE LIABLE TO ANY OTHER PARTY FOR LOST PROFITS OR ANY FORM OF INDIRECT,
SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES OF ANY CHARACTER FROM ANY CAUSES
OF ACTION OF ANY KIND WITH RESPECT TO THIS DELIVERABLE OR ITS GOVERNING
AGREEMENT, WHETHER BASED ON BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE), OR
OTHERWISE, AND WHETHER OR NOT THE OTHER MEMBER HAS BEEN ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.

**Conformance**

A conforming implementation of GraphQL over HTTP must fulfill all normative
requirements. Conformance requirements are described in this document via both
descriptive assertions and key words with clearly defined meanings.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in the normative portions of
this document are to be interpreted as described in
[IETF RFC 2119](https://tools.ietf.org/html/rfc2119). These key words may appear
in lowercase and still retain their meaning unless explicitly declared as
non-normative.

A conforming implementation of GraphQL over HTTP may provide additional
functionality, but must not where explicitly disallowed or would otherwise
result in non-conformance.

**Non-Normative Portions**

All contents of this document are normative except portions explicitly declared
as non-normative.

Examples in this document are non-normative, and are presented to aid
understanding of introduced concepts and the behavior of normative portions of
the specification. Examples are either introduced explicitly in prose (e.g. "for
example") or are set apart in example or counter-example blocks, like this:

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

Though [the GraphQL specification](https://spec.graphql.org) is transport
agnostic, this GraphQL over HTTP specification aims to map GraphQL's semantics
to their HTTP equivalents, enabling us to combine the full advantages of GraphQL
with the rich feature set of HTTP.

GraphQL queries and mutations naturally follow the request/response message
model used in HTTP, allowing us to provide a GraphQL request in an HTTP request
and a GraphQL response in an HTTP response.

:: In this document, the term {GraphQL request} refers to a
[request as defined by the GraphQL Specification](https://spec.graphql.org/draft/#request).

:: In this document, the term {GraphQL schema} refers to a
[schema as defined by the GraphQL specification](https://spec.graphql.org/draft/#sec-Schema).

:: In this document, the term {GraphQL server} refers to a GraphQL over HTTP
Specification compliant HTTP server.

# URL

A GraphQL server MUST enable GraphQL requests to one of more GraphQL schemas.

Each GraphQL schema a GraphQL server provides MUST be served via one or more
URLs.

A client MUST be able to send all their GraphQL query and mutation requests for
a single GraphQL schema made available by a GraphQL server to a single URL
endpoint on that server. A GraphQL server MUST NOT require the client to use
different URLs for different GraphQL query and mutation requests to the same
GraphQL schema.

Note: This means that a GraphQL client must be able to perform all GraphQL query
and mutation operations it needs via a single endpoint.

The GraphQL schema available via a single URL MAY be different for different
clients. For example, alpha testers or authenticated users may have access to a
schema with additional fields.

GraphQL server URLs which enable GraphQL requests MAY also be used for other
purposes, as long as they don't conflict with the server's responsibility to
handle GraphQL requests.

It is RECOMMENDED to end the path component of the URL with `/graphql`, for
example:

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

The GraphQL specification allows for many
[serialization formats to be implemented](https://spec.graphql.org/October2021/#sec-Serialization-Format).
Servers and clients over HTTP MUST support JSON and MAY support other,
additional serialization formats.

For consistency and ease of notation, examples of the response are given in JSON
throughout the spec.

## Content Types

The following are the officially recognized GraphQL content types to designate
encoding JSON over HTTP.

| Name                       | Description               |
| -------------------------- | ------------------------- |
| `application/graphql+json` | Required                  |
| `application/json`         | To support legacy clients |

A server MUST support requests from clients with HTTP header
`Content-Type: application/graphql+json` indicating that the body of the request
is a JSON document with a GraphQL request. A server must indicate the content
type of the response with a `Content-Type` header. This default value should be
`Content-Type: application/graphql+json` indicating that the response is a valid
JSON document
[conforming to the GraphQL spec](https://spec.graphql.org/October2021/#sec-Response-Format).

A server MAY support requests from clients with other content types.

A client MUST handle receiving responses with HTTP header
`Content-Type: application/graphql+json` since any compliant server must support
this type.

This header MAY include encoding information (e.g.
`Content-Type: application/graphql+json; charset=utf-8`)

# Request

A server MUST accept POST requests, and MAY accept other HTTP methods, such as
GET.

## Request Parameters

A request for execution should contain the following request parameters:

- {query} - A Document containing GraphQL Operations and Fragments to execute.
- {operationName} - (_Optional_): The name of the Operation in the Document to
  execute.
- {variables} - (_Optional_): Values for any Variables defined by the Operation.
- {extensions} - (_Optional_): This entry is reserved for implementors to extend
  the protocol however they see fit.

Note: Be aware that `query` is a misleading name as it can contain a string
describing multiple operations, each of which may be a query, mutation or
subscription. A better name would have been `document`, but the term `query` is
well established.

Note: depending on the serialization format used, values of the aforementioned
parameters can be encoded differently but their names and semantics must stay
the same.

Note: specifying `null` in JSON (or equivalent values in other formats) as
values for optional request parameters is equivalent to not specifying them at
all.

Note: {variables} and {extensions}, if set, must have a map as its value.

## GET

For HTTP GET requests, the query parameters MUST be provided in the query
component of the request URL in the form of `key=value` pairs with `&` symbol as
a separator and both the key and value should have their "reserved" characters
percent-encoded as specified in
[section 2 of RFC3986](https://tools.ietf.org/html/rfc3986#section-2). The
`variables` parameter, if used, MUST be represented as a URL-encoded JSON
string.

### Example

If we wanted to execute the following GraphQL query:

```graphql example
query ($id: ID!) {
  user(id: $id) {
    name
  }
}
```

With the following query variables:

```json example
{
  "id": "QVBJcy5ndXJ1"
}
```

This request could be sent via an HTTP GET as follows:

```url example
http://example.com/graphql?query=query(%24id%3A%20ID!)%7Buser(id%3A%24id)%7Bname%7D%7D&variables=%7B%22id%22%3A%22QVBJcy5ndXJ1%22%7D
```

Note: {query} and {operationName} parameters are encoded as raw strings in the
query component. Therefore if the query string contained `operationName=null`
then it should be interpreted as the {operationName} being the string `"null"`.
If a literal `null` is desired, the parameter (e.g. {operationName}) should be
omitted.

GET requests MUST NOT be used for executing mutation operations. If the values
of {query} and {operationName} indicate that a mutation operation is to be
executed, the server SHOULD immediately respond with error status code `405`
(Method Not Allowed) and halt execution. This restriction is necessary to
conform with the long-established semantics of safe methods within HTTP.

## POST

A GraphQL POST request instructs the server to perform a query or mutation
operation. A GraphQL POST request MUST have a body which contains values of the
request parameters encoded according to the value of `Content-Type` header of
the request.

A client MUST include a `Content-Type` with a POST request.

### Example

Given a POST request with a content type of `application/graphql+json` here is
an example request body:

```json example
{
  "query": "query($id: ID!){user(id:$id){name}}",
  "variables": { "id": "QVBJcy5ndXJ1" }
}
```

# Response

When a GraphQL server receives a request, it must return a well‐formed response.
The server's response describes the result of executing the requested operation
if successful, and describes any errors encountered during the request.

## Body

If the server's response contains a body it should follow the requirements for
[GraphQL response](https://graphql.github.io/graphql-spec/October2021/#sec-Response).

A server MUST return a `Content-Type` HTTP Header with a value of a valid
GraphQL content type. If there is no `Accept` header in the request, the
response MUST be serialized as JSON and MUST include a
`Content-Type: application/graphql+json` header.

If another content type is preferable to a client, it MAY include an `Accept`
HTTP header listing other acceptable content types in order of preference. In
this case a client SHOULD include `application/graphql+json` in the list,
according to their preferred priority.

The server MUST respect the given `Accept` header and attempt to encode the
response in the first supported content type listed. According to the
[HTTP 1.1 Accept](https://tools.ietf.org/html/rfc7231#section-5.3.2)
specification, when a client does not include at least one supported content
type in the `Accept` HTTP header, the server MAY choose to respond in one of
several ways. The server MUST either:

1. Disregard the `Accept` header and respond with the default content type of
   `application/graphql+json`, specifying this in the `Content-Type` header; OR
2. Respond with a `406 Not Acceptable` status code

Note: For any non-`2XX` response, the client should not rely on the body to be
in GraphQL format since the source of the response may not be the GraphQL server
but instead some intermediary such as API gateways, firewalls, etc.

## Status Codes

If the response has Content-Type GraphQL and contains a non-null `data` entry,
then it MUST have status code `2xx`, and it SHOULD have status code `200`
(Okay).

If the response has Content-Type GraphQL and has a non-`2xx` status code, the
`data` entry must be either:

- equal to `null`
- not present

Note: The result of executing a GraphQL operation may contain partial data as
well as encountered errors. Errors that happen during execution of the GraphQL
operation typically become part of the result, as long as the server is still
able to produce a well-formed response.

In case of errors that completely prevent the successful execution of the
request, the server SHOULD respond with the appropriate status code depending on
the concrete error condition.

The following examples provide guidance on how to deal with specific error
cases:

### Unparseable or invalid request body

For example: `NONSENSE`, `{"qeury": "{__typena`

Completely prevents execution of the GraphQL operation and SHOULD result in
status code `400` (Bad Request).

### Document validation

Includes validation steps that run before execution of the GraphQL operation:

- [GraphQL specification validation](https://spec.graphql.org/October2021/#sec-Validation)
- custom validation, for example: depth limit, complexity limit

The server SHOULD deny execution with a status code of `400` (Bad Request).

Note: In certain circumstances, for example persisted queries that were
previously known to be valid, the server MAY attempt execution regardless of
validation errors.

### Runtime validation

Validation steps performed by resolvers during execution of the GraphQL
operation.

The server SHOULD respond with a status code of `200` (Okay) to ensure clients
receive a predictable result, no matter which fields they selected.

### Client is not allowed to access the schema

In case the client can not access the schema at all, the server SHOULD respond
with the appropriate `4xx` status code.
