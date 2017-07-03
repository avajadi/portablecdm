
export default class Filter {
  constructor() {
    /**
     * DateTime, the portcall is expected to take place
     * after this time
     */
    this.after = null;
    /**
     * DateTime, the portcall is expected to take place
     * before this time
     */
    this.before = null;
    /**
     * DateTime, the portcall has been updated after
     * this time
     */
    this.updatedAfter = null;
    /**
     * DateTime, the portcall has been updated before
     * this time
     */
    this.updatedBefore = null;
  }
}


export const statusLevels = {
  OK: 'OK',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL'
};

export const sortBy = {
  arrivalDate: 'ARRIVAL_DATE',
  lasstUpdate: 'LAST_UPDATE'
};

export const orderBy = {
  ascending: 'ASCENDING',
  descending: 'DESCENDING'
};