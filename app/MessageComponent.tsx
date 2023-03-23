import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { Message } from "../appTypes";
import TimeAgo from 'react-timeago';

type MessageComponentProps = {
  message: Message;
};

const MessageComponent = ({ message }: MessageComponentProps) => {
  const {data: session}= useSession();
  const isUser = session?.user?.email === message.email;
  return (
    <div className={`flex w-fit ${isUser && "ml-auto"}`}>
      <div className={`flex-shrink-0 ${isUser && "order-2"}`}>
        <Image
          src={message.profile_picture}
          className="rounded-full mx-2 object-contain"
          width={50}
          height={10}
          alt="profile picture"
        />
      </div>
      <div>
        <p
          className={`px-[2px] pb-[2px] text-[0.65rem] ${
            isUser ? "text-blue-400 text-right" : "text-red-400 text-left"
          }`}
        >
          {message.user_name}
        </p>
        <div className="flex items-end">
          <div
            className={`px-3 py-2 rounded-lg w-fit text-white ${
              isUser ? "bg-blue-400 ml-auto order-2" : "bg-red-400"
            } `}
          >
            <p>{message.message}</p>
          </div>
          <p
            className={`text-[0.65rem] italic px-2 text-gray-300 ${
              isUser && "text-right"
            }`}
          >
            <TimeAgo date={new Date(message.created_at)}/>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
