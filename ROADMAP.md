# GraphQL over HTTP Spec Roadmap

The GraphQL over HTTP working group is a sub group of the GraphQL working group. Our aim is to prepare and publish version 1.0 of this spec.

## Version 1.0

### Goal

Provide a spec that allows clients and servers with different implementations and technology stacks to interact freely over HTTP if both client and server are compliant with the GraphQL over HTTP spec.

We intend 1.0 of the spec to largely establish and codify existing usage of GraphQL over HTTP. It should lay a foundation for future development and standardization.


### Date

_TBD_


### Scope

_Under active discussion_

- Express defacto standards

- Status codes
  - document the currently supported edge cases in common implementations

- Test suite 
  - Alongside the spec itself, provide a test suite that should pass if a server implements the spec

- Minimal Versioning/Modularity via OPTIONS
  - returning list of specs supported, and versions
  - Can we not add versioning until we need it, can we find the use cases. 


### Actions

_Under active discussion_

- [ ] Review existing implementations over HTTP and consider if there are standards that can be documented and extracted
- [ ] Update links to point to the GraphQL Foundation repos and websites not FB
- [ ] Copyright notice


## Future

_Placeholder for future items we may wish to address_

- Submit mime type application/graphql+json to IANA
- New HTTP SEARCH method and how it could be used https://tools.ietf.org/html/draft-snell-search-method-01
- Modularity - A way to communicate what features (and possibly versions) of the HTTP spec are supported by a server
- Persisted queries