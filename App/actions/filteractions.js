import * as types from './types';

export const filterChangeVesselList = (vesselList) => {
    return {
        type: types.FILTER_CHANGE_VESSEL_LIST,
        payload: vesselList
    };
};

export const filterChangeLimit = (limit) => {
    return {
        type: types.FILTER_CHANGE_LIMIT,
        payload: limit
    };
};

export const filterChangeSortBy = (sortBy) => {
    return {
        type: types.FILTER_CHANGE_SORTBY,
        payload: sortBy
    };
};

export const filterChangeOrder = (order) => {
    return {
        type: types.FILTER_CHANGE_ORDER,
        payload: order
    }
}

export const filterChangeArrivingWithin = (arrivingWithinHours) => {
    return {
        type: types.FILTER_CHANGE_ARRIVING_WITHIN,
        payload: arrivingWithinHours
    };
};

export const filterChangeDepartingWithin = (departingWithinHours) => {
    return {
        type: types.FILTER_CHANGE_DEPARTING_WITHIN,
        payload: departingWithinHours
    }
}

export const filterClearArrivingDepartureTime = () => {
    return {
        type: types.FILTER_CLEAR_TIME
    };
};

export const filterChangeOnlyFuturePortCalls = (show) => {
    return {
        type: types.FILTER_ONLY_FUTURE_PORTCALLS,
        payload: show
    };
};