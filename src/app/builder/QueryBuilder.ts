import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  /**
   * Search functionality
   */
  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm as string; // Access the search term from the query
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: 'i' }, // Case-insensitive regex search
        }) as FilterQuery<T>),
      });
    }
    return this;
  }

  /**
   * Filter functionality
   */
  filter() {
    const queryObj = { ...this.query };

    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]); // Remove excluded fields from query object
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  /**
   * Sort functionality
   */
  sort() {
    const sort = (this.query.sort as string) || '-createdAt'; // Default to sorting by creation date in descending order
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  /**
   * Pagination functionality
   */
  paginate() {
    const page = Number(this.query.page) || 1; // Default page is 1
    const limit = Number(this.query.limit) || 10; // Default limit is 10
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  /**
   * Field selection functionality
   */

  fields() {
    const fields = this.query.fields as string;
    if (fields) {
      this.modelQuery = this.modelQuery.select(fields?.split(',')?.join(' ')); // Select specified fields
    } else {
      this.modelQuery = this.modelQuery.select('-__v'); // Exclude version field by default
    }
    return this;
  }
}

export default QueryBuilder;
