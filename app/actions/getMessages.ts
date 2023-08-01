import prisma from "@/app/libs/prismadb";

const getMessages = async (conversationId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        sender: true,
        seen: true,
      },
    });

    if (!messages) {
      return [];
    }

    return messages;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getMessages;
