import Pusher from "pusher";
import ClientPusher from "pusher-js";

export const serverPusher = new Pusher({
    appId: process.env.PUSHER_SERVER_ID!,
    key: process.env.PUSHER_SERVER_KEY!,
    secret: process.env.PUSHER_SERVER_SECRET!,
    cluster: process.env.PUSHER_SERVER_CLUSTER!,
 
});

const clientPusher = new ClientPusher('19f8def422708bcab217', {
  cluster: 'us2',
});

export const channel = clientPusher.subscribe('messages');
