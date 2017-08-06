export function removeStringReportedBy(string) {
    return string.replace('urn:mrn:legacy:user:', '')
}

export function removeStringAtLocation(string) {
    return string.replace('urn:mrn:stm:location:segot:BERTH', '')
}