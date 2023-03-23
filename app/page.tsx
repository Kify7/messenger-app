import React from 'react'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { Message } from '../appTypes';
import Providers from './providers';
import { getServerSession } from 'next-auth/next'


const HomePage = async () => {
  const data = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/getMessages`).then(res=>res.json());
  const messages: Message[] = data.messages;
  const session = await getServerSession();

  return (
    <div>
      <Providers session={session}>
        <main>
        <MessageList initialMessages={messages}/>
        <ChatInput session={session}/>
        </main>
       </Providers>
    </div>
  )
}

export default HomePage