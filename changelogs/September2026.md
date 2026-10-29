# September 2026 Changelog

This describes the set of changes incorporated into the initial version of the
GraphQL over HTTP specification. It's intended to ease the review of the
specification for reviewers or curious readers, but is not normative. Please
read the [specification document](https://http-spec.graphql.org/September2026/)
itself for full detail and context.

## Editor's notes

For years, the GraphQL community has served GraphQL over HTTP using the simple
conventions laid out in the
[2016 Serving over HTTP documentation](https://web.archive.org/web/20160917044642/https://graphql.org/learn/serving-over-http/)
on the graphql.org website. These were a useful common pattern, but left
important details open to interpretation. `GET` support was optional and had
issues with long GraphQL documents and their related variables being encoded
into the query string, so `POST` became the de facto standard. Responses with
non-`2xx` status codes could originate from non-GraphQL middleware such as rate
limiters and reverse proxies, confusing the client when they attempted to decode
the message as if it were a GraphQL response &mdash; so `200` became the de
facto standard even for error responses. This led to issues with monitoring
tools and related infrastructure, which could not determine the status of
GraphQL requests without reading the response body.

The GraphQL over HTTP specification builds on those initial conventions,
improving interoperability and addressing these problems, whilst also laying the
groundwork for where we'd like to see GraphQL over HTTP expand in the future.
This first edition is the result of 8 years of collaboration between over 20
contributors. Its most significant addition is
`application/graphql-response+json`, a media type indicating a response is a
GraphQL response honoring this specification. With the ambiguity of traditional
`application/json` responses resolved, GraphQL servers can use appropriate HTTP
status codes, and clients can recognize a GraphQL response independent of status
code.

When using this new media type, the custom `294 Partial Success` status code is
recommended to represent that a request executed, but delivers both `data` and
`errors`. This enables monitoring tools to spot partially successful requests
without reading response bodies.

This is only the first edition. In future editions, we hope to explore HTTP
`QUERY` verb support, persisted documents, dedicated operation URLs, variable
batching, _request_ media type(s), feature discovery for client
auto-configuration, an endpoint to retrieve the GraphQL schema SDL, and more. If
you wish to help advance this specification,
[get involved](https://github.com/graphql/graphql-over-http/blob/main/CONTRIBUTING.md)!

I would like to extend a huge thank you to all of the contributors who have
helped turn years of practical experience, discussion and review into this first
release, and all the server, library and framework authors who have supplied
feedback from their implementations.

Thank you!

- [@benjie](https://github.com/benjie), Editor

## Contributors

Anyone is welcome to join working group meetings and contribute to the GraphQL
over HTTP specification. See
[Contributing.md](https://github.com/graphql/graphql-over-http/blob/main/CONTRIBUTING.md)
for more information. Thank you to these community members for their technical
contribution to this edition of the GraphQL over HTTP specification.

| Author             | Github                                               |
| ------------------ | ---------------------------------------------------- |
| Anthony Miller     | [@AnthonyMDev](https://github.com/AnthonyMDev)       |
| Ben Evans          | [@kittylyst](https://github.com/kittylyst)           |
| Benedikt Franke    | [@spawnia](https://github.com/spawnia)               |
| Benjie             | [@benjie](https://github.com/benjie)                 |
| Benoit 'BoD' Lubek | [@BoD](https://github.com/BoD)                       |
| David Glasser      | [@glasser](https://github.com/glasser)               |
| Gabriel McAdams    | [@ghmcadams](https://github.com/ghmcadams)           |
| Ivan Goncharov     | [@ivangoncharov](https://github.com/ivangoncharov)   |
| Ivan Maximov       | [@sungam3r](https://github.com/sungam3r)             |
| Jayden Seric       | [@jaydenseric](https://github.com/jaydenseric)       |
| Laurin             | [@n1ru4l](https://github.com/n1ru4l)                 |
| Lee Byron          | [@leebyron](https://github.com/leebyron)             |
| Martin Bonnin      | [@martinbonnin](https://github.com/martinbonnin)     |
| Michael Staib      | [@michaelstaib](https://github.com/michaelstaib)     |
| Mmatsa             | [@mmatsa](https://github.com/mmatsa)                 |
| Phillip Krüger     | [@phillip-kruger](https://github.com/phillip-kruger) |
| Poornima Nayar     | [@poornimanayar](https://github.com/poornimanayar)   |
| Ralf Handl         | [@ralfhandl](https://github.com/ralfhandl)           |
| Rhys Evans         | [@wheresrhys](https://github.com/wheresrhys)         |
| Sam Parsons        | [@sjparsons](https://github.com/sjparsons)           |
| Shane Krueger      | [@Shane32](https://github.com/Shane32)               |

## Changeset

- [GitHub: all Accepted RFC PRs merged before initial spec cut](https://github.com/graphql/graphql-over-http/pulls?q=is%3Apr+is%3Amerged+base%3Amain+merged%3A2018-01-29..2026-09-28+label%3A%22%F0%9F%8F%81+Accepted+%28RFC+3%29%22)
- [GitHub: all Editorial PRs merged before initial spec cut](https://github.com/graphql/graphql-over-http/pulls?page=1&q=is%3Apr+is%3Amerged+base%3Amain+merged%3A2018-01-29..2026-09-28+label%3A%22%E2%9C%8F%EF%B8%8F+Editorial%22)
- [GitHub: all changes before initial spec cut](https://github.com/graphql/graphql-over-http/compare/b6a5d05a7d6a363755b51df789d6b3138d6f2713...e28746596c38a414015e0f61d7d3e92b8ce54912)

Listed in reverse-chronological order (latest commit on top).

| Hash                                                                                                    | Change                                                                                         | Authors                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [d027fa2](https://github.com/graphql/graphql-over-http/commit/d027fa2f85899b4cf10d24bce1232b1cbcdaadab) | Configure wgutils in preparation for spec release (#434)                                       | Benjie <benjie@jemjie.com>                                                                                                                                    |
| [33765ac](https://github.com/graphql/graphql-over-http/commit/33765ac6bfd93a255168c84c6504bd5818a61f2c) | Editorial pass by codex (#439)                                                                 | Benjie <benjie@jemjie.com>                                                                                                                                    |
| [8426fc2](https://github.com/graphql/graphql-over-http/commit/8426fc2e57dc1bd30d4548addd32b809a6425f72) | Add some more notes on status code 294 (#437)                                                  | Benjie <benjie@jemjie.com> Lee Byron <lee@leebyron.com>                                                                                                       |
| [d746195](https://github.com/graphql/graphql-over-http/commit/d746195047ac4ae5c4bb11042b4941e6631726e8) | Introduce GraphQL-over-HTTP response (#423)                                                    | Martin Bonnin <martin@mbonnin.net> Benjie Gillam <benjie@jemjie.com>                                                                                          |
| [46eabbf](https://github.com/graphql/graphql-over-http/commit/46eabbf951ce9a1321bd203078fe2a2f65e829aa) | Non-normative note: actually read RFC9110 (#428)                                               | Benjie <benjie@jemjie.com>                                                                                                                                    |
| [e1e46e7](https://github.com/graphql/graphql-over-http/commit/e1e46e7b07a3347e8337a080c4fbdaec1aa4753d) | Fix "extensions" link (#420)                                                                   | Martin Bonnin <martin@mbonnin.net> Benjie <benjie@jemjie.com>                                                                                                 |
| [13bf950](https://github.com/graphql/graphql-over-http/commit/13bf950fff20ab1ce7cc281a417fce00b9949a6c) | RECOMMENDED to SHOULD (#416)                                                                   | Benjie <benjie@jemjie.com>                                                                                                                                    |
| [56d5fff](https://github.com/graphql/graphql-over-http/commit/56d5fffa1d32812535a4513d2b9cf964424f0f06) | Consistency of reference to IETF RFCs (#417)                                                   | Benjie <benjie@jemjie.com>                                                                                                                                    |
| [91c643d](https://github.com/graphql/graphql-over-http/commit/91c643d681ef4db79927d6fce2ffe1f4ec5d5066) | Make 405 RECOMMENDED for mutations over GET (#410)                                             | Martin Bonnin <martin@mbonnin.net> Benoit 'BoD' Lubek <BoD@JRAF.org> Benjie <benjie@jemjie.com>                                                               |
| [1442678](https://github.com/graphql/graphql-over-http/commit/14426780040285dae4280afd27973636056c0533) | Remove `application/json` response section; additional editorial (#404)                        | Benjie <benjie@jemjie.com> Martin Bonnin <martin@mbonnin.net> Benoit 'BoD' Lubek <BoD@JRAF.org>                                                               |
| [c550716](https://github.com/graphql/graphql-over-http/commit/c550716ee96268b23459edbdbc59ea47fe7064e2) | Remove ambiguity about `operationName=null` in GET requests (#385)                             | Martin Bonnin <martin@mbonnin.net> Benjie <benjie@jemjie.com>                                                                                                 |
| [c2e53d5](https://github.com/graphql/graphql-over-http/commit/c2e53d520f29179856c2cef6d128d2a6fa1818a5) | Clarify intent (#389)                                                                          | Benjie <benjie@jemjie.com>                                                                                                                                    |
| [62f2ac1](https://github.com/graphql/graphql-over-http/commit/62f2ac171a3818fdaabbcbdef8b0812a9d9bfae1) | Move the "not mutation in GET request" above the examples (#378)                               | Martin Bonnin <martin@mbonnin.net>                                                                                                                            |
| [29f6744](https://github.com/graphql/graphql-over-http/commit/29f6744b4780bb091c9be0ea50f4869515ea6aa7) | Detail HTTP status codes to use for various error conditions (#354)                            | Benjie <benjie@jemjie.com>                                                                                                                                    |
| [9688a67](https://github.com/graphql/graphql-over-http/commit/9688a67efab715672056189572e6178f75968175) | Use 294 as the partial status code (#346)                                                      | Benjie <benjie@jemjie.com>                                                                                                                                    |
| [127bbfd](https://github.com/graphql/graphql-over-http/commit/127bbfde24c7731db224a801a50bfddd81c1d53f) | Link to extensions in the main spec (and fix spelling) (#347)                                  | Benjie <benjie@jemjie.com>                                                                                                                                    |
| [3bfe0ae](https://github.com/graphql/graphql-over-http/commit/3bfe0ae664fca8418e1fb088332c4e8a55a6f2e1) | State that additional properties are ignored (#284)                                            | Shane Krueger <shane@acdmail.com> Benjie <benjie@jemjie.com>                                                                                                  |
| [bffb620](https://github.com/graphql/graphql-over-http/commit/bffb620525a265c41319f9375c21476e8e802e79) | Fix consistency of examples (#332)                                                             | Anthony Miller <anthonymdev@gmail.com> Benjie <benjie@jemjie.com>                                                                                             |
| [cacd928](https://github.com/graphql/graphql-over-http/commit/cacd928aaf5681535aa082378251d06838d3bc32) | Make "processing a response" non-normative and add a note for clients (#304)                   | Martin Bonnin <martin@mbonnin.net> Shane Krueger <shane@acdmail.com> Benjie Gillam <benjie@jemjie.com>                                                        |
| [c38eb33](https://github.com/graphql/graphql-over-http/commit/c38eb3382a1d225ee9d384b996cd64c11382c111) | Revise non-normative notes section (#345)                                                      | Benjie <benjie@jemjie.com>                                                                                                                                    |
| [af72124](https://github.com/graphql/graphql-over-http/commit/af7212459f109ae92f01e3d79ebe68252db89bf9) | Add security and compatibility notes (#303)                                                    | Shane Krueger <shane@acdmail.com> Jayden Seric <me@jaydenseric.com> Martin Bonnin <martin@mbonnin.net>                                                        |
| [f4d3ae4](https://github.com/graphql/graphql-over-http/commit/f4d3ae4352073c8e4a9079bf23ff2bbc5f87b44b) | Remove watershed and prefer new format (#330)                                                  | Benjie <benjie@jemjie.com> Shane Krueger <shane@acdmail.com>                                                                                                  |
| [9596493](https://github.com/graphql/graphql-over-http/commit/95964930724a222dfdfff7d06aee8ec1a1a3e94f) | grammar: fix comma splices and similar minor issues (#331)                                     | David Glasser <glasser@davidglasser.net> Martin Bonnin <martin@mbonnin.net>                                                                                   |
| [aa71a49](https://github.com/graphql/graphql-over-http/commit/aa71a4911367be9ea104f25208472428a673571d) | Fix link to GraphQL response (#316)                                                            | Benjie <benjie@jemjie.com>                                                                                                                                    |
| [511b735](https://github.com/graphql/graphql-over-http/commit/511b7350e671d7a608a539df488436d37e5b897e) | Add example of variable coercion failure (#289)                                                | Rhys Evans <wheresrhys@gmail.com> Benjie <benjie@jemjie.com> Benedikt Franke <benedikt@franke.tech>                                                           |
| [1e56098](https://github.com/graphql/graphql-over-http/commit/1e5609817a94024e4ef29601fc2b1b4fbc5dee2e) | Make it clear that other keys are reserved (#278)                                              | Benjie <benjie@jemjie.com>                                                                                                                                    |
| [ed98861](https://github.com/graphql/graphql-over-http/commit/ed988610e7dd26957e7d153963a34d31814c6208) | Advance spec to Stage 2 (#275)                                                                 | Benjie <benjie@jemjie.com>                                                                                                                                    |
| [ad817d8](https://github.com/graphql/graphql-over-http/commit/ad817d82721fdc74f26b3b3ef2c78311496153c4) | Server can choose the media type on Accept fail (#227)                                         | Benjie <benjie@jemjie.com>                                                                                                                                    |
| [ba42f7f](https://github.com/graphql/graphql-over-http/commit/ba42f7fa71f09fc9ab56cbe04fd72e6aeb8030b7) | `application/json` should only mandate 200 for _well-formed_ GraphQL-over-HTTP requests (#241) | Benjie <benjie@jemjie.com> Benedikt Franke <benedikt@franke.tech> Shane Krueger <shane@acdmail.com>                                                           |
| [1928447](https://github.com/graphql/graphql-over-http/commit/19284474c7d803986169ef8f1bf43ddd846ae3d4) | Raise issue on conflict (#237)                                                                 | Benjie <benjie@jemjie.com>                                                                                                                                    |
| [4b8ea34](https://github.com/graphql/graphql-over-http/commit/4b8ea34937c0c73c1acdb3baf8d78b403eba49b7) | Clarify support of UTF-8 and other encodings (#232)                                            | Shane Krueger <shane@acdmail.com> Benjie <benjie@jemjie.com>                                                                                                  |
| [dd88170](https://github.com/graphql/graphql-over-http/commit/dd8817065728ff1db78c1ac77ff22eb516e5d3b2) | Clarify GraphQL-over-HTTP-GET (#238)                                                           | Benjie <benjie@jemjie.com>                                                                                                                                    |
| [a1e6d8c](https://github.com/graphql/graphql-over-http/commit/a1e6d8ca248c9a19eb59a2eedd988c204909ee3f) | Clarify well-formed response and fix links to GraphQL response spec (#231)                     | Benedikt Franke <benedikt@franke.tech>                                                                                                                        |
| [466f5db](https://github.com/graphql/graphql-over-http/commit/466f5db37eac577fe999d9e8118317919b86385a) | Fix typo (#225)                                                                                | Ivan Maximov <sungam3r@yandex.ru>                                                                                                                             |
| [d5315a8](https://github.com/graphql/graphql-over-http/commit/d5315a875de810f3b60573abbfe2d0448e0eb90a) | Don't hardcode spec URL into the spec (#226)                                                   | Benjie <benjie@jemjie.com>                                                                                                                                    |
| [37f5d2c](https://github.com/graphql/graphql-over-http/commit/37f5d2ceb0f5d0b94e245c4a85b43ed35713306e) | Change media type to 'application/graphql-response+json' (#215)                                | Benjie <benjie@jemjie.com>                                                                                                                                    |
| [62d7315](https://github.com/graphql/graphql-over-http/commit/62d7315ffdb29ab38f8fb4cb4a2cd1115ea02423) | Add notes from July WG (#214)                                                                  | Benjie Gillam <benjie@jemjie.com>                                                                                                                             |
| [17ea91e](https://github.com/graphql/graphql-over-http/commit/17ea91e93e7bd36bdc300bad7fc2e0dcefc0b27e) | Fix another Stage 0 location (#212)                                                            | Benjie Gillam <benjie@jemjie.com>                                                                                                                             |
| [14b98ea](https://github.com/graphql/graphql-over-http/commit/14b98ea60e88f13560b0c1539191812380c887a1) | Omit trailing slash from URLs (#211)                                                           | Benedikt Franke <benedikt@franke.tech>                                                                                                                        |
| [f852682](https://github.com/graphql/graphql-over-http/commit/f852682eca96a7912e6b37ba2d24aee6af0897cf) | Add "Note" after various "SHOULD" rules in the spec (#197)                                     | Benjie Gillam <benjie@jemjie.com> Gabriel McAdams <ghmcadams@yahoo.com> Benedikt Franke <benedikt@franke.tech>                                                |
| [cabdc15](https://github.com/graphql/graphql-over-http/commit/cabdc15e94440a7368845d21b2b660e7b6d696a1) | Split 'invalid request body or parsing failure' into three examples (#200)                     | Benjie Gillam <benjie@jemjie.com> Gabriel McAdams <ghmcadams@yahoo.com>                                                                                       |
| [d002775](https://github.com/graphql/graphql-over-http/commit/d002775602d729e431f348411b2815e365bc76dd) | Add a note stating Subscriptions aren't covered (#202)                                         | Benjie Gillam <benjie@jemjie.com>                                                                                                                             |
| [549bd37](https://github.com/graphql/graphql-over-http/commit/549bd37a6f904768dcaec94945cb755add571b76) | Clarify operationName in the query string (#198)                                               | Benjie Gillam <benjie@jemjie.com>                                                                                                                             |
| [f5981f6](https://github.com/graphql/graphql-over-http/commit/f5981f6dacdbfbcf51125ad1c984f282fa32c032) | spec: fix comma splice (#199)                                                                  | David Glasser <glasser@apollographql.com>                                                                                                                     |
| [163d34a](https://github.com/graphql/graphql-over-http/commit/163d34a7e504e3454cc538c6b2ddaef1281bd06a) | Editorial recommendations from @glasser (#188)                                                 | Benjie Gillam <benjie@jemjie.com>                                                                                                                             |
| [1cdc3fc](https://github.com/graphql/graphql-over-http/commit/1cdc3fc3ded6b28de62e47e18bdec51a8c2c68ba) | Configure spec-md tooling and set up GitHub publish workflow (#189)                            | Benjie Gillam <benjie@jemjie.com>                                                                                                                             |
| [241abdc](https://github.com/graphql/graphql-over-http/commit/241abdc2fc50263574092718e16267d448e76f63) | Rework specification with a focus on backwards compatibility (#175)                            | Benjie Gillam <benjie@jemjie.com> Gabriel McAdams <ghmcadams@yahoo.com> Benedikt Franke <benedikt@franke.tech>                                                |
| [67b624a](https://github.com/graphql/graphql-over-http/commit/67b624a5e26e8c7090a6dac882e41906de98e2d0) | Format documents with 'prettier' (#174)                                                        | Benjie Gillam <benjie@jemjie.com>                                                                                                                             |
| [09471d5](https://github.com/graphql/graphql-over-http/commit/09471d5c3a011bed66f704dd18bcb8d5e55c62cc) | Change spec links to October2021 and http to https (#171)                                      | Ivan Maximov <sungam3r@yandex.ru>                                                                                                                             |
| [f9c6749](https://github.com/graphql/graphql-over-http/commit/f9c67494a1b8831f226f14dedf4ff5e83e0c5264) | Fix typo (#173)                                                                                | Poornima Nayar <poornimakrishnav@gmail.com>                                                                                                                   |
| [92b57a9](https://github.com/graphql/graphql-over-http/commit/92b57a9179834318b6f15e1d23afc49368dd5e3c) | remove subscriptions from allowed POST operations (#166)                                       | Laurin Quast <laurinquast@googlemail.com>                                                                                                                     |
| [40a50a3](https://github.com/graphql/graphql-over-http/commit/40a50a351a887799b3d1550b665b2101b26dcda4) | Fix markdown table (#162)                                                                      | Gabriel McAdams <ghmcadams@yahoo.com>                                                                                                                         |
| [5d06d61](https://github.com/graphql/graphql-over-http/commit/5d06d612128a4b7d2895e41e340ebfb41216da36) | Provide clarifications on content type and serialization (#161)                                | Gabriel McAdams <ghmcadams@users.noreply.github.com> Sam Parsons <sjparsons@gmail.com>                                                                        |
| [182930d](https://github.com/graphql/graphql-over-http/commit/182930dacb358e48089bdb1e3d0875ce251eccd6) | Establish error code 405 for attempted unsafe operation via GET (#138)                         | Ben Evans <benjamin.john.evans@gmail.com> Benjie Gillam <benjie@jemjie.com> Benedikt Franke <benedikt@franke.tech>                                            |
| [37ec290](https://github.com/graphql/graphql-over-http/commit/37ec290d956079dcd740309b9e91a34ea0d15b07) | Recommend concrete status codes for specific error cases (#125)                                | Benedikt Franke <benedikt@franke.tech> Gabriel McAdams <ghmcadams@users.noreply.github.com> Ralf Handl <ralf.handl@sap.com> Benjie Gillam <benjie@jemjie.com> |
| [0175734](https://github.com/graphql/graphql-over-http/commit/0175734151ade162c78417bfc64710a0efc66551) | Make sure the variables example is valid JSON (#160)                                           | Phillip Krüger <phillip.kruger@gmail.com> Benjie Gillam <benjie@jemjie.com>                                                                                   |
| [051541e](https://github.com/graphql/graphql-over-http/commit/051541ee0c8b3b6e71a8d60db59962eec28bf035) | Add clarifications regarding HTTP status codes (#79)                                           | Benedikt Franke <benedikt.franke@mll.com> Gabriel McAdams <ghmcadams@users.noreply.github.com> Ralf Handl <ralf.handl@sap.com>                                |
| [01f72c7](https://github.com/graphql/graphql-over-http/commit/01f72c784d2b18f2838c59810f522aeaab954118) | Update repo to reflect recent Working Group decisions (#154)                                   | mmatsa <mmatsa@users.noreply.github.com> Benjie Gillam <benjie@jemjie.com>                                                                                    |
| [a6a16c6](https://github.com/graphql/graphql-over-http/commit/a6a16c6101428063da6032f1146491cf46319cf3) | Converting spec to spec-md format.                                                             | Morris <mmatsa@us.ibm.com>                                                                                                                                    |
| [a89f159](https://github.com/graphql/graphql-over-http/commit/a89f1595a0ed8bdad0cbc66bb053e017d1c50869) | Move the spec to its new location.                                                             | Morris <mmatsa@us.ibm.com>                                                                                                                                    |
| [bcf4f89](https://github.com/graphql/graphql-over-http/commit/bcf4f89b5ffebf8169af169b590dab2b38cd7e89) | Added extensions to the graphql request (#4)                                                   | Michael Staib <michael@chillicream.com> Ivan Maximov <sungam3r@yandex.ru>                                                                                     |
| [6d8d585](https://github.com/graphql/graphql-over-http/commit/6d8d585683f27908c74f122ed2ef01152fc021f3) | Clarify URL requirements (#94)                                                                 | Benedikt Franke <benedikt@franke.tech> Gabriel McAdams <ghmcadams@users.noreply.github.com>                                                                   |
| [fe1f468](https://github.com/graphql/graphql-over-http/commit/fe1f4682e9f6170cdad69cece94297e67bb155f6) | Add slack link to README                                                                       | Sam Parsons <sjparsons@gmail.com>                                                                                                                             |
| [0443ead](https://github.com/graphql/graphql-over-http/commit/0443ead815d5a745b03b6f3c931cddbba7b666ad) | URL encoding of query strings (#50)                                                            | Benjie Gillam <benjie@jemjie.com>                                                                                                                             |
| [6abb440](https://github.com/graphql/graphql-over-http/commit/6abb440699d53942136e136fe99ffc5fe93736ca) | update links to spec (#58)                                                                     | Ivan Maximov <sungam3r@yandex.ru>                                                                                                                             |
| [d8dd25b](https://github.com/graphql/graphql-over-http/commit/d8dd25b7d979a8d36416e8adf5d5619ba7e5a70e) | Add info about how the de-facto standard came to be (#41)                                      | Benedikt Franke <benedikt@franke.tech>                                                                                                                        |
| [0e97976](https://github.com/graphql/graphql-over-http/commit/0e97976b9a208c356b01d8f68a96d5d94cc4d46e) | Begin ROADMAP doc                                                                              | Sam Parsons <sam.parsons@getbraintree.com>                                                                                                                    |
| [82a491b](https://github.com/graphql/graphql-over-http/commit/82a491b20559f45a0c37cc46d066783ca56e069b) | Minor edits                                                                                    | Benjie Gillam <benjie@jemjie.com>                                                                                                                             |
| [ac035d7](https://github.com/graphql/graphql-over-http/commit/ac035d773b975051ad157517ee9551b0020856f0) | Add MVP of "GraphQL over HTTP" spec                                                            | Ivan Goncharov <ivan.goncharov.ua@gmail.com>                                                                                                                  |

Generated with:

```sh
# For the `spec/` folder
git log b6a5d05a7d6a363755b51df789d6b3138d6f2713..e28746596c38a414015e0f61d7d3e92b8ce54912 --format="[%h](https://github.com/graphql/graphql-spec/commit/%H) | %s | %an <%ae> %(trailers:key=Co-authored-by,valueonly,separator=%x20)" -- spec
# For the original location: the README
git log b6a5d05a7d6a363755b51df789d6b3138d6f2713..bcf4f89b5ffebf8169af169b590dab2b38cd7e89 --format="[%h](https://github.com/graphql/graphql-spec/commit/%H) | %s | %an <%ae> %(trailers:key=Co-authored-by,valueonly,separator=%x20)" -- README.md
```

## Notes

This changeset was generated with the help of

```sh
yarn wgutils spec version --no-previous --current e28746596c38a414015e0f61d7d3e92b8ce54912 September2026
```
