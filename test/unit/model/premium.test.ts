import {deepEqual, instance, mock, verify, when} from "ts-mockito";
import {ChromeStorage} from "../../../src/chrome/ChromeStorage";
import {PremiumManager} from "../../../src/model/Premium";
import {DatetimeUtils} from "../../../src/datetime/datetimeUtils";
import {ChromeAPI} from "../../../src/chrome/ChromeAPI";
import {PREMIUM_ACTIVATED} from "../../../src/common/messages";

const LICENSE = "-----BEGIN PGP SIGNED MESSAGE-----\n" +
    "Hash: SHA512\n" +
    "\n" +
    "{\"expirationDate\":\"2029-02-01\"}\n" +
    "-----BEGIN PGP SIGNATURE-----\n" +
    "\n" +
    "wnUEARYKAAYFAmFsY4QAIQkQ/UA/DEWj5LUWIQSN590liOLVv3KlB5/9QD8M\n" +
    "RaPktYkSAP9N10cX9EhGMcLaolQw84RpdiIUD4Qlxbh+fZyL5L2LCAD+LyX0\n" +
    "PNWEQSW5g9RdTO0twvBAJQSY+wnZMFjLHVFPnAE=\n" +
    "=o3Il\n" +
    "-----END PGP SIGNATURE-----"

const TEMPERED_LICENSE = "-----BEGIN PGP SIGNED MESSAGE-----\n" +
    "Hash: SHA512\n" +
    "\n" +
    "{\"expirationDate\":\"2029-02-01\"}\n" +
    "-----BEGIN PGP SIGNATURE-----\n" +
    "\n" +
    "wnUEARYKAAYFAmFsY4QAIQkQ/UA/DEWj5LUWIQSN590liOLVv3KlB5/9QD8M\n" +
    "RaPktYkSAP9N10cX9EhGMcQbolQw84RpdiIUD4Qlxbh+fZyL5L2LCAD+LyX0\n" +
    "PNWEQSW5g9RdTO0twvBAJQSY+wnZMFjLHVFPnAE=\n" +
    "=o3Il\n" +
    "-----END PGP SIGNATURE-----"

describe('PremiumManager', function () {
    const storageMock = mock(ChromeStorage);
    const storage = instance(storageMock);

    const chromeApiMock = mock(ChromeAPI);
    const chromeApi = instance(chromeApiMock);

    const premiumManager = new PremiumManager(storage, chromeApi);
    const datetimeUtilsMock = jest.spyOn(DatetimeUtils, "getCurrentTimeInPst");
    const licenseKey = "5s4sf5";
    const verifiedPstTime = 12;


    test('premium is active', async function () {
        const currentDate = "2021-10-19";

        when(storageMock.get("premium")).thenResolve({
            premium: {
                licenseKey: licenseKey,
                license: LICENSE,
                verifiedPstTime: verifiedPstTime
            }
        });
        datetimeUtilsMock.mockReturnValue(new Date(currentDate).getTime());
        await premiumManager.init();

        expect(premiumManager.isPremiumActive).toBe(true);

    });

    test('premium is expired', async function () {
        const currentDate = "2030-10-19";

        when(storageMock.get("premium")).thenResolve({
            premium: {
                licenseKey: licenseKey,
                license: LICENSE,
                verifiedPstTime: verifiedPstTime
            }
        });
        datetimeUtilsMock.mockReturnValue(new Date(currentDate).getTime());
        await premiumManager.init();

        expect(premiumManager.isPremiumActive).toBe(false);

    });

    test("when license is tempered, premium manager should throw error", async () => {
        const currentDate = "2030-10-19";

        when(storageMock.get("premium")).thenResolve({
            premium: {
                licenseKey: licenseKey,
                license: TEMPERED_LICENSE,
                verifiedPstTime: verifiedPstTime
            }
        });
        datetimeUtilsMock.mockReturnValue(new Date(currentDate).getTime());
        try {
            await premiumManager.init();
        } catch (error) {
            expect(error).toBeInstanceOf(Error)
            expect(premiumManager.isPremiumActive).toBe(false);
        }
    })

    test("activate premium", async () => {
        when(storageMock.get("premium")).thenResolve({
            premium: {
                licenseKey: licenseKey,
                license: LICENSE,
                verifiedPstTime: verifiedPstTime
            }
        });
        await premiumManager.init();
        await premiumManager.activatePremium(licenseKey, LICENSE);
        verify(storageMock.set(deepEqual({
            premium: {
                licenseKey: licenseKey,
                license: LICENSE,
                verifiedPstTime: verifiedPstTime
            }
        }))).once();
        verify(chromeApiMock.sendMessage(deepEqual({msg: PREMIUM_ACTIVATED}))).called();
    })

    test("update verified pst time", async () => {
        when(storageMock.get("premium")).thenResolve({
            premium: {
                licenseKey: licenseKey,
                license: LICENSE,
                verifiedPstTime: verifiedPstTime
            }
        });
        await premiumManager.updatePstTime(verifiedPstTime + 15);
        verify(storageMock.set(deepEqual({
            premium: {
                licenseKey: licenseKey,
                license: LICENSE,
                verifiedPstTime: verifiedPstTime + 15
            }
        }))).once();
    })
});
