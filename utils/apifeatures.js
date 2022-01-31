class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    console.log(this.queryString);
    const filterObj = { ...this.queryString };
    const exlude = ["sort", "fields", "page", "limit"];
    exlude.forEach((value) => delete filterObj[value]);
    const objString = JSON.stringify(filterObj).replace(
      /\bgt|gte|lt|lte\b/g,
      (match) => `$${match}`
    );

    const filter = JSON.parse(objString);
    console.log(filter);

    this.query = this.query.find(filter);
    return this;
  }
  sort() {
    if (!this.queryString.sort) return this;
    const sortBy = this.queryString.sort.split(",").join(" ");
    this.query = this.query.sort(sortBy);
    return this;
  }

  limitFields() {
    if (!this.query.fields) return this;
    const fields = this.queryString.fields.split(",").join(" ");
    this.query = this.query.select(fields);
    return this;
  }
  page() {
    const limit = req.body.limit * 1 || 1;
    const page = req.body.page * 1 || 1;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIfeatures;
