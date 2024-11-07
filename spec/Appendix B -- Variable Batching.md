## B. Appendix: Variable Batching

This appendix defines an optional extension to the GraphQL-over-HTTP protocol that allows for the batching of multiple sets of variables in a single GraphQL request.

:: **Variable batching** enables a client to execute the same GraphQL operation multiple times with different sets of variables, all within a single HTTP request. This can significantly reduce the number of HTTP requests required when performing multiple similar operations, thus improving network efficiency and reducing overhead.

Field batching, such as querying multiple products by ID in a single request, can work in some cases.

```graphql
query($ids: [ID!]!) {
    productsByIds(ids: $ids) {
        id
        name
    }
}
```

However, this approach doesn’t work when variables are used within nested selections.

```graphql
query($ids: [ID!]! $first: Int!) {
    productsByIds(ids: $ids) {
        id
        name
        reviews(first: $first) {
            id
            body
        }
    }
}
```

Variable batching allows a single request to include multiple sets of variables. This approach is particularly useful for GraphQL gateways to fetch multiple entities by their keys and bulk operations, reducing network overhead and improving performance by consolidating multiple operations into a single request.

### Variable Batching Request

A server MAY accept a **variable batching request** via `POST`.

#### Request Parameters

A _variable batching request_ follows the same structure as a standard GraphQL request, with the key difference being in the `variables` parameter. All other parameters are consistent with the standard GraphQL-over-HTTP protocol:

- {query} - (_Required_, string): The string representation of the Source Text
  of a GraphQL Document as specified in
  [the Language section of the GraphQL specification](https://spec.graphql.org/draft/#sec-Language).
- {operationName} - (_Optional_, string): The name of the Operation in the
  Document to execute.
- **{variables}** (Required, array of maps):
  Instead of a single map, the `variables` parameter is an array of maps. Each map in the array represents a different set of variables to be used in executing the operation.
- {extensions} - (_Optional_, map): This entry is reserved for implementors to
  extend the protocol however they see fit.

### Accept

A client SHOULD indicate the media types that it supports in responses using the `Accept` HTTP header as specified in [RFC7231](https://datatracker.ietf.org/doc/html/rfc7231).

For **variable batching requests**, the client SHOULD include the media type `application/graphql+jsonl` in the `Accept` header to indicate that it expects a batched response in JSON Lines format.

If the client supplies an Accept header, the client SHOULD include the media type `application/graphql+jsonl` in the Accept header.

If the client does not supply an `Accept` header, the server MAY respond with a default content type of `application/graphql+jsonl`, or it may use any other media type it supports. However, to ensure compatibility and clarity, it is RECOMMENDED that the client explicitly states its preferred media types using the `Accept` header.

### POST

A **variable batching request** instructs the server to perform a query or mutation operation multiple times, once for each set of variables provided. The request MUST have a body that contains the values of the _variable batching request_ parameters encoded in the `application/graphql+jsonl` media type, or another media type supported by the server.

A client MUST indicate the media type of a request body using the `Content-Type` header as specified in [RFC7231](https://datatracker.ietf.org/doc/html/rfc7231).

A server MUST support POST requests encoded with the `application/json` media type (as outlined in the GraphQL-over-HTTP specification).

If the client does not supply a `Content-Type` header with a POST request, the server SHOULD reject the request using the appropriate `4xx` status code.

### JSON Encoding

When encoded in JSON, a _GraphQL-over-HTTP request_ is encoded as a JSON object
(map), with the properties specified by the GraphQL-over-HTTP request:

- {query} - the string representation of the Source Text of the Document as
  specified in
  [the Language section of the GraphQL specification](https://spec.graphql.org/draft/#sec-Language).
- {operationName} - an optional string
- **{variables}** - An array of JSON objects (maps), where each map corresponds to a set of variables to be used in the query.
  names and the values of which are the variable values
- {extensions} - an optional object (map)

#### Example

If we wanted to execute the following GraphQL query:

```raw graphql example
query ($id: ID!) {
  user(id: $id) {
    name
  }
}
```

With the following query variable sets:

```json example
[
  {
      "id": "QVBJcy5ndXJ1"
  },
  {
      "id": "QVBJcy5ndXJ2"
  },
  {
      "id": "QVBJcy5ndXJ3"
  }
]
```

This request could be sent via an HTTP POST to the relevant URL using the JSON
encoding with the headers:

```headers example
Content-Type: application/json
Accept: application/graphql-response+jsonl
```

And the body:

```json example
{
  "query": "query ($id: ID!) {\n  user(id: $id) {\n    name\n  }\n}",
  "variables": [
    {
      "id": "QVBJcy5ndXJ1"
    },
    {
      "id": "QVBJcy5ndXJ2"
    },
    {
      "id": "QVBJcy5ndXJ3"
    }
  ]
}
```

### Response

When a server receives a well-formed _variable batching request_, it MUST return a well‐formed stream of _GraphQL responses_. Each response in the stream corresponds to the result of validating and executing the requested operation with one set of variables. The server's response stream describes the outcome of each operation, including any errors encountered during the execution of the request.

A server must comply with [RFC7231](https://datatracker.ietf.org/doc/html/rfc7231).

Each response in the stream follows the standard GraphQL response format, with the addition of a required `variableIndex` field at the top level of each response. The `variableIndex` indicates the index of the variables map from the original request, allowing the client to associate each response with the correct set of variables.

**Note:** The server MAY respond with results in any order. The `variableIndex` field ensures that clients can correctly match each response to its corresponding set of variables, regardless of the order in which the responses are returned.

#### Response Structure

Each line in the JSON Lines (JSONL) response MUST include the following fields:

- **`variableIndex`** (Required, integer): The index of the corresponding variables map from the original request's `variables` array. This allows clients to match each response with the correct set of variables.
- **`data`** (Optional, map): The data resulting from the execution of the GraphQL operation with the corresponding set of variables.
- **`errors`** (Optional, array): An array of errors, if any were encountered during the execution of the operation.
- **`extensions`** (Optional, map): A map that MAY include additional information about the request and execution, as needed by implementors.

## Body

A server MUST indicate the media type of the response with a `Content-Type` header, and SHOULD indicate the encoding (e.g. `application/graphql-response+jsonl; charset=utf-8`).

TODO benjie: Should we repeat this or should we take this as a given?

If an `Accept` header is provided, the server MUST respect the given `Accept`
header and attempt to encode the response in the highest priority media type
listed that is supported by the server.


