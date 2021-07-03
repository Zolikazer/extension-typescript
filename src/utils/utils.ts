export const isTest = (): boolean => {
    return document.location.href.includes("file:///");
}