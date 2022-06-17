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

This specification details how GraphQL should be served and consumed over HTTP
in order to maximize interoperability between clients, servers and tools. This
specification does not override or replace the
[GraphQL specification](https://spec.graphql.org/), it extends it to cover the
topic of serving GraphQL services over HTTP. If any statement or algorithm in
this specification appears to conflict with the GraphQL specification, the
behavior detailed in the GraphQL specification should be used.

The [GraphQL specification](https://spec.graphql.org/) deliberately does not
specify the transport layer, however HTTP is the most common choice when serving
GraphQL to remote clients due to its ubiquity.

Previous to this specification, the article
[Serving over HTTP](https://graphql.org/learn/serving-over-http/)
([WayBack Machine entry, 1st June 2022](https://web.archive.org/web/20220601155421/https://graphql.org/learn/serving-over-http/))
on the graphql.org website served as guidance, and leading implementations on
both client and server have mostly upheld those best practices and thus
established a de-facto standard that is commonly used throughout the ecosystem.
This specification aims to codify and expand on this work.

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

GraphQL queries and mutations naturally mirror the request/response message
model used in HTTP, allowing us to provide a GraphQL request in an HTTP request
and a GraphQL response in an HTTP response.

:: In this document, the term {GraphQL service} refers to an
[application service that has the capabilities defined by the GraphQL specification](https://spec.graphql.org/draft/#sec-Overview).

:: In this document, the term {GraphQL schema} refers to a
[schema as defined by the GraphQL specification](https://spec.graphql.org/draft/#sec-Schema).

:: In this document, the term {GraphQL request} refers to a
[request as defined by the GraphQL Specification](https://spec.graphql.org/draft/#request).

:: In this document, the term {GraphQL response} refers to a
[response as defined by the GraphQL Specification](https://spec.graphql.org/draft/#sec-Response).

:: In this document, the term {GraphQL request error} refers to a
[request error as defined by the GraphQL specification](https://spec.graphql.org/draft/#sec-Errors.Request-errors).

:: In this document, the term {GraphQL field error} refers to a
[field error as defined by the GraphQL specification](https://spec.graphql.org/draft/#sec-Errors.Field-errors)

:: In this document, the term {server} refers to a GraphQL over HTTP
Specification compliant HTTP server unless the context indicates otherwise.

The role of a {server} is to provide a {client} access to one or more GraphQL
services over HTTP. A {server} is not a {GraphQL service}, it is a GraphQL
service host.

:: In this document, the term {client} refers to a GraphQL over HTTP
Specification compliant HTTP client unless the context indicates otherwise.

The role of a {client} is to issue HTTP requests to a {server} in order to
interact with a {GraphQL service}.

# URL

A server MUST enable GraphQL requests to one or more GraphQL schemas.

Each GraphQL schema a server provides MUST be served via one or more URLs.

A server MUST NOT require the client to use different URLs for different GraphQL
query and mutation requests to the same GraphQL schema.

The GraphQL schema available via a single URL MAY be different for different
clients. For example, alpha testers or authenticated users may have access to a
schema with additional fields.

Servers MAY forbid individual requests by a client to any endpoint for any
reason, for example to require authentication or payment; when doing so they
SHOULD use the relevant `4xx` or `5xx` status code. This decision SHOULD NOT be
based on the contents of a well formed GraphQL request.

Note: The {server} should not make authorization decisions based on any part of
the {GraphQL request}; these decisions should be made by the {GraphQL schema}
during
[GraphQL's ExecuteRequest()](<https://spec.graphql.org/draft/#ExecuteRequest()>),
allowing for a partial response to be generated.

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
[serialization formats to be implemented](https://spec.graphql.org/draft/#sec-Serialization-Format).
Servers and clients MUST support JSON and MAY support other, additional
serialization formats.

For consistency and ease of notation, examples of the response are given in JSON
throughout this specification.

## Media Types

The following are the officially recognized GraphQL media types to designate
using the JSON encoding for GraphQL requests:

| Name               | Description                             |
| ------------------ | --------------------------------------- |
| `application/json` | Standard type for GraphQL JSON requests |

And for GraphQL responses:

| Name                       | Description                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| `application/graphql+json` | The preferred type for server responses; better HTTP compatibility |
| `application/json`         | An alternative type for responses (to support legacy clients)      |

For details of the shapes of these JSON payloads, please see
[Request](#sec-Request) and [Response](#sec-Response).

If the media type in a `Content-Type` or `Accept` header includes encoding
information, then the encoding MUST be `utf-8` (e.g.
`Content-Type: application/graphql+json; charset=utf-8`). If encoding
information is not included then `utf-8` MUST be assumed.

# Request

A server MUST accept POST requests, and MAY accept other HTTP methods, such as
GET.

## Request Parameters

A {GraphQL-over-HTTP request} is formed of the following parameters:

- {query} - A Document containing GraphQL Operations and Fragments to execute.
- {operationName} - (_Optional_): The name of the Operation in the Document to
  execute.
- {variables} - (_Optional_): Values for any Variables defined by the Operation.
- {extensions} - (_Optional_): This entry is reserved for implementors to extend
  the protocol however they see fit.

Note: When comparing {GraphQL-over-HTTP request} against the term
["request"](https://spec.graphql.org/draft/#request) in the GraphQL
specification you should note the {GraphQL schema} and "initial value" are not
included in the GraphQL-over-HTTP {request}, they are handled by the {server}
based on the URL used.

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

If the client supplies an `Accept` header, a client SHOULD include the media
type `application/graphql+json` in the `Accept` header.

### Legacy Watershed

Before `2025-01-01T00:00:00Z`, if the client supplies an `Accept` header, the
header SHOULD include the `application/json` media type. After this watershed,
this is no longer necessary.

It is RECOMMENDED that a client set the `Accept` header to
`application/graphql+json; charset=utf-8, application/json; charset=utf-8`.

Note: This recommended header enables compatibility with legacy servers whilst
still leveraging modern features if available in the server.

## GET

For HTTP GET requests, the GraphQL request parameters MUST be provided in the
query component of the request URL in the `application/x-www-form-urlencoded`
format as specified by
[WhatWG's URLSearchParams class](https://url.spec.whatwg.org/#interface-urlsearchparams).

The `query` parameter MUST be the string representation of the Source Text of
the Document as specified in
[the Language section of the GraphQL specification](https://spec.graphql.org/draft/#sec-Language).

The `variables` parameter, if used, MUST be represented as a URL-encoded JSON
string.

### Example

If we wanted to execute the following GraphQL query:

```raw graphql example
query($id: ID!){user(id:$id){name}}
```

With the following query variables:

```raw json example
{"id":"QVBJcy5ndXJ1"}
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

A client MUST indicate the media type of a request body using the `Content-Type`
header as specified in [RFC7231](https://datatracker.ietf.org/doc/html/rfc7231).

A server MUST support POST requests encoded with the `application/json` media
type (as indicated by the `Content-Type` header).

If the client does not supply a `Content-Type` header with a POST request, the
server SHOULD reject the request using the appropriate `4xx` status code.

A server MAY support POST requests encoded with and/or accepting other media
types.

If a client does not know the media types the server supports then it SHOULD
encode the request body in JSON (i.e. with `Content-Type: application/json`).

### JSON Encoding

When encoded in JSON, a GraphQL-over-HTTP request is a JSON object (map), with
the properties specified by the GraphQL-over-HTTP request:

- {query} - the string representation of the Source Text of the Document as
  specified in
  [the Language section of the GraphQL specification](https://spec.graphql.org/draft/#sec-Language).
- {operationName} - an optional string
- {variables} - an optional object (map), the keys of which are the variable
  names and the values of which are the variable values
- {extensions} - an optional object (map)

### Example

If we wanted to execute the following GraphQL query:

```raw graphql example
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

This request could be sent via an HTTP POST to the relevant URL using the JSON
encoding with the headers:

```headers example
Content-Type: application/json
Accept: application/graphql+json
```

And the body:

```json example
{
  "query": "query ($id: ID!) {\n  user(id: $id) {\n    name\n  }\n}",
  "variables": {
    "id": "QVBJcy5ndXJ1"
  }
}
```

# Response

When a server receives a GraphQL request, it must return a well‐formed response.
The server's response describes the result of validating and executing the
requested operation if successful, and describes any errors encountered during
the request.

A server must comply with
[RFC7231](https://datatracker.ietf.org/doc/html/rfc7231).

## Body

The body of the server's response MUST follow the requirements for a
[GraphQL response](https://graphql.github.io/graphql-spec/draft/#sec-Response),
encoded directly in the chosen media type.

A server MUST indicate the media type of the response with a `Content-Type`
header.

If an `Accept` header is provided, the server MUST respect the given `Accept`
header and attempt to encode the response in the highest priority media type
listed that is supported by the server.

In alignment with the
[HTTP 1.1 Accept](https://tools.ietf.org/html/rfc7231#section-5.3.2)
specification, when a client does not include at least one supported media type
in the `Accept` HTTP header, the server MUST either:

1. Disregard the `Accept` header and respond with the default media type of
   `application/json`, specifying this in the `Content-Type` header; OR
2. Respond with a `406 Not Acceptable` status code and stop processing the
   request.

A server MUST support requests which accept the `application/json` media type
(as indicated by the `Accept` header).

A server SHOULD support requests which accept the `application/graphql+json`
media type (as indicated by the `Accept` header).

Note: Prior to this specification, the media type `application/json` was in wide
use for the HTTP response payload type. Unfortunately this means clients cannot
trust responses from the server that do not use an HTTP 2xx status code (since
these replies may come from non-compliant HTTP servers or proxies somewhere in
the request chain). For this reason, this specification introduces the
`application/graphql+json` media type on responses; however, to give existing
servers time to move over, it is not required to be supported until 1st
January 2025.

### Legacy watershed

From 1st January 2025 (`2025-01-01T00:00:00Z`), a server MUST support requests
which accept the `application/graphql+json` media type (as indicated by the
`Accept` header).

Before 1st January 2025 (`2025-01-01T00:00:00Z`), if the client does not supply
an `Accept` header, the server SHOULD treat the request as if it had
`Accept: application/json`. From 1st January 2025 (`2025-01-01T00:00:00Z`), if
the client does not supply an `Accept` header, the server SHOULD treat the
request as if it had `Accept: application/graphql+json`.

Note: This default is in place to maintain compatibility with legacy clients.

## Validation

Validation of a well-formed GraphQL-over-HTTP request SHOULD apply all the
[validation rules](https://spec.graphql.org/draft/#sec-Validation) specified by
the GraphQL specification.

The server MAY, at its discretion, apply additional validation rules.

## Execution

Execution of a GraphQL-over-HTTP request follows
[GraphQL's ExecuteRequest()](<https://spec.graphql.org/draft/#ExecuteRequest()>)
algorithm.

## Status Codes

In case of errors that completely prevent the generation of a well-formed
GraphQL response, the server SHOULD respond with the appropriate status code
depending on the concrete error condition.

Note: Typically this will be the `400` (Bad Request) status code.

Otherwise, the status codes depends on the media type with which the GraphQL
response will be served:

### application/json

This section only applies when the response body is to use the
`application/json` media type.

The server SHOULD use the `200` status code, independent of any {GraphQL request
error} or {GraphQL field error} raised.

Note: A status code in the `4xx` or `5xx` ranges or status code `203` (and maybe
others) could originate from intermediary servers; since the client cannot
determine if an `application/json` response with arbitrary status code is a
well-formed GraphQL response (because it cannot trust the source) the server
must use `200` status code to guarantee to the client that the response has not
been generated or modified by an intermediary.

If the GraphQL response contains a non-null {data} entry then the server MUST
use the `200` status code.

Note: This indicates that no {GraphQL request error} was raised, though one or
more {GraphQL field error} may have been raised this is still a successful
execution - see "partial response" in the GraphQL specification.

The server SHOULD NOT use a `4xx` or `5xx` status code.

Note: For compatibility with legacy servers, this specification allows the use
of `4xx` or `5xx` status code for failed requests where the responses uses the
`application/json` media type, but it is strongly discouraged. To use `4xx` and
`5xx` status codes, please use the `application/graphql+json` media type.

### application/graphql+json

This section only applies when the response body is to use the
`application/graphql+json` media type.

If the GraphQL response contains the {data} entry and it is not {null}, then the
server MUST reply with a `2xx` status code and SHOULD reply with `200` status
code.

Note: The result of executing a GraphQL operation may contain partial data as
well as encountered errors. Errors that happen during execution of the GraphQL
operation typically become part of the result, as long as the server is still
able to produce a well-formed response. There's currently not an approved HTTP
status code to use for a "partial response," contenders include WebDAV's status
code "207 Multi-Status" and using a custom code such as "247 Partial Success."
[IETF RFC2616 Section 6.1.1](https://datatracker.ietf.org/doc/html/rfc2616#section-6.1.1)
states "codes are fully defined in section 10" implying that though more codes
are expected to be supported over time, valid codes must be present in this
document.

If the GraphQL response contains the {data} entry and it is {null}, then the
server SHOULD reply with a `2xx` status code and it is RECOMMENDED it replies
with `200` status code.

Note: Using `4xx` and `5xx` status codes in this situation is not recommended -
since no {GraphQL request error} has occurred it is seen as a "partial
response".

If the GraphQL response does not contain the {data} entry then the server MUST
reply with a `4xx` or `5xx` status code as appropriate.

Note: The GraphQL specification indicates that the only situation in which the
GraphQL response does not include the {data} entry is one in which the {errors}
entry is populated.

If the GraphQL request is invalid (e.g. it is malformed, or does not pass
validation) then the server SHOULD reply with `400` status code.

If the client is not permitted to issue the GraphQL request then the server
SHOULD reply with `403`, `401` or similar appropriate status code.

#### Examples

The following examples provide guidance on how to deal with specific error cases
when using the `application/graphql+json` media type to encode the response
body:

##### Invalid request body or parsing failure

For example: `NONSENSE`, `{"qeury": "{__typena`

Requests that do not constitute a well-formed GraphQL request should result in
status code `400` (Bad Request).

##### Document validation failure

Requests that fail to pass validation SHOULD be denied execution with a status
code of `400` (Bad Request).

Note: In certain circumstances, for example persisted operations that were
previously known to be valid, the server MAY attempt execution regardless of
validation errors.

Note: Validation rules include those specified in
[the Validation section of the GraphQL specification](http://spec.graphql.org/draft/#sec-Validation),
and any custom validation rules the server is using (for example: depth limit,
complexity limit).

##### Operation cannot be determined

If [GetOperation()](<https://spec.graphql.org/draft/#GetOperation()>) raises a
{GraphQL request error}, the server SHOULD NOT execute the request and SHOULD
return a status code of `400` (Bad Request).

##### Variable coercion failure

If
[CoerceVariableValues()](<https://spec.graphql.org/draft/#CoerceVariableValues()>)
raises a {GraphQL request error}, the server SHOULD NOT execute the request and
SHOULD return a status code of `400` (Bad Request).

##### Field errors encountered during execution

If the operation is executed and no {GraphQL request error} is raised then the
server SHOULD respond with a status code of `200` (Okay). This is the case even
if a {GraphQL field error} is raised during
[GraphQL's ExecuteQuery()](<https://spec.graphql.org/draft/#ExecuteQuery()>) or
[GraphQL's ExecuteMutation()](<https://spec.graphql.org/draft/#ExecuteMutation()>).

<!--
When we add support for subscriptions,
[GraphQL's MapSourceToResponseEvent()](<https://spec.graphql.org/draft/#MapSourceToResponseEvent()>)
should be added to the above.
-->

Note: The GraphQL specification
[differentiates field errors from request errors](https://spec.graphql.org/draft/#sec-Handling-Field-Errors)
and refers to the situation wherein a {GraphQL field error} occurs as a partial
response; it still indicates successful execution.

## Processing the response

If the response uses a non-`200` status code and the media type of the response
payload is `application/json` then the client MUST NOT rely on the body to be a
well-formed GraphQL response since the source of the response may not be the
server but instead some intermediary such as API gateways, proxies, firewalls,
etc.
