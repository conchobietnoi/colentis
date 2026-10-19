// Mã lỗi từ database/hàm RPC → thông báo tiếng Việt. Không dùng chữ nào dẫn tới nâng cấp trả phí.
const MAP: Record<string, string> = {
  NOT_AUTHENTICATED: 'Phiên đăng nhập đã hết, hãy đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền làm việc này.',
  DAY_LOCKED: 'Ngày này đã khóa, chỉ xem lại được.',
  PAST_DAY: 'Ngày đã qua nên không sửa được nội dung.',
  VERSION_CONFLICT: 'Việc này vừa được sửa ở thiết bị khác. Hãy xem lại rồi thử tiếp.',
  NOTHING_TO_CLAIM: 'Chưa có thẻ nào để nhận cho ngày này.',
  FUTURE_DAY: 'Chưa tới ngày này.',
  TOO_OLD: 'Ngày này đã quá hạn nhận thẻ.',
  INVALID_DAY: 'Ngày không hợp lệ.',
  RESCUE_EXPIRED: 'Đã quá 48 giờ nên không dùng thẻ cứu được.',
  NO_RESCUE_LEFT: 'Bạn đã hết thẻ cứu.',
  NOT_NEEDED: 'Ngày này không cần cứu.',
  CALENDAR_LIMIT: 'Bạn đã đủ 4 lịch, hãy rời một lịch trước.',
  CALENDAR_FULL: 'Lịch này đã đủ 6 thành viên.',
  KEEP_ONE_CALENDAR: 'Bạn cần giữ lại ít nhất 1 lịch.',
  OWNER_MUST_TRANSFER: 'Chủ lịch cần chuyển quyền chủ lịch trước khi rời.',
  NAME_MISMATCH: 'Tên lịch gõ chưa đúng.',
  NOT_MEMBER: 'Người này chưa ở trong lịch.',
  NOT_FRIENDS: 'Hai bạn chưa là bạn bè.',
  ALREADY_MEMBER: 'Người này đã ở trong lịch.',
  INVITE_PENDING: 'Đã mời rồi, đang chờ trả lời.',
  USER_NOT_FOUND: 'Không tìm thấy username này.',
  CANNOT_ADD_SELF: 'Bạn không thể kết bạn với chính mình.',
  ALREADY_FRIENDS: 'Hai bạn đã là bạn bè.',
  REQUEST_PENDING: 'Đã gửi lời mời, đang chờ phản hồi.',
  USERNAME_TAKEN: 'Username này đã có người dùng.',
  USERNAME_COOLDOWN: 'Username chỉ đổi được 1 lần mỗi 3 ngày.',
  INVALID_USERNAME: 'Username 4 đến 19 ký tự: chữ thường, số, gạch dưới.',
  INVALID_DISPLAY_NAME: 'Tên hiển thị cần từ 2 đến 24 ký tự.',
  INVALID_BIRTHDAY: 'Ngày sinh chưa hợp lệ.',
  REGISTRATION_CLOSED: 'Đăng ký đang đóng.',
  CHOOSE_MEMBER_FIRST: 'Hãy chọn thành viên trước khi nhận quà.',
  ALREADY_CHOSEN: 'Bạn đã chọn thành viên rồi.',
  ALREADY_CLAIMED: 'Quà này đã nhận rồi.',
  CHEER_LIMIT: 'Hôm nay bạn đã cổ vũ người này rồi.',
  CHEER_DISABLED: 'Người này đang tắt nhận cổ vũ.',
  TITLE_NOT_OWNED: 'Bạn chưa có danh hiệu này.',
  CARD_NOT_OWNED: 'Bạn chưa có thẻ này.',
  TOO_MANY_FAVS: 'Chỉ ghim tối đa 3 thẻ.',
  TOO_MANY_GIFTS: 'Tối đa 4 quà trong một thư.',
  INVALID_GIFT: 'Quà không hợp lệ.',
  NOT_FOUND: 'Không tìm thấy.',
  OUT_OF_EVENT: 'Hiện chưa trong thời gian Mùa Concept.',
  ALREADY_DONE: 'Hôm nay bạn đã xong nhiệm vụ rồi.',
  ALREADY_SENT: 'Thư này đã được gửi nên không huỷ hẹn được nữa.',
  TASK_NOT_MET: 'Bạn chưa làm xong nhiệm vụ hôm nay.',
  NO_PACK: 'Bạn chưa có pack nào để mở.',
  NOT_ENOUGH_SPARE: 'Chỉ còn 1 bản nên chưa tặng được.',
  INVALID_RECIPIENTS: 'Người nhận chưa hợp lệ.',
  ALREADY_OWNED: 'Bạn đã có thẻ này rồi.',
  TOO_MANY_REQUESTS: 'Bạn đã xin quá nhiều thẻ, hãy chờ người kia trả lời.',
  NO_GIFT: 'Chưa có thẻ quà nào để nhận.',
  NEED_ALL_CONCEPTS: 'Cần đủ 3 concept trước.',
  INVALID_SONGS: 'Hãy chọn 2 bài khác nhau.',
  INVALID_ULTRA: 'Thẻ Ultra không hợp lệ.',
  ALREADY_LOCKED: 'Thẻ này đã khóa nhạc rồi.',
}

export type AppError = { code: string; message: string; offline: boolean }

export function toAppError(e: unknown): AppError {
  const raw = e && typeof e === 'object' ? (e as any) : {}
  const text: string = String(raw.message ?? raw.error_description ?? raw.msg ?? e ?? '')
  const offline = typeof navigator !== 'undefined' && !navigator.onLine || /Failed to fetch|NetworkError|Load failed/i.test(text)
  const m = text.match(/\b([A-Z][A-Z_]{3,})\b/)
  let code = m ? m[1] : ''
  if (/row-level security|permission denied/i.test(text)) code = 'FORBIDDEN'
  if (/Invalid login credentials/i.test(text)) code = 'BAD_LOGIN'
  if (/already registered|User already/i.test(text)) code = 'EMAIL_TAKEN'
  if (/Email not confirmed/i.test(text)) code = 'EMAIL_UNCONFIRMED'
  if (/rate limit|too many/i.test(text)) code = 'RATE_LIMIT'
  const extra: Record<string, string> = {
    BAD_LOGIN: 'Email hoặc mật khẩu chưa đúng.',
    EMAIL_TAKEN: 'Email này đã được đăng ký.',
    EMAIL_UNCONFIRMED: 'Email chưa được xác nhận. Hãy kiểm tra hộp thư.',
    RATE_LIMIT: 'Bạn thao tác hơi nhiều, đợi một lát rồi thử lại.',
  }
  const message = offline ? 'Cần có mạng để làm việc này.' : (MAP[code] ?? extra[code] ?? 'Có lỗi xảy ra, hãy thử lại.')
  return { code, message, offline }
}
