import { redis } from "../config/rediseIo.js";
import { sendEmail } from "../services/email.service.js";
import {Worker} from "bullmq"

const worker=new Worker("email-worker",async(job)=>{

 await sendEmail(job.data)
},{
    connection:redis,
    concurrency:5
})
worker.on("completed", (job) => {
    console.log(
      `Job ${job.id} completed`
    );
  });
  
  worker.on("failed", (job, err) => {
    console.error(
      `Job ${job.id} failed`,
      err
    );
  });