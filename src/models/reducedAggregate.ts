interface IReducedAggregateResult {
    value: number
    time: string
}

export interface IReducedAggregate {
    results: Array<IReducedAggregateResult>
    symbol: string
}
