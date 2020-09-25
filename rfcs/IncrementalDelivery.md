# Incremental Delivery over HTTP

This RFC proposes adding a specification of how "Incremental" GraphQL results should be delivered to clients, using HTTP chunked transfer encoding.

## Incremental Results

An Incremental result is a GraphQL result that is split up into multiple payloads, allowing clients quicker access to parts of the results. Currently this is supported by the proposed `@defer` and `@stream` directives ([RFC](https://github.com/graphql/graphql-spec/blob/master/rfcs/DeferStream.md)).

## `transfer-encoding: chunked`

The HTTP response for an incrementally delivered response should contain the `transfer-encoding: chunked` response header. Chunked transfer encoding allows the body of the response to be delivered as a series of chunks, allowing clients to read each chunk of the response as it is sent without waiting for the entire response.

## `content-type: multipart/mixed`

The HTTP response for an incrementally delivered response should contain the `content-type: multipart/mixed; boundary="-"` response header and conform to the [specification of multipart content defined by the W3 in rfc1341](https://www.w3.org/Protocols/rfc1341/7_2_Multipart.html). An example response body will look like:

```
---
Content-Type: application/json; charset=utf-8
Content-Length: 45

{"data":{"hello":"Hello Rob"},"hasNext":true}

---
Content-Type: application/json; charset=utf-8
Content-Length: 57

{"data":{"test":"Hello World"},"path":[],"hasNext":false}

-----
```
* The boundary used is `-` and is passed to the client in the http response's content-type header. 
* Each part of the multipart response must start with `---` and a `CRLF`
* Each part of the multipart response must contain a `Content-Type` header. Similar to the GraphQL specification this specification does not require a specific serialization format. For consistency and ease of notation, examples of the response are given in JSON throughout the spec.
* Each part of the multipart response must contain a `Content-Length` header. This should be the number of bytes of the payload of the response. It does not include the size of the headers, boundaries, or `CRLF`s used to separate the content.
* After all headers, an additional `CRLF` is sent.
* The payload is sent, followed by two `CRLF`s.
* After the last part of the multipart response is sent, the terminating boundary `-----` is sent, followed by a `CRLF`

## Server Implementations
* `express-graphql`: [pull request](https://github.com/graphql/express-graphql/pull/583)
* `Hot Chocolate`: [release](https://github.com/ChilliCream/hotchocolate/releases/tag/11.0.0-preview.146)

## Client Implementations
* [fetch-multipart-graphql](https://github.com/relay-tools/fetch-multipart-graphql) - Browser support using `fetch` or `XMLHttpRequest`

