"use client";

import Avatar from "@/app/components/avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FC, useState } from "react";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
	isLast: boolean;
	message: FullMessageType;
}

const MessageBox: FC<MessageBoxProps> = ({ isLast, message }) => {
	const session = useSession();
	const [imageModalOpen, setImageModalOpen] = useState(false);

	const isOwn = session?.data?.user?.email === message?.sender?.email;
	const seenList = (message?.seen || [])
		.filter((user) => user.email !== message?.sender?.email)
		.map((user) => user.name)
		.join(", ");

	const container = clsx("flex gap-3 p-4", isOwn && "justify-end");

	const avatar = clsx(isOwn && "order-2");

	const body = clsx("flex flex-col gap-2", isOwn && "items-end");

	const messageContainer = clsx(
		"text-sm w-fit overflow-hidden",
		isOwn ? "text-white bg-sky-500" : "bg-gray-100",
		message?.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
	);

	return (
		<div className={container}>
			<div className={avatar}>
				<Avatar user={message?.sender} />
			</div>
			<div className={body}>
				<div className="flex items-center gap-1">
					<div className="text-sm text-gray-500">{message?.sender?.name}</div>
					<div className="text-xs text-gray-400">
						{format(new Date(message?.createdAt), "p")}
					</div>
				</div>
				<div className={messageContainer}>
					<ImageModal
						src={message?.image}
						isOpen={imageModalOpen}
						onClose={() => setImageModalOpen(false)}
					/>
					{message?.image ? (
						<Image
							onClick={() => setImageModalOpen(true)}
							alt="Image"
							height={288}
							width={288}
							src={message?.image}
							className="object-cover cursor-pointer hover:scale-110 transition translate"
						/>
					) : (
						<div>{message?.body}</div>
					)}
				</div>
				{isLast && isOwn && seenList.length > 0 && (
					<div className="text-xs font-light text-gray-500">{`Seen by ${seenList}`}</div>
				)}
			</div>
		</div>
	);
};

export default MessageBox;
