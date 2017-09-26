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
        'Content-Type': connection.host.includes('dev') ? 'application/json' : 'application/xml',
    }
}

export function getCert(connection) {
    return {
        cert: 
        connection.host.includes('dev.portcdm.eu') ||
        connection.host.includes('sandbox') ?
        'staging' :
        'prod',
        'Content-Type': 'application/xml', //TODO: Remove in production when bug is fixed
        //'Content-Type': 'application/json',
    };
}