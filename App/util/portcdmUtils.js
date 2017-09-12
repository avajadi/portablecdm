export function createTokenHeaders(token) {
    return {
        'Authorization': `${token.tokenType} ${token.accessToken}`,
    }
}

export function createLegacyHeaders(connection) {
    return {
        'X-PortCDM-UserId': connection.username,
        'X-PortCDM-Password': connection.password,
        'X-PortCDM-APIKey': 'PortableCDM',
    }
}

export function getCert(connection) {
    return {
        cert: 
        connection.host.includes('dev.portcdm.eu') ||
        connection.host.includes('qa.portcdm.eu') ||
        connection.host.includes('sandbox') ?
        'staging' :
        'prod',
    };
}