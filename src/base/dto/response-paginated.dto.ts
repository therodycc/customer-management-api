export class ResponsePaginated<T> {
  constructor(
    public results: T[],
    public readonly totalItems: number,
    // public readonly totalItemsFiltered: number,
    public readonly totalPages: number,
    public readonly currentPage: number,
    public readonly nextPage: number,
    public readonly previousPage: number,
  ) {}
}
