# Batching

Modern apps are chatty—they require a lot of data,
and thus make a lot of requests to underlying services to fulfill those needs.
Layering GraphQL over your services solves this issue,
since it encapsulates multiple requests into a single operation, avoiding the cost of multiple round trips.

Batching is the process of taking a group of requests, combining them into one,
and making a single request with the same data that all of the other queries would have made.

## Mechanism

The batching mechanism that is typically used today is based upon the standard mechanism
for sending GraphQL queries through an HTTP `POST` request.

In a normal request, the request body would contain the request parameters at the top level.
For example if the `Content-Type` is `application/json` then the request body may be:

```json
{
  "query": "query($id: ID!){user(id:$id){name}}",
  "variables": { "id": "QVBJcy5ndXJ1" }
}
```

A batched query would bundle such multiple operations in an array:

```json
[{
  "query": "query($id: ID!){user(id:$id){name}}",
  "variables": { "id": "QVBJcy5ndXJ1" }
}, {
  "query": "mutation{foo}",
}]
```

## Implementations

- https://www.apollographql.com/docs/link/links/batch-http/
- https://webonyx.github.io/graphql-php/executing-queries/#query-batching
- https://github.com/rmosolgo/graphql-ruby/blob/master/guides/queries/multiplex.md
- https://hotchocolate.io/docs/batching#request-batching

