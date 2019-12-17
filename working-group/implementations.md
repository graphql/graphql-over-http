# GraphQL over HTTP Implementations

The following is a list of existing server and client implementations of GraphQL over HTTP. The goal of this document is to help the working-group identify common patterns in doing GraphQL over HTTP. To that end we only list here _popular_ HTTP servers and clients. If you're looking for a canonical list of implementations, see [Graphql - Code](https://graphql.org/code/). To be included here, the server or client MUST at least support GraphQL over HTTP, although it MAY support other transport protocols and it MUST be _popular_.

**Definition: "_Popular_"**

> The project has more than 100 stars on its GitHub repo. 

Though it's not a perfect measure, it is a commonly accessible measure get a sense of how popular a library or project is.

## Popular Servers

| Name | Language | ⭐️ |
|---|---|---|
| [apollo-server](https://github.com/apollographql/apollo-server) | JavaScript | 8500
| [graphql](https://github.com/graphql-go/graphql) | Go | 5700
| [Graphene](https://github.com/graphql-python/graphene) | Python | 5200
| [graphql-yoga](https://github.com/prisma-labs/graphql-yoga) | TypeScript | 5100
| [express-graphql](https://github.com/graphql/express-graphql) | JavaScript | 4900
| [graphql-ruby](https://github.com/rmosolgo/graphql-ruby) | Ruby | 4000
| [graphql-java](https://github.com/graphql-java/graphql-java) | Java | 3800
| [GraphQL for .NET](https://github.com/graphql-dotnet/graphql-dotnet) | C#/.NET | 3800
| [gqlgen](https://github.com/99designs/gqlgen) | Go | 3600
| [graphql-php](https://github.com/webonyx/graphql-php) | PHP | 3400
| [absinthe](https://github.com/absinthe-graphql/absinthe) | Elixir | 3000
| [graphql-go](https://github.com/graph-gophers/graphql-go) | Go | 3000
| [Juniper](https://github.com/graphql-rust/juniper) | Rust | 1900
| [Sangria](https://github.com/sangria-graphql/sangria) | Scala | 1600
| [Lighthouse](https://github.com/nuwave/lighthouse) | PHP/Laravel | 1400
| [lacinia](https://github.com/walmartlabs/lacinia) | Clojure | 1300
| [graphql-laravel](https://github.com/rebing/graphql-laravel) | PHP/Laravel | 1100
| [Thunder](https://github.com/samsarahq/thunder) | Go | 914
| [graphql-elixir](https://github.com/graphql-elixir/graphql) | Elixir | 837
| [Siler](https://github.com/leocavalcante/siler) | PHP | 837
| [GraphQL.Net](https://github.com/chkimes/graphql-net) | C#/.NET | 795
| [Hot Chocolate](https://github.com/ChilliCream/hotchocolate) | C# | 736
| [koa-graphql](https://github.com/chentsulin/koa-graphql) | JavaScript | 719
| [tartiflette](https://github.com/tartiflette/tartiflette) | Python | 487
| [graphql-kotlin](https://github.com/ExpediaGroup/graphql-kotlin/) | Kotlin | 336
| [graphql-relay-go](https://github.com/graphql-go/relay) | Go | 331
| [graphql-clj](https://github.com/tendant/graphql-clj) | Clojure | 267
| [graphql-erlang](https://github.com/shopgun/graphql-erlang) | Erlang | 254
| [Alumbra](https://github.com/alumbra/alumbra) | Clojure | 135

⭐️ accurate as of November 2019

## Popular Clients

| Name | Language | ⭐️ |
|---|---|---|
| [Relay](https://github.com/facebook/relay) | JavaScript | 13800
| [apollo-client](https://github.com/apollographql/apollo-client) | TypeScript | 12600
| [graphiql](https://github.com/graphql/graphiql) | JavaScript | 9600
| [GraphQL Playground](https://github.com/prisma-labs/graphql-playground) | TypeScript | 5400
| [graphql-editor](https://github.com/graphql-editor/graphql-editor) | TypeScript | 4100
| [urql](https://github.com/FormidableLabs/urql) | TypeScript | 3800
| [Apollo iOS](https://github.com/apollographql/apollo-ios) | Swift | 2200
| [graphql-request](https://github.com/prisma-labs/graphql-request) | TypeScript | 2000
| [apollo-android](https://github.com/apollographql/apollo-android) | Java | 2000
| [Altair](https://github.com/imolorhe/altair) | TypeScript | 1800
| [Lokka](https://github.com/kadirahq/lokka) | JavaScript | 1500
| [graphql-hooks](https://github.com/nearform/graphql-hooks) | JavaScript | 1000
| [machinebox/graphql](https://github.com/machinebox/graphql) | Go | 463
| [nanographql](https://github.com/yoshuawuyts/nanographql) | JavaScript | 357
| [GQL](https://github.com/graphql-python/gql) | Python | 304
| [Graphql](https://github.com/shurcooL/graphql#readme) | Go | 294
| [re-graph](https://github.com/oliyh/re-graph/) | Clojure | 260
| [Grafoo](https://github.com/grafoojs/grafoo) | TypeScript | 250
| [GraphQL.Client](https://github.com/graphql-dotnet/graphql-client) | C# |  244
| [nodes](https://github.com/americanexpress/nodes) | Java | 208
| [sgqlc](https://github.com/profusion/sgqlc) | Python | 160
| [python-graphql-client](https://github.com/prisma-labs/python-graphql-client) | Python | 108

⭐️ accurate as of November 2019

Note: there's also a little bit of blurring in that some of these are SDK-level client libraries and others are IDEs. 