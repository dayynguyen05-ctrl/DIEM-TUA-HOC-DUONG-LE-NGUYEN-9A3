import { useState } from "react";
import { getSessionId } from "@/lib/session";
import { useLogMood, useGetMoodHistory } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Loader2, Calendar } from "lucide-react";
import { MoodInputMood } from "@workspace/api-client-react";

const MOODS = [
  { value: "very_sad", label: "Rất buồn", color: "bg-chart-5 text-white", score: 1 },
  { value: "sad", label: "Buồn", color: "bg-chart-4 text-white", score: 2 },
  { value: "neutral", label: "Bình thường", color: "bg-chart-3 text-white", score: 3 },
  { value: "happy", label: "Vui vẻ", color: "bg-chart-2 text-white", score: 4 },
  { value: "very_happy", label: "Rất vui", color: "bg-chart-1 text-white", score: 5 },
] as const;

export default function Mood() {
  const sessionId = getSessionId();
  const { toast } = useToast();
  
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[number] | null>(null);
  const [note, setNote] = useState("");

  const { data: history, isLoading: historyLoading, refetch } = useGetMoodHistory({ sessionId, days: 7 });
  const logMoodMutation = useLogMood();

  const handleSave = () => {
    if (!selectedMood) return;

    logMoodMutation.mutate(
      {
        data: {
          sessionId,
          mood: selectedMood.value as MoodInputMood,
          score: selectedMood.score,
          note: note.trim() || undefined
        }
      },
      {
        onSuccess: () => {
          toast({
            title: "Đã lưu cảm xúc",
            description: "Cảm ơn bạn đã chia sẻ cảm xúc hôm nay.",
          });
          setSelectedMood(null);
          setNote("");
          refetch();
        },
        onError: () => {
          toast({
            title: "Có lỗi xảy ra",
            description: "Không thể lưu cảm xúc, vui lòng thử lại.",
            variant: "destructive"
          });
        }
      }
    );
  };

  // Prepare chart data
  const chartData = history?.map(entry => ({
    date: new Date(entry.createdAt).toLocaleDateString('vi-VN', { weekday: 'short' }),
    score: entry.score,
    mood: entry.mood,
    note: entry.note
  })).reverse() || [];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-serif mb-4 text-foreground">Ghi Nhận Cảm Xúc</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Dành một phút để nhìn nhận lại cảm xúc của bản thân. Việc này giúp bạn hiểu rõ hơn về trạng thái tinh thần của mình.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle>Hôm nay bạn thế nào?</CardTitle>
            <CardDescription>Chọn một trạng thái gần nhất với cảm xúc của bạn lúc này.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between px-2">
              {MOODS.map((m) => {
                const isSelected = selectedMood?.value === m.value;
                return (
                  <button
                    key={m.value}
                    onClick={() => setSelectedMood(m)}
                    className={`flex flex-col items-center gap-2 group transition-all duration-200 ${isSelected ? "scale-110" : "hover:scale-105 opacity-70 hover:opacity-100"}`}
                  >
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${isSelected ? m.color + " shadow-lg ring-4 ring-primary/20 ring-offset-2 ring-offset-background" : "bg-muted text-muted-foreground"}`}>
                      {/* Simple visual indicator since emoji banned */}
                      <div className={`w-4 h-4 rounded-full ${isSelected ? "bg-white" : m.color.split(' ')[0]}`}></div>
                    </div>
                    <span className={`text-xs font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Ghi chú thêm (không bắt buộc)</label>
              <Textarea 
                placeholder="Có điều gì đang làm bạn vui hay phiền lòng không?"
                className="resize-none h-24 bg-muted/30"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <Button 
              className="w-full rounded-full" 
              size="lg"
              disabled={!selectedMood || logMoodMutation.isPending}
              onClick={handleSave}
            >
              {logMoodMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Lưu lại cảm xúc
            </Button>
          </CardContent>
        </Card>

        {/* History Section */}
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lịch sử cảm xúc</CardTitle>
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            <CardDescription>Biểu đồ biến thiên cảm xúc trong 7 ngày qua.</CardDescription>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary/30" />
              </div>
            ) : chartData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      domain={[1, 5]} 
                      ticks={[1, 2, 3, 4, 5]} 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold', marginBottom: '4px' }}
                      formatter={(value: number) => {
                        const moodLabel = MOODS.find(m => m.score === value)?.label || value;
                        return [moodLabel, "Cảm xúc"];
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', r: 4, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                      activeDot={{ r: 6, fill: 'hsl(var(--secondary))', stroke: 'hsl(var(--background))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-border/50">
                <p>Chưa có dữ liệu cảm xúc.</p>
                <p className="text-sm mt-1">Hãy lưu lại cảm xúc đầu tiên của bạn!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
