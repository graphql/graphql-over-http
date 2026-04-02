## GraphQL Over HTTP

Note: **Stage 2: Draft** &mdash; this spec is not yet official, but is now a
fully formed solution. Drafts may continue to evolve and change, occasionally
dramatically, and are not guaranteed to be accepted. Therefore, it is unwise to
rely on a draft in a production GraphQL Service.

---

# GraphQL over HTTP

**Introduction**

This specification details how GraphQL should be served and consumed over HTTP
in order to maximize interoperability between clients, servers and tools. This
specification does not override or replace the
[GraphQL specification](https://spec.graphql.org); it extends it to cover the
topic of serving GraphQL services over HTTP. If any statement or algorithm in
this specification appears to conflict with the GraphQL specification, the
behavior detailed in the GraphQL specification should be used (and an issue
raised).

The [GraphQL specification](https://spec.graphql.org) deliberately does not
specify the transport layer; however, HTTP is the most common choice when
serving GraphQL to remote clients due to its ubiquity.

**Copyright notice**

Copyright © 2022-present, GraphQL contributors

THESE MATERIALS ARE PROVIDED “AS IS”. The parties expressly disclaim any
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

:: In this document, the term _server_ refers to a GraphQL over HTTP
Specification compliant HTTP server unless the context indicates otherwise.

The role of a _server_ is to provide a _client_ access to one or more GraphQL
services over HTTP. A _server_ is not a _GraphQL service_; it is a GraphQL
service host.

:: In this document, the term _client_ refers to a GraphQL over HTTP
Specification compliant HTTP client unless the context indicates otherwise.

The role of a _client_ is to issue HTTP requests to a _server_ in order to
interact with a _GraphQL service_.

Note: GraphQL Subscriptions are beyond the scope of this specification at this
time.

# URL

A _server_ MUST enable GraphQL requests to one or more GraphQL schemas.

Each GraphQL schema a _server_ provides MUST be served via one or more URLs.

A _server_ MUST NOT require the _client_ to use different URLs for different
GraphQL query and mutation requests to the same GraphQL schema.

The GraphQL schema available via a single URL MAY be different for different
clients. For example, alpha testers or authenticated users may have access to a
schema with additional fields.

A _server_ MAY forbid individual requests by a _client_ to any endpoint for any
reason, for example to require authentication or payment; when doing so it
SHOULD use the relevant `4xx` or `5xx` status code. This decision SHOULD NOT be
based on the contents of a well-formed _GraphQL-over-HTTP request_.

Note: The _server_ should not make authorization decisions based on any part of
the _GraphQL request_; these decisions should be made by the _GraphQL schema_
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

Servers and clients MUST support JSON as a serialization format.

## Media Types

The following are the officially recognized GraphQL media types:

| Name                                | Description                           |
| ----------------------------------- | ------------------------------------- |
| `application/json`                  | Media type for GraphQL JSON requests  |
| `application/graphql-response+json` | Media type for GraphQL JSON responses |

For details of the shapes of these JSON payloads, please see
[Request](#sec-Request) and [Response](#sec-Response).

If the media type in a `Content-Type` or `Accept` header does not include
encoding information and matches one of the officially recognized GraphQL media
types, then `utf-8` MUST be assumed (e.g. for header
`Content-Type: application/graphql-response+json`, UTF-8 encoding would be
assumed).

# Request

A server MUST accept POST requests, and MAY accept other HTTP methods, such as
GET.

## Request Parameters

:: A _GraphQL-over-HTTP request_ is an HTTP request that encodes the following
parameters in one of the manners described in this specification:

- {query} - (_Required_, string): The string representation of the Source Text
  of a GraphQL Document as specified in
  [the Language section of the GraphQL specification](https://spec.graphql.org/draft/#sec-Language).
- {operationName} - (_Optional_, string): The name of the Operation in the
  Document to execute.
- {variables} - (_Optional_, map): Values for any Variables defined by the
  Operation.
- {extensions} - (_Optional_, map): This entry is reserved for implementers to
  extend the protocol however they see fit, as specified in
  [the Response section of the GraphQL specification](https://spec.graphql.org/draft/#sec-Response-Format.Response).

Servers receiving a request with additional properties MUST ignore properties
they do not understand.

If implementers need to add additional information to a request they MUST do so
via other means; the RECOMMENDED approach is to add an implementer-scoped entry
to the {extensions} object.

Note: When comparing _GraphQL-over-HTTP request_ against the term
["request"](https://spec.graphql.org/draft/#request) in the GraphQL
specification you should note the _GraphQL schema_ and "initial value" are not
included in the GraphQL-over-HTTP _request_; they are handled by the _server_
based on the URL used.

Note: Be aware that `query` is a misleading parameter name as its value is a
string describing one or more operations, each of which may be a query or
mutation. A better name would have been `document`, but the term `query` is well
established.

Note: So long as it is a string, {query} does not have to parse or validate to
be part of a well-formed _GraphQL-over-HTTP request_.

## Accept

A client MUST indicate the media types that it supports in responses using the
`Accept` HTTP header as specified in
[RFC7231](https://datatracker.ietf.org/doc/html/rfc7231).

The client MUST include the media type `application/graphql-response+json` in
the `Accept` header.

## GET

For HTTP GET requests, the _GraphQL-over-HTTP request_ parameters MUST be
provided in the query component of the request URL, encoded in the
`application/x-www-form-urlencoded` format as specified by the
[WHATWG URLSearchParams class](https://url.spec.whatwg.org/#interface-urlsearchparams).

The {query} parameter MUST be the string representation of the source text of
the document as specified in
[the Language section of the GraphQL specification](https://spec.graphql.org/draft/#sec-Language).

The {operationName} parameter, if present and not the empty string, MUST be a
string.

Each of the {variables} and {extensions} parameters, if present, MUST be encoded
as a JSON object string.

For robustness, specifying the empty string for optional request parameters is
equivalent to not specifying them at all.

The {operationName} parameter, if present and not the empty string, represents
the name of the operation to be executed within the {query} as a string.

GET requests MUST NOT be used for executing mutation operations. This
restriction is necessary to conform with the long-established semantics of safe
methods within HTTP.

Note: In the final URL all of these parameters will appear in the query
component of the request URL as URL-encoded values due to the WHATWG
URLSearchParams encoding specified above.

Note: By the above, `operationName=null` represents an operation with the name
`"null"` (such as `query null { __typename }`).

### Examples

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

An empty {operationName} is allowed. This is a valid request:

```url example
http://example.com/graphql?query=%7B%20foo%20%7D&operationName=
```

## POST

A GraphQL POST request MUST have a body which contains values of the
_GraphQL-over-HTTP request_ parameters encoded using the `application/json`
media type.

The {query} parameter MUST be the string representation of the source text of
the document as specified in
[the Language section of the GraphQL specification](https://spec.graphql.org/draft/#sec-Language).

The {operationName} parameter, if present and not null, MUST be a string.

Each of the {variables} and {extensions} parameters, if present and not null,
MUST be a JSON object.

For robustness, specifying null for optional request parameters is equivalent to
not specifying them at all.

A client MUST indicate the media type of a request body using the `Content-Type`
header as specified in [RFC7231](https://datatracker.ietf.org/doc/html/rfc7231).

A server MUST support POST requests encoded with the `application/json` media
type (as indicated by the `Content-Type` header) encoded with UTF-8.

For POST requests using an officially recognized GraphQL `Content-Type` without
indicating an encoding, the server MUST assume the encoding is `utf-8`.

If the client does not supply a `Content-Type` header with a POST request, the
server SHOULD reject the request using the appropriate `4xx` status code.

If the values of {query} and {operationName} indicate that a mutation operation
is to be executed with a GET request, the server MUST respond with error status
code `405` (Method Not Allowed) and halt execution.

Note: Rejecting such requests encourages clients to supply a `Content-Type`
header with every POST request. A server has the option to assume any media type
they wish when none is supplied, with the understanding that parsing the request
may fail.

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
Accept: application/graphql-response+json
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

When a server receives a well-formed _GraphQL-over-HTTP request_, it must return
a well‐formed _GraphQL response_. The server's response describes the result of
validating and executing the requested operation if successful and describes any
errors encountered during the request.

A server must comply with
[RFC7231](https://datatracker.ietf.org/doc/html/rfc7231).

## Body

The body of the server's response MUST follow the requirements for a _GraphQL
response_, encoded directly in the chosen media type.

If an `Accept` header is provided, the server MUST respect the given `Accept`
header and attempt to encode the response in the highest priority media type
listed that is supported by the server.

A _server_ MUST support responses using the `application/graphql-response+json`
media type.

A server MAY additionally support other response media types.

A server MUST indicate the media type of the response with a `Content-Type`
header, and SHOULD indicate the encoding (e.g.
`application/graphql-response+json; charset=utf-8`).

In alignment with the
[HTTP 1.1 Accept](https://tools.ietf.org/html/rfc7231#section-5.3.2)
specification, when a client does not include at least one supported media type
in the `Accept` HTTP header, the server MUST either:

1. Respond with a `406 Not Acceptable` status code and stop processing the
   request (RECOMMENDED); OR
2. Disregard the `Accept` header and respond with the server's choice of media
   type (NOT RECOMMENDED).

Note: It is unlikely that a client can process a response that does not match
one of the media types it has requested, hence `406 Not Acceptable` being the
recommended response. However, the server authors may know better about the
specific clients consuming their endpoint, thus both approaches are permitted.

## Validation

Validation of a well-formed _GraphQL-over-HTTP request_ SHOULD apply all the
[validation rules](https://spec.graphql.org/draft/#sec-Validation) specified by
the GraphQL specification.

The server MAY, at its discretion, apply additional validation rules.

Note: Examples of additional validation rules the server may apply include depth
limit, complexity limit, etc.

## Execution

Execution of a _GraphQL-over-HTTP request_ follows
[GraphQL's ExecuteRequest()](<https://spec.graphql.org/draft/#ExecuteRequest()>)
algorithm.

Note: In general, a _GraphQL-over-HTTP request_ that does not pass validation
should not be executed; however in certain circumstances, for example persisted
operations that were previously known to be valid, the server may attempt
execution regardless of validation errors.

## Status Code

In case of errors that completely prevent the generation of a well-formed
_GraphQL response_, the server MUST respond with the appropriate status code
depending on the concrete error condition, and MUST NOT respond with a `2xx`
status code.

Note: Typically the appropriate status code will be `400` (Bad Request).

If the _GraphQL response_ contains the {data} entry and it is not {null}, then
the server MUST reply with a `2xx` status code.

Note: The result of executing a GraphQL operation may contain partial data as
well as encountered errors. Errors that happen during execution of the GraphQL
operation typically become part of the result, as long as the server is still
able to produce a well-formed _GraphQL response_. There's currently not an
approved HTTP status code to use for a "partial response," contenders include
WebDAV's status code "207 Multi-Status" and using a custom code such as "247
Partial Success."
[IETF RFC2616 Section 6.1.1](https://datatracker.ietf.org/doc/html/rfc2616#section-6.1.1)
states "codes are fully defined in section 10" implying that though more codes
are expected to be supported over time, valid codes must be present in this
document.

If the _GraphQL response_ contains the {data} entry and it is {null}, then the
server SHOULD reply with a `2xx` status code.

Note: Using `4xx` and `5xx` status codes in this situation is not recommended -
since no _GraphQL request error_ has occurred it is seen as a "partial
response". This is typically the case if an error is propagated to the root
field.

If the _GraphQL response_ does not contain the {data} entry then the server MUST
reply with a `4xx` or `5xx` status code as appropriate.

Note: The GraphQL specification indicates that the only situation in which the
_GraphQL response_ does not include the {data} entry is one in which the
{errors} entry is populated.

If the request is not a well-formed _GraphQL-over-HTTP request_, or it does not
pass validation, then the server SHOULD reply with `400` status code.

If the client is not permitted to issue the GraphQL request then the server
SHOULD reply with `403`, `401` or similar appropriate status code.

### Examples

The following examples provide guidance on how to deal with specific error
cases:

#### JSON parsing failure

For example a POST request body of `NONSENSE` or `{"query":` (note: invalid
JSON).

Requests that the server cannot interpret should result in status code `400`
(Bad Request).

#### Invalid parameters

For example a POST request body of `{"qeury": "{__typename}"}` (note: typo) or
`{"query": "query Q ($i:Int!) { q(i: $i) }", "variables": [7]}` (note: invalid
shape for `variables`).

A request that does not constitute a well-formed _GraphQL-over-HTTP request_
SHOULD result in status code `400` (Bad Request).

#### Document parsing failure

For example a POST request body of `{"query": "{"}`.

Requests where the _GraphQL document_ cannot be parsed should result in status
code `400` (Bad Request).

#### Document validation failure

If a request fails _GraphQL validation_, the server SHOULD return a status code
of `400` (Bad Request) without proceeding to GraphQL execution.

#### Operation cannot be determined

If [GetOperation()](<https://spec.graphql.org/draft/#GetOperation()>) raises a
_GraphQL request error_, the server SHOULD NOT execute the request and SHOULD
return a status code of `400` (Bad Request).

#### Variable coercion failure

If
[CoerceVariableValues()](<https://spec.graphql.org/draft/#CoerceVariableValues()>)
raises a _GraphQL request error_, the server SHOULD NOT execute the request and
SHOULD return a status code of `400` (Bad Request).

#### Field errors encountered during execution

If the operation is executed and no _GraphQL request error_ is raised then the
server SHOULD respond with a status code of `200` (Okay). This is the case even
if a _GraphQL field error_ is raised during
[GraphQL's ExecuteQuery()](<https://spec.graphql.org/draft/#ExecuteQuery()>) or
[GraphQL's ExecuteMutation()](<https://spec.graphql.org/draft/#ExecuteMutation()>).

<!--
When we add support for subscriptions,
[GraphQL's MapSourceToResponseEvent()](<https://spec.graphql.org/draft/#MapSourceToResponseEvent()>)
should be added to the above.
-->

Note: The GraphQL specification
[differentiates field errors from request errors](https://spec.graphql.org/draft/#sec-Handling-Field-Errors)
and refers to the situation wherein a _GraphQL field error_ occurs as a partial
response; it still indicates successful execution.

# Non-normative notes

This section of the specification is non-normative, even where the words and
phrases specified in RFC2119 are used.

## application/json response media type

Previous to this specification, the article
[Serving over HTTP](https://graphql.org/learn/serving-over-http)
([WayBack Machine entry, 1st June 2022](https://web.archive.org/web/20220601155421/https://graphql.org/learn/serving-over-http))
on the graphql.org website served as guidance.

This article used `application/json` as media type for the response.

In some cases, the response received by a client may not originate from a
GraphQL service, but instead from an intermediary—such as an API gateway, proxy,
firewall or other middleware—that does not implement this specification. Such an
intermediary might produce the response to indicate an error, returning a
response with `4xx` or `5xx` status code and potentially using the standard
`application/json` media type to encode the reason for the error. Such a
response is unlikely to be a valid GraphQL response.

For this reason, a client application receiving an `application/json` response,
could rely on the response being a well-formed _GraphQL response_ only if the
status code is `200`.

This caused multiple observability issues because it was challenging to
distinguish a well-formed _GraphQL response_ from an intermediary response.

`application/graphql-response+json` allows to distringuish a well-formed
_GraphQL response_ from another intermediary response and is the required media
type moving forward.

For compatibility reasons, clients and servers may support `application/json` as
described in this section.

Note: Servers may wish to only support the `application/graphql-response+json`
media type so that related HTTP tooling may utilize the HTTP status codes of
responses without having to be GraphQL-aware.

### Accept

To maximize compatibility, a client may include the media type
`application/json` in the `Accept` header. When doing this, it is recommended
that the client set the `Accept` header to
`application/graphql-response+json, application/json;q=0.9`.

Note: The `q=0.9` parameter tells content negotiation that `application/json`
should only be used if `application/graphql-response+json` is not supported.

### Status code

When using the `application/json` media type, the server should use the `200`
status code for every response to a well-formed _GraphQL-over-HTTP request_,
independent of any _GraphQL request error_ or _GraphQL field error_ raised.

If the response uses a non-`200` status code then the client must not rely on
the body to be a well-formed _GraphQL response_.

If the _GraphQL response_ contains a non-null {data} entry then the server must
use the `200` status code.

Note: This indicates that no _GraphQL request error_ was raised, though one or
more _GraphQL field error_ may have been raised this is still a successful
execution - see "partial response" in the GraphQL specification.

The server should not use a `4xx` or `5xx` status code for a response to a
well-formed _GraphQL-over-HTTP request_.

If the URL is not used for other purposes, the server should use a `4xx` status
code to respond to a request that is not a well-formed _GraphQL-over-HTTP
request_.

## Security

This specification focuses solely on the intersection of GraphQL and HTTP.
General concerns of either technology, including security concerns, are out of
scope, except where their interaction introduces additional considerations.

### HTTP

Implementers are expected to have a solid understanding of the security
implications of exposing a service over HTTP, and are responsible for
implementing relevant mitigations and solutions. This specification will not
repeat standard HTTP best practices such as not using `GET` for requests with
side effects, safe logging of requests without revealing sensitive information,
ensuring all connections are encrypted via HTTPS, placing limits on the length
of incoming data, implementing rate limits, authorization and authentication
security, request tracing, intrusion detection, and so on.

### GraphQL

Implementers are further expected to have a solid understanding of the security
implications of running a GraphQL service and are responsible for implementing
relevant mitigations and solutions there. For example, they may: limit the size
and token count of GraphQL documents; ensure document validity; limit the number
of errors a response may return; limit information revealed via errors; enforce
validation and execution timeouts and pagination limits; implement query depth
and complexity limits; implement authentication and authorization; apply rate
limits to critical logic; and so on.

### Exercise caution

Where this specification leaves flexibility for the implementer, the implementer
should be very cautious when exercising this freedom. Implementers must make
themselves aware of and account for the security implications of their choices;
while many alternative choices can be secured, securing them is outside of the
scope of this specification.

For example, this specification allows alternative media types to be used to
encode the request body; however, media types such as `multipart/form-data` or
`application/x-www-form-urlencoded` may result in the request being treated by a
browser as a "simple request", which does not require a "preflight", thereby
opening the server up to Cross-Site Request Forgery (CSRF/XSRF) attacks. The
recommended `application/json` media type requires a "preflight" check when
issued cross-domain. See
[CORS protocol](https://fetch.spec.whatwg.org/#http-cors-protocol) in the WHATWG
Fetch spec for more details on this.

Note: One approach used by the community to mitigate CSRF risks is to ensure a
request is not "simple" by requiring a custom header—such as
`GraphQL-Require-Preflight`—is included. The presence of a custom header forces
browsers to enact a "preflight" check, thereby adding an additional layer of
security. (This is not a standard header, and many alternative headers could
serve the same purpose. This is presented merely as an example of a pattern seen
in the community.)

Further extending this example, using `multipart/form-data` may allow large
values to be referenced multiple times in a GraphQL operation, potentially
causing the GraphQL service to process a much larger GraphQL request than the
HTTP request size would suggest.

### Other resources

For more detailed security considerations, please refer to
[RFC 7231](https://tools.ietf.org/html/rfc7231),
[RFC 6454](https://tools.ietf.org/html/rfc6454), other relevant RFCs, and other
resources such as [OWASP](https://owasp.org).

## Future compatibility

Supporting formats not described by this specification may have potential
conflicts with future versions of this specification as ongoing development aims
to standardize and ensure the security and interoperability of GraphQL over HTTP
whilst accounting for its growing feature set. For this reason, it is
recommended to adhere to the officially recognized formats outlined here.
