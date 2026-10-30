# Colentis — Kế hoạch final

Ngày tổng hợp: 13/10/2026. Nguồn: kế hoạch ban đầu, mockup HTML, câu trả lời C01–C29 và ba câu trả lời bổ sung. Tài liệu này thay thế các quy tắc mâu thuẫn trong kế hoạch cũ. Đây là đặc tả để làm sau, chưa phải yêu cầu triển khai ngay.

## 1. Ý tưởng chính

Colentis là app lịch ghi chú cá nhân trong không gian chung, mang cảm giác album photocard. Mỗi người tự tạo, sửa, xóa và hoàn thành task của mình. Người cùng lịch xem để theo dõi nhau, không giao việc hoặc hoàn thành hộ nhau. Mỗi người một màu; streak, ảnh cá nhân và danh hiệu là riêng. Đủ điều kiện chung sẽ nhận thêm ảnh nhóm phủ lên ô ngày.

Ban đầu: 2 người ở Việt Nam, dùng iPhone và Android. App tiếng Việt, PWA, giờ cố định `Asia/Ho_Chi_Minh`, tuần bắt đầu thứ Hai.

## 2. Ngân sách bắt buộc: 0 đồng

- GitHub Free, repo public, GitHub Pages, địa chỉ `github.io` miễn phí. GitHub Actions chỉ dùng máy chạy tiêu chuẩn miễn phí cho repo public.
- Supabase Free cho tài khoản, dữ liệu, ảnh riêng tư và cập nhật giữa các thiết bị. Không nâng cấp, không bật tiện ích trả phí, không dùng bản thử sẽ chuyển sang thu tiền, không yêu cầu thêm thông tin thanh toán.
- Thư viện và font có quyền dùng miễn phí; frame người dùng cung cấp. Không mua asset, tên miền, hosting, SMS, dịch vụ email hoặc API AI. Không yêu cầu mua thêm công cụ lập trình/AI.
- Không xuất bản lên cửa hàng ứng dụng có phí; cài PWA bằng trình duyệt.
- Khi gần hết hạn mức: nén ảnh, tạm khóa tải lên mới hoặc giảm tính năng. Không tự chuyển sang trả phí; không xóa ảnh người dùng đã có để dọn chỗ nếu chưa được đồng ý.
- Dịch vụ tạm dừng vì lâu không dùng: chủ app bật lại thủ công. Không cần tác vụ truy cập giả định kỳ để giữ dịch vụ hoạt động.
- Dịch vụ bên thứ ba có thể đổi chính sách: khi đó tìm phương án miễn phí khác hoặc tạm dừng, không phát sinh phí. Không hứa miễn phí vô hạn hoặc hoạt động liên tục mãi mãi.

Nguồn kiểm tra ngày 13/10/2026: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages), [GitHub Actions](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job), [Supabase Free không bị tính phí](https://supabase.com/docs/guides/platform/cost-control), [tạm dừng project Free](https://supabase.com/docs/guides/platform/free-project-pausing). Kiểm tra lại điều kiện trước khi triển khai.

## 3. Phạm vi bản đầu

### Tính năng

1. Email + mật khẩu; thiết lập hồ sơ, username, avatar, ngày sinh tùy chọn; đăng xuất. Nhóm kín, đủ tài khoản thì đóng đăng ký.
2. Lịch tháng, chi tiết ngày, trang Hôm nay; thêm/sửa/xóa/tick task cá nhân.
3. Tạo và chuyển lịch; kết bạn qua username chính xác; mời, rời và quản lý thành viên.
4. Cập nhật task giữa các thiết bị; thông báo trong app.
5. Streak cá nhân, ngày trống, tick bù, 5 thẻ cứu streak/tháng.
6. Kho ảnh cá nhân và nhóm, nhận ảnh, album hai tab, thống kê số lần nhận ảnh trùng.
7. Thành tựu, danh hiệu và hai frame động cho mỗi danh hiệu.
8. Theme riêng theo từng lịch, nền từng tháng, chế độ tối theo máy.
9. Hòm thư nhận quà admin.
10. Cài PWA; xem và tạo/tick task offline, đồng bộ khi có mạng; hướng dẫn cài trên iPhone/Android.

### Để sau

Xem tuần/ngày, task lặp lại, task nhiều ngày/qua đêm, push khi app đóng, đăng nhập Google, đa ngôn ngữ, xuất/nhập sao lưu trong app, liên kết Google Calendar, ưu tiên/bình luận/đính kèm, thanh toán và app store.

C02 chưa được chọn: mặc định bản đầu xem tháng như gợi ý A; đây là lựa chọn phạm vi có thể đổi. Không bổ sung các tính năng để sau chỉ vì có trong roadmap cũ.

## 4. Lịch và task

- Tối đa 4 lịch/người, tính cả lịch được mời; tối đa 6 thành viên/lịch (đã chốt 14/10/2026). Lịch mặc định cũng tính vào giới hạn.
- Chỉ hai vai trò: chủ lịch và thành viên. Chủ lịch quản lý lịch/thành viên, không có quyền sửa, xóa hoặc tick task của người khác.
- Task: tiêu đề, ghi chú, ngày, giờ bắt đầu/kết thúc tùy chọn, cả ngày và nhãn màu. Bỏ chọn người được giao: chủ task chính là người tạo.
- Người trong lịch xem task của nhau; chỉ chủ task được thay đổi task đó. Màu thành viên đi kèm tên/avatar; nhãn task là thẻ có chữ.
- Người rời lịch: task của họ biến mất khỏi lịch chung, không chuyển cho người khác. Đề xuất kỹ thuật: loại khỏi hiển thị và điều kiện thưởng hiện tại, giữ bản ghi tối thiểu để không làm sai thưởng/streak đã chốt. Ảnh và danh hiệu đã nhận vẫn giữ.
- Chủ lịch muốn rời phải chuyển chủ hoặc xác nhận xóa lịch. Không thu hồi phần thưởng đã nhận khi lịch bị xóa.
- Người mới vào xem lịch sau khi chấp nhận; không nhận lại ảnh nhóm của ngày trước lúc tham gia. Đề xuất: bắt đầu xét thưởng từ ngày tiếp theo để tránh thay đổi điều kiện giữa ngày.

## 5. Ảnh cá nhân và ảnh nhóm

### Cá nhân

- Gộp tất cả task của một người trên mọi lịch để xét ngày hoàn thành.
- Có ít nhất 1 task và hoàn thành 100% thì nhận đúng 1 ảnh cá nhân/ngày. Ngày trống không tự có ảnh cá nhân.
- Thẻ cứu streak là ngoại lệ: ngày được cứu vẫn tăng streak và nhận ảnh cá nhân theo yêu cầu người dùng.
- Một ngày không được quay thưởng lại qua việc gửi lại thao tác, đổi lịch, reload hoặc dùng thêm thẻ.

### Nhóm

- Mọi thành viên của lịch chung đều đủ điều kiện ngày: hoàn thành toàn bộ task của mình trên mọi lịch, hoặc ngày trống, hoặc dùng thẻ cứu hợp lệ.
- Ngày một người trống vẫn có thể nhận ảnh nhóm. Ngày cả hai trống vẫn có thể nhận ảnh nhóm. Ngày được cứu cũng đủ điều kiện nhóm. Đây là các lựa chọn người dùng đã xác nhận.
- Lịch riêng một người không cấp ảnh nhóm. Ảnh nhóm là cùng một ảnh cho những người đủ điều kiện nhận của nhóm, phủ ô ngày; số ngày vẫn hiện nhỏ trên ảnh.
- Giới hạn đã xác nhận: mỗi người tối đa 1 ảnh cá nhân + 1 ảnh nhóm/ngày, tổng tối đa 2.
- Với nhiều lịch chung, không được random thêm ảnh nhóm mới cho một người đã nhận ảnh nhóm hôm đó. **Đề xuất vận hành bản đầu:** chọn một lịch chung làm lịch thưởng nhóm chính; task cá nhân vẫn gộp mọi lịch. Các lịch chung khác để xem/ghi chú, chưa cấp ảnh nhóm. Cần xác nhận quy tắc này trước phần code thưởng nhiều nhóm; không tự đổi giới hạn 2 ảnh/ngày.
- Ngày trống chỉ chốt sau khi ngày kết thúc, tránh phát thưởng ngay 0h khi task chưa được ghi. App kiểm tra khi mở hoặc đồng bộ; không cần tác vụ trả phí chạy nền.

### Khóa ngày

- Nhận ảnh cá nhân hoặc dùng thẻ cứu: khóa task của chính người nhận trong ngày đó trên mọi lịch; không thêm/sửa/xóa/bỏ tick nữa.
- Nhận ảnh nhóm: khóa ngày của các người nhận. Người khác chưa nhận thưởng vẫn được làm task của họ cho đến khi đủ điều kiện.
- Khóa là theo người và ngày; một người nhận ảnh cá nhân không được khóa task người còn lại.
- Trước khi nhận có thông báo ngắn “Nhận ảnh sẽ khóa việc của bạn trong ngày này”. Đề xuất có nút xác nhận nhận ảnh để không khóa bất ngờ ngay khi tick task cuối. Server cấp và lưu ảnh ngay khi xác nhận; đóng màn hình nhận ảnh không làm mất quà.
- Ngày đã khóa chỉ xem lại. Không dùng quy tắc gỡ dấu/chờ 10 phút cũ.

### Hiển thị thưởng

Sau xác nhận: hiển thị lần lượt ảnh cá nhân, ảnh nhóm và danh hiệu mới nếu có. Ảnh tự lưu, nút “Tiếp tục”/“Xem bộ sưu tập” chỉ điều hướng. Ảnh trùng ghi “Bạn đã có ảnh này”, tăng số lần nhận. Nếu app đóng giữa hiệu ứng, thưởng vẫn có trong album và hòm thư/thông báo; không cấp lại.

## 6. Kho ảnh và tỷ lệ

- Hai loại `personal` và `group`; mỗi loại có common / rare / legendary / supreme tương ứng Thường / Hiếm / Huyền Thoại / Bá khí.
- Kho cá nhân dự kiến test: 30 / 30 / 15 / 4, không phải số lượng cố định vĩnh viễn. Kho nhóm sẽ được bổ sung; phải có ảnh hợp lệ trước khi bật thưởng nhóm.
- Tỷ lệ cơ sở đề xuất giữ 70 / 22 / 7 / 1. Cho phép trùng.
- Khi thu thập đủ một độ hiếm, tăng khả năng nhận các độ hiếm chưa đủ. **Đề xuất công thức dễ kiểm tra:** loại mức đã đủ khỏi lượt quay, chia lại tỷ lệ theo trọng số còn lại. Ví dụ đủ Thường: Hiếm 73,33%, Huyền Thoại 23,33%, Bá khí 3,33%. Mức không có ảnh cũng không tham gia quay.
- Nếu đã đủ tất cả, quay lại tỷ lệ cơ sở và nhận ảnh trùng. Việc loại hoàn toàn mức đã đủ là đề xuất cụ thể, chưa phải mức tăng người dùng đã xác nhận; chốt trước khi triển khai random.
- Quy tắc không trùng liên tiếp và bảo đảm Hiếm sau 14 lần chưa được Hiếm trở lên: chưa được trả lời riêng; để là tùy chọn chưa bật trong bản đầu, không ngầm thêm vào cơ chế mới.
- Thêm ảnh sau không làm mất danh hiệu “đủ bộ” đã nhận; số đếm album cập nhật theo kho hiện tại.
- Ảnh thật ở bucket riêng tư, không trong repo public. Chỉ tài khoản có quyền xem mới tải được. File JSON lưu ID/đường dẫn, không chứa ảnh thật.

## 7. Streak, ngày trống, tick bù và thẻ cứu

- Streak riêng theo tài khoản, không theo lịch. Ngày có task: hoàn thành ít nhất 1 task thì tăng streak; hoàn thành 100% mới cấp ảnh cá nhân.
- Ngày không có task vẫn tính một ngày streak, không đứt. Chốt ngày trống sau cuối ngày; giữ cả dấu phân biệt ngày trống để không tính nhầm thành task đã làm.
- Ngày có task nhưng không hoàn thành task nào: đứt streak, có thể nối lại bằng tick bù hoặc thẻ trong hạn.
- Tick bù tối đa 48 giờ sau thời điểm ngày đó kết thúc; chỉ task đã tồn tại trước khi ngày kết thúc, chưa khóa. Không tạo task mới cho ngày quá khứ để lấy thưởng.
- Tick bù tính lại chuỗi theo thứ tự ngày, không chỉ cộng vào ngày mới nhất; có thể cấp ảnh nếu đủ điều kiện.
- 5 thẻ mỗi tháng, tự bấm, không dồn. Dùng trong 48 giờ sau cuối ngày cần cứu. Ngày cứu tăng streak, tính vào mốc danh hiệu streak và cấp ảnh; không đánh dấu các task chưa làm thành đã hoàn thành, không cộng chúng vào tổng task hay thành tựu làm việc theo giờ/ngày lễ.
- Không tiêu thẻ cho ngày trống đã hợp lệ, ngày đã đạt streak hoặc ngày đã nhận thưởng. Thẻ làm khóa ngày nên không tick bù tiếp để hoàn thẻ sau đó. Quy tắc này thay thế gợi ý hoàn thẻ cũ, nhằm nhất quán với khóa ngày.
- Thẻ dùng qua đầu tháng trừ vào ngân sách tháng chứa ngày được cứu; không đổi tháng để nhận thêm thẻ cho cùng ngày.
- Thành tựu số task chỉ đếm mỗi task hoàn thành một lần; không tăng do bỏ tick/tick lại trước khóa.

## 8. Danh hiệu và hai frame động

- Mỗi thành tựu cấp một danh hiệu cố định, không random.
- Mỗi danh hiệu có một cặp frame riêng, không trùng cặp khác: frame tròn cho avatar và frame ngang cho tên danh hiệu.
- Tên hiển thị là chữ nằm trong vùng trống của frame ngang; giữ nguyên tên người dùng đã điền. Chọn danh hiệu tự đeo cả hai frame tương ứng.
- Không ép chữ, nén thành một cục hoặc cắt tên. Nếu dài: tăng chiều ngang khung một cách giữ đúng hình và hiệu ứng. Ưu tiên chia vùng trái/giữa/phải hoặc dùng file gốc có thể chỉnh sửa; không kéo giãn toàn ảnh làm méo họa tiết.
- Chưa chỉnh frame cho đến khi được gửi. Khi nhận: kiểm tra định dạng ảnh động, vùng an toàn chữ/avatar, độ dài tên, kích thước nhỏ và khả năng mở rộng. Nếu asset không thể mở rộng đẹp, nêu phương án cụ thể để người dùng chọn; không hứa mọi ảnh động đều kéo dài được.
- Có bản tĩnh/chế độ giảm chuyển động; không thêm dịch vụ chuyển đổi trả phí. Lazy-load frame, chỉ chạy animation nơi đang nhìn thấy.

| Điều kiện nhận | Tên danh hiệu |
| --- | --- |
| Streak 3 ngày | dạ gỗ xà cừ |
| Streak 7 ngày | trường giang |
| Streak 14 ngày | 14 ngày nhớ em remix |
| Streak 30 ngày | tại sao người mù lại cô đơn |
| Streak 60 ngày | kkkkkkkkkkkk |
| Streak 100 ngày | thuận buồi xuôi dái |
| Streak 365 ngày | loz má dai dữ |
| Hoàn thành 10 task | CHUC MUNG THANG LON |
| Hoàn thành 100 task | lady boi có cái vòi ở giữa |
| Hoàn thành 500 task | cập nhật giá vàng mỗi ngày |
| Hoàn thành 1.000 task | tiểu tam chung thủy |
| Kết bạn lần đầu | cu 3 mét lét i bê |
| Nhận ảnh nhóm lần đầu | xuân Bính Ngọ, lọ thật sung |
| Hoàn thành task lúc 0–4 giờ sáng | chạy thận hả má |
| Hoàn thành task ngày sinh nhật | mừng ra đời tại nhà |
| Hoàn thành task ngày 1/1 | chưa tết ta đâu b |
| Hoàn thành task ngày 14/2 | có bồ chưa b |
| Hoàn thành task ngày 2/9 | hôm qua là 1/9 |
| Hoàn thành task ngày 25/12 | mê ri quỵt mệch |
| Hoàn thành task mùng 1 Tết Nguyên đán | lì xì tao mau alo |
| Đủ ảnh cá nhân Thường | hồi chiều trời mưa |
| Đủ ảnh cá nhân Hiếm | e là không thể |
| Đủ ảnh cá nhân Huyền Thoại | ra đường ngậm cục cơm |
| Đủ ảnh cá nhân Bá khí | aura +99999 |

Ngày lễ bản đầu dùng các ngày có danh hiệu trong bảng. Tết vẫn giữ, tính theo âm lịch Việt Nam; ngày kỷ niệm tự thêm chỉ theo dương lịch. Không tự thêm các lễ khác. Ngày sinh 29/2 ở năm không nhuận: đề xuất 28/2, chưa được trả lời riêng. Thành tựu lễ/sinh nhật/đêm tính theo ngày giờ hoàn thành thực tế, không ngày của task tick bù và không được cấp chỉ vì dùng thẻ cứu.

## 9. Hòm thư và quà admin

- Hòm thư nằm trong app, có chấm chưa đọc; không dùng email trả phí.
- Admin gửi thư cho một hoặc nhiều người: tiêu đề, lời nhắn và quà; user mở thư, bấm “Nhận quà”.
- Bản đầu hỗ trợ ảnh có sẵn, danh hiệu kèm cặp frame và thẻ cứu bổ sung. “Bất cứ thứ gì” được hiểu là thiết kế có thể thêm loại quà sau, không phải chạy file/mã tùy ý hoặc tự hỗ trợ mọi loại vật phẩm ngay.
- Quà danh hiệu cấp quyền sở hữu, không giả tạo thành tựu đã làm. Quà trùng ảnh tăng số lần nhận; danh hiệu trùng không nhân bản. Quà admin là quà bổ sung, không tính vào hạn mức 2 ảnh thưởng ngày và không khóa ngày.
- Quà nhận được đúng một lần dù bấm lại, mất mạng hoặc đổi thiết bị. Không tự hết hạn trong bản đầu.
- Trang gửi thư admin nhỏ, dùng cùng PWA và cùng dịch vụ miễn phí. Vai trò admin app khác chủ lịch; chỉ tài khoản admin được gửi/cấp quà. Không đặt khóa bí mật trong frontend hoặc repo.
- Frame gắn danh hiệu đi theo cặp. Frame độc lập và vật phẩm mới là phần mở rộng sau, không tự tách cặp đã chốt.

## 10. Giao diện và quyền riêng tư

- Bám mockup album photocard, bảng màu tím/hồng/xanh/vàng. Dựng tokens và trang style guide để duyệt trước màn còn lại.
- Đề xuất giữ 5 tab: Lịch / Hôm nay / Ảnh / Bạn bè / Hồ sơ; mặc định mở Lịch. Hai lựa chọn này chưa được trả lời riêng, có thể đổi khi duyệt UI.
- Hòm thư có lối vào rõ ở đầu màn; ảnh cá nhân và nhóm có hai tab album.
- Nền riêng theo người/lịch/tháng; đảm bảo chữ đọc được; font tiếng Việt lưu trong app để offline.
- Phải có trạng thái trống, tải, lỗi, mất mạng, chờ đồng bộ, ngày khóa, ngày cứu, ảnh trùng và ngày trống. Kiểm tra tháng 6 hàng, chữ lớn, tên dài và màn hình nhỏ.
- Người lạ: chỉ tên/avatar khi nhập đúng username; bạn bè xem mục hồ sơ được bật; chỉ thành viên lịch xem task. Album cá nhân mặc định riêng tư, có thể bật cho bạn bè; album nhóm chỉ người được quyền nhận/xem. Không có nút chặn trong bản đầu.
- Username giữ regex cuối của kế hoạch cũ: chữ thường/số/gạch dưới, 4–19 ký tự; tìm đúng toàn bộ username, có tùy chọn không cho tìm thấy.

## 11. Kỹ thuật và dữ liệu

Stack: Vite, React, TypeScript, Tailwind, router hash, vite-plugin-pwa, TanStack Query, Zustand, date-fns, Supabase JS; crop và nén ảnh bằng thư viện miễn phí. Lịch tháng tự dựng. Frontend ở GitHub Pages, database/Auth/Storage/Realtime ở Supabase Free.

Các nhóm dữ liệu chính:

| Nhóm | Nội dung |
| --- | --- |
| Hồ sơ và bạn bè | profile, username, sinh nhật tùy chọn, cài đặt riêng tư, quan hệ bạn bè |
| Lịch và thành viên | chủ lịch, thành viên, màu, ngày tham gia/rời, tùy chọn lịch thưởng nhóm |
| Task | người sở hữu, lịch, ngày, giờ, cả ngày, nhãn, trạng thái, thời điểm hoàn thành |
| Trạng thái ngày | theo người/ngày; tổng task mọi lịch, streak, trống/cứu, thời điểm khóa |
| Phần thưởng | bản ghi cấp ảnh cá nhân/nhóm, ảnh đã quay, người nhận, nguồn ngày/admin |
| Kho ảnh/album | loại cá nhân/nhóm, độ hiếm, đường dẫn riêng tư, số lần nhận |
| Thành tựu/danh hiệu | điều kiện, tên, cặp asset frame, đã nhận, đang đeo |
| Thẻ cứu | tháng, số đã dùng, ngày được cứu, thẻ quà admin tách riêng |
| Hòm thư | người gửi/nhận, lời nhắn, quà, đã đọc/đã nhận |
| Theme | theo người/lịch; nền theo năm-tháng |

- Xét thưởng, khóa ngày, dùng thẻ và nhận quà chạy trên server, trong giao dịch nhất quán. Client không tự ghi quyền sở hữu, streak, vai trò admin hoặc kết quả thưởng.
- Ràng buộc ngăn cấp trùng theo người/ngày/loại thưởng và thư/người nhận; nhóm nhận cùng một ảnh từ cùng kết quả server.
- Phân quyền cả database và Storage: không xem task lịch ngoài, không sửa task người khác kể cả chủ lịch, không sửa quà admin hoặc gọi hàm cấp thưởng tùy ý.
- Dùng thời gian server theo giờ Việt Nam; lưu lịch sử ngày để tính lại streak đúng khi tick bù. Kết quả cũ không bị đổi vì rời lịch.
- Offline: cache dữ liệu đã được phép xem, tạo/tick task có mã thao tác chống gửi trùng; chỉ chốt thưởng online. Khi server đã khóa ngày hoặc quyền bị thu hồi, từ chối thao tác cũ và giải thích cho user.
- Hai thiết bị của cùng người sửa một task: phát hiện phiên bản thay đổi, yêu cầu xem lại, không tự ghi đè âm thầm. Đăng xuất xóa cache riêng; URL ảnh hết hạn được làm mới online.
- Mọi migration, dữ liệu mẫu và hướng dẫn cấu hình nằm trong repo; ảnh thật và khóa bí mật không nằm trong repo/lịch sử commit. Xuất/nhập trong app để sau, nhưng giữ hướng dẫn phục hồi thủ công và bản migration.

## 12. Thứ tự thực hiện sau khi được yêu cầu bắt đầu

1. Chốt các điểm đề xuất còn lại bên dưới; nhận và kiểm tra frame/ảnh thật. Không tự chỉnh file người dùng chưa gửi.
2. Duyệt style guide, hai frame mẫu với tên dài nhất, lịch tháng và màn nhận ảnh; dùng asset giữ chỗ nếu ảnh thật chưa đủ.
3. Nền tảng PWA/hosting miễn phí, tài khoản, database và phân quyền task cá nhân.
4. Lịch tháng/Hôm nay/chi tiết ngày; task; lịch chung và màu; mời/rời; realtime.
5. Streak/ngày trống/tick bù/thẻ cứu, khóa ngày và phần thưởng; album và cơ chế đổi tỷ lệ.
6. Thành tựu, hai frame động, theme và riêng tư.
7. Hòm thư admin và nhận quà.
8. Offline, cập nhật PWA, kiểm tra iPhone/Android và rà soát chi phí/quyền truy cập.

Sau từng giai đoạn: build, kiểm tra TypeScript/lint; kiểm tra trực tiếp các tiêu chí thay đổi. Không làm nhiều tính năng mới trước khi phần cốt lõi hoạt động đúng.

## 13. Tiêu chí nghiệm thu quan trọng

- A chỉ sửa/tick task A; B và chủ lịch không sửa được task A kể cả gọi trực tiếp API.
- Hoàn thành task mọi lịch chỉ nhận 1 ảnh cá nhân/ngày; đúng ảnh khi mở lại.
- Cả hai đủ điều kiện nhận chung cùng một ảnh; trống và cứu ngày xử lý đúng; giới hạn ngày không bị vượt do nhiều lịch.
- Nhận ảnh khóa đúng người/ngày, kể cả tạo/sửa offline trước đó rồi gửi lại.
- Tick bù nối đúng chuỗi; thẻ tự bấm, không dồn, không tiêu hai lần; ngày trống tăng streak nhưng không tự cấp ảnh cá nhân.
- Ảnh trùng tăng đếm; đủ một mức làm đổi tỷ lệ theo công thức đã duyệt; thêm ảnh không thu hồi danh hiệu.
- Một danh hiệu hiển thị đủ cặp frame, tên dài không bị ép/cắt/méo; giảm chuyển động có hiệu lực.
- Admin gửi quà, user chỉ nhận một lần; user thường không gửi/cấp quà được.
- Rời lịch mất hiển thị task của người rời, không chuyển task; lịch sử thưởng đã chốt đúng.
- Cài và mở PWA trên iPhone/Android; offline đồng bộ không trùng thao tác; đăng xuất không lộ dữ liệu tài khoản trước.
- Không có dịch vụ trả phí, khóa bí mật trong repo, đường dẫn ảnh thật công khai hoặc tự nâng cấp khi hết hạn mức.

## 14. Các điểm cần duyệt trước phần triển khai liên quan

Đã chốt ba câu bổ sung: giữ Tết, gộp task mọi lịch, cả ngày trống và ngày dùng thẻ đều đủ điều kiện ảnh nhóm.

Còn ba lựa chọn sản phẩm quan trọng chưa được trả lời đầy đủ:
1. Nhiều lịch chung: dùng một lịch thưởng nhóm chính để giữ tối đa 2 ảnh/ngày, hay một cách khác không vượt giới hạn?
2. Đủ một độ hiếm: loại hẳn mức đó khỏi quay như công thức mục 6, hay vẫn cho rơi nhưng giảm tỷ lệ? Nếu giữ, cần tỷ lệ mong muốn.
3. Nhận ảnh và khóa ngày: có nút xác nhận trước khi khóa như mục 5, hay tự cấp/khóa ngay tick task cuối?

Các mặc định nhỏ để duyệt cùng UI: phạm vi xem tháng trước; 5 tab/mở Lịch; người mới xét từ hôm sau; sinh nhật 29/2 dùng 28/2 năm không nhuận. Không cần trả lời kỹ thuật. Frame, kho nhóm và các file ảnh thật sẽ gửi sau.

## Quyết định mới — một bộ sưu tập (14/10/2026)

Mục này thay thế mọi mô tả tách kho/album cá nhân và nhóm trong tài liệu trên. Chỉ có một kho thẻ, phân bốn độ hiếm; mỗi người có album sở hữu riêng, gộp thẻ từ mọi nguồn. Hoàn thành cá nhân và hoàn thành nhóm là hai nguồn nhận thưởng, cùng lấy từ kho này. Nhận trùng tăng số lần sở hữu; tối đa 2 thẻ/người/ngày từ thưởng ngày. Thẻ nhóm vẫn là dấu mộc trên lịch. Không còn hai tab ảnh cá nhân/ảnh nhóm. Thành tựu đủ bộ tính trên kho chung. Trường kind của kho thẻ không còn cần; nguồn nhận personal/group/admin lưu ở lịch sử phần thưởng. Danh hiệu đã nhận vẫn giữ.

Kho localhost: outputs/colentis-local/assets/cards, với common, rare, legendary, supreme. Chép ảnh vào thư mục độ hiếm rồi tải lại trang; server tự nhận danh sách. Bản test mở đủ ảnh thật đã thêm, hoặc 79 placeholder nếu toàn kho chưa có ảnh thật. Khi triển khai online, chuyển ảnh thật vào Storage riêng tư, không commit repo public.


## Thẻ sự kiện: sinh nhật James (14/10/2026)

- Thư mục ảnh: `local-cards/event-birthday-james/` (kho riêng, không thuộc 4 độ hiếm, không vào lượt quay ngẫu nhiên). Công cụ `scripts/prepare-cards.mjs` đã xử lý thư mục này, ghi `event: "event-birthday-james"` trong manifest.
- Cách nhận: tặng thẳng cho người chơi **đăng nhập vào ngày 14/10** (giờ Asia/Ho_Chi_Minh). Không cần hoàn thành task, không quay thưởng.
- Chạy trên server: khi đăng nhập hợp lệ trong ngày 14/10, server cấp thẻ một lần cho tài khoản đó, ràng buộc duy nhất theo (tài khoản, sự kiện). Client không tự cấp.
- Thẻ vào album, hiện trong hòm thư/thông báo như quà admin; không tính vào hạn mức 2 thẻ/ngày và không khóa ngày.
- Thẻ có nhãn "Sự kiện" riêng, không đếm vào tiến độ "đủ bộ" của 4 độ hiếm.
- Số lượng: thư mục có **5 thẻ**, mỗi thẻ mang một nhãn độ hiếm khác nhau. Mỗi người đủ điều kiện nhận **ngẫu nhiên 2 trong 5 thẻ** (hai thẻ khác nhau, không trùng) trong một lần, mỗi thẻ một bản ghi riêng. Kết quả do server chốt một lần, mở lại hay đổi thiết bị không đổi thẻ.
- Nhãn riêng của 5 thẻ, từ thấp đến cao: **A – S – SS – SSS – AURA**; hệ nhãn riêng của thẻ sự kiện, tách khỏi 4 độ hiếm Thường/Hiếm/Huyền Thoại/Bá khí. Màu và hiệu ứng: A vàng, S cam, SS đỏ, SSS vàng pha đỏ, AURA cầu vồng; viền neon phát sáng, mỗi bậc một kiểu hiệu ứng tỏa ra, có bánh sinh nhật ở góc. Thiết kế đã duyệt: `design/reference/event-card-preview.html`.
- Cách chọn 2 thẻ (đã chốt 14/10/2026): chọn 2 thẻ khác nhau có trọng số, không hoàn lại. **Mỗi người có 15% nhận AURA; 4 thẻ còn lại chia đều, mỗi thẻ 46,25%** (tổng 2 thẻ/người). Với cách chọn có trọng số này, trọng số cấu hình là A = S = SS = SSS = 1 và AURA ≈ 0,29 (tính để xác suất nhận AURA đúng 15%). Hằng số cấu hình dễ chỉnh; nếu đổi con số 15% thì tính lại trọng số.
- Lặp lại hằng năm: mỗi năm ngày 14/10 là **một bộ thẻ khác** (thẻ mới, không tặng lại bộ cũ). Mỗi bộ là một sự kiện riêng: thư mục `local-cards/event-birthday-james-<năm>/`; bộ 2026 hiện đặt tên `event-birthday-james` (coi là bản 2026, có thể đổi tên thành `event-birthday-james-2026`). Ràng buộc duy nhất theo (tài khoản, sự kiện-năm), nên người nhận bộ 2026 vẫn nhận bộ 2027. Thẻ các năm trước vẫn nằm trong album, không bị thu hồi; sự kiện năm cũ không mở lại cho người chưa nhận. Mỗi bộ có thể có số thẻ và nhãn riêng (khai báo trong cấu hình sự kiện).
- Quy tắc mặc định (chờ xác nhận nếu muốn đổi): (1) chỉ tặng đúng ngày 14/10 của năm đó, ai đăng nhập sau ngày đó thì không nhận; (2) mỗi tài khoản nhận một lần cho mỗi bộ.

### Ảnh thẻ sinh nhật James đã có (14/10/2026)
Tên file = nhãn: `A.jpeg`, `S.jpeg`, `SS.jpeg`, `SSS.jpeg`, `AURA.jpg`. Hướng ảnh: A dọc (2:3), S ngang (3:2), SS ngang (3:2), SSS dọc (2:3), AURA dọc (3:4).

## Quy tắc hiển thị theo hướng ảnh (áp dụng cho mọi thẻ)
- Ảnh **ngang** hiển thị trong **thẻ ngang** (khung ngang, tỉ lệ theo ảnh); ảnh **dọc** hiển thị trong **thẻ dọc**. Không cắt ảnh khi nhận thẻ, xem chi tiết và trong album.
- Màn nhận thẻ: thẻ ngang xoay vào giữa màn ở dạng ngang (có thể xoay nhẹ khi mở), thẻ dọc ở dạng dọc. Lưới album dùng ô cao bằng nhau, thẻ ngang nằm trong ô với dải trống hai bên.
- Ô ngày trên lịch vẫn phủ kín bằng cách cắt giữa ảnh (`object-fit: cover`); có thể ghi điểm lấy nét riêng cho từng ảnh.
- Hướng ảnh đọc từ `manifest.json` (`orientation: landscape | portrait`, kèm `width`, `height`).


## Mặt sau thẻ và hiệu ứng theo độ hiếm (14/10/2026)

- **Mặt sau thẻ:** nền tím sọc chéo như mockup, ở giữa có logo nhóm in chìm (trắng, độ mờ khoảng 12–16%), không che chữ. Logo nguồn: `public/assets/brand/cortis-logo.png` (đen trong suốt) và `cortis-logo-white.png`. Dùng cho màn mở thẻ và ô thẻ chưa lật.
- **Hiệu ứng thẻ theo hạng** (thiết kế đã duyệt: `design/reference/rarity-card-preview.html`): Thường = ánh holo + sóng bạc nhẹ; Hiếm = viền neon xanh có vệt sáng chạy, sóng và cột sáng; Huyền Thoại = viền vàng-tím xoay, tia sáng xoay hai lớp, hạt quay quanh, loé định kỳ; Bá khí = mỗi thẻ một kiểu riêng, màu lấy theo ảnh (cấu hình `effect` + hai màu trong manifest). Hiệu ứng chỉ chạy khi thẻ nằm trong màn hình; tắt khi bật giảm chuyển động.

## Màn mở đầu và Quà Tân binh CORTIS

Tham chiếu: `design/reference/colentis-app.html` (mục "Mở đầu" trong bảng demo) và `design/reference/tan-binh-preview.html`.

### Luồng
1. **Màn tải**: logo CORTIS trong vòng xoay nhiều màu, thanh tiến trình, dòng trạng thái đổi theo thời gian.
2. **Đăng nhập / Đăng ký**: ảnh nhóm ở đầu trang, tab chuyển trượt, email + mật khẩu (có nút hiện mật khẩu), đăng ký thêm tên hiển thị, "Tiếp tục với Google". Kiểm tra: tên ≥ 2 ký tự, email hợp lệ, mật khẩu ≥ 6 ký tự; lỗi hiện dưới từng ô. Cần có mạng.
3. **Thư "Quà Tân binh CORTIS"** tự có trong hòm thư sau khi đăng ký và tự mở. Bấm "Nhận quà" để bắt đầu chuỗi nhận quà (nhận đúng một lần, không tính vào giới hạn 2 thẻ/ngày). Thư này thay cho thư "Quà cảm ơn người chơi đầu tiên".

### Chuỗi nhận quà (5 bước, có thanh tiến độ)
1. **Nhận khung Tân binh**: khung tròn bay vào, khung ngang trượt vào. Tên danh hiệu đang ẩn ("? ? ?").
2. **Chọn thành viên** (Juhoon, Keonho, Martin, Seonghyeon, James): trong danh sách chỉ hiện tên thành viên, không hiện tên danh hiệu. Sau khi xác nhận, khung ngang rung, loé sáng rồi tiết lộ tên danh hiệu. Chọn một lần lúc đăng ký (đổi lại sau: chờ quyết định).
3. **2 thẻ cứu**: đếm +1, +2, cộng vào kho thẻ cứu (giới hạn tối đa vẫn theo quy tắc thẻ cứu hiện hành).
4. **Xé gói thẻ**: gói rơi xuống, người chơi vuốt ngang qua miệng gói để xé (miệng gói hé sáng dần, mảnh xé cuộn lên), xé hết thì mảnh bay đi, loé sáng, chùm tia và vụn giấy. Có thể chạm vào gói để xé tự động.
5. **Lật từng thẻ** (5 thẻ): chồng thẻ úp, thẻ trên cùng phát sáng theo độ hiếm (Thường không sáng, Hiếm xanh, Huyền Thoại tím, Bá khí hồng). Chạm để lật; Hiếm trở lên có đoạn rung hồi hộp trước khi lật; Huyền Thoại và Bá khí thêm chớp sáng, rung màn hình, vòng sóng và hạt. Mỗi thẻ hiện tên độ hiếm, tên thẻ, "Thẻ mới" hoặc "Đã có ×n", rồi bay xuống ô trong khay 5 ô. Thẻ xếp từ thấp đến cao để thẻ hiếm nhất lật cuối.
6. **Tổng kết**: 5 thẻ, thẻ cứu ×2, tên danh hiệu. Danh hiệu được tự đeo.

### Tỉ lệ 5 thẻ
Mỗi thẻ: Thường 66, Hiếm 24, Huyền Thoại 8.2, Bá khí 1.8 (càng hiếm càng khó). Chắc chắn có ít nhất 1 thẻ từ Hiếm trở lên: nếu cả 5 đều Thường thì nâng một thẻ lên Hiếm. Tránh trùng thẻ trong cùng gói.

### Lựa chọn và danh hiệu Tân binh
| Thành viên | Danh hiệu |
|---|---|
| Juhoon | shoulder kimchi |
| Keonho | finger burger |
| Martin | finger-joint egg roll |
| Seonghyeon | knne panini |
| James | neck chow mein |

- Id danh hiệu: `welcome-1` đến `welcome-5`, cùng dùng một cặp khung `welcome-avatar.svg` và `welcome-title.svg`. Chữ do app vẽ, không nằm trong SVG.
- 5 danh hiệu này không nằm trong 24 danh hiệu thường, không hiện trong bộ sưu tập danh hiệu.

### Frame Tân binh
Tông xanh sage và đen theo logo CORTIS. Khung tròn: viền gợn sóng, chồi đen quanh viền, huy hiệu logo ở đáy, vòng chấm quay chậm. Lúm, Kẹo, Trà My, Tin, Jju lần lượt "búng" ra khỏi viền như sticker (chu kỳ 10 giây). Khung ngang: logo bên trái, từ đổi lần lượt bên phải, ô chữ nền tối để chữ luôn đọc được. Khi bật giảm chuyển động thì khung đứng yên.

### Quà trong thư sinh nhật James
Thư sự kiện sinh nhật James gồm **2 thẻ sự kiện** (AURA 15%, các hạng còn lại chia đều) và **khung sinh nhật James** (id `birthday-james`). Khung này khác danh hiệu thường `birthday` ("mừng ra đời tại nhà"). Nhận đúng một lần, không tính vào giới hạn 2 thẻ/ngày.
- Khung tròn: `birthday-james-avatar.svg` (bản do bạn thiết kế, 640×640, ảnh đại diện nằm dưới, đường kính 62,5% khung, tức cách mép 18,75%). Khác khung thường (70,3125%), nên app cần cấu hình vùng ảnh riêng cho khung này.
- Khung ngang: `birthday-james-title.svg` do mình làm tạm cho khớp tông hồng (chưa có bản chính thức), tên hiển thị "Sinh nhật James". Cần xem lại.
- Khung chỉ hiện trong "Danh hiệu và khung" sau khi nhận thư, không nằm trong 24 danh hiệu thường.

## Chỉnh sửa hồ sơ

Vào từ Hồ sơ: bấm vào ảnh đại diện hoặc nút "Chỉnh sửa hồ sơ" (khung bên dưới tên). Mở dạng bảng trượt từ dưới lên. Tham chiếu: `design/reference/colentis-app.html`.

- **Ảnh đại diện**: chọn ảnh từ máy, cắt hình tròn (kéo để chọn phần hiển thị, thanh trượt phóng to 1× đến 3×), có nút "Gỡ ảnh" để quay lại chữ cái đầu. Xem trước ngay bên trong khung đang đeo. Ảnh nén còn 320×320 JPEG trước khi tải lên. Giới hạn file 12 MB.
- **Tên hiển thị**: 2 đến 24 ký tự, có bộ đếm ký tự. Dùng trong lịch chung và bạn bè.
- **Username**: 4 đến 19 ký tự, chữ thường, số, gạch dưới (đúng quy tắc mục 10). Kiểm tra trùng khi gõ (đang kiểm tra, có thể dùng, đã có người dùng). Username là duy nhất toàn hệ thống; phía máy chủ cần ràng buộc unique và kiểm tra lại khi lưu.
- Nút "Lưu thay đổi" chỉ bật khi có thay đổi và dữ liệu hợp lệ; mất mạng thì báo "Cần có mạng để lưu hồ sơ".
- Chưa chốt: có giới hạn tần suất đổi username (ví dụ 1 lần mỗi 30 ngày) hay không.
- Ảnh lưu trên Supabase Storage (gói miễn phí); cần giới hạn dung lượng và xoá ảnh cũ khi người dùng đổi ảnh.

## Chức năng bổ sung (bản mockup v3, 14/10/2026)

Tham chiếu: `design/reference/colentis-app.html` (bảng demo có nhóm nút "Chức năng mới", "Mốc streak và lỗi").

### Theo PLAN gốc
- **Ngày sinh (tùy chọn)**: có ở Đăng ký và Chỉnh sửa hồ sơ. Không được ở tương lai, từ năm 1940. 29/2 tính 28/2 ở năm không nhuận. Mặc định đề xuất: chỉ chính chủ thấy ngày sinh, bạn bè không thấy (chờ duyệt). Dùng để đếm ngược sinh nhật và danh hiệu `birthday`.
- **Quên mật khẩu**: 4 bước (nhập email, "đã gửi" có đếm ngược gửi lại 30 giây, đặt mật khẩu mới có thanh độ mạnh, thành công). Thông báo luôn nói "nếu email đã đăng ký" để không lộ tài khoản nào tồn tại. Liên kết hiệu lực 60 phút (chờ xác nhận với cấu hình Supabase Auth).
- **Đóng đăng ký**: khi nhóm kín đủ chỗ, tab Đăng ký hiện "Đăng ký đang đóng", chỉ còn đăng nhập. Con số giới hạn chưa chốt.
- **Quản lý lịch**: đổi tên, mời bạn bè (còn chỗ/6), xóa thành viên, chuyển chủ lịch, rời lịch, xóa lịch (gõ tên lịch để xác nhận). Chủ lịch muốn rời phải chuyển chủ hoặc xóa lịch. Luôn giữ ít nhất 1 lịch. Rời/xóa không thu hồi thẻ và danh hiệu đã nhận. Tạo lịch mới tối đa 4 lịch.
- **Thông báo trong app**: chuông ở Lịch, Hôm nay, Bạn bè. Gồm lời mời kết bạn, lời mời vào lịch (kiểm tra giới hạn 4 lịch), bạn xong việc, nhắc chuỗi, cổ vũ, thư mới từ admin. Có "Đọc hết" và chấm đỏ; tắt được trong Cài đặt.
- **Màn lỗi**: lỗi tải, lỗi nhận thẻ (nói rõ thẻ chưa mất, ngày chưa khóa), hết phiên, tài khoản bị khóa, hệ thống bận. Không có chữ nào dẫn tới nâng cấp trả phí.
- **Thẻ trùng**: nút ở tab Thẻ ảnh. Tổng lượt nhận, số thẻ khác nhau, lượt trùng, thẻ nhận nhiều nhất, danh sách thẻ trùng theo độ hiếm.
- **Trang admin gửi thư**: người nhận (tất cả hoặc theo username), tiêu đề tối đa 60 và nội dung tối đa 600 ký tự, tối đa 4 quà (thẻ ngẫu nhiên theo độ hiếm, thẻ cứu 1 đến 5, danh hiệu và khung), gửi ngay hoặc hẹn giờ, xem trước, xác nhận gửi, lịch sử đã gửi. Chỉ vai trò admin; kiểm tra quyền ở server.

### Ý tưởng thêm
- **Sự kiện sắp tới**: ngày sinh Juhoon 03/01/2008, Seonghyeon 13/01/2009, Keonho 14/02/2009, Martin 20/03/2008, James 14/10/2005 (đối chiếu hai nguồn: kbizoom, kprofiles). Thẻ đếm ngược ở Hôm nay, biểu tượng bánh sinh nhật trên ô ngày, bảng danh sách. Chỉ James có quà sự kiện; các thành viên khác ghi "chưa công bố".
- **Thẻ yêu thích**: ghim tối đa 3 thẻ trên Hồ sơ; bạn bè thấy 3 thẻ này kể cả khi album riêng tư (chờ duyệt).
- **Lưu ảnh thẻ**: nút trong màn xem thẻ, xuất PNG có tên thẻ và `@username` làm dấu nhỏ; có Chia sẻ.
- **Tổng kết tháng**: số việc, ngày xong 100%, chuỗi, thẻ nhận, thẻ hiếm nhất, ngày làm nhiều nhất; lưu ảnh để chia sẻ, không chứa thẻ riêng tư.
- **Mốc streak** (3, 7, 14, 30, 60, 100, 365): màn chúc mừng khi nhận thẻ làm chuỗi chạm mốc.
- **Hướng dẫn 3 trang** (tick và nhận thẻ, khóa ngày, tick bù 48 giờ và thẻ cứu): hiện sau Quà Tân binh, mở lại từ Hồ sơ.
- **Rung và âm thanh**: Cài đặt; rung mặc định bật, âm thanh mặc định tắt. Âm tạo bằng Web Audio, không cần file.
- **Cổ vũ bạn bè**: tối đa 1 lời cổ vũ mỗi người mỗi ngày, có công tắc nhận cổ vũ.

### Mặt sau thẻ theo độ hiếm
Mặt sau "lộ luôn" độ hiếm, kể cả khi thẻ còn úp (chồng thẻ, gacha, màn xem thẻ). Mỗi độ hiếm một hiệu ứng động bằng CSS: Thường (dải holo quét), Hiếm (viền xanh có đèn chạy, logo thở), Huyền Thoại (viền vàng-tím xoay, tia sáng xoay, lấp lánh), Bá khí x4 (sét xanh, xung bạc, lửa hổ phách, lăng kính), sinh nhật James (bánh kem và nhãn hạng; A lấp lánh vàng, S tàn lửa, SS vòng sóng đỏ, SSS tia vàng và viền xoay, AURA cầu vồng). Tôn trọng "giảm chuyển động". Phương án thay thế nếu muốn: chỉ lộ khi chạm. Code tham chiếu: `backHTML()` và phần CSS `.pb-*` trong `design/reference/colentis-app.html`.

### Đã chốt
- **Đổi username**: tối đa 1 lần mỗi 3 ngày.
- **Khung sinh nhật James**: khung hiện tại được duyệt dùng chính thức.
- **Ngày sinh với bạn bè**: có công tắc "Hiện ngày sinh với bạn bè" trong Cài đặt, mặc định tắt (chỉ chủ tài khoản thấy). Bật thì bạn bè thấy.
- **Danh hiệu Tân binh**: là danh hiệu mặc định, giữ nguyên; người dùng tự đổi khi mở khóa danh hiệu khác. Không tự thăng cấp, không cho tự đặt tên.
- **Hạn mức thẻ theo lịch (thay mục 14.1 và dòng 68-69)**: mỗi lịch tối đa 2 thẻ mỗi ngày (1 thẻ cá nhân khi xong việc của mình + 1 thẻ nhóm khi cả nhóm xong). Không còn "lịch thưởng nhóm chính" và không giới hạn tổng 2 thẻ/người/ngày: người ở nhiều lịch (tối đa 4) có thể nhận nhiều thẻ trong một ngày. Thẻ trùng đã có cơ chế tăng số lần sở hữu nên không cần chặn. Quà admin và thẻ sự kiện vẫn nằm ngoài hạn mức.
- **Khi đủ một độ hiếm (14.2)**: cách B, vẫn cho rơi nhưng giảm tỷ lệ (mockup đang ưu tiên thẻ chưa có, 80%). Kho sẽ thêm thẻ mới về sau nên không lo hết thẻ.
- **Khóa ngày (14.3)**: cách A, có nút xác nhận "Nhận thẻ" trước khi khóa; không tự khóa khi tick việc cuối.

### Còn chờ bạn quyết
- Đóng đăng ký: con số giới hạn tài khoản của nhóm kín (chỉ cần khi làm app thật, nên đặt thấp hơn giới hạn miễn phí của Supabase).

## Quy tắc đã chốt và backend đã triển khai (14/10/2026)

Mọi mục "chờ quyết" ở trên đã được chốt như sau. Phần này thắng các mục cũ nếu mâu thuẫn.

### Quy tắc sản phẩm đã chốt
- Danh hiệu mặc định là "Tân binh". Đổi username: 1 lần mỗi 3 ngày (server kiểm `username_changed_at`).
- Ngày sinh có nút hiện/ẩn với bạn bè, mặc định ẩn.
- Mỗi **lịch** cho tối đa 2 thẻ mỗi ngày: 1 thẻ cá nhân (mỗi người một thẻ cá nhân mỗi ngày, bất kể số lịch) và 1 thẻ nhóm cho mỗi lịch chung đủ điều kiện. Ai có nhiều lịch thì nhận nhiều thẻ nhóm hơn; trùng thẻ không sao (đếm `count`).
- Thẻ nhóm chỉ tính từ ngày **sau** ngày vào lịch (`joined_on < ngày`), và mọi thành viên đang ở trong lịch đều phải xong việc ngày đó. Cùng một lịch và ngày, cả nhóm nhận **cùng một thẻ** (bảng `group_rolls`).
- Khi đã đủ một độ hiếm, thẻ vẫn rơi với tỉ lệ thấp hơn: 80% ưu tiên thẻ chưa có (`unowned_bias`), còn lại bốc ngẫu nhiên.
- Khóa ngày cần bấm xác nhận (nút "Nhận thẻ"); sau khi nhận không thêm/sửa/xóa/bỏ tick được trong ngày đó.
- Tối đa 6 thành viên mỗi lịch, 4 lịch mỗi người, 50 tài khoản (`signup_cap` trong `app_config`, server chặn bằng trigger trên `auth.users`).
- Mặt sau thẻ hé lộ độ hiếm. Mặc định có lịch "Việc riêng" khi đăng ký.

### Backend (thư mục `supabase/`)
- `001` bảng · `002` hàm lõi (schema `private`, không lộ qua API) · `003` RPC công khai · `004` RLS và quyền hàm · `005` dữ liệu danh hiệu/thẻ/sự kiện · `006` Storage riêng tư.
- Client chỉ đọc dữ liệu được phép và ghi task của chính mình. Mọi thưởng, khóa ngày, thẻ cứu, thư, kết bạn, lịch đều qua hàm `SECURITY DEFINER` kiểm quyền bằng `auth.uid()`.
- Trigger trên `tasks`: chủ sở hữu, `DAY_LOCKED`, `PAST_DAY` (ngày ≥ hôm nay−2 mới sửa được trạng thái tick, không sửa nội dung), `VERSION_CONFLICT` (gửi kèm `version`).
- Streak: một ngày được tính nếu có ít nhất một task xong, hoặc là ngày trống đã qua. Lỡ = có task, chưa xong, chưa khóa. `catchup_days` là tối đa 3 ngày gần nhất trong hạn 48 giờ (tick bù hoặc dùng thẻ cứu). `me().streak_if_saved` là streak nếu nối lại.
- Thẻ cứu: 5 mỗi tháng (`rescue_per_month`) cộng `rescue_bonus` (quà thư/Tân binh).
- Giờ giả lập cho test: biến phiên `colentis.now` (client không đặt được). Tết Nguyên đán trong `holidays_tet` chỉ có đến 2036: kiểm tra lại các năm sau.
- Ảnh thẻ: bucket riêng `cards`, tải được khi sở hữu thẻ, là thẻ yêu thích của bạn bè, hoặc album bạn bè công khai (`private.can_read_card`). Bucket `avatars`: đọc bởi người đã đăng nhập, ghi chỉ vào thư mục `<uid>/`.
- Gửi mail email của Supabase Free bị giới hạn vài thư mỗi giờ: nên tắt "Confirm email".

### Giao diện đã triển khai
- UI bám sát mockup đã duyệt, viết dạng JS thuần trong `src/ui/legacy/` và ghép bằng plugin Vite thành module `virtual:colentis-ui` (hàm `mountUI(API)`). React chỉ dựng khung HTML tĩnh (`shell.html`) và gọi `mountUI`. Đây là bản chuyển thể từ mockup, chưa viết lại thành component React.
- Lớp dữ liệu có kiểu: `src/lib/api.ts` (bọc RPC/bảng) → `src/ui/loader.ts` (snapshot) → `src/ui/bridge.ts` (đăng nhập, hàng đợi offline có `op_id`, realtime kèm thăm dò, ảnh riêng tư qua `storage.download` + Cache Storage).
- Offline: tick và thêm việc được xếp hàng trong `localStorage` (`colentis:queue:<uid>`) và đẩy lên khi có mạng; sửa/xóa việc cần mạng.
- Kiểm thử: 8 bộ test SQL (`supabase/tests`) và 5 kịch bản trình duyệt (`e2e/`) chạy trên máy chủ giả lập Supabase.

## Mùa Concept 18–26/10/2026 (giai đoạn 1, 17/10/2026)
- Đã làm: thư poster giới thiệu (gửi từ 17/10), quà thẻ ID Fan + khung thành viên + 1 gói lưu vào Sự kiện (`event_stash`, mở từ 18/10), chọn thành viên một lần, chỉnh thẻ (ảnh, phóng/kéo, tên chủ thẻ, mã Spotify tĩnh), khung tròn và danh hiệu `idcard-<thành viên>` mở khi có thành viên, ảnh và tên.
- Ảnh thẻ ID lưu bucket `avatars`, đường dẫn `<uid>/idcard-<ts>.jpg`. Chữ ký và mã Spotify là PNG tĩnh ở `public/assets/idcard/`.
- Chưa làm (giai đoạn sau): mở gói, thẻ concept, gói mỗi ngày, panorama, 2 thẻ Ultra Limited.
- Thiết kế gốc: `design/mua-concept/`. Backend: `supabase/migrations/009_mua_concept.sql`. Test giao diện: `e2e/s6_mua_concept.mjs`.

## Mùa Concept — giai đoạn 2 (18/10/2026)
Thiết kế gốc: `design/mua-concept/boards/AppBuild.dc.html`. Giao diện chuyển nguyên văn từ thiết kế (mẫu → hàm sinh HTML, CSS giữ nguyên), không tự vẽ lại.

### Luật
- 9 ngày: ngày 1–3 Urichinguchana, 4–6 Aniyaaa, 7–9 Poyoyoi (`event_days`, 18/10–26/10). Mỗi ngày một nhiệm vụ (tự tick, tính theo lòng tin): xong thì nhận **2 pack** của concept ngày đó. Chỉ tick được đúng trong ngày (`concept_tick`, lỗi `OUT_OF_EVENT`/`ALREADY_DONE`).
- Pack concept = 5 thẻ, server rút: thường 16% mỗi thẻ (5 thẻ), holo 4% mỗi thẻ (5 thẻ). Mở pack cũ nhất trước (`concept_open_pack`).
- Đủ 5 thẻ **thường** của một concept: mở khóa panorama, khung tròn + danh hiệu `concept-N` (tự đeo, đổi được ở Hồ sơ), 1 pack thưởng = 5 thẻ app (trọng số `daily_weights`).
- Đủ cả 3 concept: 2 thẻ Ultra Limited, mỗi thẻ chọn 2 trong 7 bài CORTIS, khóa rồi không đổi (`concept_ultra_lock`, lỗi `NEED_ALL_CONCEPTS`/`ALREADY_LOCKED`). Hiệu ứng mở là "2 sao xoắn" (variant 3).
- Thẻ trùng tặng được cho bạn bè hoặc người chung lịch, luôn giữ lại ít nhất 1 bản (`concept_give`); xin thẻ còn thiếu (`concept_ask`, tối đa 60 yêu cầu chờ); người nhận mở "Quà từ bạn bè" ở tab Hôm nay hoặc Hòm thư (`concept_claim_gifts`, mỗi quà một lần).
- Thư: 18/10 (poster, quà thẻ ID + khung + 1 pack concept 1), 21/10 Aniyaaa, 24/10 Poyoyoi, 18/10 sự kiện bí mật 01/11 (thư phát chung `broadcast_at`, giao cả cho người vào sau). Quà thư `concept_pack` chỉ nhận một lần; pack lưu chờ cũ (`event_stash`) đã quy đổi thành pack concept 1.

### Backend
- Migration `013_mua_concept_p2.sql`: bảng `concept_ticks/packs/cards/unlocks/ultra/gifts/requests` (RLS chỉ cho đọc phần của mình; ghi qua hàm), cột `mails.tag/tag_color/summary/broadcast_at`, bucket riêng tư `concept`, 3 danh hiệu `concept-1..3`.
- Bucket `concept` (chủ dự án tải lên bằng Dashboard): `c{1-3}-{0-4}.webp`, `ultra-{1,2}.webp` và `pano-{1-3}.webp` ai đăng nhập cũng đọc được (ảnh nằm dưới dải che); `ultra-{1,2}.mp4` và `songs/{0-6}.m4a` chỉ đọc được khi đã mở khóa đủ 3 concept (`private.can_read_concept`). Thẻ chưa có thì giao diện không hiện ảnh (ô trống nét đứt).
- Test SQL: `supabase/tests/65_mua_concept.sql`, `70_concept_p2.sql`.

### Giao diện
- Lõi: `src/ui/legacy/_06f_cx_core.js` (trình biên dịch mẫu, trạng thái `CX`, hàm xử lý `CX.H`, âm thanh Ultra, panorama theo cảm biến); mẫu sinh sẵn `_06g_cx_tpl.js`; CSS `src/ui/concept.css` (chỉ các luật không trùng `mockup.css`; góc quay của app đổi tên thành `--ra` để biến `--a` của thiết kế là màu).
- Gắn vào tab cũ: banner + nhiệm vụ + mở pack + quà bạn bè ở Hôm nay, chấm concept ở Lịch, hàng chip concept ở Ảnh (mặc định vẫn là "Thẻ app"), "Phần thưởng Mùa Concept" ở Hồ sơ, thư kiểu thiết kế ở Hòm thư. Mọi gọi server qua `API.cx*` trong `bridge.ts`; nếu 013 chưa áp (`concept_state` lỗi) thì toàn bộ giao diện concept tự ẩn.
- Ảnh/video/nhạc lấy bằng URL ký từ bucket riêng tư; ảnh chưa tải được hiện chỗ trống rồi tự điền khi tới.
- Test: `e2e/s7_concept_p2.mjs` (nhiệm vụ, pack, bộ sưu tập, panorama, khung), `e2e/s8_concept_flows.mjs` (pack thưởng, Ultra, tặng/xin thẻ giữa hai tài khoản). Cả hai cần `CONCEPT_DIR` trỏ tới thư mục chứa ảnh/video/nhạc thật để shim phát lại.

### Nhiệm vụ Mùa Concept do server xác minh (migration 015)
- Tick không còn là tự khai: `concept_tick()` chỉ phát 2 pack khi `private.concept_task_have(uid, ngày) >= need`, nếu không báo `TASK_NOT_MET`. `concept_state().task` = `{need, have}`.
- Điều kiện (giờ VN, trong hôm nay): 1 xong 1 việc bất kỳ trong hôm nay (016) · 2 và 7 xong 1 việc nhãn "Việc nhà" · 3 tạo hôm nay 1 việc cho ngày mai · 4 xong 1 việc nhãn "Cho người khác" · 5 gắn giờ (tạo/sửa hôm nay) cho 1 việc không cả ngày · 6 xong 1 việc sau 21h · 8 xong 3 việc · 9 xong 1 việc ở lịch chung có ≥2 thành viên.
- Thêm 2 nhãn mới vào app: "Việc nhà", "Cho người khác". Test: `supabase/tests/75_concept_task.sql`.

### Trang admin v2 (migration 017, mockup `design/admin/`)
- 4 tab: Tổng quan (số liệu, hoạt động), Gửi thư (người nhận gồm "Chưa điểm danh", mẫu thư, quà gồm Gói Concept, hẹn giờ, xem trước, gửi thử cho mình, nháp lưu trên máy), Thành viên (tìm, lọc, chuỗi/thẻ/thư chưa nhận, nhắc điểm danh, tặng quà), Lịch sử (Hẹn giờ: sửa/gửi ngay/huỷ; Đã gửi: tiến độ nhận quà, nhắc người chưa nhận).
- Hàm server (chỉ admin): `admin_overview`, `admin_members`, `admin_sent_mails` (có `scheduled`, `read`, `claimed`), `admin_cancel_mail`, `admin_send_now`, `admin_nudge_mail`. Giao diện ở `src/ui/legacy/_07b_admin.js`, test `supabase/tests/80_admin_v2.sql`, `e2e/s9_admin.mjs`.
- Chưa làm so với mockup: gói thẻ thường/sự kiện/Bá khí (chỉ có Gói Concept), mở khoá ngày, thư lặp lại hằng ngày, tab Nháp trong Lịch sử.

## Đợt thẻ 2 (31/10/2026)
- Thêm 612 thẻ app chia đều: 204 Thường, 204 Hiếm, 204 Huyền Thoại, cùng 12 thẻ Bá khí mới. Tổng kho thẻ app sau khi bật: Thường 234, Hiếm 234, Huyền Thoại 219, Bá khí 16 (703 thẻ, chưa tính thẻ sự kiện). Số hiển thị trong app tự tính từ bảng `cards`.
- Ảnh ở bucket riêng `cards`, thư mục `b2/<độ hiếm>/` và `thumbs/`, id `b2-<độ hiếm>-NNN`. Migration `021_cards_batch2.sql` thêm hàng với `active = false` (RLS ẩn khỏi client, gacha bỏ qua). Sau khi tải ảnh lên: `update public.cards set active = true where id like 'b2-%';`.
- Xử lý ảnh: `node scripts/prepare-batch2.mjs <thư mục ảnh Drive>` (bảng chia hạng ở `scripts/batch2-map.json`, khớp theo tên file), rồi `npm run upload-cards -- manifest-b2.json manifest-b2-supreme.json`.
- 12 hiệu ứng Bá khí `s5..s16` (CSS `src/ui/supreme2.css`, hạt `src/ui/legacy/_06h_sup2.js`, màu `SUPCOL`): s5 pháo hoa, s6 đèn flash, s7 ánh nến + vòng neon, s8 nổ truyện tranh, s9 pháo sáng, s10 vuốt hổ, s11 glitch, s12 lụa, s13 quét ánh nhìn, s14 tốc độ phố, s15 nắng, s16 photobooth. Thẻ s16 là ảnh động (WebP động 480×640, 52 khung), thumb là ảnh tĩnh.
