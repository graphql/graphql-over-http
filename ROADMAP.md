# GraphQL over HTTP Specification Roadmap

## Vision

_Provide a specification that allows GraphQL clients and servers with different implementations and technology stacks to interact freely over HTTP if both client and server are compliant._

## Guiding principles

- Development is based on use cases
- Strive for backwards-compatible progress
  - Servers supporting later versions of this spec should support clients using earlier versions of this spec.

## Version 1.0

We intend 1.0 of the spec to establish and codify existing common usages of GraphQL over HTTP. In layout and structure it should lay a foundation for future development and standardization. However, we intend to see no major new features or standards emerging in this version. 

### Scope

- GET/POST Requests
- Request parameters
- Serialization format
- Response body
- Status codes

### Actions

- Move to the GraphQL Foundation
- Set of running examples of ~5 of the most popular servers/clients with a standard, minimal GraphQL schema
- Test suite to automate testing of GraphQL servers compliance with the spec
  - Can be applied to examples of popular server or public GraphQL APIs
- Results of popular libraries and APIs compliance with current spec
- Structuring of existing spec to be easier to extend in later versions
- Fine detail focus on each of the main sections of the spec
- Update links to point to the GraphQL Foundation repos and websites not FB
- Adopt similar formatting/tooling for spec to match the GraphQL spec

## Future versions

Future versions of the spec may include these concepts:

- Caching
- Batching
- Versioning mechanism for servers/clients to communicate what versions they support
- Modularity - A way to communicate what features (and possibly versions) of the HTTP spec are supported by a server
- Persisted queries
- Multi-part uploads
- Submit MIME type application/graphql+json to IANA
- New HTTP SEARCH method and how it could be used https://tools.ietf.org/html/draft-snell-search-method-01
