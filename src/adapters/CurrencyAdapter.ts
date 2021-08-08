export class CurrencyAdapter {
    async getConversionRateFromUsdTo(currency: string): Promise<number> {
        const apiKey = "15ef0455f8e0cbc3eac5";
        const query = `USD_${currency}`;
        const requestTemplate = `https://free.currconv.com/api/v7/convert?q=${query}&compact=ultra&apiKey=${apiKey}`
        try {
            const response = await fetch(requestTemplate);
            const json = await response.json();
            return json[query];


        } catch (e) {
            console.log("could not fetch conversion rate", e);
        }


    }

    // sendWorksheetData(data) {
    //     const jsonData = JSON.stringify(data)
    //     fetch("http://157.245.23.40:8000/extension", {
    //             method: "post",
    //             headers: {"Content-Type": "application/json"},
    //             body: jsonData
    //         },
    //     ).then(resp => {
    //         if (resp.status === 200) {
    //             console.log("data saved")
    //         }
    //     }).catch(err => {
    //         console.log(err)
    //     })
    //
    // }
}
