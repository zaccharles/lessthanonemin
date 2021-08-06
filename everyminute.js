'use strict';

const { SQSClient, SendMessageBatchCommand } = require("@aws-sdk/client-sqs");

const RATE_IN_SECONDS = parseInt(process.env.RATE_IN_SECONDS);
const QUEUE_URL = process.env.QUEUE_URL;
const sqs = new SQSClient({ region: process.env.AWS_REGION })

module.exports.handle = async (event) => {
  const entries = [];

  for (let delay = RATE_IN_SECONDS; delay <= 60; delay += RATE_IN_SECONDS) {
    entries.push({
      Id: entries.length,
      DelaySeconds: delay,
      MessageBody: JSON.stringify({
        EventTime: event.time,
        DelaySeconds: delay
      })
    });    
  }

  for (let group = 0; group < entries.length / 10; group++) {
    const input = { 
      Entries: entries.slice(group * 10, group * 10 + 10), 
      QueueUrl: QUEUE_URL
    };

    const command = new SendMessageBatchCommand(input);
    await sqs.send(command);
  }

  return event;
};
