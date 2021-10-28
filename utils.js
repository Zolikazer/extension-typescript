function addPremiumKey() {
    const premium = "-----BEGIN PGP SIGNED MESSAGE-----\n" +
        "Hash: SHA512\n" +
        "\n" +
        "{\"expirationDate\":\"2029-02-01\"}\n" +
        "-----BEGIN PGP SIGNATURE-----\n" +
        "\n" +
        "wnUEARYKAAYFAmFzsJEAIQkQ/UA/DEWj5LUWIQSN590liOLVv3KlB5/9QD8M\n" +
        "RaPktX6dAQCohq0NfIx02d9OgPL+PV+ToZOflxfMLmMxwJjYki+MfQD/UYff\n" +
        "8TP2p/rVMHL8O9ubkeOJeQg3uhnCTD9dMDVYlgc=\n" +
        "=QDVk\n" +
        "-----END PGP SIGNATURE-----"

    const licenseKey = "6a65ff";
    chrome.storage.sync.set({premium: {licenseKey: licenseKey, license: premium}})
}

function printStorage() {
    chrome.storage.sync.get(null, (r) => {
        console.log(r)
    })
}

