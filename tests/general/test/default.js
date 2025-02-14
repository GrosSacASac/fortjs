let {
    request,
    expect,
    browserAccept,
    url,
    httpClient,
    forbiddenText,
    methodNotAllowedMsg,
    badRequestMsg,
    removeSpaceAndNewLine
} = require('./common');

const cookie = require('cookie');

describe("/default", () => {

    it('default path', (done) => {
        request.get('/').end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.have.header('content-type', 'text/plain');
            expect(res.header['x-powered-by']).to.equal('fort');
            expect(removeSpaceAndNewLine(res.text)).to.be.equal('<html><head><title>Welcometofort</title></head><body><h1>Index</h1></body></html>');
            done();
        })
    })

    it('/json + browser accept setting', (done) => {
        require('axios').default.get(`${url}/default/json`, {
            headers: {
                'Accept': browserAccept
            }
        }).then(res => {
            expect(res).to.have.status(200);
            expect(res).to.have.header('content-type', 'application/xml');
            expect(res.data).to.be.equal('<?xml version="1.0" encoding="utf-8"?><root><key>hello</key><value>world</value></root>');
            done();
        }).catch(done)
    })

    it('/json', (done) => {
        request.get('/default/json').type("application/json").end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.have.header('content-type', 'application/json');
            expect(res.text).to.be.equal('{"key":"hello","value":"world"}');
            done();
        })
    })

    it('/html', (done) => {
        request.get('/default/html').accept(browserAccept).end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.have.header('content-type', 'text/html');
            expect(res.text).to.be.equal('<h1>hey there i am html</h1>');
            done();
        })
    })

    it('/text', (done) => {
        request.get('/default/text').end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.have.header('content-type', 'text/plain');
            expect(res.text).to.be.equal('text');
            done();
        })
    })

    it('/text + http: post', (done) => {
        request.post('/default/text').end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(405);
            expect(res).to.have.header('content-type', 'text/html');
            expect(res).to.have.header('allow', 'GET');
            expect(res.text).to.be.equal(methodNotAllowedMsg);
            done();
        })
    })

    it('/post with no body', (done) => {
        request.post('/default/post').type("application/json").end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res).to.have.header('content-type', 'text/html');
            expect(res.text).to.contains("message : Post data is invalid");
            done();
        })
    })

    it('/post with empty body', (done) => {
        request.post('/default/post').send({}).type("application/json").end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.have.header('content-type', 'application/json');
            expect(res.text).to.be.equal('{}');
            done();
        })
    })

    it('/post ', (done) => {
        const data = {
            key: "hello"
        };
        request.post('/default/post').send(data).end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.have.header('content-type', 'application/json');
            expect(res.text).to.be.equal('{"key":"hello"}');
            done();
        })
    });

    it('/post with xml', (done) => {
        const data = `<?xml version="1.0" encoding="UTF-8" ?>
        <key>hello</key>`
        request.post('/default/post').type('application/xml').send(data).end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.text).to.contains('message : no xml parser configured');
            done();
        })
    });

    it('/post + http: get', (done) => {
        request.get('/default/post').end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(405);
            expect(res).to.have.header('content-type', 'text/html');
            expect(res).to.have.header('allow', 'POST');
            expect(res.text).to.be.equal(methodNotAllowedMsg);
            done();
        })
    })

    it("/redirect test", (done) => {
        request.get('/default/redirect').redirects(0).end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(302);
            expect(res).to.have.header('location', 'html');
            done();
        })
    })

    it("/user without login", (done) => {
        request.get('/user/').redirects(0).end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(302);
            expect(res).to.have.header('location', '/default/login');
            done();
        })
    })

    it("/default/login", (done) => {
        const user = {
            emailId: `ujjwal@mg.com`,
            password: "admin"
        }
        request.post('/default/login').send(user).end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.text).to.be.equal("Authenticated");
            //console.log('headers', res.header);
            const parsedCookie = cookie.parse(res.header[`set-cookie`][0]);
            console.log('cookie', parsedCookie);
            expect(parsedCookie).haveOwnProperty(`fort_session_id`);
            expect(parsedCookie).haveOwnProperty(`Path`).equal('/');
            expect(parsedCookie).haveOwnProperty(`Max-Age`).equal('3600');
            expect(res.header[`set-cookie`][0]).contains('HttpOnly');
            done();
        })
    })

});