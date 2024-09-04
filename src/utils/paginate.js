

const paginate = async (model, query, page, limit, sort = {}) => {
    const skip = (page - 1) * limit;
    const data = await model.find(query).skip(skip).limit(limit).sort(sort).exec();
    const totalRecords = await model.countDocuments(query).exec();
    const totalPages = Math.ceil(totalRecords / limit);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;
  
    return {
      data,
      totalRecords,
      totalPages,
      prevPage,
      nextPage,
      page,
    };
  };
  
  module.exports = paginate;
  