export function createTokenHeaders(token, contentType) {
    return {
        'Authorization': `${token.tokenType} ${token.accessToken}`,
        'Content-Type': contentType,
    }
}

export function createLegacyHeaders(connection, contentType) {
    return {
        'X-PortCDM-UserId': connection.username,
        'X-PortCDM-Password': connection.password,
        'X-PortCDM-APIKey': 'PortableCDM',
        'Content-Type': contentType,
    }
}

export function getCert(connection) {
    return {
        cert: 
        connection.host.includes('dev.portcdm.eu') ||
        (connection.host.includes('qa') && !connection.host.includes('qa.portcdm')) ||
        connection.host.includes('sandbox') ?
        'staging' :
        'prod',
    };
}