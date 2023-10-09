# Persisted Operations

This RFC is intended to add Persisted Operations to the spec. A persisted operation contains
a _hash_ of the `operation` that we are sending to the server, the server can translate this to the proper
`operation` and execute it.

With Persisted Operations we have a few goals:

- Reduce request transfer size (GraphQL documents have a deterministic size)
- Support caching (avoid running into max-url size constraints when using the `GET` HTTP method)
- Lock down the number of request permutations (the server can choose to only accept persisted operations it is aware of)

## Flow
### Producing the document-id

To produce a `documentId` we'll take a document containing the operation, including its fragments and perform a hashing algorithm like
SHA-256 on the document. Now the the correlation of a document and its hash can be persisted to a GraphQL Server and the client can
send this hash in GraphQL Requests.

### Sending

When sending the persisted operation we will potentially be violating the current Request parameters where we say that `query`
is a _required_ property. The proposal here is to add an additional _optional_ property `documentId` which has to be present
when `query` isn't. We disallow both `documentId` and `query` to be absent when performing a GraphQL Request.

The `documentId` would be the hashed representation of the stringified GraphQL document.

We can send all the operation kinds as a persisted operation, however, we should make the distinction between `query` and `mutation`.
By definition `query` contains cacheable data so we can send this either as a `GET` or a `POST` so we follow the spec, however a
`mutation` represents side-effects so we should only send this as a `POST` request when leveraging persisted operations.

When sending GraphQL variables along with a `query` operation over the `GET` HTTP method, the URL size limit (typically 2048
characters) should be considered if the URL's query string is to be employed to encode these GraphQL variables. If this is an
issue, one should consider utilizing a `POST` request's `body` or an HTTP header to encode these variables. When using a HTTP header
to encode the variables the server has to add this request-header to the `Vary` header to ensure the correct cache-key is achieved.

### Executing

When a server receives a request containing only `documentId` it is assumed that the server can perform this lookup, when the lookup
fails the server responds with a status code 400 or 404 and denies the request. When the persisted operation can be found the server
can assume that it's dealing with a valid GraphQL document, however, the schema could have changed so the server _should_ still validate
before executing.
