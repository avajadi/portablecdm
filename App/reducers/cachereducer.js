

const INITIAL_STATE = {
    portCalls: {
        lastUpdated: 0,
        portCalls: [],
    }
}

const cacheReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        default:
            return state;
    }
}

export default cacheReducer;