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
  const groups = {};

  chats.forEach((chat) => {
    const date = new Date(chat.createdAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday =
      date.toDateString() === today.toDateString();
    const isYesterday =
      date.toDateString() === yesterday.toDateString();

    let label;
    if (isToday) {
      label = "Today";
    } else if (isYesterday) {
      label = "Yesterday";
    } else {
      label = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(chat);
  });

  return groups;
}