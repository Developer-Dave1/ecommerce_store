exports.getProductReviews = async (client, productID) => {
  try {
    const databaseQuery = await client.query(
      'SELECT * FROM reviews WHERE product_id = $1 ORDER BY created_at DESC;',[productID]);

    if (databaseQuery.rowCount === 0) {
      console.warn(`There are no reviews for product ID ${productID}.`);
    }
    return databaseQuery.rows;
    
  } catch (error) {
    console.error(`There was an error getting product reviews from the DB.`);
    console.error(`${error.name} - ${error.message}`);
  }
};

exports.postReview = async (client, productID, userID, rating, comment, username) => {
    try {
      const databaseQuery = await client.query('INSERT INTO reviews (product_id, user_id, rating, comment, username) VALUES ($1, $2, $3, $4, $5)'
        , [productID, userID, rating, comment, username]);
      
      return true;

    } catch (error) {
        console.error(`There was an error adding the review to the database.`);
        console.error(`${error.name} - ${error.message}`);
        throw error;
    }
}