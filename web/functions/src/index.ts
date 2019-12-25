import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const helloWorld = functions.https.onRequest((request: any, response: { send: (arg0: string) => void; }) => {
    response.send("Hello from Firebase!");
});
