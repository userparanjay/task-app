import { Queue} from "bullmq"
import { redis } from "../config/rediseIo.js"

export const emailQueue= new Queue(
    "email-Queue",{
        connection:redis,
        defaultJobOptions:{
            attempts:5,
            backoff:{
                type:"exponential",
                delay:2000,
            },
            removeOnComplete:100,
            removeOnFail:500
        }
    }
)