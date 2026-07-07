import { useState, useMemo, useCallback } from "react";
import {
  BookOpen, Search, Volume2, Star, Brain, Trophy,
  RotateCcw, ChevronRight, CheckCircle2, XCircle, Home,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Word {
  en: string;
  vi: string;
  phonetic: string;
  example: string;
  exampleVi: string;
  level: "Cơ bản" | "Trung cấp" | "Nâng cao";
  topic: string;
}

const words: Word[] = [
  { en: "study", vi: "học tập", phonetic: "/ˈstʌdi/", example: "I study every day.", exampleVi: "Tôi học mỗi ngày.", level: "Cơ bản", topic: "Học đường" },
  { en: "homework", vi: "bài tập về nhà", phonetic: "/ˈhoʊmwɜːrk/", example: "Did you finish your homework?", exampleVi: "Bạn đã làm xong bài tập về nhà chưa?", level: "Cơ bản", topic: "Học đường" },
  { en: "classroom", vi: "phòng học", phonetic: "/ˈklæsruːm/", example: "The classroom is quiet.", exampleVi: "Phòng học rất yên tĩnh.", level: "Cơ bản", topic: "Học đường" },
  { en: "schedule", vi: "thời khóa biểu", phonetic: "/ˈskɛdʒuːl/", example: "Check your schedule.", exampleVi: "Hãy kiểm tra thời khóa biểu của bạn.", level: "Trung cấp", topic: "Học đường" },
  { en: "examination", vi: "kỳ thi", phonetic: "/ɪɡˌzæmɪˈneɪʃən/", example: "The examination is tomorrow.", exampleVi: "Kỳ thi là ngày mai.", level: "Trung cấp", topic: "Học đường" },
  { en: "concentrate", vi: "tập trung", phonetic: "/ˈkɒnsəntreɪt/", example: "Try to concentrate on your work.", exampleVi: "Hãy cố gắng tập trung vào bài học.", level: "Trung cấp", topic: "Học đường" },
  { en: "knowledge", vi: "kiến thức", phonetic: "/ˈnɒlɪdʒ/", example: "Knowledge is power.", exampleVi: "Kiến thức là sức mạnh.", level: "Trung cấp", topic: "Học đường" },
  { en: "achieve", vi: "đạt được", phonetic: "/əˈtʃiːv/", example: "She achieved top grades.", exampleVi: "Cô ấy đạt điểm cao nhất.", level: "Trung cấp", topic: "Học đường" },
  { en: "curriculum", vi: "chương trình học", phonetic: "/kəˈrɪkjʊləm/", example: "The curriculum includes science.", exampleVi: "Chương trình học bao gồm khoa học.", level: "Nâng cao", topic: "Học đường" },
  { en: "semester", vi: "học kỳ", phonetic: "/sɪˈmɛstər/", example: "This semester is tough.", exampleVi: "Học kỳ này rất vất vả.", level: "Trung cấp", topic: "Học đường" },
  { en: "anxious", vi: "lo lắng, bồn chồn", phonetic: "/ˈæŋkʃəs/", example: "I feel anxious before exams.", exampleVi: "Tôi cảm thấy lo lắng trước kỳ thi.", level: "Trung cấp", topic: "Cảm xúc" },
  { en: "confident", vi: "tự tin", phonetic: "/ˈkɒnfɪdənt/", example: "Be confident in yourself.", exampleVi: "Hãy tự tin vào bản thân.", level: "Cơ bản", topic: "Cảm xúc" },
  { en: "overwhelmed", vi: "bị quá tải", phonetic: "/ˌoʊvərˈwɛlmd/", example: "She felt overwhelmed by work.", exampleVi: "Cô ấy cảm thấy quá tải với công việc.", level: "Nâng cao", topic: "Cảm xúc" },
  { en: "motivated", vi: "có động lực", phonetic: "/ˈmoʊtɪveɪtɪd/", example: "I am motivated to learn.", exampleVi: "Tôi có động lực để học.", level: "Trung cấp", topic: "Cảm xúc" },
  { en: "frustrated", vi: "thất vọng, bực bội", phonetic: "/ˈfrʌstreɪtɪd/", example: "He felt frustrated with the problem.", exampleVi: "Anh ấy cảm thấy bực bội với vấn đề đó.", level: "Trung cấp", topic: "Cảm xúc" },
  { en: "grateful", vi: "biết ơn", phonetic: "/ˈɡreɪtfəl/", example: "I am grateful for your help.", exampleVi: "Tôi biết ơn vì sự giúp đỡ của bạn.", level: "Trung cấp", topic: "Cảm xúc" },
  { en: "lonely", vi: "cô đơn", phonetic: "/ˈloʊnli/", example: "She felt lonely at school.", exampleVi: "Cô ấy cảm thấy cô đơn ở trường.", level: "Cơ bản", topic: "Cảm xúc" },
  { en: "excited", vi: "hào hứng, phấn khích", phonetic: "/ɪkˈsaɪtɪd/", example: "I'm excited about the trip.", exampleVi: "Tôi rất hào hứng về chuyến đi.", level: "Cơ bản", topic: "Cảm xúc" },
  { en: "determined", vi: "quyết tâm", phonetic: "/dɪˈtɜːrmɪnd/", example: "She is determined to succeed.", exampleVi: "Cô ấy quyết tâm thành công.", level: "Trung cấp", topic: "Cảm xúc" },
  { en: "resilient", vi: "kiên cường, bền bỉ", phonetic: "/rɪˈzɪliənt/", example: "Be resilient in hard times.", exampleVi: "Hãy kiên cường trong những lúc khó khăn.", level: "Nâng cao", topic: "Cảm xúc" },
  { en: "experiment", vi: "thí nghiệm", phonetic: "/ɪkˈspɛrɪmənt/", example: "We did an experiment in class.", exampleVi: "Chúng tôi làm thí nghiệm trong lớp.", level: "Trung cấp", topic: "Khoa học" },
  { en: "hypothesis", vi: "giả thuyết", phonetic: "/haɪˈpɒθɪsɪs/", example: "Test your hypothesis.", exampleVi: "Hãy kiểm tra giả thuyết của bạn.", level: "Nâng cao", topic: "Khoa học" },
  { en: "molecule", vi: "phân tử", phonetic: "/ˈmɒlɪkjuːl/", example: "Water is made of molecules.", exampleVi: "Nước được tạo thành từ các phân tử.", level: "Trung cấp", topic: "Khoa học" },
  { en: "gravity", vi: "trọng lực", phonetic: "/ˈɡrævɪti/", example: "Gravity keeps us on Earth.", exampleVi: "Trọng lực giữ chúng ta trên Trái Đất.", level: "Cơ bản", topic: "Khoa học" },
  { en: "energy", vi: "năng lượng", phonetic: "/ˈɛnərdʒi/", example: "Solar energy is renewable.", exampleVi: "Năng lượng mặt trời là tái tạo được.", level: "Cơ bản", topic: "Khoa học" },
  { en: "biology", vi: "sinh học", phonetic: "/baɪˈɒlədʒi/", example: "I love biology class.", exampleVi: "Tôi thích tiết sinh học.", level: "Cơ bản", topic: "Khoa học" },
  { en: "chemical", vi: "hóa học, hóa chất", phonetic: "/ˈkɛmɪkəl/", example: "Handle chemicals carefully.", exampleVi: "Xử lý hóa chất cẩn thận.", level: "Trung cấp", topic: "Khoa học" },
  { en: "formula", vi: "công thức", phonetic: "/ˈfɔːrmjʊlə/", example: "Memorize the math formula.", exampleVi: "Hãy thuộc công thức toán.", level: "Trung cấp", topic: "Khoa học" },
  { en: "atmosphere", vi: "khí quyển", phonetic: "/ˈætməsfɪər/", example: "The atmosphere protects Earth.", exampleVi: "Khí quyển bảo vệ Trái Đất.", level: "Trung cấp", topic: "Khoa học" },
  { en: "organism", vi: "sinh vật, cơ thể sống", phonetic: "/ˈɔːrɡənɪzəm/", example: "Bacteria are tiny organisms.", exampleVi: "Vi khuẩn là những sinh vật nhỏ bé.", level: "Nâng cao", topic: "Khoa học" },
  { en: "communicate", vi: "giao tiếp", phonetic: "/kəˈmjuːnɪkeɪt/", example: "It's important to communicate clearly.", exampleVi: "Giao tiếp rõ ràng rất quan trọng.", level: "Trung cấp", topic: "Giao tiếp" },
  { en: "express", vi: "bày tỏ, diễn đạt", phonetic: "/ɪkˈsprɛs/", example: "Express your feelings calmly.", exampleVi: "Hãy bày tỏ cảm xúc một cách bình tĩnh.", level: "Cơ bản", topic: "Giao tiếp" },
  { en: "argue", vi: "tranh luận, cãi nhau", phonetic: "/ˈɑːrɡjuː/", example: "Don't argue in class.", exampleVi: "Đừng cãi nhau trong lớp.", level: "Cơ bản", topic: "Giao tiếp" },
  { en: "apologize", vi: "xin lỗi", phonetic: "/əˈpɒlədʒaɪz/", example: "You should apologize to her.", exampleVi: "Bạn nên xin lỗi cô ấy.", level: "Trung cấp", topic: "Giao tiếp" },
  { en: "persuade", vi: "thuyết phục", phonetic: "/pərˈsweɪd/", example: "He persuaded me to join.", exampleVi: "Anh ấy thuyết phục tôi tham gia.", level: "Trung cấp", topic: "Giao tiếp" },
  { en: "debate", vi: "tranh luận, thảo luận", phonetic: "/dɪˈbeɪt/", example: "We had a debate about climate.", exampleVi: "Chúng tôi thảo luận về khí hậu.", level: "Trung cấp", topic: "Giao tiếp" },
  { en: "negotiate", vi: "đàm phán, thương lượng", phonetic: "/nɪˈɡoʊʃieɪt/", example: "Learn to negotiate calmly.", exampleVi: "Hãy học cách thương lượng bình tĩnh.", level: "Nâng cao", topic: "Giao tiếp" },
  { en: "misunderstand", vi: "hiểu lầm", phonetic: "/ˌmɪsʌndəˈstænd/", example: "Don't misunderstand my words.", exampleVi: "Đừng hiểu lầm lời tôi nói.", level: "Trung cấp", topic: "Giao tiếp" },
  { en: "compliment", vi: "khen ngợi, lời khen", phonetic: "/ˈkɒmplɪmənt/", example: "She gave him a compliment.", exampleVi: "Cô ấy khen anh ấy.", level: "Trung cấp", topic: "Giao tiếp" },
  { en: "interrupt", vi: "ngắt lời, làm gián đoạn", phonetic: "/ˌɪntəˈrʌpt/", example: "Please don't interrupt me.", exampleVi: "Xin đừng ngắt lời tôi.", level: "Trung cấp", topic: "Giao tiếp" },
  { en: "nutrition", vi: "dinh dưỡng", phonetic: "/njuːˈtrɪʃən/", example: "Good nutrition helps you focus.", exampleVi: "Dinh dưỡng tốt giúp bạn tập trung.", level: "Trung cấp", topic: "Sức khỏe" },
  { en: "exercise", vi: "tập thể dục", phonetic: "/ˈɛksərsaɪz/", example: "Exercise improves your mood.", exampleVi: "Tập thể dục cải thiện tâm trạng.", level: "Cơ bản", topic: "Sức khỏe" },
  { en: "symptom", vi: "triệu chứng", phonetic: "/ˈsɪmptəm/", example: "What are your symptoms?", exampleVi: "Bạn có triệu chứng gì?", level: "Trung cấp", topic: "Sức khỏe" },
  { en: "immune", vi: "miễn dịch", phonetic: "/ɪˈmjuːn/", example: "A healthy diet boosts immunity.", exampleVi: "Chế độ ăn lành mạnh tăng cường miễn dịch.", level: "Nâng cao", topic: "Sức khỏe" },
  { en: "mental", vi: "tâm lý, tinh thần", phonetic: "/ˈmɛntəl/", example: "Mental health matters.", exampleVi: "Sức khỏe tâm thần rất quan trọng.", level: "Cơ bản", topic: "Sức khỏe" },
  { en: "fatigue", vi: "mệt mỏi, kiệt sức", phonetic: "/fəˈtiːɡ/", example: "She felt fatigue after studying.", exampleVi: "Cô ấy cảm thấy kiệt sức sau khi học.", level: "Nâng cao", topic: "Sức khỏe" },
  { en: "balance", vi: "cân bằng", phonetic: "/ˈbæləns/", example: "Find a balance between study and rest.", exampleVi: "Hãy tìm sự cân bằng giữa học và nghỉ ngơi.", level: "Cơ bản", topic: "Sức khỏe" },
  { en: "recover", vi: "hồi phục", phonetic: "/rɪˈkʌvər/", example: "It takes time to recover.", exampleVi: "Hồi phục cần có thời gian.", level: "Trung cấp", topic: "Sức khỏe" },
  { en: "stress", vi: "căng thẳng", phonetic: "/strɛs/", example: "Manage your stress well.", exampleVi: "Hãy quản lý căng thẳng tốt.", level: "Cơ bản", topic: "Sức khỏe" },
  { en: "breathe", vi: "hít thở", phonetic: "/briːð/", example: "Breathe deeply to calm down.", exampleVi: "Hít thở sâu để bình tĩnh lại.", level: "Cơ bản", topic: "Sức khỏe" },
  { en: "ambition", vi: "tham vọng, khát vọng", phonetic: "/æmˈbɪʃən/", example: "Her ambition is to become a doctor.", exampleVi: "Khát vọng của cô ấy là trở thành bác sĩ.", level: "Trung cấp", topic: "Nghề nghiệp" },
  { en: "opportunity", vi: "cơ hội", phonetic: "/ˌɒpəˈtjuːnɪti/", example: "Grab every opportunity.", exampleVi: "Hãy nắm bắt mọi cơ hội.", level: "Trung cấp", topic: "Nghề nghiệp" },
  { en: "career", vi: "sự nghiệp, nghề nghiệp", phonetic: "/kəˈrɪər/", example: "What is your career goal?", exampleVi: "Mục tiêu sự nghiệp của bạn là gì?", level: "Cơ bản", topic: "Nghề nghiệp" },
  { en: "scholarship", vi: "học bổng", phonetic: "/ˈskɒlərʃɪp/", example: "She won a scholarship.", exampleVi: "Cô ấy giành được học bổng.", level: "Trung cấp", topic: "Nghề nghiệp" },
  { en: "internship", vi: "thực tập", phonetic: "/ˈɪntɜːrnʃɪp/", example: "I got an internship this summer.", exampleVi: "Tôi có một kỳ thực tập mùa hè này.", level: "Trung cấp", topic: "Nghề nghiệp" },
  { en: "graduate", vi: "tốt nghiệp", phonetic: "/ˈɡrædʒueɪt/", example: "I will graduate next year.", exampleVi: "Tôi sẽ tốt nghiệp năm tới.", level: "Cơ bản", topic: "Nghề nghiệp" },
  { en: "skillful", vi: "lành nghề, thành thạo", phonetic: "/ˈskɪlfəl/", example: "He is very skillful.", exampleVi: "Anh ấy rất thành thạo.", level: "Trung cấp", topic: "Nghề nghiệp" },
  { en: "profession", vi: "nghề chuyên môn", phonetic: "/prəˈfɛʃən/", example: "Teaching is a noble profession.", exampleVi: "Dạy học là một nghề cao quý.", level: "Trung cấp", topic: "Nghề nghiệp" },
  { en: "accomplish", vi: "hoàn thành, đạt được", phonetic: "/əˈkʌmplɪʃ/", example: "She accomplished her goals.", exampleVi: "Cô ấy đã hoàn thành mục tiêu.", level: "Trung cấp", topic: "Nghề nghiệp" },
  { en: "dedication", vi: "sự cống hiến, tận tụy", phonetic: "/ˌdɛdɪˈkeɪʃən/", example: "Success needs dedication.", exampleVi: "Thành công cần sự tận tụy.", level: "Nâng cao", topic: "Nghề nghiệp" },
  { en: "routine", vi: "thói quen hàng ngày", phonetic: "/ruːˈtiːn/", example: "Build a good morning routine.", exampleVi: "Hãy xây dựng thói quen buổi sáng tốt.", level: "Trung cấp", topic: "Cuộc sống" },
  { en: "budget", vi: "ngân sách, tiết kiệm", phonetic: "/ˈbʌdʒɪt/", example: "Make a monthly budget.", exampleVi: "Lập ngân sách hàng tháng.", level: "Trung cấp", topic: "Cuộc sống" },
  { en: "responsible", vi: "có trách nhiệm", phonetic: "/rɪˈspɒnsɪbəl/", example: "Be responsible for your actions.", exampleVi: "Hãy có trách nhiệm với hành động của mình.", level: "Trung cấp", topic: "Cuộc sống" },
  { en: "independent", vi: "độc lập", phonetic: "/ˌɪndɪˈpɛndənt/", example: "She is very independent.", exampleVi: "Cô ấy rất độc lập.", level: "Trung cấp", topic: "Cuộc sống" },
  { en: "creative", vi: "sáng tạo", phonetic: "/kriˈeɪtɪv/", example: "Be creative in your approach.", exampleVi: "Hãy sáng tạo trong cách tiếp cận.", level: "Cơ bản", topic: "Cuộc sống" },
  { en: "volunteer", vi: "tình nguyện viên", phonetic: "/ˌvɒlənˈtɪər/", example: "She volunteers every weekend.", exampleVi: "Cô ấy tình nguyện mỗi cuối tuần.", level: "Trung cấp", topic: "Cuộc sống" },
  { en: "punctual", vi: "đúng giờ", phonetic: "/ˈpʌŋktʃuəl/", example: "Always be punctual.", exampleVi: "Hãy luôn đúng giờ.", level: "Trung cấp", topic: "Cuộc sống" },
  { en: "tidy", vi: "gọn gàng, ngăn nắp", phonetic: "/ˈtaɪdi/", example: "Keep your room tidy.", exampleVi: "Hãy giữ phòng gọn gàng.", level: "Cơ bản", topic: "Cuộc sống" },
  { en: "prioritize", vi: "ưu tiên", phonetic: "/praɪˈɒrɪtaɪz/", example: "Prioritize your tasks.", exampleVi: "Hãy ưu tiên công việc của bạn.", level: "Nâng cao", topic: "Cuộc sống" },
  { en: "persist", vi: "kiên trì", phonetic: "/pəˈsɪst/", example: "Persist even when it's hard.", exampleVi: "Hãy kiên trì dù lúc khó khăn.", level: "Trung cấp", topic: "Cuộc sống" },
  { en: "technology", vi: "công nghệ", phonetic: "/tɛkˈnɒlədʒi/", example: "Technology changes our lives.", exampleVi: "Công nghệ thay đổi cuộc sống chúng ta.", level: "Cơ bản", topic: "Công nghệ" },
  { en: "artificial", vi: "nhân tạo", phonetic: "/ˌɑːrtɪˈfɪʃəl/", example: "AI stands for artificial intelligence.", exampleVi: "AI là viết tắt của trí tuệ nhân tạo.", level: "Trung cấp", topic: "Công nghệ" },
  { en: "digital", vi: "kỹ thuật số", phonetic: "/ˈdɪdʒɪtəl/", example: "We live in a digital age.", exampleVi: "Chúng ta đang sống trong kỷ nguyên số.", level: "Cơ bản", topic: "Công nghệ" },
  { en: "software", vi: "phần mềm", phonetic: "/ˈsɒftweər/", example: "Install the software first.", exampleVi: "Hãy cài phần mềm trước.", level: "Cơ bản", topic: "Công nghệ" },
  { en: "network", vi: "mạng lưới, kết nối", phonetic: "/ˈnɛtwɜːrk/", example: "Build a strong network.", exampleVi: "Xây dựng mạng lưới quan hệ mạnh.", level: "Trung cấp", topic: "Công nghệ" },
  { en: "data", vi: "dữ liệu", phonetic: "/ˈdeɪtə/", example: "Data is very valuable.", exampleVi: "Dữ liệu rất có giá trị.", level: "Cơ bản", topic: "Công nghệ" },
  { en: "algorithm", vi: "thuật toán", phonetic: "/ˈælɡərɪðəm/", example: "Algorithms solve complex problems.", exampleVi: "Thuật toán giải quyết các bài toán phức tạp.", level: "Nâng cao", topic: "Công nghệ" },
  { en: "cyberbullying", vi: "bắt nạt trực tuyến", phonetic: "/ˈsaɪbəˌbʊliɪŋ/", example: "Cyberbullying is harmful.", exampleVi: "Bắt nạt trực tuyến rất có hại.", level: "Trung cấp", topic: "Công nghệ" },
  { en: "privacy", vi: "quyền riêng tư", phonetic: "/ˈprɪvəsi/", example: "Protect your online privacy.", exampleVi: "Hãy bảo vệ quyền riêng tư trực tuyến.", level: "Trung cấp", topic: "Công nghệ" },
  { en: "application", vi: "ứng dụng", phonetic: "/ˌæplɪˈkeɪʃən/", example: "Download the application.", exampleVi: "Hãy tải ứng dụng xuống.", level: "Cơ bản", topic: "Công nghệ" },

  // ── Tâm lý học ──
  { en: "psychology", vi: "tâm lý học", phonetic: "/saɪˈkɒlədʒi/", example: "Psychology helps us understand the mind.", exampleVi: "Tâm lý học giúp chúng ta hiểu về tâm trí.", level: "Trung cấp", topic: "Tâm lý học" },
  { en: "anxiety", vi: "lo âu", phonetic: "/æŋˈzaɪəti/", example: "Anxiety can affect your sleep.", exampleVi: "Lo âu có thể ảnh hưởng đến giấc ngủ.", level: "Trung cấp", topic: "Tâm lý học" },
  { en: "depression", vi: "trầm cảm", phonetic: "/dɪˈprɛʃən/", example: "Depression is a serious condition.", exampleVi: "Trầm cảm là một tình trạng nghiêm trọng.", level: "Trung cấp", topic: "Tâm lý học" },
  { en: "mindfulness", vi: "chánh niệm", phonetic: "/ˈmaɪndflnəs/", example: "Practice mindfulness every day.", exampleVi: "Thực hành chánh niệm mỗi ngày.", level: "Nâng cao", topic: "Tâm lý học" },
  { en: "therapy", vi: "liệu pháp, trị liệu", phonetic: "/ˈθɛrəpi/", example: "Therapy can help you heal.", exampleVi: "Liệu pháp có thể giúp bạn chữa lành.", level: "Trung cấp", topic: "Tâm lý học" },
  { en: "self-esteem", vi: "lòng tự trọng, tự tin", phonetic: "/ˌsɛlf ɪˈstiːm/", example: "Build your self-esteem daily.", exampleVi: "Xây dựng lòng tự trọng mỗi ngày.", level: "Trung cấp", topic: "Tâm lý học" },
  { en: "wellbeing", vi: "hạnh phúc, sức khỏe tinh thần", phonetic: "/ˈwɛlˌbiːɪŋ/", example: "Focus on your wellbeing.", exampleVi: "Tập trung vào sức khỏe tinh thần của bạn.", level: "Nâng cao", topic: "Tâm lý học" },
  { en: "coping", vi: "ứng phó, đối phó", phonetic: "/ˈkoʊpɪŋ/", example: "Learn healthy coping skills.", exampleVi: "Học kỹ năng ứng phó lành mạnh.", level: "Trung cấp", topic: "Tâm lý học" },
  { en: "empathy", vi: "đồng cảm", phonetic: "/ˈɛmpəθi/", example: "Empathy helps us connect with others.", exampleVi: "Đồng cảm giúp chúng ta kết nối với người khác.", level: "Trung cấp", topic: "Tâm lý học" },
  { en: "trauma", vi: "chấn thương tâm lý", phonetic: "/ˈtrɔːmə/", example: "It takes time to heal from trauma.", exampleVi: "Chữa lành chấn thương tâm lý cần có thời gian.", level: "Nâng cao", topic: "Tâm lý học" },

  // ── Bạn bè ──
  { en: "friendship", vi: "tình bạn", phonetic: "/ˈfrɛndʃɪp/", example: "True friendship is precious.", exampleVi: "Tình bạn thật sự rất quý giá.", level: "Cơ bản", topic: "Bạn bè" },
  { en: "trust", vi: "tin tưởng", phonetic: "/trʌst/", example: "Trust is the foundation of friendship.", exampleVi: "Tin tưởng là nền tảng của tình bạn.", level: "Cơ bản", topic: "Bạn bè" },
  { en: "loyal", vi: "trung thành", phonetic: "/ˈlɔɪəl/", example: "Be loyal to your friends.", exampleVi: "Hãy trung thành với bạn bè.", level: "Trung cấp", topic: "Bạn bè" },
  { en: "support", vi: "hỗ trợ, ủng hộ", phonetic: "/səˈpɔːrt/", example: "Support each other in hard times.", exampleVi: "Hãy hỗ trợ nhau trong những lúc khó khăn.", level: "Cơ bản", topic: "Bạn bè" },
  { en: "conflict", vi: "xung đột, mâu thuẫn", phonetic: "/ˈkɒnflɪkt/", example: "Resolve conflicts calmly.", exampleVi: "Hãy giải quyết xung đột một cách bình tĩnh.", level: "Trung cấp", topic: "Bạn bè" },
  { en: "bond", vi: "gắn kết, sợi dây kết nối", phonetic: "/bɒnd/", example: "Their bond grew stronger over time.", exampleVi: "Sự gắn kết của họ ngày càng mạnh hơn theo thời gian.", level: "Trung cấp", topic: "Bạn bè" },
  { en: "peer", vi: "bạn đồng trang lứa", phonetic: "/pɪər/", example: "Peer support is very helpful.", exampleVi: "Sự hỗ trợ từ bạn đồng trang lứa rất có ích.", level: "Trung cấp", topic: "Bạn bè" },
  { en: "reconcile", vi: "hòa giải", phonetic: "/ˈrɛkənsaɪl/", example: "Try to reconcile after a fight.", exampleVi: "Hãy cố hòa giải sau khi mâu thuẫn.", level: "Nâng cao", topic: "Bạn bè" },
  { en: "teammate", vi: "đồng đội", phonetic: "/ˈtiːmmeɪt/", example: "Work well with your teammates.", exampleVi: "Hãy làm việc tốt với đồng đội của mình.", level: "Cơ bản", topic: "Bạn bè" },
  { en: "inclusive", vi: "bao dung, hòa nhập", phonetic: "/ɪnˈkluːsɪv/", example: "Be inclusive to everyone around you.", exampleVi: "Hãy bao dung với tất cả mọi người xung quanh.", level: "Nâng cao", topic: "Bạn bè" },

  // ── Môi trường ──
  { en: "environment", vi: "môi trường", phonetic: "/ɪnˈvaɪrənmənt/", example: "We must protect the environment.", exampleVi: "Chúng ta phải bảo vệ môi trường.", level: "Cơ bản", topic: "Môi trường" },
  { en: "pollution", vi: "ô nhiễm", phonetic: "/pəˈluːʃən/", example: "Air pollution is harmful to health.", exampleVi: "Ô nhiễm không khí rất có hại cho sức khỏe.", level: "Cơ bản", topic: "Môi trường" },
  { en: "sustainable", vi: "bền vững", phonetic: "/səˈsteɪnəbəl/", example: "Choose a sustainable lifestyle.", exampleVi: "Hãy chọn lối sống bền vững.", level: "Trung cấp", topic: "Môi trường" },
  { en: "recycle", vi: "tái chế", phonetic: "/ˌriːˈsaɪkəl/", example: "Recycle your plastic bottles.", exampleVi: "Hãy tái chế chai nhựa của bạn.", level: "Cơ bản", topic: "Môi trường" },
  { en: "climate", vi: "khí hậu", phonetic: "/ˈklaɪmɪt/", example: "Climate change affects us all.", exampleVi: "Biến đổi khí hậu ảnh hưởng đến tất cả chúng ta.", level: "Cơ bản", topic: "Môi trường" },
  { en: "conservation", vi: "bảo tồn", phonetic: "/ˌkɒnsəˈveɪʃən/", example: "Wildlife conservation is important.", exampleVi: "Bảo tồn động vật hoang dã rất quan trọng.", level: "Trung cấp", topic: "Môi trường" },
  { en: "emission", vi: "khí thải", phonetic: "/ɪˈmɪʃən/", example: "We must reduce carbon emissions.", exampleVi: "Chúng ta phải giảm khí thải carbon.", level: "Trung cấp", topic: "Môi trường" },
  { en: "renewable", vi: "tái tạo", phonetic: "/rɪˈnjuːəbəl/", example: "Solar power is a renewable resource.", exampleVi: "Năng lượng mặt trời là nguồn tài nguyên tái tạo.", level: "Trung cấp", topic: "Môi trường" },
  { en: "ecosystem", vi: "hệ sinh thái", phonetic: "/ˈiːkoʊˌsɪstəm/", example: "Ecosystems need our protection.", exampleVi: "Hệ sinh thái cần sự bảo vệ của chúng ta.", level: "Trung cấp", topic: "Môi trường" },
  { en: "biodiversity", vi: "đa dạng sinh học", phonetic: "/ˌbaɪoʊdaɪˈvɜːrsɪti/", example: "Biodiversity is essential for life.", exampleVi: "Đa dạng sinh học rất thiết yếu cho sự sống.", level: "Nâng cao", topic: "Môi trường" },

  // ── Nghệ thuật ──
  { en: "creativity", vi: "sự sáng tạo", phonetic: "/ˌkriːeɪˈtɪvɪti/", example: "Creativity has no limits.", exampleVi: "Sự sáng tạo không có giới hạn.", level: "Trung cấp", topic: "Nghệ thuật" },
  { en: "inspire", vi: "truyền cảm hứng", phonetic: "/ɪnˈspaɪər/", example: "Music can inspire everyone.", exampleVi: "Âm nhạc có thể truyền cảm hứng cho mọi người.", level: "Trung cấp", topic: "Nghệ thuật" },
  { en: "melody", vi: "giai điệu", phonetic: "/ˈmɛlədi/", example: "I love the melody of this song.", exampleVi: "Tôi thích giai điệu của bài hát này.", level: "Cơ bản", topic: "Nghệ thuật" },
  { en: "rhythm", vi: "nhịp điệu", phonetic: "/ˈrɪðəm/", example: "Feel the rhythm of the music.", exampleVi: "Hãy cảm nhận nhịp điệu của âm nhạc.", level: "Cơ bản", topic: "Nghệ thuật" },
  { en: "performance", vi: "màn trình diễn", phonetic: "/pərˈfɔːrməns/", example: "Her performance was amazing.", exampleVi: "Màn trình diễn của cô ấy thật tuyệt vời.", level: "Trung cấp", topic: "Nghệ thuật" },
  { en: "passion", vi: "đam mê", phonetic: "/ˈpæʃən/", example: "Follow your passion every day.", exampleVi: "Hãy theo đuổi đam mê của bạn mỗi ngày.", level: "Cơ bản", topic: "Nghệ thuật" },
  { en: "talent", vi: "tài năng", phonetic: "/ˈtælənt/", example: "Everyone has a unique talent.", exampleVi: "Mỗi người đều có tài năng riêng của mình.", level: "Cơ bản", topic: "Nghệ thuật" },
  { en: "appreciate", vi: "trân trọng, đánh giá cao", phonetic: "/əˈpriːʃieɪt/", example: "Appreciate the beauty around you.", exampleVi: "Hãy trân trọng vẻ đẹp xung quanh bạn.", level: "Trung cấp", topic: "Nghệ thuật" },
  { en: "exhibition", vi: "triển lãm", phonetic: "/ˌɛksɪˈbɪʃən/", example: "We visited an art exhibition.", exampleVi: "Chúng tôi tham quan một triển lãm nghệ thuật.", level: "Trung cấp", topic: "Nghệ thuật" },
  { en: "compose", vi: "sáng tác", phonetic: "/kəmˈpoʊz/", example: "She composed a beautiful song.", exampleVi: "Cô ấy sáng tác một bài hát rất đẹp.", level: "Trung cấp", topic: "Nghệ thuật" },

  // ── Xã hội ──
  { en: "community", vi: "cộng đồng", phonetic: "/kəˈmjuːnɪti/", example: "Help your local community.", exampleVi: "Hãy giúp đỡ cộng đồng địa phương của bạn.", level: "Cơ bản", topic: "Xã hội" },
  { en: "equality", vi: "bình đẳng", phonetic: "/ɪˈkwɒlɪti/", example: "Equality matters for everyone.", exampleVi: "Bình đẳng quan trọng với tất cả mọi người.", level: "Trung cấp", topic: "Xã hội" },
  { en: "diversity", vi: "sự đa dạng", phonetic: "/daɪˈvɜːrsɪti/", example: "Embrace diversity around you.", exampleVi: "Hãy chào đón sự đa dạng xung quanh bạn.", level: "Trung cấp", topic: "Xã hội" },
  { en: "justice", vi: "công lý, công bằng", phonetic: "/ˈdʒʌstɪs/", example: "Speak up for justice.", exampleVi: "Hãy lên tiếng vì công lý.", level: "Trung cấp", topic: "Xã hội" },
  { en: "citizenship", vi: "quyền công dân", phonetic: "/ˈsɪtɪzənʃɪp/", example: "Be a responsible citizen.", exampleVi: "Hãy là một công dân có trách nhiệm.", level: "Trung cấp", topic: "Xã hội" },
  { en: "solidarity", vi: "đoàn kết", phonetic: "/ˌsɒlɪˈdærɪti/", example: "Solidarity makes us stronger.", exampleVi: "Đoàn kết làm chúng ta mạnh mẽ hơn.", level: "Nâng cao", topic: "Xã hội" },
  { en: "awareness", vi: "nhận thức", phonetic: "/əˈweənəs/", example: "Raise awareness about mental health.", exampleVi: "Nâng cao nhận thức về sức khỏe tâm thần.", level: "Trung cấp", topic: "Xã hội" },
  { en: "contribute", vi: "đóng góp", phonetic: "/kənˈtrɪbjuːt/", example: "Contribute positively to your school.", exampleVi: "Hãy đóng góp tích cực cho trường của bạn.", level: "Trung cấp", topic: "Xã hội" },
  { en: "influence", vi: "ảnh hưởng", phonetic: "/ˈɪnfluəns/", example: "Be a positive influence on others.", exampleVi: "Hãy là người có ảnh hưởng tích cực đến người khác.", level: "Trung cấp", topic: "Xã hội" },
  { en: "empowerment", vi: "trao quyền, tự chủ", phonetic: "/ɪmˈpaʊərmənt/", example: "Education leads to empowerment.", exampleVi: "Giáo dục dẫn đến sự tự chủ.", level: "Nâng cao", topic: "Xã hội" },
];

const LEVELS = ["Tất cả", "Cơ bản", "Trung cấp", "Nâng cao"] as const;
const TOPICS = ["Tất cả", "Học đường", "Cảm xúc", "Khoa học", "Giao tiếp", "Sức khỏe", "Nghề nghiệp", "Cuộc sống", "Công nghệ", "Tâm lý học", "Bạn bè", "Môi trường", "Nghệ thuật", "Xã hội"] as const;
const QUIZ_SIZE = 10;

const levelColors: Record<string, string> = {
  "Cơ bản": "bg-green-100 text-green-700 border-green-200",
  "Trung cấp": "bg-blue-100 text-blue-700 border-blue-200",
  "Nâng cao": "bg-purple-100 text-purple-700 border-purple-200",
};

const rankInfo = (pct: number) => {
  if (pct >= 90) return { label: "Xuất sắc! 🏆", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" };
  if (pct >= 70) return { label: "Tốt lắm! 🎉", color: "text-green-600", bg: "bg-green-50 border-green-200" };
  if (pct >= 50) return { label: "Khá ổn 👍", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" };
  return { label: "Cần ôn thêm 📚", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" };
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function speak(text: string) {
  if ("speechSynthesis" in window) {
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "en-US";
    utt.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
  }
}

function getOptions(correct: Word, allWords: Word[]): string[] {
  const pool = allWords.filter((w) => w.en !== correct.en);
  const distractors = shuffle(pool).slice(0, 3).map((w) => w.vi);
  return shuffle([correct.vi, ...distractors]);
}

interface QuizQuestion {
  word: Word;
  options: string[];
}

type QuizMode = "en_to_vi" | "vi_to_en";

// ─── QUIZ VIEW ────────────────────────────────────────────────
function QuizView({ quizWords, onExit }: { quizWords: Word[]; onExit: () => void }) {
  const [mode] = useState<QuizMode>("en_to_vi");
  const [questions] = useState<QuizQuestion[]>(() =>
    quizWords.map((w) => ({ word: w, options: getOptions(w, words) }))
  );
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [wrongs, setWrongs] = useState<Word[]>([]);
  const [done, setDone] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const q = questions[current];
  const correct = mode === "en_to_vi" ? q.word.vi : q.word.en;
  const isCorrect = selected === correct;

  const handleSelect = useCallback(
    (opt: string) => {
      if (selected !== null) return;
      setSelected(opt);
      setShowResult(true);
      if (opt === correct) {
        setScore((s) => s + 1);
        speak(q.word.en);
      } else {
        setWrongs((w) => [...w, q.word]);
      }
    },
    [selected, correct, q]
  );

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const pct = Math.round((score / questions.length) * 100);
  const rank = rankInfo(pct);

  if (done) {
    return (
      <div className="max-w-lg mx-auto animate-in fade-in zoom-in duration-300">
        <div className={`rounded-3xl border-2 p-8 text-center ${rank.bg}`}>
          <Trophy className={`w-16 h-16 mx-auto mb-4 ${rank.color}`} />
          <h2 className={`text-3xl font-bold mb-1 ${rank.color}`}>{rank.label}</h2>
          <p className="text-muted-foreground mb-2">Kết quả của bạn</p>
          <div className="text-6xl font-black text-foreground mb-1">
            {score}<span className="text-3xl text-muted-foreground">/{questions.length}</span>
          </div>
          <div className="text-2xl font-semibold text-primary mb-6">{pct}%</div>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-3 mb-6 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>

          {wrongs.length > 0 && (
            <div className="text-left bg-white/60 rounded-2xl p-4 mb-6">
              <p className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" /> Từ cần ôn lại ({wrongs.length})
              </p>
              <div className="space-y-2">
                {wrongs.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-primary w-28 shrink-0">{w.en}</span>
                    <span className="text-muted-foreground">→ {w.vi}</span>
                    <button
                      onClick={() => speak(w.en)}
                      className="ml-auto p-1 rounded-full hover:bg-primary/10 text-primary"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={onExit} className="rounded-full gap-2">
              <Home className="w-4 h-4" /> Về từ điển
            </Button>
            <Button onClick={() => window.location.reload()} className="rounded-full gap-2">
              <RotateCcw className="w-4 h-4" /> Làm lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto animate-in fade-in duration-200">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Câu {current + 1} / {questions.length}</span>
          <span className="font-medium text-primary">{score} đúng</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((current) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm mb-4 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          {mode === "en_to_vi" ? "Nghĩa tiếng Việt của từ này là gì?" : "Từ tiếng Anh tương ứng là gì?"}
        </p>
        <div className="flex items-center justify-center gap-3 mb-2">
          <h2 className="text-4xl font-bold text-primary">
            {mode === "en_to_vi" ? q.word.en : q.word.vi}
          </h2>
          {mode === "en_to_vi" && (
            <button
              onClick={() => speak(q.word.en)}
              className="p-2 rounded-full hover:bg-primary/10 text-primary/70 hover:text-primary transition-colors"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          )}
        </div>
        {mode === "en_to_vi" && (
          <p className="text-sm text-muted-foreground">{q.word.phonetic}</p>
        )}
        {showResult && (
          <div className={`mt-4 p-3 rounded-xl text-sm animate-in fade-in duration-200 ${isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {isCorrect ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Chính xác! "{q.word.example}"
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> Đáp án đúng: <strong>{correct}</strong>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {q.options.map((opt, i) => {
          let style = "border-border/50 bg-card hover:bg-primary/5 hover:border-primary/40 cursor-pointer";
          if (selected !== null) {
            if (opt === correct) style = "border-green-400 bg-green-50 text-green-700";
            else if (opt === selected && opt !== correct) style = "border-red-400 bg-red-50 text-red-700";
            else style = "border-border/30 bg-muted/30 opacity-60";
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              className={`w-full text-left px-5 py-3 rounded-2xl border-2 transition-all duration-150 text-sm font-medium ${style}`}
            >
              <span className="mr-3 text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <Button onClick={handleNext} className="w-full rounded-2xl h-12 gap-2 animate-in fade-in">
          {current + 1 >= questions.length ? "Xem kết quả" : "Câu tiếp theo"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────
type ViewMode = "dictionary" | "quiz_setup" | "quiz";

export default function VocabularyPage() {
  const [view, setView] = useState<ViewMode>("dictionary");
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<string>("Tất cả");
  const [topic, setTopic] = useState<string>("Tất cả");
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [quizLevel, setQuizLevel] = useState<string>("Tất cả");
  const [quizTopic, setQuizTopic] = useState<string>("Tất cả");
  const [quizWords, setQuizWords] = useState<Word[]>([]);

  const filtered = useMemo(() => {
    return words.filter((w) => {
      const q = search.toLowerCase();
      const matchSearch = !q || w.en.toLowerCase().includes(q) || w.vi.toLowerCase().includes(q);
      const matchLevel = level === "Tất cả" || w.level === level;
      const matchTopic = topic === "Tất cả" || w.topic === topic;
      return matchSearch && matchLevel && matchTopic;
    });
  }, [search, level, topic]);

  const quizPool = useMemo(() => {
    return words.filter((w) => {
      const ml = quizLevel === "Tất cả" || w.level === quizLevel;
      const mt = quizTopic === "Tất cả" || w.topic === quizTopic;
      return ml && mt;
    });
  }, [quizLevel, quizTopic]);

  const startQuiz = () => {
    const pool = shuffle(quizPool).slice(0, QUIZ_SIZE);
    setQuizWords(pool);
    setView("quiz");
  };

  const toggleFlip = (i: number) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  if (view === "quiz") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold font-serif text-foreground flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" /> Trắc nghiệm từ vựng
          </h1>
          <Button variant="ghost" size="sm" onClick={() => setView("dictionary")} className="gap-2 text-muted-foreground">
            <Home className="w-4 h-4" /> Từ điển
          </Button>
        </div>
        <QuizView quizWords={quizWords} onExit={() => setView("dictionary")} />
      </div>
    );
  }

  if (view === "quiz_setup") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold font-serif text-foreground flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" /> Cài đặt trắc nghiệm
          </h1>
          <Button variant="ghost" size="sm" onClick={() => setView("dictionary")} className="text-muted-foreground">
            ← Quay lại
          </Button>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <p className="font-semibold text-sm mb-3">Cấp độ</p>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <Button
                  key={l}
                  variant={quizLevel === l ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setQuizLevel(l)}
                >
                  {l}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold text-sm mb-3">Chủ đề</p>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <Button
                  key={t}
                  variant={quizTopic === t ? "default" : "outline"}
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setQuizTopic(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-muted/40 rounded-2xl p-4 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{Math.min(quizPool.length, QUIZ_SIZE)}</span> câu hỏi
            {" "}từ <span className="font-semibold text-foreground">{quizPool.length}</span> từ phù hợp bộ lọc
          </div>

          <Button
            className="w-full h-12 rounded-2xl text-base gap-2"
            disabled={quizPool.length < 4}
            onClick={startQuiz}
          >
            <Brain className="w-5 h-5" />
            Bắt đầu trắc nghiệm
          </Button>
          {quizPool.length < 4 && (
            <p className="text-xs text-red-500 text-center">Cần ít nhất 4 từ để bắt đầu. Hãy chọn bộ lọc rộng hơn.</p>
          )}
        </div>
      </div>
    );
  }

  // ─── DICTIONARY VIEW ───────────────────────────────────────
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
          <BookOpen className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-bold font-serif text-foreground mb-2">Từ Điển Tiếng Anh</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {words.length} từ vựng quan trọng cho học sinh — bấm vào thẻ để lật và nghe phát âm
        </p>
        <Button
          onClick={() => setView("quiz_setup")}
          className="mt-5 rounded-full gap-2 shadow-md px-6"
        >
          <Brain className="w-4 h-4" /> Kiểm tra từ vựng
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border/50 rounded-2xl p-4 mb-8 space-y-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm từ tiếng Anh hoặc nghĩa tiếng Việt..."
            className="pl-10 rounded-xl border-border/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <Button key={l} variant={level === l ? "default" : "outline"} size="sm" className="rounded-full" onClick={() => setLevel(l)}>
              {l}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <Button key={t} variant={topic === t ? "default" : "ghost"} size="sm" className="rounded-full text-xs" onClick={() => setTopic(t)}>
              {t}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Hiển thị <span className="font-semibold text-foreground">{filtered.length}</span> / {words.length} từ
        </p>
      </div>

      {/* Word Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Không tìm thấy từ nào. Hãy thử từ khóa khác.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((word, i) => {
            const isFlipped = flipped.has(i);
            return (
              <div key={i} className="cursor-pointer" style={{ perspective: "1000px" }} onClick={() => toggleFlip(i)}>
                <div
                  className="relative w-full transition-transform duration-500"
                  style={{ transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)", minHeight: "160px" }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 bg-card border border-border/50 rounded-2xl p-5 shadow-sm flex flex-col justify-between" style={{ backfaceVisibility: "hidden" }}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-primary">{word.en}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{word.phonetic}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); speak(word.en); }}
                        className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors flex-shrink-0"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mt-3">
                      <Badge variant="outline" className={`text-xs ${levelColors[word.level]}`}>{word.level}</Badge>
                      <Badge variant="secondary" className="text-xs">{word.topic}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Bấm để xem nghĩa</p>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 bg-primary/5 border border-primary/20 rounded-2xl p-5 shadow-sm flex flex-col justify-between" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    <div>
                      <p className="text-lg font-semibold text-foreground">{word.vi}</p>
                      <p className="text-xs text-muted-foreground mt-1 italic">"{word.example}"</p>
                      <p className="text-xs text-primary mt-1">→ {word.exampleVi}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className={`text-xs ${levelColors[word.level]}`}>{word.level}</Badge>
                        <Badge variant="secondary" className="text-xs">{word.topic}</Badge>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); speak(word.example); }}
                        className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tip */}
      <div className="mt-10 bg-primary/5 border border-primary/20 rounded-2xl p-5 flex gap-3">
        <Star className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-foreground text-sm">Mẹo học từ vựng hiệu quả</p>
          <p className="text-sm text-muted-foreground mt-1">
            Học 5–10 từ mỗi ngày thay vì nhồi nhét. Dùng kỹ thuật <strong>Spaced Repetition</strong>: ôn lại sau 1 ngày, 3 ngày, 1 tuần, 1 tháng. Bấm nút 🔊 để nghe phát âm, sau đó bấm <strong>Kiểm tra từ vựng</strong> để luyện tập.
          </p>
        </div>
      </div>
    </div>
  );
}
