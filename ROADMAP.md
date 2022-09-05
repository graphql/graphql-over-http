# GraphQL over HTTP Specification Roadmap

## Mission

_Provide a specification that allows GraphQL clients and servers with different
implementations and technology stacks to interact freely over HTTP if both
client and server are compliant._

## Guiding principles

- Development is based on use cases
- Strive for backwards-compatible progress
  - Servers supporting later versions of this spec should support clients using
    earlier versions of this spec.

## Version 1.0

Version 1 aims to codify the most common existing uses of GraphQL queries and
mutations over HTTP whilst encouraging some improved practices. The majority of
GraphQL servers should find that they are already compatible with Version 1.0 of
the GraphQL-over-HTTP specification, although they should still put work in to
address the `SHOULD` behaviours that they may be missing, most notably around
the use of the `application/graphql-response+json` Content-Type.

Subscriptions, websockets and server-sent events are out of scope for version
1.0.

In layout and structure version 1.0 should lay a foundation for future
development and standardization.

### Scope

- GET/POST Requests
- Request parameters
- Serialization format
- Response body
- Status codes

### Actions

- Move to the GraphQL Foundation
- Set of running examples of ~5 of the most popular servers/clients with a
  standard, minimal GraphQL schema
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
- Versioning mechanism for servers/clients to communicate what versions they
  support
- Modularity - A way to communicate what features (and possibly versions) of the
  HTTP spec are supported by a server
- Persisted queries
- Multipart requests (file uploads)
- Submit MIME type application/graphql+json to IANA
- New HTTP SEARCH method and how it could be used
  https://tools.ietf.org/html/draft-snell-search-method-01

## Stages

The process of writing this specification may proceed according this rough
outline of stages. We are currently in the _Proposal Stage_.

### Stage 0: Preliminary

In the _Preliminary Stage_, things may change rapidly and no one should count on
any particular detail remaining the same.

- If a PR has no requests for changes for 2 weeks then it should be merged by
  one of the maintainers
- If anyone has an objection later, they just open a PR to make the change and
  it goes through the same process
- Optional: When there is lots of consensus but not 100% full consensus then:
  - We might merge the consensus-view and debate modifying it in parallel
  - Anyone can extract the non-controversial part and make a separate PR

When the spec seems stable enough, the working group would promote it to
_Proposal Stage_.

### Stage 1: Proposal

In the _Proposal Stage_, things can still change but it is reasonable to start
implementations.

- Before release of the spec, in "Draft" stage, we have to review the spec and
  review all open PRs
- Every merge to master would need strong consensus
- Only changes that address concerns
- Implementers could start trying things

After the spec and open PRs are reviewed and there is strong consensus, the
working group would promote it to _Draft Stage_.

### Stage 2: Draft

This corresponds to the general
[GraphQL Draft Stage](https://github.com/graphql/graphql-spec/blob/master/CONTRIBUTING.md#stage-2-draft)
