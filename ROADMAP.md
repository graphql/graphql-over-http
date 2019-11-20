# GraphQL over HTTP Spec Roadmap

The GraphQL over HTTP working group is a sub group of the GraphQL working group. Our aim is to prepare and publish version 1.0 of this spec.

## Version 1.0

### Goal

Provide a spec that allows clients and servers with different implementations and technology stacks to interact freely over HTTP if both client and server are compliant with the GraphQL over HTTP spec.

### Scope

_Under active discussion_

- Status codes
  - document the currently supported edge cases in common implementations


- Test suite 
  - Alongside the spec itself, provide a test suite that should pass if a server implements the spec

### Actions

_Under active discussion_

- [ ] Review existing implementations over HTTP and consider if there are standards that can be documented and extracted
- [ ] Update links to point to the GraphQL Foundation repos and websites not FB
- [ ] Copyright notice

### Open questions

- Current spec is agnostic about serialization format. Is there are good reason not to at least specify that a compliant client/server should implement JSON as a minimum? 
- Should details on how Subscriptions work over HTTP be given in this spec 1.0?


## Future

_Placeholder for scope and actions that do not fit into version 1.0_
