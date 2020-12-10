import express = require('express');
import serveStatic = require('serve-static');
import http = require('http');
var app = express();

app.use(serveStatic('/1'));
app.use(serveStatic('/2', { }));
app.use(serveStatic('/3', {
    dotfiles: 'ignore',
    etag: true,
    extensions: ['html'],
    fallthrough: true,
    index: true,
    lastModified: true,
    maxAge: 0,
    redirect: true,
    setHeaders: function(res, path: string, stat: any) {
        // $ExpectType Response<never, number>
        res;
        res.setHeader('Server', 'server-static middleware');
    }
}));
app.use(serveStatic('/4', {
    extensions: false,
}));

serveStatic.mime.define({
    'application/babylon': ['babylon'],
    'application/babylonmeshdata': ['babylonmeshdata'],
    'application/fx': ['fx']
});

serveStatic('/does-not-assume-express', {
    setHeaders: function(res) {
        // ServerResponse
        res;
        // $ExpectError
        res.set("foo", "bar");
    }
});

http.createServer((req, res) => {
    serveStatic('/works-with-node-server')(req, res, () => {});
});

app.use(serveStatic('/infers-express-response-when-passed-to-express-use', {
    setHeaders: function(res) {
        // $ExpectType Response<never, number>
        res;
        res.set('foo', 'bar');
    }
}));
