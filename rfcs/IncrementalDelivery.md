# Incremental Delivery over HTTP

This RFC proposes adding a specification of how "Incremental" GraphQL results should be delivered to clients, using HTTP chunked transfer encoding.

## Incremental Results

An Incremental result is a GraphQL result that is split up into multiple payloads, allowing clients quicker access to parts of the results. Currently this is supported by the proposed `@defer` and `@stream` directives ([RFC](https://github.com/graphql/graphql-spec/blob/master/rfcs/DeferStream.md)).

### HTTP/1.1

An incrementally delivered response should contain the `Transfer-Encoding: chunked` response header when using HTTP/1.1. Chunked transfer encoding allows the body of the response to be delivered as a series of chunks, allowing clients to read each chunk of the response as it is sent without waiting for the entire response.

### HTTP/2

Because of improved data streaming mechanisms, HTTP/2 prohibits the use of the `Transfer-Encoding` header. It is very likely that compliant servers will treat requests containing the header as malformed ([see section 8.2.2. Connection-Specific Header Fields in HTTP/2 spec](https://datatracker.ietf.org/doc/html/rfc9113#section-8.1)).

Compliant servers must follow the HTTP/2 specification and not set the `Transfer-Encoding` header.

## `Content-Type: multipart/mixed`

The HTTP response for an incrementally delivered response should conform to the [specification of multipart content defined by the W3 in rfc1341](https://www.w3.org/Protocols/rfc1341/7_2_Multipart.html). The HTTP response must contain the `Content-Type` response header with a specified boundary, for example `Content-Type: multipart/mixed; boundary="-"`. A simple boundary of `-` can be used as there is no possibility of conflict with JSON data. However, any arbitrary boundary may be used.

An example response body will look like:

```

---
Content-Type: application/json; charset=utf-8

{"data":{"hello":"Hello Rob"},"hasNext":true}
---
Content-Type: application/json; charset=utf-8

{"data":{"test":"Hello World"},"path":[],"hasNext":false}
-----
```
* The boundary used is `-` and is passed to the client in the http response's `Content-Type` header. Note that headers can appear in both the HTTP response itself and as part of the response body. The `Content-Type` header must be sent in the HTTP response.
* Before each part of the multi-part response, a boundary (`CRLF`, `---`, `CRLF`) is sent.
* Each part of the multipart response must contain a `Content-Type` header. Similar to the GraphQL specification this specification does not require a specific serialization format. For consistency and ease of notation, examples of the response are given in JSON throughout the spec.
* After all headers for each part, an additional `CRLF` is sent, followed by the payload for the part.
* After the final payload, the terminating boundary of `CRLF` followed by `-----` followed by `CRLF` is sent.

## Server Implementations
* `express-graphql`: [pull request](https://github.com/graphql/express-graphql/pull/583)
* `Hot Chocolate`: [release](https://github.com/ChilliCream/hotchocolate/releases/tag/11.0.0-preview.146)

## Client Implementations
* [fetch-multipart-graphql](https://github.com/relay-tools/fetch-multipart-graphql) - Browser support using `fetch` or `XMLHttpRequest`
* [meros](https://github.com/maraisr/meros) - A fast utility for reading streamed multipart/mixed responses on the client.
