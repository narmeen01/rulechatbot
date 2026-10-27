"use client";

import { useEffect, useRef, useState } from "react";

type Rule = {
  intent: string;
  keywords: string[];
  reply: string;
};

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

const rules: Rule[] = [
  {
    intent: "fee",
    keywords: ["fee", "fees", "tuition", "challan", "dues", "scholarship", "fee structure"],
    reply:
      "Fee ki tafseelat program ke mutabiq mukhtalif hoti hain. Fee structure aur challan ke liye apne department office ya university ki official website par Accounts/Treasurer section se rabta karein.",
  },
  {
    intent: "admission",
    keywords: ["admission", "admissions", "apply", "merit", "entry test", "eligibility", "enroll", "enrollment"],
    reply:
      "Admissions ke liye university ki official website par online apply karna hota hai. Eligibility, merit aur last date ki maloomat Admissions Office ya website ke admission section par mojood hoti hain.",
  },
  {
    intent: "timing",
    keywords: ["timing", "timings", "time", "schedule", "open", "close", "office hours", "class time"],
    reply:
      "Aam tor par university Monday se Friday tak khuli hoti hai. Classes aur offices ke sahi timings department ya official notices se confirm kar lein.",
  },
  {
    intent: "library",
    keywords: ["library", "books", "book", "issue book", "borrow", "reading room", "journal"],
    reply:
      "Central Library mein books, journals aur reading rooms mojood hain. Book issue karwane ke liye valid student card sath laayen. Library ke timings aur membership rules library counter se pooch sakte hain.",
  },
  {
    intent: "hostel",
    keywords: ["hostel", "hostels", "accommodation", "dorm", "residence", "room", "mess"],
    reply:
      "Hostel mein rehne ke liye Hostel Office mein application deni hoti hai. Seats limited hoti hain, is liye jaldi apply karein. Rules, dues aur mess ki details Hostel Warden se mil jayengi.",
  },
];

const GREETING =
  "Assalam-o-Alaikum! Main UOS Helpdesk Bot hoon. Aap mujh se fee, admission, timing, library ya hostel ke baare mein pooch sakte hain.";

const FALLBACK =
  "Maazrat, main aapka sawal samajh nahi saka. Meherbani karke fee, admission, timing, library ya hostel ke baare mein poochein, ya university office se rabta karein.";

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getReply(input: string): string {
  const text = input.toLowerCase().replace(/\s+/g, " ").trim();

  for (const rule of rules) {
    const matched = rule.keywords.some((keyword) => {
      const pattern = new RegExp(`\\b${escapeRegex(keyword.toLowerCase())}\\b`);
      return pattern.test(text);
    });
    if (matched) return rule.reply;
  }
  return FALLBACK;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "bot", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const nextId = useRef(2);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: nextId.current++, sender: "user", text: trimmed };
    const botMsg: Message = {
      id: nextId.current++,
      sender: "bot",
      text: getReply(trimmed),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
        <header className="bg-blue-700 px-5 py-4 text-center text-lg font-semibold text-white">
          UOS Helpdesk Bot
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "rounded-br-sm bg-blue-600 text-white"
                    : "rounded-bl-sm border border-gray-200 bg-white text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2 border-t border-gray-200 bg-white p-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Apna sawal likhein..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-800 outline-none focus:border-blue-600"
          />
          <button
            onClick={sendMessage}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}