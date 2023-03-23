// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Message } from '../../appTypes'
import redis from '../../redis'

type Data = {
  messages: Message[];
}
type Error = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {

  if(req.method !== "GET"){
    res.status(405).json({ error: 'Not allowed' });
    return;
  }

  const messagesResponse = await redis.hvals('messages');
  const messages: Message[] = messagesResponse?.map((message)=> JSON.parse(message)).sort((a,b)=>b.created_at - a.created_at);

  res.status(200).json({ messages: messages })
}
