import pg from "pg";

const { Pool } = pg;

const email_pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_tJcOlakCh50R@ep-dry-morning-a7s3hn9p.ap-southeast-2.aws.neon.tech/neondb?sslmode=require",
});


export default email_pool;