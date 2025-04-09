const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getChats() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch chats");
  return res.json();
}

export async function getChat(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch chat");
  return res.json();
}

export async function createChat() {
  const res = await fetch(BASE_URL, { method: "POST" });
  if (!res.ok) throw new Error("Failed to create chat");
  return res.json();
}

export async function updateChat(id, messages) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error("Failed to update chat");
  return res.json();
}

export async function deleteChat(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete chat");
}
