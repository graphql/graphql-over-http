# A. Appendix: `application/json` responses

This section only applies when the response body uses or may use the legacy
`application/json` media type for compatibility reasons.

Previous to this specification, the article
[Serving over HTTP](https://graphql.org/learn/serving-over-http)
([WayBack Machine entry, 1st June 2022](https://web.archive.org/web/20220601155421/https://graphql.org/learn/serving-over-http))
on the graphql.org website served as guidance. This article used
`application/json` as media type for the response.

In some cases, the response received by a client may not originate from a
GraphQL service, but instead from an intermediary—such as an API gateway, proxy,
firewall or other middleware—that does not implement this specification. Such an
intermediary might produce the response to indicate an error, returning a
response with `4xx` or `5xx` status code and potentially using the standard
`application/json` media type to encode the reason for the error. Such a
response is unlikely to be a valid GraphQL response.

For this reason, a client receiving an `application/json` response can only rely
on the response being a well-formed _GraphQL response_ if the status code is
`200`. However, responding to all GraphQL requests with HTTP 200 means that
intermediary observability software cannot determine the status of the request
without processing the response body.

Responding with the `application/graphql-response+json` media type enables the
client to distinguish a well-formed _GraphQL response_ from an intermediary
response, and is required by both clients and servers under this specification.
This appendix exists to increase interoperability with legacy clients/servers
that have not yet adopted this specification.

Note: Servers may wish to respond to `Accept: application/json` requests with
the `application/graphql-response+json` media type so that related HTTP tooling
may utilize the HTTP status codes of responses without having to be
GraphQL-aware. Doing so may impact error-handling behavior of legacy clients,
and may prevent legacy clients from processing responses if they require the
response `Content-Type` to be `application/json`.

## Accept

To enable compatibility with legacy servers, the client SHOULD include the media
type `application/json` in the `Accept` header and it is RECOMMENDED that such a
client set the `Accept` header to
`application/graphql-response+json, application/json;q=0.9`.

Note: The `q=0.9` parameter tells content negotiation that `application/json`
should only be used if `application/graphql-response+json` is not supported.

## Status codes

When responding with the legacy `application/json` media type, the server SHOULD
use the `200` status code for every response to a well-formed _GraphQL-over-HTTP
request_ independent of any _GraphQL request error_ or _GraphQL field error_
raised.

If the response uses a non-`2xx` status code then the client MUST NOT rely on
the body to be a well-formed _GraphQL response_.

Note: A status code in the `4xx` or `5xx` ranges or status code `203` (and maybe
others) could originate from an intermediary; since the client cannot determine
if an `application/json` response with arbitrary status code is a well-formed
_GraphQL response_ (because it cannot trust the source) the server must use
`200` status code to guarantee to the client that the response has not been
generated or modified by an intermediary. See
[processing a response](#sec-Processing-a-response) for more details.

If the _GraphQL response_ contains a non-null {data} entry then the server MUST
use the `200` status code.

Note: This indicates that no _GraphQL request error_ was raised, though one or
more _GraphQL field error_ may have been raised this is still a successful
execution - see "partial response" in the GraphQL specification.

The server SHOULD NOT use a `4xx` or `5xx` status code for a response to a
well-formed _GraphQL-over-HTTP request_.

Note: For compatibility with legacy servers, this specification allows the use
of `4xx` or `5xx` status codes for a failed well-formed _GraphQL-over-HTTP
request_ where the response uses the `application/json` media type, but it is
strongly discouraged. To use `4xx` and `5xx` status codes in these situations,
please use the `application/graphql-response+json` media type.

If the URL is not used for other purposes, the server SHOULD use a `4xx` status
code to respond to a request that is not a well-formed _GraphQL-over-HTTP
request_.

Note: For compatibility with legacy servers, this specification allows the use
of `2xx` or `5xx` status codes when responding to invalid requests using the
`application/json` media type, but it is strongly discouraged.

Note: URLs that enable GraphQL requests may enable other types of requests - see
the [URL](#url) section.

### Examples

The following examples provide guidance on how to deal with specific error cases
when using the `application/json` media type to encode the response body:

#### JSON parsing failure

For example a POST request body of `NONSENSE` or `{"query":` (note: invalid
JSON).

Requests that the server cannot interpret SHOULD result in status code `400`
(Bad Request).

#### Invalid parameters

For example a POST request body of `{"qeury": "{__typename}"}` (note: typo) or
`{"query": "query Q ($i:Int!) { q(i: $i) }", "variables": [7]}` (note: invalid
shape for `variables`).

A request that does not constitute a well-formed _GraphQL-over-HTTP request_
SHOULD result in status code `400` (Bad Request).

#### Document parsing failure

For example a POST request body of `{"query": "{"}`.

Requests where the _GraphQL document_ cannot be parsed SHOULD result in status
code `200` (Okay).

#### Document validation failure

If a request fails to pass _GraphQL validation_, the server SHOULD NOT execute
the request and SHOULD return a status code of `200` (Okay).

#### Operation cannot be determined

If [GetOperation()](<https://spec.graphql.org/draft/#GetOperation()>) raises a
_GraphQL request error_, the server SHOULD NOT execute the request and SHOULD
return a status code of `200` (Okay).

#### Variable coercion failure

If
[CoerceVariableValues()](<https://spec.graphql.org/draft/#CoerceVariableValues()>)
raises a _GraphQL request error_, the server SHOULD NOT execute the request and
SHOULD return a status code of `200` (Okay).

For example the well-formed GraphQL-over-HTTP request:

```json
{
  "query": "query getItemName($id: ID!) { item(id: $id) { id name } }",
  "variables": { "id": null }
}
```

would fail variable coercion as the value for `id` would fail to satisfy the
query document's expectation that `id` is non-null.

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
