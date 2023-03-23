// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Message } from '../../appTypes'
import { serverPusher } from '../../pusher'
import redis from '../../redis'


type Data = {
  messages: Message
}
type Error = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {

  if(req.method !== "POST"){
    res.status(405).json({ error: 'Not allowed' });
    return;
  }

  const { message } = req.body;

  const newMessage = {
    ...message,
    created_at: Date.now()
  };

  await redis.hset('messages', message.id, JSON.stringify(newMessage));
  serverPusher.trigger('messages','new-message', newMessage)

  res.status(200).json({ messages: newMessage })
}
