import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser.js";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader.jsx";
import CallButton from "../components/CallButton.jsx";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  useEffect(() => {
    let client;

    const initChat = async () => {
      console.log("⚡ Chat Init Triggered!");
      console.log("authUser:", authUser);
      console.log("tokenData:", tokenData);

      // 1️⃣ Wait for both authUser and tokenData
      if (!tokenData?.token || !authUser) {
        console.log("⏸️ Missing tokenData or authUser. Skipping initChat.");
        return;
      }

      try {
        console.log("✅ Proceeding to initialize stream chat client...");
        client = StreamChat.getInstance(STREAM_API_KEY);

        // 2️⃣ Connect only if not already connected
        if (!client.userID) {
          const streamToken = tokenData.token;
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            streamToken
          );
          console.log("🔗 Connected to Stream as:", authUser.fullName);
        } else {
          console.log("🔄 Already connected as:", client.userID);
        }

        // 3️⃣ Create/Watch Channel
        const channelId = [authUser._id, targetUserId].sort().join("-");
        console.log("📡 Creating/Watching channel:", channelId);

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);

        console.log("🎉 Chat initialized successfully!");
      } catch (error) {
        console.error("💥 Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();

    // 4️⃣ Cleanup only on component unmount
    return () => {
      if (client) {
        console.log("🧹 Disconnecting Stream client on unmount...");
        client.disconnectUser();
      }
    };
    // ⚠️ only run when the user or token changes
  }, [authUser?._id, tokenData?.token, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;
