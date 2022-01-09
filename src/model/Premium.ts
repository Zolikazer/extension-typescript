import {ChromeStorage} from "../chrome/ChromeStorage";
import * as openpgp from "openpgp";
import {CleartextMessage, Key, PublicKey} from "openpgp";
import {ChromeAPI} from "../chrome/ChromeAPI";
import {PREMIUM_ACTIVATED} from "../common/messages";
import {Observable} from "./Observable";

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

export class PremiumManager extends Observable {
    get licenseKey(): string {
        return this._licenseKey;
    }
    public static ACTIVATED = "activated"

    private readonly chromeStorage: ChromeStorage;

    private readonly chromeApi: ChromeAPI;
    private publicKey: PublicKey;
    private _licenseKey: string;
    private license: string
    private _isPremiumActive: boolean;
    private _licenseExpirationDay: string;
    private verifiedPstTime: number;

    constructor(chromeStorage: ChromeStorage, chromeApi: ChromeAPI) {
        super();
        this.chromeStorage = chromeStorage;
        this.chromeApi = chromeApi;
        this.listenToMessage();
        this._isPremiumActive = false;
    }

    public async init() {
        this.publicKey = await openpgp.readKey({armoredKey: PUBLIC_KEY_ARMORED});
        await this.readPremiumDataFromStorage();

        if (this.license !== null) {
            const cleartextMessage = await PremiumManager.readClearTextLicense(this.license);
            await PremiumManager.verifyLicense(cleartextMessage, this.publicKey);
            let cleartextJson = JSON.parse(cleartextMessage.getText());
            this._licenseExpirationDay = cleartextJson["expirationDate"];
            this.verifiedPstTime = cleartextJson["verifiedPstTime"]

            this._isPremiumActive = this.verifiedPstTime < new Date(this._licenseExpirationDay).getTime();
        } else {
            this._isPremiumActive = false;
        }

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

    private static async readClearTextLicense(cleartextMessage: string) {
        return await openpgp.readCleartextMessage({
            cleartextMessage // parse armored message
        });
    }

    get isPremiumActive(): boolean {
        return this._isPremiumActive;
    }


    private async readPremiumDataFromStorage() {
        const result = await this.chromeStorage.get("premium");
        this._licenseKey = result.premium.licenseKey;
        this.license = result.premium.license;
    }

    async activatePremium(licenseKey: string, license: string) {
        await this.chromeStorage.set({
            premium: {
                licenseKey: licenseKey,
                license: license
            }
        });
        this.chromeApi.sendMessage({msg: PREMIUM_ACTIVATED});
    }
    async renewLicense(license: string) {
        await this.chromeStorage.set({
            premium: {
                licenseKey: this._licenseKey,
                license: license
            }
        });
    }

    private listenToMessage() {
        this.chromeApi.onMessage(async (request) => {
            if (request.msg === PREMIUM_ACTIVATED) {
                await this.init();
                this.notify(PremiumManager.ACTIVATED);
            }
        })
    }

    get licenseExpirationDay(): string {
        return this._licenseExpirationDay;
    }
}
