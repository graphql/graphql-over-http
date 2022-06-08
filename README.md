> **Stage 0: Preliminary**
>
> This spec is in a preliminary stage of active development, and can change a
> lot before reaching `Draft` stage. For more information, please see the
> [Roadmap](ROADMAP.md) or [how to get involved](INTERESTED_DEVELOPERS.md).
>
> You can find our community in the
> [graphql-over-http channel](https://discord.com/channels/625400653321076807/863141924126588958)
> on the [GraphQL Foundation Discord](https://discord.graphql.org).

---

# GraphQL over HTTP

**Introduction**

HTTP is the most common choice as the client-server protocol when using GraphQL
because of its ubiquity. However the
[GraphQL specification](https://graphql.github.io/graphql-spec/) deliberately
does not specify the transport layer.

The closest thing to an official specification is the article
[Serving over HTTP](https://graphql.org/learn/serving-over-http/). Leading
implementations on both client and server have mostly upheld those best
practices and thus established a de-facto standard that is commonly used
throughout the ecosystem.

This specification is intended to fill this gap by specifying how GraphQL should
be served over HTTP. The main intention of this specification is to provide
interoperability between different client libraries, tools and server
implementations.

**Spec Location**

The GraphQL over HTTP specification is edited in the
[spec-md markdown file](./spec/GraphQLOverHTTP.md).

In the future, we plan that you would be able to view the generated form of the
specification as well.

### Contributing to this repo

This repository is managed by EasyCLA. Project participants must sign the free
([GraphQL Specification Membership agreement](https://preview-spec-membership.graphql.org)
before making a contribution. You only need to do this one time, and it can be
signed by
[individual contributors](https://individual-spec-membership.graphql.org/) or
their [employers](https://corporate-spec-membership.graphql.org/).

To initiate the signature process please open a PR against this repo. The
EasyCLA bot will block the merge if we still need a membership agreement from
you.

You can find
[detailed information here](https://github.com/graphql/graphql-wg/tree/main/membership).
If you have issues, please email
[operations@graphql.org](mailto:operations@graphql.org).

If your company benefits from GraphQL and you would like to provide essential
financial support for the systems and people that power our community, please
also consider membership in the
[GraphQL Foundation](https://foundation.graphql.org/join).

---

Copyright Joint Development Foundation Projects, LLC, GraphQL Series.<br>
[graphql.org](https://graphql.org) | [Spec](https://spec.graphql.org) |
[GitHub](https://github.com/graphql/graphql-over-http) |
[GraphQL Foundation](https://foundation.graphql.org) |
[Code of Conduct](https://code-of-conduct.graphql.org) |
[Discord](https://discord.com/channels/625400653321076807/863141924126588958) |
[Store](https://store.graphql.org)
