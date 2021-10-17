import {instance, mock, when} from "ts-mockito";
import {ChromeStorage} from "../../../src/chrome/ChromeStorage";
import {PremiumManager} from "../../../src/model/Premium";
import {DatetimeUtils} from "../../../src/datetime/datetimeUtils";

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

describe('PremiumManager', function () {
    const storageMock = mock(ChromeStorage);
    const storage = instance(storageMock);
    const premiumManager = new PremiumManager(storage);
    const datetimeUtilsMock = jest.spyOn(DatetimeUtils, "getCurrentTimeInPst");

    test('premium is active', async function () {
        const currentDate = "2021-10-19";

        when(storageMock.get("premium")).thenResolve({licenseKey: "5s4sf5", license: LICENSE});
        datetimeUtilsMock.mockReturnValue(new Date(currentDate).getTime());
        await premiumManager.init();

        expect(premiumManager.isPremiumActive).toBe(true);

    });

    test('premium is expired', async function () {
        const currentDate = "2030-10-19";

        when(storageMock.get("premium")).thenResolve({licenseKey: "5s4sf5", license: LICENSE});
        datetimeUtilsMock.mockReturnValue(new Date(currentDate).getTime());
        await premiumManager.init();

        expect(premiumManager.isPremiumActive).toBe(false);

    });

});
