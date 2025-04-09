export function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function groupChatsByDate(chats) {
    return chats.reduce((groups, chat) => {
        const label = formatDate(chat.date);
        if (!groups[label]) groups[label] = [];
        groups[label].push(chat);
        return groups;
    }, {});
}