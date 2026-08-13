
const emailExtracter = async(db_pool)=>{
const query =`SELECT id, sendAt
FROM emails
ORDER BY sendAt ASC
LIMIT 50;`

let result;

try{
  result= await db_pool.query(query);s
}
catch(error){
  throw new Error(error);

}

return result;
 
}


export default emailExtracter;