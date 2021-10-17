import * as openpgp from "openpgp";

const passphrase = "arrowexisthebest"
const publicKeyArmored = "-----BEGIN PGP PUBLIC KEY BLOCK-----\n" +
    "    \n" +
    "xjMEYSJP2RYJKwYBBAHaRw8BAQdAZQWBqn7nRbpiuJV7+whLER2xE6YRaCtE\n" +
    "xLQpw61JoK7NJEFycm93ZXhUaW1lciA8b2tvc2thY3Nha2FAZ21haWwuY29t\n" +
    "PsKMBBAWCgAdBQJhIk/ZBAsJBwgDFQgKBBYAAgECGQECGwMCHgEAIQkQ/UA/\n" +
    "DEWj5LUWIQSN590liOLVv3KlB5/9QD8MRaPktZ70AQC73w4C0X/edKEuChUa\n" +
    "4N8qG2pWJRTPMaR8xXSx9IYm0wD/XIYjJyEsMYjg8EfeLrnsZN9qJRo7HidL\n" +
    "7TbMfhFlewPOOARhIk/ZEgorBgEEAZdVAQUBAQdAt8EO++VmOEPHwIcsbprx\n" +
    "9ka8FUx9vJa6Zwieoz6mfRgDAQgHwngEGBYIAAkFAmEiT9kCGwwAIQkQ/UA/\n" +
    "DEWj5LUWIQSN590liOLVv3KlB5/9QD8MRaPktaDoAPsGVbdh+N9Vm1p1hxuj\n" +
    "WIS6PDH5hSnfzySifufXtyiJSQEAxIsMT1PC7dy6IgvGyja7XU8ZFQfv2+od\n" +
    "kHpWsZA45wA=\n" +
    "=+Gd/\n" +
    "-----END PGP PUBLIC KEY BLOCK-----"

const privateKeyArmored = "-----BEGIN PGP PRIVATE KEY BLOCK-----\n" +
    "\n" +
    "xYYEYSJP2RYJKwYBBAHaRw8BAQdAZQWBqn7nRbpiuJV7+whLER2xE6YRaCtE\n" +
    "xLQpw61JoK7+CQMI72VQWecSPQ3g5UdPG3JiEW7z7ea++v6PkZ6GaYD7Pc4i\n" +
    "Hfc3gSkCQ7xhAOqvvHilmoiR0wwcblSBdHQc3Fcq2BD68BHL2QzvKmL/eqqg\n" +
    "mM0kQXJyb3dleFRpbWVyIDxva29za2Fjc2FrYUBnbWFpbC5jb20+wowEEBYK\n" +
    "AB0FAmEiT9kECwkHCAMVCAoEFgACAQIZAQIbAwIeAQAhCRD9QD8MRaPktRYh\n" +
    "BI3n3SWI4tW/cqUHn/1APwxFo+S1nvQBALvfDgLRf950oS4KFRrg3yobalYl\n" +
    "FM8xpHzFdLH0hibTAP9chiMnISwxiODwR94uuexk32olGjseJ0vtNsx+EWV7\n" +
    "A8eLBGEiT9kSCisGAQQBl1UBBQEBB0C3wQ775WY4Q8fAhyxumvH2RrwVTH28\n" +
    "lrpnCJ6jPqZ9GAMBCAf+CQMIDhmMrRfSHoHgOLzbG2OhPp7Mevauv9E0unmQ\n" +
    "ucieXEAGYFBKt4fOy11bHD92ZY2bI/CnzJaUfu5/oJ79WL60mQsGQlpsfN0m\n" +
    "u8brLO8MEsJ4BBgWCAAJBQJhIk/ZAhsMACEJEP1APwxFo+S1FiEEjefdJYji\n" +
    "1b9ypQef/UA/DEWj5LWg6AD7BlW3YfjfVZtadYcbo1iEujwx+YUp388kon7n\n" +
    "17coiUkBAMSLDE9Twu3cuiILxso2u11PGRUH79vqHZB6VrGQOOcA\n" +
    "=brGE\n" +
    "-----END PGP PRIVATE KEY BLOCK-----"

const publicKey = await openpgp.readKey({armoredKey: publicKeyArmored});

const privateKey = await openpgp.decryptKey({
    privateKey: await openpgp.readPrivateKey({armoredKey: privateKeyArmored}),
    passphrase
});


// // sign message
// const msg = {"expirationDate": "2021-05-15"}
//
// const unsignedMessage = await openpgp.createCleartextMessage({text: JSON.stringify(msg)});
//
// const cleartextMessage = await openpgp.sign({
//     message: unsignedMessage, // CleartextMessage or Message object
//     signingKeys: privateKey
// });
// console.log(cleartextMessage);
//
//
// // verify msg
// const signedMessage = await openpgp.readCleartextMessage({
//     cleartextMessage // parse armored message
// });
//
// const verificationResult = await openpgp.verify({
//     message: signedMessage,
//     verificationKeys: publicKey
// });
//
// const {verified, keyID} = verificationResult.signatures[0];
// try {
//     await verified; // throws on invalid signature
//     console.log('Signed by key id ' + keyID.toHex());
// } catch (e) {
//     throw new Error('Signature could not be verified: ' + e.message);
// }

const cleartextMessage = "-----BEGIN PGP SIGNED MESSAGE-----\n" +
    "Hash: SHA512\n" +
    "\n" +
    "{\"expirationDate\":\"2021-05-15\"}\n" +
    "-----BEGIN PGP SIGNATURE-----\n" +
    "\n" +
    "wnUEARYKAAYFAmEp9aEAIQkQ/UA/DEWj5LUWIQSN590liOLVv3KlB5/9QD8M\n" +
    "RaPktbYXAQDRAVJrtB8UGtHjzmDmOR/s01QrqlelJj3Q7oyv2t41igD/RzGc\n" +
    "fy0kH5ZBayS30WubfPaPr0/KI0yqql2gsQ47zQo=\n" +
    "=evm/\n" +
    "-----END PGP SIGNATURE-----"

const signedMessage = await openpgp.readCleartextMessage({
    cleartextMessage // parse armored message
});

const verificationResult = await openpgp.verify({
    message: signedMessage,
    verificationKeys: publicKey
});

const { verified, keyID } = verificationResult.signatures[0];
try {
    await verified; // throws on invalid signature
    console.log('Signed by key id ' + keyID.toHex());
} catch (e) {
    throw new Error('Signature could not be verified: ' + e.message);
}
