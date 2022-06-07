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

:: In this document, the term {GraphQL schema} refers to a
[schema as defined by the GraphQL specification](https://spec.graphql.org/draft/#sec-Schema).

:: In this document, the term {GraphQL request} refers to a
[request as defined by the GraphQL Specification](https://spec.graphql.org/draft/#request).

:: In this document, the term {GraphQL response} refers to a
[response as defined by the GraphQL Specification](https://spec.graphql.org/draft/#sec-Response).

:: In this document, the term {server} refers to a GraphQL over HTTP
Specification compliant HTTP server unless the context indicates otherwise.

:: In this document, the term {client} refers to a GraphQL over HTTP
Specification compliant HTTP client unless the context indicates otherwise.

# URL

A server MUST enable GraphQL requests to one of more GraphQL schemas.

Each GraphQL schema a server provides MUST be served via one or more URLs.

A client MUST be able to send all their GraphQL query and mutation requests for
a single GraphQL schema made available by a server to a single URL endpoint on
that server. A server MUST NOT require the client to use different URLs for
different GraphQL query and mutation requests to the same GraphQL schema.

Note: This means that a client must be able to perform all GraphQL query and
mutation operations it needs via a single endpoint.

The GraphQL schema available via a single URL MAY be different for different
clients. For example, alpha testers or authenticated users may have access to a
schema with additional fields.

Server URLs which enable GraphQL requests MAY also be used for other purposes,
as long as they don't conflict with the server's responsibility to handle
GraphQL requests.

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
Servers and clients MUST support JSON and MAY support other, additional
serialization formats.

For consistency and ease of notation, examples of the response are given in JSON
throughout this specification.

## Media Types

The following are the officially recognized GraphQL media types to designate
encoding JSON over HTTP.

| Name                       | Description                                   |
| -------------------------- | --------------------------------------------- |
| `application/graphql+json` | The preferred type; better HTTP compatibility |
| `application/json`         | To support legacy clients                     |

If the media type in a `Content-Type` or `Accept` header includes encoding
information, then the encoding MUST be `utf-8` (e.g.
`Content-Type: application/graphql+json; charset=utf-8`). If encoding
information is not included then `utf-8` should be assumed.

Prior to this specification, the media type `application/json` was in wide use
for both the HTTP request body type and the HTTP response payload type.
Unfortunately this causes a number of issues, not least that it means clients
cannot trust responses from the server that do not use an HTTP 2xx status code
(since these replies may come from non-compliant HTTP servers or proxies
somewhere in the request chain). For this reason, this specification introduces
the `application/graphql+json` media type; however, to give existing servers
time to move over, it is not required to be supported until 1st January 2025.

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

Note: Be aware that `query` is a misleading parameter name as its value is a
string describing one or more operations, each of which may be a query, mutation
or subscription. A better name would have been `document`, but the term `query`
is well established.

Note: Depending on the serialization format used, values of the aforementioned
parameters can be encoded differently but their names and semantics must stay
the same.

Note: Specifying `null` in JSON (or equivalent values in other formats) as
values for optional request parameters is equivalent to not specifying them at
all.

Note: {variables} and {extensions}, if set, must have a map as their value.

## Accept

A client SHOULD indicate the media types that it supports in responses using the
`Accept` HTTP header as specified in
[RFC7231](https://datatracker.ietf.org/doc/html/rfc7231).

A client SHOULD include `application/graphql+json` in the `Accept` header.

A client MUST include `application/json` in the `Accept` header.

It is RECOMMENDED that a client set the `Accept` header to
`application/graphql+json; charset=utf-8, application/json; charset=utf-8`.

Note: This recommended header enables compatibility with legacy servers whilst
still leveraging modern features if available in the server.

## GET

For HTTP GET requests, the query parameters MUST be provided in the query
component of the request URL in the `application/x-www-form-urlencoded` format
as specified by
[WhatWG's URLSearchParams class](https://url.spec.whatwg.org/#interface-urlsearchparams).
The `variables` parameter, if used, MUST be represented as a URL-encoded JSON
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
executed, the server MUST respond with error status code `405` (Method Not
Allowed) and halt execution. This restriction is necessary to conform with the
long-established semantics of safe methods within HTTP.

## POST

A GraphQL POST request instructs the server to perform a query or mutation
operation. A GraphQL POST request MUST have a body which contains values of the
request parameters encoded in one of the officially recognized GraphQL media
types, or another media type supported by the server.

A client SHOULD indicate the media type of a request body using the
`Content-Type` header as specified in
[RFC7231](https://datatracker.ietf.org/doc/html/rfc7231).

Note: If the client does not include a `Content-Type` header then
`application/json` will be assumed.

### Legacy watershed

Before 1st January 2025 (`2025-01-01T00:00:00Z`), if a client does not know the
media types the server supports then it SHOULD use
`Content-Type: application/json` in requests. After this date, if a client does
not know the media types the server supports then it SHOULD use
`Content-Type: application/graphql+json` in requests.

### Example

Given a POST request with a media type of `application/graphql+json` here is an
example request body:

```json example
{
  "query": "query ($id: ID!) { user(id:$id) { name } }",
  "variables": { "id": "QVBJcy5ndXJ1" }
}
```

# Response

When a server receives a GraphQL request, it must return a well‐formed response.
The server's response describes the result of executing the requested operation
if successful, and describes any errors encountered during the request.

A server must comply with
[RFC7231](https://datatracker.ietf.org/doc/html/rfc7231).

## Interpreting the request

A server MUST support requests from clients with HTTP header
`Content-Type: application/json`.

A server MUST support requests from clients who `Accept` the media type
`application/json`.

A server SHOULD support requests from clients with HTTP header
`Content-Type: application/graphql+json`.

A server SHOULD support requests from clients who `Accept` the media type
`application/graphql+json`.

A server MAY support requests from clients with other media types.

If the client does not supply a `Content-Type` header, the server SHOULD treat
the request as if it had `Content-Type: application/json`.

If the client does not supply an `Accept` header, the server SHOULD treat the
request as if it had `Accept: application/json`.

Note: These defaults are in place to maintain compatibility with legacy clients.

### Legacy watershed

From 1st January 2025 (`2025-01-01T00:00:00Z`), a server MUST support requests
from clients using the `application/graphql+json` media type for the request
body.

From 1st January 2025 (`2025-01-01T00:00:00Z`), a server MUST support requests
from clients who `Accept` the `application/graphql+json` media type.

## Body

The body of the server's response MUST follow the requirements for a
[GraphQL response in the GraphQL spec](https://graphql.github.io/graphql-spec/draft/#sec-Response).

A server MUST indicate the media type of the response with a `Content-Type`
header.

If an `Accept` header is provided, the server MUST respect the given `Accept`
header and attempt to encode the response in the highest priority supported
media type listed.

In alignment with the
[HTTP 1.1 Accept](https://tools.ietf.org/html/rfc7231#section-5.3.2)
specification, when a client does not include at least one supported media type
in the `Accept` HTTP header, the server MAY choose to respond in one of several
ways. The server MUST either:

1. Disregard the `Accept` header and respond with the default media type of
   `application/json`, specifying this in the `Content-Type` header; OR
2. Respond with a `406 Not Acceptable` status code.

## Status Codes

### application/json

If the response body is to use `application/json` media type then the server
MUST always use the `200` status code, independent of errors occuring during or
before execution.

Note: A status code in the 4xx or 5xx ranges or status code 203 (and maybe
others) could originate from intermediary servers; since the client cannot
determine if an `application/json` response with arbitrary status code is a
well-formed GraphQL response (because it cannot trust the source) we must use
`200` status code to guarantee that the response comes from the server.

### application/graphql+json

This section only applies when the response body is to use the
`application/graphql+json` media type.

If the GraphQL response contains the {data} entry and it is not {null}, then the
server MUST reply with a `2xx` status code and SHOULD reply with `200` status
code.

Note: There's currently not an approved HTTP status code to use for "partial
success," contenders include WebDAV's status code "207 Multi-Status" and using a
custom code such as "247 Partial Success."
[IETF RFC2616 Section 6.1.1](https://datatracker.ietf.org/doc/html/rfc2616#section-6.1.1)
states "codes are fully defined in section 10" implying that though more codes
are expected to be supported over time, valid codes must be present in this
document.

If the GraphQL response contains the {data} entry and it is {null}, then the
server SHOULD reply with a `2xx` status code and it is RECOMMENDED it replies
with `200` status code, however it MAY reply with a `4xx` or `5xx` status code.

Note: This is to enable compatibility with legacy GraphQL servers, including
`graphql-express`.

<!-- TODO: validate the above note, and the rule. -->

If the GraphQL response does not contain the {data} entry then the server MUST
reply with a `4xx` or `5xx` status code as appropriate.

If the GraphQL request is invalid then the server SHOULD reply with `400` status
code.

If the client is not permitted to make the GraphQL request then the server
SHOULD reply with `403` status code.

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

## Processing the response

If the response uses a non-`200` response code and the media type of the
response payload is `application/json` then the client MUST not rely on the body
to be a well-formed GraphQL response since the source of the response may not be
the server but instead some intermediary such as API gateways, proxies,
firewalls, etc.
