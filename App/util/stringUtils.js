export function removeStringReportedBy(string) {
    let splitString = string.split(/:/g);
    return splitString[splitString.length - 1]
}