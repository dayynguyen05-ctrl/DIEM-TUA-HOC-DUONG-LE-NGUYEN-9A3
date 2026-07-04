import { useState, useRef, useEffect } from "react";
import { useGetChatHistory, useSendChatMessage } from "@workspace/api-client-react";
import { getSessionId } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import type { ChatMessage as APIChatMessage } from "@workspace/api-client-react";

function TypingText({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    idx.current = 0;
    doneRef.current = false;
    setDisplayed("");
    const interval = setInterval(() => {
      if (idx.current >= text.length) {
        clearInterval(interval);
        if (!doneRef.current) {
          doneRef.current = true;
          onDone?.();
        }
        return;
      }
      setDisplayed(text.slice(0, idx.current + 1));
      idx.current += 1;
    }, 14);
    return () => clearInterval(interval);
  }, [text, onDone]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-primary/60 ml-[1px] align-middle animate-pulse" />
      )}
    </span>
  );
}

function MessageBubble({
  msg,
  isLatestBot,
}: {
  msg: APIChatMessage;
  isLatestBot: boolean;
}) {
  const isBot = msg.sender === "bot";
  const [typed, setTyped] = useState(false);

  const text = msg.text ?? "";

  const lines = text.split("\n");
  const formatted = lines.map((line, i) => {
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

  return (
    <div
      className={`flex ${isBot ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2`}
    >
      <div
        className={`flex gap-3 max-w-[85%] ${isBot ? "flex-row" : "flex-row-reverse"}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${isBot ? "bg-primary/20 text-primary" : "bg-secondary/30 text-secondary-foreground"}`}
        >
          {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>
        <div
          className={`rounded-2xl px-4 py-2 text-sm sm:text-base leading-relaxed ${isBot ? "bg-card border border-border/50 text-card-foreground rounded-tl-none shadow-sm" : "bg-primary text-primary-foreground rounded-tr-none shadow-md"}`}
        >
          {isBot && isLatestBot && !typed ? (
            <TypingText text={text} onDone={() => setTyped(true)} />
          ) : (
            formatted
          )}
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  const sessionId = getSessionId();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: history, isLoading: historyLoading } = useGetChatHistory({ sessionId });
  const sendMutation = useSendChatMessage();

  const [messages, setMessages] = useState<APIChatMessage[]>([]);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [latestBotId, setLatestBotId] = useState<number | null>(null);

  useEffect(() => {
    if (history) {
      setMessages(history);
    }
  }, [history]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sendMutation.isPending]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: APIChatMessage = {
      id: Date.now(),
      sessionId,
      text,
      sender: "user",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSuggestedReplies([]);

    sendMutation.mutate(
      { data: { sessionId, text } },
      {
        onSuccess: (res) => {
          setMessages((prev) => [...prev, res.botMessage]);
          setLatestBotId(res.botMessage.id ?? null);
          if (res.suggestedReplies) setSuggestedReplies(res.suggestedReplies);
          if (res.category) setCurrentCategory(res.category);
          setTimeout(() => inputRef.current?.focus(), 100);
        },
        onError: () => {
          toast({
            title: "Lỗi kết nối",
            description: "Không thể gửi tin nhắn. Vui lòng thử lại.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border/50 p-4 flex items-center justify-between sticky top-0 z-10">
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
        {currentCategory && (
          <div className="hidden sm:flex items-center gap-1 text-xs font-medium px-3 py-1 bg-secondary/20 text-secondary-foreground rounded-full">
            <Info className="w-3 h-3" />
            Chủ đề: {currentCategory}
          </div>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-blend-overlay"
      >
        {historyLoading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
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
                Mình ở đây để lắng nghe và chia sẻ cùng bạn mọi vui buồn trong cuộc sống học đường. Hãy bắt đầu câu chuyện nhé!
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-md">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => handleSend("Xin chào Điểm Tựa")}
              >
                Xin chào Điểm Tựa
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => handleSend("Hôm nay mình thấy rất áp lực học tập")}
              >
                Mình thấy áp lực học tập
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => handleSend("Mình đang gặp chuyện buồn")}
              >
                Mình đang buồn
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((msg, idx) => (
              <MessageBubble
                key={msg.id || idx}
                msg={msg}
                isLatestBot={msg.sender === "bot" && msg.id === latestBotId}
              />
            ))}

            {sendMutation.isPending && (
              <div className="flex justify-start animate-in fade-in">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-card border border-border/50 rounded-tl-none shadow-sm flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" />
                    <div
                      className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border/50 p-4">
        {suggestedReplies.length > 0 && !sendMutation.isPending && (
          <div className="flex flex-wrap gap-2 mb-4 animate-in slide-in-from-bottom-2">
            {suggestedReplies.map((reply, i) => (
              <Button
                key={i}
                variant="secondary"
                size="sm"
                className="rounded-full text-xs font-medium bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground"
                onClick={() => handleSend(reply)}
              >
                {reply}
              </Button>
            ))}
          </div>
        )}

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
            disabled={sendMutation.isPending}
          />
          <Button
            type="submit"
            size="icon"
            className="w-12 h-12 rounded-full flex-shrink-0 shadow-md"
            disabled={!input.trim() || sendMutation.isPending}
          >
            <Send className="w-5 h-5 ml-1" />
          </Button>
        </form>
      </div>
    </div>
  );
}
