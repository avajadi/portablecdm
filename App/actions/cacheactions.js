import * as types from './types';

export const clearCache = () => {
    return (dispatch, getState) => {
        dispatch({
            type: types.CACHE_CLEAR,
        });

        dispatch({
            type: types.FILTER_CLEAR,
        });
    };
}