export interface Pagination<T> {
  docs: T[];

  pagination: {
    offset: number;
    limit: number;
    count: number;
  };
}
