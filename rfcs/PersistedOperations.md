# Persisted Operations

This RFC is intended to add (Automatic) Persisted Operations to the spec. A persisted operation contains
a _hash_ of the `operation` that we are sending to the server, the server can translate this to the proper
`operation` and execute it.

With Persisted Operations we have a few goals:

- Reduce request transfer size (GraphQL documents have a deterministic size)
- Support caching (avoid running into max-url size constraints when using the `GET` HTTP method)
- Lock down the amount of request permutations (the server can choose to only accept persisted operations it is aware of)

## Flow

### Producing the document-id

To produce a deterministic `documentId` we need a standardised way of stringifying to a minimal relevant document.
In doing so we also avoid producing different ids for documents that contain a possible extra redundant character.

We need to produce a minimal GraphQL Document according to the spec, [stripping all ignored tokens](https://spec.graphql.org/October2021/#sec-Language.Source-Text.Ignored-Tokens).
The only non-excessive ignored token is a single space character (U+0020) that must be inserted between two non-punctuator tokens.

After stringifying we can produce a SHA-256 hash of the stringified document which we can save somewhere and use as an identifier for our GraphQL server.

### Sending

When sending the persisted operation we will potentially be violating the current Request parameters where we say that `query`
is a _required_ property. The proposal here is to add an additional _optional_ property `documentId` which has to be present
when `query` isn't. We disallow both `documentId` and `query` being absent when performing a GraphQL Request.

The `documentId` would be the hashed representation of the stringified GraphQL document.

We can send all the operation kinds as a persisted operation, however we should make the distinction between `query` and `mutation`.
By definition `query` contains cacheable data so we can send this either as a `GET` or a `POST` so we follow the spec, however a
`mutation` represents side-effects so we should only send this as a `POST` request when leveraging persisted operations.

### Executing

When a server receives a request containing only `documentId` it is assumed that the server can perform this lookup, when the lookup
fails the server responds with a status-code 400 or 404 and denies the request. When the persisted operation can be found the server
can assume that it's dealing with a valid GraphQL document, however the schema could have changed so the server _should_ still validate
before executing.

## Automatic persisted operations

We can expand persisted operations with an "Automatic" mode which was initially pioneered by [Apollo](https://www.apollographql.com/docs/apollo-server/performance/apq/)
with the automatic mode we have no expectation of the server being aware of our `documentId` before sending it. This means we
can "teach" the server about the documents we are sending on the fly.

For hashing and sending the persisted operation we keep the aforementioned flow, however the flow after is altered as the server
responds with a status-code 200 and a GraphQLError containing a message of `PersistedOperationNotFound` when it supports persisted
operations, when persisted operations are unsupported the server can change the error message to `PersistedOperationNotSupported`.

The client is made aware of the server not knowing the document we are dealing with by means of this error, the client can now send
a new request containing both `documentId` and `query` in the parameters to make the server aware of the correlation. The server can
verify that the `documentId` and `query` are correctly being associated by performing the stringify and hash steps, this to avoid
malicious actors inserting faux associations.

The server can now save the association between the `documentId` and `query` for future requests.
