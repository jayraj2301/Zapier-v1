// import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
import {Kafka} from "kafkajs";
// import prismaClient from '@repo/db';
import { sendEmail } from "./email";
import { logToGoogleSheet } from './gSheet';
import { parse } from "./parser";
import { JsonObject } from "@prisma/client/runtime/library";
import { PrismaClient } from "@prisma/client";

dotenv.config({
    path: './.env'
})
console.log(process.env.SMTP_USERNAME)
const TOPIC_NAME = "zap-events"

const client = new PrismaClient();

const kafka = new Kafka({
    clientId: 'outbox-processor-2',
    brokers: ['localhost:9092']
})

async function main() {
    const consumer = kafka.consumer({groupId: 'main-worker'})
    await consumer.connect();

    const producer = kafka.producer();
    await producer.connect();

    await consumer.subscribe({topic: TOPIC_NAME, fromBeginning: true});

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({topic, message , partition}) => {
            console.log({
                partition,
                offfset: message.offset,
                value: message.value?.toString()
            });
            // await new Promise(r => setTimeout(r, 1000));

            if (!message.value?.toString()) {
                return;
            }

            const parsedMsg = JSON.parse(message.value?.toString())

            const zapRunId = parsedMsg.zapRunId;
            const stage = parsedMsg.stage;
            console.log(zapRunId , "and" , stage);
            

            const zapRunDetails = await client.zapRun.findFirst({
                where: {
                    id: zapRunId
                },
                include: {
                    zap : {
                        include: {
                            actions: {
                                include: {
                                    type: true
                                }
                            }
                        }
                    }
                }
            })

            const currentAction = zapRunDetails?.zap.actions.find((x) => x.sortingOrder === stage);

            if (!currentAction) {
                console.log("Current action not found?");
                return;
            }

            const zapRunMetadata = zapRunDetails?.metadata;

            if (currentAction.type.id === "email") {
                const body = parse((currentAction.metadata as JsonObject)?.body as string, zapRunMetadata);
                const to = parse((currentAction.metadata as JsonObject)?.email as string, zapRunMetadata);
                console.log(`Sending out email to ${to} body is ${body}`)
                await sendEmail(to, body);
            }

            if (currentAction.type.id === "send-sol") {

                const amount = parse((currentAction.metadata as JsonObject)?.amount as string, zapRunMetadata);
                const address = parse((currentAction.metadata as JsonObject)?.address as string, zapRunMetadata);
                console.log(`Sending out SOL of ${amount} to address ${address}`);
                await logToGoogleSheet({username: address, body: amount});
            }

            await new Promise(r => setTimeout(r, 500));

            console.log(currentAction.type.id+ " is done");
            

            const lastStage = (zapRunDetails?.zap.actions?.length || 1) - 1;
            console.log(lastStage, stage)
            if (lastStage !== stage) {
                console.log("reach here");
                
                producer.send({
                  topic: TOPIC_NAME,
                  messages: [
                    {
                      value: JSON.stringify({ zapRunId, stage: stage + 1 }),
                    },
                  ],
                });
            }

            await consumer.commitOffsets([{
                topic: TOPIC_NAME,
                offset: (parseInt(message.offset)+1).toString(),
                partition: partition
            }])
        }
    })
}

main();