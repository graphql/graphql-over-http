# GraphQL over HTTP Implementations

The following is a list of popular server and client implementations of GraphQL over HTTP.

The goal of this document is to help the working-group identify common patterns in doing GraphQL over HTTP. To that end only _popular_ _implementations_ are listed here. If you're looking for a canonical list, see [graphql.org/code](https://graphql.org/code).

#### Definition: _"Popular"_

> The project has more than 100 stars on its GitHub repo.

Though it's not a perfect measure, it's a commonly accessible measure get a sense of how popular a library or project is.

#### Definition: _"Implementation"_

> Published software that interacts with GraphQL over HTTP.

This broadly includes GraphQL servers, clients, middleware, SDK level libraries and IDEs. To be listed, it **must** at least support GraphQL over HTTP, although it **may** support other transport protocols.

## Server implementations

| Name                                                                 | Language    | ⭐️  |
| -------------------------------------------------------------------- | ----------- | ---- |
| [apollo-server](https://github.com/apollographql/apollo-server)      | JavaScript  | 8674 |
| [graphql](https://github.com/graphql-go/graphql)                     | Go          | 5758 |
| [Graphene](https://github.com/graphql-python/graphene)               | Python      | 5235 |
| [graphql-yoga](https://github.com/prisma-labs/graphql-yoga)          | TypeScript  | 5184 |
| [express-graphql](https://github.com/graphql/express-graphql)        | JavaScript  | 4937 |
| [graphql-ruby](https://github.com/rmosolgo/graphql-ruby)             | Ruby        | 4058 |
| [graphql-java](https://github.com/graphql-java/graphql-java)         | Java        | 3889 |
| [GraphQL for .NET](https://github.com/graphql-dotnet/graphql-dotnet) | C#/.NET     | 3810 |
| [gqlgen](https://github.com/99designs/gqlgen)                        | Go          | 3672 |
| [graphql-php](https://github.com/webonyx/graphql-php)                | PHP         | 3474 |
| [absinthe](https://github.com/absinthe-graphql/absinthe)             | Elixir      | 2967 |
| [graphql-go](https://github.com/graph-gophers/graphql-go)            | Go          | 3065 |
| [Juniper](https://github.com/graphql-rust/juniper)                   | Rust        | 2025 |
| [Sangria](https://github.com/sangria-graphql/sangria)                | Scala       | 1647 |
| [Lighthouse](https://github.com/nuwave/lighthouse)                   | PHP/Laravel | 1424 |
| [lacinia](https://github.com/walmartlabs/lacinia)                    | Clojure     | 1325 |
| [graphql-laravel](https://github.com/rebing/graphql-laravel)         | PHP/Laravel | 1066 |
| [Thunder](https://github.com/samsarahq/thunder)                      | Go          | 930  |
| [graphql-elixir](https://github.com/graphql-elixir/graphql)          | Elixir      | 838  |
| [Siler](https://github.com/leocavalcante/siler)                      | PHP         | 853  |
| [graphql-upload](https://github.com/jaydenseric/graphql-upload)      | JavaScript  | 832  |
| [GraphQL.Net](https://github.com/chkimes/graphql-net)                | C#/.NET     | 802  |
| [Hot Chocolate](https://github.com/ChilliCream/hotchocolate)         | C#          | 777  |
| [koa-graphql](https://github.com/chentsulin/koa-graphql)             | JavaScript  | 728  |
| [tartiflette](https://github.com/tartiflette/tartiflette)            | Python      | 506  |
| [graphql-kotlin](https://github.com/ExpediaGroup/graphql-kotlin)     | Kotlin      | 377  |
| [graphql-relay-go](https://github.com/graphql-go/relay)              | Go          | 335  |
| [graphql-clj](https://github.com/tendant/graphql-clj)                | Clojure     | 269  |
| [graphql-erlang](https://github.com/shopgun/graphql-erlang)          | Erlang      | 258  |
| [Alumbra](https://github.com/alumbra/alumbra)                        | Clojure     | 136  |

⭐️ Accurate as of December 2019.

## Client implementations

| Name                                                                          | Language   | ⭐️   |
| ----------------------------------------------------------------------------- | ---------- | ----- |
| [Relay](https://github.com/facebook/relay)                                    | JavaScript | 13909 |
| [apollo-client](https://github.com/apollographql/apollo-client)               | TypeScript | 12826 |
| [graphiql](https://github.com/graphql/graphiql)                               | JavaScript | 9712  |
| [GraphQL Playground](https://github.com/prisma-labs/graphql-playground)       | TypeScript | 5456  |
| [graphql-editor](https://github.com/graphql-editor/graphql-editor)            | TypeScript | 4221  |
| [urql](https://github.com/FormidableLabs/urql)                                | TypeScript | 3920  |
| [Apollo iOS](https://github.com/apollographql/apollo-ios)                     | Swift      | 2228  |
| [graphql-request](https://github.com/prisma-labs/graphql-request)             | TypeScript | 2071  |
| [apollo-android](https://github.com/apollographql/apollo-android)             | Java       | 1998  |
| [Altair](https://github.com/imolorhe/altair)                                  | TypeScript | 1900  |
| [Lokka](https://github.com/kadirahq/lokka)                                    | JavaScript | 1486  |
| [graphql-hooks](https://github.com/nearform/graphql-hooks)                    | JavaScript | 1045  |
| [apollo-upload-client](https://github.com/jaydenseric/apollo-upload-client)   | JavaScript | 859   |
| [graphql-react](https://github.com/jaydenseric/graphql-react)                 | JavaScript | 482   |
| [machinebox/graphql](https://github.com/machinebox/graphql)                   | Go         | 473   |
| [nanographql](https://github.com/yoshuawuyts/nanographql)                     | JavaScript | 360   |
| [GQL](https://github.com/graphql-python/gql)                                  | Python     | 310   |
| [graphql](https://github.com/shurcooL/graphql)                                | Go         | 304   |
| [re-graph](https://github.com/oliyh/re-graph)                                | Clojure    | 269   |
| [GraphQL.Client](https://github.com/graphql-dotnet/graphql-client)            | C#         | 259   |
| [Grafoo](https://github.com/grafoojs/grafoo)                                  | TypeScript | 251   |
| [nodes](https://github.com/americanexpress/nodes)                             | Java       | 215   |
| [sgqlc](https://github.com/profusion/sgqlc)                                   | Python     | 168   |
| [python-graphql-client](https://github.com/prisma-labs/python-graphql-client) | Python     | 107   |

⭐️ Accurate as of December 2019.
