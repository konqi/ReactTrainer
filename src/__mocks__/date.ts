const originalDate = global.Date

export const freezeTime = (clockFrozenAt: number = 3141592653589): Date =>
  //@ts-ignore
  class extends originalDate {
    constructor(datetime?: number | string | Date) {
      super((typeof datetime !== undefined && datetime) || clockFrozenAt)
      return this
    }

    static now() {
      return clockFrozenAt
    }
  }

export const restoreCausality = () => originalDate
