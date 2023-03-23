"use client";

import { FC, FormEvent, useState } from "react";
import { v4 as uuid } from "uuid";
import { Message } from "../appTypes";
import useSWR from 'swr'
import fetcher from "../utils/fetchMessages";
import { Session } from "next-auth";

interface SessionProps{
  session: Session | null;
}

export const ChatInput: FC<SessionProps> = ({session} ) => {

  const [input, setInput] = useState("");
  const { data: messages, error, mutate } = useSWR('/api/getMessages', fetcher);

  const addMessage = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    if (!session || !input)
      return;

    setInput("");

    const id = uuid();

    const message: Message = {
      id,
      message: input,
      created_at: Date.now(),
      user_name: session.user?.name!,
      profile_picture: session.user?.image!,
      email: session.user?.email!
    };

    const uploadMessageToUpstash = async () => {
      const data = await fetch('/api/addMessage', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message
        }),
      }).then(res => res.json());
      return [data.message, ...messages!];

    };

    mutate(fetcher, {
      optimisticData: [message, ...messages!],
      rollbackOnError: true
    });
    await mutate(uploadMessageToUpstash);
  };

  return (
    <form
      onSubmit={addMessage}
      className="flex px-10 py-5 bottom-0 fixed w-full z-50 bg-white"
    >
      <input
        type="text"
        placeholder="Enter your message here..."
        className="flex-1 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent px-5 py-3"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={!session} />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!input}
      >
        Send
      </button>
    </form>
  );
}
