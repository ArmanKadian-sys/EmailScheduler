const markSent = async (db_pool, id) => {
  console.log("Email Extractor called");

  const query = `UPDATE emails
      SET sent = TRUE
      WHERE id = ${id};`

  let result;

  try {
    result = await db_pool.query(query);
  }
  catch (error) {
    throw new Error(error);
  };

}






export default markSent;