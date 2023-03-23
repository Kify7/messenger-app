"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { Message } from "../appTypes";
import { channel } from "../pusher";
import fetcher from "../utils/fetchMessages";
import MessageComponent from "./MessageComponent";

export const MessageList =({initialMessages}:{initialMessages: Message[]}) => {
  const {
    data: messages,
    error,
    mutate,
  } = useSWR<Message[]>("/api/getMessages", fetcher);

  useEffect(()=>{
    channel.bind('new-message',async (data:Message) => {
      //if you send the message, no need to update cache
      if(messages?.find((message)=> message?.id === data.id)) return;

      if(!messages){
        mutate(fetcher);
      } else if (messages){
        mutate(fetcher,{
          optimisticData:[data, ...messages!],
          rollbackOnError: true
        });
      };
    })
    return ()=>{
      channel.unbind_all();
      channel.unsubscribe();
    }
  },[mutate, messages, channel])
 
 
  return (
    <div className="space-y-5 px-5 pt-8 pb-32 max-w-2xl xl:max-w-4xl mx-auto">
      {(messages || initialMessages).map(
        (message) =>
          message && <MessageComponent key={message.id} message={message} />
      )}
    </div>
  );
};
