# `@ocelot/server`

> Common helpers for running, building, and maintaining Node.js-based apps for
> IBM Watson and Cloud Platform.

## Middleware

Middleware in `@ocelot/server` acts as a function that takes in the current
server context, modifies it as needed, and then returns it back for the next
middleware to use. For example:

```js
// middleware.js
module.exports = (server) => {
  // Modify the server as needed
  return server;
};
```

Middleware can return promises as well, if needed, as long as they ultimately
return a valid server instance.

`@ocelot/server` exposes a variety of common middleware for you to use in your
application, and are commonly used with the `applyMiddleware` tool.

### `all`

`all` is a generic middleware that adds the following to your server instance:

- disables the `x-powered-by` header
- adds the `morgan` request logger utility
- adds `compression`
- adds `body-parser`, specifically for understanding `json` responses

### `development`

`development` is a middleware that is only turned on when developing locally.
It uses `webpack-dev-middleware` and `webpack-hot-middleware` together to
allow us to run our server and deliver hot updates to the UI that we're
developing.

### `error`

`error` provides both the middleware for error handling, as well as a utility
for creating an error response, aptly named `createErrorResponse`.

`error` uses the express callback pattern `(error, req, res, next) => {}` to
signify that it looks for errors in your request chain. As a result, whenever
you receive an error in a middleware that you're using, you can just call
`next(error)` to pass this error along to this middleware, which will return a
JSON response to the client.

### `html`

`html` is a dynamic middleware that generates an HTML response on-the-fly.
This is advantageous to statically generating the HTML because it allows us
to do the following:

- Dynamically update the title per request, if needed
- Dynamically add Open Graph data for the page
- Inline Webpack's `runtime` in the `<head>` element to reduce network requests
- Inline analytics snippets, if needed
- Specify scripts and stylesheets to preload/prefetch, as needed
- Stream the HTML response

`html` is a middleware that takes in a variety of options, so when used you
should make sure to call it first with the options you need, for example:

```js
const middleware = [
  require('@cnc/server/lib/middleware/html')({
    getTitle: (req) => 'Some Title',
  }),
];
```

### `request-id`

`request-id` provides both a middleware and a utility function, `requestId`,
that you can use to add the `_id` property to the `req` option in an express
response handler. This will allow you to pass along a header like
`X-Request-ID` to uniquely identify each request in your system with an id
generated through `uuid`.

### `security`

### `static`

## Tools

### `applyMiddleware`

### `errorf`

### `formatErrorResponse`

### `getBuildContext`

### `listen`

### `logger`

### `register`

### `setupHTTPSServer`
