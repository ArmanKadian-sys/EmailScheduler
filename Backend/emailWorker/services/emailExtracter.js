const emailExtracter = async (db_pool) => {
  console.log("Email Extractor called");

  const query = `SELECT *
FROM emails
ORDER BY sendAt ASC
LIMIT 50;`

  let result;

  try {
    result = await db_pool.query(query);
  }
  catch (error) {
    throw new Error(error);
  }


  const start = result.rows[0].sendat;
  const end = result.rows[result.rows.length - 1].sendat;



  result = result.rows;


  return { start, end, result };

}






export default emailExtracter;