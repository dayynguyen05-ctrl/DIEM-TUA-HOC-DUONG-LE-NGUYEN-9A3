export type ChatCategory =
  | "hoc_tap"
  | "phuong_phap_hoc"
  | "dong_luc"
  | "tam_ly"
  | "lo_au"
  | "tu_tin"
  | "cam_xuc"
  | "quan_he"
  | "tinh_yeu"
  | "mang_xa_hoi"
  | "suc_khoe"
  | "giac_ngu"
  | "an_uong"
  | "van_dong"
  | "gia_dinh"
  | "tuong_lai"
  | "tien_bac"
  | "giai_tri"
  | "khan_cap"
  | "chao_hoi"
  | "cam_on"
  | "gioi_thieu"
  | "khac";

interface BotResponse {
  text: string;
  suggestedReplies: string[];
  category: ChatCategory;
}

interface Rule {
  keywords: string[];
  category: ChatCategory;
  responses: string[];
  suggestedReplies: string[];
}

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ");

const rules: Rule[] = [
  // ===== CHÀO HỎI =====
  {
    keywords: ["chao", "hello", "hi", "xin chao", "hey", "alo", "bat dau", "gioi thieu", "ban la ai", "diem tua la gi"],
    category: "chao_hoi",
    responses: [
      "Xin chào! Mình là Điểm Tựa, người bạn đồng hành của bạn tại Điểm Tựa Học Đường. Mình sẵn sàng lắng nghe và hỗ trợ bạn về học tập, cảm xúc, đời sống học đường và nhiều hơn thế. Hôm nay bạn muốn chia sẻ điều gì?",
      "Chào bạn! Mình là Điểm Tựa — một người bạn không phán xét, luôn ở đây để lắng nghe. Bạn đang cảm thấy thế nào hôm nay?",
      "Xin chào! Rất vui được gặp bạn. Mình có thể giúp bạn về học tập, quản lý cảm xúc, các vấn đề đời sống hay bất kỳ điều gì bạn muốn chia sẻ. Bạn cần gì nhé?",
    ],
    suggestedReplies: [
      "Mình đang gặp khó khăn trong học tập",
      "Mình đang cảm thấy căng thẳng",
      "Mình muốn hỏi về đời sống",
      "Điểm Tựa có thể giúp gì cho mình?",
    ],
  },

  // ===== GIỚI THIỆU ĐIỂM TỰA =====
  {
    keywords: ["ban co the giup gi", "diem tua co the", "biet gi", "hieu gi", "ho tro gi", "lam duoc gi"],
    category: "gioi_thieu",
    responses: [
      "Mình có thể giúp bạn về: học tập (phương pháp học, ôn thi, mất động lực), cảm xúc (stress, lo âu, buồn, tức giận), các mối quan hệ (bạn bè, gia đình, tình yêu), đời sống (giấc ngủ, ăn uống, sức khỏe, tiền bạc, mạng xã hội), và định hướng tương lai. Bạn muốn bắt đầu từ đâu?",
      "Mình là Điểm Tựa — chatbot hỗ trợ tâm lý và đời sống học đường. Mình có thể trò chuyện về: áp lực học tập, cảm xúc khó xử, chuyện bạn bè và gia đình, tình yêu học trò, sức khỏe, và định hướng tương lai. Bạn đang cần hỗ trợ về điều gì?",
    ],
    suggestedReplies: [
      "Giúp mình về học tập",
      "Mình muốn nói về cảm xúc",
      "Mình có vấn đề với bạn bè",
      "Mình cần lời khuyên về đời sống",
    ],
  },

  // ===== CẢM ƠN / KHEN =====
  {
    keywords: ["cam on", "thank", "thanks", "hay qua", "tot qua", "giup ich", "co ich", "hay that", "tuyet voi", "biet on"],
    category: "cam_on",
    responses: [
      "Cảm ơn bạn đã chia sẻ! Mình rất vui nếu những điều mình nói có ích cho bạn. Bạn còn muốn hỏi hay chia sẻ điều gì nữa không?",
      "Mình rất vui khi có thể giúp được bạn! Nhớ rằng Điểm Tựa luôn ở đây bất cứ khi nào bạn cần. Bạn muốn nói về điều gì tiếp theo không?",
      "Thật vui khi điều đó có ích cho bạn! Đừng ngại quay lại chia sẻ với mình bất cứ lúc nào nhé.",
    ],
    suggestedReplies: [
      "Mình còn câu hỏi khác",
      "Mình muốn hỏi về học tập",
      "Mình muốn nói về cảm xúc",
    ],
  },

  // ===== HỌC TẬP - CHUNG =====
  {
    keywords: [
      "hoc", "bai tap", "thi", "on thi", "thi cuoi ky", "hoc ky", "diem so", "ket qua hoc tap",
      "hoc yeu", "hoc kem", "hoc gioi", "diem thap", "bi truot", "rot mon", "diem thi",
      "khong hieu bai", "kho hieu", "hoc mai khong vao",
    ],
    category: "hoc_tap",
    responses: [
      "Học tập là chủ đề mình rất muốn hỗ trợ bạn! Bạn đang gặp khó khăn cụ thể gì — không hiểu bài, thiếu thời gian, hay mất động lực?",
      "Mình hiểu áp lực học hành có thể rất lớn. Bạn đang lo về môn gì hoặc vấn đề gì cụ thể? Kể mình nghe nhé.",
      "Học tập không dễ, đặc biệt khi có quá nhiều thứ cùng một lúc. Bạn đang gặp khó khăn ở điểm nào — kiến thức, phương pháp, hay tâm lý?",
    ],
    suggestedReplies: [
      "Mình không hiểu bài",
      "Mình không có động lực học",
      "Bí quyết học hiệu quả là gì?",
      "Làm sao để ôn thi tốt?",
    ],
  },

  // ===== PHƯƠNG PHÁP HỌC =====
  {
    keywords: [
      "phuong phap hoc", "hoc the nao", "lam sao hoc tot", "bi quyet hoc", "hoc hieu qua",
      "nho bai", "ghi nho", "on bai", "hoc thuoc", "tip hoc", "meo hoc",
      "pomodoro", "so do tu duy", "flashcard", "active recall",
    ],
    category: "phuong_phap_hoc",
    responses: [
      "Đây là một số phương pháp học hiệu quả nhất:\n\n• **Pomodoro**: Học 25 phút, nghỉ 5 phút — giữ tập trung liên tục\n• **Active Recall**: Đóng sách, tự nhớ lại kiến thức — hiệu quả hơn đọc lại 3 lần\n• **Spaced Repetition**: Ôn lại sau 1 ngày, 3 ngày, 1 tuần — não ghi nhớ lâu hơn\n• **Feynman**: Giải thích khái niệm như đang dạy người khác — phát hiện chỗ chưa hiểu\n• **Sơ đồ tư duy**: Vẽ sơ đồ kết nối ý chính — tổng hợp kiến thức nhanh hơn\n\nBạn muốn thử cái nào trước?",
      "Bí quyết học hiệu quả không phải học nhiều giờ hơn, mà học đúng cách:\n\n1. **Không highlight mà tự hỏi**: Sau mỗi đoạn đọc, tự đặt câu hỏi và trả lời\n2. **Chia nhỏ mục tiêu**: Thay vì 'học chương 5', hãy 'học 3 khái niệm đầu'\n3. **Ngủ đủ giấc**: Não củng cố ký ức khi ngủ — thức khuya học nhồi nhét phản tác dụng\n4. **Dạy lại cho người khác** hoặc tự giải thích to — nếu giải thích không được là chưa thực sự hiểu\n\nBạn hay gặp khó khăn gì nhất khi học?",
    ],
    suggestedReplies: [
      "Giải thích thêm về Pomodoro",
      "Làm sao để nhớ bài lâu hơn?",
      "Mình hay quên bài sau khi học",
      "Mình học được nhưng vào thi lại quên",
    ],
  },

  // ===== THIẾU ĐỘNG LỰC =====
  {
    keywords: [
      "luoi", "khong muon hoc", "chan hoc", "mat dong luc", "khong co dong luc",
      "hoc ma khong thay y nghia", "bo cuoc", "khong thich hoc", "mu nao",
      "procrastinate", "tri hoan", "de sau", "lam sau",
    ],
    category: "dong_luc",
    responses: [
      "Mất động lực học là điều rất phổ biến, đặc biệt khi áp lực nhiều hoặc chưa thấy mục tiêu rõ ràng. Hãy thử:\n\n• **Quy tắc 2 phút**: Bắt đầu chỉ với 2 phút — khi đã ngồi vào bàn, thường bạn sẽ học tiếp\n• **Gắn phần thưởng nhỏ**: Học xong bài → được xem video yêu thích 10 phút\n• **Làm rõ mục tiêu**: Việc học này giúp ích gì cho bạn trong tương lai?\n• **Thay đổi môi trường**: Ra quán cà phê, thư viện thay vì phòng ngủ\n\nBạn đang học cho môn hay mục tiêu nào?",
      "Không có động lực không có nghĩa là bạn lười — đôi khi đó là dấu hiệu của kiệt sức hoặc chưa thấy ý nghĩa. Câu hỏi mình hay gợi ý: **'Tại sao mình cần học điều này?'** — khi có câu trả lời thực sự, động lực tự nhiên sẽ đến. Bạn đang học vì điều gì?",
      "Cảm giác không muốn học thường đến từ sợ hãi (sợ làm sai, sợ không đủ giỏi) hoặc quá tải (quá nhiều thứ cùng lúc). Bạn đang cảm thấy theo hướng nào?",
    ],
    suggestedReplies: [
      "Mình sợ thất bại nên không muốn bắt đầu",
      "Mình không thấy việc học có ý nghĩa gì",
      "Mình có quá nhiều thứ phải làm",
      "Làm sao để xây dựng thói quen học?",
    ],
  },

  // ===== THÓI QUEN HỌC / QUẢN LÝ THỜI GIAN =====
  {
    keywords: [
      "quan ly thoi gian", "thoi gian bieu", "lich hoc", "khong du thoi gian",
      "vua hoc vua lam", "qua nhieu viec", "sap xep cong viec", "to do list",
      "habit", "thoi quen", "ke hoach hoc tap",
    ],
    category: "phuong_phap_hoc",
    responses: [
      "Quản lý thời gian tốt thay đổi hoàn toàn việc học! Mình gợi ý:\n\n1. **Time blocking**: Đặt khung giờ cố định cho từng hoạt động — không để thời gian 'trôi nổi'\n2. **Quy tắc 1-3-5**: Mỗi ngày hoàn thành 1 việc lớn, 3 việc vừa, 5 việc nhỏ\n3. **Học cùng giờ mỗi ngày**: Não quen với nhịp sinh học, vào trạng thái học nhanh hơn\n4. **Đặt deadline sớm hơn thực tế**: Nếu hạn nộp thứ 6, đặt mục tiêu xong thứ 4\n\nBạn hiện đang vật lộn với phần nào của thời gian?",
      "Cảm giác 'không đủ thời gian' thường đến từ quá nhiều thứ không ưu tiên rõ. Thử hỏi bản thân: **Nếu chỉ hoàn thành được 3 việc hôm nay, đó là 3 việc gì?** — Tập trung vào đó trước, phần còn lại là thêm. Bạn thử áp dụng chưa?",
    ],
    suggestedReplies: [
      "Mình vừa học vừa làm thêm, rất khó cân bằng",
      "Mình hay bị xao nhãng khi học",
      "Làm sao để không bị điện thoại làm phiền?",
      "Mình muốn xây dựng thói quen học đều đặn",
    ],
  },

  // ===== MẤT TẬP TRUNG / ĐIỆN THOẠI =====
  {
    keywords: [
      "mat tap trung", "khong tap trung", "bi xao nhang", "dien thoai", "mang xa hoi khi hoc",
      "nghien dien thoai", "nghien tiktok", "scroll", "lướt điện thoại",
      "facebook", "instagram", "youtube khi hoc",
    ],
    category: "phuong_phap_hoc",
    responses: [
      "Điện thoại là thách thức lớn nhất khi học của thế hệ bạn! Một số cách thực tế:\n\n• **Để điện thoại ra khỏi tầm tay** (phòng khác, hộc tủ) — không phải chỉ lật úp\n• **App chặn mạng xã hội**: Forest, StayFocusd, Cold Turkey — học xong thì mở\n• **Tắt thông báo tất cả** trong giờ học\n• **Thỏa thuận với bản thân**: Học đủ 25 phút mới được cầm điện thoại\n• **Kỹ thuật 'parking lot'**: Nghĩ đến điều gì thú vị → ghi ra giấy → tiếp tục học\n\nBạn thường bị cuốn vào app nào nhất?",
      "Não người không thể thực sự làm nhiều việc cùng lúc — 'học và xem điện thoại' thực ra là chuyển qua chuyển lại liên tục, khiến học lâu gấp đôi và nhớ ít hơn nhiều. Hãy thử học 25 phút không điện thoại, sau đó 5 phút dùng thoải mái. Bạn có muốn thử không?",
    ],
    suggestedReplies: [
      "Mình hay bị cuốn vào TikTok",
      "Mình không biết cách tắt thông báo",
      "Mình thử nhưng không giữ được",
      "Còn cách nào khác không?",
    ],
  },

  // ===== ÁP LỰC THI CỬ =====
  {
    keywords: [
      "so thi", "ap luc thi", "lo lang truoc thi", "thi truot", "hong thi",
      "thi dai hoc", "thpt quoc gia", "vao cap 3", "tuyen sinh", "thi thu",
      "ket qua thi", "xem ket qua", "truot", "rot",
    ],
    category: "hoc_tap",
    responses: [
      "Lo lắng trước kỳ thi là hoàn toàn bình thường — thậm chí một chút căng thẳng giúp bạn tỉnh táo hơn! Nhưng nếu lo quá mức, hãy thử:\n\n• **Chuẩn bị kỹ**: Sự lo lắng giảm mạnh khi bạn cảm thấy đã ôn đủ\n• **Thở 4-4-4**: Hít vào 4 giây, giữ 4 giây, thở ra 4 giây — làm ngay trước khi vào phòng thi\n• **Tư duy lại**: Thay vì 'Mình phải đạt điểm cao', nghĩ 'Mình sẽ làm tốt nhất có thể với kiến thức mình có'\n• **Đêm trước thi**: Không học nhồi nhét — ôn nhẹ, ngủ sớm, ăn no sáng\n\nBạn đang chuẩn bị cho kỳ thi nào?",
      "Một bài thi không định nghĩa giá trị hay tương lai của bạn — dù kết quả thế nào. Nhưng mình hiểu rằng trong thời điểm này, cảm giác lo lắng là thật và nặng nề. Bạn đang sợ nhất điều gì về kỳ thi này?",
    ],
    suggestedReplies: [
      "Mình sợ thi trượt sẽ thất vọng bố mẹ",
      "Mình hay quên bài trong phòng thi",
      "Mình ôn nhiều nhưng vẫn lo",
      "Có mẹo học thuộc bài nhanh không?",
    ],
  },

  // ===== TÂM LÝ - BUỒN / STRESS =====
  {
    keywords: [
      "buon", "khon vui", "that bai", "co don", "dau long", "kho chiu",
      "stress", "met moi tinh than", "ap luc", "qua tai", "overwhelmed",
      "tram cam", "uong uot", "cam thay trong rong", "vo nghia",
    ],
    category: "tam_ly",
    responses: [
      "Mình nghe thấy bạn. Cảm giác đó thật sự rất nặng nề, và bạn không cần phải một mình chịu đựng nó. Gần đây có chuyện gì xảy ra khiến bạn cảm thấy vậy không? Mình đang lắng nghe.",
      "Cảm ơn bạn đã chia sẻ với mình — điều đó cần dũng cảm. Cảm xúc của bạn hoàn toàn có giá trị và bạn không cần giả vờ ổn khi không ổn. Bạn muốn kể thêm điều gì đang xảy ra không?",
      "Cảm giác buồn hay kiệt sức đôi khi chỉ cần được thừa nhận, không cần phải giải quyết ngay. Mình ở đây để lắng nghe — bạn đang trải qua gì vậy?",
    ],
    suggestedReplies: [
      "Mình không biết tại sao mình buồn",
      "Mình cảm thấy kiệt sức và trống rỗng",
      "Mình có quá nhiều áp lực cùng lúc",
      "Mình muốn tìm hiểu cách quản lý cảm xúc",
    ],
  },

  // ===== LO ÂU =====
  {
    keywords: [
      "lo lang", "lo au", "so hai", "hoang mang", "boi roi", "hoi hop",
      "lo luong", "bat an", "khong yen", "lo ngai", "worry", "anxiety",
    ],
    category: "lo_au",
    responses: [
      "Lo lắng là phản ứng tự nhiên của não trước những điều không chắc chắn. Một vài kỹ thuật giúp ngay lúc đang lo:\n\n• **Thở vuông**: Hít vào 4s → giữ 4s → thở ra 4s → giữ 4s. Lặp lại 4 lần\n• **Kỹ thuật 5-4-3-2-1**: Nhận ra 5 thứ bạn nhìn thấy, 4 thứ bạn chạm được, 3 thứ bạn nghe, 2 thứ bạn ngửi, 1 thứ bạn nếm — giúp bạn về hiện tại\n• **Đặt câu hỏi**: 'Điều mình lo có xảy ra không? Nếu có, mình xử lý được không?' — 90% điều ta lo không xảy ra\n\nBạn đang lo về điều gì cụ thể?",
      "Lo âu thường đến khi chúng ta sống trong tương lai thay vì hiện tại. Hãy thử hỏi bản thân: **'Ngay lúc này, mình có an toàn không?'** — thường câu trả lời là có. Vấn đề là trong đầu bạn đang đang diễn lại hoặc tưởng tượng điều tồi tệ. Bạn đang lo về điều gì?",
    ],
    suggestedReplies: [
      "Mình lo về tương lai",
      "Mình lo về chuyện học",
      "Mình hay bị lo âu vô cớ",
      "Làm sao để bớt lo hơn?",
    ],
  },

  // ===== TỰ TIN / TỰ TI =====
  {
    keywords: [
      "tu ti", "thieu tu tin", "khong tu tin", "mat tu tin", "cam thay minh kem",
      "cam thay vo dung", "khong du gioi", "so bi phan xet", "ngan ngai",
      "shy", "nhat nhat", "xau ho", "mat mat", "dung truoc dam dong",
    ],
    category: "tu_tin",
    responses: [
      "Thiếu tự tin là điều rất nhiều người trẻ trải qua — kể cả những người nhìn từ ngoài có vẻ rất tự tin. Đây là điều mình muốn bạn biết: **Tự tin không phải là không sợ, mà là làm dù đang sợ.**\n\nMột vài cách xây dựng tự tin:\n• Ghi lại 3 điều bạn làm tốt mỗi ngày (dù nhỏ)\n• Thử thách bản thân từng bước nhỏ thay vì nhảy cóc\n• Nhận ra giọng phán xét trong đầu và phản bác nó\n• Bớt so sánh với người khác — bạn đang đua với phiên bản hôm qua của chính mình\n\nBạn đang cảm thấy thiếu tự tin trong lĩnh vực nào?",
      "Cảm giác 'mình không đủ giỏi' rất phổ biến và có tên là Hội chứng Kẻ mạo danh (Impostor Syndrome). Ngay cả những người giỏi nhất cũng cảm thấy vậy. Bạn đang so sánh bản thân với ai hoặc điều gì khiến bạn cảm thấy mình kém?",
    ],
    suggestedReplies: [
      "Mình sợ nói trước đám đông",
      "Mình hay so sánh mình với người khác",
      "Mình cảm thấy mình không giỏi bằng bạn bè",
      "Mình muốn tự tin hơn trong giao tiếp",
    ],
  },

  // ===== TỨC GIẬN =====
  {
    keywords: [
      "tuc gian", "gian", "buc boi", "cam thay uc che", "phat dien", "kho chiu",
      "uc", "buc xuc", "kho tiu", "nong tinh", "mat binh tinh",
    ],
    category: "cam_xuc",
    responses: [
      "Tức giận là cảm xúc hoàn toàn bình thường — nó thường báo hiệu rằng một ranh giới của bạn bị vi phạm hoặc điều gì đó quan trọng với bạn đang bị đe dọa. Quan trọng là cách bạn xử lý nó:\n\n• **Dừng lại trước khi phản ứng**: Đếm đến 10 trong đầu\n• **Rời khỏi tình huống** nếu có thể — hít thở, đi bộ vài phút\n• **Thở bụng**: Hít sâu và chậm giúp hệ thần kinh bình tĩnh lại\n• **Nói sau khi bình tĩnh**: Dùng câu 'Tôi cảm thấy...' thay vì 'Bạn đã...'\n\nBạn đang tức về chuyện gì vậy?",
      "Bực bội và ức chế mà không xả được rất mệt. Mình ở đây nếu bạn muốn kể — đôi khi chỉ cần nói ra thôi cũng bớt nhiều lắm. Chuyện gì đã xảy ra?",
    ],
    suggestedReplies: [
      "Mình bực vì bạn bè không hiểu mình",
      "Mình tức bố mẹ",
      "Mình bực vì thầy cô xử lý không công bằng",
      "Làm sao để kiểm soát cơn tức giận?",
    ],
  },

  // ===== BẠN BÈ / QUAN HỆ =====
  {
    keywords: [
      "ban be", "tinh ban", "xich mich", "cai nhau", "hiep lam", "tay chay",
      "bi coi thuong", "ban xau", "ban tot", "mat ban", "ket ban",
      "khong co ban", "co don trong lop", "bi noi xau sau lung",
    ],
    category: "quan_he",
    responses: [
      "Các mối quan hệ bạn bè ảnh hưởng rất nhiều đến tâm trạng học đường mỗi ngày. Bạn có thể kể mình nghe chuyện gì đang xảy ra không? Mình muốn hiểu tình huống của bạn hơn.",
      "Chuyện bạn bè đôi khi còn khó xử hơn cả chuyện học. Bạn đang gặp vấn đề với ai — bạn thân, nhóm bạn, hay người mới quen?",
      "Cảm giác cô đơn trong một nhóm đông người thậm chí còn nặng hơn cô đơn khi ở một mình. Bạn đang cảm thấy thế nào trong mối quan hệ bạn bè?",
    ],
    suggestedReplies: [
      "Mình bị bạn bè tẩy chay",
      "Mình và bạn thân đang xích mích",
      "Mình không biết cách kết thêm bạn",
      "Làm sao để xử lý khi bị nói xấu?",
    ],
  },

  // ===== BẮT NẠT =====
  {
    keywords: [
      "bao luc hoc duong", "bully", "bi bat nat", "bat nat", "danh nhau",
      "bi de doa", "bi gia tien", "bi ep", "bi chup hinh khong dong y",
      "cyberbully", "bi block", "bi tan cong mang",
    ],
    category: "quan_he",
    responses: [
      "Bắt nạt học đường là vấn đề nghiêm trọng và bạn có quyền được an toàn — điều này không phải lỗi của bạn.\n\nNếu bạn đang bị bắt nạt, hãy:\n1. **Nói với người lớn tin tưởng** ngay: thầy cô, phụ huynh, cán bộ tư vấn\n2. **Ghi lại bằng chứng**: chụp ảnh tin nhắn, ghi chép ngày giờ sự việc\n3. **Không ở một mình** ở nơi thường xảy ra\n4. **Gọi 111** nếu bạn dưới 18 tuổi và cần hỗ trợ khẩn cấp\n\nBạn đang trải qua dạng bắt nạt nào?",
      "Mình lo cho sự an toàn của bạn. Bắt nạt không bao giờ là chuyện bình thường cần chịu đựng. Bạn đang bị bắt nạt như thế nào — trực tiếp hay trên mạng? Và bạn đã nói với ai chưa?",
    ],
    suggestedReplies: [
      "Mình bị bắt nạt trực tiếp",
      "Mình bị bắt nạt trên mạng",
      "Mình thấy bạn khác bị bắt nạt",
      "Mình đã nói với thầy cô nhưng không được giải quyết",
    ],
  },

  // ===== TÌNH YÊU / CẢM MẾN =====
  {
    keywords: [
      "tinh yeu", "yeu", "thich ai do", "crush", "nguoi yeu", "chia tay",
      "bi tu choi", "confess", "to tinh", "nguoi ta khong thich minh",
      "ghen", "ganh ty", "ngoai tinh", "phac hoa", "moi tinh dau",
      "dang yeu", "yeu don phuong",
    ],
    category: "tinh_yeu",
    responses: [
      "Chuyện tình cảm thời học trò rất đặc biệt — đầy rung động nhưng cũng đầy bối rối! Bạn đang trải qua giai đoạn nào — đang thích ai, đang yêu, hay vừa chia tay?",
      "Tình yêu học trò là khoảng thời gian đáng nhớ, nhưng cũng có thể rất khó xử. Mình ở đây để lắng nghe — bạn đang cảm thấy gì?",
      "Cảm giác yêu đơn phương hoặc bị từ chối thực sự rất đau. Bạn có muốn kể mình nghe tình huống của bạn không?",
    ],
    suggestedReplies: [
      "Mình đang thích một người nhưng không biết làm sao",
      "Mình vừa bị chia tay và rất buồn",
      "Mình yêu đơn phương và mệt mỏi lắm rồi",
      "Làm sao biết có nên tỏ tình không?",
    ],
  },

  // ===== TỎ TÌNH / CONFESS =====
  {
    keywords: [
      "co nen to tinh", "to tinh the nao", "lam sao confess",
      "noi voi nguoi minh thich", "tim hieu", "noi chuyen voi crush",
    ],
    category: "tinh_yeu",
    responses: [
      "Tỏ tình cần dũng cảm! Trước khi quyết định, hãy tự hỏi:\n• Bạn hiểu người đó đủ chưa, hay mới chỉ thích từ xa?\n• Nếu bị từ chối, bạn có thể vẫn là bạn bè không?\n• Thời điểm và cách nói có phù hợp không?\n\nMình gợi ý bắt đầu bằng cách trò chuyện tự nhiên hơn, tìm hiểu nhau kỹ hơn trước khi tỏ tình. Không có cách 'tỏ tình hoàn hảo' — quan trọng là thành thật và tôn trọng đối phương. Bạn đã biết người đó bao lâu rồi?",
    ],
    suggestedReplies: [
      "Mình chưa nói chuyện nhiều với họ",
      "Mình đã biết họ lâu rồi",
      "Mình sợ bị từ chối",
      "Làm sao để bắt đầu nói chuyện?",
    ],
  },

  // ===== CHIA TAY =====
  {
    keywords: [
      "chia tay", "bi chia tay", "khoc vi chia tay", "nho nguoi yeu cu",
      "chia tay dau long", "nguoi yeu bo minh", "het yeu",
    ],
    category: "tinh_yeu",
    responses: [
      "Chia tay thực sự rất đau, dù bạn là người quyết định hay không. Cho phép mình hỏi: chuyện chia tay xảy ra như thế nào? Và bạn đang cảm thấy ra sao bây giờ?",
      "Sau chia tay, não người trải qua phản ứng rất giống mất mát — buồn, giận, nhớ nhung xen kẽ nhau là hoàn toàn bình thường. Đừng vội ép bản thân phải 'ổn' ngay. Bạn đang ở giai đoạn nào sau chia tay?",
    ],
    suggestedReplies: [
      "Mình không hiểu tại sao họ chia tay mình",
      "Mình vẫn nhớ người cũ dù đã lâu",
      "Mình muốn quay lại nhưng không biết có nên không",
      "Làm sao để vượt qua được?",
    ],
  },

  // ===== MẠNG XÃ HỘI =====
  {
    keywords: [
      "mang xa hoi", "facebook", "instagram", "tiktok", "social media",
      "so sanh tren mang", "cuoc song ao", "follow", "like", "biet oi",
      "dep tren mang", "anh gia", "ao tuong mang xa hoi", "nghien mang",
    ],
    category: "mang_xa_hoi",
    responses: [
      "Mạng xã hội đang trở thành nguồn gây lo âu và so sánh lớn nhất với giới trẻ. Một sự thật quan trọng: **mọi người đều đăng cuộc sống đẹp nhất của họ, không phải cuộc sống thật.** Bạn đang cảm thấy bị ảnh hưởng bởi mạng xã hội theo cách nào?",
      "Nghiên cứu cho thấy dùng mạng xã hội quá 2 tiếng/ngày làm tăng đáng kể cảm giác lo âu và kém tự tin. Bạn có để ý thấy mình cảm thấy tệ hơn sau khi lướt mạng không? Mình có thể chia sẻ một vài cách dùng mạng lành mạnh hơn.",
    ],
    suggestedReplies: [
      "Mình hay so sánh mình với người trên mạng",
      "Mình nghiện điện thoại quá",
      "Làm sao để dùng mạng xã hội ít đi?",
      "Mình bị ảnh hưởng bởi bình luận tiêu cực",
    ],
  },

  // ===== SỨC KHỎE / BỆNH =====
  {
    keywords: [
      "bi benh", "dau dau", "dau bung", "benh", "cam cum", "sot",
      "kham benh", "bac si", "thuoc", "chua benh", "suc khoe",
    ],
    category: "suc_khoe",
    responses: [
      "Sức khỏe thể chất và tâm lý liên kết chặt chẽ với nhau. Nếu bạn đang có triệu chứng bệnh lý, điều quan trọng nhất là gặp bác sĩ để được chẩn đoán đúng — mình không thể tư vấn y khoa thay bác sĩ được. Bạn đang có triệu chứng gì?",
      "Mình không thể chẩn đoán bệnh, nhưng mình có thể lắng nghe và hỗ trợ về mặt tâm lý khi bạn đang bệnh. Bạn đang cảm thấy thế nào?",
    ],
    suggestedReplies: [
      "Mình hay đau đầu khi học nhiều",
      "Mình cảm thấy mệt mỏi kéo dài",
      "Mình không biết phòng khám nào tốt",
      "Mình đang lo lắng về sức khỏe của mình",
    ],
  },

  // ===== GIẤC NGỦ =====
  {
    keywords: [
      "ngu khong duoc", "kho ngu", "mat ngu", "ngu it", "thuc khuya",
      "buon ngu ban ngay", "ngu nhieu", "khong ngu duoc", "ngu muon",
      "giac ngu", "insomnia", "lay ngu",
    ],
    category: "giac_ngu",
    responses: [
      "Giấc ngủ là nền tảng của sức khỏe tâm thần và học tập! Học sinh cần 8-10 tiếng/đêm. Một số mẹo cải thiện giấc ngủ:\n\n• **Ngủ và thức cùng giờ** mỗi ngày (kể cả cuối tuần)\n• **Tắt màn hình 1 tiếng trước ngủ** — ánh sáng xanh ức chế melatonin\n• **Phòng ngủ: tối, mát, yên tĩnh**\n• **Không caffeine sau 2 giờ chiều**\n• **Viết xuống những lo lắng** trước khi ngủ để 'trút' ra khỏi đầu\n• **Thở 4-7-8**: Hít vào 4s, giữ 7s, thở ra 8s — giúp ngủ nhanh hơn\n\nBạn đang gặp vấn đề gì với giấc ngủ?",
      "Thức khuya học bài thực ra phản tác dụng — não củng cố kiến thức khi ngủ, không phải khi học. Ngủ đủ giấc giúp nhớ bài tốt hơn học 2 tiếng thêm trong tình trạng thiếu ngủ. Bạn thường ngủ mấy tiếng một đêm?",
    ],
    suggestedReplies: [
      "Mình thức khuya học bài",
      "Mình nằm xuống mà không ngủ được",
      "Mình hay nghĩ lung tung trước khi ngủ",
      "Mình ngủ đủ giờ nhưng vẫn mệt",
    ],
  },

  // ===== ĂN UỐNG =====
  {
    keywords: [
      "an uong", "bo bua", "quen an", "an khong ngon", "an nhieu qua",
      "giam can", "tang can", "beo", "gay", "hinh the", "body",
      "che do an", "dinh duong", "thuc pham", "nhiem an",
    ],
    category: "an_uong",
    responses: [
      "Ăn uống ảnh hưởng trực tiếp đến năng lượng, tâm trạng và khả năng tập trung. Bỏ bữa hoặc ăn không đủ chất khiến não hoạt động kém hơn đáng kể. Bạn đang có vấn đề gì với việc ăn uống?",
      "Áp lực về ngoại hình và cân nặng là vấn đề nhiều bạn trẻ đang phải đối mặt. Điều quan trọng nhất là **sức khỏe**, không phải con số trên cân. Bạn đang cảm thấy thế nào về cơ thể của mình?",
    ],
    suggestedReplies: [
      "Mình hay bỏ bữa sáng",
      "Mình không hài lòng với cân nặng của mình",
      "Mình ăn nhiều khi stress",
      "Làm sao để ăn uống lành mạnh hơn?",
    ],
  },

  // ===== VẬN ĐỘNG =====
  {
    keywords: [
      "tap the duc", "the thao", "van dong", "tap gym", "chay bo", "yoga",
      "khong co thoi gian tap", "luoi tap", "bong da", "cau long",
    ],
    category: "van_dong",
    responses: [
      "Vận động thể chất là một trong những cách hiệu quả nhất để cải thiện tâm trạng và giảm stress — chỉ 20-30 phút đi bộ đã giải phóng endorphin đủ để cải thiện tâm trạng rõ rệt. Bạn đang muốn bắt đầu vận động hay đang tìm cách duy trì?",
      "Bí quyết để vận động thường xuyên: **chọn hoạt động bạn thích**, không phải hoạt động bạn nghĩ là 'đúng'. Nhảy theo nhạc trong phòng cũng tính! Bạn thích loại vận động nào?",
    ],
    suggestedReplies: [
      "Mình muốn bắt đầu tập thể dục nhưng không biết từ đâu",
      "Mình không có thời gian",
      "Mình tập được vài ngày rồi bỏ",
      "Môn thể thao nào phù hợp với người lười?",
    ],
  },

  // ===== GIA ĐÌNH =====
  {
    keywords: [
      "bo me", "cha me", "ba me", "gia dinh", "anh chi em", "ong ba",
      "ky vong gia dinh", "ap luc tu gia dinh", "cha me ly hon",
      "bo me cai nhau", "gia dinh kho khan", "khong duoc hieu",
      "so sanh voi anh chi", "bao luc gia dinh",
    ],
    category: "gia_dinh",
    responses: [
      "Gia đình là môi trường đầu tiên và ảnh hưởng sâu sắc nhất đến chúng ta. Bạn đang gặp khó khăn gì trong gia đình? Mình lắng nghe mà không phán xét.",
      "Áp lực từ gia đình — kỳ vọng, so sánh, hay xung đột — đôi khi còn nặng hơn cả áp lực học hành. Bạn muốn chia sẻ điều gì đang xảy ra?",
      "Khoảng cách thế hệ đôi khi khiến cha mẹ và con cái rất khó hiểu nhau. Bạn đang cảm thấy không được hiểu về điều gì?",
    ],
    suggestedReplies: [
      "Bố mẹ kỳ vọng quá nhiều vào mình",
      "Bố mẹ hay so sánh mình với anh chị",
      "Bố mẹ đang cãi nhau nhiều",
      "Mình không biết cách nói chuyện với bố mẹ",
    ],
  },

  // ===== TƯƠNG LAI / NGHỀ NGHIỆP =====
  {
    keywords: [
      "tuong lai", "nghe nghiep", "chon nganh", "chon truong", "du hoc",
      "lam gi sau nay", "uoc mo", "muc tieu", "dinh huong",
      "dai hoc hay di lam", "khong biet minh thich gi",
    ],
    category: "tuong_lai",
    responses: [
      "Định hướng tương lai là một trong những quyết định quan trọng nhưng không cần phải hoàn hảo ngay lần đầu. Nhiều người thành công đã thay đổi hướng đi nhiều lần. Bạn đang băn khoăn về điều gì cụ thể — chọn ngành, chọn trường, hay chưa biết mình thích gì?",
      "Chưa biết mình muốn gì không phải là điểm yếu — đó là điểm khởi đầu để khám phá. Thử hỏi bản thân:\n• Mình giỏi nhất điều gì?\n• Mình hay mất khái niệm về thời gian khi làm gì?\n• Mình muốn cuộc sống hằng ngày trông như thế nào?\n\nBạn đang ở bước nào trong quá trình định hướng?",
    ],
    suggestedReplies: [
      "Mình không biết mình thích ngành gì",
      "Bố mẹ muốn mình học một ngành khác",
      "Mình muốn du học nhưng không biết bắt đầu từ đâu",
      "Mình muốn học đại học hay học nghề?",
    ],
  },

  // ===== TIỀN BẠC / CHI TIÊU =====
  {
    keywords: [
      "tien", "het tien", "khong du tien", "tiet kiem", "chi tieu",
      "hoc bong", "ho tro tai chinh", "lam them", "part time", "vay tien",
      "qua tay", "tieu hoang", "quan ly tien",
    ],
    category: "tien_bac",
    responses: [
      "Quản lý tiền bạc là kỹ năng quan trọng nhưng ít được dạy ở trường! Một số nguyên tắc cơ bản:\n\n• **Quy tắc 50-30-20**: 50% cho nhu cầu thiết yếu, 30% cho giải trí và cá nhân, 20% tiết kiệm\n• **Ghi chép chi tiêu**: Dùng app (Money Lover, MISA...) hoặc sổ nhỏ để biết tiền đi đâu\n• **Đặt ngân sách theo tuần**: Dễ kiểm soát hơn theo tháng\n• **Phân biệt muốn và cần** trước khi mua\n\nBạn đang gặp vấn đề gì về tài chính?",
      "Đang đi học mà quản lý tiền không phải dễ, đặc biệt khi có nhiều cám dỗ xung quanh. Bạn đang gặp khó khăn theo hướng nào — thiếu tiền, chi tiêu quá tay, hay muốn tiết kiệm nhưng không biết cách?",
    ],
    suggestedReplies: [
      "Mình hay hết tiền trước cuối tháng",
      "Mình muốn tiết kiệm nhưng không biết cách",
      "Mình muốn đi làm thêm",
      "Làm sao để xin học bổng?",
    ],
  },

  // ===== GIẢI TRÍ / CÂN BẰNG =====
  {
    keywords: [
      "giai tri", "nghien game", "doc sach", "phim", "am nhac", "so thich",
      "vui choi", "cuoi tuan", "can bang hoc va choi", "khong co thoi gian cho ban than",
      "thoi gian ca nhan", "hobby",
    ],
    category: "giai_tri",
    responses: [
      "Giải trí và thời gian cho bản thân không phải là lãng phí — đó là **cần thiết** để não phục hồi và sáng tạo. Học sinh không có thời gian chơi thường dễ kiệt sức hơn. Bạn thường làm gì để thư giãn?",
      "Cân bằng giữa học và thư giãn là nghệ thuật! Không cần học 24/7 để giỏi — thực ra, nghỉ ngơi hợp lý giúp não xử lý và củng cố kiến thức tốt hơn. Bạn đang gặp khó khăn trong việc cân bằng không?",
    ],
    suggestedReplies: [
      "Mình nghiện game và không kiểm soát được",
      "Mình không có sở thích gì đặc biệt",
      "Mình muốn tìm hoạt động mới",
      "Làm sao để cân bằng học và giải trí?",
    ],
  },

  // ===== MÔN TOÁN =====
  {
    keywords: [
      "mon toan", "toan hoc", "toan", "so hoc", "hinh hoc", "dai so",
      "giai tich", "xac suat", "thong ke", "luong giac",
      "bai toan", "giai toan", "khong hieu toan", "toan kho",
    ],
    category: "hoc_tap",
    responses: [
      "Toán học là môn nhiều bạn thấy khó vì cần tư duy logic và kiến thức nền vững. Một số mẹo:\n\n• **Hiểu bản chất, không học vẹt**: Toán cần hiểu tại sao, không chỉ nhớ công thức\n• **Làm nhiều bài tập**: Đặc biệt dạng bài khác nhau — não học qua thực hành\n• **Ôn từ gốc nếu bị hổng**: Nếu không hiểu chương hiện tại, thường là do mất gốc từ chương trước\n• **Giải thích lại bằng lời**: Nếu bạn giải thích được cho người khác là bạn đã thực sự hiểu\n• **Khan Academy, YouTube**: Nhiều kênh giải thích toán rất trực quan\n\nBạn đang khó với phần nào của toán — đại số, hình học, hay giải tích?",
      "Toán học khó ở chỗ kiến thức có chuỗi liên tiếp — một mắt xích bị hổng là các phần sau rất khó hiểu. Bạn cảm thấy mất gốc từ phần nào không? Hay bạn đang cần giải một dạng bài cụ thể nào?",
    ],
    suggestedReplies: [
      "Mình không hiểu hình học không gian",
      "Mình hay sai tính toán",
      "Làm sao để giải phương trình nhanh?",
      "Mình không biết cách học thuộc công thức",
    ],
  },

  // ===== MÔN VĂN =====
  {
    keywords: [
      "mon van", "van hoc", "van", "tap lam van", "phan tich tho",
      "nghi luan", "cm van", "viet van", "khong biet viet van",
      "van kho", "doan van", "bai van",
    ],
    category: "hoc_tap",
    responses: [
      "Văn học là môn cần cả kỹ năng phân tích lẫn cảm xúc. Một số bí quyết:\n\n• **Đọc nhiều**: Đọc sách, đọc văn mẫu — não sẽ tự học cách viết\n• **Dàn ý trước khi viết**: Dành 5 phút lập dàn ý giúp bài văn mạch lạc hơn nhiều\n• **Phân tích thơ/văn**: Luôn hỏi 'Tác giả muốn nói gì? Biện pháp nghệ thuật nào? Tác dụng gì?'\n• **Học từ bài văn mẫu**: Không phải để chép, mà để học cách lập luận và dùng từ\n• **Viết nhật ký**: Luyện diễn đạt cảm xúc bằng văn tự nhiên mỗi ngày\n\nBạn đang gặp khó khăn ở phần nào — phân tích, nghị luận, hay diễn đạt?",
      "Văn không phải chỉ là học thuộc — đó là kỹ năng cảm nhận và diễn đạt. Nhiều bạn khó viết văn vì ít đọc sách, hoặc chưa biết cách tổ chức ý. Bạn đang cần giúp viết loại văn gì — phân tích tác phẩm, nghị luận xã hội, hay tự sự?",
    ],
    suggestedReplies: [
      "Làm sao phân tích bài thơ?",
      "Mình không biết mở bài thế nào",
      "Làm sao viết văn nghị luận?",
      "Mình hay bị lạc đề",
    ],
  },

  // ===== TIẾNG ANH =====
  {
    keywords: [
      "tieng anh", "english", "ngu phap", "grammar", "tu vung", "vocabulary",
      "nghe tieng anh", "noi tieng anh", "viet tieng anh", "doc tieng anh",
      "ielts", "toeic", "luyen thi tieng anh", "tieng anh kho",
    ],
    category: "hoc_tap",
    responses: [
      "Học tiếng Anh hiệu quả cần kết hợp 4 kỹ năng. Đây là hướng dẫn từng kỹ năng:\n\n• **Nghe**: Nghe podcast, xem phim có phụ đề, YouTube — mỗi ngày 15-30 phút\n• **Nói**: Luyện với app (ELSA, Cambly), nói to khi đọc sách, gương phản chiếu\n• **Đọc**: Bắt đầu với truyện ngắn, tin tức đơn giản (VOA Learning English)\n• **Viết**: Viết nhật ký bằng tiếng Anh mỗi ngày 5-10 câu\n• **Từ vựng**: Học qua Anki/Quizlet với kỹ thuật Spaced Repetition\n• **Ngữ pháp**: Học qua ví dụ thực tế, không chỉ qua bảng quy tắc\n\nBạn đang muốn cải thiện kỹ năng nào nhất?",
      "Nhiều bạn học tiếng Anh lâu nhưng không tiến bộ vì học sai cách — học nhiều ngữ pháp nhưng ít tiếp xúc thực tế. Bí quyết là **immersion** (đắm chìm): đổi ngôn ngữ điện thoại sang tiếng Anh, nghe nhạc tiếng Anh, xem phim với phụ đề tiếng Anh. Bạn đang học cho mục đích gì — giao tiếp, thi IELTS, hay học thuật?",
    ],
    suggestedReplies: [
      "Làm sao học từ vựng tiếng Anh nhanh?",
      "Mình nghe không hiểu người bản ngữ nói",
      "Mình cần thi IELTS nhưng không biết bắt đầu từ đâu",
      "Mình ngại nói tiếng Anh vì sợ sai",
    ],
  },

  // ===== VẬT LÝ =====
  {
    keywords: [
      "vat ly", "ly", "dien tu", "co hoc", "quang hoc", "nhiet hoc",
      "song anh sang", "dien", "tu truong", "luc", "gia toc", "van toc",
      "bai ly", "cong thuc vat ly",
    ],
    category: "hoc_tap",
    responses: [
      "Vật lý kết hợp giữa lý thuyết và bài tập tính toán — cả hai đều cần. Bí quyết:\n\n• **Hiểu bản chất vật lý**: Trước khi học công thức, hỏi 'Hiện tượng này xảy ra thế nào trong thực tế?'\n• **Vẽ hình cho mọi bài toán**: Giúp hình dung tình huống và nhận ra các lực/đại lượng liên quan\n• **Phân tích thứ nguyên**: Kiểm tra công thức có đúng đơn vị không — rất hữu ích\n• **Học thuộc công thức theo nhóm**: Ví dụ các công thức chuyển động thẳng đều cùng nhóm\n• **Làm đề cũ**: Vật lý thi theo dạng bài — làm nhiều dạng quen là làm tốt\n\nBạn đang khó với chương nào — cơ học, điện từ, sóng, hay quang?",
    ],
    suggestedReplies: [
      "Mình không hiểu điện xoay chiều",
      "Mình hay nhầm công thức",
      "Làm sao để phân tích bài toán vật lý?",
      "Mình học lý thuyết ok nhưng làm bài không ra",
    ],
  },

  // ===== HÓA HỌC =====
  {
    keywords: [
      "hoa hoc", "hoa", "phan ung", "bang tuan hoan", "hoa vo co", "hoa huu co",
      "cong thuc hoa hoc", "phuong trinh hoa hoc", "can bang phuong trinh",
      "axit", "bazo", "muoi", "mol",
    ],
    category: "hoc_tap",
    responses: [
      "Hóa học đòi hỏi vừa nhớ vừa hiểu. Một số mẹo:\n\n• **Bảng tuần hoàn**: Nhớ các nhóm nguyên tố chính và tính chất đặc trưng, không cần nhớ tất cả\n• **Phương trình hóa học**: Hiểu bản chất phản ứng trước — acid + base → muối + nước; oxi hóa-khử có electron trao đổi\n• **Hóa hữu cơ**: Học theo chuỗi phản ứng và nhóm chức — mỗi nhóm chức có tính chất đặc trưng\n• **Làm bài tập tính toán**: Bảo toàn mol, bảo toàn khối lượng, bảo toàn điện tích — 3 nguyên tắc vàng\n• **Ghi chú màu sắc**: Dùng màu để phân biệt acid, base, muối, kim loại...\n\nBạn đang gặp khó ở phần hóa vô cơ hay hữu cơ?",
    ],
    suggestedReplies: [
      "Mình không thuộc được bảng tuần hoàn",
      "Mình không biết cân bằng phương trình",
      "Hóa hữu cơ quá nhiều phản ứng, học sao?",
      "Mình hay bị nhầm trong bài tính toán hóa",
    ],
  },

  // ===== SINH HỌC =====
  {
    keywords: [
      "sinh hoc", "sinh", "te bao", "di truyen", "tien hoa", "sinh thai",
      "co the nguoi", "vi sinh vat", "adn", "nhiem sac the", "gen",
    ],
    category: "hoc_tap",
    responses: [
      "Sinh học là môn nghiêng về hiểu và ghi nhớ có logic. Bí quyết:\n\n• **Học theo sơ đồ tư duy**: Sinh học có rất nhiều khái niệm liên kết — sơ đồ giúp thấy tổng thể\n• **Liên hệ thực tế**: Ví dụ: bệnh đái tháo đường → insulin → tuyến tụy → phần nội tiết. Liên kết với đời thật giúp nhớ lâu\n• **Di truyền học**: Nắm chắc quy luật Mendel và các ngoại lệ — làm nhiều bài tập lập bảng\n• **Đọc hình vẽ**: Sinh học có nhiều hình — luyện đọc và giải thích hình là kỹ năng quan trọng\n\nBạn đang học phần nào của sinh học?",
    ],
    suggestedReplies: [
      "Mình không hiểu di truyền Mendel",
      "Phần tế bào và ADN quá khó",
      "Mình hay nhầm trong bài tập lai",
      "Sinh thái học học thế nào?",
    ],
  },

  // ===== LỊCH SỬ =====
  {
    keywords: [
      "lich su", "su", "su kien lich su", "nien dai", "lich su viet nam",
      "lich su the gioi", "cach mang", "chien tranh", "trieu dai",
      "nho lich su", "hoc su the nao",
    ],
    category: "hoc_tap",
    responses: [
      "Lịch sử không chỉ là nhớ năm và sự kiện — đó là hiểu được nguyên nhân, diễn biến, và hệ quả. Bí quyết:\n\n• **Đường thời gian (timeline)**: Vẽ trục thời gian và đặt sự kiện lên — thấy được mối liên hệ\n• **Nhóm sự kiện theo chủ đề**: Ví dụ: tất cả các phong trào kháng chiến cùng một cột\n• **Học theo câu chuyện**: Não người nhớ câu chuyện tốt hơn dữ liệu khô. Hãy kể lại như một câu chuyện\n• **Nhớ 'W': When, Where, Who, What, Why** — 5 câu hỏi cho mỗi sự kiện\n• **Flashcard sự kiện – năm**: Học như học từ vựng, dùng Anki\n\nBạn đang cần ôn phần lịch sử nào — Việt Nam hay thế giới?",
    ],
    suggestedReplies: [
      "Mình hay quên năm tháng sự kiện",
      "Mình không hiểu nguyên nhân của các cuộc chiến",
      "Làm sao học thuộc sự kiện lịch sử?",
      "Mình cần ôn lịch sử Việt Nam",
    ],
  },

  // ===== ĐỊA LÝ =====
  {
    keywords: [
      "dia ly", "dia", "ban do", "khi hau", "dia hinh", "dan so",
      "kinh te", "vung mien", "dia ly viet nam", "dia ly the gioi",
    ],
    category: "hoc_tap",
    responses: [
      "Địa lý kết hợp kiến thức bản đồ, tự nhiên và kinh tế-xã hội. Bí quyết:\n\n• **Học đi đôi với bản đồ**: Luôn kết hợp lý thuyết với vị trí trên bản đồ\n• **Liên hệ địa hình với khí hậu và con người**: Ví dụ: dãy núi → chắn gió → hai sườn khác nhau → dân cư phân bố khác nhau\n• **Số liệu kinh tế**: Học theo xu hướng (tăng/giảm) thay vì số liệu cụ thể — ít bị lạc hậu hơn\n• **Vùng kinh tế Việt Nam**: Học đặc trưng từng vùng — thế mạnh và hạn chế\n• **Atlas Địa lý**: Làm bạn với cuốn này — rất hữu ích khi thực hành\n\nBạn đang học phần địa nào — tự nhiên, dân cư, hay kinh tế?",
    ],
    suggestedReplies: [
      "Mình hay nhầm các vùng kinh tế",
      "Mình không đọc được bản đồ tốt",
      "Địa kinh tế - xã hội học thế nào?",
      "Mình cần ôn khí hậu Việt Nam",
    ],
  },

  // ===== HỌC NHÓM =====
  {
    keywords: [
      "hoc nhom", "nhom hoc", "hoc cung ban", "on nhom", "hoc voi ban",
      "nhom tieu luan", "lam viec nhom",
    ],
    category: "phuong_phap_hoc",
    responses: [
      "Học nhóm hiệu quả hay không phụ thuộc rất nhiều vào cách tổ chức. Bí quyết:\n\n• **Mỗi người chuẩn bị trước**: Đến nhóm đã học qua — không phải nhóm mới bắt đầu\n• **Phân chia chủ đề**: Mỗi người 'chuyên gia' một phần, dạy lại cho cả nhóm\n• **Đặt câu hỏi cho nhau**: Kiểm tra chéo giúp phát hiện chỗ chưa hiểu nhanh hơn tự học\n• **Giới hạn nhóm 3-4 người**: Quá đông dễ mất tập trung\n• **Đặt mục tiêu rõ ràng**: 'Hôm nay giải xong dạng bài 5 và 6 chương 3'\n\nBạn đang muốn lập nhóm cho môn nào?",
    ],
    suggestedReplies: [
      "Nhóm mình hay nói chuyện không học được",
      "Làm sao phân công bài nhóm công bằng?",
      "Mình học nhóm hay bị ỷ lại vào người khác",
      "Tìm bạn học nhóm ở đâu?",
    ],
  },

  // ===== ĐỌC SÁCH / TÀI LIỆU =====
  {
    keywords: [
      "doc sach", "sach hay", "sach nen doc", "tim tai lieu", "tai lieu hoc",
      "sach giao khoa", "thu vien", "tiep thu kien thuc", "doc nhanh",
    ],
    category: "phuong_phap_hoc",
    responses: [
      "Đọc sách hiệu quả là kỹ năng có thể luyện được:\n\n• **Kỹ thuật SQ3R**: Survey (lướt qua) → Question (đặt câu hỏi) → Read (đọc) → Recite (nhớ lại) → Review (ôn lại)\n• **Đặt câu hỏi trước khi đọc**: 'Tôi muốn biết gì từ chương này?' — giúp đọc có chủ đích\n• **Ghi chú bên lề**: Gạch dưới và ghi chú bằng lời của mình — không phải chép nguyên\n• **Đọc theo chủ đề**: Đọc nhiều sách về cùng một chủ đề giúp xây dựng hiểu biết sâu hơn\n• **Tìm tài liệu**: Google Scholar, ResearchGate, thư viện trường, YouTube bài giảng\n\nBạn đang tìm sách/tài liệu cho môn gì?",
    ],
    suggestedReplies: [
      "Mình đọc xong không nhớ gì",
      "Gợi ý sách hay cho học sinh",
      "Tìm tài liệu học miễn phí ở đâu?",
      "Làm sao đọc nhanh hơn?",
    ],
  },

  // ===== VIẾT BÀI / TIỂU LUẬN =====
  {
    keywords: [
      "viet bai", "tieu luan", "bao cao", "essay", "viet luan",
      "khong biet viet", "viet kho", "mo bai", "ket bai", "dan y",
    ],
    category: "hoc_tap",
    responses: [
      "Viết bài học thuật có cấu trúc rõ ràng sẽ dễ hơn nhiều:\n\n**Cấu trúc cơ bản:**\n• **Mở bài**: Giới thiệu chủ đề → nêu luận điểm chính (thesis)\n• **Thân bài**: Mỗi đoạn = 1 ý chính + bằng chứng + phân tích\n• **Kết bài**: Tóm tắt luận điểm + mở rộng hoặc đề xuất\n\n**Quy trình:**\n1. Lập dàn ý trước (15 phút)\n2. Viết nháp không dừng lại chỉnh sửa\n3. Chỉnh sửa sau khi đã viết xong\n\nBạn đang viết bài cho môn gì và đang khó ở bước nào?",
    ],
    suggestedReplies: [
      "Mình không biết bắt đầu viết từ đâu",
      "Mình hay bị lạc ý khi viết",
      "Làm sao viết luận văn tốt?",
      "Mình cần viết tiểu luận tiếng Anh",
    ],
  },

  // ===== HỌC BÀI THUỘC =====
  {
    keywords: [
      "hoc thuoc", "nho bai", "hoc veo", "hoc vet", "khong nho",
      "quen bai", "nho khong lau", "hoc xong la quen", "bai dai",
    ],
    category: "phuong_phap_hoc",
    responses: [
      "Học thuộc mà nhớ lâu cần kỹ thuật đúng:\n\n• **Active Recall**: Đóng sách, cố nhớ lại — não học hiệu quả qua việc cố nhớ, không phải qua đọc lại\n• **Spaced Repetition**: Ôn sau 1 ngày → 3 ngày → 1 tuần → 1 tháng — đánh đúng lúc não sắp quên\n• **Chunking**: Chia nhỏ thành cụm ý nghĩa thay vì học từng câu rời rạc\n• **Kết hợp giác quan**: Đọc to + viết tay + vẽ sơ đồ — càng nhiều giác quan càng nhớ lâu\n• **Dạy lại cho người khác**: Nếu giải thích được cho người chưa biết → bạn thực sự nhớ\n• **Ngủ đủ giấc**: Não củng cố ký ức ban đêm — thức khuya học nhồi nhét phản tác dụng\n\nBạn đang cần học thuộc nội dung gì?",
    ],
    suggestedReplies: [
      "Mình học thuộc bài nhưng hay quên khi thi",
      "Làm sao nhớ công thức toán/lý/hóa?",
      "Mình có bài dài cần học thuộc gấp",
      "Spaced Repetition là gì, dùng sao?",
    ],
  },

  // ===== NGHIỆN GAME =====
  {
    keywords: [
      "nghien game", "choi game nhieu", "khong bo duoc game", "game qua nhieu",
      "bi phu huynh cam game", "thuc khuya choi game",
    ],
    category: "giai_tri",
    responses: [
      "Game thực sự được thiết kế để gây nghiện — hệ thống phần thưởng trong game kích thích dopamine rất mạnh. Nhận ra điều này là bước đầu tiên. Câu hỏi quan trọng: **Game đang ảnh hưởng tiêu cực đến việc học, giấc ngủ, hay các mối quan hệ của bạn không?** Nếu có, đó là dấu hiệu cần điều chỉnh.",
      "Mình không nói game là xấu — quan trọng là mức độ và cách kiểm soát. Bạn thường chơi mấy tiếng một ngày, và bạn có cảm thấy khó dừng lại không?",
    ],
    suggestedReplies: [
      "Mình chơi đến 2-3 giờ sáng",
      "Mình không học được vì cứ muốn chơi game",
      "Làm sao để giới hạn thời gian chơi game?",
      "Bố mẹ cấm game, mình không đồng ý",
    ],
  },

  // ===== NGOẠI HÌNH =====
  {
    keywords: [
      "ngoai hinh", "beo", "gay", "xau", "khong dep", "mac cam ngoai hinh",
      "bi che ngoai hinh", "body shaming", "hinh anh co the",
      "muon thay doi ngoai hinh", "khong thich ban than",
    ],
    category: "tu_tin",
    responses: [
      "Cảm giác không hài lòng với ngoại hình rất phổ biến, đặc biệt trong độ tuổi học sinh — và mạng xã hội làm nó tệ hơn khi liên tục bày ra hình ảnh 'lý tưởng' được chỉnh sửa. Nhưng mình muốn bạn biết: **giá trị của bạn không nằm ở ngoại hình.** Bạn đang cảm thấy thế nào về điều này?",
      "Bị chê ngoại hình (body shaming) thực sự rất tổn thương và không thể chấp nhận — dù từ người lạ hay người thân. Bạn đang trải qua điều gì liên quan đến ngoại hình?",
    ],
    suggestedReplies: [
      "Mình bị bạn chê ngoại hình",
      "Mình không thích cơ thể của mình",
      "Mình muốn giảm cân nhưng không biết cách lành mạnh",
      "Làm sao để tự yêu bản thân hơn?",
    ],
  },

  // ===== SỐNG XA NHÀ / KÝ TÚC XÁ =====
  {
    keywords: [
      "ky tuc xa", "nha tro", "xa nha", "song mot minh", "tu lo ban than",
      "nhot nha", "nho nha", "sinh vien", "dai hoc moi vao",
    ],
    category: "giai_tri",
    responses: [
      "Sống xa nhà lần đầu tiên có thể vừa thú vị vừa cô đơn. Nhớ nhà, phải tự lo mọi thứ, tìm bạn mới — đây là thử thách thực sự nhưng cũng là cơ hội trưởng thành. Bạn đang ở giai đoạn nào — mới chuyển đi hay đã quen nhưng vẫn khó?",
      "Tự lo bản thân lần đầu tiên đòi hỏi rất nhiều kỹ năng cùng lúc: nấu ăn, quản lý tiền, sắp xếp thời gian, và cảm xúc. Bạn đang gặp khó khăn nhất ở điểm nào?",
    ],
    suggestedReplies: [
      "Mình nhớ nhà và cảm thấy cô đơn",
      "Mình không biết nấu ăn và sắp xếp cuộc sống",
      "Phòng ký túc xá có nhiều xung đột",
      "Mình khó làm quen với bạn mới",
    ],
  },

  // ===== KHỦNG HOẢNG / KHẨN CẤP =====
  {
    keywords: [
      "tu tu", "chet", "ket thuc tat ca", "khong muon song nua", "tu lam hai ban than",
      "nguy hiem", "khan cap", "cuu toi", "khong the chiu duoc nua",
      "them mot ngay nua cung khong noi",
    ],
    category: "khan_cap",
    responses: [
      "Mình rất lo lắng khi nghe bạn nói điều này. Bạn không hề đơn độc — luôn có người quan tâm đến bạn và sẵn sàng giúp đỡ.\n\nHãy gọi ngay:\n• **1800 599 920** — Miễn phí, 24/7\n• **113** — Nếu đang trong tình huống nguy hiểm ngay lập tức\n\nBạn quan trọng. Cuộc sống của bạn có giá trị. Xin hãy liên hệ ngay với đường dây hỗ trợ.",
      "Điều bạn đang cảm thấy rất nghiêm trọng và mình muốn bạn được giúp đỡ ngay bây giờ bởi người chuyên nghiệp. Hãy gọi **1800 599 920** (miễn phí, hoạt động 24/7) — họ được đào tạo để hỗ trợ bạn qua thời điểm này. Bạn không phải chịu đựng một mình.",
    ],
    suggestedReplies: [
      "Gọi đường dây hỗ trợ ngay",
      "Xem danh sách hotline khẩn cấp",
    ],
  },

  // ===== SỨC KHỎE TÂM THẦN =====
  {
    keywords: [
      "suc khoe tam than", "tam than", "tram cam", "lo au benh ly", "roi loan",
      "gap chuyen gia tam ly", "tu van tam ly", "lieu phap",
      "co can gap bac si tam ly", "bac si tam than",
    ],
    category: "tam_ly",
    responses: [
      "Việc quan tâm đến sức khỏe tâm thần là rất khôn ngoan! Tìm gặp chuyên gia tâm lý không có nghĩa là bạn 'bị điên' — đó là hành động dũng cảm và có trách nhiệm với bản thân.\n\nBạn có thể tìm hỗ trợ qua:\n• **Phòng tư vấn tâm lý học đường** của trường\n• **Đường dây 1800 599 920** (miễn phí, 24/7) để được tư vấn ban đầu\n• **Bệnh viện tâm thần** hoặc phòng khám tâm lý địa phương\n\nBạn đang gặp những triệu chứng gì khiến bạn lo lắng?",
    ],
    suggestedReplies: [
      "Mình nghĩ mình bị trầm cảm",
      "Mình nghĩ mình bị lo âu bệnh lý",
      "Làm sao để tìm chuyên gia tâm lý?",
      "Gặp chuyên gia tâm lý có tốn kém không?",
    ],
  },
];

const fallbackResponses: BotResponse[] = [
  {
    text: "Mình đang lắng nghe bạn. Bạn có thể kể thêm về điều đó không? Mình muốn hiểu hơn về hoàn cảnh của bạn để có thể hỗ trợ tốt hơn.",
    suggestedReplies: [
      "Mình đang lo lắng về học tập",
      "Mình có vấn đề cảm xúc",
      "Mình muốn hỏi về đời sống",
      "Mình cần lời khuyên",
    ],
    category: "khac",
  },
  {
    text: "Cảm ơn bạn đã tin tưởng chia sẻ với mình! Mình có thể giúp bạn về học tập, cảm xúc, bạn bè, gia đình, tình yêu, sức khỏe, và nhiều hơn nữa. Bạn muốn hỏi về điều gì cụ thể?",
    suggestedReplies: [
      "Mình cần giúp đỡ về học tập",
      "Mình đang cảm thấy không ổn",
      "Mình muốn hỏi về tình yêu học trò",
      "Mình có vấn đề với gia đình",
    ],
    category: "khac",
  },
  {
    text: "Mình muốn hiểu hơn về điều bạn đang trải qua. Bạn có thể nói rõ hơn không? Ví dụ: đây là về học tập, cảm xúc, bạn bè, hay điều gì khác?",
    suggestedReplies: [
      "Mình đang stress",
      "Mình muốn hỏi về phương pháp học",
      "Mình cần ai đó lắng nghe",
      "Mình có câu hỏi về đời sống",
    ],
    category: "khac",
  },
  {
    text: "Điểm Tựa ở đây để giúp bạn! Mình có thể hỗ trợ về: học tập & ôn thi, quản lý cảm xúc, các mối quan hệ, sức khỏe, tiền bạc, tình yêu học trò, và định hướng tương lai. Bạn đang cần gì?",
    suggestedReplies: [
      "Bí quyết học hiệu quả",
      "Làm sao giảm stress?",
      "Mình có vấn đề với bạn bè",
      "Tư vấn về tương lai",
    ],
    category: "khac",
  },
];

const categoryLabels: Record<ChatCategory, string> = {
  hoc_tap: "học tập",
  phuong_phap_hoc: "phương pháp học",
  dong_luc: "động lực",
  tam_ly: "tâm lý",
  lo_au: "lo âu",
  tu_tin: "tự tin",
  cam_xuc: "cảm xúc",
  quan_he: "quan hệ",
  tinh_yeu: "tình yêu",
  mang_xa_hoi: "mạng xã hội",
  suc_khoe: "sức khỏe",
  giac_ngu: "giấc ngủ",
  an_uong: "ăn uống",
  van_dong: "vận động",
  gia_dinh: "gia đình",
  tuong_lai: "tương lai",
  tien_bac: "tiền bạc",
  giai_tri: "giải trí",
  khan_cap: "khẩn cấp",
  chao_hoi: "chào hỏi",
  cam_on: "cảm ơn",
  gioi_thieu: "giới thiệu",
  khac: "khác",
};

const matchesText = (normalizedText: string, keyword: string): boolean => {
  const normKw = normalize(keyword);
  // Multi-word keywords: substring match is fine
  if (normKw.includes(" ")) return normalizedText.includes(normKw);
  // Single-word keywords: whole-word match to avoid false positives
  const words = normalizedText.split(/\s+/);
  return words.some((w) => w === normKw);
};

export function getBotResponse(userText: string, conversationHistory?: string[]): BotResponse {
  const normalized = normalize(userText);

  // First pass: match current message
  for (const rule of rules) {
    for (const keyword of rule.keywords) {
      if (matchesText(normalized, keyword)) {
        const responses = rule.responses;
        const response = responses[Math.floor(Math.random() * responses.length)];
        return {
          text: response,
          suggestedReplies: rule.suggestedReplies,
          category: rule.category,
        };
      }
    }
  }

  // Second pass: use conversation history for context-aware follow-up
  const contextHints = conversationHistory?.join(" ") || "";
  const normalizedContext = normalize(contextHints);

  for (const rule of rules) {
    for (const keyword of rule.keywords) {
      if (matchesText(normalizedContext, keyword)) {
        const label = categoryLabels[rule.category] || "của bạn";
        const continuationResponses = [
          `Tiếp tục về chủ đề ${label}, bạn có thể kể thêm không? Mình muốn nghe nhiều hơn.`,
          "Mình muốn nghe thêm. Điều đó ảnh hưởng đến bạn như thế nào?",
          "Bạn cảm thấy thế nào sau những gì đã xảy ra? Mình đang lắng nghe.",
        ];
        return {
          text: continuationResponses[Math.floor(Math.random() * continuationResponses.length)],
          suggestedReplies: rule.suggestedReplies,
          category: rule.category,
        };
      }
    }
  }

  const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  return fallback;
}
