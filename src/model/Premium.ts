import {ChromeStorage} from "../chrome/ChromeStorage";
import * as openpgp from "openpgp";
import {CleartextMessage, Key} from "openpgp";
import {DatetimeUtils} from "../datetime/datetimeUtils";

const PUBLIC_KEY_ARMORED = "-----BEGIN PGP PUBLIC KEY BLOCK-----\n" +
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

export class PremiumManager {
    private readonly chromeStorage: ChromeStorage;
    private _isPremiumActive: boolean

    constructor(chromeStorage: ChromeStorage) {
        this.chromeStorage = chromeStorage;
    }

    public async init(): Promise<boolean> {
        const license = await this.getLicense();
        if (license === null) {
            return false;
        }
        const publicKey = await openpgp.readKey({armoredKey: PUBLIC_KEY_ARMORED});
        const cleartextMessage = await PremiumManager.getLicenseExpirationDate(license, publicKey);
        await PremiumManager.verifyLicense(cleartextMessage, publicKey);
        const licenseExpirationDay = JSON.parse(cleartextMessage.getText())["expirationDate"];

        this._isPremiumActive = DatetimeUtils.getCurrentTimeInPst() < new Date(licenseExpirationDay).getTime();

    }

    private async getLicense(): Promise<string> {
        const premium = await this.chromeStorage.get("premium");
        return premium.license;
    }

    private static async verifyLicense(licenseExpirationDate: CleartextMessage, publicKey: Key) {

        const verificationResult = await openpgp.verify({
            // @ts-ignore
            message: licenseExpirationDate,
            verificationKeys: publicKey
        });
        const {verified, keyID} = verificationResult.signatures[0];

        try {
            await verified; // throws on invalid signature
        } catch (e) {
            throw new Error('Signature could not be verified: ' + e.message);
        }

    }

    private static async getLicenseExpirationDate(cleartextMessage: string, publicKey: Key) {
        return await openpgp.readCleartextMessage({
            cleartextMessage // parse armored message
        });
    }

    get isPremiumActive(): boolean {
        return this._isPremiumActive;
    }
}
