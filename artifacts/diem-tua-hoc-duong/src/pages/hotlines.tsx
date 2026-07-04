import { useListHotlines } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PhoneCall, ShieldAlert, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hotlines() {
  const { data: hotlines, isLoading } = useListHotlines();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold font-serif mb-4 text-foreground">Liên Hệ Khẩn Cấp</h1>
        <p className="text-lg text-muted-foreground">
          Nếu bạn đang gặp nguy hiểm, có ý định tự hại hoặc cần hỗ trợ tâm lý khẩn cấp, xin vui lòng gọi ngay cho các đường dây nóng dưới đây.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))
        ) : (
          hotlines?.map((hotline) => (
            <Card key={hotline.id} className="border-border/50 hover:border-destructive/30 transition-colors shadow-sm relative overflow-hidden">
              {hotline.available24h && (
                <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  24/7
                </div>
              )}
              <CardHeader className="pt-6">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  {hotline.category || "Hỗ trợ chung"}
                </div>
                <CardTitle className="text-xl">{hotline.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <a href={`tel:${hotline.phone.replace(/[^0-9]/g, '')}`} className="block">
                  <Button variant="outline" className="w-full h-14 text-lg font-bold text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-colors group">
                    <PhoneCall className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    {hotline.phone}
                  </Button>
                </a>
                <CardDescription className="text-base text-foreground/80 leading-relaxed">
                  {hotline.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="mt-16 bg-primary/10 rounded-2xl p-8 max-w-4xl mx-auto text-center border border-primary/20">
        <h3 className="text-xl font-bold mb-3 text-primary-foreground">Bạn không đơn độc</h3>
        <p className="text-foreground/80 max-w-2xl mx-auto">
          Tìm kiếm sự giúp đỡ là dấu hiệu của sự mạnh mẽ, không phải sự yếu đuối. Sẽ luôn có những người chuyên nghiệp sẵn sàng lắng nghe và đồng hành cùng bạn qua những lúc khó khăn nhất.
        </p>
      </div>
    </div>
  );
}
