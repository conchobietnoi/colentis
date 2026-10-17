# Mùa Concept (18–26/10/2026): bản thiết kế

- `boards/`: các board thiết kế (`*.dc.html`) và `canvas.json`. Mở trong Design artifact trên claude.ai. Một số ảnh panorama dùng đường dẫn `/_blob/...` nên chỉ hiện khi mở trong artifact.
- Board chính: `AppBuild` (bản dựng đầy đủ), `IdCard` (thẻ ID 2 mặt), `IdFrames` (khung tròn và danh hiệu thẻ ID), `MailPlay` (thư giới thiệu sự kiện, nhận quà, thẻ trong bộ sưu tập, Hồ sơ), `MailMock` (4 màn thư, bản cũ).
- `tools/`: các script Python dùng để sinh board (chạy `mailplay3.py` từ thư mục `tools/gen`).
