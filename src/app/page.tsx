import Chat from "./chat/Chat";
import AllMessages from "./components/AllMessages";

export default function Home() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Gemini Copilot Demo</h1>
      <p>Press <kbd>Ctrl + /</kbd> to toggle the chat.</p>

      <AllMessages />   {/* Always-visible Bigtable messages */}
      <Chat />          {/* Toggleable session chat */}
    </main>
  );
}
