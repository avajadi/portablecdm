export function createTokenHeaders(token, host) {
    return {
        'Authorization': `${token.tokenType} ${token.accessToken}`,
        'Content-Type': host.includes('dev') ? 'application/json' : 'application/xml', //TODO: Remove in production when bug is fixed
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
        //'Content-Type': 'application/json',
    };
}