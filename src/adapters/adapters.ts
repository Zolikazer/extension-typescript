export async function getLicense(licenseKey: string): Promise<string> {
    const response = await fetch(`http://167.172.173.8/license/${licenseKey}`, {
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
