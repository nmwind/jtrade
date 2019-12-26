import * as functions from 'firebase-functions';

exports.proxy = functions.https.onRequest((request, response) => {
    console.log(request.rawHeaders);
    response.send({
        headers: request.rawHeaders,
        trailers: request.rawTrailers,
        body: request.rawBody,
    });
});
