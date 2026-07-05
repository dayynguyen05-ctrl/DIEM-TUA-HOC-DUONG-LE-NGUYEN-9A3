import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSessionId } from "@/lib/session";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
}

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

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
            isBot
              ? "bg-primary/20 text-primary"
              : "bg-secondary/30 text-secondary-foreground"
          }`}
        >
          {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>
        <div
          className={`rounded-2xl px-4 py-2 text-sm sm:text-base leading-relaxed ${
            isBot
              ? "bg-card border border-border/50 text-card-foreground rounded-tl-none shadow-sm"
              : "bg-primary text-primary-foreground rounded-tr-none shadow-md"
          }`}
        >
          {formatText(msg.text)}
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
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
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

  // Load chat history on mount — merge into state so concurrent sends are not overwritten
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/chat/history?sessionId=${encodeURIComponent(sessionId)}&limit=50`
        );
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as Array<{
          id: number;
          text: string;
          sender: "user" | "bot";
        }>;
        if (data.length > 0 && !cancelled) {
          const historyMsgs = data.map((m) => ({
            id: nextId.current++,
            role: m.sender,
            text: m.text,
          }));
          // Prepend history; keep any messages the user already sent during load
          setMessages((prev) => [...historyMsgs, ...prev]);
        }
      } catch {
        // history load failure is non-critical
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
      setSuggestedReplies([]);

      const userMsgId = nextId.current++;
      const userMsg: Message = { id: userMsgId, role: "user", text: trimmed };
      setMessages((prev) => [...prev, userMsg]);

      try {
        const res = await fetch(`${BASE_URL}/api/chat/message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, text: trimmed }),
        });

        if (!res.ok) {
          const errData = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(errData.error ?? "Lỗi kết nối với server");
        }

        const data = (await res.json()) as {
          botMessage: { text: string };
          suggestedReplies?: string[];
        };

        const botMsg: Message = {
          id: nextId.current++,
          role: "bot",
          text: data.botMessage.text,
        };
        setMessages((prev) => [...prev, botMsg]);
        setSuggestedReplies(data.suggestedReplies ?? []);
        setTimeout(() => inputRef.current?.focus(), 100);
      } catch (err) {
        // Roll back optimistic user message so UI stays in sync with server state
        setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
        setInput(trimmed); // restore input so user can retry
        toast({
          title: "Lỗi kết nối",
          description:
            err instanceof Error
              ? err.message
              : "Không thể gửi tin nhắn. Vui lòng thử lại.",
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
            <h1 className="font-semibold text-lg">Điểm Tựa</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Đang hoạt động
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4"
      >
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
              {[
                "Xin chào Điểm Tựa",
                "Mình thấy áp lực học tập",
                "Mình đang buồn",
                "Làm sao để giảm stress?",
              ].map((prompt) => (
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
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {isSending && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-primary/20 text-primary">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-card border border-border/50 shadow-sm">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" />
                      <span
                        className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Suggested replies */}
      {suggestedReplies.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {suggestedReplies.map((reply) => (
            <Button
              key={reply}
              variant="outline"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => handleSend(reply)}
              disabled={isSending}
            >
              {reply}
            </Button>
          ))}
        </div>
      )}

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
            disabled={!input.trim() || isSending}
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
