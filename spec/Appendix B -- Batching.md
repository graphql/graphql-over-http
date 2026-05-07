## B. Appendix: Batching

This appendix defines optional batching extensions for GraphQL over HTTP. It
covers both:

- **Variable batching**: one request object executes one operation multiple
  times by using a list of variable maps.
- **Request batching**: one HTTP request contains a list of request objects.

Variable batching and request batching MAY be used independently or together.

Note: GraphQL subscriptions are beyond the scope of this specification, so this
appendix defines batching semantics for query and mutation operations only.

### Motivation

Field-level batching can solve some cases, but it does not cover all shapes of
variable-dependent queries. For example:

```graphql example
query ($vendorId: ID!, $productId: ID!) {
  vendor(id: $vendorId) {
    id
    name
    stock(productId: $productId) {
      count
      nextDeliveryDue
      product {
        id
        name
      }
    }
  }
}
```

A list of variable maps allows this operation to execute multiple times in one
HTTP request, each time with a different pair of variable values.

### Request Shapes

A batching request is sent as a POST request with a JSON-encoded body.

This appendix extends the `{variables}` request parameter:

- `{variables}` MAY be a map (as defined in the main specification).
- `{variables}` MAY be a list of maps for variable batching.
- If `{variables}` is a list, each item in the list MUST be a map.

A batching request body MUST be one of the following:

- A single _GraphQL-over-HTTP request_ object.
- A list of _GraphQL-over-HTTP request_ objects.

If a request object's `{variables}` value is a list, the server MUST execute
that request once per variables entry.

If the request body is a list, each entry in that list MUST be processed as an
independent _GraphQL-over-HTTP request_.

### Execution Semantics

When a request object's `{variables}` value is a list, each variables map
represents a distinct execution of that request object.

The server MAY execute these executions in any order, including concurrently,
and the client MUST NOT assume serial execution or any ordering based on
variables list position.

If the request body is a list of request objects, the server MAY process those
request objects in any order, including concurrently, and the client MUST NOT
assume ordering based on request list position.

Within each individual execution, GraphQL execution semantics continue to apply
unchanged.

Note: Implementations often use batching mechanisms such as DataLoaders or batch
resolvers. A server may improve efficiency by sharing such batching mechanisms
across all executions produced from one batching request, rather than isolating
each execution.

### Accept

For batching responses, a client SHOULD include `application/jsonl` in the
`Accept` header.

### Response

A server implementing this appendix MUST support `application/jsonl` responses
for batching requests.

If `application/jsonl` is acceptable to the client, the server SHOULD respond
using `application/jsonl`.

A batching response is a list of _GraphQL responses_. When encoded as
`application/jsonl`, each list entry MUST be encoded as one JSON object per
line.

In addition to the standard fields of a _GraphQL response_, each batching
response entry MUST include index fields as follows:

- `requestIndex` (integer) is REQUIRED when the request body was a list of
  request objects. The value MUST be the 0-based index of the request object in
  that list.
- `variableIndex` (integer) is REQUIRED when the corresponding request object's
  `{variables}` value was a list. The value MUST be the 0-based index of that
  variables map.
- If both batching modes apply, both `requestIndex` and `variableIndex` are
  REQUIRED.

The server MAY return response entries in any order. These index fields allow
clients to correlate each entry with the corresponding request object and
variables entry.

If a client needs to process results in request-list order or variables-list
order, it MUST reorder entries using `requestIndex` and `variableIndex`.

When using `application/jsonl`, the server MAY deliver each response entry as
soon as it becomes available.

#### Variable Batching Example

```headers example
Content-Type: application/json
Accept: application/jsonl
```

```json example
{
  "query": "query getFoo($a: Int!) { foo(a: $a) }",
  "variables": [{ "a": 1 }, { "a": 2 }]
}
```

```jsonl example
{"variableIndex":1,"data":{"foo":2}}
{"variableIndex":0,"data":{"foo":1}}
```

#### Request Batching Example

```headers example
Content-Type: application/json
Accept: application/jsonl
```

```json example
[
  {
    "query": "query getFoo($a: Int!) { foo(a: $a) }",
    "variables": { "a": 1 }
  },
  {
    "query": "query getBar($b: Int!) { bar(b: $b) }",
    "variables": { "b": 1 }
  }
]
```

```jsonl example
{"requestIndex":1,"data":{"bar":1}}
{"requestIndex":0,"data":{"foo":1}}
```

#### Combined Request + Variable Batching Example

```headers example
Content-Type: application/json
Accept: application/jsonl
```

```json example
[
  {
    "query": "query getFoo($a: Int!) { foo(a: $a) }",
    "variables": [{ "a": 1 }, { "a": 2 }]
  },
  {
    "query": "query getBar($b: Int!) { bar(b: $b) }",
    "variables": { "b": 1 }
  }
]
```

```jsonl example
{"requestIndex":0,"variableIndex":1,"data":{"foo":2}}
{"requestIndex":1,"data":{"bar":1}}
{"requestIndex":0,"variableIndex":0,"data":{"foo":1}}
```
