

export function createLegacyHeaders(connection) {
    return {
        'X-PortCDM-UserId': 'viktoria',
        'X-PortCDM-Password': 'vik123',
        'X-PortCDM-APIKey': 'PortableCDM'
    }
}

export function createTokenHeaders(token) {
    return {
        'Authorization': `${token.tokenType} ${token.accessToken}`,
    }
}