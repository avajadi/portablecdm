export function createTokenHeaders(token) {
    return {
        'Authorization': `${token.tokenType} ${token.accessToken}`,
    }
}