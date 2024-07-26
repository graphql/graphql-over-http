# A. Appendix: Persisted Documents

This appendix defines an optional extension to the GraphQL-over-HTTP protocol
that allows for the usage of "persisted documents".

:: A _persisted document_ is a GraphQL document (strictly: an
[`ExecutableDocument`](https://spec.graphql.org/draft/#ExecutableDocument)) that
has been persisted such that the server may retrieve it based on an identifier
indicated in the HTTP request.

This feature can be used as an operation allow-list, as a way of improving the
caching of GraphQL operations, or just as a way of reducing the bandwidth
consumed from sending the full GraphQL Document to the server on each request.

Typically, support for the _persisted document_ feature is implemented via a
"middleware" that sits in front of the GraphQL service and transforms a
_persisted document request_ into a _GraphQL-over-HTTP request_.

:: A _persisted operation_ is a _persisted document_ which contains only one
GraphQL operation and all the fragments this operation references (recursively).

## Identifying a Document

:: A _document identifier_ is a string-based identifier that uniquely identifies
a GraphQL Document.

Note: A _document identifier_ must be unique, otherwise there is a risk of
responses confusing the client. Even if the selection sets are identical, even
whitespace changes may change the location from which errors are raised, and
thus should generate different document identifiers.

A _document identifier_ must either be a _prefixed document identifier_ or a
_custom document identifier_.

### Prefixed Document Identifier

:: A _prefixed document identifier_ is a document identifier that contains at
least one colon symbol (`:`). The text before the first colon symbol is called
the {prefix}, and the text after it is called the {payload}. The {prefix}
identifies the method of identification used. Applications may use their own
identification methods by ensuring that the prefix starts `x-`; otherwise, all
prefixes are reserved for reasons of future expansion.

### SHA256 Hex Document Identifier

:: A _SHA256 hex document identifier_ is a _prefixed document identifier_ where
{prefix} is `sha256` and {payload} is 64 hexadecimal characters (in lower case).

The payload of a _SHA256 hex document identifier_ must be produced via the
lower-case hexadecimal encoding of the SHA256 hash (as specified in
[RFC4634](https://datatracker.ietf.org/doc/html/rfc4634)) of the Source Text of
the GraphQL Document (as specified in
[the Language section of the GraphQL specification](https://spec.graphql.org/draft/#sec-Language))
encoded using the UTF-8 character set.

A service which accepts a _persisted document request_ SHOULD support the
_SHA256 hex document identifier_ for compatibility.

#### Example

The following GraphQL query (with no trailing newline):

```graphql example
query ($id: ID!) {
  user(id: $id) {
    name
  }
}
```

Would have the following _SHA256 hex document identifier_:

```example
sha256:7dba4bd717b41f10434822356a93c32b1fb4907b983e854300ad839f84cdcd6e
```

Whereas the same query with all optional whitespace omitted:

```raw graphql example
query($id:ID!){user(id:$id){name}}
```

Would have this different _SHA256 hex document identifier_:

```example
sha256:71f7dc5758652baac68e4a10c50be732b741c892ade2883a99358f52b555286b
```

### Custom Document Identifier

:: A _custom document identifier_ is a document identifier that contains no
colon symbols (`:`). The meaning of a custom document identifier is
implementation specific.

Note: A 32 character hexadecimal _custom document identifier_ is likely to be an
MD5 hash of the GraphQL document, as traditionally used by Relay.

### Document identifier syntax

A _document identifier_ must only contain colons (`:`) and characters that are
defined as
[`unreserved` in RFC3986](https://datatracker.ietf.org/doc/html/rfc3986#section-2.3)
(alphanumeric characters (`A-Z`, `a-z`, `0-9`), dashes (`-`), periods (`.`),
underscores (`_`), and tildes (`~`)).

DocumentIdentifier ::

- PrefixedDocumentIdentifier
- CustomDocumentIdentifier

PrefixedDocumentIdentifier ::

- Prefix `:` Payload

Prefix :: UnreservedCharacter+

Payload :: PayloadCharacter+

CustomDocumentIdentifier :: UnreservedCharacter+

PayloadCharacter ::

- UnreservedCharacter
- `:`

UnreservedCharacter ::

- Letter
- Digit
- `-`
- `.`
- `_`
- `~`

Letter :: one of

- `A` `B` `C` `D` `E` `F` `G` `H` `I` `J` `K` `L` `M`
- `N` `O` `P` `Q` `R` `S` `T` `U` `V` `W` `X` `Y` `Z`
- `a` `b` `c` `d` `e` `f` `g` `h` `i` `j` `k` `l` `m`
- `n` `o` `p` `q` `r` `s` `t` `u` `v` `w` `x` `y` `z`

Digit :: one of

- `0` `1` `2` `3` `4` `5` `6` `7` `8` `9`

## Persisting a Document

To utilize persisted documents for a request, the client must possess a unique
_document identifier_ for the associated GraphQL Document, and the server must
be able to retrieve this GraphQL Document using the document identifier. The
method through which the client and server achieve this is implementation
specific.

Note: When used as an operation allow-list, persisted documents are typically
stored into a trusted shared key-value store at client build time (either
directly, or indirectly via an authenticated request to the server) such that
the server may retrieve them given the identifier at request time. This must be
done in a secure manner (preventing untrusted third parties from adding their
own persisted document) such that the server will be able to retrieve the
identified document within a _persisted document request_ and know that it is
trusted.

Note: When used solely as a bandwidth optimization, as in the technique known
colloquially as "automatic persisted queries (APQ)," an error-based mechanism
might be used wherein the client assumes that the document has already been
persisted, but if the request fails due to unknown _document identifier_ the
client issues a follow-up request containing the full GraphQL Document to be
persisted.

Note: When persisting a document for which the identifier has been derived by
the client, it is generally good practice for the client to issue both the
GraphQL Document and the document identifier to the server; the server could
then regenerate the document identifier from the GraphQL Document independently,
and check that the identifiers match before storing the Document. If the
identifier is not derived on the client then the client must coordinate
retrieval of a document identifier from the server to be incorporated into the
deployed client.

## Persisted Document Request

A server MAY accept a _persisted document request_ via `GET` or `POST`.

### Persisted Document Request Parameters

:: A _persisted document request_ is an HTTP request that encodes the following
parameters in one of the manners described in this specification:

- {documentId} - (_Required_, string): The string identifier for the Document.
- {operationName} - (_Optional_, string): The name of the Operation in the
  identified Document to execute.
- {variables} - (_Optional_, map): Values for any Variables defined by the
  Operation.
- {extensions} - (_Optional_, map): This entry is reserved for implementors to
  extend the protocol however they see fit.

### GET

For a _persisted document request_ using HTTP GET, parameters SHOULD be provided
in the query component of the request URL, encoded in the
`application/x-www-form-urlencoded` format as specified by the
[WhatWG URLSearchParams class](https://url.spec.whatwg.org/#interface-urlsearchparams).

The {documentId} parameter must be a string _document identifier_.

The {operationName} parameter, if present, must be a string.

Each of the {variables} and {extensions} parameters, if used, MUST be encoded as
a JSON string.

Setting the value of the {operationName} parameter to the empty string is
equivalent to omitting the {operationName} parameter.

A client MAY provide the _persisted document request_ parameters in another way
if the server supports that.

Note: A common alternative pattern is to use a dedicated URL for each _persisted
operation_ (e.g.
`https://example.com/graphql/sha256:71f7dc5758652baac68e4a10c50be732b741c892ade2883a99358f52b555286b`).

GET requests MUST NOT be used for executing mutation operations. If a mutation
operation is indicated by the value of {operationName} and the GraphQL Document
identified by {documentId}, the server MUST respond with error status code `405`
(Method Not Allowed) and halt execution. This restriction is necessary to
conform with the long-established semantics of safe methods within HTTP.

#### Canonical Parameters

Parameters SHOULD be provided in the order given in the list above, any optional
parameters which have no value SHOULD be omitted, and parameters encoded as JSON
string SHOULD use the most compressed form (with all optional whitespace
omitted). A server MAY reject requests where this is not adhered to.

Note: Ensuring that parameters are in their canonical form helps improve cache
hit ratios.

#### Example

Executing the GraphQL Document identified by
`"sha256:71f7dc5758652baac68e4a10c50be732b741c892ade2883a99358f52b555286b"` with
the following query variables:

```raw json example
{"id":"QVBJcy5ndXJ1"}
```

This request could be sent via an HTTP GET as follows:

```url example
https://example.com/graphql?documentId=sha256:71f7dc5758652baac68e4a10c50be732b741c892ade2883a99358f52b555286b&variables=%7B%22id%22%3A%22QVBJcy5ndXJ1%22%7D
```

### POST

For a _persisted document request_ using HTTP POST, the request MUST have a body
which contains values of the _persisted document request_ parameters encoded in
one of the officially recognized GraphQL media types, or another media type
supported by the server.

#### JSON Encoding

When encoded in JSON, a _persisted document request_ is encoded as a JSON object
(map), with the properties specified by the persisted document request:

- {documentId} - the string identifier for the Document
- {operationName} - an optional string
- {variables} - an optional object (map), the keys of which are the variable
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
  "documentId": "sha256:7dba4bd717b41f10434822356a93c32b1fb4907b983e854300ad839f84cdcd6e",
  "variables": {
    "id": "QVBJcy5ndXJ1"
  }
}
```

## Persisted Document Response

When a server that implements _persisted documents_ receives a well-formed
_persisted document request_, it must return a well‐formed _GraphQL response_.

The server should retrieve the GraphQL Document identified by the {documentId}
parameter. If the server fails to retrieve the document, it MUST respond with a
well-formed _GraphQL response_ consisting of a single error. Otherwise, it will
construct a _GraphQL-over-HTTP request_ using this document and the other
parameters of the _persisted document request_, and then follow the details in
the [Response section](#sec-Response).
