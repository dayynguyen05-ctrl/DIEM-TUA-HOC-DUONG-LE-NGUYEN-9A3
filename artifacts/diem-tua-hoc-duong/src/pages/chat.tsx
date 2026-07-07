import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2, Sparkles, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSessionId } from "@/lib/session";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  streaming?: boolean;
}

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

function speakVietnamese(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  // Strip markdown bold markers before speaking
  const clean = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(clean);
  utt.lang = "vi-VN";
  utt.rate = 0.9;
  window.speechSynthesis.speak(utt);
}

function formatText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={i}>
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j}>{part.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

function MessageBubble({ msg }: { msg: Message }) {
  const isBot = msg.role === "bot";
  return (
    <div
      className={`flex ${isBot ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2`}
    >
      <div className={`flex gap-3 max-w-[85%] ${isBot ? "flex-row" : "flex-row-reverse"}`}>
        <div
          className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
            isBot ? "bg-primary/20 text-primary" : "bg-secondary/30 text-secondary-foreground"
          }`}
        >
          {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <div
            className={`rounded-2xl px-4 py-2 text-sm sm:text-base leading-relaxed ${
              isBot
                ? "bg-card border border-border/50 text-card-foreground rounded-tl-none shadow-sm"
                : "bg-primary text-primary-foreground rounded-tr-none shadow-md"
            }`}
          >
            {msg.streaming && msg.text === "" ? (
              <span className="flex items-center gap-1 py-1">
                <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0.2s" }} />
                <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0.4s" }} />
              </span>
            ) : (
              <>
                {formatText(msg.text)}
                {msg.streaming && (
                  <span className="inline-block w-[2px] h-[1em] bg-primary/60 ml-[1px] align-middle animate-pulse" />
                )}
              </>
            )}
          </div>
          {/* TTS button — only for completed bot messages */}
          {isBot && !msg.streaming && msg.text && (
            <button
              onClick={() => speakVietnamese(msg.text)}
              title="Nghe đọc"
              className="self-start flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors px-1 py-0.5 rounded"
            >
              <Volume2 className="w-3 h-3" />
              <span>Nghe</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  const { toast } = useToast();
  const sessionId = getSessionId();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load chat history on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/chat/history?sessionId=${encodeURIComponent(sessionId)}&limit=50`
        );
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as Array<{ text: string; sender: "user" | "bot" }>;
        if (data.length > 0 && !cancelled) {
          const historyMsgs = data.map((m) => ({
            id: nextId.current++,
            role: m.sender,
            text: m.text,
          }));
          setMessages((prev) => [...historyMsgs, ...prev]);
        }
      } catch {
        // non-critical
      } finally {
        if (!cancelled) setIsLoadingHistory(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [sessionId]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim() || isSending) return;

      const trimmed = text.trim();
      setIsSending(true);
      setInput("");

      const userMsgId = nextId.current++;
      const botMsgId = nextId.current++;

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", text: trimmed },
        { id: botMsgId, role: "bot", text: "", streaming: true },
      ]);

      try {
        const res = await fetch(`${BASE_URL}/api/chat/gemini`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, text: trimmed }),
        });

        if (!res.ok || !res.body) {
          const errData = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(errData.error ?? "Lỗi kết nối với server");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        outer: while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            let json: { content?: string; done?: boolean; error?: string };
            try {
              json = JSON.parse(line.slice(6)) as typeof json;
            } catch {
              continue;
            }
            if (json.error) throw new Error(json.error);
            if (json.done) break outer;
            if (json.content) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === botMsgId ? { ...m, text: m.text + json.content! } : m
                )
              );
            }
          }
        }

        // Mark streaming complete
        setMessages((prev) =>
          prev.map((m) => (m.id === botMsgId ? { ...m, streaming: false } : m))
        );
        setTimeout(() => inputRef.current?.focus(), 100);
      } catch (err) {
        // Remove only the bot bubble — user message is already persisted in DB
        setMessages((prev) => prev.filter((m) => m.id !== botMsgId));
        toast({
          title: "Lỗi kết nối",
          description:
            err instanceof Error ? err.message : "Không thể gửi tin nhắn. Vui lòng thử lại.",
          variant: "destructive",
        });
      } finally {
        setIsSending(false);
      }
    },
    [isSending, sessionId, toast]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border/50 p-4 flex items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-semibold text-lg flex items-center gap-2">
              Điểm Tựa
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                <Sparkles className="w-3 h-3" /> AI
              </span>
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Đang hoạt động · Powered by Gemini
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-foreground">
                Xin chào, mình là Điểm Tựa
              </h2>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Mình ở đây để lắng nghe và chia sẻ cùng bạn mọi vui buồn trong
                cuộc sống học đường. Hãy bắt đầu câu chuyện nhé!
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-md">
              {["Xin chào Điểm Tựa", "Mình thấy áp lực học tập", "Mình đang buồn", "Làm sao để giảm stress?"].map(
                (prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleSend(prompt)}
                    disabled={isSending}
                  >
                    {prompt}
                  </Button>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border/50 p-4">
        <form
          onSubmit={onSubmit}
          className="flex items-center gap-2 max-w-4xl mx-auto w-full"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chia sẻ với Điểm Tựa..."
            className="flex-1 rounded-full h-12 px-6 bg-muted/50 border-transparent focus-visible:ring-primary/50 text-base"
            disabled={isSending}
          />
          <Button
            type="submit"
            size="icon"
            className="w-12 h-12 rounded-full flex-shrink-0 shadow-md"
            disabled={!input.trim() || isSending || isLoadingHistory}
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 ml-1" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
