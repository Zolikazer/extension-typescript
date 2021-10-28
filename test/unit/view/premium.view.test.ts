import {instance, mock, when} from "ts-mockito";
import {PremiumManager} from "../../../src/model/Premium";
import {PremiumElementBuilder, PremiumView} from "../../../src/view/premium/premium.view";

describe('PremiumElementBuilder', function () {
    const premiumManagerMock = mock(PremiumManager);
    const premiumManager = instance(premiumManagerMock);
    const premiumView = new PremiumElementBuilder(premiumManager);

    it('should give back the proper text is premium is available', function () {
        when(premiumManagerMock.isPremiumActive).thenReturn(true)
        expect(premiumView.getPremiumAvailabilityText()).toBe("Your premium is <spand class='color-green'> valid</spand> until:");

    });

    it('should give back the proper text is premium is not available', function () {
        when(premiumManagerMock.isPremiumActive).thenReturn(false)
        expect(premiumView.getPremiumAvailabilityText()).toBe(
            "<span class='text-red font-bold'>Your do not have premium enabled</span>");

    });

    it('should return premium expiration date if premium is enabled', function () {
        when(premiumManagerMock.isPremiumActive).thenReturn(true);
        when(premiumManagerMock.licenseExpirationDay).thenReturn("2026.03.26")
        expect(premiumView.getPremiumExpirationDate()).toBe("2026.03.26")
    });

    it('should return text to activate premium', function () {
        when(premiumManagerMock.isPremiumActive).thenReturn(false);
        expect(premiumView.getPremiumExpirationDate()).toBe("Please activate your premium below");
    });
});

// describe('Premium View', function () {
//     const premiumElementBuilderMock = mock(PremiumElementBuilder);
//     const premiumElementBuilder = instance(premiumElementBuilderMock);
//     const premiumView = new PremiumView(premiumElementBuilder)
//
// });
