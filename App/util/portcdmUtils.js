import { contentTypeBug } from '../config/instances';

export function createTokenHeaders(token, host) {
    return {
        'Authorization': `${token.tokenType} ${token.accessToken}`,
        'Content-Type': contentTypeBug.some((x) => connection.host.includes(x)) ? 'application/json' : 'application/xml',
    }
}

export function createLegacyHeaders(connection) {
    return {
        'X-PortCDM-UserId': connection.username,
        'X-PortCDM-Password': connection.password,
        'X-PortCDM-APIKey': 'PortableCDM',
        'Content-Type': contentTypeBug.some((x) => connection.host.includes(x)) ? 'application/json' : 'application/xml',
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