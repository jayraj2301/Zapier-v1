import { PrismaClient } from "@prisma/client";
import {Kafka} from "kafkajs";

const TOPIC_NAME = "zap-events"

const client = new PrismaClient();

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
})

async function main() {
    const consumer = kafka.consumer({groupId: 'main-worker'})
    await consumer.connect();

    await consumer.subscribe({topic: TOPIC_NAME, fromBeginning: true});

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({topic, message , partition}) => {
            console.log({
                partition,
                offfset: message.offset,
                value: message.value?.toString()
            });
            await new Promise(r => setTimeout(r, 1000));

            await consumer.commitOffsets([{
                topic: TOPIC_NAME,
                offset: message.offset,
                partition: partition
            }])
        }
    })
}

main();