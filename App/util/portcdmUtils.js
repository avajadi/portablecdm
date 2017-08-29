export function createTokenHeaders(token) {
    return {
        'Authorization': `${token.tokenType} ${token.accessToken}`,
    }
}

export function createLegacyHeaders(connection) {
    return {
        'X-PortCDM-UserId': connection.username,
        'X-PortCDM-Password': connection.password,
        'X-PortCDM-APIKey': 'PortableCDM'
    }
}