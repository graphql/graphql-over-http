> **Stage 1: Proposal** 
> 
> This spec is under active development. For more information, please see the [Roadmap](ROADMAP.md) or [how to get involved](INTERESTED_DEVELOPERS.md).
>
> You can find our community in the [graphql-over-http channel](https://graphql.slack.com/archives/CRTKLUZRT) on the [GraphQL Foundation slack](https://graphql-slack.herokuapp.com/).

---

# GraphQL over HTTP

**Introduction**

HTTP is the most common choice as the client-server protocol when using GraphQL because of its ubiquity.
However the [GraphQL specification](https://graphql.github.io/graphql-spec/) deliberately does not specify the transport layer.

The closest thing to an official specification is the article [Serving over HTTP](https://graphql.org/learn/serving-over-http/).
Leading implementations on both client and server have mostly upheld those best practices and thus established
a de-facto standard that is commonly used throughout the ecosystem.

This specification is intended to fill this gap by specifying how GraphQL should be served over HTTP.
The main intention of this specification is to provide interoperability between different client libraries, tools
and server implementations.

**Spec Location**

The GraphQL over HTTP specification is edited in the [spec-md markdown file](./spec/GraphQLOverHTTP.md).

In the future, we plan that you would be able to view the generated form of the specification as well.
