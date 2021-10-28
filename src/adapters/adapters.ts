export async function getLicense(licenseKey: string): Promise<string> {
    const response = await fetch(`http://localhost:3000/license/${licenseKey}`, {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    });
    if (!response.ok) {
        const data = await response.json()
        throw Error(data.message);
    }
    return await response.text()
}

export async function getVerifiedPstTime(): Promise<number> {
    const response = await fetch("http://localhost:3000/verified_pst_time", {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    });

    if (!response.ok) {
        const data = await response.json()
        throw Error(data.message);
    }
    return parseInt(await response.text());
}
