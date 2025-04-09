import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { ChatProvider } from "./contexts/chatContext";

export const metadata = {
  title: "ChaatGPT",
  description: "Your AI Chat Assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ChatProvider>
      <body className="vh-100 d-flex">{children}</body>
      </ChatProvider>
    </html>
  );
}
