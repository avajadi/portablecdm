const redirectURI = 'http://app-login.portcdm.eu/';
//const RedirectURI = 'https://dev.portcdm.eu/start'
//const ClientID = '0.1-urn:mrn:stm:service:instance:viktoria:administration-pact';
const clientID = '0.1-urn:mrn:stm:service:instance:viktoria:summer-app';

export default constants = {
    RedirectURI: redirectURI,
    //const RedirectURI = 'https://dev.portcdm.eu/start'
    //const ClientID = '0.1-urn:mrn:stm:service:instance:viktoria:administration-pact';
    ClientID: clientID,
    MaritimeAuthURI: `https://staging-maritimeid.maritimecloud.net/auth/realms/MaritimeCloud/protocol/openid-connect/auth?client_id=${encodeURIComponent(clientID)}&redirect_uri=${redirectURI}&response_mode=fragment&response_type=code&scope=openid`,
    MaritimeTokenURI: 'https://staging-maritimeid.maritimecloud.net/auth/realms/MaritimeCloud/protocol/openid-connect/token',
    MaritimeLogoutURI: `https://staging-maritimeid.maritimecloud.net/auth/realms/MaritimeCloud/protocol/openid-connect/logout?redirect_uri=${redirectURI}`,
}