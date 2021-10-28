import {PremiumManager} from "../../model/Premium";
import {ChromeStorage} from "../../chrome/ChromeStorage";
import {getLicense} from "../../adapters/adapters";
import {ChromeAPI} from "../../chrome/ChromeAPI";

export class PremiumElementBuilder {
    private readonly premiumManager: PremiumManager;

    constructor(premiumManager: PremiumManager) {
        this.premiumManager = premiumManager;
    }

    getPremiumAvailabilityText(): string {
        if (this.premiumManager.isPremiumActive) {
            return "Your premium is <spand class='color-green'> valid</spand> until:";
        }
        return "<span class='text-red font-bold'>Your do not have premium enabled</span>";
    }


    getPremiumExpirationDate(): string {
        if (this.premiumManager.isPremiumActive) {
            return this.premiumManager.licenseExpirationDay;
        }
        return "Please activate your premium below";
    }

}

export class PremiumView {
    private readonly premiumElementBuilder: PremiumElementBuilder;
    private readonly premiumManager: PremiumManager;
    private readonly isPremiumAvailableDom;
    private readonly premiumExpirationDateDom;
    private readonly inputDiv;
    private readonly activatePremiumButton;
    private readonly licenseKeyInput;
    private readonly errorElement;

    constructor(premiumElementBuilder: PremiumElementBuilder, premiumManager: PremiumManager) {
        this.premiumManager = premiumManager;
        this.premiumElementBuilder = premiumElementBuilder;
        this.isPremiumAvailableDom = document.getElementById("premium-availability");
        this.premiumExpirationDateDom = document.getElementById("premium-expiration-date");
        this.inputDiv = document.getElementById("input-div");
        this.activatePremiumButton = document.getElementById("activate-premium-btn");
        this.licenseKeyInput = document.getElementById("license-key-input");
        this.errorElement = document.getElementById("error");

    }

    render() {
        this.renderIsPremiumAvailableDom();
        this.renderPremiumExpirationDate();
        if (this.premiumManager.isPremiumActive) {
            this.hideInputField();
        }
        this.errorElement.innerText = "";
        this.activatePremiumOnClick();
    }


    private renderIsPremiumAvailableDom() {
        this.isPremiumAvailableDom.innerHTML = this.premiumElementBuilder.getPremiumAvailabilityText();
    }

    private renderPremiumExpirationDate() {
        this.premiumExpirationDateDom.innerHTML = this.premiumElementBuilder.getPremiumExpirationDate();
    }

    private hideInputField() {
        this.inputDiv.remove();
    }

    private activatePremiumOnClick() {
        this.activatePremiumButton.addEventListener("click", async () => {
            // @ts-ignore
            const licenseKey = this.licenseKeyInput.value;
            try {
                const license = await getLicense(licenseKey);
                await this.premiumManager.activatePremium(licenseKey, license);
                await this.premiumManager.init();
                this.render();

            } catch (error) {
                this.errorElement.innerText = error.message;
            }
        })
    }
}

async function main() {
    const chromeStorage = new ChromeStorage();
    const chromeApi = new ChromeAPI();
    const premiumManager = new PremiumManager(chromeStorage, chromeApi);
    const premiumElementBuilder = new PremiumElementBuilder(premiumManager);
    const premiumView = new PremiumView(premiumElementBuilder, premiumManager);
    await premiumManager.init();

    premiumView.render();
}

main();
