"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
exports.test = functions.firestore.document('users/{userId}').onCreate((event) => {
    const msg = {
        notification: {
            title: 'Une notification depuis le back',
            body: 'Nouvel utilisateur ajouté',
            sound: 'default',
            badge: '1'
        }
    };
    return loadUsersToken().then(tokens => {
        return admin.messaging().sendToDevice(tokens, msg);
    });
});
exports.cronTest = functions.https.onRequest((req, res) => {
    const msg = {
        notification: {
            title: 'Une notification depuis le back',
            body: 'Nouvel utilisateur ajouté',
            sound: 'default',
            badge: '1'
        }
    };
    return loadUsersToken().then(tokens => {
        return admin.messaging().sendToDevice(tokens, msg);
    });
});
function loadUsersToken() {
    const userRef = admin.firestore().collection('users');
    const tokens = [];
    const usersTokens = new Promise((resolve, reject) => {
        userRef.get().then((snapshot) => {
            snapshot.forEach((document) => {
                if (document.data()['deviceToken'] !== '' && document.data()['deviceToken'] != null) {
                    tokens.push(document.data()['deviceToken']);
                }
            });
            resolve(tokens);
        })
            .catch((error) => {
            console.log('Error while getting users documents: ', error);
            reject(error);
        });
    });
    return usersTokens;
}
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
//# sourceMappingURL=index.js.map