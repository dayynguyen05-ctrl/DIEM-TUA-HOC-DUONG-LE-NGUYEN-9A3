import { useListFaq } from "@workspace/api-client-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { HelpCircle, MessagesSquare } from "lucide-react";

export default function FAQ() {
  const { data: faqCategories, isLoading } = useListFaq();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
          <MessagesSquare className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold font-serif mb-4 text-foreground">Câu Hỏi Thường Gặp</h1>
        <p className="text-lg text-muted-foreground">
          Những thắc mắc phổ biến về việc chăm sóc sức khỏe tinh thần và sử dụng ứng dụng Điểm Tựa Học Đường.
        </p>
      </div>

      <div className="space-y-10">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            </div>
          ))
        ) : (
          faqCategories?.map((category) => (
            <div key={category.id} className="animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-bold mb-6 text-foreground border-b border-border/50 pb-2 inline-flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                {category.name}
              </h2>
              <Accordion type="single" collapsible className="w-full space-y-3">
                {category.questions.map((item) => (
                  <AccordionItem 
                    key={item.id} 
                    value={`item-${item.id}`}
                    className="border border-border/50 bg-card rounded-xl px-4 overflow-hidden data-[state=open]:border-primary/30 transition-colors"
                  >
                    <AccordionTrigger className="hover:no-underline font-semibold text-left py-4 text-foreground/90">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-16 text-center text-muted-foreground bg-muted/30 p-8 rounded-2xl border border-border/50">
        <p>Bạn không tìm thấy câu trả lời cho vấn đề của mình?</p>
        <p className="mt-2">
          Hãy thử trò chuyện trực tiếp với <a href="/chat" className="text-primary font-medium hover:underline">Chatbot Điểm Tựa</a>.
        </p>
      </div>
    </div>
  );
}
