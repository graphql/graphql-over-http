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

#### Response Media Type

A **variable batching request** by default use the `Content-Type: application/graphql+jsonl` header for its responses. This indicates that the request body is formatted in JSON Lines, where each line represents the response for a single set of variables.




