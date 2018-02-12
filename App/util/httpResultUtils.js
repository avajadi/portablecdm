import {Alert} from 'react-native';

function checkRole(result) {
    if(result.status === 403) {
        return {
            error: 'Error',
            description: 'User does not have required role'
        };
    }

    return null;
}

function checkServerLive(result) {
    if(result.status === 500){
        return {
            title: 'Error',
            description: 'Something went wrong with the server. (500)'
        }
    }

    return null;
}

function checkBadRequest(result) {
    if(result.status === 400) {
        return {
          title:  'Something went wrong',
           description: 'Bad request to the server.'
        };
    }

    return null;
}

function checkAuthorized(result) {
    if(result.status === 401) {
        return {
           title: 'Unauthorized',
           description: 'Access denied. Invalid username or password.'
        };
    }

    return null;
}

function checkNotFound(result) {
  if(result.status === 404) {
    return {
      title: 'Not found',
      description: 'Have you checked host settings and internet connection?',
    };  
  }

  return null;
}

export function catchError(error) {
    return {
       error: 'Something went wrong',
       description: 'Unable to connect to the server!'
    };
}

export function checkResponse(result) {
    let roleError = checkRole(result);
    let serverLiveError = checkServerLive(result);
    let badResultError = checkBadRequest(result);
    let authorizedError = checkAuthorized(result);
    let notFoundError = checkNotFound(result);

    if(!!roleError) return roleError;
    if(!!serverLiveError) return serverLiveError;
    if(!!badResultError) return badResultError;
    if(!!authorizedError) return authorizedError;
    if(!!notFoundError) return notFoundError;

    return null;
}