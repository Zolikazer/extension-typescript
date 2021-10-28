import {ChromeStorage} from "../chrome/ChromeStorage";
import * as openpgp from "openpgp";
import {CleartextMessage, Key, PublicKey} from "openpgp";
import {ChromeAPI} from "../chrome/ChromeAPI";
import {PREMIUM_ACTIVATED} from "../common/messages";
import {Observable} from "./Observable";
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

export class PremiumManager extends Observable {
    public static ACTIVATED = "activated"

    private readonly chromeStorage: ChromeStorage;

    private readonly chromeApi: ChromeAPI;
    private publicKey: PublicKey;
    private licenseKey: string;
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
            const cleartextMessage = await PremiumManager.getLicenseExpirationDate(this.license);
            await PremiumManager.verifyLicense(cleartextMessage, this.publicKey);
            this._licenseExpirationDay = JSON.parse(cleartextMessage.getText())["expirationDate"];

            this._isPremiumActive = this.verifiedPstTime < new Date(this._licenseExpirationDay).getTime()
                + 3 * DatetimeUtils.getDayInMilliseconds();
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

    private static async getLicenseExpirationDate(cleartextMessage: string) {
        return await openpgp.readCleartextMessage({
            cleartextMessage // parse armored message
        });
    }

    get isPremiumActive(): boolean {
        return this._isPremiumActive;
    }


    private async readPremiumDataFromStorage() {
        const result = await this.chromeStorage.get("premium");
        this.licenseKey = result.premium.licenseKey;
        this.license = result.premium.license;
        this.verifiedPstTime = result.premium.verifiedPstTime;
    }

    async activatePremium(licenseKey: string, license: string) {
        await this.chromeStorage.set({
            premium: {
                licenseKey: licenseKey,
                license: license,
                verifiedPstTime: this.verifiedPstTime
            }
        });
        this.chromeApi.sendMessage({msg: PREMIUM_ACTIVATED});
    }

    private listenToMessage() {
        this.chromeApi.onMessage(async (request) => {
            console.log("PREMIUM ACTIVATED")
            if (request.msg === PREMIUM_ACTIVATED) {
                await this.init();
                this.notify(PremiumManager.ACTIVATED);
            }
        })
    }

    get licenseExpirationDay(): string {
        return this._licenseExpirationDay;
    }

    async updatePstTime(verifiedPstTime: number) {
        await this.readPremiumDataFromStorage();
        await this.chromeStorage.set({
            premium: {
                licenseKey: this.licenseKey,
                license: this.license,
                verifiedPstTime: verifiedPstTime
            }
        })
    }
}
