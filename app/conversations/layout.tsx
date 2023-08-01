import getConversations from "../actions/getConversations";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

export default async function ConversationsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const conversations = await getConversations();

	return (
		<Sidebar>
			<div className="h-full">
				<ConversationList conversations={conversations} />
				{children}
			</div>
		</Sidebar>
	);
}
