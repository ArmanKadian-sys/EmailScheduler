import {Worker, Queue} from "bullmq";
import { connection } from "./connection.js";



const NotificationWorker=async (notificationQueue)=>{

const worker=new Worker("notifications", async ()=>{

const jobs=await notificationQueue.getJobs();

const jobarray=jobs.map((job)=>job.data);


console.log("These are the notifications", jobarray);

},
{connection});

worker.on("completed",(job)=>{
  console.log(`Job with  has been completed`);
});

worker.on("failed",(job, err)=>{
  console.log(`Job  has failed with error ${err.message}`);
}); 

}

export default NotificationWorker;