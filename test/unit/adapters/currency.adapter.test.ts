import {CurrencyAdapter} from "../../../src/adapters/CurrencyAdapter";

describe('Currency Adapter', function () {
    it('should return the conversion rate', async function () {
        const currencies = {
            "USD_HUF": 25,
            "USD_EUR": 0.02163987
        }
        const currencyAdapter = new CurrencyAdapter();
        // @ts-ignore
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(currencies),
            })
        );

        expect(await currencyAdapter.getConversionRateFromUsdTo("HUF")).toBe(25);
    });
});
