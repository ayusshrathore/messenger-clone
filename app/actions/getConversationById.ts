import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversationById = async (conversationId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return null;
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!conversation) {
      return null;
    }

    return conversation;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default getConversationById;
