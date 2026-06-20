export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** DateTime custom scalar type (ISO 8601) */
  DateTime: { input: string; output: string; }
  /** Arbitrary JSON value */
  JSON: { input: Record<string, unknown>; output: Record<string, unknown>; }
};

export type AcceptLegalDocumentsInput = {
  /** App version */
  appVersion?: InputMaybe<Scalars['String']['input']>;
  /** Device/platform info */
  deviceInfo?: InputMaybe<Scalars['String']['input']>;
  /** Version of Privacy Policy being accepted */
  privacyVersion: Scalars['String']['input'];
  /** Version of Terms of Service being accepted */
  termsVersion: Scalars['String']['input'];
};

export type AcceptLegalDocumentsResult = {
  __typename?: 'AcceptLegalDocumentsResult';
  acceptedAt?: Maybe<Scalars['DateTime']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  privacyAccepted: Scalars['Boolean']['output'];
  success: Scalars['Boolean']['output'];
  termsAccepted: Scalars['Boolean']['output'];
};

/** How the user account was created */
export enum AccountOrigin {
  AdminCreated = 'ADMIN_CREATED',
  SelfRegistered = 'SELF_REGISTERED'
}

/** How the user discovered the platform */
export enum AcquisitionSource {
  Direct = 'DIRECT',
  Event = 'EVENT',
  Facebook = 'FACEBOOK',
  Friend = 'FRIEND',
  Other = 'OTHER',
  StoreSearch = 'STORE_SEARCH',
  Tiktok = 'TIKTOK'
}

export type Activity = {
  __typename?: 'Activity';
  _id: Scalars['ID']['output'];
  /** Type of activity */
  activityType: ActivityType;
  /** Actor user ID */
  actorId?: Maybe<Scalars['ID']['output']>;
  /** Actor name for display */
  actorName?: Maybe<Scalars['String']['output']>;
  /** Type of actor */
  actorType: ActorType;
  /** Amount involved (if applicable) */
  amount?: Maybe<Scalars['Float']['output']>;
  /** Activity color key */
  colorKey: Scalars['String']['output'];
  /** Created at */
  createdAt: Scalars['DateTime']['output'];
  /** Additional description */
  description?: Maybe<Scalars['String']['output']>;
  /** Activity icon */
  icon: Scalars['String']['output'];
  /** JSON metadata */
  metadata?: Maybe<Scalars['String']['output']>;
  /** Resource ID */
  resourceId?: Maybe<Scalars['ID']['output']>;
  /** Resource name/code for display */
  resourceName?: Maybe<Scalars['String']['output']>;
  /** Type of resource affected */
  resourceType: ResourceType;
  /** Human readable title */
  title: Scalars['String']['output'];
  /** Updated at */
  updatedAt: Scalars['DateTime']['output'];
  /** Venue ID */
  venueId: Scalars['ID']['output'];
};

/** A Relay-style connection for Activity items. */
export type ActivityConnection = {
  __typename?: 'ActivityConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<ActivityEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the ActivityConnection. */
export type ActivityEdge = {
  __typename?: 'ActivityEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Activity;
};

export type ActivityFilterInput = {
  /** Filter by activity types */
  activityTypes?: InputMaybe<Array<ActivityType>>;
  /** From date (ISO string) */
  fromDate?: InputMaybe<Scalars['String']['input']>;
  /** Filter by resource types */
  resourceTypes?: InputMaybe<Array<ResourceType>>;
  /** To date (ISO string) */
  toDate?: InputMaybe<Scalars['String']['input']>;
};

/** Type of activity */
export enum ActivityType {
  BookingCancelled = 'BOOKING_CANCELLED',
  BookingCompleted = 'BOOKING_COMPLETED',
  BookingConfirmed = 'BOOKING_CONFIRMED',
  BookingCreated = 'BOOKING_CREATED',
  BookingNoShow = 'BOOKING_NO_SHOW',
  BookingRejected = 'BOOKING_REJECTED',
  OrderCancelled = 'ORDER_CANCELLED',
  OrderCompleted = 'ORDER_COMPLETED',
  OrderConfirmed = 'ORDER_CONFIRMED',
  OrderCreated = 'ORDER_CREATED',
  OrderDelivered = 'ORDER_DELIVERED',
  OrderPaid = 'ORDER_PAID',
  OrderPreparing = 'ORDER_PREPARING',
  OrderReady = 'ORDER_READY',
  ProductCreated = 'PRODUCT_CREATED',
  ProductDeleted = 'PRODUCT_DELETED',
  ProductOutOfStock = 'PRODUCT_OUT_OF_STOCK',
  ProductRestocked = 'PRODUCT_RESTOCKED',
  ProductUpdated = 'PRODUCT_UPDATED',
  ReviewReceived = 'REVIEW_RECEIVED',
  StaffAdded = 'STAFF_ADDED',
  StaffRemoved = 'STAFF_REMOVED',
  VenueUpdated = 'VENUE_UPDATED'
}

/** Type of actor who performed the activity */
export enum ActorType {
  Customer = 'CUSTOMER',
  Staff = 'STAFF',
  System = 'SYSTEM'
}

export type AddGamesToCampaignInput = {
  /** ID campaign */
  campaignId: Scalars['ID']['input'];
  /** Danh sách ID kèo cần thêm vào campaign */
  gameIds: Array<Scalars['ID']['input']>;
};

export type AddGroupMessageReactionInput = {
  /** Emoji reaction (e.g., 👍, ❤️, 😂) */
  emoji: Scalars['String']['input'];
  /** Message ID to add reaction to */
  messageId: Scalars['ID']['input'];
};

export type AddLateEntryResult = {
  __typename?: 'AddLateEntryResult';
  action: LateEntryAction;
  match?: Maybe<TournamentMatch>;
  message: Scalars['String']['output'];
  opponentName?: Maybe<Scalars['String']['output']>;
  registration?: Maybe<TournamentRegistration>;
  scheduleNeedsUpdate?: Maybe<Scalars['Boolean']['output']>;
  selectedFromCount: Scalars['Int']['output'];
};

export type AddLateEntryToByeSlotInput = {
  athleteName: Scalars['String']['input'];
  categoryId: Scalars['ID']['input'];
  club?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  guardianName?: InputMaybe<Scalars['String']['input']>;
  guardianPhone?: InputMaybe<Scalars['String']['input']>;
  /** Thành viên cho nội dung đôi/đội */
  members?: InputMaybe<Array<EntryMemberInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  paymentAmount?: InputMaybe<Scalars['Float']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  /** Lý do thêm muộn (audit bắt buộc) */
  reason: Scalars['String']['input'];
  school?: InputMaybe<Scalars['String']['input']>;
};

export type AddReactionInput = {
  /** Emoji reaction (e.g., ❤️, 👍, 😂) */
  emoji: Scalars['String']['input'];
  /** Message ID */
  messageId: Scalars['ID']['input'];
};

export type AdjustStockInput = {
  /** Additional notes */
  note?: InputMaybe<Scalars['String']['input']>;
  /** Product ID to adjust stock for */
  productId: Scalars['ID']['input'];
  /** Quantity to adjust (positive to add, negative to subtract) */
  quantity: Scalars['Int']['input'];
  /** Reason for adjustment */
  reason: StockAdjustmentReason;
  /** Variant ID (if applicable) */
  variantId?: InputMaybe<Scalars['ID']['input']>;
};

export type AdminAllBookingConnection = {
  __typename?: 'AdminAllBookingConnection';
  /** JSON map of bookingId -> customerName */
  customerNamesJson: Scalars['String']['output'];
  edges: Array<AdminAllBookingEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AdminAllBookingEdge = {
  __typename?: 'AdminAllBookingEdge';
  cursor: Scalars['String']['output'];
  node: AdminBookingItem;
};

export type AdminBookingItem = {
  __typename?: 'AdminBookingItem';
  _id: Scalars['ID']['output'];
  courtName: Scalars['String']['output'];
  date: Scalars['String']['output'];
  status: Scalars['String']['output'];
  timeSlots: Scalars['String']['output'];
  totalPrice: Scalars['Int']['output'];
  venueAddress: Scalars['String']['output'];
  venueName: Scalars['String']['output'];
};

/** A Relay-style connection for AdminBookingItem items. */
export type AdminBookingItemConnection = {
  __typename?: 'AdminBookingItemConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<AdminBookingItemEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the AdminBookingItemConnection. */
export type AdminBookingItemEdge = {
  __typename?: 'AdminBookingItemEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: AdminBookingItem;
};

export type AdminCreateUserInput = {
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  /** Role for the new user (ADMIN or FACILITY_OWNER only) */
  role: UserRole;
};

export type AdminProvisionPlayerInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  fullName: Scalars['String']['input'];
  /** Bỏ trống để tự động tạo mật khẩu */
  password?: InputMaybe<Scalars['String']['input']>;
  phone: Scalars['String']['input'];
  referralCode?: InputMaybe<Scalars['String']['input']>;
  /** Ghi chú nội bộ (audit metadata, không gửi cho user) */
  sendCredentialsNote?: InputMaybe<Scalars['String']['input']>;
};

export type AdminProvisionPlayerResponse = {
  __typename?: 'AdminProvisionPlayerResponse';
  /** Chỉ trả về khi mật khẩu được tự động tạo */
  generatedPassword?: Maybe<Scalars['String']['output']>;
  /** Hướng dẫn đăng nhập cho người dùng */
  loginInstructions: Scalars['String']['output'];
  user: User;
};

export type AdminResetUserPasswordInput = {
  /** Bỏ trống để tự động tạo mật khẩu */
  newPassword?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type AdminResetUserPasswordResponse = {
  __typename?: 'AdminResetUserPasswordResponse';
  /** Chỉ trả về khi mật khẩu được tự động tạo */
  generatedPassword?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type AnalyticsSummary = {
  __typename?: 'AnalyticsSummary';
  /** Average booking value */
  averageBookingValue: Scalars['Int']['output'];
  /** Booking change percentage */
  bookingChangePercent: Scalars['Float']['output'];
  /** Peak day name */
  peakDay: Scalars['String']['output'];
  /** Peak hour time */
  peakHour: Scalars['String']['output'];
  /** Previous period bookings */
  previousBookings: Scalars['Int']['output'];
  /** Previous period revenue */
  previousRevenue: Scalars['Int']['output'];
  /** Revenue change percentage */
  revenueChangePercent: Scalars['Float']['output'];
  /** Total bookings in period */
  totalBookings: Scalars['Int']['output'];
  /** Total revenue in period */
  totalRevenue: Scalars['Int']['output'];
};

export type AppliedPromotion = {
  __typename?: 'AppliedPromotion';
  /** Level at which discount was applied */
  applyLevel?: Maybe<PromotionApplyLevel>;
  /** Badge text */
  badgeText?: Maybe<Scalars['String']['output']>;
  /** Promotion category */
  category: PromotionCategory;
  /** Promo code used */
  code?: Maybe<Scalars['String']['output']>;
  /** Calculated discount amount */
  discountAmount: Scalars['Int']['output'];
  /** Maximum discount amount for percentage promotions */
  maxDiscountAmount?: Maybe<Scalars['Int']['output']>;
  /** Promotion name */
  name: Scalars['String']['output'];
  /** Promotion ID */
  promotionId: Scalars['ID']['output'];
  /** Discount type */
  type: PromotionType;
  /** Discount value (% or amount) */
  value: Scalars['Int']['output'];
};

export type ApplyOrderPromotionInput = {
  /** Product category IDs in the order */
  productCategoryIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Promo code to apply */
  promoCode?: InputMaybe<Scalars['String']['input']>;
  /** Order subtotal before discount */
  subtotal: Scalars['Int']['input'];
  /** User ID (for validation) */
  userId?: InputMaybe<Scalars['ID']['input']>;
  /** Venue ID */
  venueId: Scalars['ID']['input'];
};

export type ApplyPromotionInput = {
  /** Booking date (YYYY-MM-DD) */
  bookingDate: Scalars['String']['input'];
  /** Court IDs being booked */
  courtIds: Array<Scalars['ID']['input']>;
  /** Is first booking for this user at this venue */
  isFirstBooking?: InputMaybe<Scalars['Boolean']['input']>;
  /** Is this a recurring booking */
  isRecurring?: InputMaybe<Scalars['Boolean']['input']>;
  /** Promo code to apply */
  promoCode?: InputMaybe<Scalars['String']['input']>;
  /** Number of slots being booked */
  slotCount: Scalars['Int']['input'];
  /** Venue slot duration in minutes (for PER_HOUR fixed amount conversion) */
  slotDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
  /** Per-slot price info (required for PER_HOUR promotions) */
  slots?: InputMaybe<Array<SlotPriceInfoInput>>;
  /** Sport types of the courts being booked (for SPECIFIC_SPORT scope) */
  sportTypes?: InputMaybe<Array<SportType>>;
  /** Time slots being booked (HH:mm) */
  timeSlots: Array<Scalars['String']['input']>;
  /** Total booking amount before discount */
  totalAmount: Scalars['Int']['input'];
  /** User ID (for validation) */
  userId?: InputMaybe<Scalars['ID']['input']>;
  /** Venue ID */
  venueId: Scalars['ID']['input'];
};

/** Chế độ duyệt tham gia */
export enum ApprovalMode {
  AutoJoin = 'AUTO_JOIN',
  Request = 'REQUEST'
}

export type ApproveHoldBookingInput = {
  /** Booking ID to approve */
  bookingId: Scalars['ID']['input'];
  /** Hold duration in minutes (optional - uses customer request if not provided) */
  holdDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
};

export type ApproveParticipantInput = {
  /** ID kèo */
  gameId: Scalars['ID']['input'];
  /** ID người chơi */
  userId: Scalars['ID']['input'];
};

export type ApproveRegistrationInput = {
  registrationId: Scalars['ID']['input'];
  /** Optional seed number */
  seed?: InputMaybe<Scalars['Int']['input']>;
};

export type AssignRefereeInput = {
  matchId: Scalars['ID']['input'];
  /** System user ID (triggers invite flow). Omit for external referees. */
  refereeId?: InputMaybe<Scalars['ID']['input']>;
  refereeName?: InputMaybe<Scalars['String']['input']>;
};

export type AssignRefereeToCourtInput = {
  courtName: Scalars['String']['input'];
  /** YYYY-MM-DD. Null = all dates. */
  date?: InputMaybe<Scalars['String']['input']>;
  tournamentId: Scalars['ID']['input'];
  tournamentRefereeId: Scalars['ID']['input'];
};

/** Types of auditable actions in the system */
export enum AuditAction {
  AccountRegister = 'ACCOUNT_REGISTER',
  ConfigChange = 'CONFIG_CHANGE',
  Login = 'LOGIN',
  LoginFailed = 'LOGIN_FAILED',
  Logout = 'LOGOUT',
  LogoutAll = 'LOGOUT_ALL',
  OtpChannelFallback = 'OTP_CHANNEL_FALLBACK',
  OtpDeliveryUpdate = 'OTP_DELIVERY_UPDATE',
  OtpRequested = 'OTP_REQUESTED',
  OtpTestPhoneCreated = 'OTP_TEST_PHONE_CREATED',
  OtpTestPhoneDisabled = 'OTP_TEST_PHONE_DISABLED',
  OtpTestPhoneEnabled = 'OTP_TEST_PHONE_ENABLED',
  OtpTestPhoneUpdated = 'OTP_TEST_PHONE_UPDATED',
  OtpTestUserGrantCreated = 'OTP_TEST_USER_GRANT_CREATED',
  OtpTestUserGrantReplaced = 'OTP_TEST_USER_GRANT_REPLACED',
  OtpTestUserGrantRevoked = 'OTP_TEST_USER_GRANT_REVOKED',
  OtpThrottled = 'OTP_THROTTLED',
  OtpVerified = 'OTP_VERIFIED',
  OtpVerifyFailed = 'OTP_VERIFY_FAILED',
  PasswordChange = 'PASSWORD_CHANGE',
  PasswordReset = 'PASSWORD_RESET',
  PortalCapabilityGranted = 'PORTAL_CAPABILITY_GRANTED',
  PortalCapabilityRevoked = 'PORTAL_CAPABILITY_REVOKED',
  RateLimitHit = 'RATE_LIMIT_HIT',
  SystemError = 'SYSTEM_ERROR',
  TokenRefreshFailed = 'TOKEN_REFRESH_FAILED',
  TournamentCourtsUpdated = 'TOURNAMENT_COURTS_UPDATED',
  TournamentForceDrawReset = 'TOURNAMENT_FORCE_DRAW_RESET',
  TournamentLateEntryByeFill = 'TOURNAMENT_LATE_ENTRY_BYE_FILL',
  TournamentMatchAborted = 'TOURNAMENT_MATCH_ABORTED',
  TournamentMatchLiveCorrected = 'TOURNAMENT_MATCH_LIVE_CORRECTED',
  TournamentMatchResultCorrected = 'TOURNAMENT_MATCH_RESULT_CORRECTED',
  TournamentMatchResultOverride = 'TOURNAMENT_MATCH_RESULT_OVERRIDE',
  TournamentMatchWalkoverSet = 'TOURNAMENT_MATCH_WALKOVER_SET',
  UserCreate = 'USER_CREATE',
  UserDelete = 'USER_DELETE',
  UserRoleChange = 'USER_ROLE_CHANGE',
  UserSuspend = 'USER_SUSPEND',
  UserUnsuspend = 'USER_UNSUSPEND',
  VenueApprove = 'VENUE_APPROVE',
  VenueReject = 'VENUE_REJECT',
  VenueStaffAccepted = 'VENUE_STAFF_ACCEPTED',
  VenueStaffRemoved = 'VENUE_STAFF_REMOVED',
  VenueSuspend = 'VENUE_SUSPEND'
}

/** Categories for audit log entries */
export enum AuditCategory {
  Admin = 'ADMIN',
  Auth = 'AUTH',
  Otp = 'OTP',
  Security = 'SECURITY',
  System = 'SYSTEM',
  Tournament = 'TOURNAMENT'
}

export type AuditCategoryCount = {
  __typename?: 'AuditCategoryCount';
  category: Scalars['String']['output'];
  count: Scalars['Int']['output'];
};

export type AuditFilterInput = {
  action?: InputMaybe<AuditAction>;
  actorId?: InputMaybe<Scalars['ID']['input']>;
  category?: InputMaybe<AuditCategory>;
  /** Filter from date (inclusive) */
  from?: InputMaybe<Scalars['DateTime']['input']>;
  /** Search in actorName and target */
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<AuditStatus>;
  /** Filter to date (inclusive) */
  to?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AuditLog = {
  __typename?: 'AuditLog';
  _id: Scalars['ID']['output'];
  action: AuditAction;
  actor?: Maybe<Scalars['ID']['output']>;
  actorName?: Maybe<Scalars['String']['output']>;
  actorRole?: Maybe<Scalars['String']['output']>;
  category: AuditCategory;
  correlationId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  errorMessage?: Maybe<Scalars['String']['output']>;
  ip?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  status: AuditStatus;
  target?: Maybe<Scalars['String']['output']>;
  targetId?: Maybe<Scalars['ID']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userAgent?: Maybe<Scalars['String']['output']>;
};

/** A Relay-style connection for AuditLog items. */
export type AuditLogConnection = {
  __typename?: 'AuditLogConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<AuditLogEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the AuditLogConnection. */
export type AuditLogEdge = {
  __typename?: 'AuditLogEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: AuditLog;
};

export type AuditStats = {
  __typename?: 'AuditStats';
  authLast24h: Scalars['Int']['output'];
  byCategory: Array<AuditCategoryCount>;
  failedLast24h: Scalars['Int']['output'];
  securityLast7d: Scalars['Int']['output'];
  totalEvents: Scalars['Int']['output'];
};

/** Status of an audited action */
export enum AuditStatus {
  Failed = 'FAILED',
  Success = 'SUCCESS'
}

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  message: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  user: User;
};

export type AutoAssignRefereesInput = {
  strategy: AutoAssignStrategy;
  tournamentId: Scalars['ID']['input'];
};

export type AutoAssignRefereesResult = {
  __typename?: 'AutoAssignRefereesResult';
  assignedCount: Scalars['Int']['output'];
  warnings: Array<Scalars['String']['output']>;
};

/** Strategy for auto-assigning referees to matches */
export enum AutoAssignStrategy {
  CourtPreferred = 'COURT_PREFERRED',
  RoundRobin = 'ROUND_ROBIN',
  WorkloadBalanced = 'WORKLOAD_BALANCED'
}

export type AutoScheduleInput = {
  /** Category IDs (null = all) */
  categoryIds?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Override courtBufferMinutes from tournament config */
  courtBufferMinutes?: InputMaybe<Scalars['Int']['input']>;
  /** Court names (null = all) */
  courtNames?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Schedule date (YYYY-MM-DD) */
  date: Scalars['String']['input'];
  /** Override estimated match duration in minutes (overrides per-match estimatedDurationMinutes) */
  defaultMatchDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
  /** End time HH:mm (default 22:00) */
  endTime?: InputMaybe<Scalars['String']['input']>;
  /** Override minRestMinutes from tournament config */
  minRestMinutes?: InputMaybe<Scalars['Int']['input']>;
  /** Order unscheduled matches are processed: bracket order (default) or interleave categories per round */
  orderStrategy?: InputMaybe<AutoScheduleOrderStrategy>;
  /** Xóa lịch cũ trong ngày của các nội dung đã chọn (hoặc tất cả nếu không chọn) trước khi xếp lại */
  rescheduleExisting?: InputMaybe<Scalars['Boolean']['input']>;
  /** Ghi đè khoảng nghỉ trong ngày (HH:mm). Bỏ qua nếu không gửi — dùng theo cấu hình giải. */
  restBreakWindows?: InputMaybe<Array<ScheduleRestBreakWindowInput>>;
  /** Category×round scope (when set, only matching rounds are scheduled) */
  scopes?: InputMaybe<Array<AutoScheduleScope>>;
  /** Start time HH:mm (default 06:00) */
  startTime?: InputMaybe<Scalars['String']['input']>;
  tournamentId: Scalars['ID']['input'];
};

/** Order in which unscheduled matches are processed during auto-schedule */
export enum AutoScheduleOrderStrategy {
  BracketOrder = 'BRACKET_ORDER',
  InterleaveCategories = 'INTERLEAVE_CATEGORIES'
}

/** Result of auto-schedule operation */
export type AutoScheduleResult = {
  __typename?: 'AutoScheduleResult';
  scheduledMatches: Array<TournamentMatch>;
  totalScheduled: Scalars['Int']['output'];
  warnings: Array<Scalars['String']['output']>;
};

export type AutoScheduleScope = {
  categoryId: Scalars['ID']['input'];
  /** Round numbers (null or empty = all rounds for this category) */
  rounds?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type AvailablePassesFilterInput = {
  /** Filter by city */
  city?: InputMaybe<Scalars['String']['input']>;
  /** Filter by district */
  district?: InputMaybe<Scalars['String']['input']>;
  /** Filter from date (YYYY-MM-DD) */
  fromDate?: InputMaybe<Scalars['String']['input']>;
  /** Toạ độ user — vĩ độ (cần kèm longitude để bật geo filter) */
  latitude?: InputMaybe<Scalars['Float']['input']>;
  /** Toạ độ user — kinh độ (cần kèm latitude để bật geo filter) */
  longitude?: InputMaybe<Scalars['Float']['input']>;
  /** Giá tối đa (VND) */
  maxPrice?: InputMaybe<Scalars['Int']['input']>;
  /** Giá tối thiểu (VND) */
  minPrice?: InputMaybe<Scalars['Int']['input']>;
  /** Bán kính tìm kiếm (km) — mặc định 10km, tối đa 50km */
  radiusKm?: InputMaybe<Scalars['Float']['input']>;
  /** Cách sắp xếp kết quả */
  sort?: InputMaybe<BookingPassSortOrder>;
  /** Lọc theo nguồn pass (mặc định trả cả 2 nếu không truyền). Truyền [INTERNAL] để chỉ xem pass đã xác thực. */
  sources?: InputMaybe<Array<BookingPassSource>>;
  /** Filter by sport type */
  sportType?: InputMaybe<SportType>;
  /** Khung giờ trong ngày: MORNING / AFTERNOON / EVENING / NIGHT */
  timeOfDay?: InputMaybe<TimeOfDay>;
  /** Filter to date (YYYY-MM-DD) */
  toDate?: InputMaybe<Scalars['String']['input']>;
  /** Filter by venue ID */
  venueId?: InputMaybe<Scalars['ID']['input']>;
};

export type AvailablePromotionsForBooking = {
  __typename?: 'AvailablePromotionsForBooking';
  /** Auto-applied promotions */
  autoApplied: Array<Promotion>;
  /** Available promo code promotions */
  codePromotions: Array<Promotion>;
  /** Has any available promotions */
  hasPromotions: Scalars['Boolean']['output'];
  /** Pre-calculated discount if auto promotions apply */
  preCalculatedDiscount?: Maybe<DiscountCalculationResult>;
};

export type BadmintonCourtSlotGql = {
  __typename?: 'BadmintonCourtSlotGql';
  playerIndex: Scalars['Int']['output'];
  quadrant: CourtQuadrant;
};

export enum BadmintonFormat {
  Doubles = 'DOUBLES',
  Mixed = 'MIXED',
  Singles = 'SINGLES'
}

export type BadmintonMatchStateGql = {
  __typename?: 'BadmintonMatchStateGql';
  courtSlots?: Maybe<Array<BadmintonCourtSlotGql>>;
  endsSwapped: Scalars['Boolean']['output'];
  format: BadmintonFormat;
  gameNumber: Scalars['Int']['output'];
  intervalTakenAt11: Scalars['Boolean']['output'];
  lastServiceOverAt?: Maybe<Scalars['String']['output']>;
  receiverPlayerIndex?: Maybe<Scalars['Int']['output']>;
  receiverSide: Scalars['Int']['output'];
  rotationIndex?: Maybe<Scalars['Int']['output']>;
  rotationOrder?: Maybe<Array<Scalars['String']['output']>>;
  serverPlayerIndex?: Maybe<Scalars['Int']['output']>;
  serverSide: Scalars['Int']['output'];
  serviceCourt?: Maybe<ServiceCourtSide>;
};

export type BlockUserInput = {
  /** Reason for blocking */
  reason?: InputMaybe<Scalars['String']['input']>;
  /** User ID to block */
  userId: Scalars['ID']['input'];
};

export type BookedSlot = {
  __typename?: 'BookedSlot';
  /** Court ID */
  courtId: Scalars['ID']['output'];
  /** Court name */
  courtName: Scalars['String']['output'];
  /** End time (HH:mm) */
  endTime: Scalars['String']['output'];
  /** Is peak hour */
  isPeakHour: Scalars['Boolean']['output'];
  /** Price for this slot */
  price: Scalars['Int']['output'];
  /** Start time (HH:mm) */
  startTime: Scalars['String']['output'];
};

export type BookedSlotInput = {
  /** Court ID */
  courtId: Scalars['ID']['input'];
  /** Court name */
  courtName: Scalars['String']['input'];
  /** End time (HH:mm) */
  endTime: Scalars['String']['input'];
  /** Is peak hour */
  isPeakHour: Scalars['Boolean']['input'];
  /** Price for this slot */
  price: Scalars['Int']['input'];
  /** Start time (HH:mm) */
  startTime: Scalars['String']['input'];
};

export type Booking = {
  __typename?: 'Booking';
  _id: Scalars['ID']['output'];
  /** Promotions applied to this booking (for analytics attribution) */
  appliedPromotions?: Maybe<Array<BookingAppliedPromotion>>;
  /** Cancellation reason */
  cancellationReason?: Maybe<Scalars['String']['output']>;
  /** Cancelled at */
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  /** Cancelled by user ID */
  cancelledBy?: Maybe<Scalars['ID']['output']>;
  /** Cancelled by user */
  cancelledByUser?: Maybe<User>;
  /** Check-in time */
  checkedInAt?: Maybe<Scalars['DateTime']['output']>;
  /** Check-out time */
  checkedOutAt?: Maybe<Scalars['DateTime']['output']>;
  /** Child session bookings (for recurring master booking) */
  childSessions: Array<Booking>;
  /** When customer requested confirmation (for HOLD bookings) */
  confirmationRequestedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Confirmed at */
  confirmedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Confirmed by staff ID */
  confirmedBy?: Maybe<Scalars['ID']['output']>;
  /** Confirmed by staff */
  confirmedByStaff?: Maybe<User>;
  createdAt: Scalars['DateTime']['output'];
  /** Staff who created */
  createdByStaff?: Maybe<User>;
  /** Staff who created booking (for staff bookings) */
  createdByStaffId?: Maybe<Scalars['ID']['output']>;
  /** Customer user */
  customer?: Maybe<User>;
  /** Resolved customer name for lists/calendar (user, walk-in snapshot, recurring parent fallback) */
  customerDisplayName?: Maybe<Scalars['String']['output']>;
  /** Resolved customer phone for lists/calendar */
  customerDisplayPhone?: Maybe<Scalars['String']['output']>;
  /** Customer user ID (null for walk-in) */
  customerId?: Maybe<Scalars['ID']['output']>;
  /** Customer info (for staff/walk-in bookings) */
  customerInfo?: Maybe<CustomerInfo>;
  /** Customer note */
  customerNote?: Maybe<Scalars['String']['output']>;
  /** Booking date (YYYY-MM-DD) */
  date: Scalars['String']['output'];
  /** Discount amount */
  discount?: Maybe<Scalars['Int']['output']>;
  /** Discount code used */
  discountCode?: Maybe<Scalars['String']['output']>;
  /** Final amount */
  finalAmount: Scalars['Int']['output'];
  /** When staff approved the hold (for HOLD_ACTIVE bookings) */
  holdApprovedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Staff who approved the hold */
  holdApprovedBy?: Maybe<Scalars['ID']['output']>;
  /** Hold expiration time (for HOLD_ACTIVE bookings) */
  holdExpiresAt?: Maybe<Scalars['DateTime']['output']>;
  /** Internal/Staff note */
  internalNote?: Maybe<Scalars['String']['output']>;
  /** Combined invoice for this booking */
  invoice: BookingInvoice;
  /** Is booking currently being passed */
  isBeingPassed: Scalars['Boolean']['output'];
  /** Whether price was manually overridden by staff/owner */
  isManualPrice: Scalars['Boolean']['output'];
  /** Is recurring booking */
  isRecurring: Scalars['Boolean']['output'];
  /** Manual final amount set by staff/owner (original system price stored in totalPrice) */
  manualFinalAmount?: Maybe<Scalars['Int']['output']>;
  /** Reason for manual price override */
  manualPriceNote?: Maybe<Scalars['String']['output']>;
  /** Main order for this booking */
  order?: Maybe<Order>;
  /** All orders related to this booking */
  orders: Array<Order>;
  /** Parent/master booking (for recurring child bookings) */
  parentBooking?: Maybe<Booking>;
  /** Parent booking ID (for recurring) */
  parentBookingId?: Maybe<Scalars['ID']['output']>;
  /** Booking pass ID if this booking is being passed */
  passId?: Maybe<Scalars['ID']['output']>;
  /** Original owner if booking was passed from another user */
  passedFrom?: Maybe<Scalars['ID']['output']>;
  /** Selected payment method */
  paymentMethod?: Maybe<PaymentMethod>;
  /** Recurring configuration (only for master/parent booking) */
  recurringConfig?: Maybe<RecurringConfig>;
  /** Requested hold duration in minutes (set by customer) */
  requestedHoldDurationMinutes?: Maybe<Scalars['Int']['output']>;
  /** Schedule type: fixed / single / LEAD promo */
  scheduleType: BookingScheduleType;
  /** Service fee */
  serviceFee?: Maybe<Scalars['Int']['output']>;
  /** Session number in recurring series (1, 2, 3...) */
  sessionNumber?: Maybe<Scalars['Int']['output']>;
  /** Booked slots */
  slots: Array<BookedSlot>;
  /** Booking source */
  source: BookingSource;
  /** Booking status */
  status: BookingStatus;
  /** Total price */
  totalPrice: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  /** Booking venue */
  venue?: Maybe<Venue>;
  /** Venue ID */
  venueId: Scalars['ID']['output'];
};

export type BookingAppliedPromotion = {
  __typename?: 'BookingAppliedPromotion';
  /** Discount amount from this promotion */
  discountAmount: Scalars['Int']['output'];
  /** Promotion ID */
  promotionId: Scalars['ID']['output'];
};

/** A Relay-style connection for Booking items. */
export type BookingConnection = {
  __typename?: 'BookingConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<BookingEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

export type BookingDistribution = {
  __typename?: 'BookingDistribution';
  /** Color for chart (hex) */
  color: Scalars['String']['output'];
  /** Court type/category label */
  label: Scalars['String']['output'];
  /** Percentage of total */
  percentage: Scalars['Int']['output'];
  /** Number of bookings */
  value: Scalars['Int']['output'];
};

/** An edge in the BookingConnection. */
export type BookingEdge = {
  __typename?: 'BookingEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Booking;
};

export type BookingFilterInput = {
  /** Filter by booking type. Default is MAIN_VIEW (excludes child sessions) */
  bookingType?: InputMaybe<BookingTypeFilter>;
  /** Filter by customer ID */
  customerId?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by date (YYYY-MM-DD) */
  date?: InputMaybe<Scalars['String']['input']>;
  /** Filter from date (YYYY-MM-DD) */
  fromDate?: InputMaybe<Scalars['String']['input']>;
  /** Filter past only */
  pastOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Search by customer name/phone */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  /** Filter by source */
  source?: InputMaybe<BookingSource>;
  /** Filter by status */
  statuses?: InputMaybe<Array<BookingStatus>>;
  /** Filter to date (YYYY-MM-DD) */
  toDate?: InputMaybe<Scalars['String']['input']>;
  /** Filter today only */
  todayOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter upcoming only */
  upcomingOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by venue ID */
  venueId?: InputMaybe<Scalars['ID']['input']>;
};

export type BookingInterestSlot = {
  __typename?: 'BookingInterestSlot';
  /** Court name */
  courtName: Scalars['String']['output'];
  /** End time (HH:mm) */
  endTime: Scalars['String']['output'];
  /** Start time (HH:mm) */
  startTime: Scalars['String']['output'];
};

export type BookingInvoice = {
  __typename?: 'BookingInvoice';
  /** Additional orders amount */
  additionalAmount: Scalars['Int']['output'];
  /** Additional orders (F&B, etc.) */
  additionalOrders: Array<Order>;
  /** Booking order amount */
  bookingAmount: Scalars['Int']['output'];
  /** Main booking order */
  bookingOrder?: Maybe<Order>;
  /** Combined payment status */
  paymentStatus: Scalars['String']['output'];
  /** Total amount for all orders */
  totalAmount: Scalars['Int']['output'];
};

export type BookingLink = {
  __typename?: 'BookingLink';
  /** ID booking */
  bookingId: Scalars['ID']['output'];
  /** Tên sân */
  courtNames: Array<Scalars['String']['output']>;
  /** Ngày booking */
  date: Scalars['String']['output'];
  /** Giờ kết thúc */
  endTime: Scalars['String']['output'];
  /** Giờ bắt đầu */
  startTime: Scalars['String']['output'];
  /** Tổng tiền sân */
  totalPrice: Scalars['Int']['output'];
};

export type BookingPass = {
  __typename?: 'BookingPass';
  _id: Scalars['ID']['output'];
  /** When transferee/selected user accepted the pass */
  acceptedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Asking price set by owner */
  askingPrice: Scalars['Int']['output'];
  /** The booking being passed (chỉ có với pass INTERNAL — null cho EXTERNAL) */
  booking?: Maybe<Booking>;
  /** Booking date (YYYY-MM-DD) */
  bookingDate: Scalars['String']['output'];
  /** Booking ID — chỉ có với pass INTERNAL */
  bookingId?: Maybe<Scalars['ID']['output']>;
  /** Cancellation reason */
  cancellationReason?: Maybe<Scalars['String']['output']>;
  /** When pass was cancelled */
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Description/reason for passing */
  description?: Maybe<Scalars['String']['output']>;
  /** When pass expires (booking start time) */
  expiresAt: Scalars['DateTime']['output'];
  /** Thông tin lịch đặt do user khai báo (chỉ khi source=EXTERNAL) */
  externalBooking?: Maybe<ExternalBookingSnapshot>;
  /** Users who expressed interest */
  interestedUserDetails: Array<User>;
  /** List of interested users (for public pass) */
  interestedUsers?: Maybe<Array<InterestedUser>>;
  /** Original booking price */
  originalPrice: Scalars['Int']['output'];
  /** Payment method for transfer */
  paymentMethod?: Maybe<PaymentMethod>;
  /** Payment proof images */
  paymentProofImages?: Maybe<Array<Scalars['String']['output']>>;
  /** Selected user for public pass */
  selectedUser?: Maybe<User>;
  /** Selected user ID */
  selectedUserId?: Maybe<Scalars['ID']['output']>;
  /** Nguồn gốc pass: INTERNAL (booking hệ thống) hoặc EXTERNAL (user tự khai báo) */
  source: BookingPassSource;
  /** Pass status */
  status: BookingPassStatus;
  /** When transfer was completed */
  transferCompletedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Target recipient for private pass */
  transferee?: Maybe<User>;
  /** Target recipient for private pass */
  transfereeId?: Maybe<Scalars['ID']['output']>;
  /** Original owner (transferrer) */
  transferrer: User;
  /** Original owner (transferrer) */
  transferrerId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  /** Venue của pass (EXTERNAL có thể null nếu user chưa khai báo sân nào) */
  venue?: Maybe<Venue>;
  /** Venue ID — INTERNAL luôn có; EXTERNAL có thể null nếu sân chưa được khai báo */
  venueId?: Maybe<Scalars['ID']['output']>;
  /** Pass visibility */
  visibility: BookingPassVisibility;
};

/** A Relay-style connection for BookingPass items. */
export type BookingPassConnection = {
  __typename?: 'BookingPassConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<BookingPassEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the BookingPassConnection. */
export type BookingPassEdge = {
  __typename?: 'BookingPassEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: BookingPass;
};

export type BookingPassReport = {
  __typename?: 'BookingPassReport';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Mô tả chi tiết */
  description?: Maybe<Scalars['String']['output']>;
  /** Ghi chú admin / kết quả xử lý */
  notes?: Maybe<Scalars['String']['output']>;
  pass?: Maybe<BookingPass>;
  /** ID của pass bị báo cáo */
  passId: Scalars['ID']['output'];
  /** Lý do báo cáo */
  reason: BookingPassReportReason;
  reporter?: Maybe<User>;
  /** User báo cáo */
  reporterId: Scalars['ID']['output'];
  /** Thời điểm xử lý */
  reviewedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Admin xử lý */
  reviewedBy?: Maybe<Scalars['ID']['output']>;
  reviewer?: Maybe<User>;
  /** Trạng thái */
  status: BookingPassReportStatus;
  transferrer?: Maybe<User>;
  /** ID của user pass (transferrer) */
  transferrerId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** A Relay-style connection for BookingPassReport items. */
export type BookingPassReportConnection = {
  __typename?: 'BookingPassReportConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<BookingPassReportEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the BookingPassReportConnection. */
export type BookingPassReportEdge = {
  __typename?: 'BookingPassReportEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: BookingPassReport;
};

export type BookingPassReportFilterInput = {
  reason?: InputMaybe<BookingPassReportReason>;
  status?: InputMaybe<BookingPassReportStatus>;
  transferrerId?: InputMaybe<Scalars['ID']['input']>;
};

/** Lý do báo cáo pass sân */
export enum BookingPassReportReason {
  AlreadyTransferred = 'ALREADY_TRANSFERRED',
  FakeBooking = 'FAKE_BOOKING',
  Inappropriate = 'INAPPROPRIATE',
  Other = 'OTHER',
  PriceGouging = 'PRICE_GOUGING',
  Scam = 'SCAM'
}

/** Trạng thái báo cáo pass sân */
export enum BookingPassReportStatus {
  Dismissed = 'DISMISSED',
  Pending = 'PENDING',
  Resolved = 'RESOLVED',
  Reviewed = 'REVIEWED'
}

/** Cách sắp xếp danh sách pass */
export enum BookingPassSortOrder {
  CreatedDesc = 'CREATED_DESC',
  DiscountDesc = 'DISCOUNT_DESC',
  ExpiresAsc = 'EXPIRES_ASC',
  PriceAsc = 'PRICE_ASC',
  PriceDesc = 'PRICE_DESC'
}

/** Nguồn gốc của booking pass: INTERNAL = lịch hệ thống, EXTERNAL = lịch tự khai báo */
export enum BookingPassSource {
  External = 'EXTERNAL',
  Internal = 'INTERNAL'
}

/** Status of the booking pass */
export enum BookingPassStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Expired = 'EXPIRED',
  Open = 'OPEN',
  Pending = 'PENDING'
}

/** Visibility of the booking pass */
export enum BookingPassVisibility {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

/** Schedule classification: fixed recurring, single, or LEAD promo */
export enum BookingScheduleType {
  Fixed = 'FIXED',
  Lead = 'LEAD',
  Single = 'SINGLE'
}

export type BookingSortInput = {
  /** Sort by field */
  sortBy?: InputMaybe<Scalars['String']['input']>;
  /** Sort order */
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};

/** Source of the booking */
export enum BookingSource {
  Customer = 'CUSTOMER',
  Staff = 'STAFF',
  WalkIn = 'WALK_IN'
}

export type BookingStats = {
  __typename?: 'BookingStats';
  /** Cancelled bookings */
  cancelledBookings: Scalars['Int']['output'];
  /** Completed bookings */
  completedBookings: Scalars['Int']['output'];
  /** Confirmed bookings */
  confirmedBookings: Scalars['Int']['output'];
  /** Expired bookings */
  expiredBookings: Scalars['Int']['output'];
  /** No show bookings */
  noShowBookings: Scalars['Int']['output'];
  /** Pending bookings */
  pendingBookings: Scalars['Int']['output'];
  /** Today bookings */
  todayBookings: Scalars['Int']['output'];
  /** Total bookings */
  totalBookings: Scalars['Int']['output'];
};

/** Status of the booking */
export enum BookingStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Confirmed = 'CONFIRMED',
  Expired = 'EXPIRED',
  HoldActive = 'HOLD_ACTIVE',
  HoldPending = 'HOLD_PENDING',
  NoShow = 'NO_SHOW',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

/** Filter bookings by type */
export enum BookingTypeFilter {
  All = 'ALL',
  MainView = 'MAIN_VIEW',
  RecurringChild = 'RECURRING_CHILD',
  RecurringMaster = 'RECURRING_MASTER',
  Single = 'SINGLE'
}

export type BookingWithOrderPayload = {
  __typename?: 'BookingWithOrderPayload';
  /** The confirmed booking */
  booking: Booking;
  /** Order created for the booking */
  order: Order;
};

export type BracketDrawPreview = {
  __typename?: 'BracketDrawPreview';
  /** True khi mô phỏng không phát hiện cặp cùng CLB ở vòng 1 */
  canFullySeparateClubs: Scalars['Boolean']['output'];
  /** Số xung đột CLB vòng 1 sau mô phỏng bốc thăm (0 = tách hoàn toàn được) */
  clubSeparationConflictCount: Scalars['Int']['output'];
  /** Cảnh báo khi không thể tách hoàn toàn CLB ở vòng 1 */
  clubSeparationWarning?: Maybe<Scalars['String']['output']>;
  /** Kích thước nhánh đấu hiện tại (cấu hình) */
  currentBracketSize: Scalars['Int']['output'];
  /** Số VĐV đã duyệt trong nội dung */
  playerCount: Scalars['Int']['output'];
  /** Kích thước nhánh đấu đề xuất (lũy thừa 2 tối thiểu cho số VĐV) */
  suggestedBracketSize: Scalars['Int']['output'];
  /** Thông báo cảnh báo khi willAutoAdjust */
  warningMessage?: Maybe<Scalars['String']['output']>;
  /** True khi currentBracketSize > suggestedBracketSize — bốc thăm sẽ tự động giảm để tránh BYE vs BYE */
  willAutoAdjust: Scalars['Boolean']['output'];
};

export type BracketSizeAdjustment = {
  __typename?: 'BracketSizeAdjustment';
  /** ID hạng mục cần điều chỉnh */
  categoryId: Scalars['String']['output'];
  /** Tên nội dung thi đấu */
  categoryTitle: Scalars['String']['output'];
  /** Kích thước nhánh đấu hiện tại */
  currentBracketSize: Scalars['Int']['output'];
  /** Số VĐV sau khi import */
  newRegistrationCount: Scalars['Int']['output'];
  /** Kích thước nhánh đấu đề xuất (lũy thừa 2 phù hợp) */
  suggestedBracketSize: Scalars['Int']['output'];
};

export type BracketSizeAdjustmentInput = {
  /** ID hạng mục */
  categoryId: Scalars['ID']['input'];
  /** Kích thước nhánh đấu mới (lũy thừa 2) */
  newBracketSize: Scalars['Int']['input'];
};

export type BulkAssignRefereeInput = {
  matchIds: Array<Scalars['ID']['input']>;
  tournamentRefereeId: Scalars['ID']['input'];
};

export type BulkAssignRefereeResult = {
  __typename?: 'BulkAssignRefereeResult';
  assignedCount: Scalars['Int']['output'];
  skippedCount: Scalars['Int']['output'];
  warnings: Array<Scalars['String']['output']>;
};

export type BulkCheckInInput = {
  /** ID kèo */
  gameId: Scalars['ID']['input'];
  /** Danh sách ID người chơi */
  userIds: Array<Scalars['ID']['input']>;
};

export type BulkDeleteProductsInput = {
  /** Product IDs to delete */
  productIds: Array<Scalars['ID']['input']>;
  /** Shop ID (for validation) */
  shopId?: InputMaybe<Scalars['ID']['input']>;
  /** Venue ID (for validation) */
  venueId?: InputMaybe<Scalars['ID']['input']>;
};

export type BulkImportError = {
  __typename?: 'BulkImportError';
  /** Tên vận động viên (nếu có) */
  athleteName?: Maybe<Scalars['String']['output']>;
  /** Lý do thất bại */
  reason: Scalars['String']['output'];
  /** Số thứ tự dòng (1-based) */
  row: Scalars['Int']['output'];
};

export type BulkImportRegistrationItemInput = {
  /** Tên vận động viên (bắt buộc) */
  athleteName: Scalars['String']['input'];
  /** ID hạng mục thi đấu (bắt buộc) */
  categoryId: Scalars['ID']['input'];
  /** CLB / Đội */
  club?: InputMaybe<Scalars['String']['input']>;
  /** Ngày sinh (YYYY-MM-DD) */
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  /** Email */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Tên phụ huynh / người giám hộ */
  guardianName?: InputMaybe<Scalars['String']['input']>;
  /** SĐT phụ huynh / người giám hộ */
  guardianPhone?: InputMaybe<Scalars['String']['input']>;
  /** Ghi chú */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Tên đồng đội (dùng cho nội dung đôi) */
  partnerName?: InputMaybe<Scalars['String']['input']>;
  /** SĐT đồng đội (dùng cho nội dung đôi) */
  partnerPhone?: InputMaybe<Scalars['String']['input']>;
  /** Phí đăng ký (VND). Nội dung đơn: 1 VĐV. Nội dung đôi: 2 VĐV (cả đội). */
  paymentAmount?: InputMaybe<Scalars['Float']['input']>;
  /** Số điện thoại */
  phone?: InputMaybe<Scalars['String']['input']>;
  /** Trường / Đơn vị */
  school?: InputMaybe<Scalars['String']['input']>;
};

export type BulkImportRegistrationsInput = {
  /** Điều chỉnh kích thước nhánh đấu (khi user đồng ý từ preview) */
  bracketSizeAdjustments?: InputMaybe<Array<BracketSizeAdjustmentInput>>;
  /** Danh sách đăng ký (tối đa 500) */
  registrations: Array<BulkImportRegistrationItemInput>;
  /** ID giải đấu */
  tournamentId: Scalars['ID']['input'];
};

export type BulkImportResult = {
  __typename?: 'BulkImportResult';
  /** Chi tiết các dòng thất bại */
  errors: Array<BulkImportError>;
  /** Số lượng đăng ký thất bại */
  failedCount: Scalars['Int']['output'];
  /** Số lượng đăng ký thành công */
  successCount: Scalars['Int']['output'];
};

export type BulkOperationResult = {
  __typename?: 'BulkOperationResult';
  /** IDs of items that failed */
  failed: Array<Scalars['String']['output']>;
  /** Number of items successfully processed */
  success: Scalars['Int']['output'];
};

export type BulkRegistrationActionInput = {
  registrationIds: Array<Scalars['ID']['input']>;
};

export type BulkScheduleMatchInput = {
  items: Array<ScheduleMatchInput>;
};

export type BulkUnscheduleByDateInput = {
  /** Category IDs (null = all categories) */
  categoryIds?: InputMaybe<Array<Scalars['String']['input']>>;
  /** YYYY-MM-DD local date to clear */
  date?: InputMaybe<Scalars['String']['input']>;
  tournamentId: Scalars['ID']['input'];
};

export type BulkUpdateDisplayOrderInput = {
  /** Shop ID (for validation) */
  shopId?: InputMaybe<Scalars['ID']['input']>;
  /** Display order updates */
  updates: Array<DisplayOrderUpdateInput>;
  /** Venue ID (for validation) */
  venueId?: InputMaybe<Scalars['ID']['input']>;
};

export type BulkUpdateStatusInput = {
  /** Product IDs to update */
  productIds: Array<Scalars['ID']['input']>;
  /** Shop ID (for validation) */
  shopId?: InputMaybe<Scalars['ID']['input']>;
  /** New status */
  status: ProductStatus;
  /** Venue ID (for validation) */
  venueId?: InputMaybe<Scalars['ID']['input']>;
};

export type CampaignGoals = {
  __typename?: 'CampaignGoals';
  /** Mục tiêu tổng lượt check-in */
  targetCheckIns?: Maybe<Scalars['Int']['output']>;
  /** Mục tiêu fill rate (0-1) */
  targetFillRate?: Maybe<Scalars['Float']['output']>;
  /** Mục tiêu số người chơi unique */
  targetUniqueUsers?: Maybe<Scalars['Int']['output']>;
};

export type CampaignGoalsInput = {
  /** Mục tiêu tổng lượt check-in */
  targetCheckIns?: InputMaybe<Scalars['Int']['input']>;
  /** Mục tiêu fill rate (0-1) */
  targetFillRate?: InputMaybe<Scalars['Float']['input']>;
  /** Mục tiêu số người chơi unique */
  targetUniqueUsers?: InputMaybe<Scalars['Int']['input']>;
};

export type CampaignStats = {
  __typename?: 'CampaignStats';
  /** Check-in delta trung bình (phút so với giờ bắt đầu) */
  avgCheckInDeltaMinutes?: Maybe<Scalars['Float']['output']>;
  /** Fill rate trung bình (totalCheckIns / totalSlots) */
  avgFillRate: Scalars['Float']['output'];
  /** Số lượt bulk check-in */
  bulkCount: Scalars['Int']['output'];
  /** Check-in theo ngày */
  checkInsByDate: Array<CheckInByDate>;
  /** Check-in theo từng kèo */
  checkInsByGame: Array<CheckInByGame>;
  /** Số lượt check-in thủ công */
  manualCount: Scalars['Int']['output'];
  /** Số lượt quét QR */
  qrScanCount: Scalars['Int']['output'];
  /** Retention rate: % người chơi join >= 2 kèo */
  returnRate: Scalars['Float']['output'];
  /** Top người chơi tích cực nhất */
  topParticipants: Array<TopCampaignParticipant>;
  /** Tổng lượt check-in */
  totalCheckIns: Scalars['Int']['output'];
  /** Tổng số kèo trong campaign */
  totalGames: Scalars['Int']['output'];
  /** Tổng số slot (maxParticipants) */
  totalSlots: Scalars['Int']['output'];
  /** Số người chơi unique đã check-in */
  uniqueParticipants: Scalars['Int']['output'];
};

export type CanPassBookingResult = {
  __typename?: 'CanPassBookingResult';
  /** Whether booking can be passed */
  canPass: Scalars['Boolean']['output'];
  /** Reasons why booking cannot be passed */
  reasons?: Maybe<Array<Scalars['String']['output']>>;
};

export type CancelHoldBookingInput = {
  /** Booking ID to cancel */
  bookingId: Scalars['ID']['input'];
  /** Cancellation reason (optional) */
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type CancelPickupGameInput = {
  /** ID kèo */
  gameId: Scalars['ID']['input'];
  /** Lý do hủy */
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type CascadeRescheduleInput = {
  /** Anchor match (the one that finished early/late) */
  matchId: Scalars['ID']['input'];
  /** Shift in minutes (+push later, -pull earlier) */
  shiftMinutes: Scalars['Int']['input'];
};

/** Result of cascade reschedule operation */
export type CascadeRescheduleResult = {
  __typename?: 'CascadeRescheduleResult';
  affectedMatches: Array<TournamentMatch>;
  totalAffected: Scalars['Int']['output'];
  warnings: Array<Scalars['String']['output']>;
};

export type CategoryFilterInput = {
  /** Include system categories */
  includeSystem?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by active status */
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by parent category ID */
  parentId?: InputMaybe<Scalars['ID']['input']>;
  /** Search by name */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  /** Filter by shop ID */
  shopId?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by type */
  type?: InputMaybe<CategoryType>;
  /** Filter by venue ID */
  venueId?: InputMaybe<Scalars['ID']['input']>;
};

export type CategoryRevenue = {
  __typename?: 'CategoryRevenue';
  /** Category name */
  category: Scalars['String']['output'];
  /** Color key for chart */
  colorKey: Scalars['String']['output'];
  /** Category display name */
  displayName: Scalars['String']['output'];
  /** Total items sold */
  itemCount: Scalars['Int']['output'];
  /** Number of orders */
  orderCount: Scalars['Int']['output'];
  /** Percentage of total revenue */
  percentage: Scalars['Float']['output'];
  /** Total revenue */
  revenue: Scalars['Int']['output'];
};

export type CategorySalesPerformance = {
  __typename?: 'CategorySalesPerformance';
  /** Category ID */
  categoryId: Scalars['String']['output'];
  /** Category name */
  categoryName: Scalars['String']['output'];
  /** Color key for chart */
  colorKey: Scalars['String']['output'];
  /** Revenue growth (%) */
  growth: Scalars['Float']['output'];
  /** Category icon */
  icon?: Maybe<Scalars['String']['output']>;
  /** Number of orders */
  orderCount: Scalars['Int']['output'];
  /** Percentage of total revenue */
  percentage: Scalars['Float']['output'];
  /** Previous period revenue */
  previousRevenue: Scalars['Int']['output'];
  /** Number of products in this category */
  productCount: Scalars['Int']['output'];
  /** Total items sold */
  quantitySold: Scalars['Int']['output'];
  /** Total revenue */
  revenue: Scalars['Int']['output'];
};

/** Status of a tournament category */
export enum CategoryStatus {
  Completed = 'COMPLETED',
  DrawCompleted = 'DRAW_COMPLETED',
  DrawPending = 'DRAW_PENDING',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING',
  RegistrationOpen = 'REGISTRATION_OPEN'
}

export type CategoryTree = {
  __typename?: 'CategoryTree';
  /** Category */
  category: ProductCategory;
  /** Child categories */
  children: Array<CategoryTree>;
};

/** Type/scope of the category */
export enum CategoryType {
  Shop = 'SHOP',
  System = 'SYSTEM',
  Venue = 'VENUE'
}

export type ChangePasswordInput = {
  currentPassword?: InputMaybe<Scalars['String']['input']>;
  newPassword: Scalars['String']['input'];
};

/** Type of media to upload for chat */
export enum ChatMediaType {
  File = 'FILE',
  Image = 'IMAGE',
  Video = 'VIDEO'
}

export type ChatMediaUploadResult = {
  __typename?: 'ChatMediaUploadResult';
  /** Storage key/path */
  key: Scalars['String']['output'];
  /** Type of media uploaded */
  mediaType: Scalars['String']['output'];
  /** Public URL of the uploaded media */
  url: Scalars['String']['output'];
};

export type CheckInByDate = {
  __typename?: 'CheckInByDate';
  /** Số lượt check-in */
  count: Scalars['Int']['output'];
  /** Ngày (YYYY-MM-DD) */
  date: Scalars['String']['output'];
};

export type CheckInByGame = {
  __typename?: 'CheckInByGame';
  /** Số lượt bulk check-in */
  bulkCount: Scalars['Int']['output'];
  /** Số lượt check-in */
  checkIns: Scalars['Int']['output'];
  /** Ngày diễn ra */
  date?: Maybe<Scalars['String']['output']>;
  /** Fill rate (0-1) */
  fillRate: Scalars['Float']['output'];
  /** ID kèo */
  gameId: Scalars['ID']['output'];
  /** Tên kèo */
  gameName: Scalars['String']['output'];
  /** Số lượt check-in thủ công */
  manualCount: Scalars['Int']['output'];
  /** Số slot tối đa */
  maxSlots: Scalars['Int']['output'];
  /** Số lượt quét QR */
  qrScanCount: Scalars['Int']['output'];
  /** Môn thể thao */
  sportType?: Maybe<Scalars['String']['output']>;
  /** Tên sân */
  venueName?: Maybe<Scalars['String']['output']>;
};

/** Phương thức check-in người chơi */
export enum CheckInMethod {
  Bulk = 'BULK',
  Manual = 'MANUAL',
  QrScan = 'QR_SCAN'
}

export type CheckInParticipantInput = {
  /** Phương thức check-in */
  checkInMethod?: InputMaybe<CheckInMethod>;
  /** Timestamp từ mã QR (ISO string) */
  clientTimestamp?: InputMaybe<Scalars['String']['input']>;
  /** ID kèo */
  gameId: Scalars['ID']['input'];
  /** ID người chơi */
  userId: Scalars['ID']['input'];
};

export type ClaimEquipmentInput = {
  /** ID thiết bị */
  equipmentId: Scalars['ID']['input'];
  /** ID kèo */
  gameId: Scalars['ID']['input'];
};

export type ClaimRequestFilterInput = {
  /** Filter by status */
  status?: InputMaybe<ClaimRequestStatus>;
  /** Filter by user ID */
  userId?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by venue ID */
  venueId?: InputMaybe<Scalars['ID']['input']>;
};

export type ClaimRequestStats = {
  __typename?: 'ClaimRequestStats';
  /** Total approved claims */
  approved: Scalars['Int']['output'];
  /** Total cancelled claims */
  cancelled: Scalars['Int']['output'];
  /** Total pending claims */
  pending: Scalars['Int']['output'];
  /** Total rejected claims */
  rejected: Scalars['Int']['output'];
  /** Claims this month */
  thisMonth: Scalars['Int']['output'];
  /** Claims this week */
  thisWeek: Scalars['Int']['output'];
  /** Total claims all time */
  total: Scalars['Int']['output'];
};

/** Status of a venue claim request */
export enum ClaimRequestStatus {
  Approved = 'APPROVED',
  Cancelled = 'CANCELLED',
  Expired = 'EXPIRED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

/** Identifies which client app made the request */
export enum ClientSource {
  LandingPage = 'LANDING_PAGE',
  Mobile = 'MOBILE',
  Portal = 'PORTAL',
  Unknown = 'UNKNOWN',
  WebApp = 'WEB_APP'
}

/** What the coin-toss winner chose: serve or court side */
export enum CoinTossChoice {
  Serve = 'SERVE',
  Side = 'SIDE'
}

/** Payload for the commentDeleted subscription. */
export type CommentDeletedPayload = {
  __typename?: 'CommentDeletedPayload';
  _id: Scalars['ID']['output'];
  commentId: Scalars['ID']['output'];
  parentId?: Maybe<Scalars['ID']['output']>;
  postId: Scalars['ID']['output'];
};

export type CompleteSetInput = {
  matchId: Scalars['ID']['input'];
  /** Winning player: 1 or 2 */
  winner: Scalars['Int']['input'];
};

export type ConfirmEmailUpdateInput = {
  code: Scalars['String']['input'];
  newEmail: Scalars['String']['input'];
  verificationId: Scalars['String']['input'];
};

export type ConfirmPhoneUpdateInput = {
  firebaseIdToken?: InputMaybe<Scalars['String']['input']>;
  idToken?: InputMaybe<Scalars['String']['input']>;
  newPhone: Scalars['String']['input'];
  phoneVerificationToken?: InputMaybe<Scalars['String']['input']>;
};

export type ContactInquiry = {
  __typename?: 'ContactInquiry';
  _id: Scalars['ID']['output'];
  /** Internal admin note */
  adminNote?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Sender email address */
  email: Scalars['String']['output'];
  /** Inquiry message content */
  message: Scalars['String']['output'];
  /** Sender full name */
  name: Scalars['String']['output'];
  /** Sender phone number */
  phone: Scalars['String']['output'];
  /** When admin replied */
  repliedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Admin who replied */
  repliedBy?: Maybe<Scalars['ID']['output']>;
  /** Admin who replied */
  repliedByUser?: Maybe<User>;
  /** Current inquiry status */
  status: InquiryStatus;
  /** Inquiry subject category */
  subject: ContactSubject;
  updatedAt: Scalars['DateTime']['output'];
};

/** A Relay-style connection for ContactInquiry items. */
export type ContactInquiryConnection = {
  __typename?: 'ContactInquiryConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<ContactInquiryEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the ContactInquiryConnection. */
export type ContactInquiryEdge = {
  __typename?: 'ContactInquiryEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: ContactInquiry;
};

export type ContactInquiryFilterInput = {
  /** Filter from date */
  from?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  /** Search by name, email, or phone */
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<InquiryStatus>;
  subject?: InputMaybe<ContactSubject>;
  /** Filter to date */
  to?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ContactInquiryStats = {
  __typename?: 'ContactInquiryStats';
  closedCount: Scalars['Int']['output'];
  inProgressCount: Scalars['Int']['output'];
  newCount: Scalars['Int']['output'];
  repliedCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

/** Subject category for contact inquiries */
export enum ContactSubject {
  Cooperation = 'COOPERATION',
  Other = 'OTHER',
  Recruitment = 'RECRUITMENT',
  Support = 'SUPPORT'
}

export type Conversation = {
  __typename?: 'Conversation';
  _id: Scalars['ID']['output'];
  /** Users who archived this conversation */
  archivedBy: Array<Scalars['ID']['output']>;
  /** Group avatar URL (for group chats only) */
  avatarUrl?: Maybe<Scalars['String']['output']>;
  /** ID of the context entity (pickup game, tournament, etc.) */
  contextId?: Maybe<Scalars['ID']['output']>;
  /** Context type for this conversation */
  contextType?: Maybe<ConversationContextType>;
  createdAt: Scalars['DateTime']['output'];
  /** Timestamp of the last message */
  lastMessageAt?: Maybe<Scalars['DateTime']['output']>;
  /** ID of the last message */
  lastMessageId?: Maybe<Scalars['ID']['output']>;
  /** User IDs who have read the last message */
  lastMessageReadBy: Array<Scalars['ID']['output']>;
  /** ID of the sender of the last message */
  lastMessageSenderId?: Maybe<Scalars['ID']['output']>;
  /** Preview text of the last message */
  lastMessageText?: Maybe<Scalars['String']['output']>;
  /** Users who muted this conversation */
  mutedBy: Array<Scalars['ID']['output']>;
  /** Group name (for group chats only) */
  name?: Maybe<Scalars['String']['output']>;
  /** Array of participant user IDs */
  participantIds: Array<Scalars['ID']['output']>;
  /** Venue staff badges for participants who are active venue staff */
  participantStaffBadges?: Maybe<Array<StaffBadge>>;
  /** Participant user details */
  participants?: Maybe<Array<Maybe<User>>>;
  type: ConversationType;
  /** Number of unread messages for current user in this conversation */
  unreadCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** A Relay-style connection for Conversation items. */
export type ConversationConnection = {
  __typename?: 'ConversationConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<ConversationEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** Context type for the conversation */
export enum ConversationContextType {
  None = 'NONE',
  PickupGame = 'PICKUP_GAME'
}

/** An edge in the ConversationConnection. */
export type ConversationEdge = {
  __typename?: 'ConversationEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Conversation;
};

export type ConversationFilterInput = {
  /** Filter by context type (e.g., pickup_game, none) */
  contextType?: InputMaybe<ConversationContextType>;
  /** Exclude conversations with context (pickup games, etc.). If true, only show direct/standalone conversations. */
  excludeContextConversations?: InputMaybe<Scalars['Boolean']['input']>;
  /** Show only archived conversations */
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  /** Show only muted conversations */
  isMuted?: InputMaybe<Scalars['Boolean']['input']>;
  /** Search query for conversation name or participant names */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  /** Filter by conversation type */
  type?: InputMaybe<ConversationType>;
};

/** Type of conversation */
export enum ConversationType {
  Direct = 'DIRECT',
  Group = 'GROUP'
}

export type Coordinates = {
  __typename?: 'Coordinates';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type CoordinatesInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type CorrectFinishedMatchResultInput = {
  /** Optimistic concurrency guard */
  expectedMatchUpdatedAt?: InputMaybe<Scalars['String']['input']>;
  matchId: Scalars['ID']['input'];
  /** Lý do sửa kết quả (audit bắt buộc) */
  reason: Scalars['String']['input'];
  /** Set scores [[p1,p2],[p1,p2],...] */
  setScores?: InputMaybe<Array<Array<Scalars['Int']['input']>>>;
  /** Winner: 1 or 2 */
  winner: Scalars['Int']['input'];
};

export type CorrectionEvent = {
  __typename?: 'CorrectionEvent';
  action: MatchCorrectionAction;
  actorId: Scalars['ID']['output'];
  actorRole?: Maybe<Scalars['String']['output']>;
  afterSnapshot?: Maybe<CorrectionSnapshot>;
  beforeSnapshot?: Maybe<CorrectionSnapshot>;
  id: Scalars['ID']['output'];
  reason: Scalars['String']['output'];
  /** ISO timestamp */
  timestamp: Scalars['String']['output'];
};

export type CorrectionSnapshot = {
  __typename?: 'CorrectionSnapshot';
  pointHistoryLength?: Maybe<Scalars['Int']['output']>;
  sets?: Maybe<Array<Array<Scalars['Int']['output']>>>;
  status?: Maybe<Scalars['String']['output']>;
  winner?: Maybe<Scalars['Int']['output']>;
};

export type CostConfig = {
  __typename?: 'CostConfig';
  /** Ghi chú chi phí */
  costNote?: Maybe<Scalars['String']['output']>;
  /** Giá cố định nữ (FEMALE_FIXED_MALE_SPLIT) */
  femalePriceFixed?: Maybe<Scalars['Int']['output']>;
  /** Giá cố định/người */
  fixedPrice?: Maybe<Scalars['Int']['output']>;
  /** Giá theo giới tính (FIXED: nam/nữ khác nhau) */
  genderPricing?: Maybe<GenderPricing>;
  /** Tổng tiền sân để tính phần nam chia (FEMALE_FIXED_MALE_SPLIT) */
  maleSplitTotalCost?: Maybe<Scalars['Int']['output']>;
  /** Giá tối đa/người */
  priceMax?: Maybe<Scalars['Int']['output']>;
  /** Giá tối thiểu/người */
  priceMin?: Maybe<Scalars['Int']['output']>;
  /** Tổng chi phí sân */
  totalVenueCost?: Maybe<Scalars['Int']['output']>;
  /** Hình thức chia tiền */
  type: CostSharingType;
};

export type CostConfigInput = {
  /** Ghi chú chi phí */
  costNote?: InputMaybe<Scalars['String']['input']>;
  /** Giá cố định nữ phải trả (FEMALE_FIXED_MALE_SPLIT) */
  femalePriceFixed?: InputMaybe<Scalars['Int']['input']>;
  /** Giá cố định/người */
  fixedPrice?: InputMaybe<Scalars['Int']['input']>;
  /** Giá theo giới tính (FIXED) */
  genderPricing?: InputMaybe<GenderPricingInput>;
  /** Tổng tiền sân để tính phần nam chia (FEMALE_FIXED_MALE_SPLIT) */
  maleSplitTotalCost?: InputMaybe<Scalars['Int']['input']>;
  /** Giá tối đa/người (khoảng giá) */
  priceMax?: InputMaybe<Scalars['Int']['input']>;
  /** Giá tối thiểu/người (khoảng giá) */
  priceMin?: InputMaybe<Scalars['Int']['input']>;
  /** Tổng chi phí sân */
  totalVenueCost?: InputMaybe<Scalars['Int']['input']>;
  /** Hình thức chia tiền */
  type: CostSharingType;
};

/** Hình thức chia tiền */
export enum CostSharingType {
  FemaleFixedMaleSplit = 'FEMALE_FIXED_MALE_SPLIT',
  Fixed = 'FIXED',
  Free = 'FREE',
  SplitEvenly = 'SPLIT_EVENLY'
}

export type Court = {
  __typename?: 'Court';
  _id: Scalars['ID']['output'];
  /** Court capacity (max players) */
  capacity: Scalars['Int']['output'];
  /** Court type */
  courtType: CourtType;
  createdAt: Scalars['DateTime']['output'];
  /** Default price per hour */
  defaultPricePerHour: Scalars['Int']['output'];
  /** Court description */
  description?: Maybe<Scalars['String']['output']>;
  /** Display order */
  displayOrder: Scalars['Int']['output'];
  /** Special features */
  features?: Maybe<Array<Scalars['String']['output']>>;
  /** Court image URL */
  imageUrl?: Maybe<Scalars['String']['output']>;
  /** Is indoor court */
  isIndoor: Scalars['Boolean']['output'];
  /** Maintenance note */
  maintenanceNote?: Maybe<Scalars['String']['output']>;
  /** Minimum number of slots required per booking */
  minimumBookingSlots: Scalars['Int']['output'];
  /** Court name/number */
  name: Scalars['String']['output'];
  /** Peak price per hour */
  peakPricePerHour: Scalars['Int']['output'];
  /** Pricing rules */
  pricing: Array<CourtPricing>;
  /** Sport type for this court */
  sportType: SportType;
  /** Court status */
  status: CourtStatus;
  updatedAt: Scalars['DateTime']['output'];
  /** Parent venue */
  venue: Venue;
  /** Venue ID this court belongs to */
  venueId: Scalars['ID']['output'];
};

export type CourtAvailability = {
  __typename?: 'CourtAvailability';
  /** Court ID */
  courtId: Scalars['String']['output'];
  /** Court name */
  courtName: Scalars['String']['output'];
  /** Court status (active/maintenance/inactive) */
  courtStatus?: Maybe<CourtStatus>;
  /** Time slots */
  slots: Array<TimeSlotAvailability>;
  /** Sport type for this court */
  sportType: SportType;
};

/** A Relay-style connection for Court items. */
export type CourtConnection = {
  __typename?: 'CourtConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<CourtEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the CourtConnection. */
export type CourtEdge = {
  __typename?: 'CourtEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Court;
};

export type CourtPricing = {
  __typename?: 'CourtPricing';
  /** Days of week this pricing applies (0-6) */
  daysOfWeek?: Maybe<Array<Scalars['Int']['output']>>;
  /** End time (HH:mm) */
  endTime: Scalars['String']['output'];
  /** Is peak hour */
  isPeakHour: Scalars['Boolean']['output'];
  /** Price per hour */
  pricePerHour: Scalars['Int']['output'];
  /** Start time (HH:mm) */
  startTime: Scalars['String']['output'];
};

export type CourtPricingInput = {
  /** Days of week this pricing applies (0-6) */
  daysOfWeek?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** End time (HH:mm) */
  endTime: Scalars['String']['input'];
  /** Is peak hour */
  isPeakHour: Scalars['Boolean']['input'];
  /** Price per hour */
  pricePerHour: Scalars['Int']['input'];
  /** Start time (HH:mm) */
  startTime: Scalars['String']['input'];
};

export enum CourtQuadrant {
  FarLeft = 'FAR_LEFT',
  FarRight = 'FAR_RIGHT',
  NearLeft = 'NEAR_LEFT',
  NearRight = 'NEAR_RIGHT'
}

/** Status of the court */
export enum CourtStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Maintenance = 'MAINTENANCE'
}

/** Type of court for pricing purposes */
export enum CourtType {
  Premium = 'PREMIUM',
  Standard = 'STANDARD',
  Vip = 'VIP'
}

export type CreateBookingInput = {
  /** Customer note */
  customerNote?: InputMaybe<Scalars['String']['input']>;
  /** Booking date (YYYY-MM-DD) */
  date: Scalars['String']['input'];
  /** Discount code */
  discountCode?: InputMaybe<Scalars['String']['input']>;
  /** Selected payment method */
  paymentMethod?: InputMaybe<PaymentMethod>;
  /** Slots to book */
  slots: Array<BookedSlotInput>;
  /** Venue ID */
  venueId: Scalars['ID']['input'];
};

export type CreateBookingPassInput = {
  /** Giá pass (VND) */
  askingPrice: Scalars['Int']['input'];
  /** Booking ID — bắt buộc khi source=INTERNAL */
  bookingId?: InputMaybe<Scalars['ID']['input']>;
  /** Mô tả/lý do pass */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Snapshot lịch đặt — bắt buộc khi source=EXTERNAL */
  externalBooking?: InputMaybe<ExternalBookingInput>;
  /** Loại pass — mặc định INTERNAL nếu bỏ trống (backwards-compat) */
  source?: InputMaybe<BookingPassSource>;
  /** Target user ID cho private pass */
  transfereeId?: InputMaybe<Scalars['ID']['input']>;
  /** Venue ID khi user pick venue có sẵn (claimed hoặc UNCLAIMED) — chỉ EXTERNAL */
  venueId?: InputMaybe<Scalars['ID']['input']>;
  /** Pass visibility */
  visibility: BookingPassVisibility;
};

export type CreateCategoryInput = {
  /** Players advancing per group */
  advancingPerGroup?: InputMaybe<Scalars['Int']['input']>;
  ageLabel?: InputMaybe<Scalars['String']['input']>;
  /** Bracket size (power of 2). 0 or null = auto-calculate. */
  bracketSize?: InputMaybe<Scalars['Int']['input']>;
  /** Default match duration in minutes (default 30) */
  defaultMatchDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  format?: TournamentFormat;
  gender?: TournamentGender;
  /** Groups count (GROUP_KNOCKOUT only) */
  groupCount?: InputMaybe<Scalars['Int']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  matchType?: MatchType;
  maxRegistrations?: InputMaybe<Scalars['Int']['input']>;
  popular?: InputMaybe<Scalars['Boolean']['input']>;
  prizes?: InputMaybe<Array<TournamentPrizeInput>>;
  scoringConfig: ScoringConfigInput;
  seedCount?: InputMaybe<Scalars['Int']['input']>;
  /** Đồng giải ba - không đánh trận tranh hạng 3-4 (SINGLE_ELIMINATION only) */
  sharedThirdPlace?: InputMaybe<Scalars['Boolean']['input']>;
  title: Scalars['String']['input'];
  tournamentId: Scalars['ID']['input'];
};

export type CreateClaimRequestInput = {
  /** Contact email */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Notes or additional information */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Contact phone number */
  phoneNumber: Scalars['String']['input'];
  /** Proof document URLs */
  proofDocuments?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Venue ID to claim */
  venueId: Scalars['ID']['input'];
};

export type CreateCommentInput = {
  /** Comment content */
  content: Scalars['String']['input'];
  /** Parent comment ID for replies */
  parentId?: InputMaybe<Scalars['ID']['input']>;
  /** Post ID */
  postId: Scalars['ID']['input'];
};

export type CreateConversationInput = {
  /** Group name (required for group chats) */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Participant user IDs (excluding current user) */
  participantIds: Array<Scalars['ID']['input']>;
  /** Type of conversation (direct or group) */
  type?: ConversationType;
};

export type CreateCourtInput = {
  /** Court capacity */
  capacity?: InputMaybe<Scalars['Int']['input']>;
  /** Court type */
  courtType?: InputMaybe<CourtType>;
  /** Default price per hour */
  defaultPricePerHour: Scalars['Int']['input'];
  /** Court description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Display order */
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Special features */
  features?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Court image URL */
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Is indoor court */
  isIndoor?: InputMaybe<Scalars['Boolean']['input']>;
  /** Minimum number of slots required per booking */
  minimumBookingSlots?: InputMaybe<Scalars['Int']['input']>;
  /** Court name/number */
  name: Scalars['String']['input'];
  /** Peak price per hour */
  peakPricePerHour: Scalars['Int']['input'];
  /** Pricing rules */
  pricing?: InputMaybe<Array<CourtPricingInput>>;
  /** Sport type */
  sportType: SportType;
  /** Venue ID */
  venueId: Scalars['ID']['input'];
};

export type CreateGameFromTemplateInput = {
  /** Override: Host cũng tham gia chơi (mặc định theo mẫu) */
  hostPlaying?: InputMaybe<Scalars['Boolean']['input']>;
  /** Ghi chú bổ sung */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** ID template */
  templateId: Scalars['ID']['input'];
  /** Thời gian chơi */
  timeSlot: GameTimeSlotInput;
  /** Tiêu đề kèo */
  title: Scalars['String']['input'];
};

export type CreateGroupInput = {
  /** Group address/location */
  address?: InputMaybe<Scalars['String']['input']>;
  /** Cover image URL */
  coverImageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Group description/bio */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Group name */
  name: Scalars['String']['input'];
  /** Privacy level */
  privacy?: InputMaybe<GroupPrivacy>;
  /** Sport type of the group */
  sportType: SportType;
};

export type CreateHoldBookingInput = {
  /** Customer note */
  customerNote?: InputMaybe<Scalars['String']['input']>;
  /** Booking date (YYYY-MM-DD) */
  date: Scalars['String']['input'];
  /** Discount/promo code to apply when hold is confirmed */
  discountCode?: InputMaybe<Scalars['String']['input']>;
  /** Hold duration in minutes chosen by customer */
  holdDurationMinutes: Scalars['Int']['input'];
  /** Slots to hold */
  slots: Array<BookedSlotInput>;
  /** Venue ID */
  venueId: Scalars['ID']['input'];
};

export type CreateLegalDocumentInput = {
  content: Scalars['String']['input'];
  effectiveDate: Scalars['DateTime']['input'];
  isActive?: Scalars['Boolean']['input'];
  summary?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  type: LegalDocumentType;
  version: Scalars['String']['input'];
};

export type CreateNotificationInput = {
  data?: InputMaybe<NotificationDataInput>;
  description: Scalars['String']['input'];
  icon?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  type: NotificationType;
};

export type CreateOrderInput = {
  /** Related booking ID */
  bookingId?: InputMaybe<Scalars['ID']['input']>;
  /** Court number (for delivery to court) */
  courtNumber?: InputMaybe<Scalars['String']['input']>;
  /** Customer email (for walk-in) */
  customerEmail?: InputMaybe<Scalars['String']['input']>;
  /** Customer name (for walk-in) */
  customerName?: InputMaybe<Scalars['String']['input']>;
  /** Customer phone (for walk-in) */
  customerPhone?: InputMaybe<Scalars['String']['input']>;
  /** Discount amount */
  discount?: InputMaybe<Scalars['Int']['input']>;
  /** Promo code to apply */
  discountCode?: InputMaybe<Scalars['String']['input']>;
  /** Internal/admin note */
  internalNote?: InputMaybe<Scalars['String']['input']>;
  /** Enable manual price override (use item unitPrice, skip promotion) */
  isManualPrice?: InputMaybe<Scalars['Boolean']['input']>;
  /** Order items */
  items: Array<OrderItemInput>;
  /** Reason for manual price adjustment */
  manualPriceNote?: InputMaybe<Scalars['String']['input']>;
  /** Customer note */
  note?: InputMaybe<Scalars['String']['input']>;
  /** Order type */
  orderType: OrderType;
  /** Payment method */
  paymentMethod?: InputMaybe<PaymentMethod>;
  /** Ngày dịch vụ thực tế (YYYY-MM-DD). Staff có thể đặt ngược quá khứ. Mặc định = ngày tạo đơn. */
  serviceDate?: InputMaybe<Scalars['String']['input']>;
  /** Table number */
  tableNumber?: InputMaybe<Scalars['String']['input']>;
  /** Tax amount */
  tax?: InputMaybe<Scalars['Int']['input']>;
  /** Venue ID */
  venueId: Scalars['ID']['input'];
};

export type CreateOtpTestPhoneInput = {
  /** Empty = all phone OTP purposes allowed */
  allowedPurposes?: InputMaybe<Array<OtpPurpose>>;
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Human-readable label for QA / ops */
  label: Scalars['String']['input'];
  /** Vietnamese phone number (E.164 after normalisation) */
  phone: Scalars['String']['input'];
  /** Fixed 6-digit OTP code */
  testCode: Scalars['String']['input'];
};

export type CreateOtpTestUserGrantInput = {
  /** Default SIGN_IN_PHONE only */
  allowedPurposes?: InputMaybe<Array<OtpPurpose>>;
  /** Grant expiry (default +24h, max +7d) */
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Reason / ticket reference (min 10 chars) */
  reason: Scalars['String']['input'];
  /** User ID to grant test OTP login */
  userId: Scalars['String']['input'];
};

export type CreatePickupGameCampaignInput = {
  /** Mô tả campaign */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Ngày kết thúc (ISO string) */
  endDate?: InputMaybe<Scalars['String']['input']>;
  /** Kèo thuộc campaign */
  gameIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Mục tiêu campaign */
  goals?: InputMaybe<CampaignGoalsInput>;
  /** Tên campaign */
  name: Scalars['String']['input'];
  /** Môn thể thao của campaign */
  sportTypes?: InputMaybe<Array<SportType>>;
  /** Ngày bắt đầu (ISO string) */
  startDate?: InputMaybe<Scalars['String']['input']>;
  /** Trình độ mục tiêu */
  targetSkillLevels?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Danh sách sân mục tiêu */
  venueIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type CreatePickupGameInput = {
  /** Chế độ duyệt */
  approvalMode?: InputMaybe<ApprovalMode>;
  /** Cấu hình chi phí */
  costConfig: CostConfigInput;
  /** Ảnh bìa */
  coverImageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Tự động tạo group chat */
  createGroupChat?: InputMaybe<Scalars['Boolean']['input']>;
  /** Địa điểm tùy chỉnh */
  customLocation?: InputMaybe<CustomLocationInput>;
  /** Cấu hình đặt cọc */
  depositConfig?: InputMaybe<DepositConfigInput>;
  /** Dụng cụ cần mang */
  equipment?: InputMaybe<Array<EquipmentItemInput>>;
  /** Thể thức thi đấu — multi-select (VD: SINGLES, DOUBLES) */
  gameFormats?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Loại hình chơi */
  gameType: GameType;
  /** Cấu hình giới tính */
  genderConfig?: InputMaybe<GenderConfigInput>;
  /** Host cũng tham gia chơi */
  hostPlaying?: InputMaybe<Scalars['Boolean']['input']>;
  /** Ảnh khác */
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Host đã đặt sân chưa */
  isVenueBooked?: InputMaybe<Scalars['Boolean']['input']>;
  /** ID booking liên kết */
  linkBookingId?: InputMaybe<Scalars['ID']['input']>;
  /** Tỷ lệ tham gia tối thiểu (0-1) */
  minAttendanceRate?: InputMaybe<Scalars['Float']['input']>;
  /** Ghi chú */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Yêu cầu trình độ */
  skillRequirement?: InputMaybe<SkillRequirementInput>;
  /** Cấu hình số người */
  slotConfig: SlotConfigInput;
  /** Môn thể thao */
  sportType: SportType;
  /** Tags */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Thời gian chơi */
  timeSlot: GameTimeSlotInput;
  /** Tiêu đề kèo */
  title: Scalars['String']['input'];
  /** ID sân */
  venueId?: InputMaybe<Scalars['ID']['input']>;
  /** Độ hiển thị */
  visibility?: InputMaybe<GameVisibility>;
};

export type CreatePostInput = {
  /** Whether comments are allowed */
  allowComments?: InputMaybe<Scalars['Boolean']['input']>;
  /** Post content/body (can be empty if media is provided) */
  content: Scalars['String']['input'];
  /** Featured/cover image URL */
  coverImageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Whether the post is pinned by author */
  isPinned?: InputMaybe<Scalars['Boolean']['input']>;
  /** Location tagged in post */
  location?: InputMaybe<PostLocationInput>;
  /** Media attachments */
  media?: InputMaybe<Array<PostMediaInput>>;
  /** Scheduled publish time (ISO string) */
  scheduledAt?: InputMaybe<Scalars['String']['input']>;
  /** Status of the post */
  status?: InputMaybe<PostStatus>;
  /** Tags for categorization */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Post title (can be empty for image-only posts) */
  title?: InputMaybe<Scalars['String']['input']>;
  /** Visibility of the post */
  visibility?: InputMaybe<PostVisibility>;
};

export type CreateProductCategoryInput = {
  /** Category color (hex code) */
  color?: InputMaybe<Scalars['String']['input']>;
  /** Category description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Display order */
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Category icon */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** Category image URL */
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Category name */
  name: Scalars['String']['input'];
  /** Parent category ID */
  parentId?: InputMaybe<Scalars['ID']['input']>;
  /** Shop ID (for shop categories) */
  shopId?: InputMaybe<Scalars['ID']['input']>;
  /** URL-friendly slug (auto-generated if not provided) */
  slug?: InputMaybe<Scalars['String']['input']>;
  /** Category type */
  type?: InputMaybe<CategoryType>;
  /** Venue ID (for venue categories) */
  venueId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateProductInput = {
  /** Allow backorder */
  allowBackorder?: InputMaybe<Scalars['Boolean']['input']>;
  /** Category ID */
  categoryId: Scalars['ID']['input'];
  /** Compare at price */
  compareAtPrice?: InputMaybe<Scalars['Int']['input']>;
  /** Cost price */
  costPrice?: InputMaybe<Scalars['Int']['input']>;
  /** Full description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Display order */
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Has variants */
  hasVariants?: InputMaybe<Scalars['Boolean']['input']>;
  /** Product images */
  images?: InputMaybe<Array<ProductImageInput>>;
  /** Is featured */
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  /** Is popular */
  isPopular?: InputMaybe<Scalars['Boolean']['input']>;
  /** Low stock threshold */
  lowStockThreshold?: InputMaybe<Scalars['Int']['input']>;
  /** SEO meta description */
  metaDescription?: InputMaybe<Scalars['String']['input']>;
  /** SEO meta title */
  metaTitle?: InputMaybe<Scalars['String']['input']>;
  /** Product name */
  name: Scalars['String']['input'];
  /** Selling price */
  price: Scalars['Int']['input'];
  /** Product type */
  productType?: InputMaybe<ProductType>;
  /** Shop ID */
  shopId?: InputMaybe<Scalars['ID']['input']>;
  /** Short description */
  shortDescription?: InputMaybe<Scalars['String']['input']>;
  /** Product SKU */
  sku?: InputMaybe<Scalars['String']['input']>;
  /** URL-friendly slug */
  slug?: InputMaybe<Scalars['String']['input']>;
  /** Product status */
  status?: InputMaybe<ProductStatus>;
  /** Stock quantity */
  stockQuantity?: InputMaybe<Scalars['Int']['input']>;
  /** Track inventory */
  trackInventory?: InputMaybe<Scalars['Boolean']['input']>;
  /** Unit of measure (lon, chai, thùng…) */
  unit?: InputMaybe<Scalars['String']['input']>;
  /** Variant option names */
  variantOptions?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Product variants */
  variants?: InputMaybe<Array<ProductVariantInput>>;
  /** Venue ID */
  venueId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreatePromotionInput = {
  /** Time ranges when promotion applies (PER_HOUR only); null = all hours */
  applicableTimeRanges?: InputMaybe<Array<TimeRangeInput>>;
  /** Level at which discount is applied (bookings only) */
  applyLevel?: InputMaybe<PromotionApplyLevel>;
  /** Badge color (hex) */
  badgeColor?: InputMaybe<Scalars['String']['input']>;
  /** Badge/Tag text for venue card */
  badgeText?: InputMaybe<Scalars['String']['input']>;
  /** Banner image URL */
  bannerImageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Promotion category */
  category: PromotionCategory;
  /** Promo code (for CODE trigger) */
  code?: InputMaybe<Scalars['String']['input']>;
  /** Specific court IDs (when scope is SPECIFIC_COURTS) */
  courtIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Full description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Display order */
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Promotion end date (ISO string) */
  endDate: Scalars['String']['input'];
  /** Whether promotion can stack with others (simplified version of stackingRules) */
  isStackable?: InputMaybe<Scalars['Boolean']['input']>;
  /** Maximum discount amount (for percentage type) */
  maxDiscountAmount?: InputMaybe<Scalars['Int']['input']>;
  /** Minimum booking amount required */
  minBookingAmount?: InputMaybe<Scalars['Int']['input']>;
  /** Promotion name */
  name: Scalars['String']['input'];
  /** Per user usage limit; omit or null = no limit */
  perUserLimit?: InputMaybe<Scalars['Int']['input']>;
  /** Priority for application order (higher = applied first) */
  priority?: InputMaybe<Scalars['Int']['input']>;
  /** Specific product category IDs (when scope is PRODUCTS) */
  productCategoryIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Where promotion applies */
  scope?: InputMaybe<PromotionScope>;
  /** Short description for display */
  shortDescription?: InputMaybe<Scalars['String']['input']>;
  /** Show as banner */
  showAsBanner?: InputMaybe<Scalars['Boolean']['input']>;
  /** Show on venue card */
  showOnVenueCard?: InputMaybe<Scalars['Boolean']['input']>;
  /** Specific sport types (when scope is SPECIFIC_SPORT) */
  sportTypes?: InputMaybe<Array<SportType>>;
  /** Rules for combining with other promotions */
  stackingRules?: InputMaybe<StackingRulesInput>;
  /** Promotion start date (ISO string) */
  startDate: Scalars['String']['input'];
  /** Submit for approval immediately after creation */
  submitForApproval?: InputMaybe<Scalars['Boolean']['input']>;
  /** Total usage limit (null = unlimited) */
  totalUsageLimit?: InputMaybe<Scalars['Int']['input']>;
  /** How promotion is triggered */
  trigger?: InputMaybe<PromotionTrigger>;
  /** Type of discount */
  type: PromotionType;
  /** Discount value (percentage 0-100 or fixed amount) */
  value: Scalars['Int']['input'];
  /** Venue ID */
  venueId: Scalars['ID']['input'];
};

export type CreateQrCampaignInput = {
  /** Optional campaign description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Campaign expiry date */
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Physical or digital location of the QR code */
  location?: InputMaybe<Scalars['String']['input']>;
  /** Human-readable campaign name */
  name: Scalars['String']['input'];
};

export type CreateRecurringBookingInput = {
  /** Customer note */
  customerNote?: InputMaybe<Scalars['String']['input']>;
  /** Slots configuration for each day. Use this for multi-day bookings with different slots per day. */
  daySchedules?: InputMaybe<Array<DayScheduleInput>>;
  /** Days of week to book (0=Sunday, 6=Saturday). Required when booking multiple days with same slots. */
  daysOfWeek?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Promo code to apply */
  discountCode?: InputMaybe<Scalars['String']['input']>;
  /** Duration in months (1, 2, or 3) */
  durationMonths: Scalars['Int']['input'];
  /** Selected payment method */
  paymentMethod?: InputMaybe<PaymentMethod>;
  /** Slots to book (same slots for all days). Use this for single-day or multi-day with same slots. */
  slots?: InputMaybe<Array<BookedSlotInput>>;
  /** Start date (YYYY-MM-DD) - first booking date */
  startDate: Scalars['String']['input'];
  /** Venue ID */
  venueId: Scalars['ID']['input'];
};

export type CreateReferralCodeInput = {
  /** Referral code string (uppercase, alphanumeric) */
  code: Scalars['String']['input'];
  /** Expiry date for this code */
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Max uses allowed (null = unlimited) */
  maxUses?: InputMaybe<Scalars['Int']['input']>;
  /** User ID of the code owner */
  ownerId: Scalars['ID']['input'];
  /** Display name of the code owner */
  ownerName: Scalars['String']['input'];
  /** Role of the code owner */
  ownerRole?: InputMaybe<Scalars['String']['input']>;
};

export type CreateScoreboardSessionInput = {
  leftSidePlayer?: InputMaybe<Scalars['Int']['input']>;
  matchFormat: ScoreboardMatchFormat;
  scheduledAt?: InputMaybe<Scalars['DateTime']['input']>;
  scoringConfig: ScoringConfigInput;
  servingPlayer?: InputMaybe<Scalars['Int']['input']>;
  side1: ScoreboardSideInput;
  side2: ScoreboardSideInput;
  sportType: SportType;
  /** If true, start immediately as LIVE */
  startImmediately?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateStaffBookingInput = {
  /** Customer user ID (if booking for existing user) */
  customerId?: InputMaybe<Scalars['ID']['input']>;
  /** Customer info (for walk-in customers without account) */
  customerInfo?: InputMaybe<CustomerInfoInput>;
  /** Booking date (YYYY-MM-DD) */
  date: Scalars['String']['input'];
  /** Discount/promo code to apply */
  discountCode?: InputMaybe<Scalars['String']['input']>;
  /** Internal note */
  internalNote?: InputMaybe<Scalars['String']['input']>;
  /** Enable manual price override (skip all pricing rules) */
  isManualPrice?: InputMaybe<Scalars['Boolean']['input']>;
  /** Manual final amount (required when isManualPrice = true) */
  manualFinalAmount?: InputMaybe<Scalars['Int']['input']>;
  /** Reason for manual price adjustment */
  manualPriceNote?: InputMaybe<Scalars['String']['input']>;
  /** Selected payment method */
  paymentMethod?: InputMaybe<PaymentMethod>;
  /** Schedule type override (fixed / single / LEAD promo) */
  scheduleType?: InputMaybe<BookingScheduleType>;
  /** Slots to book */
  slots: Array<BookedSlotInput>;
  /** Booking source */
  source?: InputMaybe<BookingSource>;
  /** Venue ID */
  venueId: Scalars['ID']['input'];
};

export type CreateStaffRecurringBookingInput = {
  /** Customer user ID (if booking for existing user) */
  customerId?: InputMaybe<Scalars['ID']['input']>;
  /** Customer info (for walk-in customers without account) */
  customerInfo?: InputMaybe<CustomerInfoInput>;
  /** Slots configuration for each day. Use this for multi-day bookings with different slots per day. */
  daySchedules?: InputMaybe<Array<DayScheduleInput>>;
  /** Days of week to book (0=Sunday, 6=Saturday). Required when booking multiple days with same slots. */
  daysOfWeek?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Promo code to apply */
  discountCode?: InputMaybe<Scalars['String']['input']>;
  /** Duration in months (1, 2, or 3) */
  durationMonths: Scalars['Int']['input'];
  /** Dates to exclude from the recurring schedule (YYYY-MM-DD) */
  excludeDates?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Internal note */
  internalNote?: InputMaybe<Scalars['String']['input']>;
  /** Enable manual price override (skip all pricing rules) */
  isManualPrice?: InputMaybe<Scalars['Boolean']['input']>;
  /** Manual final amount (required when isManualPrice = true) */
  manualFinalAmount?: InputMaybe<Scalars['Int']['input']>;
  /** Reason for manual price adjustment */
  manualPriceNote?: InputMaybe<Scalars['String']['input']>;
  /** Selected payment method */
  paymentMethod?: InputMaybe<PaymentMethod>;
  /** Slots to book (same slots for all days). Use this for single-day or multi-day with same slots. */
  slots?: InputMaybe<Array<BookedSlotInput>>;
  /** Booking source */
  source?: InputMaybe<BookingSource>;
  /** Start date (YYYY-MM-DD) - first booking date */
  startDate: Scalars['String']['input'];
  /** Venue ID */
  venueId: Scalars['ID']['input'];
};

export type CreateTemplateInput = {
  /** Chế độ duyệt */
  approvalMode?: InputMaybe<ApprovalMode>;
  /** Cấu hình chi phí */
  costConfig: CostConfigInput;
  /** Địa điểm tùy chỉnh */
  customLocation?: InputMaybe<CustomLocationInput>;
  /** Cấu hình đặt cọc */
  depositConfig?: InputMaybe<DepositConfigInput>;
  /** Mô tả */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Dụng cụ cần mang */
  equipment?: InputMaybe<Array<EquipmentItemInput>>;
  /** Thể thức thi đấu */
  gameFormats?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Loại hình chơi */
  gameType: GameType;
  /** Cấu hình giới tính */
  genderConfig?: InputMaybe<GenderConfigInput>;
  /** Host cũng tham gia chơi */
  hostPlaying?: InputMaybe<Scalars['Boolean']['input']>;
  /** Tên template */
  name: Scalars['String']['input'];
  /** Yêu cầu trình độ */
  skillRequirement?: InputMaybe<SkillRequirementInput>;
  /** Cấu hình số người */
  slotConfig: SlotConfigInput;
  /** Môn thể thao */
  sportType: SportType;
  /** Tags */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** ID sân */
  venueId?: InputMaybe<Scalars['ID']['input']>;
  /** Độ hiển thị */
  visibility?: InputMaybe<GameVisibility>;
};

export type CreateTournamentInput = {
  contacts?: InputMaybe<Array<TournamentContactInput>>;
  courts?: InputMaybe<Array<TournamentCourtInput>>;
  coverImage?: InputMaybe<Scalars['String']['input']>;
  dates: TournamentDatesInput;
  description?: InputMaybe<Scalars['String']['input']>;
  facilities?: InputMaybe<Array<TournamentFacilityInput>>;
  highlights?: InputMaybe<Array<Scalars['String']['input']>>;
  introduction?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<TournamentLocationInput>;
  organizerName?: InputMaybe<Scalars['String']['input']>;
  paymentInfo?: InputMaybe<TournamentPaymentInfoInput>;
  prizes?: InputMaybe<Array<TournamentPrizeInput>>;
  rules?: InputMaybe<Array<TournamentRuleInput>>;
  schedule?: InputMaybe<Array<TournamentSchedulePhaseInput>>;
  scheduleConfig?: InputMaybe<ScheduleConfigInput>;
  sportType: SportType;
  title: Scalars['String']['input'];
};

export type CreateUserSubmittedVenueInput = {
  /** Địa chỉ đầy đủ */
  address: Scalars['String']['input'];
  /** Tỉnh/Thành phố */
  city?: InputMaybe<Scalars['String']['input']>;
  /** Quận/Huyện */
  district?: InputMaybe<Scalars['String']['input']>;
  /** Vĩ độ */
  latitude?: InputMaybe<Scalars['Float']['input']>;
  /** Kinh độ */
  longitude?: InputMaybe<Scalars['Float']['input']>;
  /** Tên sân */
  name: Scalars['String']['input'];
  /** Danh sách môn thể thao tại sân */
  sportTypes: Array<SportType>;
  /** Phường/Xã */
  ward?: InputMaybe<Scalars['String']['input']>;
};

export type CreateVenueExpenseInput = {
  amount: Scalars['Int']['input'];
  category: ExpenseCategory;
  /** Coverage start (YYYY-MM-DD); defaults to payment date */
  coverageFrom?: InputMaybe<Scalars['String']['input']>;
  /** Coverage end (YYYY-MM-DD); defaults to coverageFrom */
  coverageTo?: InputMaybe<Scalars['String']['input']>;
  /** Payment date (YYYY-MM-DD) */
  date: Scalars['String']['input'];
  isRecurring?: InputMaybe<Scalars['Boolean']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  paymentMethod?: InputMaybe<PaymentMethod>;
  venueId: Scalars['ID']['input'];
};

export type CreateVenueInput = {
  /** Advance booking days */
  advanceBookingDays?: InputMaybe<Scalars['Int']['input']>;
  /** Amenities */
  amenities?: InputMaybe<Array<VenueAmenityInput>>;
  /** Cancellation hours */
  cancellationHours?: InputMaybe<Scalars['Int']['input']>;
  /** Cover image URL */
  coverImageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Venue description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Email */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Venue images URLs */
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Venue location */
  location: VenueLocationInput;
  /** Min completed bookings to become loyal customer */
  loyaltyMinBookings?: InputMaybe<Scalars['Int']['input']>;
  /** Min total spending (VND) to become loyal customer */
  loyaltyMinSpending?: InputMaybe<Scalars['Int']['input']>;
  /** Venue name */
  name: Scalars['String']['input'];
  /** Operating hours */
  operatingHours?: InputMaybe<Array<OperatingHoursInput>>;
  /** Phone number */
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  /** Is recurring booking enabled */
  recurringBookingEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Slot duration in minutes */
  slotDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
  /** Sports available */
  sportTypes: Array<SportType>;
  /** Website URL */
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreateVenueRequestInput = {
  /** Allow booking pass (transfer booking to others) */
  allowBookingPass?: InputMaybe<Scalars['Boolean']['input']>;
  /** Allow reservation hold (temporary booking before confirmation) */
  allowReservationHold?: InputMaybe<Scalars['Boolean']['input']>;
  /** Amenities */
  amenities?: InputMaybe<Array<RequestAmenityInput>>;
  /** Bank QR code URL for payment */
  bankQrCodeUrl?: InputMaybe<Scalars['String']['input']>;
  /** Booking pass policy */
  bookingPassPolicy?: InputMaybe<Scalars['String']['input']>;
  /** Courts information */
  courts: Array<RequestCourtInfoInput>;
  /** Cover image URL */
  coverImageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Venue description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Email */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Venue images URLs */
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Venue location */
  location: RequestLocationInput;
  /** Minimum time before slot start time to allow hold (in minutes) */
  minTimeBeforeSlotForHold?: InputMaybe<Scalars['Int']['input']>;
  /** Venue name */
  name: Scalars['String']['input'];
  /** Operating hours */
  operatingHours?: InputMaybe<Array<RequestOperatingHoursInput>>;
  /** Phone number */
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  /** Is recurring booking enabled */
  recurringBookingEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Slot duration in minutes */
  slotDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
  /** Sports available */
  sportTypes: Array<SportType>;
  /** Terms and conditions of the venue */
  termsAndConditions?: InputMaybe<Scalars['String']['input']>;
};

export type CurrentLegalDocuments = {
  __typename?: 'CurrentLegalDocuments';
  /** Current Privacy Policy */
  privacyPolicy?: Maybe<LegalDocumentSummary>;
  /** Current Terms of Service */
  termsOfService?: Maybe<LegalDocumentSummary>;
};

export type CursorPageInput = {
  /** Opaque cursor pointing at the last item of the previous page. */
  after?: InputMaybe<Scalars['String']['input']>;
  /** Reserved for backwards pagination. */
  before?: InputMaybe<Scalars['String']['input']>;
  /** Number of items to return after the cursor (1..50). */
  first?: InputMaybe<Scalars['Int']['input']>;
  /** Reserved for backwards pagination (1..50). */
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type CursorSortInput = {
  /** Mongo field to sort by (domain whitelist) */
  sortBy?: InputMaybe<Scalars['String']['input']>;
  /** Sort direction */
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};

export type CustomLocation = {
  __typename?: 'CustomLocation';
  /** Địa chỉ */
  address: Scalars['String']['output'];
  /** Google Place ID */
  googlePlaceId?: Maybe<Scalars['String']['output']>;
  /** Vĩ độ */
  latitude: Scalars['Float']['output'];
  /** Kinh độ */
  longitude: Scalars['Float']['output'];
  /** Tên địa điểm */
  name: Scalars['String']['output'];
};

export type CustomLocationInput = {
  /** Địa chỉ */
  address: Scalars['String']['input'];
  /** Google Place ID */
  googlePlaceId?: InputMaybe<Scalars['String']['input']>;
  /** Vĩ độ */
  latitude: Scalars['Float']['input'];
  /** Kinh độ */
  longitude: Scalars['Float']['input'];
  /** Tên địa điểm */
  name: Scalars['String']['input'];
};

export type CustomerInfo = {
  __typename?: 'CustomerInfo';
  /** Customer email */
  email?: Maybe<Scalars['String']['output']>;
  /** Customer name */
  name: Scalars['String']['output'];
  /** Notes about customer */
  notes?: Maybe<Scalars['String']['output']>;
  /** Customer phone */
  phone: Scalars['String']['output'];
};

export type CustomerInfoInput = {
  /** Customer email */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Customer name */
  name: Scalars['String']['input'];
  /** Notes about customer */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Customer phone */
  phone: Scalars['String']['input'];
};

/** Customer lookup result for staff order creation */
export type CustomerLookup = {
  __typename?: 'CustomerLookup';
  /** Customer user ID */
  _id: Scalars['String']['output'];
  /** Customer display name */
  displayName?: Maybe<Scalars['String']['output']>;
  /** Customer email */
  email?: Maybe<Scalars['String']['output']>;
  /** Customer full name */
  fullName?: Maybe<Scalars['String']['output']>;
  /** Customer phone number */
  phone?: Maybe<Scalars['String']['output']>;
  /** Customer avatar URL */
  photoURL?: Maybe<Scalars['String']['output']>;
  /** Total orders from this customer */
  totalOrders: Scalars['Int']['output'];
};

export type CustomerMetric = {
  __typename?: 'CustomerMetric';
  /** Change vs previous period */
  change: Scalars['Float']['output'];
  /** Color key for styling */
  colorKey: Scalars['String']['output'];
  /** Icon name */
  icon: Scalars['String']['output'];
  /** Metric label */
  label: Scalars['String']['output'];
  /** Metric value */
  value: Scalars['Float']['output'];
};

export type DayPriceBreakdown = {
  __typename?: 'DayPriceBreakdown';
  /** Day of week (0=Sunday, 6=Saturday) */
  dayOfWeek: Scalars['Int']['output'];
  /** Price per session for this day */
  pricePerSession: Scalars['Int']['output'];
  /** Number of sessions for this day */
  sessionCount: Scalars['Int']['output'];
  /** Total price for this day (all sessions) */
  totalPrice: Scalars['Int']['output'];
};

export type DaySchedule = {
  __typename?: 'DaySchedule';
  /** Day of week (0=Sunday, 6=Saturday) */
  dayOfWeek: Scalars['Int']['output'];
  /** Price per session for this day */
  pricePerSession: Scalars['Int']['output'];
  /** Slots for this day */
  slots: Array<BookedSlot>;
};

export type DayScheduleInput = {
  /** Day of week (0=Sunday, 6=Saturday) */
  dayOfWeek: Scalars['Int']['input'];
  /** Slots for this day */
  slots: Array<BookedSlotInput>;
};

export type DeleteRegistrationInput = {
  registrationId: Scalars['ID']['input'];
};

export type DepositConfig = {
  __typename?: 'DepositConfig';
  /** Số tiền cọc */
  amount?: Maybe<Scalars['Int']['output']>;
  /** Thông tin ngân hàng */
  bankInfo?: Maybe<Scalars['String']['output']>;
  /** Hạn đặt cọc (ISO date) */
  deadline?: Maybe<Scalars['String']['output']>;
  /** Hướng dẫn đặt cọc */
  instructions?: Maybe<Scalars['String']['output']>;
  /** Yêu cầu đặt cọc */
  isRequired: Scalars['Boolean']['output'];
  /** URL mã QR */
  qrCodeUrl?: Maybe<Scalars['String']['output']>;
};

export type DepositConfigInput = {
  /** Số tiền cọc */
  amount?: InputMaybe<Scalars['Int']['input']>;
  /** Thông tin ngân hàng */
  bankInfo?: InputMaybe<Scalars['String']['input']>;
  /** Hạn đặt cọc (ISO date) */
  deadline?: InputMaybe<Scalars['String']['input']>;
  /** Hướng dẫn đặt cọc */
  instructions?: InputMaybe<Scalars['String']['input']>;
  /** Yêu cầu đặt cọc */
  isRequired: Scalars['Boolean']['input'];
  /** URL mã QR */
  qrCodeUrl?: InputMaybe<Scalars['String']['input']>;
};

/** Trạng thái đặt cọc */
export enum DepositStatus {
  Deposited = 'DEPOSITED',
  Forfeited = 'FORFEITED',
  NotRequired = 'NOT_REQUIRED',
  Pending = 'PENDING',
  Refunded = 'REFUNDED'
}

export type DeviceInfo = {
  __typename?: 'DeviceInfo';
  appVersion?: Maybe<Scalars['String']['output']>;
  deviceId?: Maybe<Scalars['String']['output']>;
  deviceName?: Maybe<Scalars['String']['output']>;
  osVersion?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
};

export type DiscountCalculationResult = {
  __typename?: 'DiscountCalculationResult';
  /** Applied promotions */
  appliedPromotions: Array<AppliedPromotion>;
  /** Total discount percentage */
  discountPercentage: Scalars['Float']['output'];
  /** Final amount after discount */
  finalAmount: Scalars['Int']['output'];
  /** Were promotions stacked */
  isStacked: Scalars['Boolean']['output'];
  /** Original total before discount */
  originalTotal: Scalars['Int']['output'];
  /** Per-slot discount breakdown (when applyLevel is PER_HOUR) */
  slotDiscounts?: Maybe<Array<SlotDiscount>>;
  /** Message about stacking limits */
  stackingMessage?: Maybe<Scalars['String']['output']>;
  /** Total discount amount */
  totalDiscount: Scalars['Int']['output'];
};

export type DisplayOrderUpdateInput = {
  /** New display order */
  displayOrder: Scalars['Int']['input'];
  /** Product ID */
  productId: Scalars['ID']['input'];
};

export type EmailUpdateRequestResponse = {
  __typename?: 'EmailUpdateRequestResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  verificationId: Scalars['String']['output'];
};

export type EntryMember = {
  __typename?: 'EntryMember';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  club?: Maybe<Scalars['String']['output']>;
  dateOfBirth?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  school?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
};

/** A single member within a registration entry */
export type EntryMemberInput = {
  club?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  /** Existing user ID (if member has an account) */
  forUserId?: InputMaybe<Scalars['ID']['input']>;
  /** Member full name */
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
};

export type EquipmentItem = {
  __typename?: 'EquipmentItem';
  /** ID thiết bị */
  _id: Scalars['ID']['output'];
  /** Người nhận mang */
  claimedBy?: Maybe<Scalars['ID']['output']>;
  /** Bắt buộc */
  isRequired: Scalars['Boolean']['output'];
  /** Tên thiết bị */
  name: Scalars['String']['output'];
  /** Số lượng */
  quantity: Scalars['Int']['output'];
};

export type EquipmentItemInput = {
  /** Bắt buộc */
  isRequired: Scalars['Boolean']['input'];
  /** Tên thiết bị */
  name: Scalars['String']['input'];
  /** Số lượng */
  quantity: Scalars['Int']['input'];
};

/** Combined input for the full draw operation */
export type ExecuteDrawInput = {
  categoryId: Scalars['ID']['input'];
  /** Seeds to assign before generating bracket (empty = no seeds) */
  seeds?: Array<SeedPlayerInput>;
};

/** Category of venue operating expense */
export enum ExpenseCategory {
  Maintenance = 'MAINTENANCE',
  Marketing = 'MARKETING',
  Other = 'OTHER',
  Rent = 'RENT',
  Salary = 'SALARY',
  Supplies = 'SUPPLIES',
  Tax = 'TAX',
  Utilities = 'UTILITIES'
}

export type ExpenseFilterInput = {
  from?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
  /** Venue ID */
  venueId: Scalars['ID']['input'];
};

export type ExternalBookingInput = {
  /** Ngày đặt (ISO 8601 date) */
  bookingDate: Scalars['String']['input'];
  /** Tên sân con (nếu có) */
  courtName?: InputMaybe<Scalars['String']['input']>;
  /** Thời gian kết thúc (ISO 8601) */
  endTime: Scalars['String']['input'];
  /** Ghi chú thêm về booking gốc */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Giá gốc (VND) */
  originalPrice: Scalars['Int']['input'];
  /** URL ảnh chứng từ (1-5 ảnh) */
  proofImages: Array<Scalars['String']['input']>;
  /** Loại thể thao */
  sportType: SportType;
  /** Thời gian bắt đầu (ISO 8601) */
  startTime: Scalars['String']['input'];
  /** Địa chỉ sân (tuỳ chọn) */
  venueAddress?: InputMaybe<Scalars['String']['input']>;
  /** Tên sân do user khai báo */
  venueName: Scalars['String']['input'];
};

export type ExternalBookingSnapshot = {
  __typename?: 'ExternalBookingSnapshot';
  /** Ngày đặt (YYYY-MM-DD) */
  bookingDate: Scalars['String']['output'];
  /** Mã đặt sân (nếu có) */
  bookingReference?: Maybe<Scalars['String']['output']>;
  /** Tên sân con (nếu có) */
  courtName?: Maybe<Scalars['String']['output']>;
  /** Thời lượng (phút) */
  durationMinutes: Scalars['Int']['output'];
  /** Giờ kết thúc (HH:mm) */
  endTime: Scalars['String']['output'];
  /** Ảnh chứng từ booking gốc (1-5 ảnh) */
  proofImages: Array<Scalars['String']['output']>;
  /** Môn thể thao */
  sportType?: Maybe<SportType>;
  /** Giờ bắt đầu (HH:mm) */
  startTime: Scalars['String']['output'];
  /** Địa chỉ sân */
  venueAddress?: Maybe<Scalars['String']['output']>;
  /** Tên sân do user khai báo */
  venueName: Scalars['String']['output'];
};

export type FavoriteResult = {
  __typename?: 'FavoriteResult';
  /** Whether venue is now favorited */
  isFavorite: Scalars['Boolean']['output'];
};

export type FinanceBreakdownItem = {
  __typename?: 'FinanceBreakdownItem';
  count: Scalars['Int']['output'];
  key?: Maybe<Scalars['String']['output']>;
  label: Scalars['String']['output'];
  percentage: Scalars['Float']['output'];
  revenue: Scalars['Int']['output'];
};

/** How to derive the comparison period: immediately before or same dates last year */
export enum FinanceCompareMode {
  PreviousPeriod = 'PREVIOUS_PERIOD',
  SamePeriodLastYear = 'SAME_PERIOD_LAST_YEAR'
}

/** Export format for finance reports */
export enum FinanceExportFormat {
  Csv = 'CSV',
  Xlsx = 'XLSX'
}

export type FinanceFilterInput = {
  /** How to derive the comparison period */
  compareMode?: InputMaybe<FinanceCompareMode>;
  /** Include period-to-date comparison with previous period */
  compareToPrevious?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by court ID */
  courtId?: InputMaybe<Scalars['ID']['input']>;
  /** Start date (YYYY-MM-DD) in filter timezone */
  from: Scalars['String']['input'];
  granularity?: InputMaybe<FinanceGranularity>;
  orderType?: InputMaybe<OrderType>;
  /** Coarse filter: booking orders vs non-booking (retail, F&B, etc.) */
  orderTypeCategory?: InputMaybe<FinanceOrderTypeCategory>;
  paymentMethod?: InputMaybe<PaymentMethod>;
  /** Filter orders linked to bookings that used this promotion */
  promotionId?: InputMaybe<Scalars['ID']['input']>;
  /** Filter orders linked to bookings with this schedule type */
  scheduleType?: InputMaybe<BookingScheduleType>;
  /** Filter by order status (default: exclude cancelled) */
  status?: InputMaybe<OrderStatus>;
  /** IANA timezone for date boundaries */
  timezone?: InputMaybe<Scalars['String']['input']>;
  /** End date (YYYY-MM-DD) in filter timezone */
  to: Scalars['String']['input'];
  /** Venue IDs to include. Empty/null = all venues user can view analytics for. */
  venueIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

/** Time bucket granularity for finance trend charts */
export enum FinanceGranularity {
  Day = 'DAY',
  Month = 'MONTH',
  Week = 'WEEK'
}

/** Coarse order-type filter for finance reports */
export enum FinanceOrderTypeCategory {
  Booking = 'BOOKING',
  NonBooking = 'NON_BOOKING'
}

export type FinancePeriodInfo = {
  __typename?: 'FinancePeriodInfo';
  from: Scalars['String']['output'];
  previousFrom: Scalars['String']['output'];
  previousTo: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
  to: Scalars['String']['output'];
};

export type FinancePnlMetric = {
  __typename?: 'FinancePnlMetric';
  changePercent: Scalars['Float']['output'];
  previousValue: Scalars['Int']['output'];
  value: Scalars['Int']['output'];
};

export type FinancePnlRateMetric = {
  __typename?: 'FinancePnlRateMetric';
  changePercent: Scalars['Float']['output'];
  previousValue: Scalars['Float']['output'];
  value: Scalars['Float']['output'];
};

export type FinancePnlSummary = {
  __typename?: 'FinancePnlSummary';
  cogs: FinancePnlMetric;
  collected: FinancePnlMetric;
  grossProfit: FinancePnlMetric;
  grossRevenue: FinancePnlMetric;
  netMarginPercent: FinancePnlRateMetric;
  netProfit: FinancePnlMetric;
  netRevenue: FinancePnlMetric;
  operatingExpenses: FinancePnlMetric;
  outstanding: FinancePnlMetric;
  refunds: FinancePnlMetric;
};

export type FinanceTransaction = {
  __typename?: 'FinanceTransaction';
  /** Giá vốn hàng bán (COGS) gắn với đơn */
  cogsAmount: Scalars['Int']['output'];
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  courtLabel?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  customerName?: Maybe<Scalars['String']['output']>;
  grossAmount: Scalars['Int']['output'];
  netAmount: Scalars['Int']['output'];
  orderCode: Scalars['String']['output'];
  orderId: Scalars['ID']['output'];
  orderType: OrderType;
  paidAmount: Scalars['Int']['output'];
  paidAt?: Maybe<Scalars['DateTime']['output']>;
  paymentMethod?: Maybe<PaymentMethod>;
  paymentStatus: OrderPaymentStatus;
  /** Lợi nhuận gộp = doanh thu gộp − giá vốn */
  profitAmount: Scalars['Int']['output'];
  /** Biên lợi nhuận gộp = lãi / doanh thu gộp × 100 */
  profitMarginPercent: Scalars['Float']['output'];
  refundAmount: Scalars['Int']['output'];
  status: OrderStatus;
  venueId: Scalars['ID']['output'];
  venueName?: Maybe<Scalars['String']['output']>;
};

export type FinanceTransactionConnection = {
  __typename?: 'FinanceTransactionConnection';
  edges: Array<FinanceTransactionEdge>;
  pageInfo: FinanceTransactionPageInfo;
  totalCount: Scalars['Int']['output'];
};

export type FinanceTransactionEdge = {
  __typename?: 'FinanceTransactionEdge';
  cursor: Scalars['String']['output'];
  node: FinanceTransaction;
};

export type FinanceTransactionFilterInput = {
  courtId?: InputMaybe<Scalars['ID']['input']>;
  from: Scalars['String']['input'];
  orderType?: InputMaybe<OrderType>;
  orderTypeCategory?: InputMaybe<FinanceOrderTypeCategory>;
  paymentMethod?: InputMaybe<PaymentMethod>;
  /** Search order code, customer name, or phone */
  search?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  to: Scalars['String']['input'];
  venueIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type FinanceTransactionPageInfo = {
  __typename?: 'FinanceTransactionPageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type FinanceTransactionSortInput = {
  field?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
};

export type FinanceTrendPoint = {
  __typename?: 'FinanceTrendPoint';
  expenses: Scalars['Int']['output'];
  label: Scalars['String']['output'];
  netProfit: Scalars['Int']['output'];
  previousRevenue?: Maybe<Scalars['Int']['output']>;
  revenue: Scalars['Int']['output'];
};

export type FinishMatchEarlyInput = {
  matchId: Scalars['ID']['input'];
};

export type FirebaseSignInInput = {
  firebaseIdToken?: InputMaybe<Scalars['String']['input']>;
  idToken?: InputMaybe<Scalars['String']['input']>;
  phoneVerificationToken?: InputMaybe<Scalars['String']['input']>;
};

export type FirebaseSignUpInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  firebaseIdToken?: InputMaybe<Scalars['String']['input']>;
  fullName: Scalars['String']['input'];
  idToken?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  phoneVerificationToken?: InputMaybe<Scalars['String']['input']>;
  /** Mã giới thiệu (không bắt buộc) */
  referralCode?: InputMaybe<Scalars['String']['input']>;
};

export type FollowedHost = {
  __typename?: 'FollowedHost';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Thông tin host */
  host?: Maybe<User>;
  /** ID host được theo dõi */
  hostId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  /** ID người theo dõi */
  userId: Scalars['ID']['output'];
};

/** A Relay-style connection for FollowedHost items. */
export type FollowedHostConnection = {
  __typename?: 'FollowedHostConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<FollowedHostEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the FollowedHostConnection. */
export type FollowedHostEdge = {
  __typename?: 'FollowedHostEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: FollowedHost;
};

export type ForwardMessageInput = {
  /** Message ID to forward */
  messageId: Scalars['ID']['input'];
  /** Target conversation IDs */
  targetConversationIds: Array<Scalars['ID']['input']>;
};

export type GameTemplate = {
  __typename?: 'GameTemplate';
  _id: Scalars['ID']['output'];
  /** Chế độ duyệt */
  approvalMode: ApprovalMode;
  /** Cấu hình chi phí */
  costConfig: CostConfig;
  createdAt: Scalars['DateTime']['output'];
  /** Địa điểm tùy chỉnh */
  customLocation?: Maybe<CustomLocation>;
  /** Cấu hình đặt cọc */
  depositConfig?: Maybe<DepositConfig>;
  /** Mô tả template */
  description?: Maybe<Scalars['String']['output']>;
  /** Dụng cụ cần mang */
  equipment?: Maybe<Array<EquipmentItem>>;
  /** Thể thức thi đấu (đơn/đôi/...) */
  gameFormats?: Maybe<Array<Scalars['String']['output']>>;
  /** Loại hình chơi */
  gameType: GameType;
  /** Cấu hình giới tính */
  genderConfig?: Maybe<GenderConfig>;
  /** Host cũng tham gia chơi */
  hostPlaying?: Maybe<Scalars['Boolean']['output']>;
  /** Lần sử dụng cuối */
  lastUsedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Tên template */
  name: Scalars['String']['output'];
  /** Yêu cầu trình độ */
  skillRequirement?: Maybe<SkillRequirement>;
  /** Cấu hình số người */
  slotConfig: SlotConfig;
  /** Môn thể thao */
  sportType: SportType;
  /** Tags */
  tags?: Maybe<Array<Scalars['String']['output']>>;
  updatedAt: Scalars['DateTime']['output'];
  /** Số lần sử dụng */
  usageCount: Scalars['Int']['output'];
  /** Người tạo template */
  user?: Maybe<User>;
  /** ID người tạo template */
  userId: Scalars['ID']['output'];
  /** Sân */
  venue?: Maybe<Venue>;
  /** ID sân */
  venueId?: Maybe<Scalars['ID']['output']>;
  /** Độ hiển thị */
  visibility: GameVisibility;
};

/** A Relay-style connection for GameTemplate items. */
export type GameTemplateConnection = {
  __typename?: 'GameTemplateConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<GameTemplateEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the GameTemplateConnection. */
export type GameTemplateEdge = {
  __typename?: 'GameTemplateEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: GameTemplate;
};

export type GameTimeSlot = {
  __typename?: 'GameTimeSlot';
  /** Ngày bắt đầu chơi (YYYY-MM-DD) */
  date: Scalars['String']['output'];
  /** Ngày kết thúc (YYYY-MM-DD). Mặc định cùng ngày bắt đầu. */
  endDate: Scalars['String']['output'];
  /** Giờ kết thúc (HH:mm) */
  endTime: Scalars['String']['output'];
  /** Giờ bắt đầu (HH:mm) */
  startTime: Scalars['String']['output'];
};

export type GameTimeSlotInput = {
  /** Ngày chơi (YYYY-MM-DD) */
  date: Scalars['String']['input'];
  /** Ngày kết thúc (YYYY-MM-DD). Bỏ trống = cùng ngày bắt đầu hoặc tự suy ra khi kết thúc qua đêm. */
  endDate?: InputMaybe<Scalars['String']['input']>;
  /** Giờ kết thúc (HH:mm) */
  endTime: Scalars['String']['input'];
  /** Giờ bắt đầu (HH:mm) */
  startTime: Scalars['String']['input'];
};

/** Loại hình chơi */
export enum GameType {
  Improvement = 'IMPROVEMENT',
  Social = 'SOCIAL'
}

/** Độ hiển thị của kèo */
export enum GameVisibility {
  Private = 'PRIVATE',
  Public = 'PUBLIC',
  Unlisted = 'UNLISTED'
}

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER'
}

export type GenderConfig = {
  __typename?: 'GenderConfig';
  /** Số nữ tối đa */
  maxFemale?: Maybe<Scalars['Int']['output']>;
  /** Số nam tối đa */
  maxMale?: Maybe<Scalars['Int']['output']>;
  /** Ghi chú giới tính */
  note?: Maybe<Scalars['String']['output']>;
  /** Giới hạn giới tính */
  restriction: GenderRestriction;
};

export type GenderConfigInput = {
  /** Số nữ tối đa */
  maxFemale?: InputMaybe<Scalars['Int']['input']>;
  /** Số nam tối đa */
  maxMale?: InputMaybe<Scalars['Int']['input']>;
  /** Ghi chú giới tính */
  note?: InputMaybe<Scalars['String']['input']>;
  /** Giới hạn giới tính */
  restriction: GenderRestriction;
};

export type GenderPricing = {
  __typename?: 'GenderPricing';
  /** Giá cho nữ */
  femalePrice: Scalars['Int']['output'];
  /** Giá cho nam */
  malePrice: Scalars['Int']['output'];
};

export type GenderPricingInput = {
  /** Giá cho nữ */
  femalePrice: Scalars['Int']['input'];
  /** Giá cho nam */
  malePrice: Scalars['Int']['input'];
};

/** Giới hạn giới tính */
export enum GenderRestriction {
  Any = 'ANY',
  FemaleOnly = 'FEMALE_ONLY',
  FemalePreferred = 'FEMALE_PREFERRED',
  MaleOnly = 'MALE_ONLY',
  MalePreferred = 'MALE_PREFERRED'
}

export type GenerateBracketInput = {
  categoryId: Scalars['ID']['input'];
};

/** Manual draw layout for single elimination */
export type GenerateManualDrawInput = {
  categoryId: Scalars['ID']['input'];
  /** Single elimination winners bracket slots */
  knockoutSlots: Array<ManualBracketSlotInput>;
};

export type GrantPortalCapabilityInput = {
  capability: PortalCapability;
  /** Reason / ticket reference (min 10 chars) */
  reason: Scalars['String']['input'];
  /** Target user ID */
  userId: Scalars['String']['input'];
};

export type Group = {
  __typename?: 'Group';
  _id: Scalars['ID']['output'];
  /** Group address/location */
  address?: Maybe<Scalars['String']['output']>;
  /** Cover image with placeholder + responsive variants. */
  coverImage?: Maybe<ImageMedia>;
  /**
   * Cover image URL
   * @deprecated Use `coverImage.url`. Kept for backward compat with mobile builds < 1.7.
   */
  coverImageUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Group creator */
  creator?: Maybe<User>;
  /** Creator/owner of the group */
  creatorId: Scalars['ID']['output'];
  /** Group description/bio */
  description?: Maybe<Scalars['String']['output']>;
  /** Whether the current user has a pending request */
  hasPendingRequest: Scalars['Boolean']['output'];
  /** Whether the group is active */
  isActive: Scalars['Boolean']['output'];
  /** Whether the current user is the admin */
  isAdmin: Scalars['Boolean']['output'];
  /** Whether the current user is a member */
  isMember: Scalars['Boolean']['output'];
  /** Timestamp of the last message */
  lastMessageAt?: Maybe<Scalars['DateTime']['output']>;
  /** ID of the last message */
  lastMessageId?: Maybe<Scalars['ID']['output']>;
  /** Preview text of the last message */
  lastMessageText?: Maybe<Scalars['String']['output']>;
  /** Number of members */
  memberCount: Scalars['Int']['output'];
  /** Group name */
  name: Scalars['String']['output'];
  /** Number of pending join requests */
  pendingRequestCount: Scalars['Int']['output'];
  /** Privacy level of the group */
  privacy: GroupPrivacy;
  /** Sport type of the group */
  sportType: SportType;
  updatedAt: Scalars['DateTime']['output'];
};

/** A Relay-style connection for Group items. */
export type GroupConnection = {
  __typename?: 'GroupConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<GroupEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the GroupConnection. */
export type GroupEdge = {
  __typename?: 'GroupEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Group;
};

export type GroupFilterInput = {
  /** Filter only groups user is member of */
  myGroups?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter groups where current user has a pending join request */
  pendingOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by privacy */
  privacy?: InputMaybe<GroupPrivacy>;
  /** Search query for name/description */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  /** Filter by sport type */
  sportType?: InputMaybe<SportType>;
};

export type GroupMember = {
  __typename?: 'GroupMember';
  _id: Scalars['ID']['output'];
  /** User who approved join request */
  approvedBy?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Group ID */
  groupId: Scalars['ID']['output'];
  /** User who invited this member */
  invitedBy?: Maybe<Scalars['ID']['output']>;
  /** Who invited this member */
  inviter?: Maybe<User>;
  /** Whether notifications are muted */
  isMuted: Scalars['Boolean']['output'];
  /** When the member joined */
  joinedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Last read message timestamp */
  lastReadAt?: Maybe<Scalars['DateTime']['output']>;
  /** Join request message */
  requestMessage?: Maybe<Scalars['String']['output']>;
  /** Role in the group */
  role: GroupMemberRole;
  /** Membership status */
  status: GroupMemberStatus;
  updatedAt: Scalars['DateTime']['output'];
  /** Member user info */
  user?: Maybe<User>;
  /** User ID */
  userId: Scalars['ID']['output'];
};

/** A Relay-style connection for GroupMember items. */
export type GroupMemberConnection = {
  __typename?: 'GroupMemberConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<GroupMemberEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the GroupMemberConnection. */
export type GroupMemberEdge = {
  __typename?: 'GroupMemberEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: GroupMember;
};

/** Role of a member in the group */
export enum GroupMemberRole {
  Admin = 'ADMIN',
  Member = 'MEMBER',
  Moderator = 'MODERATOR'
}

/** Status of group membership */
export enum GroupMemberStatus {
  Active = 'ACTIVE',
  Banned = 'BANNED',
  Invited = 'INVITED',
  Left = 'LEFT',
  Pending = 'PENDING'
}

export type GroupMessage = {
  __typename?: 'GroupMessage';
  _id: Scalars['ID']['output'];
  /** Message text content */
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** When message was edited */
  editedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Group ID */
  groupId: Scalars['ID']['output'];
  /** Whether the message is deleted */
  isDeleted: Scalars['Boolean']['output'];
  /** Media attachments */
  media?: Maybe<Array<GroupMessageMedia>>;
  /** List of reactions on this message */
  reactions: Array<GroupMessageReaction>;
  /** User IDs who have read this message */
  readBy: Array<Scalars['ID']['output']>;
  /** ID of the message being replied to */
  replyToId?: Maybe<Scalars['ID']['output']>;
  /** Message sender */
  sender?: Maybe<User>;
  /** Sender user ID */
  senderId: Scalars['ID']['output'];
  /** Shared pickup game data (for GAME_SHARE messages) */
  sharedGame?: Maybe<PickupGame>;
  /** ID of shared pickup game (for GAME_SHARE type) */
  sharedGameId?: Maybe<Scalars['ID']['output']>;
  /** Type of message */
  type: GroupMessageType;
  updatedAt: Scalars['DateTime']['output'];
};

/** A Relay-style connection for GroupMessage items. */
export type GroupMessageConnection = {
  __typename?: 'GroupMessageConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<GroupMessageEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the GroupMessageConnection. */
export type GroupMessageEdge = {
  __typename?: 'GroupMessageEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: GroupMessage;
};

export type GroupMessageMedia = {
  __typename?: 'GroupMessageMedia';
  fileName?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  mimeType?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Float']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
  width?: Maybe<Scalars['Float']['output']>;
};

export type GroupMessageMediaInput = {
  fileName?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Float']['input']>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  url: Scalars['String']['input'];
  width?: InputMaybe<Scalars['Float']['input']>;
};

export type GroupMessageReaction = {
  __typename?: 'GroupMessageReaction';
  /** When the reaction was added */
  createdAt: Scalars['DateTime']['output'];
  /** Emoji reaction */
  emoji: Scalars['String']['output'];
  /** User ID who reacted */
  userId: Scalars['ID']['output'];
};

/** Group message read payload */
export type GroupMessageReadPayload = {
  __typename?: 'GroupMessageReadPayload';
  /** Group ID */
  groupId: Scalars['ID']['output'];
  /** When the messages were read */
  readAt: Scalars['String']['output'];
  /** User ID who read the messages */
  userId: Scalars['ID']['output'];
};

/** Type of group message */
export enum GroupMessageType {
  File = 'FILE',
  GameShare = 'GAME_SHARE',
  Image = 'IMAGE',
  System = 'SYSTEM',
  Text = 'TEXT',
  Video = 'VIDEO'
}

/** Privacy level of the group */
export enum GroupPrivacy {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

/** Group typing status payload */
export type GroupTypingStatusPayload = {
  __typename?: 'GroupTypingStatusPayload';
  /** Group ID */
  groupId: Scalars['ID']['output'];
  /** Whether user is typing */
  isTyping: Scalars['Boolean']['output'];
  /** Avatar of the user typing */
  userAvatar?: Maybe<Scalars['String']['output']>;
  /** User ID who is typing */
  userId: Scalars['ID']['output'];
  /** Name of the user typing */
  userName: Scalars['String']['output'];
};

export type GrowthStats = {
  __typename?: 'GrowthStats';
  /** Activation rate (users who completed at least 1 order) */
  activationRate: Scalars['Float']['output'];
  /** Percentage of new users from partner referrals */
  partnerPercentage: Scalars['Float']['output'];
  /** New users acquired via partner referral codes */
  partnerReferred: Scalars['Int']['output'];
  /** Total new users in period */
  totalNewUsers: Scalars['Int']['output'];
  /** Total revenue from referred users */
  totalRevenue: Scalars['Float']['output'];
  /** Daily trend data for chart */
  trend: Array<GrowthTrendPoint>;
};

export type GrowthTrendPoint = {
  __typename?: 'GrowthTrendPoint';
  /** Label for this data point (e.g. date string) */
  label: Scalars['String']['output'];
  /** Organic user count */
  organic: Scalars['Int']['output'];
  /** Partner-referred user count */
  partner: Scalars['Int']['output'];
};

export type HealthStatus = {
  __typename?: 'HealthStatus';
  database: Scalars['String']['output'];
  status: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
  uptime?: Maybe<Scalars['Float']['output']>;
};

export type HeatMapCell = {
  __typename?: 'HeatMapCell';
  /** Number of bookings */
  bookings: Scalars['Int']['output'];
  /** Day (e.g., T2, T3...) */
  day: Scalars['String']['output'];
  /** Hour (e.g., 06, 08, 10...) */
  hour: Scalars['String']['output'];
  /** Intensity 0-1 */
  intensity: Scalars['Float']['output'];
};

export type HostBlacklist = {
  __typename?: 'HostBlacklist';
  _id: Scalars['ID']['output'];
  /** Người bị chặn */
  blockedUser?: Maybe<User>;
  /** ID người bị chặn */
  blockedUserId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** ID host */
  hostId: Scalars['ID']['output'];
  /** Lý do chặn */
  reason?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

/** A Relay-style connection for HostBlacklist items. */
export type HostBlacklistConnection = {
  __typename?: 'HostBlacklistConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<HostBlacklistEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the HostBlacklistConnection. */
export type HostBlacklistEdge = {
  __typename?: 'HostBlacklistEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: HostBlacklist;
};

export type HostStatistics = {
  __typename?: 'HostStatistics';
  /** Trung bình người/kèo */
  averageParticipantsPerGame: Scalars['Float']['output'];
  /** Rating trung bình */
  averageRating: Scalars['Float']['output'];
  /** Tỷ lệ hoàn thành */
  completionRate: Scalars['Float']['output'];
  /** Số người theo dõi */
  followerCount: Scalars['Int']['output'];
  /** Số kèo theo tháng */
  gamesByMonth: Array<MonthGameCount>;
  /** Số kèo theo môn */
  gamesBySport: Array<SportGameCount>;
  /** Top người chơi */
  topParticipants: Array<TopParticipant>;
  /** Số kèo hoàn thành */
  totalGamesCompleted: Scalars['Int']['output'];
  /** Tổng số kèo đã tạo */
  totalGamesHosted: Scalars['Int']['output'];
  /** Tổng số người tham gia */
  totalParticipants: Scalars['Int']['output'];
  /** Tổng doanh thu */
  totalRevenue: Scalars['Int']['output'];
};

/** A user-uploaded image asset with placeholder & responsive variants. */
export type ImageMedia = {
  __typename?: 'ImageMedia';
  /** Compact base83 BlurHash placeholder; clients decode locally to render an instant preview. */
  blurhash?: Maybe<Scalars['String']['output']>;
  /** Pixel height of the original image. */
  height?: Maybe<Scalars['Int']['output']>;
  /** ~800px medium variant (feed cards, detail header). */
  mediumUrl?: Maybe<Scalars['String']['output']>;
  /** Storage key — useful for backend cleanup jobs. */
  storageKey?: Maybe<Scalars['String']['output']>;
  /** ~200px thumbnail variant (chat list, search row). */
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
  /** Full-resolution image URL. */
  url: Scalars['String']['output'];
  /** Pixel width of the original image. */
  width?: Maybe<Scalars['Int']['output']>;
};

export type ImportStockInput = {
  /** Batch/lot number for this import */
  batchNumber?: InputMaybe<Scalars['String']['input']>;
  /** Expiry date (YYYY-MM-DD) */
  expiryDate?: InputMaybe<Scalars['String']['input']>;
  /** Import price per unit */
  importPrice: Scalars['Float']['input'];
  /** Invoice/receipt number */
  invoiceNumber?: InputMaybe<Scalars['String']['input']>;
  /** Additional notes */
  note?: InputMaybe<Scalars['String']['input']>;
  /** Product ID to import stock for */
  productId: Scalars['ID']['input'];
  /** Quantity to import */
  quantity: Scalars['Int']['input'];
  /** Supplier contact (phone/email) */
  supplierContact?: InputMaybe<Scalars['String']['input']>;
  /** Supplier name */
  supplierName?: InputMaybe<Scalars['String']['input']>;
  /** Variant ID (if applicable) */
  variantId?: InputMaybe<Scalars['ID']['input']>;
};

/** Status of a contact inquiry */
export enum InquiryStatus {
  Closed = 'CLOSED',
  InProgress = 'IN_PROGRESS',
  New = 'NEW',
  Replied = 'REPLIED'
}

export type InterestedUser = {
  __typename?: 'InterestedUser';
  /** Message from interested user */
  message?: Maybe<Scalars['String']['output']>;
  /** When user expressed interest */
  requestedAt: Scalars['DateTime']['output'];
  /** Interest status */
  status: InterestedUserStatus;
  /** User ID */
  userId: Scalars['ID']['output'];
};

/** Status of interested user in booking pass */
export enum InterestedUserStatus {
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Selected = 'SELECTED'
}

export type InventoryReport = {
  __typename?: 'InventoryReport';
  /** Products with low stock */
  lowStockCount: Scalars['Int']['output'];
  /** Products out of stock */
  outOfStockCount: Scalars['Int']['output'];
  /** Total stock value at cost price */
  totalCostValue: Scalars['Float']['output'];
  /** Total products with inventory tracking */
  totalProducts: Scalars['Int']['output'];
  /** Total stock value at selling price */
  totalStockValue: Scalars['Float']['output'];
};

export type InventoryStatus = {
  __typename?: 'InventoryStatus';
  /** Active products */
  activeProducts: Scalars['Int']['output'];
  /** Low stock products */
  lowStockProducts: Scalars['Int']['output'];
  /** Out of stock products */
  outOfStockProducts: Scalars['Int']['output'];
  /** Stock turnover rate */
  stockTurnoverRate: Scalars['Float']['output'];
  /** Total inventory value (cost) */
  totalInventoryValue: Scalars['Int']['output'];
  /** Total products */
  totalProducts: Scalars['Int']['output'];
  /** Total retail value */
  totalRetailValue: Scalars['Int']['output'];
};

export type InviteRefereeInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  maxMatchesPerDay?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  preferredCourts?: InputMaybe<Array<Scalars['String']['input']>>;
  role?: InputMaybe<RefereeRole>;
  tournamentId: Scalars['ID']['input'];
  /** System user ID. Omit for external referees. */
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type JoinGameInput = {
  /** ID kèo */
  gameId: Scalars['ID']['input'];
  /** Số người đi cùng (bao gồm bản thân) */
  groupSize?: InputMaybe<Scalars['Int']['input']>;
  /** Tin nhắn khi xin tham gia */
  message?: InputMaybe<Scalars['String']['input']>;
};

export type KickParticipantInput = {
  /** ID kèo */
  gameId: Scalars['ID']['input'];
  /** Lý do kick */
  reason?: InputMaybe<Scalars['String']['input']>;
  /** ID người chơi */
  userId: Scalars['ID']['input'];
};

/** Outcome of a super-admin late entry into a BYE slot */
export enum LateEntryAction {
  Blocked = 'BLOCKED',
  FilledBye = 'FILLED_BYE',
  NoByeSlot = 'NO_BYE_SLOT'
}

export type LateEntryByeMatchSummary = {
  __typename?: 'LateEntryByeMatchSummary';
  matchId: Scalars['ID']['output'];
  matchNumber: Scalars['Int']['output'];
  opponentName: Scalars['String']['output'];
  roundLabel: Scalars['String']['output'];
};

export type LateEntryPlacementPreview = {
  __typename?: 'LateEntryPlacementPreview';
  blockReason?: Maybe<Scalars['String']['output']>;
  canProceed: Scalars['Boolean']['output'];
  eligibleByeMatchCount: Scalars['Int']['output'];
  eligibleMatches: Array<LateEntryByeMatchSummary>;
  isFormatSupported: Scalars['Boolean']['output'];
};

export type LegalAcceptanceStatus = {
  __typename?: 'LegalAcceptanceStatus';
  /** Version of Privacy user accepted */
  acceptedPrivacyVersion?: Maybe<Scalars['String']['output']>;
  /** Version of Terms user accepted */
  acceptedTermsVersion?: Maybe<Scalars['String']['output']>;
  /** Current Privacy Policy version */
  currentPrivacyVersion?: Maybe<Scalars['String']['output']>;
  /** Current Terms of Service version */
  currentTermsVersion?: Maybe<Scalars['String']['output']>;
  /** Whether user has accepted ALL required legal documents */
  hasAcceptedAll: Scalars['Boolean']['output'];
  /** Whether user has accepted current Privacy Policy */
  hasAcceptedPrivacy: Scalars['Boolean']['output'];
  /** Whether user has accepted current Terms of Service */
  hasAcceptedTerms: Scalars['Boolean']['output'];
  /** When user accepted Privacy */
  privacyAcceptedAt?: Maybe<Scalars['DateTime']['output']>;
  /** When user accepted Terms */
  termsAcceptedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type LegalDocument = {
  __typename?: 'LegalDocument';
  _id: Scalars['ID']['output'];
  /** Document content (HTML or Markdown) */
  content: Scalars['String']['output'];
  /** Creation timestamp */
  createdAt: Scalars['DateTime']['output'];
  /** Admin who created this document */
  createdById?: Maybe<Scalars['ID']['output']>;
  /** Date when this version becomes effective */
  effectiveDate: Scalars['DateTime']['output'];
  /** Whether this is the current active version */
  isActive: Scalars['Boolean']['output'];
  /** Brief summary of key points */
  summary?: Maybe<Scalars['String']['output']>;
  /** Document title */
  title: Scalars['String']['output'];
  /** Type of legal document */
  type: LegalDocumentType;
  /** Last update timestamp */
  updatedAt: Scalars['DateTime']['output'];
  /** Document version (e.g., "1.0", "1.1", "2.0") */
  version: Scalars['String']['output'];
};

export type LegalDocumentSummary = {
  __typename?: 'LegalDocumentSummary';
  effectiveDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  type: LegalDocumentType;
  version: Scalars['String']['output'];
};

/** Types of legal documents */
export enum LegalDocumentType {
  PrivacyPolicy = 'PRIVACY_POLICY',
  TermsOfService = 'TERMS_OF_SERVICE'
}

export type Location = {
  __typename?: 'Location';
  city?: Maybe<Scalars['String']['output']>;
  coordinates?: Maybe<Coordinates>;
  country?: Maybe<Scalars['String']['output']>;
  displayText?: Maybe<Scalars['String']['output']>;
};

export type LocationInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  coordinates?: InputMaybe<CoordinatesInput>;
  country?: InputMaybe<Scalars['String']['input']>;
  displayText?: InputMaybe<Scalars['String']['input']>;
};

export type LotAllocationRecord = {
  __typename?: 'LotAllocationRecord';
  lotId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  unitCost: Scalars['Float']['output'];
};

export type ManualBracketSlotInput = {
  /** Registration ID; null/omit = BYE */
  registrationId?: InputMaybe<Scalars['ID']['input']>;
  /** Bracket slot index (0-based) */
  slotIndex: Scalars['Int']['input'];
};

export type ManualKnockoutDrawPreview = {
  __typename?: 'ManualKnockoutDrawPreview';
  bracketSize: Scalars['Int']['output'];
  errors: Array<ManualKnockoutPreviewError>;
  layoutHints: ManualKnockoutLayoutHints;
  matchupRows: Array<ManualKnockoutMatchupPreviewRow>;
  maxR1TvT: Scalars['Int']['output'];
  r1TvTCount: Scalars['Int']['output'];
  totalByes: Scalars['Int']['output'];
  valid: Scalars['Boolean']['output'];
};

export type ManualKnockoutLayoutHints = {
  __typename?: 'ManualKnockoutLayoutHints';
  approvedCount: Scalars['Int']['output'];
  minR1TvT: Scalars['Int']['output'];
  r1PairCount: Scalars['Int']['output'];
  r1TvTCount: Scalars['Int']['output'];
  r1WalkoverCount: Scalars['Int']['output'];
  r2TvTCount: Scalars['Int']['output'];
  r2WalkoverCount: Scalars['Int']['output'];
  structuralEmptyPairs: Scalars['Int']['output'];
};

export type ManualKnockoutMatchupPreviewRow = {
  __typename?: 'ManualKnockoutMatchupPreviewRow';
  isR1ByeWalkover: Scalars['Boolean']['output'];
  meetingRound: Scalars['Int']['output'];
  meetingRoundLabel: Scalars['String']['output'];
  player1Name: Scalars['String']['output'];
  player2Name: Scalars['String']['output'];
  r1PairIndex?: Maybe<Scalars['Int']['output']>;
};

export type ManualKnockoutPreviewError = {
  __typename?: 'ManualKnockoutPreviewError';
  code: Scalars['String']['output'];
  message: Scalars['String']['output'];
  pairIndex?: Maybe<Scalars['Int']['output']>;
  slotIndex?: Maybe<Scalars['Int']['output']>;
};

export type ManualMatchResultInput = {
  matchId: Scalars['ID']['input'];
  /** Lý do ghi đè kết quả (audit bắt buộc) */
  reason: Scalars['String']['input'];
  /** Set scores [[p1,p2],[p1,p2],...] */
  setScores?: InputMaybe<Array<Array<Scalars['Int']['input']>>>;
  /** Winner: 1 or 2 */
  winner: Scalars['Int']['input'];
};

export type MarkAllAsReadResponse = {
  __typename?: 'MarkAllAsReadResponse';
  /** Number of notifications marked as read */
  count: Scalars['Int']['output'];
  /** Response message */
  message: Scalars['String']['output'];
  /** Whether the operation was successful */
  success: Scalars['Boolean']['output'];
};

export type MarkMvpInput = {
  /** ID kèo */
  gameId: Scalars['ID']['input'];
  /** ID MVP */
  userId: Scalars['ID']['input'];
};

/** Organizer correction action type */
export enum MatchCorrectionAction {
  AbortLive = 'ABORT_LIVE',
  CorrectResult = 'CORRECT_RESULT',
  ManualResult = 'MANUAL_RESULT',
  SetSnapshot = 'SET_SNAPSHOT',
  UndoPoints = 'UNDO_POINTS',
  Walkover = 'WALKOVER'
}

export type MatchCourt = {
  __typename?: 'MatchCourt';
  courtId?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type MatchEventGql = {
  __typename?: 'MatchEventGql';
  id: Scalars['ID']['output'];
  payload?: Maybe<Scalars['String']['output']>;
  scoringPlayer?: Maybe<Scalars['Int']['output']>;
  setNumber?: Maybe<Scalars['Int']['output']>;
  timestamp: Scalars['String']['output'];
  type: MatchEventType;
};

export enum MatchEventType {
  Fault = 'FAULT',
  Let = 'LET',
  ManualCorrection = 'MANUAL_CORRECTION',
  PhaseChange = 'PHASE_CHANGE',
  Point = 'POINT',
  Retirement = 'RETIREMENT',
  ServeChange = 'SERVE_CHANGE',
  ServiceOver = 'SERVICE_OVER',
  SetComplete = 'SET_COMPLETE',
  SwapEnds = 'SWAP_ENDS',
  Undo = 'UNDO'
}

export type MatchFilterInput = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
  /** Filter by group ID */
  groupId?: InputMaybe<Scalars['String']['input']>;
  /** Filter by referee ID */
  refereeId?: InputMaybe<Scalars['String']['input']>;
  round?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<MatchStatus>;
  statuses?: InputMaybe<Array<MatchStatus>>;
};

export type MatchMember = {
  __typename?: 'MatchMember';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  /** CLB / Đội */
  club?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
};

/** Current match orchestration phase */
export enum MatchPhase {
  BetweenGames = 'BETWEEN_GAMES',
  Finished = 'FINISHED',
  MidGameInterval = 'MID_GAME_INTERVAL',
  Play = 'PLAY',
  Setup = 'SETUP',
  Warmup = 'WARMUP'
}

export type MatchPlayer = {
  __typename?: 'MatchPlayer';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  /** Số báo danh (SBD) */
  bibNumber?: Maybe<Scalars['Int']['output']>;
  /** CLB / Đội */
  club?: Maybe<Scalars['String']['output']>;
  /** Năm sinh (YYYY) — phân biệt VĐV trùng tên */
  dateOfBirth?: Maybe<Scalars['String']['output']>;
  /** Individual members (1 for singles, 2 for doubles) */
  members?: Maybe<Array<MatchMember>>;
  name?: Maybe<Scalars['String']['output']>;
  registrationId?: Maybe<Scalars['ID']['output']>;
  seed?: Maybe<Scalars['Int']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type MatchScorecard = {
  __typename?: 'MatchScorecard';
  _id: Scalars['ID']['output'];
  bestOf: Scalars['Int']['output'];
  categoryId: Scalars['ID']['output'];
  /** Organizer correction audit trail */
  correctionHistory?: Maybe<Array<CorrectionEvent>>;
  createdAt: Scalars['DateTime']['output'];
  /** Index of the current set (0-based) */
  currentSetIndex: Scalars['Int']['output'];
  /** Total elapsed seconds */
  elapsedSeconds: Scalars['Int']['output'];
  /** Who is on the left side: 1 or 2 */
  leftSidePlayer?: Maybe<Scalars['Int']['output']>;
  matchId: Scalars['ID']['output'];
  /** Pre-match setup audit (coin toss / manual) */
  matchSetup?: Maybe<MatchSetupSnapshot>;
  pointHistory: Array<PointEvent>;
  /** Snapshot of scoring rules at match start */
  scoringConfig: ScoringConfig;
  /** Who is serving: 1 or 2 */
  servingPlayer?: Maybe<Scalars['Int']['output']>;
  sets: Array<ScorecardSet>;
  status: ScorecardStatus;
  tournamentId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type MatchSetupInput = {
  leftSidePlayer: Scalars['Int']['input'];
  servingPlayer: Scalars['Int']['input'];
  setupMethod?: InputMaybe<Scalars['String']['input']>;
  side1MemberLabels?: InputMaybe<Array<Scalars['String']['input']>>;
  side2MemberLabels?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** How pre-match serve/side setup was decided */
export enum MatchSetupMethod {
  CoinToss = 'COIN_TOSS',
  Manual = 'MANUAL'
}

export type MatchSetupSnapshot = {
  __typename?: 'MatchSetupSnapshot';
  /** What the toss winner chose */
  coinTossChoice?: Maybe<CoinTossChoice>;
  /** Coin toss winner: 1 or 2 */
  coinTossWinner?: Maybe<Scalars['Int']['output']>;
  /** ISO timestamp when setup was finalized */
  decidedAt: Scalars['String']['output'];
  setupMethod: MatchSetupMethod;
};

/** Status of a tournament match */
export enum MatchStatus {
  Bye = 'BYE',
  Cancelled = 'CANCELLED',
  Finished = 'FINISHED',
  Live = 'LIVE',
  NotStarted = 'NOT_STARTED',
  Retirement = 'RETIREMENT',
  Walkover = 'WALKOVER'
}

/** Type of match (singles, doubles, or team) */
export enum MatchType {
  Doubles = 'DOUBLES',
  Singles = 'SINGLES',
  Team = 'TEAM'
}

export type Message = {
  __typename?: 'Message';
  _id: Scalars['ID']['output'];
  /** Conversation ID this message belongs to */
  conversationId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** When message was deleted */
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  /** When message was last edited */
  editedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Whether this message has been deleted */
  isDeleted: Scalars['Boolean']['output'];
  /** Whether this message has been edited */
  isEdited: Scalars['Boolean']['output'];
  /** Whether this message is pinned */
  isPinned: Scalars['Boolean']['output'];
  /** Location data */
  location?: Maybe<MessageLocation>;
  /** Media attachment (image, video, file) */
  media?: Maybe<MessageMedia>;
  /** When message was pinned */
  pinnedAt?: Maybe<Scalars['DateTime']['output']>;
  /** User ID who pinned this message */
  pinnedBy?: Maybe<Scalars['ID']['output']>;
  /** List of reactions on this message */
  reactions: Array<MessageReaction>;
  /** List of users who read this message */
  readBy: Array<MessageReadReceipt>;
  /** ID of the message this is replying to */
  replyToId?: Maybe<Scalars['ID']['output']>;
  /** User ID who sent this message */
  senderId: Scalars['ID']['output'];
  status: MessageStatus;
  /** Text content of the message */
  text?: Maybe<Scalars['String']['output']>;
  type: MessageType;
  updatedAt: Scalars['DateTime']['output'];
};

/** A Relay-style connection for Message items. */
export type MessageConnection = {
  __typename?: 'MessageConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<MessageEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

export type MessageDeletedPayload = {
  __typename?: 'MessageDeletedPayload';
  conversationId: Scalars['ID']['output'];
  deletedAt: Scalars['DateTime']['output'];
  messageId: Scalars['ID']['output'];
};

/** An edge in the MessageConnection. */
export type MessageEdge = {
  __typename?: 'MessageEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Message;
};

export type MessageLocation = {
  __typename?: 'MessageLocation';
  /** Human-readable address */
  address?: Maybe<Scalars['String']['output']>;
  /** Latitude coordinate */
  latitude: Scalars['Float']['output'];
  /** Longitude coordinate */
  longitude: Scalars['Float']['output'];
};

export type MessageLocationInput = {
  /** Address */
  address?: InputMaybe<Scalars['String']['input']>;
  /** Latitude */
  latitude: Scalars['Float']['input'];
  /** Longitude */
  longitude: Scalars['Float']['input'];
};

export type MessageMedia = {
  __typename?: 'MessageMedia';
  /** BlurHash placeholder used to render an instant preview on the chat bubble. */
  blurhash?: Maybe<Scalars['String']['output']>;
  /** Duration in seconds (for videos/audio) */
  duration?: Maybe<Scalars['Float']['output']>;
  /** Height in pixels (for images/videos) */
  height?: Maybe<Scalars['Float']['output']>;
  /** ~800px medium variant for bubble preview. */
  mediumUrl?: Maybe<Scalars['String']['output']>;
  /** MIME type of the file */
  mimeType?: Maybe<Scalars['String']['output']>;
  /** File size in bytes */
  size?: Maybe<Scalars['Float']['output']>;
  /** Thumbnail URL for images/videos */
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
  /** URL of the media file */
  url: Scalars['String']['output'];
  /** Width in pixels (for images/videos) */
  width?: Maybe<Scalars['Float']['output']>;
};

export type MessageMediaInput = {
  /** Duration in seconds */
  duration?: InputMaybe<Scalars['Float']['input']>;
  /** Height in pixels */
  height?: InputMaybe<Scalars['Float']['input']>;
  /** MIME type */
  mimeType?: InputMaybe<Scalars['String']['input']>;
  /** File size in bytes */
  size?: InputMaybe<Scalars['Float']['input']>;
  /** Thumbnail URL */
  thumbnailUrl?: InputMaybe<Scalars['String']['input']>;
  /** URL of the media file */
  url: Scalars['String']['input'];
  /** Width in pixels */
  width?: InputMaybe<Scalars['Float']['input']>;
};

export type MessageReaction = {
  __typename?: 'MessageReaction';
  /** When the reaction was added */
  createdAt: Scalars['DateTime']['output'];
  /** Emoji reaction */
  emoji: Scalars['String']['output'];
  /** User ID who reacted */
  userId: Scalars['ID']['output'];
};

export type MessageReactionsBatchEntry = {
  __typename?: 'MessageReactionsBatchEntry';
  messageId: Scalars['ID']['output'];
  reactions: Array<ReactionDelta>;
};

export type MessageReactionsBatchPayload = {
  __typename?: 'MessageReactionsBatchPayload';
  conversationId: Scalars['ID']['output'];
  items: Array<MessageReactionsBatchEntry>;
};

export type MessageReadPayload = {
  __typename?: 'MessageReadPayload';
  conversationId: Scalars['ID']['output'];
  messageIds: Array<Scalars['ID']['output']>;
  readAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type MessageReadReceipt = {
  __typename?: 'MessageReadReceipt';
  /** Timestamp when message was read */
  readAt: Scalars['DateTime']['output'];
  /** User ID who read the message */
  userId: Scalars['ID']['output'];
};

export type MessageReport = {
  __typename?: 'MessageReport';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Message that was reported */
  messageId: Scalars['ID']['output'];
  /** Admin notes or resolution details */
  notes?: Maybe<Scalars['String']['output']>;
  /** Reason for reporting */
  reason: Scalars['String']['output'];
  /** User who reported the message */
  reporterId: Scalars['ID']['output'];
  /** When the report was reviewed */
  reviewedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Admin/moderator who reviewed */
  reviewedBy?: Maybe<Scalars['ID']['output']>;
  /** Status of the report */
  status: ReportStatus;
  updatedAt: Scalars['DateTime']['output'];
};

/** A Relay-style connection for MessageReport items. */
export type MessageReportConnection = {
  __typename?: 'MessageReportConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<MessageReportEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the MessageReportConnection. */
export type MessageReportEdge = {
  __typename?: 'MessageReportEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: MessageReport;
};

export type MessageReportFilterInput = {
  /** Filter by report status */
  status?: InputMaybe<ReportStatus>;
};

export type MessageReportStats = {
  __typename?: 'MessageReportStats';
  /** Total dismissed reports */
  dismissedReports: Scalars['Int']['output'];
  /** Total pending reports */
  pendingReports: Scalars['Int']['output'];
  /** Total resolved reports */
  resolvedReports: Scalars['Int']['output'];
  /** Total reviewed reports */
  reviewedReports: Scalars['Int']['output'];
  /** Total reports */
  totalReports: Scalars['Int']['output'];
};

/** Status of message delivery */
export enum MessageStatus {
  Delivered = 'DELIVERED',
  Failed = 'FAILED',
  Read = 'READ',
  Sending = 'SENDING',
  Sent = 'SENT'
}

/** Type of message content */
export enum MessageType {
  File = 'FILE',
  Image = 'IMAGE',
  Location = 'LOCATION',
  System = 'SYSTEM',
  Text = 'TEXT',
  Video = 'VIDEO'
}

export type MonthGameCount = {
  __typename?: 'MonthGameCount';
  /** Số lượng kèo */
  count: Scalars['Int']['output'];
  /** Tháng (YYYY-MM) */
  month: Scalars['String']['output'];
};

export type MoveMatchInput = {
  /** After move, repack subsequent matches on the same court/day */
  autoRepack?: InputMaybe<Scalars['Boolean']['input']>;
  /** Target court name */
  courtName: Scalars['String']['input'];
  matchId: Scalars['ID']['input'];
  /** New scheduledAt ISO local string */
  scheduledAt: Scalars['String']['input'];
};

/** Preview moving a match without persisting */
export type MoveMatchPreviewResult = {
  __typename?: 'MoveMatchPreviewResult';
  affectedPreview?: Maybe<Array<ScheduleShiftPreview>>;
  match: TournamentMatch;
  suggestRepack: Scalars['Boolean']['output'];
  warnings: Array<Scalars['String']['output']>;
};

/** Result of atomic move (+ optional repack) */
export type MoveMatchResult = {
  __typename?: 'MoveMatchResult';
  match: TournamentMatch;
  repackPreview?: Maybe<Array<ScheduleShiftPreview>>;
  repackedCount: Scalars['Int']['output'];
  warnings: Array<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Accept a group invitation */
  acceptInvitation: GroupMember;
  /** Accept legal documents (ToS and Privacy Policy) */
  acceptLegalDocuments: AcceptLegalDocumentsResult;
  /** Accept pass (selected user or private transferee) */
  acceptPass: BookingPass;
  /** Accept staff invitation */
  acceptStaffInvitation: VenueStaff;
  /** Activate a specific version of a legal document (admin only) */
  activateLegalDocumentVersion: LegalDocument;
  /** Activate promotion directly (owner action) */
  activatePromotion: Promotion;
  /** Thêm kèo vào campaign */
  addGamesToCampaign: PickupGameCampaign;
  /** Add reaction to a group message */
  addGroupMessageReaction: GroupMessage;
  /** Add items to a booking (F&B order during play) */
  addItemsToBooking: Order;
  /** Super Admin: add late entry and randomly fill an eligible R1 BYE slot */
  addLateEntryToByeSlot: AddLateEntryResult;
  /** Add reaction to a message */
  addReaction: Message;
  /** Chặn người dùng */
  addToBlacklist: HostBlacklist;
  /** Add staff member with custom permissions */
  addVenueStaff: VenueStaff;
  /** Adjust stock manually */
  adjustStock: StockMovement;
  /** Approve venue request (Admin only) */
  adminApproveVenue: Venue;
  /** Change user role (Owner only — centralized access control) */
  adminChangeUserRole: User;
  /** Create a new user account (Super Admin only: ADMIN or FACILITY_OWNER) */
  adminCreateUser: User;
  /** Provision a PLAYER account on behalf of a user (Super Admin only) */
  adminProvisionPlayer: AdminProvisionPlayerResponse;
  /** Reject venue request (Admin only) */
  adminRejectVenue: Venue;
  /** Reset password for a PLAYER account (Super Admin only) */
  adminResetUserPassword: AdminResetUserPasswordResponse;
  /** Suspend a user (Super Admin only) */
  adminSuspendUser: User;
  /** Suspend venue (Admin only) */
  adminSuspendVenue: Venue;
  /** Unsuspend a user (Super Admin only) */
  adminUnsuspendUser: User;
  /** Approve a group join request (admin only) */
  approveGroupJoinRequest: GroupMember;
  /** Approve a hold booking (staff only) - starts the hold timer */
  approveHoldBooking: Booking;
  /** Duyệt yêu cầu tham gia */
  approveJoinRequest: PickupGameParticipant;
  /** Approve registration */
  approveRegistration: TournamentRegistration;
  /** Approve a venue request (Admin only) */
  approveVenueRequest: VenueRequest;
  /** Archive a conversation */
  archiveConversation: Conversation;
  /** Assign referee to match */
  assignReferee: TournamentMatch;
  /** Assign referee to all matches on a specific court */
  assignRefereeToCourt: BulkAssignRefereeResult;
  /** Auto-assign referees from pool to unassigned matches */
  autoAssignReferees: AutoAssignRefereesResult;
  /** Auto-schedule unscheduled matches using a greedy algorithm with round dependency, rest-time, and court buffer */
  autoScheduleMatches: AutoScheduleResult;
  /** Auto-seed top players in category */
  autoSeedPlayers: SuccessResponse;
  /** Ban a member from a group (creator only) */
  banMember: Scalars['Boolean']['output'];
  /** Block a user */
  blockUser: UserBlock;
  /** Bookmark a post */
  bookmarkPost: PostBookmark;
  /** Bulk approve registrations */
  bulkApproveRegistrations: Scalars['Int']['output'];
  /** Assign one referee to multiple matches from pool */
  bulkAssignReferee: BulkAssignRefereeResult;
  /** Check-in nhiều người */
  bulkCheckIn: Array<PickupGameParticipant>;
  /** Bulk delete products */
  bulkDeleteProducts: BulkOperationResult;
  /** Bulk delete registrations */
  bulkDeleteRegistrations: Scalars['Int']['output'];
  /** Bulk import registrations from file (organizer only) */
  bulkImportRegistrations: BulkImportResult;
  /** Bulk reject registrations */
  bulkRejectRegistrations: Scalars['Int']['output'];
  /** Bulk schedule matches */
  bulkScheduleMatches: Array<TournamentMatch>;
  /** Bulk unschedule all matches for a tournament on a given date */
  bulkUnscheduleByDate: Scalars['Int']['output'];
  /** Bulk update display order */
  bulkUpdateDisplayOrder: Scalars['Boolean']['output'];
  /** Bulk update product status */
  bulkUpdateProductStatus: BulkOperationResult;
  /** Cancel booking */
  cancelBooking: Booking;
  /** Cancel booking pass */
  cancelBookingPass: BookingPass;
  /** Cancel a pending claim request - by the claiming user */
  cancelClaimRequest: VenueClaimRequest;
  /** Cancel a hold booking (customer only - own bookings) */
  cancelHoldBooking: Booking;
  /** Cancel a pending invitation (admin/mod only) */
  cancelInvitation: Scalars['Boolean']['output'];
  /** Cancel order */
  cancelOrder: Order;
  /** Cancel order with refund (Owner only). For paid orders, creates refund request. */
  cancelOrderWithRefund: Order;
  /** Hủy kèo */
  cancelPickupGame: Scalars['Boolean']['output'];
  /** Cancel a promotion */
  cancelPromotion: Promotion;
  /** Cancel entire recurring booking (all sessions) */
  cancelRecurringBooking: Booking;
  /** Cancel a single session of recurring booking */
  cancelRecurringSession: Booking;
  cancelScoreboardSession: ScoreboardSession;
  /** Cancel tournament */
  cancelTournament: Tournament;
  /** Cancel a pending request */
  cancelVenueRequest: VenueRequest;
  /** Cascade reschedule: shift all subsequent matches on the same court after anchor match */
  cascadeReschedule: CascadeRescheduleResult;
  /** Change password */
  changePassword: SuccessResponse;
  /** Check-in booking */
  checkIn: Booking;
  /** Check-in người chơi */
  checkInParticipant: PickupGameParticipant;
  /** Nhận mang dụng cụ */
  claimEquipment: PickupGame;
  /** Cleanup orphan Firebase user after failed registration */
  cleanupOrphanFirebaseUser: SuccessResponse;
  /** Clear conversation history */
  clearConversationHistory: Scalars['Boolean']['output'];
  /** Clear all read notifications */
  clearReadNotifications: Scalars['Int']['output'];
  /** Clear referee from match */
  clearReferee: TournamentMatch;
  /** Clear referee from multiple matches */
  clearRefereeFromMatches: Scalars['Int']['output'];
  /** Clear all seeds for a category */
  clearSeeds: SuccessResponse;
  /** Close registration */
  closeRegistration: Tournament;
  /** Complete booking */
  completeBooking: Booking;
  /** Complete order */
  completeOrder: Order;
  /** Kết thúc kèo thủ công */
  completePickupGame: PickupGame;
  /** Kết thúc set hiện tại (trọng tài xác nhận người thắng) */
  completeSet: MatchScorecard;
  /** Complete tournament */
  completeTournament: Tournament;
  /** Confirm booking */
  confirmBooking: BookingWithOrderPayload;
  /** Confirm draw and transition category to IN_PROGRESS */
  confirmDraw: SuccessResponse;
  /** Confirm email update after OTP verification */
  confirmEmailUpdate: SuccessResponse;
  /** Confirm a hold booking (staff) */
  confirmHoldBooking: BookingWithOrderPayload;
  /** Confirm order */
  confirmOrder: Order;
  /** Confirm pass transfer (owner confirms after receiving payment) */
  confirmPassTransfer: BookingPass;
  /** Confirm phone number update (ZNS phoneVerificationToken preferred; Firebase ID token fallback) */
  confirmPhoneUpdate: SuccessResponse;
  /** Confirm recurring booking (all sessions) */
  confirmRecurringBooking: BookingWithOrderPayload;
  /** BTC sửa kết quả trận đã kết thúc (khi vòng sau chưa đấu) */
  correctFinishedMatchResult: TournamentMatch;
  /** Create booking (customer) */
  createBooking: Booking;
  /** Create booking pass */
  createBookingPass: BookingPass;
  /** Create category in tournament */
  createCategory: TournamentCategory;
  /** Submit a claim request for an unclaimed venue */
  createClaimRequest: VenueClaimRequest;
  /** Create a comment on a post */
  createComment: PostComment;
  /** Create or get a conversation */
  createConversation: Conversation;
  /** Create court */
  createCourt: Court;
  /** Tạo kèo từ template */
  createGameFromTemplate: PickupGame;
  /** Tạo template */
  createGameTemplate: GameTemplate;
  /** Create a new group */
  createGroup: Group;
  /** Create a reservation hold booking (customer) */
  createHoldBooking: Booking;
  /** Create a new legal document (admin only) */
  createLegalDocument: LegalDocument;
  /** Create a notification (for testing purposes) */
  createNotification: Notification;
  /** Create order (customer) */
  createOrder: Order;
  /** Create OTP test phone (SUPER_ADMIN only) */
  createOtpTestPhone: OtpTestPhone;
  /** Create OTP test user login grant (SUPER_ADMIN only) */
  createOtpTestUserGrant: OtpTestUserGrant;
  /** Tạo kèo mới */
  createPickupGame: PickupGame;
  /** Tạo campaign mới */
  createPickupGameCampaign: PickupGameCampaign;
  /** Create a new post */
  createPost: Post;
  /** Create product */
  createProduct: Product;
  /** Create product category */
  createProductCategory: ProductCategory;
  /** Create a new promotion */
  createPromotion: Promotion;
  /** Create a new QR campaign (Admin only) */
  createQrCampaign: QrCampaign;
  /** Create recurring booking (customer). Supports single-day and multi-day bookings. */
  createRecurringBooking: Booking;
  /** Create a new referral code (Admin only) */
  createReferralCode: ReferralCode;
  /** Create scoreboard session */
  createScoreboardSession: ScoreboardSession;
  /** Create staff booking */
  createStaffBooking: BookingWithOrderPayload;
  /** Create staff order */
  createStaffOrder: Order;
  /** Create recurring booking by staff. Supports single-day and multi-day bookings. */
  createStaffRecurringBooking: BookingWithOrderPayload;
  /** Create a new tournament */
  createTournament: Tournament;
  /** Tạo venue do user submit từ flow Pass sân (UNCLAIMED, PENDING). Throttled 3/day/user. Auto-dedupe theo (name + city). */
  createUserSubmittedVenue: Venue;
  /** Create a new venue (request) */
  createVenue: Venue;
  /** Create a venue expense */
  createVenueExpense: VenueExpense;
  /** Create a new venue request */
  createVenueRequest: VenueRequest;
  /** Create venue review */
  createVenueReview: VenueReview;
  /** Decline a group invitation */
  declineInvitation: Scalars['Boolean']['output'];
  /** Decline pass (selected user or private transferee) */
  declinePass: BookingPass;
  /** Decline staff invitation */
  declineStaffInvitation: Scalars['Boolean']['output'];
  /** Delete user account */
  deleteAccount: SuccessResponse;
  /** Delete category */
  deleteCategory: SuccessResponse;
  /** Delete a comment */
  deleteComment: Scalars['Boolean']['output'];
  /** Delete conversation for user */
  deleteConversation: Scalars['Boolean']['output'];
  /** Delete court */
  deleteCourt: Scalars['Boolean']['output'];
  /** Xóa template */
  deleteGameTemplate: Scalars['Boolean']['output'];
  /** Delete a group (creator only) */
  deleteGroup: Scalars['Boolean']['output'];
  /** Delete a message */
  deleteMessage: Scalars['Boolean']['output'];
  /** Delete a message by admin (Admin only) */
  deleteMessageByAdmin: Scalars['Boolean']['output'];
  /** Delete a notification */
  deleteNotification: Scalars['Boolean']['output'];
  /** Delete a post */
  deletePost: Scalars['Boolean']['output'];
  /** Delete a post by admin (Admin only) */
  deletePostByAdmin: Scalars['Boolean']['output'];
  /** Delete product */
  deleteProduct: Scalars['Boolean']['output'];
  /** Delete product category */
  deleteProductCategory: Scalars['Boolean']['output'];
  /** Delete a promotion */
  deletePromotion: Scalars['Boolean']['output'];
  /** Delete registration (organizer only) */
  deleteRegistration: SuccessResponse;
  deleteScoreboardSession: Scalars['Boolean']['output'];
  /** Permanently delete a DRAFT tournament */
  deleteTournament: SuccessResponse;
  /** Delete venue */
  deleteVenue: Scalars['Boolean']['output'];
  /** Delete a venue expense */
  deleteVenueExpense: Scalars['Boolean']['output'];
  /** Delete venue review */
  deleteVenueReview: Scalars['Boolean']['output'];
  /** Duplicate product */
  duplicateProduct: Product;
  /** Duplicate a tournament (creates a copy in DRAFT with categories) */
  duplicateTournament: Tournament;
  /** Execute full draw: clear seeds, assign new seeds, generate bracket — all in one transaction */
  executeDraw: Array<TournamentMatch>;
  /** Express interest in a public pass */
  expressInterest: BookingPass;
  /** Kết thúc trận sớm: người dẫn điểm trong set hiện tại thắng trận, giữ nguyên tỷ số (không pad BO) */
  finishMatchEarly: MatchScorecard;
  /** Theo dõi host */
  followHost: FollowedHost;
  /** Follow a user */
  followUser: User;
  /** Super Admin only: reset confirmed draw back to DRAW_PENDING when no matches have started */
  forceRedraw: SuccessResponse;
  /** Forward a message */
  forwardMessage: Array<Message>;
  /** Generate bracket for category */
  generateBracket: Array<TournamentMatch>;
  /** Generate bracket from manual slot assignments (Single Elimination) */
  generateManualDraw: Array<TournamentMatch>;
  /** Grant portal capability to user (SUPER_ADMIN only) */
  grantPortalCapability: PortalCapabilityGrant;
  /** Import stock for a product */
  importStock: StockMovement;
  /** Atomically bump a post view count. Fire-and-forget from the client; returns the new view count or null if the post does not exist. */
  incrementPostView?: Maybe<Scalars['Int']['output']>;
  /** Invite a user to join a group (admin/mod only) */
  inviteMember: GroupMember;
  /** Invite a referee to the tournament (pool-level invite) */
  inviteRefereeToTournament: TournamentReferee;
  /** Mời người chơi vào kèo */
  inviteToGame: Scalars['Boolean']['output'];
  /** Kick a member from a group (creator only) */
  kickMember: Scalars['Boolean']['output'];
  /** Kick người chơi */
  kickParticipant: Scalars['Boolean']['output'];
  /** Rời kèo */
  leaveGame: Scalars['Boolean']['output'];
  /** Leave a group */
  leaveGroup: Scalars['Boolean']['output'];
  /** Like a comment */
  likeComment: PostComment;
  /** Like a post */
  likePost: Post;
  /** Mark all notifications as read (optionally filter by type) */
  markAllNotificationsAsRead: MarkAllAsReadResponse;
  /** Mark all messages in a group as read */
  markGroupMessagesAsRead: Scalars['Boolean']['output'];
  /** Mark messages as read */
  markMessagesAsRead: Scalars['Int']['output'];
  /** Đánh dấu MVP */
  markMvp: Scalars['Boolean']['output'];
  /** Mark booking as no-show */
  markNoShow: Booking;
  /** Mark notification action as taken (hides action buttons for actionable notifications) */
  markNotificationActionTaken: Notification;
  /** Mark a notification as read */
  markNotificationAsRead: Notification;
  /** Mark order as delivered */
  markOrderDelivered: Order;
  /** Mark order as in progress */
  markOrderInProgress: Order;
  /** Mark order as paid */
  markOrderPaid: Order;
  /** Mark order as partially paid */
  markOrderPartiallyPaid: Order;
  /** Mark order as preparing */
  markOrderPreparing: Order;
  /** Mark order as ready */
  markOrderReady: Order;
  /** Move match to new court/time with optional court repack */
  moveMatchWithCascade: MoveMatchResult;
  /** Move products to another venue */
  moveProductsToVenue: BulkOperationResult;
  /** Mute a conversation */
  muteConversation: Conversation;
  /** Open registration */
  openRegistration: Tournament;
  /** BTC huỷ trận đang LIVE và reset về NOT_STARTED */
  organizerAbortLiveMatch: TournamentMatch;
  /** BTC hiệu chỉnh tỉ số trận đang LIVE */
  organizerCorrectLiveScore: MatchScorecard;
  /** Pause a promotion */
  pausePromotion: Promotion;
  /** Pin a message in a conversation */
  pinMessage: Message;
  /** Process refund - mark order as refunded after actual refund is done (Owner only). Pass base64 images for refund proof. */
  processRefund: Order;
  /** Host đôn người chơi từ danh sách chờ */
  promoteFromWaitlist: Scalars['Boolean']['output'];
  /** Publish kèo nháp */
  publishPickupGame: PickupGame;
  /** Publish product */
  publishProduct: Product;
  /** Publish tournament (DRAFT -> PUBLISHED) */
  publishTournament: Tournament;
  /** Đánh giá người tham gia */
  rateParticipants: Scalars['Boolean']['output'];
  /** Đánh giá người chuyển pass sau khi giao dịch COMPLETED. Chỉ receiver mới được rate. */
  ratePassTransfer: TransferrerRating;
  /** Record a QR code scan event (Public - called by landing page) */
  recordQrScan: SuccessResponse;
  /** Record one venue detail view */
  recordVenueView: Scalars['Boolean']['output'];
  /** Refresh access token */
  refreshToken: AuthResponse;
  /** Register interest in a hold booking to get notified when it expires */
  registerBookingInterest: Scalars['Boolean']['output'];
  /** Register for tournament */
  registerForTournament: TournamentRegistration;
  /** Reject booking */
  rejectBooking: Booking;
  /** Reject a group join request (admin only) */
  rejectGroupJoinRequest: Scalars['Boolean']['output'];
  /** Reject a hold booking (staff) */
  rejectHoldBooking: Booking;
  /** Từ chối yêu cầu tham gia */
  rejectJoinRequest: Scalars['Boolean']['output'];
  /** Reject registration */
  rejectRegistration: TournamentRegistration;
  /** Reject a venue request (Admin only) */
  rejectVenueRequest: VenueRequest;
  /** Remove FCM token */
  removeFcmToken: Scalars['Boolean']['output'];
  /** Bỏ chặn người dùng */
  removeFromBlacklist: Scalars['Boolean']['output'];
  /** Xoá kèo khỏi campaign */
  removeGamesFromCampaign: PickupGameCampaign;
  /** Remove reaction from a group message */
  removeGroupMessageReaction: GroupMessage;
  /** Remove payment proof image from order */
  removePaymentProofImage: Order;
  /** Remove reaction from a message */
  removeReaction: Message;
  /** Remove referee from tournament (cascades to unassign from NOT_STARTED matches) */
  removeTournamentReferee: TournamentReferee;
  /** Remove staff member */
  removeVenueStaff: Scalars['Boolean']['output'];
  /** Tight repack: dồn liên tiếp các trận NOT_STARTED trên cùng sân/ngày */
  repackCourtSchedule: RepackCourtScheduleResult;
  /** Reply to review */
  replyToReview: VenueReview;
  /** Báo cáo một pass sân (anti-spam: không dup 24h, không self). */
  reportBookingPass: BookingPassReport;
  /** Report a message */
  reportMessage: MessageReport;
  /** Report a post */
  reportPost: PostReport;
  /** Report a user */
  reportUser: UserReport;
  /** Request email update (validates availability, sends OTP to new email) */
  requestEmailUpdate: EmailUpdateRequestResponse;
  /** Request confirmation for a hold booking (customer) */
  requestHoldConfirmation: Booking;
  /** Xin tham gia kèo */
  requestJoinGame: PickupGameParticipant;
  /** Request to join a group */
  requestJoinGroup: GroupMember;
  /** Request password reset (validates user exists, frontend sends OTP via Firebase) */
  requestPasswordReset: SuccessResponse;
  /** Request a phone OTP. Backend decides ZNS vs Firebase fallback. */
  requestPhoneOtp: RequestPhoneOtpResponse;
  /** Request phone number update (validates availability, frontend sends OTP) */
  requestPhoneUpdate: SuccessResponse;
  /** Reset bracket (delete all matches) */
  resetBracket: SuccessResponse;
  /** Reset password after OTP verification (ZNS phoneVerificationToken preferred; Firebase ID token fallback) */
  resetPassword: SuccessResponse;
  /** Referee responds to invite (accept or decline) */
  respondRefereeInvite: TournamentMatch;
  /** Referee responds to tournament-level invite */
  respondTournamentRefereeInvite: TournamentReferee;
  /** Process customer return */
  returnStock: StockMovement;
  /** [Admin] Xét báo cáo pass sân */
  reviewBookingPassReport: BookingPassReport;
  /** Review (approve/reject) a claim request - Admin only */
  reviewClaimRequest: VenueClaimRequest;
  /** Review promotion (owner approves/rejects) */
  reviewPromotion: Promotion;
  /** Revoke all login sessions except the current one */
  revokeOtherSessions: Scalars['Boolean']['output'];
  /** Revoke OTP test user login grant (SUPER_ADMIN only) */
  revokeOtpTestUserGrant: OtpTestUserGrant;
  /** Revoke portal capability grant (SUPER_ADMIN only) */
  revokePortalCapability: PortalCapabilityGrant;
  /** Revoke a specific login session (not the current one) */
  revokeSession: Scalars['Boolean']['output'];
  /** Save FCM token */
  saveFcmToken: Scalars['Boolean']['output'];
  /** Lưu kèo */
  saveGame: SavedGame;
  /** Schedule a match (returns match + conflict warnings) */
  scheduleMatch: ScheduleMatchResult;
  /** Score a point */
  scorePoint: MatchScorecard;
  /** Resume after interval / warmup */
  scoreboardAdvancePhase: ScoreboardSession;
  scoreboardCompleteSet: ScoreboardSession;
  scoreboardFinishMatchEarly: ScoreboardSession;
  scoreboardRecordFault: ScoreboardSession;
  scoreboardRecordLet: ScoreboardSession;
  scoreboardRetireSession: ScoreboardSession;
  scoreboardScorePoint: ScoreboardSession;
  /** Manually correct badminton doubles server/receiver */
  scoreboardSetBadmintonDoublesServer: ScoreboardSession;
  scoreboardSetServingPlayer: ScoreboardSession;
  scoreboardSwapCourtSides: ScoreboardSession;
  scoreboardUndoLastPoint: ScoreboardSession;
  scoreboardUpdateElapsed: ScoreboardSession;
  /** Seed knockout bracket from group stage results (GROUP_KNOCKOUT format only) */
  seedKnockoutBracket: Array<TournamentMatch>;
  /** Seed players in category */
  seedPlayers: SuccessResponse;
  /** Select interested user for pass (owner action) */
  selectInterestedUser: BookingPass;
  /** Send a message to a group */
  sendGroupMessage: GroupMessage;
  /** Send a message in a conversation */
  sendMessage: Message;
  /** Send notification to a topic (broadcast) */
  sendNotificationToTopic: SendNotificationResponse;
  /** Send notification to a specific user */
  sendNotificationToUser: SendNotificationResponse;
  /** Send notification to multiple users */
  sendNotificationToUsers: SendNotificationResponse;
  /** Send test notification to current user */
  sendTestNotification: SendNotificationResponse;
  /** Set typing status in a group */
  setGroupTypingStatus: Scalars['Boolean']['output'];
  /** BTC ghi nhận walkover */
  setMatchWalkover: TournamentMatch;
  /** Enable or disable OTP test phone (SUPER_ADMIN only) */
  setOtpTestPhoneEnabled: OtpTestPhone;
  /** VĐV bỏ cuộc giữa trận (chỉ khi trận đang LIVE) */
  setRetirement: TournamentMatch;
  /** Đặt lại người giao cầu (trọng tài) */
  setServingPlayer: MatchScorecard;
  /** Share a pickup game to multiple groups */
  shareGameToGroups: Scalars['Boolean']['output'];
  /** Login with email/phone and password */
  signIn: AuthResponse;
  /** Sign in with phone (ZNS phoneVerificationToken preferred; Firebase ID token fallback) */
  signInWithFirebase: AuthResponse;
  /** Logout current user */
  signOut: Scalars['Boolean']['output'];
  /** Logout from all devices */
  signOutAllDevices: Scalars['Boolean']['output'];
  /** Sign up with phone (ZNS phoneVerificationToken preferred; Firebase ID token fallback) */
  signUpWithFirebase: AuthResponse;
  /** Start a match and create scorecard */
  startMatch: MatchScorecard;
  /** Bắt đầu kèo thủ công */
  startPickupGame: PickupGame;
  /** Start a scheduled scoreboard session */
  startScoreboardSession: ScoreboardSession;
  /** Start tournament */
  startTournament: Tournament;
  /** Signal that user is typing */
  startTyping: Scalars['Boolean']['output'];
  /** Signal that user stopped typing */
  stopTyping: Scalars['Boolean']['output'];
  /** Submit a contact inquiry (public, rate-limited) */
  submitContactInquiry: SuccessResponse;
  /** Submit promotion for owner approval (staff action) */
  submitPromotionForApproval: Promotion;
  /** Subscribe user to a notification topic */
  subscribeUserToTopic: TopicSubscriptionResponse;
  /** Đảo bên trái/phải trên màn chấm điểm (trọng tài) */
  swapCourtSides: MatchScorecard;
  /** Toggle favorite venue */
  toggleFavoriteVenue: FavoriteResult;
  /** Toggle QR campaign active state (Admin only) */
  toggleQrCampaign: QrCampaign;
  /** Toggle referral code active state (Admin only) */
  toggleReferralCode: ReferralCode;
  /** Unarchive a conversation */
  unarchiveConversation: Conversation;
  /** Unblock a user */
  unblockUser: Scalars['Boolean']['output'];
  /** Remove bookmark from a post */
  unbookmarkPost: Scalars['Boolean']['output'];
  /** Hủy nhận dụng cụ */
  unclaimEquipment: PickupGame;
  /** Undo last point */
  undoLastPoint: MatchScorecard;
  /** Bỏ theo dõi host */
  unfollowHost: Scalars['Boolean']['output'];
  /** Unfollow a user */
  unfollowUser: User;
  /** Unlike a comment */
  unlikeComment: PostComment;
  /** Unlike a post */
  unlikePost: Post;
  /** Unmute a conversation */
  unmuteConversation: Conversation;
  /** Unpin a message */
  unpinMessage: Message;
  /** Unpublish product */
  unpublishProduct: Product;
  /** Unregister interest in a hold booking */
  unregisterBookingInterest: Scalars['Boolean']['output'];
  /** Bỏ lưu kèo */
  unsaveGame: Scalars['Boolean']['output'];
  /** Remove schedule from match */
  unscheduleMatch: TournamentMatch;
  /** Unsubscribe user from a notification topic */
  unsubscribeUserFromTopic: TopicSubscriptionResponse;
  /** Update acquisition source (how user discovered platform). Only works once per user. */
  updateAcquisitionSource: Scalars['Boolean']['output'];
  /** Update category */
  updateCategory: TournamentCategory;
  /** Update a comment */
  updateComment: PostComment;
  /** Update contact inquiry status (Admin only) */
  updateContactInquiryStatus: ContactInquiry;
  /** Update court */
  updateCourt: Court;
  /** Cập nhật template */
  updateGameTemplate: GameTemplate;
  /** Update a group (admin only) */
  updateGroup: Group;
  /** Update a legal document (admin only) */
  updateLegalDocument: LegalDocument;
  /** BTC ghi đè kết quả trận chưa kết thúc */
  updateMatchResult: MatchScorecard;
  /** Update a message */
  updateMessage: Message;
  /** Update message report status (Admin only) */
  updateMessageReportStatus: MessageReport;
  /** Update internal note */
  updateOrderInternalNote: Order;
  /** Update order payment status */
  updateOrderPaymentStatus: Order;
  /** Update order status */
  updateOrderStatus: Order;
  /** Update OTP test phone (SUPER_ADMIN only) */
  updateOtpTestPhone: OtpTestPhone;
  /** Cập nhật trạng thái đặt cọc */
  updateParticipantDeposit: PickupGameParticipant;
  /** Cập nhật trạng thái thanh toán */
  updateParticipantPayment: PickupGameParticipant;
  /** Update payment status */
  updatePaymentStatus: TournamentRegistration;
  /** Cập nhật kèo */
  updatePickupGame: PickupGame;
  /** Cập nhật campaign */
  updatePickupGameCampaign: PickupGameCampaign;
  /** Update a post */
  updatePost: Post;
  /** Update product */
  updateProduct: Product;
  /** Update product category */
  updateProductCategory: ProductCategory;
  /** Update user profile */
  updateProfile: User;
  /** Update a promotion */
  updatePromotion: Promotion;
  /** Update an existing QR campaign (Admin only) */
  updateQrCampaign: QrCampaign;
  /** Update an existing referral code (Admin only) */
  updateReferralCode: ReferralCode;
  /** Update bib number (SBD) for a registration (organizer only) */
  updateRegistrationBibNumber: TournamentRegistration;
  /** Update report status (Admin only) */
  updateReportStatus: PostReport;
  /** Update tournament details. DRAFT/PUBLISHED: all fields. REGISTRATION_OPEN/CLOSED: courts and scheduleConfig only. IN_PROGRESS+: blocked. */
  updateTournament: Tournament;
  /** Update tournament referee settings */
  updateTournamentReferee: TournamentReferee;
  /** Update user report status (Admin only) */
  updateUserReportStatus: UserReport;
  /** Update venue */
  updateVenue: Venue;
  /** Update a venue expense */
  updateVenueExpense: VenueExpense;
  /** Update venue order type configurations */
  updateVenueOrderTypeConfigs: Venue;
  /** Update venue review */
  updateVenueReview: VenueReview;
  /** Update staff permissions (owner only) */
  updateVenueStaffPermissions: VenueStaff;
  /** Update staff custom title */
  updateVenueStaffTitle: VenueStaff;
  /** Upload avatar image; persists both legacy photoURL and the new structured `avatar` (with blurhash + variants). */
  uploadAvatar: UploadResponse;
  /** Upload media for chat messages */
  uploadChatMedia: ChatMediaUploadResult;
  /** Upload cover photo and update user coverPhotoURL */
  uploadCoverPhoto: UploadResponse;
  /** Upload group chat image and return URL */
  uploadGroupChatImage: UploadPostMediaResponse;
  /** Upload group cover image and return URL */
  uploadGroupCover: UploadPostMediaResponse;
  /** Upload payment proof image for online payment orders */
  uploadPaymentProof: Order;
  /** Upload post media image and return URL */
  uploadPostMedia: UploadPostMediaResponse;
  /** Upload + process an image (blurhash + thumbnail + medium variants). */
  uploadProcessedImage: ImageMedia;
  /** Upload product image and return URL */
  uploadProductImage: UploadPostMediaResponse;
  /** Upload tournament image (QR code, banner, etc.) and return URL */
  uploadTournamentImage: UploadPostMediaResponse;
  /** Upload venue image and return URL */
  uploadVenueImage: UploadPostMediaResponse;
  /** Upload venue request image and return URL */
  uploadVenueRequestImage: UploadPostMediaResponse;
  /** Verify OTP code for email verification, password reset, etc. */
  verifyOtp: OtpResponse;
  /** Verify a phone OTP (ZNS path). Returns a short-lived phoneVerificationToken. */
  verifyPhoneOtp: VerifyPhoneOtpResponse;
};


export type MutationAcceptInvitationArgs = {
  groupId: Scalars['ID']['input'];
};


export type MutationAcceptLegalDocumentsArgs = {
  input: AcceptLegalDocumentsInput;
};


export type MutationAcceptPassArgs = {
  passId: Scalars['ID']['input'];
  paymentProofImages?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationAcceptStaffInvitationArgs = {
  venueId: Scalars['ID']['input'];
};


export type MutationActivateLegalDocumentVersionArgs = {
  documentId: Scalars['ID']['input'];
};


export type MutationActivatePromotionArgs = {
  promotionId: Scalars['ID']['input'];
};


export type MutationAddGamesToCampaignArgs = {
  input: AddGamesToCampaignInput;
};


export type MutationAddGroupMessageReactionArgs = {
  input: AddGroupMessageReactionInput;
};


export type MutationAddItemsToBookingArgs = {
  bookingId: Scalars['ID']['input'];
  items: Array<OrderItemInput>;
};


export type MutationAddLateEntryToByeSlotArgs = {
  input: AddLateEntryToByeSlotInput;
};


export type MutationAddReactionArgs = {
  input: AddReactionInput;
};


export type MutationAddToBlacklistArgs = {
  reason?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};


export type MutationAddVenueStaffArgs = {
  customTitle?: InputMaybe<Scalars['String']['input']>;
  permissions: Array<VenueAction>;
  userId: Scalars['ID']['input'];
  venueId: Scalars['ID']['input'];
};


export type MutationAdjustStockArgs = {
  input: AdjustStockInput;
  venueId: Scalars['ID']['input'];
};


export type MutationAdminApproveVenueArgs = {
  venueId: Scalars['ID']['input'];
};


export type MutationAdminChangeUserRoleArgs = {
  role: UserRole;
  userId: Scalars['ID']['input'];
};


export type MutationAdminCreateUserArgs = {
  input: AdminCreateUserInput;
};


export type MutationAdminProvisionPlayerArgs = {
  input: AdminProvisionPlayerInput;
};


export type MutationAdminRejectVenueArgs = {
  reason?: InputMaybe<Scalars['String']['input']>;
  venueId: Scalars['ID']['input'];
};


export type MutationAdminResetUserPasswordArgs = {
  input: AdminResetUserPasswordInput;
};


export type MutationAdminSuspendUserArgs = {
  reason?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};


export type MutationAdminSuspendVenueArgs = {
  reason?: InputMaybe<Scalars['String']['input']>;
  venueId: Scalars['ID']['input'];
};


export type MutationAdminUnsuspendUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationApproveGroupJoinRequestArgs = {
  groupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationApproveHoldBookingArgs = {
  input: ApproveHoldBookingInput;
};


export type MutationApproveJoinRequestArgs = {
  input: ApproveParticipantInput;
};


export type MutationApproveRegistrationArgs = {
  input: ApproveRegistrationInput;
};


export type MutationApproveVenueRequestArgs = {
  adminNote?: InputMaybe<Scalars['String']['input']>;
  requestId: Scalars['ID']['input'];
};


export type MutationArchiveConversationArgs = {
  conversationId: Scalars['ID']['input'];
};


export type MutationAssignRefereeArgs = {
  input: AssignRefereeInput;
};


export type MutationAssignRefereeToCourtArgs = {
  input: AssignRefereeToCourtInput;
};


export type MutationAutoAssignRefereesArgs = {
  input: AutoAssignRefereesInput;
};


export type MutationAutoScheduleMatchesArgs = {
  input: AutoScheduleInput;
};


export type MutationAutoSeedPlayersArgs = {
  categoryId: Scalars['ID']['input'];
  count: Scalars['Int']['input'];
};


export type MutationBanMemberArgs = {
  groupId: Scalars['ID']['input'];
  targetUserId: Scalars['ID']['input'];
};


export type MutationBlockUserArgs = {
  input: BlockUserInput;
};


export type MutationBookmarkPostArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationBulkApproveRegistrationsArgs = {
  input: BulkRegistrationActionInput;
};


export type MutationBulkAssignRefereeArgs = {
  input: BulkAssignRefereeInput;
};


export type MutationBulkCheckInArgs = {
  input: BulkCheckInInput;
};


export type MutationBulkDeleteProductsArgs = {
  input: BulkDeleteProductsInput;
};


export type MutationBulkDeleteRegistrationsArgs = {
  input: BulkRegistrationActionInput;
};


export type MutationBulkImportRegistrationsArgs = {
  input: BulkImportRegistrationsInput;
};


export type MutationBulkRejectRegistrationsArgs = {
  input: BulkRegistrationActionInput;
};


export type MutationBulkScheduleMatchesArgs = {
  input: BulkScheduleMatchInput;
};


export type MutationBulkUnscheduleByDateArgs = {
  input: BulkUnscheduleByDateInput;
};


export type MutationBulkUpdateDisplayOrderArgs = {
  input: BulkUpdateDisplayOrderInput;
};


export type MutationBulkUpdateProductStatusArgs = {
  input: BulkUpdateStatusInput;
};


export type MutationCancelBookingArgs = {
  bookingId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCancelBookingPassArgs = {
  passId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCancelClaimRequestArgs = {
  claimRequestId: Scalars['ID']['input'];
};


export type MutationCancelHoldBookingArgs = {
  input: CancelHoldBookingInput;
};


export type MutationCancelInvitationArgs = {
  groupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCancelOrderArgs = {
  orderId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCancelOrderWithRefundArgs = {
  orderId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
  refundNote?: InputMaybe<Scalars['String']['input']>;
  refundPercent?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationCancelPickupGameArgs = {
  input: CancelPickupGameInput;
};


export type MutationCancelPromotionArgs = {
  promotionId: Scalars['ID']['input'];
};


export type MutationCancelRecurringBookingArgs = {
  masterBookingId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCancelRecurringSessionArgs = {
  reason?: InputMaybe<Scalars['String']['input']>;
  sessionBookingId: Scalars['ID']['input'];
};


export type MutationCancelScoreboardSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationCancelTournamentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelVenueRequestArgs = {
  requestId: Scalars['ID']['input'];
};


export type MutationCascadeRescheduleArgs = {
  input: CascadeRescheduleInput;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationCheckInArgs = {
  bookingId: Scalars['ID']['input'];
};


export type MutationCheckInParticipantArgs = {
  input: CheckInParticipantInput;
};


export type MutationClaimEquipmentArgs = {
  input: ClaimEquipmentInput;
};


export type MutationCleanupOrphanFirebaseUserArgs = {
  idToken: Scalars['String']['input'];
};


export type MutationClearConversationHistoryArgs = {
  conversationId: Scalars['ID']['input'];
};


export type MutationClearRefereeArgs = {
  matchId: Scalars['ID']['input'];
};


export type MutationClearRefereeFromMatchesArgs = {
  matchIds: Array<Scalars['ID']['input']>;
  tournamentId: Scalars['ID']['input'];
};


export type MutationClearSeedsArgs = {
  categoryId: Scalars['ID']['input'];
};


export type MutationCloseRegistrationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCompleteBookingArgs = {
  bookingId: Scalars['ID']['input'];
};


export type MutationCompleteOrderArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationCompletePickupGameArgs = {
  gameId: Scalars['ID']['input'];
};


export type MutationCompleteSetArgs = {
  input: CompleteSetInput;
};


export type MutationCompleteTournamentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationConfirmBookingArgs = {
  bookingId: Scalars['ID']['input'];
};


export type MutationConfirmDrawArgs = {
  categoryId: Scalars['ID']['input'];
};


export type MutationConfirmEmailUpdateArgs = {
  input: ConfirmEmailUpdateInput;
};


export type MutationConfirmHoldBookingArgs = {
  bookingId: Scalars['ID']['input'];
  paymentMethod?: InputMaybe<PaymentMethod>;
};


export type MutationConfirmOrderArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationConfirmPassTransferArgs = {
  passId: Scalars['ID']['input'];
};


export type MutationConfirmPhoneUpdateArgs = {
  input: ConfirmPhoneUpdateInput;
};


export type MutationConfirmRecurringBookingArgs = {
  masterBookingId: Scalars['ID']['input'];
};


export type MutationCorrectFinishedMatchResultArgs = {
  input: CorrectFinishedMatchResultInput;
};


export type MutationCreateBookingArgs = {
  input: CreateBookingInput;
};


export type MutationCreateBookingPassArgs = {
  input: CreateBookingPassInput;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateClaimRequestArgs = {
  input: CreateClaimRequestInput;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreateConversationArgs = {
  input: CreateConversationInput;
};


export type MutationCreateCourtArgs = {
  input: CreateCourtInput;
};


export type MutationCreateGameFromTemplateArgs = {
  input: CreateGameFromTemplateInput;
};


export type MutationCreateGameTemplateArgs = {
  input: CreateTemplateInput;
};


export type MutationCreateGroupArgs = {
  input: CreateGroupInput;
};


export type MutationCreateHoldBookingArgs = {
  input: CreateHoldBookingInput;
};


export type MutationCreateLegalDocumentArgs = {
  input: CreateLegalDocumentInput;
};


export type MutationCreateNotificationArgs = {
  input: CreateNotificationInput;
};


export type MutationCreateOrderArgs = {
  input: CreateOrderInput;
};


export type MutationCreateOtpTestPhoneArgs = {
  input: CreateOtpTestPhoneInput;
};


export type MutationCreateOtpTestUserGrantArgs = {
  input: CreateOtpTestUserGrantInput;
};


export type MutationCreatePickupGameArgs = {
  input: CreatePickupGameInput;
};


export type MutationCreatePickupGameCampaignArgs = {
  input: CreatePickupGameCampaignInput;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationCreateProductCategoryArgs = {
  input: CreateProductCategoryInput;
};


export type MutationCreatePromotionArgs = {
  input: CreatePromotionInput;
};


export type MutationCreateQrCampaignArgs = {
  input: CreateQrCampaignInput;
};


export type MutationCreateRecurringBookingArgs = {
  input: CreateRecurringBookingInput;
};


export type MutationCreateReferralCodeArgs = {
  input: CreateReferralCodeInput;
};


export type MutationCreateScoreboardSessionArgs = {
  input: CreateScoreboardSessionInput;
};


export type MutationCreateStaffBookingArgs = {
  input: CreateStaffBookingInput;
};


export type MutationCreateStaffOrderArgs = {
  input: CreateOrderInput;
};


export type MutationCreateStaffRecurringBookingArgs = {
  input: CreateStaffRecurringBookingInput;
};


export type MutationCreateTournamentArgs = {
  input: CreateTournamentInput;
};


export type MutationCreateUserSubmittedVenueArgs = {
  input: CreateUserSubmittedVenueInput;
};


export type MutationCreateVenueArgs = {
  input: CreateVenueInput;
};


export type MutationCreateVenueExpenseArgs = {
  input: CreateVenueExpenseInput;
};


export type MutationCreateVenueRequestArgs = {
  input: CreateVenueRequestInput;
};


export type MutationCreateVenueReviewArgs = {
  bookingId?: InputMaybe<Scalars['ID']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  rating: Scalars['Float']['input'];
  venueId: Scalars['ID']['input'];
};


export type MutationDeclineInvitationArgs = {
  groupId: Scalars['ID']['input'];
};


export type MutationDeclinePassArgs = {
  passId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeclineStaffInvitationArgs = {
  venueId: Scalars['ID']['input'];
};


export type MutationDeleteAccountArgs = {
  password: Scalars['String']['input'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCommentArgs = {
  commentId: Scalars['ID']['input'];
};


export type MutationDeleteConversationArgs = {
  conversationId: Scalars['ID']['input'];
};


export type MutationDeleteCourtArgs = {
  courtId: Scalars['ID']['input'];
};


export type MutationDeleteGameTemplateArgs = {
  templateId: Scalars['ID']['input'];
};


export type MutationDeleteGroupArgs = {
  groupId: Scalars['ID']['input'];
};


export type MutationDeleteMessageArgs = {
  messageId: Scalars['ID']['input'];
};


export type MutationDeleteMessageByAdminArgs = {
  messageId: Scalars['ID']['input'];
};


export type MutationDeleteNotificationArgs = {
  notificationId: Scalars['ID']['input'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationDeletePostByAdminArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  productId: Scalars['ID']['input'];
};


export type MutationDeleteProductCategoryArgs = {
  categoryId: Scalars['ID']['input'];
};


export type MutationDeletePromotionArgs = {
  promotionId: Scalars['ID']['input'];
};


export type MutationDeleteRegistrationArgs = {
  input: DeleteRegistrationInput;
};


export type MutationDeleteScoreboardSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationDeleteTournamentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVenueArgs = {
  venueId: Scalars['ID']['input'];
};


export type MutationDeleteVenueExpenseArgs = {
  expenseId: Scalars['ID']['input'];
};


export type MutationDeleteVenueReviewArgs = {
  reviewId: Scalars['ID']['input'];
};


export type MutationDuplicateProductArgs = {
  productId: Scalars['ID']['input'];
};


export type MutationDuplicateTournamentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationExecuteDrawArgs = {
  input: ExecuteDrawInput;
};


export type MutationExpressInterestArgs = {
  message?: InputMaybe<Scalars['String']['input']>;
  passId: Scalars['ID']['input'];
};


export type MutationFinishMatchEarlyArgs = {
  input: FinishMatchEarlyInput;
};


export type MutationFollowHostArgs = {
  hostId: Scalars['ID']['input'];
};


export type MutationFollowUserArgs = {
  userId: Scalars['String']['input'];
};


export type MutationForceRedrawArgs = {
  categoryId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationForwardMessageArgs = {
  input: ForwardMessageInput;
};


export type MutationGenerateBracketArgs = {
  input: GenerateBracketInput;
};


export type MutationGenerateManualDrawArgs = {
  input: GenerateManualDrawInput;
};


export type MutationGrantPortalCapabilityArgs = {
  input: GrantPortalCapabilityInput;
};


export type MutationImportStockArgs = {
  input: ImportStockInput;
  venueId: Scalars['ID']['input'];
};


export type MutationIncrementPostViewArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationInviteMemberArgs = {
  groupId: Scalars['ID']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};


export type MutationInviteRefereeToTournamentArgs = {
  input: InviteRefereeInput;
};


export type MutationInviteToGameArgs = {
  gameId: Scalars['ID']['input'];
  userIds: Array<Scalars['ID']['input']>;
};


export type MutationKickMemberArgs = {
  groupId: Scalars['ID']['input'];
  targetUserId: Scalars['ID']['input'];
};


export type MutationKickParticipantArgs = {
  input: KickParticipantInput;
};


export type MutationLeaveGameArgs = {
  gameId: Scalars['ID']['input'];
};


export type MutationLeaveGroupArgs = {
  groupId: Scalars['ID']['input'];
};


export type MutationLikeCommentArgs = {
  commentId: Scalars['ID']['input'];
};


export type MutationLikePostArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationMarkAllNotificationsAsReadArgs = {
  type?: InputMaybe<NotificationType>;
};


export type MutationMarkGroupMessagesAsReadArgs = {
  groupId: Scalars['ID']['input'];
};


export type MutationMarkMessagesAsReadArgs = {
  conversationId: Scalars['ID']['input'];
};


export type MutationMarkMvpArgs = {
  input: MarkMvpInput;
};


export type MutationMarkNoShowArgs = {
  bookingId: Scalars['ID']['input'];
};


export type MutationMarkNotificationActionTakenArgs = {
  notificationId: Scalars['ID']['input'];
};


export type MutationMarkNotificationAsReadArgs = {
  notificationId: Scalars['ID']['input'];
};


export type MutationMarkOrderDeliveredArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationMarkOrderInProgressArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationMarkOrderPaidArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationMarkOrderPartiallyPaidArgs = {
  orderId: Scalars['ID']['input'];
  paidAmount: Scalars['Int']['input'];
};


export type MutationMarkOrderPreparingArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationMarkOrderReadyArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationMoveMatchWithCascadeArgs = {
  input: MoveMatchInput;
};


export type MutationMoveProductsToVenueArgs = {
  input: TransferProductsInput;
};


export type MutationMuteConversationArgs = {
  conversationId: Scalars['ID']['input'];
};


export type MutationOpenRegistrationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationOrganizerAbortLiveMatchArgs = {
  input: OrganizerAbortLiveMatchInput;
};


export type MutationOrganizerCorrectLiveScoreArgs = {
  input: OrganizerCorrectLiveScoreInput;
};


export type MutationPausePromotionArgs = {
  promotionId: Scalars['ID']['input'];
};


export type MutationPinMessageArgs = {
  input: PinMessageInput;
};


export type MutationProcessRefundArgs = {
  orderId: Scalars['ID']['input'];
  refundNote?: InputMaybe<Scalars['String']['input']>;
  refundProofBase64Images?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationPromoteFromWaitlistArgs = {
  gameId: Scalars['ID']['input'];
  participantId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationPublishPickupGameArgs = {
  gameId: Scalars['ID']['input'];
};


export type MutationPublishProductArgs = {
  productId: Scalars['ID']['input'];
};


export type MutationPublishTournamentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRateParticipantsArgs = {
  input: RateParticipantsInput;
};


export type MutationRatePassTransferArgs = {
  input: RatePassTransferInput;
};


export type MutationRecordQrScanArgs = {
  input: RecordQrScanInput;
  redirectedTo: QrRedirectTarget;
};


export type MutationRecordVenueViewArgs = {
  venueId: Scalars['ID']['input'];
};


export type MutationRegisterBookingInterestArgs = {
  bookingId: Scalars['ID']['input'];
};


export type MutationRegisterForTournamentArgs = {
  input: RegisterTournamentInput;
};


export type MutationRejectBookingArgs = {
  bookingId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRejectGroupJoinRequestArgs = {
  groupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRejectHoldBookingArgs = {
  bookingId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRejectJoinRequestArgs = {
  input: RejectParticipantInput;
};


export type MutationRejectRegistrationArgs = {
  input: RejectRegistrationInput;
};


export type MutationRejectVenueRequestArgs = {
  rejectionReason: Scalars['String']['input'];
  requestId: Scalars['ID']['input'];
};


export type MutationRemoveFcmTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationRemoveFromBlacklistArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationRemoveGamesFromCampaignArgs = {
  input: RemoveGamesFromCampaignInput;
};


export type MutationRemoveGroupMessageReactionArgs = {
  input: RemoveGroupMessageReactionInput;
};


export type MutationRemovePaymentProofImageArgs = {
  imageUrl: Scalars['String']['input'];
  orderId: Scalars['ID']['input'];
};


export type MutationRemoveReactionArgs = {
  input: RemoveReactionInput;
};


export type MutationRemoveTournamentRefereeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveVenueStaffArgs = {
  userId: Scalars['ID']['input'];
  venueId: Scalars['ID']['input'];
};


export type MutationRepackCourtScheduleArgs = {
  input: RepackCourtScheduleInput;
};


export type MutationReplyToReviewArgs = {
  reply: Scalars['String']['input'];
  reviewId: Scalars['ID']['input'];
};


export type MutationReportBookingPassArgs = {
  input: ReportBookingPassInput;
};


export type MutationReportMessageArgs = {
  input: ReportMessageInput;
};


export type MutationReportPostArgs = {
  input: ReportPostInput;
};


export type MutationReportUserArgs = {
  input: ReportUserInput;
};


export type MutationRequestEmailUpdateArgs = {
  input: RequestEmailUpdateInput;
};


export type MutationRequestHoldConfirmationArgs = {
  bookingId: Scalars['ID']['input'];
};


export type MutationRequestJoinGameArgs = {
  input: JoinGameInput;
};


export type MutationRequestJoinGroupArgs = {
  groupId: Scalars['ID']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRequestPasswordResetArgs = {
  emailOrPhone: Scalars['String']['input'];
};


export type MutationRequestPhoneOtpArgs = {
  input: RequestPhoneOtpInput;
};


export type MutationRequestPhoneUpdateArgs = {
  input: RequestPhoneUpdateInput;
};


export type MutationResetBracketArgs = {
  categoryId: Scalars['ID']['input'];
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationRespondRefereeInviteArgs = {
  input: RespondRefereeInviteInput;
};


export type MutationRespondTournamentRefereeInviteArgs = {
  input: RespondTournamentRefereeInviteInput;
};


export type MutationReturnStockArgs = {
  input: ReturnStockInput;
  venueId: Scalars['ID']['input'];
};


export type MutationReviewBookingPassReportArgs = {
  input: ReviewBookingPassReportInput;
};


export type MutationReviewClaimRequestArgs = {
  input: ReviewClaimRequestInput;
};


export type MutationReviewPromotionArgs = {
  input: ReviewPromotionInput;
};


export type MutationRevokeOtpTestUserGrantArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRevokePortalCapabilityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRevokeSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationSaveFcmTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationSaveGameArgs = {
  gameId: Scalars['ID']['input'];
};


export type MutationScheduleMatchArgs = {
  input: ScheduleMatchInput;
};


export type MutationScorePointArgs = {
  input: ScorePointInput;
};


export type MutationScoreboardAdvancePhaseArgs = {
  input: ScoreboardSessionIdInput;
};


export type MutationScoreboardCompleteSetArgs = {
  input: ScoreboardSessionIdInput;
};


export type MutationScoreboardFinishMatchEarlyArgs = {
  input: ScoreboardSessionIdInput;
};


export type MutationScoreboardRecordFaultArgs = {
  input: ScoreboardRecordFaultInput;
};


export type MutationScoreboardRecordLetArgs = {
  input: ScoreboardSessionIdInput;
};


export type MutationScoreboardRetireSessionArgs = {
  input: ScoreboardRetireInput;
};


export type MutationScoreboardScorePointArgs = {
  input: ScoreboardScorePointInput;
};


export type MutationScoreboardSetBadmintonDoublesServerArgs = {
  input: ScoreboardSetBadmintonDoublesServerInput;
};


export type MutationScoreboardSetServingPlayerArgs = {
  input: ScoreboardSetServingPlayerInput;
};


export type MutationScoreboardSwapCourtSidesArgs = {
  input: ScoreboardSessionIdInput;
};


export type MutationScoreboardUndoLastPointArgs = {
  input: ScoreboardSessionIdInput;
};


export type MutationScoreboardUpdateElapsedArgs = {
  input: ScoreboardUpdateElapsedInput;
};


export type MutationSeedKnockoutBracketArgs = {
  categoryId: Scalars['ID']['input'];
};


export type MutationSeedPlayersArgs = {
  input: SeedPlayersInput;
};


export type MutationSelectInterestedUserArgs = {
  passId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationSendGroupMessageArgs = {
  input: SendGroupMessageInput;
};


export type MutationSendMessageArgs = {
  input: SendMessageInput;
};


export type MutationSendNotificationToTopicArgs = {
  input: SendNotificationToTopicInput;
};


export type MutationSendNotificationToUserArgs = {
  input: SendNotificationToUserInput;
};


export type MutationSendNotificationToUsersArgs = {
  input: SendNotificationToUsersInput;
};


export type MutationSetGroupTypingStatusArgs = {
  groupId: Scalars['ID']['input'];
  isTyping: Scalars['Boolean']['input'];
};


export type MutationSetMatchWalkoverArgs = {
  input: SetMatchWalkoverInput;
};


export type MutationSetOtpTestPhoneEnabledArgs = {
  enabled: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
};


export type MutationSetRetirementArgs = {
  input: SetRetirementInput;
};


export type MutationSetServingPlayerArgs = {
  input: SetServingPlayerInput;
};


export type MutationShareGameToGroupsArgs = {
  input: ShareGameToGroupsInput;
};


export type MutationSignInArgs = {
  input: SignInInput;
};


export type MutationSignInWithFirebaseArgs = {
  input: FirebaseSignInInput;
};


export type MutationSignUpWithFirebaseArgs = {
  input: FirebaseSignUpInput;
};


export type MutationStartMatchArgs = {
  input: StartMatchInput;
};


export type MutationStartPickupGameArgs = {
  gameId: Scalars['ID']['input'];
};


export type MutationStartScoreboardSessionArgs = {
  input: StartScoreboardSessionInput;
};


export type MutationStartTournamentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationStartTypingArgs = {
  conversationId: Scalars['ID']['input'];
};


export type MutationStopTypingArgs = {
  conversationId: Scalars['ID']['input'];
};


export type MutationSubmitContactInquiryArgs = {
  input: SubmitContactInquiryInput;
};


export type MutationSubmitPromotionForApprovalArgs = {
  promotionId: Scalars['ID']['input'];
};


export type MutationSubscribeUserToTopicArgs = {
  topic: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationSwapCourtSidesArgs = {
  input: SwapCourtSidesInput;
};


export type MutationToggleFavoriteVenueArgs = {
  venueId: Scalars['ID']['input'];
};


export type MutationToggleQrCampaignArgs = {
  id: Scalars['ID']['input'];
  isActive: Scalars['Boolean']['input'];
};


export type MutationToggleReferralCodeArgs = {
  id: Scalars['ID']['input'];
  isActive: Scalars['Boolean']['input'];
};


export type MutationUnarchiveConversationArgs = {
  conversationId: Scalars['ID']['input'];
};


export type MutationUnblockUserArgs = {
  input: UnblockUserInput;
};


export type MutationUnbookmarkPostArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationUnclaimEquipmentArgs = {
  input: ClaimEquipmentInput;
};


export type MutationUndoLastPointArgs = {
  matchId: Scalars['ID']['input'];
};


export type MutationUnfollowHostArgs = {
  hostId: Scalars['ID']['input'];
};


export type MutationUnfollowUserArgs = {
  userId: Scalars['String']['input'];
};


export type MutationUnlikeCommentArgs = {
  commentId: Scalars['ID']['input'];
};


export type MutationUnlikePostArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationUnmuteConversationArgs = {
  conversationId: Scalars['ID']['input'];
};


export type MutationUnpinMessageArgs = {
  input: UnpinMessageInput;
};


export type MutationUnpublishProductArgs = {
  productId: Scalars['ID']['input'];
};


export type MutationUnregisterBookingInterestArgs = {
  bookingId: Scalars['ID']['input'];
};


export type MutationUnsaveGameArgs = {
  gameId: Scalars['ID']['input'];
};


export type MutationUnscheduleMatchArgs = {
  matchId: Scalars['ID']['input'];
};


export type MutationUnsubscribeUserFromTopicArgs = {
  topic: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationUpdateAcquisitionSourceArgs = {
  source: AcquisitionSource;
};


export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
};


export type MutationUpdateCommentArgs = {
  commentId: Scalars['ID']['input'];
  input: UpdateCommentInput;
};


export type MutationUpdateContactInquiryStatusArgs = {
  id: Scalars['ID']['input'];
  input: UpdateInquiryStatusInput;
};


export type MutationUpdateCourtArgs = {
  input: UpdateCourtInput;
};


export type MutationUpdateGameTemplateArgs = {
  input: UpdateTemplateInput;
};


export type MutationUpdateGroupArgs = {
  input: UpdateGroupInput;
};


export type MutationUpdateLegalDocumentArgs = {
  input: UpdateLegalDocumentInput;
};


export type MutationUpdateMatchResultArgs = {
  input: ManualMatchResultInput;
};


export type MutationUpdateMessageArgs = {
  input: UpdateMessageInput;
};


export type MutationUpdateMessageReportStatusArgs = {
  input: UpdateMessageReportStatusInput;
};


export type MutationUpdateOrderInternalNoteArgs = {
  internalNote: Scalars['String']['input'];
  orderId: Scalars['ID']['input'];
};


export type MutationUpdateOrderPaymentStatusArgs = {
  orderId: Scalars['ID']['input'];
  paymentStatus: OrderPaymentStatus;
};


export type MutationUpdateOrderStatusArgs = {
  orderId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  status: OrderStatus;
};


export type MutationUpdateOtpTestPhoneArgs = {
  id: Scalars['ID']['input'];
  input: UpdateOtpTestPhoneInput;
};


export type MutationUpdateParticipantDepositArgs = {
  input: UpdateParticipantDepositInput;
};


export type MutationUpdateParticipantPaymentArgs = {
  input: UpdateParticipantPaymentInput;
};


export type MutationUpdatePaymentStatusArgs = {
  input: UpdatePaymentStatusInput;
};


export type MutationUpdatePickupGameArgs = {
  input: UpdatePickupGameInput;
};


export type MutationUpdatePickupGameCampaignArgs = {
  campaignId: Scalars['ID']['input'];
  input: UpdatePickupGameCampaignInput;
};


export type MutationUpdatePostArgs = {
  input: UpdatePostInput;
  postId: Scalars['ID']['input'];
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationUpdateProductCategoryArgs = {
  input: UpdateProductCategoryInput;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdatePromotionArgs = {
  input: UpdatePromotionInput;
};


export type MutationUpdateQrCampaignArgs = {
  id: Scalars['ID']['input'];
  input: UpdateQrCampaignInput;
};


export type MutationUpdateReferralCodeArgs = {
  id: Scalars['ID']['input'];
  input: UpdateReferralCodeInput;
};


export type MutationUpdateRegistrationBibNumberArgs = {
  input: UpdateBibNumberInput;
};


export type MutationUpdateReportStatusArgs = {
  input: UpdateReportStatusInput;
};


export type MutationUpdateTournamentArgs = {
  input: UpdateTournamentInput;
};


export type MutationUpdateTournamentRefereeArgs = {
  input: UpdateTournamentRefereeInput;
};


export type MutationUpdateUserReportStatusArgs = {
  input: UpdateUserReportStatusInput;
};


export type MutationUpdateVenueArgs = {
  input: UpdateVenueInput;
};


export type MutationUpdateVenueExpenseArgs = {
  input: UpdateVenueExpenseInput;
};


export type MutationUpdateVenueOrderTypeConfigsArgs = {
  input: UpdateVenueOrderTypeConfigsInput;
};


export type MutationUpdateVenueReviewArgs = {
  content?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  rating?: InputMaybe<Scalars['Float']['input']>;
  reviewId: Scalars['ID']['input'];
};


export type MutationUpdateVenueStaffPermissionsArgs = {
  permissions: Array<VenueAction>;
  userId: Scalars['ID']['input'];
  venueId: Scalars['ID']['input'];
};


export type MutationUpdateVenueStaffTitleArgs = {
  customTitle: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
  venueId: Scalars['ID']['input'];
};


export type MutationUploadAvatarArgs = {
  input: UploadAvatarInput;
};


export type MutationUploadChatMediaArgs = {
  input: UploadChatMediaInput;
};


export type MutationUploadCoverPhotoArgs = {
  input: UploadCoverPhotoInput;
};


export type MutationUploadGroupChatImageArgs = {
  input: UploadGroupChatImageInput;
};


export type MutationUploadGroupCoverArgs = {
  input: UploadGroupCoverInput;
};


export type MutationUploadPaymentProofArgs = {
  input: UploadPaymentProofInput;
};


export type MutationUploadPostMediaArgs = {
  input: UploadPostMediaInput;
};


export type MutationUploadProcessedImageArgs = {
  input: UploadProcessedImageInput;
};


export type MutationUploadProductImageArgs = {
  input: UploadProductImageInput;
};


export type MutationUploadTournamentImageArgs = {
  input: UploadTournamentImageInput;
};


export type MutationUploadVenueImageArgs = {
  input: UploadVenueImageInput;
};


export type MutationUploadVenueRequestImageArgs = {
  input: UploadVenueRequestImageInput;
};


export type MutationVerifyOtpArgs = {
  input: VerifyOtpInput;
};


export type MutationVerifyPhoneOtpArgs = {
  input: VerifyPhoneOtpInput;
};

export type MyGamesFilterInput = {
  /** Từ ngày (YYYY-MM-DD) */
  dateFrom?: InputMaybe<Scalars['String']['input']>;
  /** Đến ngày (YYYY-MM-DD) */
  dateTo?: InputMaybe<Scalars['String']['input']>;
  /** Sắp xếp theo */
  sortBy?: InputMaybe<PickupGameSortBy>;
  /** Thứ tự sắp xếp */
  sortOrder?: InputMaybe<SortOrder>;
  /** Lọc theo môn */
  sportType?: InputMaybe<SportType>;
  /** Lọc theo trạng thái */
  status?: InputMaybe<PickupGameStatus>;
  /** Lọc theo nhiều trạng thái */
  statuses?: InputMaybe<Array<PickupGameStatus>>;
};

/** Filter for my passes */
export enum MyPassesFilter {
  All = 'ALL',
  Completed = 'COMPLETED',
  Created = 'CREATED',
  Interested = 'INTERESTED',
  Received = 'RECEIVED'
}

export type MyPassesFilterInput = {
  /** Filter type */
  filter?: InputMaybe<MyPassesFilter>;
  /** Filter by statuses */
  statuses?: InputMaybe<Array<BookingPassStatus>>;
};

export type MyVenuesStats = {
  __typename?: 'MyVenuesStats';
  /** Today bookings across all venues */
  todayBookings: Scalars['Int']['output'];
  /** Total revenue across all venues */
  totalRevenue: Scalars['Int']['output'];
  /** Total venues count */
  totalVenues: Scalars['Int']['output'];
};

/** Relay-style connection for geo-sorted pickup games. Sort: distance ASC, _id ASC. */
export type NearbyPickupGameConnection = {
  __typename?: 'NearbyPickupGameConnection';
  edges: Array<NearbyPickupGameEdge>;
  pageInfo: PageInfo;
  /** Search radius in km. */
  radiusKm: Scalars['Float']['output'];
  /** Total games matching geo filter. */
  totalCount: Scalars['Float']['output'];
  userLatitude: Scalars['Float']['output'];
  userLongitude: Scalars['Float']['output'];
};

/** An edge in NearbyPickupGameConnection (game sorted by distance). */
export type NearbyPickupGameEdge = {
  __typename?: 'NearbyPickupGameEdge';
  /** Opaque cursor (distance + _id). */
  cursor: Scalars['String']['output'];
  /** Pickup game node. */
  node: PickupGame;
};

/** Relay-style connection for geo-sorted venues. Sort: distance ASC, _id ASC. */
export type NearbyVenueConnection = {
  __typename?: 'NearbyVenueConnection';
  edges: Array<NearbyVenueEdge>;
  pageInfo: PageInfo;
  /** Search radius in km (0 = unlimited). */
  radiusKm: Scalars['Float']['output'];
  /** Total venues matching geo filter. */
  totalCount: Scalars['Float']['output'];
  userLatitude: Scalars['Float']['output'];
  userLongitude: Scalars['Float']['output'];
};

/** An edge in NearbyVenueConnection (venue sorted by distance). */
export type NearbyVenueEdge = {
  __typename?: 'NearbyVenueEdge';
  /** Opaque cursor (distance + _id). */
  cursor: Scalars['String']['output'];
  /** Venue node (includes distanceKm). */
  node: Venue;
};

export type Notification = {
  __typename?: 'Notification';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Additional data for navigation/actions */
  data?: Maybe<NotificationData>;
  /** Notification description/body */
  description: Scalars['String']['output'];
  /** Icon name (Ionicons) */
  icon: Scalars['String']['output'];
  /** Optional image URL for rich notification */
  imageUrl?: Maybe<Scalars['String']['output']>;
  /** Whether notification has been read */
  isRead: Scalars['Boolean']['output'];
  /** When notification was read */
  readAt?: Maybe<Scalars['DateTime']['output']>;
  /** Notification title */
  title: Scalars['String']['output'];
  type: NotificationType;
  updatedAt: Scalars['DateTime']['output'];
  /** User ID who receives this notification */
  userId: Scalars['ID']['output'];
};

/** A Relay-style connection for Notification items. */
export type NotificationConnection = {
  __typename?: 'NotificationConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<NotificationEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

export type NotificationData = {
  __typename?: 'NotificationData';
  /** Custom action identifier */
  action?: Maybe<Scalars['String']['output']>;
  /** Whether the action has been taken (for actionable notifications) */
  actionTaken?: Maybe<Scalars['Boolean']['output']>;
  /** Initial tab to open (e.g., chat, overview, members) */
  initialTab?: Maybe<Scalars['String']['output']>;
  /** Requester ID for join requests */
  requesterId?: Maybe<Scalars['String']['output']>;
  /** Screen to navigate to */
  screen?: Maybe<Scalars['String']['output']>;
  /** Secondary target entity ID (e.g. tournamentId when targetId is matchId) */
  secondaryTargetId?: Maybe<Scalars['String']['output']>;
  /** Target entity ID (booking, tournament, user, etc.) */
  targetId?: Maybe<Scalars['String']['output']>;
};

export type NotificationDataInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  initialTab?: InputMaybe<Scalars['String']['input']>;
  inviterName?: InputMaybe<Scalars['String']['input']>;
  requesterId?: InputMaybe<Scalars['String']['input']>;
  roleName?: InputMaybe<Scalars['String']['input']>;
  screen?: InputMaybe<Scalars['String']['input']>;
  secondaryTargetId?: InputMaybe<Scalars['String']['input']>;
  staffName?: InputMaybe<Scalars['String']['input']>;
  targetId?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  venueName?: InputMaybe<Scalars['String']['input']>;
};

/** An edge in the NotificationConnection. */
export type NotificationEdge = {
  __typename?: 'NotificationEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Notification;
};

export type NotificationFilterInput = {
  /** Filter by read status (null = all) */
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  /** Search in title and description */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  /** Filter by notification type (null = all) */
  type?: InputMaybe<NotificationType>;
};

/** Types of notifications */
export enum NotificationType {
  Booking = 'BOOKING',
  BookingPass = 'BOOKING_PASS',
  BookingReminder = 'BOOKING_REMINDER',
  GroupInvite = 'GROUP_INVITE',
  NewMessage = 'NEW_MESSAGE',
  Order = 'ORDER',
  Payment = 'PAYMENT',
  PostReport = 'POST_REPORT',
  Social = 'SOCIAL',
  System = 'SYSTEM',
  Tournament = 'TOURNAMENT',
  UserReport = 'USER_REPORT'
}

export type OperatingHours = {
  __typename?: 'OperatingHours';
  /** Closing time (HH:mm) */
  closeTime: Scalars['String']['output'];
  /** Day of week (0=Sunday, 1=Monday, ...) */
  dayOfWeek: Scalars['Int']['output'];
  /** Is open 24 hours on this day */
  is24Hours?: Maybe<Scalars['Boolean']['output']>;
  /** Is closed on this day */
  isClosed: Scalars['Boolean']['output'];
  /** Opening time (HH:mm) */
  openTime: Scalars['String']['output'];
};

export type OperatingHoursInput = {
  /** Closing time (HH:mm) */
  closeTime: Scalars['String']['input'];
  /** Day of week (0=Sunday, 1=Monday, ...) */
  dayOfWeek: Scalars['Int']['input'];
  /** Is open 24 hours on this day */
  is24Hours?: InputMaybe<Scalars['Boolean']['input']>;
  /** Is closed on this day */
  isClosed: Scalars['Boolean']['input'];
  /** Opening time (HH:mm) */
  openTime: Scalars['String']['input'];
};

export type OperationsFilterInput = {
  /** Start date (YYYY-MM-DD) in filter timezone */
  from: Scalars['String']['input'];
  /** Trend bucket size; auto-inferred from date range when omitted (day ≤31d, week ≤90d, else month) */
  granularity?: InputMaybe<FinanceGranularity>;
  /** Filter bookings that used this promotion */
  promotionId?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by schedule type (fixed / single) */
  scheduleType?: InputMaybe<BookingScheduleType>;
  /** IANA timezone for date boundaries */
  timezone?: InputMaybe<Scalars['String']['input']>;
  /** End date (YYYY-MM-DD) in filter timezone */
  to: Scalars['String']['input'];
  /** Venue IDs. Empty = all venues user can view. */
  venueIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type OperationsOccupancySummary = {
  __typename?: 'OperationsOccupancySummary';
  /** Total bookable slots in period */
  availableSlots: Scalars['Int']['output'];
  /** Occupancy rate 0–100 */
  occupancyRate: Scalars['Float']['output'];
  /** Booked slots in period */
  occupiedSlots: Scalars['Int']['output'];
};

export type Order = {
  __typename?: 'Order';
  _id: Scalars['ID']['output'];
  /** Related booking */
  booking?: Maybe<Booking>;
  /** Related booking ID */
  bookingId?: Maybe<Scalars['ID']['output']>;
  /** Cancellation reason */
  cancellationReason?: Maybe<Scalars['String']['output']>;
  /** Cancelled at */
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  /** Cancelled by user ID */
  cancelledBy?: Maybe<Scalars['ID']['output']>;
  /** User who cancelled */
  cancelledByUser?: Maybe<User>;
  /** Completed at */
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Confirmed at */
  confirmedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Staff who confirmed */
  confirmedByStaff?: Maybe<User>;
  /** Confirmed by staff ID */
  confirmedByStaffId?: Maybe<Scalars['ID']['output']>;
  /** Court number (for delivery to court) */
  courtNumber?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Staff who created */
  createdByStaff?: Maybe<User>;
  /** Created by staff ID */
  createdByStaffId?: Maybe<Scalars['ID']['output']>;
  /** Customer user */
  customer?: Maybe<User>;
  /** Customer user ID */
  customerId?: Maybe<Scalars['ID']['output']>;
  /** Customer info (for walk-in) */
  customerInfo?: Maybe<OrderCustomerInfo>;
  /** Customer name (for walk-in) */
  customerName?: Maybe<Scalars['String']['output']>;
  /** Customer phone (for walk-in) */
  customerPhone?: Maybe<Scalars['String']['output']>;
  /** Delivered at */
  deliveredAt?: Maybe<Scalars['DateTime']['output']>;
  /** Discount */
  discount?: Maybe<Scalars['Int']['output']>;
  /** Promo code used */
  discountCode?: Maybe<Scalars['String']['output']>;
  /** In progress at */
  inProgressAt?: Maybe<Scalars['DateTime']['output']>;
  /** Internal/admin note */
  internalNote?: Maybe<Scalars['String']['output']>;
  /** Whether price was manually overridden by staff */
  isManualPrice: Scalars['Boolean']['output'];
  /** Order items */
  items: Array<OrderItem>;
  /** Reason for manual price override */
  manualPriceNote?: Maybe<Scalars['String']['output']>;
  /** Customer note */
  note?: Maybe<Scalars['String']['output']>;
  /** Order code (e.g., ORD-202412-00001) */
  orderCode: Scalars['String']['output'];
  /** Order type */
  orderType: OrderType;
  /** Amount already paid */
  paidAmount?: Maybe<Scalars['Int']['output']>;
  /** Paid at */
  paidAt?: Maybe<Scalars['DateTime']['output']>;
  /** Payment method */
  paymentMethod?: Maybe<PaymentMethod>;
  /** Payment proof images (for online payment) */
  paymentProofImages?: Maybe<Array<Scalars['String']['output']>>;
  /** Payment status */
  paymentStatus: OrderPaymentStatus;
  /** Promotion ID applied */
  promotionId?: Maybe<Scalars['ID']['output']>;
  /** Ready at */
  readyAt?: Maybe<Scalars['DateTime']['output']>;
  /** Refund information */
  refundInfo?: Maybe<RefundInfo>;
  /** Staff who processed refund */
  refundProcessedByUser?: Maybe<User>;
  /** Staff who requested refund */
  refundRequestedByUser?: Maybe<User>;
  /** Ngày dịch vụ thực tế (staff có thể đặt ngược quá khứ). Mặc định = ngày tạo đơn. */
  serviceDate?: Maybe<Scalars['DateTime']['output']>;
  /** Service fee */
  serviceFee?: Maybe<Scalars['Int']['output']>;
  /** Order status */
  status: OrderStatus;
  /** Subtotal */
  subtotal: Scalars['Int']['output'];
  /** Table number */
  tableNumber?: Maybe<Scalars['String']['output']>;
  /** Tax */
  tax?: Maybe<Scalars['Int']['output']>;
  /** Total amount (final) */
  totalAmount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  /** Order venue */
  venue: Venue;
  /** Venue ID */
  venueId: Scalars['ID']['output'];
};

export type OrderAnalytics = {
  __typename?: 'OrderAnalytics';
  /** Hourly order distribution */
  hourlyDistribution: Array<OrderHourlyDistribution>;
  /** Order distribution by type */
  orderTypeDistribution: Array<OrderTypeDistribution>;
  /** Analytics period (week, month, quarter, year) */
  period: Scalars['String']['output'];
  /** Revenue by category */
  revenueByCategory: Array<CategoryRevenue>;
  /** Revenue by day/period */
  revenueByPeriod: Array<OrderRevenueDataPoint>;
  /** Revenue trend over months */
  revenueTrend: Array<OrderRevenueDataPoint>;
  /** Summary statistics */
  summary: OrderAnalyticsSummary;
  /** Top selling products */
  topProducts: Array<TopSellingProduct>;
  /** Venue ID */
  venueId: Scalars['String']['output'];
  /** Venue name */
  venueName: Scalars['String']['output'];
};

export type OrderAnalyticsSummary = {
  __typename?: 'OrderAnalyticsSummary';
  /** Average items per order */
  averageItemsPerOrder: Scalars['Float']['output'];
  /** Average order value */
  averageOrderValue: Scalars['Int']['output'];
  /** Cancellation rate (%) */
  cancellationRate: Scalars['Float']['output'];
  /** Order completion rate (%) */
  completionRate: Scalars['Float']['output'];
  /** Order count change percentage */
  orderChangePercent: Scalars['Float']['output'];
  /** Peak day */
  peakDay: Scalars['String']['output'];
  /** Peak hour */
  peakHour: Scalars['String']['output'];
  /** Previous period average order value */
  previousAverageOrderValue: Scalars['Int']['output'];
  /** Previous completion rate (%) */
  previousCompletionRate: Scalars['Float']['output'];
  /** Previous period orders */
  previousOrders: Scalars['Int']['output'];
  /** Previous period revenue */
  previousRevenue: Scalars['Int']['output'];
  /** Revenue change percentage */
  revenueChangePercent: Scalars['Float']['output'];
  /** Total items sold */
  totalItemsSold: Scalars['Int']['output'];
  /** Total orders in period */
  totalOrders: Scalars['Int']['output'];
  /** Total revenue in period */
  totalRevenue: Scalars['Int']['output'];
};

/** A Relay-style connection for Order items. */
export type OrderConnection = {
  __typename?: 'OrderConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<OrderEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

export type OrderCustomerInfo = {
  __typename?: 'OrderCustomerInfo';
  /** Customer email */
  email?: Maybe<Scalars['String']['output']>;
  /** Customer name */
  name: Scalars['String']['output'];
  /** Customer phone */
  phone?: Maybe<Scalars['String']['output']>;
};

/** An edge in the OrderConnection. */
export type OrderEdge = {
  __typename?: 'OrderEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Order;
};

export type OrderFilterInput = {
  /** Filter by booking ID */
  bookingId?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by customer ID */
  customerId?: InputMaybe<Scalars['ID']['input']>;
  /** From date (YYYY-MM-DD) */
  fromDate?: InputMaybe<Scalars['String']['input']>;
  /** Filter by order type */
  orderType?: InputMaybe<OrderType>;
  /** Filter by multiple order types */
  orderTypes?: InputMaybe<Array<OrderType>>;
  /** Filter by payment status */
  paymentStatuses?: InputMaybe<Array<OrderPaymentStatus>>;
  /** Search by customer name or order code */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  /** Từ ngày dịch vụ (YYYY-MM-DD) */
  serviceDateFrom?: InputMaybe<Scalars['String']['input']>;
  /** Đến ngày dịch vụ (YYYY-MM-DD) */
  serviceDateTo?: InputMaybe<Scalars['String']['input']>;
  /** Filter by status */
  statuses?: InputMaybe<Array<OrderStatus>>;
  /** To date (YYYY-MM-DD) */
  toDate?: InputMaybe<Scalars['String']['input']>;
  /** Filter today only */
  todayOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by venue ID */
  venueId?: InputMaybe<Scalars['ID']['input']>;
};

export type OrderHourlyDistribution = {
  __typename?: 'OrderHourlyDistribution';
  /** Hour (e.g., 06, 07, 08...) */
  hour: Scalars['String']['output'];
  /** Intensity 0-1 for heatmap */
  intensity: Scalars['Float']['output'];
  /** Number of orders */
  orderCount: Scalars['Int']['output'];
  /** Total revenue */
  revenue: Scalars['Int']['output'];
};

export type OrderItem = {
  __typename?: 'OrderItem';
  /** Type of order item */
  itemType: OrderItemType;
  /** Additional info (e.g., time slot for court) */
  metadata?: Maybe<Scalars['String']['output']>;
  /** Special request/note */
  note?: Maybe<Scalars['String']['output']>;
  /** Product ID (null for court bookings) */
  productId?: Maybe<Scalars['ID']['output']>;
  /** Product/Item name */
  productName: Scalars['String']['output'];
  /** Quantity */
  quantity: Scalars['Int']['output'];
  /** Total price */
  totalPrice: Scalars['Int']['output'];
  /** Unit price */
  unitPrice: Scalars['Int']['output'];
};

export type OrderItemInput = {
  /** Item type (defaults to PRODUCT) */
  itemType?: InputMaybe<OrderItemType>;
  /** Special request/note */
  note?: InputMaybe<Scalars['String']['input']>;
  /** Product ID (null for court bookings) */
  productId?: InputMaybe<Scalars['ID']['input']>;
  /** Quantity */
  quantity: Scalars['Int']['input'];
  /** Override unit price (used when isManualPrice = true on order) */
  unitPrice?: InputMaybe<Scalars['Int']['input']>;
};

/** Type of order item */
export enum OrderItemType {
  Beverage = 'BEVERAGE',
  Court = 'COURT',
  Food = 'FOOD',
  Product = 'PRODUCT',
  Service = 'SERVICE',
  Training = 'TRAINING'
}

/** Payment status of order */
export enum OrderPaymentStatus {
  Paid = 'PAID',
  Partial = 'PARTIAL',
  Pending = 'PENDING',
  Refunded = 'REFUNDED',
  RefundPartial = 'REFUND_PARTIAL',
  RefundPending = 'REFUND_PENDING'
}

export type OrderRevenueDataPoint = {
  __typename?: 'OrderRevenueDataPoint';
  /** Label (e.g., T2, T3, 01/01...) */
  label: Scalars['String']['output'];
  /** Number of orders */
  orderCount: Scalars['Int']['output'];
  /** Previous period value for comparison */
  previousValue?: Maybe<Scalars['Int']['output']>;
  /** Revenue value */
  value: Scalars['Int']['output'];
};

export type OrderSortInput = {
  /** Sort by field */
  sortBy?: InputMaybe<Scalars['String']['input']>;
  /** Sort order */
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};

export type OrderStats = {
  __typename?: 'OrderStats';
  /** Cancelled orders */
  cancelledOrders: Scalars['Int']['output'];
  /** Completed orders */
  completedOrders: Scalars['Int']['output'];
  /** Pending orders */
  pendingOrders: Scalars['Int']['output'];
  /** Preparing orders */
  preparingOrders: Scalars['Int']['output'];
  /** Ready orders */
  readyOrders: Scalars['Int']['output'];
  /** Today orders */
  todayOrders: Scalars['Int']['output'];
  /** Today revenue */
  todayRevenue: Scalars['Int']['output'];
  /** Total orders */
  totalOrders: Scalars['Int']['output'];
  /** Total revenue */
  totalRevenue: Scalars['Int']['output'];
  /** Week orders (last 7 days) */
  weekOrders: Scalars['Int']['output'];
  /** Week revenue (last 7 days) */
  weekRevenue: Scalars['Int']['output'];
};

/** Status of the order */
export enum OrderStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Confirmed = 'CONFIRMED',
  Delivered = 'DELIVERED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING',
  Preparing = 'PREPARING',
  Ready = 'READY'
}

/** Type of order */
export enum OrderType {
  Booking = 'BOOKING',
  DeliveryToCourt = 'DELIVERY_TO_COURT',
  DineIn = 'DINE_IN',
  Membership = 'MEMBERSHIP',
  Rental = 'RENTAL',
  Retail = 'RETAIL',
  Takeaway = 'TAKEAWAY',
  Training = 'TRAINING'
}

export type OrderTypeDistribution = {
  __typename?: 'OrderTypeDistribution';
  /** Color key for chart */
  colorKey: Scalars['String']['output'];
  /** Number of orders */
  count: Scalars['Int']['output'];
  /** Display name */
  displayName: Scalars['String']['output'];
  /** Order type */
  orderType: Scalars['String']['output'];
  /** Percentage of total orders */
  percentage: Scalars['Float']['output'];
  /** Total revenue */
  revenue: Scalars['Int']['output'];
};

export type OrganizerAbortLiveMatchInput = {
  /** Optimistic concurrency guard */
  expectedScorecardUpdatedAt?: InputMaybe<Scalars['String']['input']>;
  matchId: Scalars['ID']['input'];
  /** Lý do huỷ trận (audit bắt buộc) */
  reason: Scalars['String']['input'];
};

export type OrganizerCorrectLiveScoreInput = {
  /** Optimistic concurrency guard */
  expectedScorecardUpdatedAt?: InputMaybe<Scalars['String']['input']>;
  /** Left side player after correction: 1 or 2 */
  leftSidePlayer?: InputMaybe<Scalars['Int']['input']>;
  matchId: Scalars['ID']['input'];
  mode: OrganizerCorrectLiveScoreMode;
  /** Lý do hiệu chỉnh (audit bắt buộc) */
  reason: Scalars['String']['input'];
  /** Serving player after correction: 1 or 2 */
  servingPlayer?: InputMaybe<Scalars['Int']['input']>;
  /** Set scores [[p1,p2],[p1,p2],...] (SET_SNAPSHOT mode) */
  sets?: InputMaybe<Array<Array<Scalars['Int']['input']>>>;
  /** Number of points to undo (UNDO_POINTS mode) */
  undoCount?: InputMaybe<Scalars['Int']['input']>;
};

/** Mode for organizer live score correction */
export enum OrganizerCorrectLiveScoreMode {
  SetSnapshot = 'SET_SNAPSHOT',
  UndoPoints = 'UNDO_POINTS'
}

/** Transport channel used to deliver an OTP */
export enum OtpChannelType {
  Email = 'EMAIL',
  FirebaseFallback = 'FIREBASE_FALLBACK',
  Pending = 'PENDING',
  Zns = 'ZNS'
}

/** Specific purpose an OTP was issued for; bound at creation */
export enum OtpPurpose {
  EmailChange = 'EMAIL_CHANGE',
  EmailVerification = 'EMAIL_VERIFICATION',
  PasswordResetEmail = 'PASSWORD_RESET_EMAIL',
  PasswordResetPhone = 'PASSWORD_RESET_PHONE',
  PhoneChange = 'PHONE_CHANGE',
  SignInPhone = 'SIGN_IN_PHONE',
  SignUpPhone = 'SIGN_UP_PHONE'
}

export type OtpResponse = {
  __typename?: 'OtpResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  verificationId?: Maybe<Scalars['String']['output']>;
};

export type OtpTestPhone = {
  __typename?: 'OtpTestPhone';
  _id: Scalars['ID']['output'];
  /** Empty = all phone OTP purposes allowed */
  allowedPurposes?: Maybe<Array<OtpPurpose>>;
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<Scalars['ID']['output']>;
  enabled: Scalars['Boolean']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  /** Human-readable label for QA / ops */
  label: Scalars['String']['output'];
  /** E.164 phone number */
  phone: Scalars['String']['output'];
  /** Fixed 6-digit OTP code (SUPER_ADMIN only) */
  testCode: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

/** A Relay-style connection for OtpTestPhone items. */
export type OtpTestPhoneConnection = {
  __typename?: 'OtpTestPhoneConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<OtpTestPhoneEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the OtpTestPhoneConnection. */
export type OtpTestPhoneEdge = {
  __typename?: 'OtpTestPhoneEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: OtpTestPhone;
};

export type OtpTestPhoneFilterInput = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Search phone or label (partial match) */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type OtpTestUserGrant = {
  __typename?: 'OtpTestUserGrant';
  _id: Scalars['ID']['output'];
  /** Allowed OTP purposes (default SIGN_IN_PHONE only) */
  allowedPurposes: Array<OtpPurpose>;
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<Scalars['ID']['output']>;
  enabled: Scalars['Boolean']['output'];
  expiresAt: Scalars['DateTime']['output'];
  /** E.164 phone from user account */
  phone: Scalars['String']['output'];
  /** Reason / ticket reference for audit trail */
  reason: Scalars['String']['output'];
  revokedAt?: Maybe<Scalars['DateTime']['output']>;
  revokedBy?: Maybe<Scalars['ID']['output']>;
  /** Fixed 6-digit OTP code (SUPER_ADMIN only) */
  testCode: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  /** Denormalized user display name at grant time */
  userDisplayName: Scalars['String']['output'];
  /** Linked user account */
  userId: Scalars['ID']['output'];
  /** Denormalized user role at grant time */
  userRole: UserRole;
};

/** A Relay-style connection for OtpTestUserGrant items. */
export type OtpTestUserGrantConnection = {
  __typename?: 'OtpTestUserGrantConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<OtpTestUserGrantEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the OtpTestUserGrantConnection. */
export type OtpTestUserGrantEdge = {
  __typename?: 'OtpTestUserGrantEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: OtpTestUserGrant;
};

export type OtpTestUserGrantFilterInput = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Search phone, reason, or userId */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter by user ID */
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  /** Cursor of the last item in the current page. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** Whether more items exist after the current page. */
  hasNextPage: Scalars['Boolean']['output'];
  /** Whether items exist before the current page (reserved). */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** Cursor of the first item in the current page. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type ParticipantRatingInput = {
  /** Nhận xét */
  comment?: InputMaybe<Scalars['String']['input']>;
  /** Có tham gia không */
  didAttend: Scalars['Boolean']['input'];
  /** Đánh giá (1-5) */
  rating?: InputMaybe<Scalars['Int']['input']>;
  /** ID người chơi */
  userId: Scalars['ID']['input'];
};

/** Trạng thái người tham gia */
export enum ParticipantStatus {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Kicked = 'KICKED',
  NoShow = 'NO_SHOW',
  Pending = 'PENDING',
  Waitlist = 'WAITLIST'
}

export type PartnerLeaderboard = {
  __typename?: 'PartnerLeaderboard';
  items: Array<PartnerLeaderboardItem>;
  /** Total number of active referral codes */
  totalCodes: Scalars['Int']['output'];
};

export type PartnerLeaderboardItem = {
  __typename?: 'PartnerLeaderboardItem';
  /** Activation rate (users who ordered / total signups) */
  activationRate: Scalars['Float']['output'];
  /** Avatar URL */
  avatarUrl?: Maybe<Scalars['String']['output']>;
  /** User ID of the partner */
  partnerId: Scalars['ID']['output'];
  /** Display name of the partner */
  partnerName: Scalars['String']['output'];
  /** Referral code used by this partner */
  referralCode: Scalars['String']['output'];
  /** Partner role */
  role?: Maybe<Scalars['String']['output']>;
  /** Total revenue generated */
  totalRevenue: Scalars['Float']['output'];
  /** Total signups attributed to this code */
  totalSignups: Scalars['Int']['output'];
  /** Trend direction compared to previous period: up, down, or stable */
  trend: Scalars['String']['output'];
};

/** Payment method */
export enum PaymentMethod {
  BankTransfer = 'BANK_TRANSFER',
  Card = 'CARD',
  Cash = 'CASH',
  Momo = 'MOMO',
  Vnpay = 'VNPAY',
  Zalopay = 'ZALOPAY'
}

/** Trạng thái thanh toán */
export enum PaymentStatus {
  Paid = 'PAID',
  Partial = 'PARTIAL',
  Pending = 'PENDING',
  Refunded = 'REFUNDED'
}

export type PickupGame = {
  __typename?: 'PickupGame';
  _id: Scalars['ID']['output'];
  /** Chế độ duyệt */
  approvalMode: ApprovalMode;
  /** Số slot còn trống */
  availableSlots?: Maybe<Scalars['Int']['output']>;
  /** Liên kết với booking */
  bookingLink?: Maybe<BookingLink>;
  /** Lý do hủy */
  cancellationReason?: Maybe<Scalars['String']['output']>;
  /** Thời gian hủy */
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  /** Mã QR check-in */
  checkInQrCode?: Maybe<Scalars['String']['output']>;
  /** Số người đã xác nhận */
  confirmedCount?: Maybe<Scalars['Int']['output']>;
  /** ID conversation chat */
  conversationId?: Maybe<Scalars['ID']['output']>;
  /** Cấu hình chi phí */
  costConfig: CostConfig;
  /** Cover image with placeholder + responsive variants. */
  coverImage?: Maybe<ImageMedia>;
  /**
   * Ảnh bìa
   * @deprecated Use `coverImage.url`. Kept for backward compat with mobile builds < 1.7.
   */
  coverImageUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Địa điểm tùy chỉnh */
  customLocation?: Maybe<CustomLocation>;
  /** Cấu hình đặt cọc */
  depositConfig?: Maybe<DepositConfig>;
  /** Khoảng cách (km) */
  distanceKm?: Maybe<Scalars['Float']['output']>;
  /** Thời điểm kết thúc kèo (Asia/Ho_Chi_Minh) */
  endsAt: Scalars['DateTime']['output'];
  /** Dụng cụ cần mang */
  equipment?: Maybe<Array<EquipmentItem>>;
  /** Thể thức thi đấu (VD: SINGLES, DOUBLES, 5V5) — multi-select */
  gameFormats?: Maybe<Array<Scalars['String']['output']>>;
  /** Loại hình chơi */
  gameType: GameType;
  /** Cấu hình giới tính */
  genderConfig?: Maybe<GenderConfig>;
  /** Thông tin host */
  host?: Maybe<User>;
  /** ID người tạo kèo */
  hostId: Scalars['ID']['output'];
  /** Gallery with placeholder + responsive variants. */
  imageMedia?: Maybe<Array<ImageMedia>>;
  /**
   * Ảnh khác
   * @deprecated Use `imageMedia[].url`. Kept for mobile builds < 1.7.
   */
  images?: Maybe<Array<Scalars['String']['output']>>;
  /** Là host */
  isHost?: Maybe<Scalars['Boolean']['output']>;
  /** Trong waitlist */
  isInWaitlist?: Maybe<Scalars['Boolean']['output']>;
  /** Đã tham gia */
  isParticipant?: Maybe<Scalars['Boolean']['output']>;
  /** Đang chờ duyệt */
  isPending?: Maybe<Scalars['Boolean']['output']>;
  /** Đã lưu */
  isSaved?: Maybe<Scalars['Boolean']['output']>;
  /** Host đã đặt sân chưa (dùng cho cả system venue và custom location) */
  isVenueBooked?: Maybe<Scalars['Boolean']['output']>;
  /** Tỷ lệ tham gia tối thiểu (0-1) */
  minAttendanceRate?: Maybe<Scalars['Float']['output']>;
  /** Ghi chú */
  notes?: Maybe<Scalars['String']['output']>;
  /** Danh sách người tham gia */
  participants?: Maybe<Array<PickupGameParticipant>>;
  /** Số yêu cầu đang chờ */
  pendingCount?: Maybe<Scalars['Int']['output']>;
  /** Số lượt chia sẻ */
  shareCount: Scalars['Int']['output'];
  /** Yêu cầu trình độ */
  skillRequirement?: Maybe<SkillRequirement>;
  /** Cấu hình số người */
  slotConfig: SlotConfig;
  /** Môn thể thao */
  sportType: SportType;
  /** Thời điểm bắt đầu kèo (Asia/Ho_Chi_Minh) */
  startsAt: Scalars['DateTime']['output'];
  /** Trạng thái kèo */
  status: PickupGameStatus;
  /** Tags */
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /** Thời gian chơi */
  timeSlot: GameTimeSlot;
  /** Tiêu đề kèo */
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  /** Thông tin sân */
  venue?: Maybe<Venue>;
  /** ID sân (nếu dùng sân hệ thống) */
  venueId?: Maybe<Scalars['ID']['output']>;
  /** Số lượt xem */
  viewCount: Scalars['Int']['output'];
  /** Độ hiển thị */
  visibility: GameVisibility;
  /** Số người trong waitlist */
  waitlistCount?: Maybe<Scalars['Int']['output']>;
};

export type PickupGameCampaign = {
  __typename?: 'PickupGameCampaign';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Mô tả campaign */
  description?: Maybe<Scalars['String']['output']>;
  /** Ngày kết thúc campaign */
  endDate?: Maybe<Scalars['DateTime']['output']>;
  /** Danh sách kèo thuộc campaign */
  gameIds?: Maybe<Array<Scalars['ID']['output']>>;
  /** Mục tiêu campaign */
  goals?: Maybe<CampaignGoals>;
  /** Host tạo campaign */
  hostId: Scalars['ID']['output'];
  /** Campaign đang hoạt động */
  isActive: Scalars['Boolean']['output'];
  /** JSON metadata mở rộng */
  metadata?: Maybe<Scalars['String']['output']>;
  /** Tên campaign */
  name: Scalars['String']['output'];
  /** Môn thể thao của campaign */
  sportTypes?: Maybe<Array<Scalars['String']['output']>>;
  /** Ngày bắt đầu campaign */
  startDate?: Maybe<Scalars['DateTime']['output']>;
  /** Trình độ mục tiêu */
  targetSkillLevels?: Maybe<Array<Scalars['String']['output']>>;
  updatedAt: Scalars['DateTime']['output'];
  /** Danh sách sân mục tiêu */
  venueIds?: Maybe<Array<Scalars['ID']['output']>>;
};

/** A Relay-style connection for PickupGame items. */
export type PickupGameConnection = {
  __typename?: 'PickupGameConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<PickupGameEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the PickupGameConnection. */
export type PickupGameEdge = {
  __typename?: 'PickupGameEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: PickupGame;
};

export type PickupGameFilterInput = {
  /** Loại chi phí */
  costType?: InputMaybe<CostSharingType>;
  /** Từ ngày (YYYY-MM-DD) */
  dateFrom?: InputMaybe<Scalars['String']['input']>;
  /** Đến ngày (YYYY-MM-DD) */
  dateTo?: InputMaybe<Scalars['String']['input']>;
  /** Chỉ kèo miễn phí */
  freeOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Lọc theo loại kèo */
  gameType?: InputMaybe<GameType>;
  /** Lọc theo giới tính */
  genderRestriction?: InputMaybe<GenderRestriction>;
  /** Còn slot trống */
  hasAvailableSlots?: InputMaybe<Scalars['Boolean']['input']>;
  /** Lọc theo host */
  hostId?: InputMaybe<Scalars['ID']['input']>;
  /** Vĩ độ */
  latitude?: InputMaybe<Scalars['Float']['input']>;
  /** Kinh độ */
  longitude?: InputMaybe<Scalars['Float']['input']>;
  /** Giá tối đa */
  maxPrice?: InputMaybe<Scalars['Int']['input']>;
  /** Số slot trống tối thiểu */
  minAvailableSlots?: InputMaybe<Scalars['Int']['input']>;
  /** Bán kính tìm kiếm (km) */
  radiusKm?: InputMaybe<Scalars['Float']['input']>;
  /** Yêu cầu đặt cọc */
  requiresDeposit?: InputMaybe<Scalars['Boolean']['input']>;
  /** Tìm kiếm theo tiêu đề, mô tả */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  /** Lọc theo thứ tự trình độ đơn (numeric order) — dùng cho single-select */
  skillLevelOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Lọc theo nhiều thứ tự trình độ (numeric orders) — dùng cho multi-select */
  skillLevelOrders?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Hệ thống xếp hạng để lọc (DEFAULT, BADMINTON, FOOTBALL, PB_TIME, PB_RATING) */
  skillSystem?: InputMaybe<Scalars['String']['input']>;
  /** Sắp xếp theo */
  sortBy?: InputMaybe<PickupGameSortBy>;
  /** Thứ tự sắp xếp */
  sortOrder?: InputMaybe<SortOrder>;
  /** Lọc theo môn */
  sportType?: InputMaybe<SportType>;
  /** Lọc theo trạng thái */
  status?: InputMaybe<PickupGameStatus>;
  /** Lọc theo nhiều trạng thái */
  statuses?: InputMaybe<Array<PickupGameStatus>>;
  /** Lọc theo tags */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Lọc theo giờ bắt đầu (HH:mm) trên startsAt; kết hợp dateFrom/dateTo */
  timeFrom?: InputMaybe<Scalars['String']['input']>;
  /** Giới hạn trên startsAt (HH:mm) trong ngày dateTo hoặc dateFrom */
  timeTo?: InputMaybe<Scalars['String']['input']>;
  /** Giới tính của user (để lọc kèo phù hợp) */
  userGender?: InputMaybe<Gender>;
  /** Lọc theo sân */
  venueId?: InputMaybe<Scalars['ID']['input']>;
  /** Lọc theo độ hiển thị */
  visibility?: InputMaybe<GameVisibility>;
};

export type PickupGameParticipant = {
  __typename?: 'PickupGameParticipant';
  _id: Scalars['ID']['output'];
  /** Số tiền cần trả */
  amountDue?: Maybe<Scalars['Int']['output']>;
  /** Số tiền đã trả */
  amountPaid?: Maybe<Scalars['Int']['output']>;
  /** ID người duyệt */
  approvedBy?: Maybe<Scalars['ID']['output']>;
  /** Thời gian đánh dấu điểm danh */
  attendanceMarkedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Campaign mà kèo này thuộc về */
  campaignId?: Maybe<Scalars['ID']['output']>;
  /** Khoảng cách check-in so với giờ bắt đầu kèo (phút, âm = đến sớm) */
  checkInDeltaMinutes?: Maybe<Scalars['Float']['output']>;
  /** Phương thức check-in: QR_SCAN, MANUAL, BULK */
  checkInMethod?: Maybe<CheckInMethod>;
  /** Thời gian check-in */
  checkedInAt?: Maybe<Scalars['DateTime']['output']>;
  /** Thời gian xác nhận */
  confirmedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Số tiền cọc */
  depositAmount?: Maybe<Scalars['Int']['output']>;
  /** Ghi chú đặt cọc */
  depositNote?: Maybe<Scalars['String']['output']>;
  /** Trạng thái đặt cọc */
  depositStatus: DepositStatus;
  /** Thời gian đặt cọc */
  depositedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Có tham gia không */
  didAttend?: Maybe<Scalars['Boolean']['output']>;
  /** Thông tin kèo */
  game?: Maybe<PickupGame>;
  /** ID kèo */
  gameId: Scalars['ID']['output'];
  /** Số người đi cùng */
  groupSize?: Maybe<Scalars['Int']['output']>;
  /** Nhận xét từ host */
  hostComment?: Maybe<Scalars['String']['output']>;
  /** Đánh giá từ host (1-5) */
  hostRating?: Maybe<Scalars['Int']['output']>;
  /** Host cũng tham gia chơi */
  isHostParticipant?: Maybe<Scalars['Boolean']['output']>;
  /** Là MVP của trận */
  isMvp?: Maybe<Scalars['Boolean']['output']>;
  /** Thời gian thanh toán */
  paidAt?: Maybe<Scalars['DateTime']['output']>;
  /** Ghi chú thanh toán */
  paymentNote?: Maybe<Scalars['String']['output']>;
  /** Trạng thái thanh toán */
  paymentStatus: PaymentStatus;
  /** Lý do từ chối */
  rejectionReason?: Maybe<Scalars['String']['output']>;
  /** Tin nhắn khi xin tham gia */
  requestMessage?: Maybe<Scalars['String']['output']>;
  /** Trạng thái */
  status: ParticipantStatus;
  updatedAt: Scalars['DateTime']['output'];
  /** Thông tin người chơi */
  user?: Maybe<User>;
  /** ID người chơi */
  userId: Scalars['ID']['output'];
  /** Vị trí trong waitlist */
  waitlistPosition?: Maybe<Scalars['Int']['output']>;
};

/** A Relay-style connection for PickupGameParticipant items. */
export type PickupGameParticipantConnection = {
  __typename?: 'PickupGameParticipantConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<PickupGameParticipantEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the PickupGameParticipantConnection. */
export type PickupGameParticipantEdge = {
  __typename?: 'PickupGameParticipantEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: PickupGameParticipant;
};

/** Tiêu chí sắp xếp kèo */
export enum PickupGameSortBy {
  AvailableSlots = 'AVAILABLE_SLOTS',
  CreatedAt = 'CREATED_AT',
  Date = 'DATE',
  Distance = 'DISTANCE',
  Popularity = 'POPULARITY',
  Price = 'PRICE'
}

/** Trạng thái kèo giao lưu */
export enum PickupGameStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Draft = 'DRAFT',
  Full = 'FULL',
  InProgress = 'IN_PROGRESS',
  Open = 'OPEN'
}

export type PinMessageInput = {
  /** Conversation ID */
  conversationId: Scalars['ID']['input'];
  /** Message ID to pin */
  messageId: Scalars['ID']['input'];
};

export type PlayerRanking = {
  __typename?: 'PlayerRanking';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  club?: Maybe<Scalars['String']['output']>;
  /** Group stage points (3 win, 1 draw, 0 loss) */
  groupPoints?: Maybe<Scalars['Int']['output']>;
  matchesLost: Scalars['Int']['output'];
  matchesPlayed: Scalars['Int']['output'];
  matchesWon: Scalars['Int']['output'];
  playerName?: Maybe<Scalars['String']['output']>;
  pointsLost: Scalars['Int']['output'];
  pointsWon: Scalars['Int']['output'];
  rank: Scalars['Int']['output'];
  registrationId: Scalars['ID']['output'];
  seed?: Maybe<Scalars['Int']['output']>;
  setsLost: Scalars['Int']['output'];
  setsWon: Scalars['Int']['output'];
  winRate: Scalars['Float']['output'];
};

export type PointEvent = {
  __typename?: 'PointEvent';
  id: Scalars['ID']['output'];
  /** [player1Score, player2Score] after point */
  scoreAfter: Array<Scalars['Int']['output']>;
  /** Player who scored: 1 or 2 */
  scoringPlayer: Scalars['Int']['output'];
  /** Who was serving: 1 or 2 */
  servingPlayer: Scalars['Int']['output'];
  setNumber: Scalars['Int']['output'];
  /** ISO timestamp */
  timestamp: Scalars['String']['output'];
};

/** Portal capability grants (independent of UserRole) */
export enum PortalCapability {
  TournamentOrganizer = 'TOURNAMENT_ORGANIZER'
}

export type PortalCapabilityGrant = {
  __typename?: 'PortalCapabilityGrant';
  _id: Scalars['ID']['output'];
  capability: PortalCapability;
  createdAt: Scalars['DateTime']['output'];
  enabled: Scalars['Boolean']['output'];
  grantedAt?: Maybe<Scalars['DateTime']['output']>;
  grantedBy?: Maybe<Scalars['ID']['output']>;
  /** Reason / ticket reference for audit trail */
  reason: Scalars['String']['output'];
  revokedAt?: Maybe<Scalars['DateTime']['output']>;
  revokedBy?: Maybe<Scalars['ID']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  /** Denormalized display name at grant time */
  userDisplayName: Scalars['String']['output'];
  /** User receiving the capability */
  userId: Scalars['ID']['output'];
  /** Denormalized user role at grant time */
  userRole: UserRole;
};

/** A Relay-style connection for PortalCapabilityGrant items. */
export type PortalCapabilityGrantConnection = {
  __typename?: 'PortalCapabilityGrantConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<PortalCapabilityGrantEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the PortalCapabilityGrantConnection. */
export type PortalCapabilityGrantEdge = {
  __typename?: 'PortalCapabilityGrantEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: PortalCapabilityGrant;
};

export type PortalCapabilityGrantFilterInput = {
  capability?: InputMaybe<PortalCapability>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Search reason or display name */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter by user ID */
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type Post = {
  __typename?: 'Post';
  _id: Scalars['ID']['output'];
  /** Whether comments are allowed */
  allowComments: Scalars['Boolean']['output'];
  /** Author of the post */
  author: User;
  /** Author of the post */
  authorId: Scalars['ID']['output'];
  /** Number of comments */
  commentCount: Scalars['Float']['output'];
  /** Post content/body (can be empty if media is provided) */
  content: Scalars['String']['output'];
  /** Featured/cover image URL */
  coverImageUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Whether the current user has bookmarked this post */
  isBookmarked: Scalars['Boolean']['output'];
  /** Whether the current user has liked this post */
  isLiked: Scalars['Boolean']['output'];
  /** Whether the post is pinned by author */
  isPinned: Scalars['Boolean']['output'];
  /** Whether the current user has reported this post */
  isReported: Scalars['Boolean']['output'];
  /** Number of likes */
  likeCount: Scalars['Float']['output'];
  /** Location tagged in post */
  location?: Maybe<PostLocation>;
  /** Media attachments */
  media?: Maybe<Array<PostMedia>>;
  /** When the post was published */
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Scheduled publish time */
  scheduledAt?: Maybe<Scalars['DateTime']['output']>;
  /** Number of shares */
  shareCount: Scalars['Float']['output'];
  /** Status of the post */
  status: PostStatus;
  /** Tags for categorization */
  tags: Array<Scalars['String']['output']>;
  /** Post title (can be empty for image-only posts) */
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  /** Number of views */
  viewCount: Scalars['Float']['output'];
  /** Visibility of the post */
  visibility: PostVisibility;
};

export type PostBookmark = {
  __typename?: 'PostBookmark';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** The bookmarked post */
  post?: Maybe<Post>;
  /** Post that was bookmarked */
  postId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  /** User who bookmarked the post */
  userId: Scalars['ID']['output'];
};

export type PostBookmarkConnection = {
  __typename?: 'PostBookmarkConnection';
  edges: Array<PostBookmarkEdge>;
  pageInfo: PageInfo;
};

export type PostBookmarkEdge = {
  __typename?: 'PostBookmarkEdge';
  cursor: Scalars['String']['output'];
  node: PostBookmark;
};

export type PostComment = {
  __typename?: 'PostComment';
  _id: Scalars['ID']['output'];
  /** Author of the comment */
  author: User;
  /** Author of the comment */
  authorId: Scalars['ID']['output'];
  /** Comment content */
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** When the comment was last edited */
  editedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Whether the comment is edited */
  isEdited: Scalars['Boolean']['output'];
  /** Number of likes on this comment */
  likeCount: Scalars['Float']['output'];
  /** Parent comment ID for replies */
  parentId?: Maybe<Scalars['ID']['output']>;
  /** Post ID */
  postId: Scalars['ID']['output'];
  /** Number of replies to this comment */
  replyCount: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PostCommentConnection = {
  __typename?: 'PostCommentConnection';
  edges: Array<PostCommentEdge>;
  pageInfo: PageInfo;
};

export type PostCommentEdge = {
  __typename?: 'PostCommentEdge';
  cursor: Scalars['String']['output'];
  node: PostComment;
};

export type PostConnection = {
  __typename?: 'PostConnection';
  edges: Array<PostEdge>;
  pageInfo: PageInfo;
};

/** Payload for the postDeleted subscription. */
export type PostDeletedPayload = {
  __typename?: 'PostDeletedPayload';
  _id: Scalars['ID']['output'];
  postId: Scalars['ID']['output'];
};

export type PostEdge = {
  __typename?: 'PostEdge';
  cursor: Scalars['String']['output'];
  node: Post;
};

export type PostFilterInput = {
  /** Filter by author ID */
  authorId?: InputMaybe<Scalars['ID']['input']>;
  /** Search in title and content */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  /** Filter by status */
  status?: InputMaybe<PostStatus>;
  /** Filter by tags (any match) */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Filter by visibility */
  visibility?: InputMaybe<PostVisibility>;
};

export type PostLikerEdge = {
  __typename?: 'PostLikerEdge';
  cursor: Scalars['String']['output'];
  node: PostLikerUser;
};

export type PostLikerUser = {
  __typename?: 'PostLikerUser';
  _id: Scalars['ID']['output'];
  displayName?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  /** When this user liked the post */
  likedAt: Scalars['String']['output'];
  photoURL?: Maybe<Scalars['String']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
};

export type PostLikersConnection = {
  __typename?: 'PostLikersConnection';
  edges: Array<PostLikerEdge>;
  pageInfo: PageInfo;
};

export type PostLocation = {
  __typename?: 'PostLocation';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  displayText: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type PostLocationInput = {
  /** City name */
  city?: InputMaybe<Scalars['String']['input']>;
  /** Country name */
  country?: InputMaybe<Scalars['String']['input']>;
  /** Display text for location */
  displayText: Scalars['String']['input'];
  /** Latitude */
  latitude: Scalars['Float']['input'];
  /** Longitude */
  longitude: Scalars['Float']['input'];
};

export type PostMedia = {
  __typename?: 'PostMedia';
  /** BlurHash placeholder for instant image preview. */
  blurhash?: Maybe<Scalars['String']['output']>;
  duration?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  mimeType?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Float']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
  width?: Maybe<Scalars['Float']['output']>;
};

export type PostMediaInput = {
  /** BlurHash placeholder used by the mobile client to render an instant preview while the full image loads. */
  blurhash?: InputMaybe<Scalars['String']['input']>;
  /** Duration in seconds (for videos) */
  duration?: InputMaybe<Scalars['Float']['input']>;
  /** Height in pixels */
  height?: InputMaybe<Scalars['Float']['input']>;
  /** MIME type */
  mimeType?: InputMaybe<Scalars['String']['input']>;
  /** File size in bytes */
  size?: InputMaybe<Scalars['Float']['input']>;
  /** Thumbnail URL */
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  /** Media type (image, video, file) */
  type: Scalars['String']['input'];
  /** Media URL */
  url: Scalars['String']['input'];
  /** Width in pixels */
  width?: InputMaybe<Scalars['Float']['input']>;
};

export type PostReport = {
  __typename?: 'PostReport';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Additional details about the report */
  description?: Maybe<Scalars['String']['output']>;
  /** Admin notes or resolution details */
  notes?: Maybe<Scalars['String']['output']>;
  /** The reported post */
  post?: Maybe<Post>;
  /** Post that was reported */
  postId: Scalars['ID']['output'];
  /** Reason for reporting */
  reason: PostReportReason;
  /** User who reported the post */
  reporter?: Maybe<User>;
  /** User who reported the post */
  reporterId: Scalars['ID']['output'];
  /** When the report was reviewed */
  reviewedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Admin/moderator who reviewed */
  reviewedBy?: Maybe<Scalars['ID']['output']>;
  /** Admin who reviewed the report */
  reviewer?: Maybe<User>;
  /** Status of the report */
  status: PostReportStatus;
  updatedAt: Scalars['DateTime']['output'];
};

/** A Relay-style connection for PostReport items. */
export type PostReportConnection = {
  __typename?: 'PostReportConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<PostReportEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the PostReportConnection. */
export type PostReportEdge = {
  __typename?: 'PostReportEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: PostReport;
};

export type PostReportFilterInput = {
  /** Filter by report reason */
  reason?: InputMaybe<PostReportReason>;
  /** Filter by report status */
  status?: InputMaybe<PostReportStatus>;
};

/** Reason for reporting a post */
export enum PostReportReason {
  FalseInformation = 'FALSE_INFORMATION',
  Harassment = 'HARASSMENT',
  HateSpeech = 'HATE_SPEECH',
  IntellectualProperty = 'INTELLECTUAL_PROPERTY',
  Nudity = 'NUDITY',
  Other = 'OTHER',
  Spam = 'SPAM',
  Violence = 'VIOLENCE'
}

export type PostReportStats = {
  __typename?: 'PostReportStats';
  /** Total dismissed reports */
  dismissedReports: Scalars['Int']['output'];
  /** Total pending reports */
  pendingReports: Scalars['Int']['output'];
  /** Total resolved reports */
  resolvedReports: Scalars['Int']['output'];
  /** Total reviewed reports */
  reviewedReports: Scalars['Int']['output'];
  /** Total reports */
  totalReports: Scalars['Int']['output'];
};

/** Status of post report */
export enum PostReportStatus {
  Dismissed = 'DISMISSED',
  Pending = 'PENDING',
  Resolved = 'RESOLVED',
  Reviewed = 'REVIEWED'
}

/** Status of a post */
export enum PostStatus {
  Archived = 'ARCHIVED',
  Draft = 'DRAFT',
  Published = 'PUBLISHED'
}

/** Visibility level of a post */
export enum PostVisibility {
  Followers = 'FOLLOWERS',
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type PreviewBulkImportInput = {
  /** Danh sách đăng ký cần preview */
  registrations: Array<BulkImportRegistrationItemInput>;
  /** ID giải đấu */
  tournamentId: Scalars['ID']['input'];
};

export type PreviewBulkImportResult = {
  __typename?: 'PreviewBulkImportResult';
  /** Các nội dung cần điều chỉnh kích thước nhánh đấu (nếu vượt quá) */
  adjustmentsNeeded: Array<BracketSizeAdjustment>;
};

export type PreviewManualKnockoutDrawInput = {
  categoryId: Scalars['ID']['input'];
  knockoutSlots: Array<ManualBracketSlotInput>;
};

export type PriceRange = {
  __typename?: 'PriceRange';
  /** Currency (VND, USD, etc.) */
  currency?: Maybe<Scalars['String']['output']>;
  /** Maximum price per hour */
  maxPrice: Scalars['Int']['output'];
  /** Minimum price per hour */
  minPrice: Scalars['Int']['output'];
};

export type Product = {
  __typename?: 'Product';
  _id: Scalars['ID']['output'];
  /** Allow customers to purchase when out of stock */
  allowBackorder: Scalars['Boolean']['output'];
  /** Average cost per unit (weighted average from imports) */
  averageCost?: Maybe<Scalars['Float']['output']>;
  /** Average rating (0-5) */
  averageRating: Scalars['Float']['output'];
  /** Product category */
  category?: Maybe<ProductCategory>;
  /** Category ID */
  categoryId: Scalars['ID']['output'];
  /** Compare at price (original price for sale display) */
  compareAtPrice?: Maybe<Scalars['Int']['output']>;
  /** Cost price (for profit calculation) */
  costPrice?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Full description (HTML supported) */
  description?: Maybe<Scalars['String']['output']>;
  /** Discount percentage */
  discountPercent?: Maybe<Scalars['Float']['output']>;
  /** Display order */
  displayOrder: Scalars['Int']['output'];
  /** Does this product have variants */
  hasVariants: Scalars['Boolean']['output'];
  /** Product images */
  images: Array<ProductImage>;
  /** Is featured product */
  isFeatured: Scalars['Boolean']['output'];
  /** Is product in stock */
  isInStock: Scalars['Boolean']['output'];
  /** Is on sale */
  isOnSale: Scalars['Boolean']['output'];
  /** Is popular/best seller */
  isPopular: Scalars['Boolean']['output'];
  /** Last import price (for reference) */
  lastImportPrice?: Maybe<Scalars['Float']['output']>;
  /** Low stock threshold for alerts */
  lowStockThreshold?: Maybe<Scalars['Int']['output']>;
  /** SEO meta description */
  metaDescription?: Maybe<Scalars['String']['output']>;
  /** SEO meta title */
  metaTitle?: Maybe<Scalars['String']['output']>;
  /** Product name */
  name: Scalars['String']['output'];
  /** Selling price */
  price: Scalars['Int']['output'];
  /** Primary image URL */
  primaryImage?: Maybe<Scalars['String']['output']>;
  /** Product type */
  productType: ProductType;
  /** When product was published */
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Total reviews */
  reviewCount: Scalars['Int']['output'];
  /** Shop ID (for shop products - future) */
  shopId?: Maybe<Scalars['ID']['output']>;
  /** Short description */
  shortDescription?: Maybe<Scalars['String']['output']>;
  /** Product SKU (Stock Keeping Unit) */
  sku?: Maybe<Scalars['String']['output']>;
  /** URL-friendly slug */
  slug: Scalars['String']['output'];
  /** Total units sold */
  soldCount: Scalars['Int']['output'];
  /** Product status */
  status: ProductStatus;
  /** Stock quantity (-1 for unlimited) */
  stockQuantity: Scalars['Int']['output'];
  /** Total quantity imported (for average calculation) */
  totalImportQuantity?: Maybe<Scalars['Int']['output']>;
  /** Total value of all imports */
  totalImportValue?: Maybe<Scalars['Float']['output']>;
  /** Track inventory for this product */
  trackInventory: Scalars['Boolean']['output'];
  /** Unit of measure (e.g. lon, chai, thùng, kg) */
  unit?: Maybe<Scalars['String']['output']>;
  /** When product was unpublished */
  unpublishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  /** Variant option names (e.g., ["Size", "Color"]) */
  variantOptions: Array<Scalars['String']['output']>;
  /** Product variants */
  variants: Array<ProductVariant>;
  /** Product venue */
  venue?: Maybe<Venue>;
  /** Venue ID (for venue products) */
  venueId?: Maybe<Scalars['ID']['output']>;
  /** Total views */
  viewCount: Scalars['Int']['output'];
};

export type ProductAnalyticsSummary = {
  __typename?: 'ProductAnalyticsSummary';
  /** Average items per order */
  averageItemsPerOrder: Scalars['Float']['output'];
  /** Average order value (product only) */
  averageOrderValue: Scalars['Int']['output'];
  /** Best selling category name */
  bestSellingCategory: Scalars['String']['output'];
  /** Best selling product name */
  bestSellingProduct: Scalars['String']['output'];
  /** Items sold change percentage */
  itemsChangePercent: Scalars['Float']['output'];
  /** Orders change percentage */
  ordersChangePercent: Scalars['Float']['output'];
  /** Peak sales day */
  peakDay: Scalars['String']['output'];
  /** Peak sales hour */
  peakHour: Scalars['String']['output'];
  /** Previous period average order value */
  previousAverageOrderValue: Scalars['Int']['output'];
  /** Previous period items sold */
  previousItemsSold: Scalars['Int']['output'];
  /** Previous period orders */
  previousOrders: Scalars['Int']['output'];
  /** Previous period revenue */
  previousRevenue: Scalars['Int']['output'];
  /** Previous period unique products sold */
  previousUniqueProductsSold: Scalars['Int']['output'];
  /** Revenue change percentage */
  revenueChangePercent: Scalars['Float']['output'];
  /** Total items sold */
  totalItemsSold: Scalars['Int']['output'];
  /** Total orders with products */
  totalOrders: Scalars['Int']['output'];
  /** Total product revenue in period */
  totalRevenue: Scalars['Int']['output'];
  /** Number of unique products sold */
  uniqueProductsSold: Scalars['Int']['output'];
};

export type ProductCategory = {
  __typename?: 'ProductCategory';
  _id: Scalars['ID']['output'];
  /** Child categories */
  children: Array<ProductCategory>;
  /** Category color (hex code) */
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Category description */
  description?: Maybe<Scalars['String']['output']>;
  /** Display order */
  displayOrder: Scalars['Int']['output'];
  /** Category icon (emoji or icon name) */
  icon?: Maybe<Scalars['String']['output']>;
  /** Category image URL */
  imageUrl?: Maybe<Scalars['String']['output']>;
  /** Is category active */
  isActive: Scalars['Boolean']['output'];
  /** Category name */
  name: Scalars['String']['output'];
  /** Parent category */
  parent?: Maybe<ProductCategory>;
  /** Parent category ID */
  parentId?: Maybe<Scalars['ID']['output']>;
  /** Number of products in this category */
  productCount: Scalars['Int']['output'];
  /** Shop ID (for shop-specific categories) */
  shopId?: Maybe<Scalars['ID']['output']>;
  /** URL-friendly slug */
  slug: Scalars['String']['output'];
  /** Category type/scope */
  type: CategoryType;
  updatedAt: Scalars['DateTime']['output'];
  /** Category venue */
  venue?: Maybe<Venue>;
  /** Venue ID (for venue-specific categories) */
  venueId?: Maybe<Scalars['ID']['output']>;
};

/** A Relay-style connection for ProductCategory items. */
export type ProductCategoryConnection = {
  __typename?: 'ProductCategoryConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<ProductCategoryEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the ProductCategoryConnection. */
export type ProductCategoryEdge = {
  __typename?: 'ProductCategoryEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: ProductCategory;
};

/** A Relay-style connection for Product items. */
export type ProductConnection = {
  __typename?: 'ProductConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<ProductEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the ProductConnection. */
export type ProductEdge = {
  __typename?: 'ProductEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Product;
};

export type ProductFilterInput = {
  /** Filter by category ID */
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  /** Filter featured only */
  featuredOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter in stock only */
  inStockOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Include all statuses (for management) */
  includeAllStatuses?: InputMaybe<Scalars['Boolean']['input']>;
  /** Max price */
  maxPrice?: InputMaybe<Scalars['Int']['input']>;
  /** Min price */
  minPrice?: InputMaybe<Scalars['Int']['input']>;
  /** Filter popular only */
  popularOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by product type */
  productType?: InputMaybe<ProductType>;
  /** Search by name/description */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  /** Filter by shop ID */
  shopId?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by status */
  status?: InputMaybe<ProductStatus>;
  /** Filter by venue ID */
  venueId?: InputMaybe<Scalars['ID']['input']>;
};

export type ProductHourlySales = {
  __typename?: 'ProductHourlySales';
  /** Hour (e.g., 06, 07, 08...) */
  hour: Scalars['String']['output'];
  /** Intensity 0-1 for heatmap */
  intensity: Scalars['Float']['output'];
  /** Number of items sold */
  quantitySold: Scalars['Int']['output'];
  /** Revenue */
  revenue: Scalars['Int']['output'];
};

export type ProductImage = {
  __typename?: 'ProductImage';
  /** Alt text for accessibility */
  alt?: Maybe<Scalars['String']['output']>;
  /** BlurHash placeholder for instant preview. */
  blurhash?: Maybe<Scalars['String']['output']>;
  /** Display order */
  displayOrder: Scalars['Int']['output'];
  /** Image height in pixels. */
  height?: Maybe<Scalars['Int']['output']>;
  /** Is primary image */
  isPrimary: Scalars['Boolean']['output'];
  /** ~800px medium variant. */
  mediumUrl?: Maybe<Scalars['String']['output']>;
  /** ~200px thumbnail variant. */
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
  /** Image URL */
  url: Scalars['String']['output'];
  /** Image width in pixels. */
  width?: Maybe<Scalars['Int']['output']>;
};

export type ProductImageInput = {
  /** Alt text */
  alt?: InputMaybe<Scalars['String']['input']>;
  /** Display order */
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Is primary image */
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>;
  /** Image URL */
  url: Scalars['String']['input'];
};

export type ProductPerformance = {
  __typename?: 'ProductPerformance';
  /** Average quantity per order */
  avgQuantityPerOrder: Scalars['Float']['output'];
  /** Category ID */
  categoryId: Scalars['String']['output'];
  /** Category name */
  categoryName: Scalars['String']['output'];
  /** Product image URL */
  imageUrl?: Maybe<Scalars['String']['output']>;
  /** Number of orders containing this product */
  orderCount: Scalars['Int']['output'];
  /** Previous period quantity sold */
  previousQuantitySold: Scalars['Int']['output'];
  /** Previous period rank (null if new) */
  previousRank?: Maybe<Scalars['Int']['output']>;
  /** Previous period revenue */
  previousRevenue: Scalars['Int']['output'];
  /** Product ID */
  productId: Scalars['String']['output'];
  /** Product name */
  productName: Scalars['String']['output'];
  /** Quantity growth compared to previous period (%) */
  quantityGrowth: Scalars['Float']['output'];
  /** Total quantity sold */
  quantitySold: Scalars['Int']['output'];
  /** Rank by revenue (1 = best seller) */
  rank: Scalars['Int']['output'];
  /** Total revenue from this product */
  revenue: Scalars['Int']['output'];
  /** Revenue growth compared to previous period (%) */
  revenueGrowth: Scalars['Float']['output'];
  /** Percentage of total product revenue */
  revenuePercentage: Scalars['Float']['output'];
  /** Product SKU */
  sku?: Maybe<Scalars['String']['output']>;
  /** Unit price */
  unitPrice: Scalars['Int']['output'];
};

export type ProductPerformanceReport = {
  __typename?: 'ProductPerformanceReport';
  importHistory: Array<StockMovement>;
  period: ProductReportPeriodInfo;
  product: ProductPerformanceSnapshot;
  recentMovements: Array<StockMovement>;
  summary: ProductPerformanceReportSummary;
  trend: Array<ProductSalesDataPoint>;
};

export type ProductPerformanceReportSummary = {
  __typename?: 'ProductPerformanceReportSummary';
  cogs: Scalars['Int']['output'];
  grossProfit: Scalars['Int']['output'];
  orderCount: Scalars['Int']['output'];
  previousRevenue: Scalars['Int']['output'];
  previousSoldQuantity: Scalars['Int']['output'];
  profitMargin: Scalars['Float']['output'];
  rank?: Maybe<Scalars['Int']['output']>;
  revenue: Scalars['Int']['output'];
  revenuePercentage: Scalars['Float']['output'];
  soldQuantity: Scalars['Int']['output'];
};

export type ProductPerformanceSnapshot = {
  __typename?: 'ProductPerformanceSnapshot';
  averageCost?: Maybe<Scalars['Int']['output']>;
  categoryId: Scalars['String']['output'];
  categoryName: Scalars['String']['output'];
  hasVariants: Scalars['Boolean']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  productId: Scalars['String']['output'];
  productName: Scalars['String']['output'];
  sku?: Maybe<Scalars['String']['output']>;
  status: ProductStatus;
  stockQuantity: Scalars['Int']['output'];
  trackInventory: Scalars['Boolean']['output'];
  unit: Scalars['String']['output'];
  unitPrice: Scalars['Int']['output'];
  variantCount: Scalars['Int']['output'];
  venueId?: Maybe<Scalars['String']['output']>;
  venueName?: Maybe<Scalars['String']['output']>;
};

export type ProductProfitItem = {
  __typename?: 'ProductProfitItem';
  /** Cost of goods sold */
  cogs: Scalars['Float']['output'];
  /** Gross profit (revenue - COGS) */
  grossProfit: Scalars['Float']['output'];
  productId: Scalars['ID']['output'];
  productName: Scalars['String']['output'];
  /** Profit margin percentage */
  profitMargin: Scalars['Float']['output'];
  /** Total revenue */
  revenue: Scalars['Float']['output'];
  /** Total quantity sold */
  soldQuantity: Scalars['Int']['output'];
};

export type ProductReportFilterInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  compareMode?: InputMaybe<FinanceCompareMode>;
  /** Include period-to-date comparison with previous period */
  compareToPrevious?: InputMaybe<Scalars['Boolean']['input']>;
  /** Start date (YYYY-MM-DD) in filter timezone */
  from: Scalars['String']['input'];
  /** Only low-stock or out-of-stock products */
  lowStockOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Search product name or SKU */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  /** Only products with sales in the selected period */
  soldInPeriodOnly?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<ProductStatus>;
  /** Pagination for the products table section */
  tablePagination?: InputMaybe<CursorPageInput>;
  /** IANA timezone for date boundaries */
  timezone?: InputMaybe<Scalars['String']['input']>;
  /** End date (YYYY-MM-DD) in filter timezone */
  to: Scalars['String']['input'];
  /** Venue IDs to include. Empty/null = all venues user can view analytics for. */
  venueIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type ProductReportPeriodInfo = {
  __typename?: 'ProductReportPeriodInfo';
  from: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
  to: Scalars['String']['output'];
};

export type ProductReportRow = {
  __typename?: 'ProductReportRow';
  averageCost?: Maybe<Scalars['Int']['output']>;
  categoryId: Scalars['String']['output'];
  categoryName: Scalars['String']['output'];
  cogs: Scalars['Int']['output'];
  grossProfit: Scalars['Int']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  previousRevenue: Scalars['Int']['output'];
  previousSoldQuantity: Scalars['Int']['output'];
  productId: Scalars['String']['output'];
  productName: Scalars['String']['output'];
  profitMargin: Scalars['Float']['output'];
  rank?: Maybe<Scalars['Int']['output']>;
  revenue: Scalars['Int']['output'];
  revenueGrowth: Scalars['Float']['output'];
  revenuePercentage: Scalars['Float']['output'];
  sku?: Maybe<Scalars['String']['output']>;
  soldQuantity: Scalars['Int']['output'];
  status: ProductStatus;
  stockQuantity: Scalars['Int']['output'];
  trackInventory: Scalars['Boolean']['output'];
  unitPrice: Scalars['Int']['output'];
  venueId?: Maybe<Scalars['String']['output']>;
  venueName?: Maybe<Scalars['String']['output']>;
};

/** A Relay-style connection for ProductReportRow items. */
export type ProductReportRowConnection = {
  __typename?: 'ProductReportRowConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<ProductReportRowEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the ProductReportRowConnection. */
export type ProductReportRowEdge = {
  __typename?: 'ProductReportRowEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: ProductReportRow;
};

export type ProductReportScope = {
  __typename?: 'ProductReportScope';
  mode: ProductReportScopeMode;
  venueCount: Scalars['Int']['output'];
  venueIds?: Maybe<Array<Scalars['String']['output']>>;
  venueNames: Array<Scalars['String']['output']>;
};

export enum ProductReportScopeMode {
  Portfolio = 'PORTFOLIO',
  Single = 'SINGLE'
}

export type ProductReportSummary = {
  __typename?: 'ProductReportSummary';
  bestSellingCategory: Scalars['String']['output'];
  bestSellingProduct: Scalars['String']['output'];
  grossProfit: Scalars['Int']['output'];
  grossProfitChangePercent: Scalars['Float']['output'];
  grossProfitMarginPercent: Scalars['Float']['output'];
  itemsChangePercent: Scalars['Float']['output'];
  ordersChangePercent: Scalars['Float']['output'];
  peakDay: Scalars['String']['output'];
  peakHour: Scalars['String']['output'];
  previousCogs: Scalars['Int']['output'];
  previousGrossProfit: Scalars['Int']['output'];
  previousItemsSold: Scalars['Int']['output'];
  previousOrders: Scalars['Int']['output'];
  previousRevenue: Scalars['Int']['output'];
  previousUniqueProductsSold: Scalars['Int']['output'];
  revenueChangePercent: Scalars['Float']['output'];
  totalCogs: Scalars['Int']['output'];
  totalItemsSold: Scalars['Int']['output'];
  totalOrders: Scalars['Int']['output'];
  totalRevenue: Scalars['Int']['output'];
  uniqueProductsSold: Scalars['Int']['output'];
};

export type ProductSalesAnalytics = {
  __typename?: 'ProductSalesAnalytics';
  /** Worst performing products (declining sales) */
  decliningProducts: Array<ProductPerformance>;
  /** Hourly sales distribution */
  hourlySales: Array<ProductHourlySales>;
  /** Inventory status summary */
  inventoryStatus: InventoryStatus;
  /** Analytics period (week, month, quarter, year) */
  period: Scalars['String']['output'];
  /** Sales by category */
  salesByCategory: Array<CategorySalesPerformance>;
  /** Sales by day/period */
  salesByPeriod: Array<ProductSalesDataPoint>;
  /** Sales trend over months */
  salesTrend: Array<ProductSalesDataPoint>;
  /** Products with stock alerts */
  stockAlerts: Array<StockAlertProduct>;
  /** Summary statistics */
  summary: ProductAnalyticsSummary;
  /** Top performing products */
  topProducts: Array<ProductPerformance>;
  /** Venue ID */
  venueId: Scalars['String']['output'];
  /** Venue name */
  venueName: Scalars['String']['output'];
};

export type ProductSalesDataPoint = {
  __typename?: 'ProductSalesDataPoint';
  /** Label (e.g., T2, T3, 01/01...) */
  label: Scalars['String']['output'];
  /** Number of orders containing products */
  orderCount: Scalars['Int']['output'];
  /** Previous period revenue for comparison */
  previousRevenue?: Maybe<Scalars['Int']['output']>;
  /** Number of items sold */
  quantitySold: Scalars['Int']['output'];
  /** Revenue value */
  revenue: Scalars['Int']['output'];
};

export type ProductSortInput = {
  /** Sort field */
  sortBy?: InputMaybe<Scalars['String']['input']>;
  /** Sort order */
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};

export type ProductStats = {
  __typename?: 'ProductStats';
  /** Active products */
  activeProducts: Scalars['Int']['output'];
  /** Draft products */
  draftProducts: Scalars['Int']['output'];
  /** Low stock products */
  lowStockProducts: Scalars['Int']['output'];
  /** Out of stock products */
  outOfStockProducts: Scalars['Int']['output'];
  /** Total categories */
  totalCategories: Scalars['Int']['output'];
  /** Total products */
  totalProducts: Scalars['Int']['output'];
};

/** Status of product */
export enum ProductStatus {
  Active = 'ACTIVE',
  Draft = 'DRAFT',
  Inactive = 'INACTIVE',
  OutOfStock = 'OUT_OF_STOCK'
}

/** Type of product */
export enum ProductType {
  Digital = 'DIGITAL',
  Physical = 'PHYSICAL',
  Service = 'SERVICE'
}

export type ProductVariant = {
  __typename?: 'ProductVariant';
  _id: Scalars['ID']['output'];
  /** Compare at price (original price for sale) */
  compareAtPrice?: Maybe<Scalars['Int']['output']>;
  /** Cost price (for profit calculation) */
  costPrice?: Maybe<Scalars['Int']['output']>;
  /** Display order */
  displayOrder: Scalars['Int']['output'];
  /** Variant image URL */
  imageUrl?: Maybe<Scalars['String']['output']>;
  /** Is variant active */
  isActive: Scalars['Boolean']['output'];
  /** Variant name (e.g., "Size L - Red") */
  name: Scalars['String']['output'];
  /** Variant options (e.g., [{ name: "Size", value: "L" }]) */
  options?: Maybe<Array<VariantOption>>;
  /** Variant price */
  price: Scalars['Int']['output'];
  /** Variant SKU */
  sku: Scalars['String']['output'];
  /** Stock quantity (-1 for unlimited) */
  stockQuantity: Scalars['Int']['output'];
};

export type ProductVariantInput = {
  /** Variant ID (for update) */
  _id?: InputMaybe<Scalars['ID']['input']>;
  /** Compare at price */
  compareAtPrice?: InputMaybe<Scalars['Int']['input']>;
  /** Cost price */
  costPrice?: InputMaybe<Scalars['Int']['input']>;
  /** Display order */
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Variant image URL */
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Is variant active */
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** Variant name */
  name: Scalars['String']['input'];
  /** Variant options */
  options?: InputMaybe<Array<VariantOptionInput>>;
  /** Variant price */
  price: Scalars['Int']['input'];
  /** Variant SKU */
  sku: Scalars['String']['input'];
  /** Stock quantity */
  stockQuantity?: InputMaybe<Scalars['Int']['input']>;
};

export type PromoCodeValidationResult = {
  __typename?: 'PromoCodeValidationResult';
  /** Error message if invalid */
  errorMessage?: Maybe<Scalars['String']['output']>;
  /** Estimated discount amount */
  estimatedDiscount?: Maybe<Scalars['Int']['output']>;
  /** Is code valid */
  isValid: Scalars['Boolean']['output'];
  /** Promotion details if valid */
  promotion?: Maybe<Promotion>;
};

export type Promotion = {
  __typename?: 'Promotion';
  _id: Scalars['ID']['output'];
  /** Time ranges when promotion applies (PER_HOUR only); null = all hours */
  applicableTimeRanges?: Maybe<Array<TimeRange>>;
  /** Level at which discount is applied (bookings only) */
  applyLevel: PromotionApplyLevel;
  /** Badge color (hex) */
  badgeColor?: Maybe<Scalars['String']['output']>;
  /** Badge/Tag text for venue card */
  badgeText?: Maybe<Scalars['String']['output']>;
  /** Banner image URL */
  bannerImageUrl?: Maybe<Scalars['String']['output']>;
  /** Promotion category */
  category: PromotionCategory;
  /** Promo code (for CODE trigger) */
  code?: Maybe<Scalars['String']['output']>;
  /** Specific court IDs (when scope is SPECIFIC_COURTS) */
  courtIds?: Maybe<Array<Scalars['ID']['output']>>;
  createdAt: Scalars['DateTime']['output'];
  /** Created by user ID */
  createdBy: Scalars['ID']['output'];
  /** Staff or owner who created this promotion */
  createdByUser?: Maybe<User>;
  /** Full description */
  description?: Maybe<Scalars['String']['output']>;
  /** Display order */
  displayOrder: Scalars['Int']['output'];
  /** Promotion end date */
  endDate: Scalars['DateTime']['output'];
  /** Whether promotion can stack with others */
  isStackable: Scalars['Boolean']['output'];
  /** Has reached usage limit */
  isUsageLimitReached: Scalars['Boolean']['output'];
  /** Is currently within active date range */
  isWithinDateRange: Scalars['Boolean']['output'];
  /** Maximum discount amount (for percentage type) */
  maxDiscountAmount?: Maybe<Scalars['Int']['output']>;
  /** Minimum booking amount required */
  minBookingAmount?: Maybe<Scalars['Int']['output']>;
  /** Promotion name */
  name: Scalars['String']['output'];
  /** Per user usage limit; omit or null = no limit */
  perUserLimit?: Maybe<Scalars['Int']['output']>;
  /** Priority for application order (higher = applied first) */
  priority: Scalars['Int']['output'];
  /** Specific product category IDs (when scope is PRODUCTS) */
  productCategoryIds?: Maybe<Array<Scalars['ID']['output']>>;
  /** Rejection reason */
  rejectionReason?: Maybe<Scalars['String']['output']>;
  /** Remaining usage count */
  remainingUsage?: Maybe<Scalars['Int']['output']>;
  /** Review date */
  reviewedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Approved/Rejected by user ID */
  reviewedBy?: Maybe<Scalars['ID']['output']>;
  /** Owner who reviewed (approved/rejected) this promotion */
  reviewedByUser?: Maybe<User>;
  /** Where promotion applies */
  scope: PromotionScope;
  /** Short description for display */
  shortDescription?: Maybe<Scalars['String']['output']>;
  /** Show as banner */
  showAsBanner: Scalars['Boolean']['output'];
  /** Show on venue card */
  showOnVenueCard: Scalars['Boolean']['output'];
  /** Specific sport types (when scope is SPECIFIC_SPORT) */
  sportTypes?: Maybe<Array<SportType>>;
  /** Rules for combining with other promotions */
  stackingRules?: Maybe<StackingRules>;
  /** Promotion start date */
  startDate: Scalars['DateTime']['output'];
  /** Current status */
  status: PromotionStatus;
  /** Total usage limit (null = unlimited) */
  totalUsageLimit?: Maybe<Scalars['Int']['output']>;
  /** How promotion is triggered */
  trigger: PromotionTrigger;
  /** Type of discount */
  type: PromotionType;
  updatedAt: Scalars['DateTime']['output'];
  /** Current total usage count */
  usageCount: Scalars['Int']['output'];
  /** Per-user usage records */
  usageRecords?: Maybe<Array<PromotionUsageRecord>>;
  /** Discount value (percentage or fixed amount) */
  value: Scalars['Int']['output'];
  /** Venue ID */
  venueId: Scalars['ID']['output'];
};

/** Level at which discount is applied for bookings */
export enum PromotionApplyLevel {
  PerHour = 'PER_HOUR',
  Total = 'TOTAL'
}

/** Category of promotion for display and eligibility */
export enum PromotionCategory {
  FirstBooking = 'FIRST_BOOKING',
  Loyalty = 'LOYALTY',
  Recurring = 'RECURRING',
  Voucher = 'VOUCHER'
}

/** A Relay-style connection for Promotion items. */
export type PromotionConnection = {
  __typename?: 'PromotionConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<PromotionEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the PromotionConnection. */
export type PromotionEdge = {
  __typename?: 'PromotionEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Promotion;
};

export type PromotionFilterInput = {
  /** Filter by date - promotions active on this date */
  activeOnDate?: InputMaybe<Scalars['String']['input']>;
  /** Filter active only (within date range and ACTIVE status) */
  activeOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by category(ies) */
  categories?: InputMaybe<Array<PromotionCategory>>;
  /** Search by promo code */
  code?: InputMaybe<Scalars['String']['input']>;
  /** Filter by court ID */
  courtId?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by creator user ID */
  createdBy?: InputMaybe<Scalars['ID']['input']>;
  /** Filter promotions ending before this date */
  endDateTo?: InputMaybe<Scalars['String']['input']>;
  /** Filter promotions needing approval */
  pendingApprovalOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by scope(s) */
  scopes?: InputMaybe<Array<PromotionScope>>;
  /** Search by name/description */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  /** Show as banner filter */
  showAsBanner?: InputMaybe<Scalars['Boolean']['input']>;
  /** Show on venue card filter */
  showOnVenueCard?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by sport type(s) */
  sportTypes?: InputMaybe<Array<SportType>>;
  /** Filter stackable promotions only */
  stackableOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter promotions starting from this date */
  startDateFrom?: InputMaybe<Scalars['String']['input']>;
  /** Filter by status(es) */
  statuses?: InputMaybe<Array<PromotionStatus>>;
  /** Filter by trigger(s) */
  triggers?: InputMaybe<Array<PromotionTrigger>>;
  /** Filter by type(s) */
  types?: InputMaybe<Array<PromotionType>>;
  /** Filter by venue ID */
  venueId?: InputMaybe<Scalars['ID']['input']>;
};

/** Scope of promotion application */
export enum PromotionScope {
  All = 'ALL',
  AllCourts = 'ALL_COURTS',
  Products = 'PRODUCTS',
  SpecificCourts = 'SPECIFIC_COURTS',
  SpecificSport = 'SPECIFIC_SPORT'
}

export type PromotionSortInput = {
  /** Sort field */
  sortBy?: InputMaybe<Scalars['String']['input']>;
  /** Sort order */
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};

export type PromotionStats = {
  __typename?: 'PromotionStats';
  /** Active promotions */
  active: Scalars['Int']['output'];
  /** Cancelled promotions */
  cancelled: Scalars['Int']['output'];
  /** Draft promotions */
  draft: Scalars['Int']['output'];
  /** Expired promotions */
  expired: Scalars['Int']['output'];
  /** Paused promotions */
  paused: Scalars['Int']['output'];
  /** Pending approval */
  pendingApproval: Scalars['Int']['output'];
  /** Total promotions */
  total: Scalars['Int']['output'];
  /** Total discount given */
  totalDiscountGiven: Scalars['Int']['output'];
  /** Total usage across all promotions */
  totalUsage: Scalars['Int']['output'];
};

/** Status of the promotion */
export enum PromotionStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Draft = 'DRAFT',
  Expired = 'EXPIRED',
  Paused = 'PAUSED',
  PendingApproval = 'PENDING_APPROVAL'
}

/** How the promotion is triggered */
export enum PromotionTrigger {
  Auto = 'AUTO',
  Code = 'CODE'
}

/** Type of discount calculation */
export enum PromotionType {
  FixedAmount = 'FIXED_AMOUNT',
  Percentage = 'PERCENTAGE'
}

export type PromotionUsageRecord = {
  __typename?: 'PromotionUsageRecord';
  /** Number of times used */
  count: Scalars['Int']['output'];
  /** Last used date */
  lastUsedAt: Scalars['DateTime']['output'];
  /** User ID */
  userId: Scalars['ID']['output'];
};

export type QrAnalyticsSummary = {
  __typename?: 'QrAnalyticsSummary';
  /** Total active campaigns */
  activeCampaigns: Scalars['Int']['output'];
  /** Overall Android percentage */
  androidPercentage: Scalars['Float']['output'];
  /** Overall iOS percentage */
  iosPercentage: Scalars['Float']['output'];
  /** Total scans across all campaigns */
  totalScans: Scalars['Int']['output'];
  /** Daily scan trend across all campaigns */
  trend: Array<QrScanTrendPoint>;
  /** Total unique devices (estimated) */
  uniqueDevices: Scalars['Int']['output'];
};

export type QrCampaign = {
  __typename?: 'QrCampaign';
  _id: Scalars['ID']['output'];
  /** Scans from Android devices */
  androidScans: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Admin user who created this campaign */
  createdBy: Scalars['ID']['output'];
  /** Optional campaign description */
  description?: Maybe<Scalars['String']['output']>;
  /** Campaign expiry date */
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  /** Scans from iOS devices */
  iosScans: Scalars['Int']['output'];
  /** Whether this campaign is active */
  isActive: Scalars['Boolean']['output'];
  /** Location where the QR code is placed */
  location?: Maybe<Scalars['String']['output']>;
  /** JSON metadata for flexible data */
  metadata?: Maybe<Scalars['String']['output']>;
  /** Human-readable campaign name */
  name: Scalars['String']['output'];
  /** URL-safe unique slug for this campaign */
  slug: Scalars['String']['output'];
  /** Total number of QR scans */
  totalScans: Scalars['Int']['output'];
  /** Estimated unique devices (by session ID) */
  uniqueDevices: Scalars['Int']['output'];
  /** Scans from unknown OS devices */
  unknownScans: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** A Relay-style connection for QrCampaign items. */
export type QrCampaignConnection = {
  __typename?: 'QrCampaignConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<QrCampaignEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the QrCampaignConnection. */
export type QrCampaignEdge = {
  __typename?: 'QrCampaignEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: QrCampaign;
};

export type QrCampaignFilterInput = {
  /** Filter scans from date */
  from?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter by active status */
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** Search by name, slug, or location */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter scans to date */
  to?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QrCampaignStats = {
  __typename?: 'QrCampaignStats';
  /** Android percentage of total scans */
  androidPercentage: Scalars['Float']['output'];
  /** Android scans */
  androidScans: Scalars['Int']['output'];
  /** iOS percentage of total scans */
  iosPercentage: Scalars['Float']['output'];
  /** iOS scans */
  iosScans: Scalars['Int']['output'];
  /** Top cities by scan count */
  topCities: Array<QrTopCity>;
  /** Total scans */
  totalScans: Scalars['Int']['output'];
  /** Daily scan trend for chart */
  trend: Array<QrScanTrendPoint>;
  /** Unique devices (estimated) */
  uniqueDevices: Scalars['Int']['output'];
  /** Unknown OS scans */
  unknownScans: Scalars['Int']['output'];
};

/** Where the user was redirected after scanning */
export enum QrRedirectTarget {
  AppStore = 'APP_STORE',
  Fallback = 'FALLBACK',
  PlayStore = 'PLAY_STORE'
}

export type QrScanTrendPoint = {
  __typename?: 'QrScanTrendPoint';
  /** Android scans on this date */
  android: Scalars['Int']['output'];
  /** iOS scans on this date */
  ios: Scalars['Int']['output'];
  /** Date label (YYYY-MM-DD) */
  label: Scalars['String']['output'];
  /** Total scans on this date */
  total: Scalars['Int']['output'];
};

export type QrTopCity = {
  __typename?: 'QrTopCity';
  /** City name */
  city: Scalars['String']['output'];
  /** Country code */
  country?: Maybe<Scalars['String']['output']>;
  /** Number of scans from this city */
  scans: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Get active promotions for a venue (public). Pass userId to hide promotions where user has reached perUserLimit. When the caller is authenticated as venue staff/owner (or admin), all active promotions are returned including those hidden from customers. */
  activeVenuePromotions: Array<Promotion>;
  /** Get all bookings (Admin only, cursor) */
  adminAllBookingsConnection: AdminAllBookingConnection;
  /** Get system statistics (Admin only) */
  adminGetSystemStats: SystemStats;
  /** Get pending venue requests (Admin only, cursor) */
  adminPendingVenuesConnection: VenueConnection;
  /** Get bookings for a specific user (Super Admin only, cursor) */
  adminUserBookingsConnection: AdminBookingItemConnection;
  /** Get all users (Super Admin only, cursor) */
  adminUsersConnection: UserConnection;
  /** Get all venue requests with filters (Admin only, cursor) */
  allVenueRequestsConnection: VenueRequestConnection;
  /** Get a single audit log by ID (Admin only) */
  auditLogDetail: AuditLog;
  /** Get paginated audit logs (Admin only, cursor) */
  auditLogsConnection: AuditLogConnection;
  /** Get audit statistics (Admin only) */
  auditStats: AuditStats;
  /** Cursor-paginated available public passes */
  availablePassesConnection: BookingPassConnection;
  /** Get available promotions for a booking */
  availablePromotionsForBooking: AvailablePromotionsForBooking;
  /** Top N pass có giảm giá >= 20% so với giá gốc (cho section "Giảm sâu"). */
  bestDealPasses: Array<BookingPass>;
  /** Get booking by ID */
  booking: Booking;
  /** Get combined invoice for a booking */
  bookingInvoice: BookingInvoice;
  /** Get booking pass by ID */
  bookingPass: BookingPass;
  /** [Admin] Chi tiết báo cáo pass sân */
  bookingPassReport: BookingPassReport;
  /** [Admin] Cursor-paginated booking pass reports */
  bookingPassReportsConnection: BookingPassReportConnection;
  /** Get booking statistics */
  bookingStats: BookingStats;
  /** Preview trước khi bốc thăm: kiểm tra nếu cần tự động giảm kích thước nhánh đấu (organizer only) */
  bracketDrawPreview: BracketDrawPreview;
  /** Calculate discount for a booking */
  calculateBookingDiscount: DiscountCalculationResult;
  /** Calculate discount for a product order */
  calculateOrderDiscount: DiscountCalculationResult;
  /** Thống kê chi tiết campaign */
  campaignStats: CampaignStats;
  /** Check if a booking can be passed */
  canPassBooking: CanPassBookingResult;
  /** Get categories with filters (cursor) */
  categoriesConnection: ProductCategoryConnection;
  /** Get category by ID */
  category: ProductCategory;
  /** Get category tree */
  categoryTree: Array<CategoryTree>;
  /** Check if email exists */
  checkEmailExists: Scalars['Boolean']['output'];
  /** Check if phone exists */
  checkPhoneExists: Scalars['Boolean']['output'];
  /** Check availability for recurring booking. Supports single-day and multi-day bookings. */
  checkRecurringAvailability: RecurringAvailabilityCheck;
  /** Check if SKU is available */
  checkSkuAvailability: SkuAvailabilityResult;
  /** Check if username exists */
  checkUserNameExists: Scalars['Boolean']['output'];
  /** Get a single claim request by ID */
  claimRequest?: Maybe<VenueClaimRequest>;
  /** Get claim request statistics - Admin only */
  claimRequestStats: ClaimRequestStats;
  /** Cursor-paginated claim requests — Admin only. */
  claimRequestsConnection: VenueClaimRequestConnection;
  /** Cursor-paginated replies to a parent comment. */
  commentRepliesConnection: PostCommentConnection;
  /** Public list of referees who confirmed participation (name + role only) */
  confirmedTournamentReferees: Array<TournamentRefereePublic>;
  /** Get contact inquiries via cursor connection (Admin only) */
  contactInquiriesConnection: ContactInquiryConnection;
  /** Get conversations for current user (cursor) */
  conversationsConnection: ConversationConnection;
  /** Get court by ID */
  court: Court;
  /** Get current active legal documents (ToS and Privacy Policy) */
  currentLegalDocuments: CurrentLegalDocuments;
  /** Export all registrations without pagination (organizer only, max 2000) */
  exportTournamentRegistrations: Array<TournamentRegistration>;
  /** Cursor-paginated current user's favorite venues. */
  favoriteVenuesConnection: VenueConnection;
  /** Host đang theo dõi (cursor) */
  followedHostsConnection: FollowedHostConnection;
  /** Danh sách người tham gia kèo (cursor) */
  gameParticipantsConnection: PickupGameParticipantConnection;
  /** Generate branded SVG QR code for a campaign (Admin only) */
  generateQrCode: Scalars['String']['output'];
  /** Get available promotions for product orders */
  getAvailableOrderPromotions: Array<Promotion>;
  /** Get list of blocked users */
  getBlockedUsers: Array<UserBlock>;
  /** Get a single contact inquiry by ID (Admin only) */
  getContactInquiry: ContactInquiry;
  /** Get contact inquiry stats by status (Admin only) */
  getContactInquiryStats: ContactInquiryStats;
  /** Get a conversation by ID */
  getConversation: Conversation;
  /** Get followers of a user */
  getFollowers: Array<User>;
  /** Get users that a user is following */
  getFollowing: Array<User>;
  /** Get a single group by ID */
  getGroup: Group;
  /** Get growth statistics for the dashboard (Admin only) */
  getGrowthStats: GrowthStats;
  /** Get inventory report for venue */
  getInventoryReport: InventoryReport;
  /** Get a single message report by ID (Admin only) */
  getMessageReportById: MessageReport;
  /** Get message report statistics (Admin only) */
  getMessageReportStats: MessageReportStats;
  /** Get a single notification by ID */
  getNotification: Notification;
  /** Get partner leaderboard for the dashboard (Admin only) */
  getPartnerLeaderboard: PartnerLeaderboard;
  /** Get pinned messages in a conversation */
  getPinnedMessages: Array<Message>;
  /** Get a single post by ID */
  getPost: Post;
  /** Get a single post report by ID (Admin only) */
  getPostReportById: PostReport;
  /** Get post report statistics (Admin only) */
  getPostReportStats: PostReportStats;
  /** Get all post reports with filters (Admin only, cursor) */
  getPostReportsForAdminConnection: PostReportConnection;
  /** Get import history for a product */
  getProductImportHistory: Array<StockMovement>;
  /** Get profit report by product */
  getProductProfitReport: Array<ProductProfitItem>;
  /** Get aggregated QR analytics summary across all campaigns (Admin only) */
  getQrAnalyticsSummary: QrAnalyticsSummary;
  /** Get a single QR campaign by ID (Admin only) */
  getQrCampaign: QrCampaign;
  /** Get detailed analytics for a specific QR campaign (Admin only) */
  getQrCampaignStats: QrCampaignStats;
  /** Get referral code detail by ID (Admin only) */
  getReferralCodeDetail: ReferralCode;
  /** Get all referral codes (Admin only) */
  getReferralCodes: Array<ReferralCode>;
  /** Get total unread message count for user */
  getUnreadCount: Scalars['Int']['output'];
  /** Get unread notification count for current user */
  getUnreadNotificationCount: Scalars['Int']['output'];
  /** Get user by username */
  getUserByUserName: User;
  /** Get user profile by ID (authenticated) */
  getUserProfile: User;
  /** Get a single user report by ID (Admin only) */
  getUserReportById: UserReport;
  /** Get user report statistics (Admin only) */
  getUserReportStats: UserReportStats;
  /** Get all user reports with filters (Admin only, cursor) */
  getUserReportsForAdminConnection: UserReportConnection;
  /** Get members of a group (cursor) */
  groupMembersConnection: GroupMemberConnection;
  /** Get messages from a group chat (cursor) */
  groupMessagesConnection: GroupMessageConnection;
  /** Get pending join requests for a group (cursor, admin only) */
  groupPendingRequestsConnection: GroupMemberConnection;
  /** Get groups with filters (cursor) */
  groupsConnection: GroupConnection;
  /** Check if current user has bookmarked a post */
  hasBookmarkedPost: Scalars['Boolean']['output'];
  /** Check if current user has liked a comment */
  hasLikedComment: Scalars['Boolean']['output'];
  /** Check if current user has liked a post */
  hasLikedPost: Scalars['Boolean']['output'];
  /** Check if current user has reported a post */
  hasReportedPost: Scalars['Boolean']['output'];
  /** Check if current user has reported a user */
  hasReportedUser: Scalars['Boolean']['output'];
  /** Simple health check endpoint */
  health: Scalars['String']['output'];
  /** Detailed health check with database status */
  healthCheck: HealthStatus;
  /** Kèo của một host (cursor) */
  hostGamesConnection: PickupGameConnection;
  /** Check if current user is following a user */
  isFollowing: Scalars['Boolean']['output'];
  /** Check if current user is interested in a hold booking */
  isInterestedInBooking: Scalars['Boolean']['output'];
  /** Check if user is blocked */
  isUserBlocked: Scalars['Boolean']['output'];
  /** Get a specific legal document by type (active version) */
  legalDocument?: Maybe<LegalDocument>;
  /** Get a legal document by ID (admin only) */
  legalDocumentById?: Maybe<LegalDocument>;
  /** Get a specific version of a legal document */
  legalDocumentByVersion?: Maybe<LegalDocument>;
  /** Get all versions of a legal document type (admin only) */
  legalDocumentVersions: Array<LegalDocument>;
  /** Currently live matches */
  liveMatches: Array<TournamentMatch>;
  /** Lookup customer by phone for staff order creation */
  lookupCustomerByPhone?: Maybe<CustomerLookup>;
  /** Get low stock products */
  lowStockProducts: Array<Product>;
  /** Single match detail */
  matchDetail: TournamentMatch;
  /** Get live scorecard for a match */
  matchScorecard?: Maybe<MatchScorecard>;
  /** Get current user profile */
  me: User;
  /** Get all message reports (cursor, Admin only) */
  messageReportsConnection: MessageReportConnection;
  /** Get messages in a conversation (cursor) */
  messagesConnection: MessageConnection;
  /** Blacklist của tôi (cursor) */
  myBlacklistConnection: HostBlacklistConnection;
  /** Cursor-paginated bookings of the current customer (Relay-style). */
  myBookingsConnection: BookingConnection;
  /** Cursor-paginated current user's bookmarks. */
  myBookmarksConnection: PostBookmarkConnection;
  /** Lấy danh sách campaign của host hiện tại */
  myCampaigns: Array<PickupGameCampaign>;
  /** Cursor-paginated current user's claim requests. */
  myClaimRequestsConnection: VenueClaimRequestConnection;
  /** Template của tôi (cursor) */
  myGameTemplatesConnection: GameTemplateConnection;
  /** Get pending invitations for the current user (cursor) */
  myGroupInvitationsConnection: GroupMemberConnection;
  /** Get groups the current user is a member of (cursor) */
  myGroupsConnection: GroupConnection;
  /** Cursor-paginated hold bookings of the current customer */
  myHoldBookingsConnection: BookingConnection;
  /** Thống kê host */
  myHostStatistics: HostStatistics;
  /** Kèo tôi đã tạo (cursor) */
  myHostedGamesConnection: PickupGameConnection;
  /** Kèo tôi đã tham gia (cursor) */
  myJoinedGamesConnection: PickupGameConnection;
  /** Check if current user has accepted all required legal documents */
  myLegalAcceptanceStatus: LegalAcceptanceStatus;
  /** Cursor-paginated orders of the current customer */
  myOrdersConnection: OrderConnection;
  /** Cursor-paginated passes for the current user */
  myPassesConnection: BookingPassConnection;
  /** Get current user pending staff invitations */
  myPendingInvitations: Array<VenueStaff>;
  /** Cursor-paginated posts authored by the current user. */
  myPostsConnection: PostConnection;
  /** Đánh giá hiện tại của user cho 1 pass (nếu có). */
  myRatingForPass?: Maybe<TransferrerRating>;
  /** Cursor-paginated recurring master bookings of the current customer */
  myRecurringBookingsConnection: BookingConnection;
  /** Cursor-paginated current user's registrations */
  myRegistrationsConnection: TournamentRegistrationConnection;
  /** Kèo đã lưu (cursor) */
  mySavedGamesConnection: SavedGameConnection;
  /** List active login sessions for the current user */
  mySessions: Array<SessionInfo>;
  /** Cursor-paginated tournaments organized by current user */
  myTournamentsConnection: TournamentConnection;
  /** Get venue availability with user pending slots info */
  myVenueAvailability: VenueAvailability;
  /** Get my venue requests (cursor) */
  myVenueRequestsConnection: VenueRequestConnection;
  /** Cursor-paginated venues owned by the current user. */
  myVenuesConnection: VenueConnection;
  /** Get venues where user can transfer products to */
  myVenuesForProductTransfer: Array<Venue>;
  /** Get aggregated statistics across all venues owned or managed by user */
  myVenuesStats: MyVenuesStats;
  /** Tìm kèo gần đây (cursor) */
  nearbyPickupGamesConnection: NearbyPickupGameConnection;
  /** Cursor-paginated venues within radius. Sort: distance ASC (geo). */
  nearbyVenuesConnection: NearbyVenueConnection;
  /** Quick check if user needs to accept legal documents */
  needsToAcceptLegal: Scalars['Boolean']['output'];
  /** Cursor-paginated notifications feed (Relay-style). */
  notificationsConnection: NotificationConnection;
  /** Get order by ID */
  order: Order;
  /**
   * Get comprehensive order analytics
   * @deprecated Use venueFinanceReport instead.
   */
  orderAnalytics: OrderAnalytics;
  /** Get order by booking ID */
  orderByBookingId?: Maybe<Order>;
  /** Get order statistics */
  orderStats: OrderStats;
  /** Get all orders related to a booking */
  ordersByBookingId: Array<Order>;
  /** Cursor-paginated orders pending refund for a venue (Owner only) */
  ordersPendingRefundConnection: OrderConnection;
  /** Get OTP test phone by id (SUPER_ADMIN only) */
  otpTestPhone: OtpTestPhone;
  /** List OTP test phones (SUPER_ADMIN only, cursor) */
  otpTestPhonesConnection: OtpTestPhoneConnection;
  /** Get OTP test user grant by id (SUPER_ADMIN only) */
  otpTestUserGrant: OtpTestUserGrant;
  /** List OTP test user grants (SUPER_ADMIN only, cursor) */
  otpTestUserGrantsConnection: OtpTestUserGrantConnection;
  /** Cursor-paginated pending claim requests — Admin only. */
  pendingClaimRequestsConnection: VenueClaimRequestConnection;
  /** Get pending venue requests (Admin only, cursor) */
  pendingVenueRequestsConnection: VenueRequestConnection;
  /** Lấy chi tiết kèo */
  pickupGame?: Maybe<PickupGame>;
  /** Lấy chi tiết một campaign */
  pickupGameCampaign?: Maybe<PickupGameCampaign>;
  /** Lấy danh sách kèo giao lưu (cursor) */
  pickupGamesConnection: PickupGameConnection;
  /** Get popular/featured sports */
  popularSports: Array<Sport>;
  /** List portal capability grants (SUPER_ADMIN only, cursor) */
  portalCapabilityGrantsConnection: PortalCapabilityGrantConnection;
  /** Cursor-paginated top-level comments of a post. */
  postCommentsConnection: PostCommentConnection;
  /** Cursor-paginated likers of a post. */
  postLikersConnection: PostLikersConnection;
  /** Cursor-paginated posts feed (Relay-style). */
  postsConnection: PostConnection;
  /** Preview bulk import: kiểm tra các nội dung cần điều chỉnh kích thước nhánh đấu (organizer only) */
  previewBulkImport: PreviewBulkImportResult;
  /** Super Admin: preview eligible R1 BYE slots for late entry placement */
  previewLateEntryPlacement: LateEntryPlacementPreview;
  /** Preview manual knockout draw layout before saving (organizer only) */
  previewManualKnockoutDraw: ManualKnockoutDrawPreview;
  /** Preview drag-move without persisting */
  previewMoveMatch: MoveMatchPreviewResult;
  /** Dry-run preview: dồn liên tiếp các trận NOT_STARTED trên cùng sân/ngày (không ghi DB) */
  previewRepackCourtSchedule: RepackCourtSchedulePreviewResult;
  /** Get product by ID */
  product: Product;
  /** Get product by slug */
  productBySlug?: Maybe<Product>;
  /** Single-product performance drill-down report */
  productPerformanceReport: ProductPerformanceReport;
  /**
   * Get comprehensive product sales analytics for a venue
   * @deprecated Use venueFinanceReport (byRevenueStream.product) instead.
   */
  productSalesAnalytics: ProductSalesAnalytics;
  /** Get product statistics */
  productStats: ProductStats;
  /** Get products with filters (cursor) */
  productsConnection: ProductConnection;
  /** Get promotion by ID */
  promotion: Promotion;
  /** Get promotion statistics for a venue */
  promotionStats: PromotionStats;
  /** Get promotions with filters (cursor) */
  promotionsConnection: PromotionConnection;
  /** List all QR campaigns with optional filtering (Admin only, cursor) */
  qrCampaignsConnection: QrCampaignConnection;
  /** Get recurring booking details with all sessions */
  recurringBookingDetails: RecurringBookingDetails;
  /** Matches assigned to current user as referee */
  refereeMatches: Array<TournamentMatch>;
  /** Get referee workload statistics for a tournament */
  refereeWorkload: RefereeWorkloadResult;
  /** Hub header stats */
  scoreboardHubStats: ScoreboardHubStats;
  /** Default scoring preset for sport */
  scoreboardPreset: ScoringConfig;
  /** Get scoreboard session by ID */
  scoreboardSession: ScoreboardSession;
  /** Public viewer access by share token */
  scoreboardSessionByViewerToken: ScoreboardSession;
  /** List scoreboard sessions for hub tabs (cursor) */
  scoreboardSessionsConnection: ScoreboardSessionConnection;
  /** Search messages in a conversation (cursor) */
  searchMessagesConnection: MessageConnection;
  /** Search user by phone number (venue staff or admin only, for booking) */
  searchUserByPhone?: Maybe<UserContactLookup>;
  /** Search users by username (authenticated) */
  searchUsersByUserName: Array<User>;
  /** Server information */
  serverInfo: ServerInfo;
  /** Get a specific sport by type */
  sport?: Maybe<Sport>;
  /** Get all active sports with their configurations */
  sports: Array<Sport>;
  /** Cursor-paginated venues where the current user is staff. */
  staffedVenuesConnection: VenueConnection;
  /** Get stock movements (cursor) */
  stockMovementsConnection: StockMovementConnection;
  /** Giá pass đề xuất (median) dựa trên các pass COMPLETED 90 ngày qua. */
  suggestedPrice: SuggestedPrice;
  /** Get system categories */
  systemCategories: Array<ProductCategory>;
  /** Test query for notification service */
  testNotificationService: Scalars['String']['output'];
  /** Get tournament by ID */
  tournament: Tournament;
  /** Full bracket for a category */
  tournamentBracket: Array<TournamentMatch>;
  /** Categories for a tournament */
  tournamentCategories: Array<TournamentCategory>;
  /** Rankings for a specific group in a GROUP_KNOCKOUT category */
  tournamentGroupRankings: Array<PlayerRanking>;
  /** Cursor-paginated tournament matches with filters */
  tournamentMatchesConnection: TournamentMatchConnection;
  /** Rankings for a category */
  tournamentRankings: Array<PlayerRanking>;
  /** Get a single tournament referee by ID */
  tournamentReferee: TournamentReferee;
  /** List all referees in the tournament pool */
  tournamentReferees: Array<TournamentReferee>;
  /** Cursor-paginated registrations for a tournament (organizer) */
  tournamentRegistrationsConnection: TournamentRegistrationConnection;
  /** Tournament results/champions */
  tournamentResults: Array<TournamentChampion>;
  /** Tournament statistics */
  tournamentStats: TournamentStats;
  /** Cursor-paginated tournaments with filters */
  tournamentsConnection: TournamentConnection;
  /** Đánh giá đã nhận của 1 transferrer. */
  transferrerRatings: Array<TransferrerRating>;
  /** Trust stats cho 1 user (totalCreated, completionRate, pendingReports...) — dùng trên PassDetail. */
  transferrerStats: TransferrerStats;
  /** Top N pass sắp hết hạn trong 24h (cho marketplace section "Sắp hết hạn"). */
  urgentPasses: Array<BookingPass>;
  /** Cursor-paginated posts authored by a specific user. */
  userPostsConnection: PostConnection;
  /** Get user profile by ID */
  userProfile?: Maybe<User>;
  /** Validate QR code check-in */
  validateCheckInQr: Scalars['Boolean']['output'];
  /** Validate a promo code for product orders */
  validateOrderPromoCode: PromoCodeValidationResult;
  /** Validate a promo code */
  validatePromoCode: PromoCodeValidationResult;
  /** Validate a referral code (public - for mobile signup validation) */
  validateReferralCode: Scalars['Boolean']['output'];
  /** Get venue by ID */
  venue: Venue;
  /** Get venue activities (cursor) */
  venueActivitiesConnection: ActivityConnection;
  /**
   * Get comprehensive venue analytics
   * @deprecated Use venueFinanceReport (money) and venueOperationsReport (courts/occupancy) instead.
   */
  venueAnalytics: VenueAnalytics;
  /** Get venue availability */
  venueAvailability: VenueAvailability;
  /** Cursor-paginated venue bookings (for staff) */
  venueBookingsConnection: BookingConnection;
  /** Get venue categories (cursor) */
  venueCategoriesConnection: ProductCategoryConnection;
  /** Cursor-paginated courts for a venue. Sort: displayOrder ASC, name ASC. */
  venueCourtsConnection: CourtConnection;
  /** Permission-aware venue dashboard payload — field resolvers return null or empty shapes when staff lacks tier access */
  venueDashboardSummary: VenueDashboardSummary;
  /** Cursor-paginated venue operating expenses */
  venueExpensesConnection: VenueExpenseConnection;
  /** Export finance report as CSV content */
  venueFinanceExport: VenueFinanceExportResult;
  /** Multi-venue P&L portfolio summary */
  venueFinancePortfolio: VenueFinancePortfolio;
  /** Unified P&L finance report for one or more venues */
  venueFinanceReport: VenueFinanceReport;
  /** Cursor-paginated financial transactions (completed orders) */
  venueFinanceTransactionsConnection: FinanceTransactionConnection;
  /** Cursor-paginated hold bookings for a venue (staff) */
  venueHoldBookingsConnection: BookingConnection;
  /** Court operations report (schedule date axis) */
  venueOperationsReport: VenueOperationsReport;
  /** Cursor-paginated venue orders (for staff) */
  venueOrdersConnection: OrderConnection;
  /** Get pending invitations for a venue (owner only) */
  venuePendingInvitations: Array<VenueStaff>;
  /** Unified venue product analytics report */
  venueProductReport: VenueProductReport;
  /** Get venue products (menu, cursor) */
  venueProductsConnection: ProductConnection;
  /** Get venue promotion summary for display */
  venuePromotionSummary: VenuePromotionSummary;
  /** Get venue promotions (for venue owner/staff, cursor) */
  venuePromotionsConnection: PromotionConnection;
  /** Cursor-paginated recurring master bookings for a venue (staff) */
  venueRecurringBookingsConnection: BookingConnection;
  /** Get venue request by ID */
  venueRequest: VenueRequest;
  /** Get venue request statistics (Admin only) */
  venueRequestStats: VenueRequestStats;
  /** Get comprehensive venue revenue statistics with time period filtering */
  venueRevenueStats: VenueRevenueStats;
  /** Cursor-paginated venue reviews (createdAt DESC). */
  venueReviewsConnection: VenueReviewConnection;
  /** Cursor-paginated venue staff. Sort: isOwner DESC, joinedAt ASC. */
  venueStaffConnection: VenueStaffConnection;
  /** Cursor-paginated venues. Default sort: createdAt DESC; distance sort delegates to geo path. */
  venuesConnection: VenueConnection;
  /** Cursor-paginated all venues sorted by distance (no max radius). */
  venuesSortedByDistanceConnection: NearbyVenueConnection;
  /** API version */
  version: Scalars['String']['output'];
};


export type QueryActiveVenuePromotionsArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
  venueId: Scalars['ID']['input'];
};


export type QueryAdminAllBookingsConnectionArgs = {
  fromDate?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<CursorPageInput>;
  statuses?: InputMaybe<Array<Scalars['String']['input']>>;
  toDate?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAdminPendingVenuesConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryAdminUserBookingsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
  statuses?: InputMaybe<Array<Scalars['String']['input']>>;
  userId: Scalars['ID']['input'];
};


export type QueryAdminUsersConnectionArgs = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isSuspended?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<CursorPageInput>;
  role?: InputMaybe<UserRole>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<CursorSortInput>;
};


export type QueryAllVenueRequestsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
  status?: InputMaybe<VenueRequestStatus>;
};


export type QueryAuditLogDetailArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAuditLogsConnectionArgs = {
  filter?: InputMaybe<AuditFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
};


export type QueryAvailablePassesConnectionArgs = {
  filter?: InputMaybe<AvailablePassesFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryAvailablePromotionsForBookingArgs = {
  input: ApplyPromotionInput;
};


export type QueryBestDealPassesArgs = {
  filter?: InputMaybe<AvailablePassesFilterInput>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryBookingArgs = {
  bookingId: Scalars['ID']['input'];
};


export type QueryBookingInvoiceArgs = {
  bookingId: Scalars['ID']['input'];
};


export type QueryBookingPassArgs = {
  passId: Scalars['ID']['input'];
};


export type QueryBookingPassReportArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBookingPassReportsConnectionArgs = {
  filter?: InputMaybe<BookingPassReportFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryBookingStatsArgs = {
  fromDate?: InputMaybe<Scalars['String']['input']>;
  toDate?: InputMaybe<Scalars['String']['input']>;
  venueId: Scalars['ID']['input'];
};


export type QueryBracketDrawPreviewArgs = {
  categoryId: Scalars['ID']['input'];
};


export type QueryCalculateBookingDiscountArgs = {
  input: ApplyPromotionInput;
};


export type QueryCalculateOrderDiscountArgs = {
  input: ApplyOrderPromotionInput;
};


export type QueryCampaignStatsArgs = {
  campaignId: Scalars['ID']['input'];
};


export type QueryCanPassBookingArgs = {
  bookingId: Scalars['ID']['input'];
};


export type QueryCategoriesConnectionArgs = {
  filter?: InputMaybe<CategoryFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryCategoryArgs = {
  categoryId: Scalars['ID']['input'];
};


export type QueryCategoryTreeArgs = {
  shopId?: InputMaybe<Scalars['ID']['input']>;
  venueId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryCheckEmailExistsArgs = {
  email: Scalars['String']['input'];
};


export type QueryCheckPhoneExistsArgs = {
  phone: Scalars['String']['input'];
};


export type QueryCheckRecurringAvailabilityArgs = {
  customerId?: InputMaybe<Scalars['ID']['input']>;
  daySchedules?: InputMaybe<Array<DayScheduleInput>>;
  daysOfWeek?: InputMaybe<Array<Scalars['Int']['input']>>;
  discountCode?: InputMaybe<Scalars['String']['input']>;
  durationMonths: Scalars['Int']['input'];
  excludeDates?: InputMaybe<Array<Scalars['String']['input']>>;
  isStaffMode?: InputMaybe<Scalars['Boolean']['input']>;
  slots?: InputMaybe<Array<BookedSlotInput>>;
  startDate: Scalars['String']['input'];
  venueId: Scalars['ID']['input'];
};


export type QueryCheckSkuAvailabilityArgs = {
  excludeProductId?: InputMaybe<Scalars['ID']['input']>;
  shopId?: InputMaybe<Scalars['ID']['input']>;
  sku: Scalars['String']['input'];
  venueId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryCheckUserNameExistsArgs = {
  userName: Scalars['String']['input'];
};


export type QueryClaimRequestArgs = {
  claimRequestId: Scalars['ID']['input'];
};


export type QueryClaimRequestsConnectionArgs = {
  filter?: InputMaybe<ClaimRequestFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
};


export type QueryCommentRepliesConnectionArgs = {
  commentId: Scalars['ID']['input'];
  pagination?: InputMaybe<CursorPageInput>;
  postId: Scalars['ID']['input'];
};


export type QueryConfirmedTournamentRefereesArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryContactInquiriesConnectionArgs = {
  filter?: InputMaybe<ContactInquiryFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryConversationsConnectionArgs = {
  filter?: InputMaybe<ConversationFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryCourtArgs = {
  courtId: Scalars['ID']['input'];
};


export type QueryExportTournamentRegistrationsArgs = {
  filter?: InputMaybe<RegistrationFilterInput>;
  tournamentId: Scalars['ID']['input'];
};


export type QueryFavoriteVenuesConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryFollowedHostsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryGameParticipantsConnectionArgs = {
  gameId: Scalars['ID']['input'];
  pagination?: InputMaybe<CursorPageInput>;
  status?: InputMaybe<ParticipantStatus>;
};


export type QueryGenerateQrCodeArgs = {
  campaignId: Scalars['ID']['input'];
};


export type QueryGetAvailableOrderPromotionsArgs = {
  productCategoryIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  venueId: Scalars['ID']['input'];
};


export type QueryGetContactInquiryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetConversationArgs = {
  conversationId: Scalars['ID']['input'];
};


export type QueryGetFollowersArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
  userId: Scalars['String']['input'];
};


export type QueryGetFollowingArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
  userId: Scalars['String']['input'];
};


export type QueryGetGroupArgs = {
  groupId: Scalars['ID']['input'];
};


export type QueryGetGrowthStatsArgs = {
  filter?: InputMaybe<ReferralFilterInput>;
};


export type QueryGetInventoryReportArgs = {
  venueId: Scalars['ID']['input'];
};


export type QueryGetMessageReportByIdArgs = {
  reportId: Scalars['ID']['input'];
};


export type QueryGetNotificationArgs = {
  notificationId: Scalars['ID']['input'];
};


export type QueryGetPartnerLeaderboardArgs = {
  filter?: InputMaybe<ReferralFilterInput>;
};


export type QueryGetPinnedMessagesArgs = {
  conversationId: Scalars['ID']['input'];
};


export type QueryGetPostArgs = {
  incrementView?: InputMaybe<Scalars['Boolean']['input']>;
  postId: Scalars['ID']['input'];
};


export type QueryGetPostReportByIdArgs = {
  reportId: Scalars['ID']['input'];
};


export type QueryGetPostReportsForAdminConnectionArgs = {
  filter?: InputMaybe<PostReportFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
};


export type QueryGetProductImportHistoryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  productId: Scalars['ID']['input'];
};


export type QueryGetProductProfitReportArgs = {
  dateFrom: Scalars['DateTime']['input'];
  dateTo: Scalars['DateTime']['input'];
  venueId: Scalars['ID']['input'];
};


export type QueryGetQrAnalyticsSummaryArgs = {
  filter?: InputMaybe<QrCampaignFilterInput>;
};


export type QueryGetQrCampaignArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetQrCampaignStatsArgs = {
  filter?: InputMaybe<QrCampaignFilterInput>;
  id: Scalars['ID']['input'];
};


export type QueryGetReferralCodeDetailArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetReferralCodesArgs = {
  filter?: InputMaybe<ReferralFilterInput>;
};


export type QueryGetUserByUserNameArgs = {
  userName: Scalars['String']['input'];
};


export type QueryGetUserProfileArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetUserReportByIdArgs = {
  reportId: Scalars['ID']['input'];
};


export type QueryGetUserReportsForAdminConnectionArgs = {
  filter?: InputMaybe<UserReportFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
};


export type QueryGroupMembersConnectionArgs = {
  groupId: Scalars['ID']['input'];
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryGroupMessagesConnectionArgs = {
  groupId: Scalars['ID']['input'];
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryGroupPendingRequestsConnectionArgs = {
  groupId: Scalars['ID']['input'];
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryGroupsConnectionArgs = {
  filter?: InputMaybe<GroupFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryHasBookmarkedPostArgs = {
  postId: Scalars['ID']['input'];
};


export type QueryHasLikedCommentArgs = {
  commentId: Scalars['ID']['input'];
};


export type QueryHasLikedPostArgs = {
  postId: Scalars['ID']['input'];
};


export type QueryHasReportedPostArgs = {
  postId: Scalars['ID']['input'];
};


export type QueryHasReportedUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryHostGamesConnectionArgs = {
  hostId: Scalars['ID']['input'];
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryIsFollowingArgs = {
  userId: Scalars['String']['input'];
};


export type QueryIsInterestedInBookingArgs = {
  bookingId: Scalars['ID']['input'];
};


export type QueryIsUserBlockedArgs = {
  blockedUserId: Scalars['ID']['input'];
};


export type QueryLegalDocumentArgs = {
  type: LegalDocumentType;
};


export type QueryLegalDocumentByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLegalDocumentByVersionArgs = {
  type: LegalDocumentType;
  version: Scalars['String']['input'];
};


export type QueryLegalDocumentVersionsArgs = {
  type: LegalDocumentType;
};


export type QueryLiveMatchesArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryLookupCustomerByPhoneArgs = {
  phone: Scalars['String']['input'];
};


export type QueryLowStockProductsArgs = {
  shopId?: InputMaybe<Scalars['ID']['input']>;
  venueId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryMatchDetailArgs = {
  matchId: Scalars['ID']['input'];
};


export type QueryMatchScorecardArgs = {
  matchId: Scalars['ID']['input'];
};


export type QueryMessageReportsConnectionArgs = {
  filter?: InputMaybe<MessageReportFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
};


export type QueryMessagesConnectionArgs = {
  conversationId: Scalars['ID']['input'];
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMyBlacklistConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMyBookingsConnectionArgs = {
  filter?: InputMaybe<BookingFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMyBookmarksConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMyCampaignsArgs = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryMyClaimRequestsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMyGameTemplatesConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMyGroupInvitationsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMyGroupsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMyHoldBookingsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMyHostedGamesConnectionArgs = {
  filter?: InputMaybe<MyGamesFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMyJoinedGamesConnectionArgs = {
  filter?: InputMaybe<MyGamesFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMyOrdersConnectionArgs = {
  filter?: InputMaybe<OrderFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMyPassesConnectionArgs = {
  filter?: InputMaybe<MyPassesFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMyPostsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMyRatingForPassArgs = {
  passId: Scalars['ID']['input'];
};


export type QueryMyRecurringBookingsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMyRegistrationsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMySavedGamesConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMyTournamentsConnectionArgs = {
  filter?: InputMaybe<TournamentFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMyVenueAvailabilityArgs = {
  date: Scalars['String']['input'];
  venueId: Scalars['ID']['input'];
};


export type QueryMyVenueRequestsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryMyVenuesConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryNearbyPickupGamesConnectionArgs = {
  filter?: InputMaybe<PickupGameFilterInput>;
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  pagination?: InputMaybe<CursorPageInput>;
  radiusKm?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryNearbyVenuesConnectionArgs = {
  filter?: InputMaybe<VenueFilterInput>;
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  maxDistanceKm?: InputMaybe<Scalars['Float']['input']>;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryNotificationsConnectionArgs = {
  filter?: InputMaybe<NotificationFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryOrderArgs = {
  orderId: Scalars['ID']['input'];
};


export type QueryOrderAnalyticsArgs = {
  period?: InputMaybe<Scalars['String']['input']>;
  venueId: Scalars['ID']['input'];
};


export type QueryOrderByBookingIdArgs = {
  bookingId: Scalars['ID']['input'];
};


export type QueryOrderStatsArgs = {
  fromDate?: InputMaybe<Scalars['String']['input']>;
  toDate?: InputMaybe<Scalars['String']['input']>;
  venueId: Scalars['ID']['input'];
};


export type QueryOrdersByBookingIdArgs = {
  bookingId: Scalars['ID']['input'];
};


export type QueryOrdersPendingRefundConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
  venueId: Scalars['ID']['input'];
};


export type QueryOtpTestPhoneArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOtpTestPhonesConnectionArgs = {
  filter?: InputMaybe<OtpTestPhoneFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
};


export type QueryOtpTestUserGrantArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOtpTestUserGrantsConnectionArgs = {
  filter?: InputMaybe<OtpTestUserGrantFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
};


export type QueryPendingClaimRequestsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryPendingVenueRequestsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
};


export type QueryPickupGameArgs = {
  gameId: Scalars['ID']['input'];
};


export type QueryPickupGameCampaignArgs = {
  campaignId: Scalars['ID']['input'];
};


export type QueryPickupGamesConnectionArgs = {
  filter?: InputMaybe<PickupGameFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryPortalCapabilityGrantsConnectionArgs = {
  filter?: InputMaybe<PortalCapabilityGrantFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
};


export type QueryPostCommentsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
  postId: Scalars['ID']['input'];
};


export type QueryPostLikersConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
  postId: Scalars['ID']['input'];
};


export type QueryPostsConnectionArgs = {
  filter?: InputMaybe<PostFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryPreviewBulkImportArgs = {
  input: PreviewBulkImportInput;
};


export type QueryPreviewLateEntryPlacementArgs = {
  categoryId: Scalars['ID']['input'];
};


export type QueryPreviewManualKnockoutDrawArgs = {
  input: PreviewManualKnockoutDrawInput;
};


export type QueryPreviewMoveMatchArgs = {
  input: MoveMatchInput;
};


export type QueryPreviewRepackCourtScheduleArgs = {
  input: RepackCourtScheduleInput;
};


export type QueryProductArgs = {
  productId: Scalars['ID']['input'];
};


export type QueryProductBySlugArgs = {
  shopId?: InputMaybe<Scalars['ID']['input']>;
  slug: Scalars['String']['input'];
  venueId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryProductPerformanceReportArgs = {
  filter: ProductReportFilterInput;
  productId: Scalars['ID']['input'];
};


export type QueryProductSalesAnalyticsArgs = {
  period?: InputMaybe<Scalars['String']['input']>;
  venueId: Scalars['ID']['input'];
};


export type QueryProductStatsArgs = {
  shopId?: InputMaybe<Scalars['ID']['input']>;
  venueId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryProductsConnectionArgs = {
  filter?: InputMaybe<ProductFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<ProductSortInput>;
};


export type QueryPromotionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPromotionStatsArgs = {
  venueId: Scalars['ID']['input'];
};


export type QueryPromotionsConnectionArgs = {
  filter?: InputMaybe<PromotionFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<PromotionSortInput>;
};


export type QueryQrCampaignsConnectionArgs = {
  filter?: InputMaybe<QrCampaignFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryRecurringBookingDetailsArgs = {
  masterBookingId: Scalars['ID']['input'];
};


export type QueryRefereeMatchesArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryRefereeWorkloadArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryScoreboardPresetArgs = {
  sportType: SportType;
};


export type QueryScoreboardSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type QueryScoreboardSessionByViewerTokenArgs = {
  viewerToken: Scalars['String']['input'];
};


export type QueryScoreboardSessionsConnectionArgs = {
  filter: ScoreboardSessionsFilterInput;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QuerySearchMessagesConnectionArgs = {
  input: SearchMessagesInput;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QuerySearchUserByPhoneArgs = {
  phone: Scalars['String']['input'];
};


export type QuerySearchUsersByUserNameArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
  searchTerm: Scalars['String']['input'];
};


export type QuerySportArgs = {
  type: SportType;
};


export type QueryStaffedVenuesConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryStockMovementsConnectionArgs = {
  filter?: InputMaybe<StockMovementFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<StockMovementSortInput>;
  venueId: Scalars['ID']['input'];
};


export type QuerySuggestedPriceArgs = {
  filter?: InputMaybe<SuggestedPriceFilterInput>;
};


export type QueryTournamentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTournamentBracketArgs = {
  categoryId: Scalars['ID']['input'];
};


export type QueryTournamentCategoriesArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryTournamentGroupRankingsArgs = {
  categoryId: Scalars['ID']['input'];
  groupId: Scalars['String']['input'];
};


export type QueryTournamentMatchesConnectionArgs = {
  filter?: InputMaybe<MatchFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  tournamentId: Scalars['ID']['input'];
};


export type QueryTournamentRankingsArgs = {
  categoryId: Scalars['ID']['input'];
};


export type QueryTournamentRefereeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTournamentRefereesArgs = {
  filter?: InputMaybe<TournamentRefereeFilterInput>;
  tournamentId: Scalars['ID']['input'];
};


export type QueryTournamentRegistrationsConnectionArgs = {
  filter?: InputMaybe<RegistrationFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  tournamentId: Scalars['ID']['input'];
};


export type QueryTournamentResultsArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryTournamentStatsArgs = {
  tournamentId: Scalars['ID']['input'];
};


export type QueryTournamentsConnectionArgs = {
  filter?: InputMaybe<TournamentFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
};


export type QueryTransferrerRatingsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['ID']['input'];
};


export type QueryTransferrerStatsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUrgentPassesArgs = {
  filter?: InputMaybe<AvailablePassesFilterInput>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserPostsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
  userId: Scalars['ID']['input'];
};


export type QueryUserProfileArgs = {
  userId: Scalars['String']['input'];
};


export type QueryValidateCheckInQrArgs = {
  gameId: Scalars['ID']['input'];
  qrCode: Scalars['String']['input'];
};


export type QueryValidateOrderPromoCodeArgs = {
  input: ValidateOrderPromoCodeInput;
};


export type QueryValidatePromoCodeArgs = {
  input: ValidatePromoCodeInput;
};


export type QueryValidateReferralCodeArgs = {
  code: Scalars['String']['input'];
};


export type QueryVenueArgs = {
  venueId: Scalars['ID']['input'];
};


export type QueryVenueActivitiesConnectionArgs = {
  filter?: InputMaybe<ActivityFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  venueId: Scalars['ID']['input'];
};


export type QueryVenueAnalyticsArgs = {
  period?: InputMaybe<Scalars['String']['input']>;
  venueId: Scalars['ID']['input'];
};


export type QueryVenueAvailabilityArgs = {
  date: Scalars['String']['input'];
  venueId: Scalars['ID']['input'];
};


export type QueryVenueBookingsConnectionArgs = {
  filter?: InputMaybe<BookingFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<BookingSortInput>;
  venueId: Scalars['ID']['input'];
};


export type QueryVenueCategoriesConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
  venueId: Scalars['ID']['input'];
};


export type QueryVenueCourtsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
  venueId: Scalars['ID']['input'];
};


export type QueryVenueDashboardSummaryArgs = {
  period?: InputMaybe<Scalars['String']['input']>;
  revenuePeriod?: InputMaybe<Scalars['String']['input']>;
  venueId: Scalars['ID']['input'];
};


export type QueryVenueExpensesConnectionArgs = {
  filter: ExpenseFilterInput;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
};


export type QueryVenueFinanceExportArgs = {
  filter: FinanceFilterInput;
  format: FinanceExportFormat;
};


export type QueryVenueFinancePortfolioArgs = {
  filter: FinanceFilterInput;
};


export type QueryVenueFinanceReportArgs = {
  filter: FinanceFilterInput;
};


export type QueryVenueFinanceTransactionsConnectionArgs = {
  filter: FinanceTransactionFilterInput;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<FinanceTransactionSortInput>;
};


export type QueryVenueHoldBookingsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<BookingSortInput>;
  venueId: Scalars['ID']['input'];
};


export type QueryVenueOperationsReportArgs = {
  filter: OperationsFilterInput;
};


export type QueryVenueOrdersConnectionArgs = {
  filter?: InputMaybe<OrderFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<OrderSortInput>;
  venueId: Scalars['ID']['input'];
};


export type QueryVenuePendingInvitationsArgs = {
  venueId: Scalars['ID']['input'];
};


export type QueryVenueProductReportArgs = {
  filter: ProductReportFilterInput;
};


export type QueryVenueProductsConnectionArgs = {
  filter?: InputMaybe<ProductFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<ProductSortInput>;
  venueId: Scalars['ID']['input'];
};


export type QueryVenuePromotionSummaryArgs = {
  venueId: Scalars['ID']['input'];
};


export type QueryVenuePromotionsConnectionArgs = {
  filter?: InputMaybe<PromotionFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<PromotionSortInput>;
  venueId: Scalars['ID']['input'];
};


export type QueryVenueRecurringBookingsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<BookingSortInput>;
  venueId: Scalars['ID']['input'];
};


export type QueryVenueRequestArgs = {
  requestId: Scalars['ID']['input'];
};


export type QueryVenueRevenueStatsArgs = {
  period?: InputMaybe<Scalars['String']['input']>;
  venueId: Scalars['ID']['input'];
};


export type QueryVenueReviewsConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
  venueId: Scalars['ID']['input'];
};


export type QueryVenueStaffConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
  venueId: Scalars['ID']['input'];
};


export type QueryVenuesConnectionArgs = {
  filter?: InputMaybe<VenueFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<VenueSortInput>;
};


export type QueryVenuesSortedByDistanceConnectionArgs = {
  filter?: InputMaybe<VenueFilterInput>;
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  pagination?: InputMaybe<CursorPageInput>;
};

export type RateParticipantsInput = {
  /** ID kèo */
  gameId: Scalars['ID']['input'];
  /** ID MVP của trận */
  mvpUserId?: InputMaybe<Scalars['ID']['input']>;
  /** Danh sách đánh giá */
  ratings: Array<ParticipantRatingInput>;
};

export type RatePassTransferInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  passId: Scalars['ID']['input'];
  /** Điểm 1-5 */
  score: Scalars['Int']['input'];
};

export type ReactionDelta = {
  __typename?: 'ReactionDelta';
  createdAt: Scalars['DateTime']['output'];
  emoji: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type RecordQrScanInput = {
  /** Campaign slug from the QR URL (?c=SLUG) */
  campaignSlug: Scalars['String']['input'];
  /** Client IP address */
  ip: Scalars['String']['input'];
  /** Referral code if present in URL */
  ref?: InputMaybe<Scalars['String']['input']>;
  /** Session ID for unique device estimation */
  sessionId: Scalars['String']['input'];
  /** User-Agent string from the browser */
  userAgent: Scalars['String']['input'];
};

export type RecurringAvailabilityCheck = {
  __typename?: 'RecurringAvailabilityCheck';
  /** All dates are available */
  allAvailable: Scalars['Boolean']['output'];
  /** List of all booking dates */
  allDates: Array<Scalars['String']['output']>;
  /** Applied auto-promotion breakdown (staff preview) */
  appliedPromotions?: Maybe<Array<AppliedPromotion>>;
  /** Total auto-promo discount (staff preview) */
  autoPromoDiscount?: Maybe<Scalars['Int']['output']>;
  /** List of available dates */
  availableDates: Array<Scalars['String']['output']>;
  /** Price breakdown per day (when prices differ by day) */
  dayPriceBreakdown?: Maybe<Array<DayPriceBreakdown>>;
  /** Days of week included in booking (0=Sunday, 6=Saturday) */
  daysOfWeek: Array<Scalars['Int']['output']>;
  /** Discount amount */
  discountAmount: Scalars['Int']['output'];
  /** Discount percentage */
  discountPercent: Scalars['Int']['output'];
  /** Effective sessions after staff exclude dates */
  effectiveSessions?: Maybe<Scalars['Int']['output']>;
  /** Number of excluded sessions in staff preview */
  excludedSessionCount?: Maybe<Scalars['Int']['output']>;
  /** Final amount after discount */
  finalAmount: Scalars['Int']['output'];
  /** Package final amount plus auto promo (staff preview) */
  finalAmountWithPromo?: Maybe<Scalars['Int']['output']>;
  /** Minimum sessions required for RECURRING category promo */
  minRecurringPromoSessions?: Maybe<Scalars['Int']['output']>;
  /** Average price per session (for display, actual may vary by day) */
  pricePerSession: Scalars['Int']['output'];
  /** RECURRING category auto-promo discount amount */
  recurringCategoryDiscount?: Maybe<Scalars['Int']['output']>;
  /** Is recurring booking enabled for this venue */
  recurringEnabled: Scalars['Boolean']['output'];
  /** Whether RECURRING category promo applies at effectiveSessions */
  recurringPromoEligible?: Maybe<Scalars['Boolean']['output']>;
  /** Sessions per week (number of days booked) */
  sessionsPerWeek: Scalars['Int']['output'];
  /** Total price before discount */
  totalPrice: Scalars['Int']['output'];
  /** Total sessions if all available */
  totalSessions: Scalars['Int']['output'];
  /** List of unavailable dates */
  unavailableDates: Array<Scalars['String']['output']>;
};

export type RecurringBookingDetails = {
  __typename?: 'RecurringBookingDetails';
  /** Master/parent booking */
  master: Booking;
  /** All child session bookings */
  sessions: Array<Booking>;
  /** Sessions summary */
  summary: RecurringBookingSummary;
};

export type RecurringBookingSummary = {
  __typename?: 'RecurringBookingSummary';
  /** Number of cancelled sessions */
  cancelledSessions: Scalars['Int']['output'];
  /** Number of completed sessions */
  completedSessions: Scalars['Int']['output'];
  /** Number of confirmed sessions */
  confirmedSessions: Scalars['Int']['output'];
  /** Number of pending sessions */
  pendingSessions: Scalars['Int']['output'];
  /** Total number of sessions */
  totalSessions: Scalars['Int']['output'];
  /** Number of upcoming sessions */
  upcomingSessions: Scalars['Int']['output'];
};

export type RecurringConfig = {
  __typename?: 'RecurringConfig';
  /** Discount amount from manually entered voucher code (subset of promoDiscount) */
  codeDiscount?: Maybe<Scalars['Int']['output']>;
  /**
   * Day of week (0=Sunday, 6=Saturday) - DEPRECATED
   * @deprecated Use daysOfWeek instead for multi-day support
   */
  dayOfWeek?: Maybe<Scalars['Int']['output']>;
  /** Slots configuration for each day (when slots differ by day) */
  daySchedules?: Maybe<Array<DaySchedule>>;
  /** Days of week for recurring booking (0=Sunday, 6=Saturday) */
  daysOfWeek?: Maybe<Array<Scalars['Int']['output']>>;
  /** Discount percentage for recurring */
  discountPercent?: Maybe<Scalars['Int']['output']>;
  /** Duration in months (1, 2, or 3) */
  durationMonths: Scalars['Int']['output'];
  /** End date (YYYY-MM-DD) */
  endDate: Scalars['String']['output'];
  /** Dates excluded by staff when creating recurring booking */
  excludedDates?: Maybe<Array<Scalars['String']['output']>>;
  /** Recurring frequency */
  frequency: RecurringFrequency;
  /** Promo code discount amount */
  promoDiscount?: Maybe<Scalars['Int']['output']>;
  /** Current discount amount from RECURRING category promotions (set to 0 when removed on session cancel) */
  recurringCategoryDiscount?: Maybe<Scalars['Int']['output']>;
  /** Promotion IDs of RECURRING category promotions applied to this booking */
  recurringPromotionIds?: Maybe<Array<Scalars['String']['output']>>;
  /** Sessions per week (number of days) */
  sessionsPerWeek?: Maybe<Scalars['Int']['output']>;
  /** Start date (YYYY-MM-DD) */
  startDate: Scalars['String']['output'];
  /** Total booking sessions */
  totalSessions: Scalars['Int']['output'];
};

/** Frequency of recurring booking */
export enum RecurringFrequency {
  Weekly = 'WEEKLY'
}

/** Status of referee invitation for a match */
export enum RefereeInviteStatus {
  Confirmed = 'CONFIRMED',
  Declined = 'DECLINED',
  Pending = 'PENDING'
}

/** Role of a referee in a tournament */
export enum RefereeRole {
  HeadReferee = 'HEAD_REFEREE',
  LineJudge = 'LINE_JUDGE',
  Referee = 'REFEREE'
}

export type RefereeWorkloadEntry = {
  __typename?: 'RefereeWorkloadEntry';
  date: Scalars['String']['output'];
  matchCount: Scalars['Int']['output'];
  refereeId: Scalars['ID']['output'];
  refereeName: Scalars['String']['output'];
};

export type RefereeWorkloadResult = {
  __typename?: 'RefereeWorkloadResult';
  entries: Array<RefereeWorkloadEntry>;
  totalUnassigned: Scalars['Int']['output'];
  warnings: Array<Scalars['String']['output']>;
};

export type ReferralCode = {
  __typename?: 'ReferralCode';
  _id: Scalars['ID']['output'];
  /** Unique referral code (uppercase) */
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Times this code has been used */
  currentUses: Scalars['Int']['output'];
  /** Expiry date for this code */
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  /** Whether this referral code is currently active */
  isActive: Scalars['Boolean']['output'];
  /** Max uses allowed (null = unlimited) */
  maxUses?: Maybe<Scalars['Int']['output']>;
  /** JSON metadata for flexible data */
  metadata?: Maybe<Scalars['String']['output']>;
  /** User ID of the code owner */
  ownerId: Scalars['ID']['output'];
  /** Display name of the code owner */
  ownerName: Scalars['String']['output'];
  /** Role of the code owner */
  ownerRole?: Maybe<Scalars['String']['output']>;
  /** Users who completed at least one booking */
  totalActiveUsers: Scalars['Int']['output'];
  /** Total revenue generated by referred users */
  totalRevenue: Scalars['Float']['output'];
  /** Total signups via this code */
  totalSignups: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ReferralFilterInput = {
  /** Filter from date (inclusive) */
  from?: InputMaybe<Scalars['DateTime']['input']>;
  /** Search by code or owner name */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter to date (inclusive) */
  to?: InputMaybe<Scalars['DateTime']['input']>;
};

export type RefundInfo = {
  __typename?: 'RefundInfo';
  /** Refund amount */
  refundAmount: Scalars['Int']['output'];
  /** Refund completed at */
  refundCompletedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Refund note */
  refundNote?: Maybe<Scalars['String']['output']>;
  /** Refund percentage (0-100) */
  refundPercent: Scalars['Int']['output'];
  /** Staff who processed refund */
  refundProcessedBy?: Maybe<Scalars['ID']['output']>;
  /** Refund proof images (bank transfer screenshots) */
  refundProofImages?: Maybe<Array<Scalars['String']['output']>>;
  /** Refund reason */
  refundReason: Scalars['String']['output'];
  /** Refund requested at */
  refundRequestedAt: Scalars['DateTime']['output'];
  /** Staff who requested refund */
  refundRequestedBy?: Maybe<Scalars['ID']['output']>;
};

export type RegisterTournamentInput = {
  athleteName: Scalars['String']['input'];
  categoryId: Scalars['ID']['input'];
  club?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  /** Existing user ID when registering for another user found by phone */
  forUserId?: InputMaybe<Scalars['ID']['input']>;
  guardianName?: InputMaybe<Scalars['String']['input']>;
  guardianPhone?: InputMaybe<Scalars['String']['input']>;
  identityProofUrl?: InputMaybe<Scalars['String']['input']>;
  /** true = self, false = other */
  isForSelf?: Scalars['Boolean']['input'];
  /** Entry members for doubles/team. When provided, takes precedence over flat athlete fields. */
  members?: InputMaybe<Array<EntryMemberInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Phí đăng ký (VND). Nội dung đơn: 1 VĐV. Nội dung đôi: 2 VĐV (cả đội). */
  paymentAmount?: InputMaybe<Scalars['Float']['input']>;
  paymentProofUrl?: InputMaybe<Scalars['String']['input']>;
  /** Participant phone number */
  phone?: InputMaybe<Scalars['String']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  tournamentId: Scalars['ID']['input'];
};

export type RegistrationFilterInput = {
  /** Filter by category ID */
  categoryId?: InputMaybe<Scalars['String']['input']>;
  paymentStatus?: InputMaybe<TournamentPaymentStatus>;
  registrationStatus?: InputMaybe<RegistrationStatus>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

/** Status of a tournament registration */
export enum RegistrationStatus {
  Approved = 'APPROVED',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Waitlisted = 'WAITLISTED'
}

export type RejectParticipantInput = {
  /** ID kèo */
  gameId: Scalars['ID']['input'];
  /** Lý do từ chối */
  reason?: InputMaybe<Scalars['String']['input']>;
  /** ID người chơi */
  userId: Scalars['ID']['input'];
};

export type RejectRegistrationInput = {
  reason?: InputMaybe<Scalars['String']['input']>;
  registrationId: Scalars['ID']['input'];
};

export type RemoveGamesFromCampaignInput = {
  /** ID campaign */
  campaignId: Scalars['ID']['input'];
  /** Danh sách ID kèo cần xoá khỏi campaign */
  gameIds: Array<Scalars['ID']['input']>;
};

export type RemoveGroupMessageReactionInput = {
  /** Emoji reaction to remove */
  emoji: Scalars['String']['input'];
  /** Message ID to remove reaction from */
  messageId: Scalars['ID']['input'];
};

export type RemoveReactionInput = {
  /** Emoji reaction to remove */
  emoji: Scalars['String']['input'];
  /** Message ID */
  messageId: Scalars['ID']['input'];
};

export type RepackCourtScheduleInput = {
  /** Optional anchor match; defaults to earliest LIVE or last FINISHED on court */
  anchorMatchId?: InputMaybe<Scalars['ID']['input']>;
  /** Calendar date YYYY-MM-DD */
  calendarDate: Scalars['String']['input'];
  /** Court name (e.g. Sân 1) */
  courtName: Scalars['String']['input'];
  tournamentId: Scalars['ID']['input'];
};

/** Dry-run preview of tight court schedule repack (no DB writes) */
export type RepackCourtSchedulePreviewResult = {
  __typename?: 'RepackCourtSchedulePreviewResult';
  anchorMatchId: Scalars['ID']['output'];
  /** Total NOT_STARTED matches that would be repacked */
  backlogCount: Scalars['Int']['output'];
  calendarDate: Scalars['String']['output'];
  courtName: Scalars['String']['output'];
  /** Shifts where old time was before anchor actual start (overdue backlog) */
  overdueCount: Scalars['Int']['output'];
  preview: Array<ScheduleShiftPreview>;
  totalAffected: Scalars['Int']['output'];
  warnings: Array<Scalars['String']['output']>;
};

/** Result of tight court schedule repack */
export type RepackCourtScheduleResult = {
  __typename?: 'RepackCourtScheduleResult';
  affectedMatches: Array<TournamentMatch>;
  preview: Array<ScheduleShiftPreview>;
  totalAffected: Scalars['Int']['output'];
  warnings: Array<Scalars['String']['output']>;
};

export type ReportBookingPassInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  passId: Scalars['ID']['input'];
  reason: BookingPassReportReason;
};

export type ReportMessageInput = {
  /** Message ID to report */
  messageId: Scalars['ID']['input'];
  /** Reason for reporting */
  reason: Scalars['String']['input'];
};

export type ReportPostInput = {
  /** Additional details about the report */
  description?: InputMaybe<Scalars['String']['input']>;
  /** ID of the post to report */
  postId: Scalars['ID']['input'];
  /** Reason for reporting */
  reason: PostReportReason;
};

/** Status of message report */
export enum ReportStatus {
  Dismissed = 'DISMISSED',
  Pending = 'PENDING',
  Resolved = 'RESOLVED',
  Reviewed = 'REVIEWED'
}

export type ReportUserInput = {
  /** Additional details */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Reason for reporting */
  reason: UserReportReason;
  /** ID of the user to report */
  userId: Scalars['ID']['input'];
};

export type RequestAmenity = {
  __typename?: 'RequestAmenity';
  /** Amenity icon */
  icon?: Maybe<Scalars['String']['output']>;
  /** Amenity ID */
  id: Scalars['String']['output'];
  /** Amenity name */
  name: Scalars['String']['output'];
};

export type RequestAmenityInput = {
  /** Amenity icon */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** Amenity ID */
  id: Scalars['String']['input'];
  /** Amenity name */
  name: Scalars['String']['input'];
};

export type RequestCourtInfo = {
  __typename?: 'RequestCourtInfo';
  /** Is indoor court */
  isIndoor?: Maybe<Scalars['Boolean']['output']>;
  /** Minimum number of slots required per booking */
  minimumBookingSlots?: Maybe<Scalars['Int']['output']>;
  /** Court name */
  name: Scalars['String']['output'];
  /** Default peak price per hour (fallback) */
  peakPricePerHour: Scalars['Int']['output'];
  /** Default price per hour (fallback) */
  pricePerHour: Scalars['Int']['output'];
  /** Sport type */
  sportType: SportType;
  /** Time-based pricing by day of week */
  timeSlotPricing?: Maybe<Array<RequestTimeSlotPricing>>;
};

export type RequestCourtInfoInput = {
  /** Is indoor court */
  isIndoor?: InputMaybe<Scalars['Boolean']['input']>;
  /** Minimum number of slots required per booking */
  minimumBookingSlots?: InputMaybe<Scalars['Int']['input']>;
  /** Court name */
  name: Scalars['String']['input'];
  /** Default peak price per hour (fallback) */
  peakPricePerHour: Scalars['Int']['input'];
  /** Default price per hour (fallback) */
  pricePerHour: Scalars['Int']['input'];
  /** Sport type */
  sportType: SportType;
  /** Time-based pricing by day of week */
  timeSlotPricing?: InputMaybe<Array<RequestTimeSlotPricingInput>>;
};

export type RequestEmailUpdateInput = {
  newEmail: Scalars['String']['input'];
};

export type RequestLocation = {
  __typename?: 'RequestLocation';
  /** Full address */
  address: Scalars['String']['output'];
  /** City/Province */
  city?: Maybe<Scalars['String']['output']>;
  /** District */
  district?: Maybe<Scalars['String']['output']>;
  /** Latitude */
  latitude?: Maybe<Scalars['Float']['output']>;
  /** Longitude */
  longitude?: Maybe<Scalars['Float']['output']>;
  /** Ward */
  ward?: Maybe<Scalars['String']['output']>;
};

export type RequestLocationInput = {
  /** Full address */
  address: Scalars['String']['input'];
  /** City/Province */
  city?: InputMaybe<Scalars['String']['input']>;
  /** District */
  district?: InputMaybe<Scalars['String']['input']>;
  /** Latitude (required for map / search) */
  latitude: Scalars['Float']['input'];
  /** Longitude (required for map / search) */
  longitude: Scalars['Float']['input'];
  /** Ward */
  ward?: InputMaybe<Scalars['String']['input']>;
};

export type RequestOperatingHours = {
  __typename?: 'RequestOperatingHours';
  /** Closing time (HH:mm) */
  closeTime: Scalars['String']['output'];
  /** Day of week (0=Sunday, 1=Monday, ...) */
  dayOfWeek: Scalars['Int']['output'];
  /** Is open 24 hours on this day */
  is24Hours?: Maybe<Scalars['Boolean']['output']>;
  /** Is closed on this day */
  isClosed: Scalars['Boolean']['output'];
  /** Opening time (HH:mm) */
  openTime: Scalars['String']['output'];
};

export type RequestOperatingHoursInput = {
  /** Closing time (HH:mm) */
  closeTime: Scalars['String']['input'];
  /** Day of week (0=Sunday, 1=Monday, ...) */
  dayOfWeek: Scalars['Int']['input'];
  /** Is open 24 hours on this day */
  is24Hours?: InputMaybe<Scalars['Boolean']['input']>;
  /** Is closed on this day */
  isClosed: Scalars['Boolean']['input'];
  /** Opening time (HH:mm) */
  openTime: Scalars['String']['input'];
};

export type RequestPhoneOtpInput = {
  deviceId?: InputMaybe<Scalars['String']['input']>;
  forceChannel?: InputMaybe<OtpChannelType>;
  phone: Scalars['String']['input'];
  purpose: OtpPurpose;
};

export type RequestPhoneOtpResponse = {
  __typename?: 'RequestPhoneOtpResponse';
  channel: OtpChannelType;
  channelLabel?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  maskedPhone: Scalars['String']['output'];
  resendAvailableAt: Scalars['DateTime']['output'];
  verificationId?: Maybe<Scalars['String']['output']>;
};

export type RequestPhoneUpdateInput = {
  newPhone: Scalars['String']['input'];
};

export type RequestTimeSlotPricing = {
  __typename?: 'RequestTimeSlotPricing';
  /** Days of week this pricing applies (0=Sunday, 1=Monday, ...) */
  daysOfWeek: Array<Scalars['Int']['output']>;
  /** End time (HH:mm) */
  endTime: Scalars['String']['output'];
  /** Price per hour for this time slot */
  pricePerHour: Scalars['Int']['output'];
  /** Start time (HH:mm) */
  startTime: Scalars['String']['output'];
};

export type RequestTimeSlotPricingInput = {
  /** Days of week this pricing applies (0=Sunday, 1=Monday, ...) */
  daysOfWeek: Array<Scalars['Int']['input']>;
  /** End time (HH:mm) */
  endTime: Scalars['String']['input'];
  /** Price per hour for this time slot */
  pricePerHour: Scalars['Int']['input'];
  /** Start time (HH:mm) */
  startTime: Scalars['String']['input'];
};

export type ResetPasswordInput = {
  firebaseIdToken?: InputMaybe<Scalars['String']['input']>;
  idToken?: InputMaybe<Scalars['String']['input']>;
  newPassword: Scalars['String']['input'];
  phoneVerificationToken?: InputMaybe<Scalars['String']['input']>;
};

/** Type of resource affected */
export enum ResourceType {
  Booking = 'BOOKING',
  Order = 'ORDER',
  Product = 'PRODUCT',
  Review = 'REVIEW',
  Staff = 'STAFF',
  Venue = 'VENUE'
}

export type RespondRefereeInviteInput = {
  accept: Scalars['Boolean']['input'];
  matchId: Scalars['ID']['input'];
  notificationId: Scalars['ID']['input'];
};

export type RespondTournamentRefereeInviteInput = {
  accept: Scalars['Boolean']['input'];
  notificationId: Scalars['ID']['input'];
  tournamentRefereeId: Scalars['ID']['input'];
};

export type ReturnStockInput = {
  /** Return reason/notes */
  note?: InputMaybe<Scalars['String']['input']>;
  /** Order ID for the return */
  orderId: Scalars['ID']['input'];
  /** Product ID being returned */
  productId: Scalars['ID']['input'];
  /** Quantity being returned */
  quantity: Scalars['Int']['input'];
  /** Variant ID (if applicable) */
  variantId?: InputMaybe<Scalars['ID']['input']>;
};

export type RevenueBreakdown = {
  __typename?: 'RevenueBreakdown';
  /** Number of completed bookings */
  collectedCount: Scalars['Int']['output'];
  /** Revenue from COMPLETED bookings (paid) */
  collectedRevenue: Scalars['Int']['output'];
  /** Number of confirmed bookings */
  confirmedCount: Scalars['Int']['output'];
  /** Revenue from CONFIRMED bookings (approved, awaiting payment) */
  confirmedRevenue: Scalars['Int']['output'];
  /** Total expected revenue (pending + confirmed + collected) */
  expectedRevenue: Scalars['Int']['output'];
  /** Number of pending bookings */
  pendingCount: Scalars['Int']['output'];
  /** Revenue from PENDING bookings (awaiting approval) */
  pendingRevenue: Scalars['Int']['output'];
};

export type RevenueDataPoint = {
  __typename?: 'RevenueDataPoint';
  /** Label (e.g., T2, T3, T1, T2...) */
  label: Scalars['String']['output'];
  /** Previous period value for comparison */
  previousValue?: Maybe<Scalars['Int']['output']>;
  /** Revenue value */
  value: Scalars['Int']['output'];
};

export type ReviewBookingPassReportInput = {
  cancelPass?: InputMaybe<Scalars['Boolean']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  reportId: Scalars['ID']['input'];
  status: BookingPassReportStatus;
};

export type ReviewClaimRequestInput = {
  /** Admin notes (internal) */
  adminNotes?: InputMaybe<Scalars['String']['input']>;
  /** Whether to approve the claim */
  approved: Scalars['Boolean']['input'];
  /** Claim request ID */
  claimRequestId: Scalars['ID']['input'];
  /** Reason for rejection */
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
};

export type ReviewPromotionInput = {
  /** Approve or reject */
  approved: Scalars['Boolean']['input'];
  /** Promotion ID */
  promotionId: Scalars['ID']['input'];
  /** Rejection reason (if rejecting) */
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
};

export type SavedGame = {
  __typename?: 'SavedGame';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Kèo đã lưu */
  game?: Maybe<PickupGame>;
  /** ID kèo đã lưu */
  gameId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  /** ID người lưu */
  userId: Scalars['ID']['output'];
};

/** A Relay-style connection for SavedGame items. */
export type SavedGameConnection = {
  __typename?: 'SavedGameConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<SavedGameEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the SavedGameConnection. */
export type SavedGameEdge = {
  __typename?: 'SavedGameEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: SavedGame;
};

/** Scheduling configuration for the tournament */
export type ScheduleConfig = {
  __typename?: 'ScheduleConfig';
  /** Buffer minutes between matches on the same court for cleanup/warmup (default 5) */
  courtBufferMinutes: Scalars['Int']['output'];
  /** Minimum rest minutes between 2 matches of the same player (default 30) */
  minRestMinutes: Scalars['Int']['output'];
  /** Khoảng thời gian nghỉ trong ngày (HH:mm). Tự động xếp lịch không đặt trận trùng các khoảng này. */
  restBreakWindows?: Maybe<Array<ScheduleRestBreakWindow>>;
};

export type ScheduleConfigInput = {
  courtBufferMinutes?: InputMaybe<Scalars['Int']['input']>;
  minRestMinutes?: InputMaybe<Scalars['Int']['input']>;
  /** Khoảng nghỉ trong ngày (HH:mm). Tự động xếp lịch bỏ qua, không đặt trận trùng. */
  restBreakWindows?: InputMaybe<Array<ScheduleRestBreakWindowInput>>;
};

export type ScheduleCoveragePoint = {
  __typename?: 'ScheduleCoveragePoint';
  availableSlots: Scalars['Int']['output'];
  bookingCount: Scalars['Int']['output'];
  /** Bucket start date (YYYY-MM-DD) */
  date: Scalars['String']['output'];
  /** Display label for chart axis */
  label: Scalars['String']['output'];
  /** Occupancy rate 0–100 */
  occupancyRate: Scalars['Float']['output'];
  occupiedSlots: Scalars['Int']['output'];
  /** Occupancy rate in the aligned previous-period bucket */
  previousOccupancyRate?: Maybe<Scalars['Float']['output']>;
  /** Revenue in the aligned previous-period bucket */
  previousRevenue?: Maybe<Scalars['Int']['output']>;
  /** Court revenue on schedule date(s) in bucket */
  revenue: Scalars['Int']['output'];
};

export type ScheduleMatchInput = {
  courtName?: InputMaybe<Scalars['String']['input']>;
  estimatedDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
  matchId: Scalars['ID']['input'];
  scheduledAt?: InputMaybe<Scalars['String']['input']>;
};

/** Result of scheduling with conflict warnings */
export type ScheduleMatchResult = {
  __typename?: 'ScheduleMatchResult';
  match: TournamentMatch;
  /** Conflict warnings (empty if none) */
  warnings: Array<Scalars['String']['output']>;
};

export type ScheduleRestBreakWindow = {
  __typename?: 'ScheduleRestBreakWindow';
  /** Kết thúc khoảng nghỉ (HH:mm, local) */
  endTime: Scalars['String']['output'];
  /** Bắt đầu khoảng nghỉ (HH:mm, local) */
  startTime: Scalars['String']['output'];
};

export type ScheduleRestBreakWindowInput = {
  endTime: Scalars['String']['input'];
  startTime: Scalars['String']['input'];
};

export type ScheduleShiftPreview = {
  __typename?: 'ScheduleShiftPreview';
  matchId: Scalars['ID']['output'];
  matchNumber: Scalars['Int']['output'];
  newScheduledAt: Scalars['String']['output'];
  oldScheduledAt: Scalars['String']['output'];
};

export type ScorePointInput = {
  matchId: Scalars['ID']['input'];
  /** Player who scored: 1 or 2 */
  scoringPlayer: Scalars['Int']['input'];
};

export type ScoreSummary = {
  __typename?: 'ScoreSummary';
  /** Total sets won [p1, p2] */
  finalScore: Array<Scalars['Int']['output']>;
  /** Score per set */
  sets: Array<SetScoreSummary>;
};

export enum ScoreboardAbandonReason {
  Expired = 'EXPIRED',
  Inactivity = 'INACTIVITY'
}

export enum ScoreboardDatePreset {
  All = 'ALL',
  Today = 'TODAY',
  Week = 'WEEK'
}

export type ScoreboardHubStats = {
  __typename?: 'ScoreboardHubStats';
  liveCount: Scalars['Int']['output'];
  todayCount: Scalars['Int']['output'];
  weekWins: Scalars['Int']['output'];
};

export enum ScoreboardHubTab {
  History = 'HISTORY',
  Live = 'LIVE',
  Mine = 'MINE'
}

export enum ScoreboardMatchFormat {
  Doubles = 'DOUBLES',
  Singles = 'SINGLES',
  Team = 'TEAM'
}

export type ScoreboardPointEvent = {
  __typename?: 'ScoreboardPointEvent';
  eventType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  pointValue?: Maybe<Scalars['Int']['output']>;
  scoreAfter: Array<Scalars['Int']['output']>;
  scoringPlayer: Scalars['Int']['output'];
  servingPlayer: Scalars['Int']['output'];
  setNumber: Scalars['Int']['output'];
  timestamp: Scalars['String']['output'];
  wasServiceOver?: Maybe<Scalars['Boolean']['output']>;
};

export type ScoreboardRecordFaultInput = {
  expectedRevision?: InputMaybe<Scalars['Int']['input']>;
  player?: InputMaybe<Scalars['Int']['input']>;
  sessionId: Scalars['String']['input'];
};

export type ScoreboardRetireInput = {
  expectedRevision?: InputMaybe<Scalars['Int']['input']>;
  retiredPlayer: Scalars['Int']['input'];
  sessionId: Scalars['String']['input'];
};

export type ScoreboardScorePointInput = {
  /** Optimistic concurrency — mismatch returns 409 */
  expectedRevision?: InputMaybe<Scalars['Int']['input']>;
  pointValue?: InputMaybe<Scalars['Int']['input']>;
  scoringPlayer: Scalars['Int']['input'];
  sessionId: Scalars['String']['input'];
};

export type ScoreboardScorecard = {
  __typename?: 'ScoreboardScorecard';
  announcementText?: Maybe<Scalars['String']['output']>;
  bestOf: Scalars['Int']['output'];
  currentPeriod?: Maybe<Scalars['Int']['output']>;
  currentSetIndex: Scalars['Int']['output'];
  elapsedSeconds: Scalars['Int']['output'];
  isTiebreak?: Maybe<Scalars['Boolean']['output']>;
  leftSidePlayer?: Maybe<Scalars['Int']['output']>;
  matchEvents?: Maybe<Array<MatchEventGql>>;
  phase?: Maybe<MatchPhase>;
  phaseEndsAt?: Maybe<Scalars['String']['output']>;
  pointHistory: Array<ScoreboardPointEvent>;
  revision?: Maybe<Scalars['Int']['output']>;
  scoringConfig: ScoringConfig;
  servingPlayer?: Maybe<Scalars['Int']['output']>;
  sessionId: Scalars['ID']['output'];
  sets: Array<ScoreboardScorecardSet>;
  side1Serving?: Maybe<Scalars['Boolean']['output']>;
  sportState?: Maybe<BadmintonMatchStateGql>;
  status: ScorecardStatus;
};

export type ScoreboardScorecardSet = {
  __typename?: 'ScoreboardScorecardSet';
  isComplete: Scalars['Boolean']['output'];
  player1Score: Scalars['Int']['output'];
  player2Score: Scalars['Int']['output'];
  setNumber: Scalars['Int']['output'];
  winner?: Maybe<Scalars['Int']['output']>;
};

export type ScoreboardSession = {
  __typename?: 'ScoreboardSession';
  _id: Scalars['ID']['output'];
  abandonReason?: Maybe<ScoreboardAbandonReason>;
  createdAt: Scalars['DateTime']['output'];
  finishedAt?: Maybe<Scalars['DateTime']['output']>;
  lastScoringActivityAt?: Maybe<Scalars['DateTime']['output']>;
  matchFormat: ScoreboardMatchFormat;
  ownerId: Scalars['ID']['output'];
  scheduledAt?: Maybe<Scalars['DateTime']['output']>;
  scorecard?: Maybe<ScoreboardScorecard>;
  scoringConfig: ScoringConfig;
  side1: ScoreboardSide;
  side2: ScoreboardSide;
  sportType: SportType;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  status: ScoreboardSessionStatus;
  updatedAt: Scalars['DateTime']['output'];
  viewerToken: Scalars['String']['output'];
  visibility: ScoreboardVisibility;
  winner?: Maybe<Scalars['Int']['output']>;
};

/** A Relay-style connection for ScoreboardSession items. */
export type ScoreboardSessionConnection = {
  __typename?: 'ScoreboardSessionConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<ScoreboardSessionEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the ScoreboardSessionConnection. */
export type ScoreboardSessionEdge = {
  __typename?: 'ScoreboardSessionEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: ScoreboardSession;
};

export type ScoreboardSessionIdInput = {
  expectedRevision?: InputMaybe<Scalars['Int']['input']>;
  sessionId: Scalars['String']['input'];
};

export enum ScoreboardSessionStatus {
  Abandoned = 'ABANDONED',
  Cancelled = 'CANCELLED',
  Draft = 'DRAFT',
  Finished = 'FINISHED',
  Live = 'LIVE',
  Scheduled = 'SCHEDULED'
}

export type ScoreboardSessionsFilterInput = {
  datePreset?: InputMaybe<ScoreboardDatePreset>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  sportType?: InputMaybe<SportType>;
  status?: InputMaybe<ScoreboardSessionStatus>;
  tab: ScoreboardHubTab;
};

export type ScoreboardSetBadmintonDoublesServerInput = {
  expectedRevision?: InputMaybe<Scalars['Int']['input']>;
  receiverPlayerIndex?: InputMaybe<Scalars['Int']['input']>;
  serverPlayerIndex: Scalars['Int']['input'];
  sessionId: Scalars['String']['input'];
};

export type ScoreboardSetServingPlayerInput = {
  expectedRevision?: InputMaybe<Scalars['Int']['input']>;
  servingPlayer: Scalars['Int']['input'];
  sessionId: Scalars['String']['input'];
};

export type ScoreboardSide = {
  __typename?: 'ScoreboardSide';
  label: Scalars['String']['output'];
  memberLabels?: Maybe<Array<Scalars['String']['output']>>;
};

export type ScoreboardSideInput = {
  label: Scalars['String']['input'];
  memberLabels?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ScoreboardUpdateElapsedInput = {
  seconds: Scalars['Int']['input'];
  sessionId: Scalars['String']['input'];
};

export enum ScoreboardVisibility {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type ScorecardSet = {
  __typename?: 'ScorecardSet';
  isComplete: Scalars['Boolean']['output'];
  player1Score: Scalars['Int']['output'];
  player2Score: Scalars['Int']['output'];
  setNumber: Scalars['Int']['output'];
  /** 1 or 2 */
  winner?: Maybe<Scalars['Int']['output']>;
};

/** Status of a match scorecard */
export enum ScorecardStatus {
  Finished = 'FINISHED',
  Interval = 'INTERVAL',
  InProgress = 'IN_PROGRESS',
  MatchPoint = 'MATCH_POINT',
  NotStarted = 'NOT_STARTED',
  SetPoint = 'SET_POINT'
}

/** Generic scoring configuration for any sport */
export type ScoringConfig = {
  __typename?: 'ScoringConfig';
  /** Best of N sets/periods */
  bestOf: Scalars['Int']['output'];
  /** Score at which deuce starts */
  deuceAt: Scalars['Int']['output'];
  /** Whether deuce rules apply */
  deuceEnabled: Scalars['Boolean']['output'];
  /** Frames to win (billiards / FRAMES scoring system) */
  framesToWin?: Maybe<Scalars['Int']['output']>;
  /** Max points per set (0 = unlimited, win by margin) */
  maxPoints: Scalars['Int']['output'];
  /** Period duration in minutes (timed sports) */
  periodDurationMinutes: Scalars['Int']['output'];
  /** Number of periods (timed sports) */
  periodsCount: Scalars['Int']['output'];
  /** Points to win a set (0 for timed sports) */
  pointsPerSet: Scalars['Int']['output'];
  scoringSystem: ScoringSystem;
  /** Serve rotation interval (used when serveRule = ROTATION) */
  serveRotationInterval?: Maybe<Scalars['Int']['output']>;
  /** How serve changes after each point (default: RALLY_POINT) */
  serveRule?: Maybe<ServeRule>;
  /** Sets needed to win the match */
  setsToWin: Scalars['Int']['output'];
  /** Whether tiebreak rules apply (tennis) */
  tiebreakEnabled: Scalars['Boolean']['output'];
  /** Points to win a tiebreak */
  tiebreakPoints: Scalars['Int']['output'];
  /** Must win by N points (default 2) */
  winByMargin: Scalars['Int']['output'];
};

export type ScoringConfigInput = {
  bestOf: Scalars['Int']['input'];
  deuceAt?: Scalars['Int']['input'];
  deuceEnabled?: Scalars['Boolean']['input'];
  framesToWin?: InputMaybe<Scalars['Int']['input']>;
  maxPoints?: Scalars['Int']['input'];
  periodDurationMinutes?: Scalars['Int']['input'];
  periodsCount?: Scalars['Int']['input'];
  pointsPerSet: Scalars['Int']['input'];
  scoringSystem: ScoringSystem;
  serveRotationInterval?: InputMaybe<Scalars['Int']['input']>;
  serveRule?: InputMaybe<ServeRule>;
  setsToWin: Scalars['Int']['input'];
  tiebreakEnabled?: Scalars['Boolean']['input'];
  tiebreakPoints?: Scalars['Int']['input'];
  winByMargin?: Scalars['Int']['input'];
};

/** Type of scoring system used for a sport */
export enum ScoringSystem {
  Custom = 'CUSTOM',
  Frames = 'FRAMES',
  SetsAndPoints = 'SETS_AND_POINTS',
  TimedGoals = 'TIMED_GOALS',
  TimedPoints = 'TIMED_POINTS'
}

export type SearchMessagesInput = {
  /** Conversation ID to search within */
  conversationId: Scalars['ID']['input'];
  /** Filter by message type */
  messageType?: InputMaybe<MessageType>;
  /** Search query */
  query: Scalars['String']['input'];
  /** Filter by sender user ID */
  senderId?: InputMaybe<Scalars['ID']['input']>;
};

export type SeedPlayerInput = {
  /** Registration ID */
  registrationId: Scalars['ID']['input'];
  /** Seed number (1 = top seed) */
  seed: Scalars['Int']['input'];
};

export type SeedPlayersInput = {
  categoryId: Scalars['ID']['input'];
  seeds: Array<SeedPlayerInput>;
};

export type SendGroupMessageInput = {
  /** Message text content */
  content?: InputMaybe<Scalars['String']['input']>;
  /** Group ID to send message to */
  groupId: Scalars['ID']['input'];
  /** Media attachments */
  media?: InputMaybe<Array<GroupMessageMediaInput>>;
  /** ID of message being replied to */
  replyToId?: InputMaybe<Scalars['ID']['input']>;
  /** ID of shared pickup game (for GAME_SHARE type) */
  sharedGameId?: InputMaybe<Scalars['ID']['input']>;
  /** Type of message */
  type?: InputMaybe<GroupMessageType>;
};

export type SendMessageInput = {
  /** Conversation ID to send message to */
  conversationId: Scalars['ID']['input'];
  /** Location data */
  location?: InputMaybe<MessageLocationInput>;
  /** Media attachment */
  media?: InputMaybe<MessageMediaInput>;
  /** Message ID to reply to */
  replyToId?: InputMaybe<Scalars['ID']['input']>;
  /** Text content (required for text messages) */
  text?: InputMaybe<Scalars['String']['input']>;
  /** Type of message */
  type?: MessageType;
};

export type SendNotificationResponse = {
  __typename?: 'SendNotificationResponse';
  /** Error messages if any */
  errors?: Maybe<Array<Scalars['String']['output']>>;
  /** Number of failed sends */
  failureCount: Scalars['Int']['output'];
  /** Response message */
  message: Scalars['String']['output'];
  /** Message IDs from FCM */
  messageIds?: Maybe<Array<Scalars['String']['output']>>;
  /** Whether the notification was sent successfully */
  success: Scalars['Boolean']['output'];
  /** Number of successful sends */
  successCount: Scalars['Int']['output'];
};

export type SendNotificationToTopicInput = {
  /** Notification body/message */
  body: Scalars['String']['input'];
  /** Custom data payload as JSON */
  data?: InputMaybe<NotificationDataInput>;
  /** Image URL for rich notification */
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Notification title */
  title: Scalars['String']['input'];
  /** Topic name */
  topic: Scalars['String']['input'];
};

export type SendNotificationToUserInput = {
  /** Notification body/message */
  body: Scalars['String']['input'];
  /** Custom data payload as JSON */
  data?: InputMaybe<NotificationDataInput>;
  /** Image URL for rich notification */
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Notification title */
  title: Scalars['String']['input'];
  /** Target user ID */
  userId: Scalars['String']['input'];
};

export type SendNotificationToUsersInput = {
  /** Notification body/message */
  body: Scalars['String']['input'];
  /** Custom data payload as JSON */
  data?: InputMaybe<NotificationDataInput>;
  /** Image URL for rich notification */
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Notification title */
  title: Scalars['String']['input'];
  /** Array of target user IDs */
  userIds: Array<Scalars['String']['input']>;
};

/** How serve changes after each scored point */
export enum ServeRule {
  NoServe = 'NO_SERVE',
  RallyPoint = 'RALLY_POINT',
  Rotation = 'ROTATION',
  SideOut = 'SIDE_OUT'
}

export type ServerInfo = {
  __typename?: 'ServerInfo';
  environment: Scalars['String']['output'];
  name: Scalars['String']['output'];
  status: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export enum ServiceCourtSide {
  Left = 'LEFT',
  Right = 'RIGHT'
}

export type ServicePerformance = {
  __typename?: 'ServicePerformance';
  /** Number of bookings/orders */
  bookings: Scalars['Int']['output'];
  /** Icon name for display */
  icon: Scalars['String']['output'];
  /** Service/Product ID */
  id: Scalars['String']['output'];
  /** Service/Product name */
  name: Scalars['String']['output'];
  /** Revenue from this service */
  revenue: Scalars['Int']['output'];
  /** Trend percentage vs previous period */
  trend: Scalars['Float']['output'];
};

export type SessionInfo = {
  __typename?: 'SessionInfo';
  clientSource?: Maybe<ClientSource>;
  createdAt: Scalars['DateTime']['output'];
  deviceInfo?: Maybe<DeviceInfo>;
  deviceName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  isCurrent: Scalars['Boolean']['output'];
  lastUsedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Approximate login location resolved from IP (city, country) */
  loginLocation?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
};

export type SetMatchWalkoverInput = {
  matchId: Scalars['ID']['input'];
  /** Lý do walkover (audit bắt buộc) */
  reason: Scalars['String']['input'];
  /** Winner: 1 or 2 */
  winner: Scalars['Int']['input'];
};

export type SetRetirementInput = {
  matchId: Scalars['ID']['input'];
  /** Player who retired: 1 or 2 */
  retiredPlayer: Scalars['Int']['input'];
};

export type SetScoreSummary = {
  __typename?: 'SetScoreSummary';
  player1: Scalars['Int']['output'];
  player2: Scalars['Int']['output'];
};

export type SetServingPlayerInput = {
  matchId: Scalars['ID']['input'];
  /** Player who has serve: 1 or 2 */
  servingPlayer: Scalars['Int']['input'];
};

export type ShareGameToGroupsInput = {
  /** ID of the pickup game to share */
  gameId: Scalars['ID']['input'];
  /** IDs of groups to share to */
  groupIds: Array<Scalars['ID']['input']>;
  /** Optional message to include */
  message?: InputMaybe<Scalars['String']['input']>;
};

export type SignInInput = {
  emailOrPhone: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SkillRequirement = {
  __typename?: 'SkillRequirement';
  /** Mô tả trình độ */
  description?: Maybe<Scalars['String']['output']>;
  /** Thứ tự numeric của các trình độ (dùng cho filter) */
  levelOrders: Array<Scalars['Int']['output']>;
  /** Danh sách trình độ được chọn */
  levels: Array<Scalars['String']['output']>;
  /** Trình độ tối đa (legacy) */
  maxLevel?: Maybe<Scalars['String']['output']>;
  /** Trình độ tối thiểu (legacy) */
  minLevel?: Maybe<Scalars['String']['output']>;
  /** Hệ thống xếp hạng (DEFAULT, BADMINTON, FOOTBALL, PB_TIME, PB_RATING) */
  skillSystem?: Maybe<Scalars['String']['output']>;
};

export type SkillRequirementInput = {
  /** Mô tả trình độ */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Thứ tự numeric của các trình độ (dùng cho filter) */
  levelOrders: Array<Scalars['Int']['input']>;
  /** Danh sách trình độ được chọn */
  levels: Array<Scalars['String']['input']>;
  /** Hệ thống xếp hạng (DEFAULT, BADMINTON, FOOTBALL, PB_TIME, PB_RATING) */
  skillSystem?: InputMaybe<Scalars['String']['input']>;
};

export type SkuAvailabilityResult = {
  __typename?: 'SkuAvailabilityResult';
  /** Whether SKU is available */
  available: Scalars['Boolean']['output'];
  /** Existing product ID if SKU is taken */
  existingProductId?: Maybe<Scalars['String']['output']>;
};

export type SlotConfig = {
  __typename?: 'SlotConfig';
  /** Số người hiện tại */
  currentCount: Scalars['Int']['output'];
  /** Số người tối đa */
  maxParticipants: Scalars['Int']['output'];
  /** Số người tối thiểu */
  minParticipants: Scalars['Int']['output'];
  /** Giới hạn waitlist */
  waitlistLimit: Scalars['Int']['output'];
};

export type SlotConfigInput = {
  /** Số người tối đa */
  maxParticipants: Scalars['Int']['input'];
  /** Số người tối thiểu */
  minParticipants: Scalars['Int']['input'];
  /** Giới hạn waitlist */
  waitlistLimit?: InputMaybe<Scalars['Int']['input']>;
};

export type SlotDiscount = {
  __typename?: 'SlotDiscount';
  /** Court ID */
  courtId: Scalars['ID']['output'];
  /** Discount amount for this slot */
  discountAmount: Scalars['Int']['output'];
  /** Slot end time (HH:mm) */
  endTime: Scalars['String']['output'];
  /** Final price after discount */
  finalPrice: Scalars['Int']['output'];
  /** Original price for this slot */
  originalPrice: Scalars['Int']['output'];
  /** Slot start time (HH:mm) */
  startTime: Scalars['String']['output'];
};

export type SlotPriceInfoInput = {
  /** Court ID */
  courtId: Scalars['ID']['input'];
  /** Slot end time (HH:mm) */
  endTime: Scalars['String']['input'];
  /** Price for this slot */
  price: Scalars['Int']['input'];
  /** Slot start time (HH:mm) */
  startTime: Scalars['String']['input'];
};

/** Thứ tự sắp xếp */
export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Sport = {
  __typename?: 'Sport';
  _id: Scalars['ID']['output'];
  /** Primary color key from theme */
  colorKey: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Display order (lower = first) */
  displayOrder: Scalars['Int']['output'];
  /** Emoji for display */
  emoji?: Maybe<Scalars['String']['output']>;
  /** Gradient end color key */
  gradientEndColorKey?: Maybe<Scalars['String']['output']>;
  /** Gradient start color key */
  gradientStartColorKey?: Maybe<Scalars['String']['output']>;
  /** Icon name (Ionicons) */
  icon: Scalars['String']['output'];
  /** Is this sport active/enabled */
  isActive: Scalars['Boolean']['output'];
  /** Is this sport popular/featured */
  isPopular: Scalars['Boolean']['output'];
  /** Display name in Vietnamese */
  name: Scalars['String']['output'];
  /** Display name in English */
  nameEn?: Maybe<Scalars['String']['output']>;
  /** Unique sport type identifier */
  type: SportType;
  updatedAt: Scalars['DateTime']['output'];
};

export type SportGameCount = {
  __typename?: 'SportGameCount';
  /** Số lượng kèo */
  count: Scalars['Int']['output'];
  /** Môn thể thao */
  sportType: SportType;
};

/** Type of sport supported by the application */
export enum SportType {
  Badminton = 'BADMINTON',
  Basketball = 'BASKETBALL',
  Billiards = 'BILLIARDS',
  Football = 'FOOTBALL',
  Pickleball = 'PICKLEBALL',
  TableTennis = 'TABLE_TENNIS',
  Tennis = 'TENNIS',
  Volleyball = 'VOLLEYBALL'
}

export type StackingRules = {
  __typename?: 'StackingRules';
  /** Can stack with other promotions */
  canStack: Scalars['Boolean']['output'];
  /** Max total discount amount when stacking */
  maxStackDiscountAmount?: Maybe<Scalars['Int']['output']>;
  /** Max total discount percentage when stacking */
  maxStackDiscountPercent?: Maybe<Scalars['Int']['output']>;
  /** Categories that can stack with this */
  stackableWithCategories?: Maybe<Array<PromotionCategory>>;
  /** Specific promotion IDs that can stack with this */
  stackableWithIds?: Maybe<Array<Scalars['ID']['output']>>;
};

export type StackingRulesInput = {
  /** Can stack with other promotions */
  canStack: Scalars['Boolean']['input'];
  /** Max total discount amount when stacking */
  maxStackDiscountAmount?: InputMaybe<Scalars['Int']['input']>;
  /** Max total discount percentage when stacking (0-100) */
  maxStackDiscountPercent?: InputMaybe<Scalars['Int']['input']>;
  /** Categories that can stack with this */
  stackableWithCategories?: InputMaybe<Array<PromotionCategory>>;
  /** Specific promotion IDs that can stack with this */
  stackableWithIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

/** Venue staff badge for chat participants */
export type StaffBadge = {
  __typename?: 'StaffBadge';
  customTitle?: Maybe<Scalars['String']['output']>;
  isOwner: Scalars['Boolean']['output'];
  userId: Scalars['ID']['output'];
  venueId: Scalars['ID']['output'];
  venueImage?: Maybe<Scalars['String']['output']>;
  venueName: Scalars['String']['output'];
};

export type StartMatchInput = {
  /** What the toss winner chose: SERVE or SIDE */
  coinTossChoice?: InputMaybe<CoinTossChoice>;
  /** Coin toss winner: 1 or 2 */
  coinTossWinner?: InputMaybe<Scalars['Int']['input']>;
  /** Who is on the left side: 1 or 2 */
  leftSidePlayer?: InputMaybe<Scalars['Int']['input']>;
  matchId: Scalars['ID']['input'];
  /** Initial serving player: 1 or 2 */
  servingPlayer?: InputMaybe<Scalars['Int']['input']>;
  /** How setup was decided: MANUAL or COIN_TOSS */
  setupMethod?: InputMaybe<MatchSetupMethod>;
};

export type StartScoreboardSessionInput = {
  sessionId: Scalars['String']['input'];
  setup: MatchSetupInput;
};

/** Reason for stock adjustment */
export enum StockAdjustmentReason {
  Correction = 'CORRECTION',
  Damaged = 'DAMAGED',
  Expired = 'EXPIRED',
  InventoryCount = 'INVENTORY_COUNT',
  Lost = 'LOST',
  Other = 'OTHER',
  Theft = 'THEFT'
}

export type StockAlertProduct = {
  __typename?: 'StockAlertProduct';
  /** Alert type: out_of_stock | low_stock */
  alertType: Scalars['String']['output'];
  /** Category name */
  categoryName: Scalars['String']['output'];
  /** Current stock quantity */
  currentStock: Scalars['Int']['output'];
  /** Estimated days until out of stock */
  daysUntilOutOfStock?: Maybe<Scalars['Int']['output']>;
  /** Product image URL */
  imageUrl?: Maybe<Scalars['String']['output']>;
  /** Low stock threshold */
  lowStockThreshold?: Maybe<Scalars['Int']['output']>;
  /** Product ID */
  productId: Scalars['String']['output'];
  /** Product name */
  productName: Scalars['String']['output'];
  /** Recent sales (last 7 days) */
  recentSales: Scalars['Int']['output'];
  /** Product SKU */
  sku?: Maybe<Scalars['String']['output']>;
};

export type StockMovement = {
  __typename?: 'StockMovement';
  _id: Scalars['ID']['output'];
  /** Reason for adjustment */
  adjustmentReason?: Maybe<StockAdjustmentReason>;
  /** Cost at time of sale (for profit calculation) */
  costAtSale?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** User who performed this action */
  createdBy: Scalars['ID']['output'];
  /** User who created */
  createdByUser?: Maybe<User>;
  /** Import price per unit (for IMPORT type) */
  importPrice?: Maybe<Scalars['Float']['output']>;
  /** Invoice/receipt number */
  invoiceNumber?: Maybe<Scalars['String']['output']>;
  /** FIFO lot allocations for this sale */
  lotAllocations?: Maybe<Array<LotAllocationRecord>>;
  /** Stock after this movement */
  newStock: Scalars['Int']['output'];
  /** Additional notes */
  note?: Maybe<Scalars['String']['output']>;
  /** Order ID (for SALE type) */
  orderId?: Maybe<Scalars['ID']['output']>;
  /** Stock before this movement */
  previousStock: Scalars['Int']['output'];
  /** Product info */
  product?: Maybe<Product>;
  /** Product ID */
  productId: Scalars['ID']['output'];
  /** Quantity change (positive for in, negative for out) */
  quantity: Scalars['Int']['output'];
  /** Related product ID at destination venue (for merged transfers) */
  relatedProductId?: Maybe<Scalars['ID']['output']>;
  /** Related venue ID (for TRANSFER type) */
  relatedVenueId?: Maybe<Scalars['ID']['output']>;
  /** Sale price per unit (for SALE type) */
  salePrice?: Maybe<Scalars['Float']['output']>;
  /** Supplier contact (phone/email) */
  supplierContact?: Maybe<Scalars['String']['output']>;
  /** Supplier name */
  supplierName?: Maybe<Scalars['String']['output']>;
  /** Total import cost = quantity × importPrice */
  totalCost?: Maybe<Scalars['Float']['output']>;
  /** Type of movement */
  type: StockMovementType;
  updatedAt: Scalars['DateTime']['output'];
  /** Variant ID (if applicable) */
  variantId?: Maybe<Scalars['ID']['output']>;
  /** Venue ID */
  venueId: Scalars['ID']['output'];
};

/** A Relay-style connection for StockMovement items. */
export type StockMovementConnection = {
  __typename?: 'StockMovementConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<StockMovementEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the StockMovementConnection. */
export type StockMovementEdge = {
  __typename?: 'StockMovementEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: StockMovement;
};

export type StockMovementFilterInput = {
  /** Start date */
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  /** End date */
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter by product ID */
  productId?: InputMaybe<Scalars['ID']['input']>;
  /** Search by supplier name or invoice */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  /** Filter by movement types */
  types?: InputMaybe<Array<StockMovementType>>;
};

export type StockMovementSortInput = {
  /** Sort by field */
  sortBy?: InputMaybe<Scalars['String']['input']>;
  /** Sort order */
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};

/** Type of stock movement */
export enum StockMovementType {
  AdjustmentAdd = 'ADJUSTMENT_ADD',
  AdjustmentSubtract = 'ADJUSTMENT_SUBTRACT',
  Import = 'IMPORT',
  Return = 'RETURN',
  Sale = 'SALE',
  TransferIn = 'TRANSFER_IN',
  TransferOut = 'TRANSFER_OUT'
}

export type SubmitContactInquiryInput = {
  /** Sender email address */
  email: Scalars['String']['input'];
  /** Inquiry message content */
  message: Scalars['String']['input'];
  /** Sender full name */
  name: Scalars['String']['input'];
  /** Sender phone number (VN format) */
  phone: Scalars['String']['input'];
  /** Inquiry subject category */
  subject: ContactSubject;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Fires when a comment is created on a specific post. Subscribe with `postId` from PostDetail. */
  commentCreated: PostComment;
  /** Fires when a comment is deleted on a specific post. Subscribe with `postId` from PostDetail. */
  commentDeleted: CommentDeletedPayload;
  /** Fires when a comment is updated on a specific post. Subscribe with `postId` from PostDetail. */
  commentUpdated: PostComment;
  /** Subscribe to message read receipts in a group */
  groupMessageRead: GroupMessageReadPayload;
  /** Subscribe to new messages in a group */
  groupMessageSent: GroupMessage;
  /** Subscribe to message updates in a group (reactions, edits) */
  groupMessageUpdated: GroupMessage;
  /** Subscribe to typing indicators in a group */
  groupTypingStatus: GroupTypingStatusPayload;
  /** Score updates for a specific match */
  matchScoreUpdated: MatchScorecard;
  /** Subscribe to message deletions */
  messageDeleted: MessageDeletedPayload;
  /** Batched reaction updates for a conversation (200ms window). */
  messageReactionsBatch: MessageReactionsBatchPayload;
  /** Subscribe to message read receipts */
  messageRead: MessageReadPayload;
  /** Subscribe to new messages in a conversation */
  messageSent: Message;
  /** Subscribe to message updates */
  messageUpdated: Message;
  /** Real-time notification for a specific user */
  notificationCreated: Notification;
  /** Fires when a new post is created. Subscribe from the feed to show a "new posts" pill. */
  postCreated: Post;
  /** Fires when a specific post is deleted. Subscribe with `postId` from PostDetail. */
  postDeleted: PostDeletedPayload;
  /** Fires when a specific post is updated. Subscribe with `postId` from PostDetail. */
  postUpdated: Post;
  /** Realtime scoreboard session updates */
  scoreboardSessionUpdated: ScoreboardSession;
  /** Fires when any tournament status changes (e.g. DRAFT→PUBLISHED). Use to refetch tournament list. */
  tournamentListUpdated: Scalars['String']['output'];
  /** Any match updated in tournament */
  tournamentMatchesUpdated: Scalars['String']['output'];
  /** Tournament referee pool changed (invite, respond, update, remove) */
  tournamentRefereesUpdated: Scalars['String']['output'];
  /** Tournament status changed */
  tournamentStatusChanged: Scalars['String']['output'];
  /** Subscribe to typing indicators */
  typingStatus: TypingStatusPayload;
};


export type SubscriptionCommentCreatedArgs = {
  postId: Scalars['ID']['input'];
};


export type SubscriptionCommentDeletedArgs = {
  postId: Scalars['ID']['input'];
};


export type SubscriptionCommentUpdatedArgs = {
  postId: Scalars['ID']['input'];
};


export type SubscriptionGroupMessageReadArgs = {
  groupId: Scalars['ID']['input'];
};


export type SubscriptionGroupMessageSentArgs = {
  groupId: Scalars['ID']['input'];
};


export type SubscriptionGroupMessageUpdatedArgs = {
  groupId: Scalars['ID']['input'];
};


export type SubscriptionGroupTypingStatusArgs = {
  groupId: Scalars['ID']['input'];
};


export type SubscriptionMatchScoreUpdatedArgs = {
  _matchId: Scalars['ID']['input'];
};


export type SubscriptionMessageDeletedArgs = {
  conversationId: Scalars['ID']['input'];
};


export type SubscriptionMessageReactionsBatchArgs = {
  conversationId: Scalars['ID']['input'];
};


export type SubscriptionMessageReadArgs = {
  conversationId: Scalars['ID']['input'];
};


export type SubscriptionMessageSentArgs = {
  conversationId: Scalars['ID']['input'];
};


export type SubscriptionMessageUpdatedArgs = {
  conversationId: Scalars['ID']['input'];
};


export type SubscriptionNotificationCreatedArgs = {
  userId: Scalars['ID']['input'];
};


export type SubscriptionPostDeletedArgs = {
  postId: Scalars['ID']['input'];
};


export type SubscriptionPostUpdatedArgs = {
  postId: Scalars['ID']['input'];
};


export type SubscriptionScoreboardSessionUpdatedArgs = {
  sessionId: Scalars['ID']['input'];
};


export type SubscriptionTournamentMatchesUpdatedArgs = {
  _tournamentId: Scalars['ID']['input'];
};


export type SubscriptionTournamentRefereesUpdatedArgs = {
  _tournamentId: Scalars['ID']['input'];
};


export type SubscriptionTournamentStatusChangedArgs = {
  _tournamentId: Scalars['ID']['input'];
};


export type SubscriptionTypingStatusArgs = {
  conversationId: Scalars['ID']['input'];
};

export type SuccessResponse = {
  __typename?: 'SuccessResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type SuggestedPrice = {
  __typename?: 'SuggestedPrice';
  p25?: Maybe<Scalars['Float']['output']>;
  p50?: Maybe<Scalars['Float']['output']>;
  p75?: Maybe<Scalars['Float']['output']>;
  /** Số pass mẫu dùng để tính */
  sampleSize: Scalars['Int']['output'];
  /** Giá đề xuất chính (median của các pass tương tự đã COMPLETED 90 ngày qua) */
  suggested?: Maybe<Scalars['Float']['output']>;
};

export type SuggestedPriceFilterInput = {
  /** Tỉnh / thành phố */
  city?: InputMaybe<Scalars['String']['input']>;
  sportType?: InputMaybe<SportType>;
  /** Lọc theo venue (ưu tiên cùng sân). */
  venueId?: InputMaybe<Scalars['ID']['input']>;
};

export type SwapCourtSidesInput = {
  matchId: Scalars['ID']['input'];
};

export type SystemStats = {
  __typename?: 'SystemStats';
  activeUsers: Scalars['Int']['output'];
  activeVenues: Scalars['Int']['output'];
  pendingVenues: Scalars['Int']['output'];
  suspendedUsers: Scalars['Int']['output'];
  totalBookings: Scalars['Int']['output'];
  totalRevenue: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
  totalVenues: Scalars['Int']['output'];
};

/** Khung giờ trong ngày để lọc pass */
export enum TimeOfDay {
  Afternoon = 'AFTERNOON',
  Evening = 'EVENING',
  Morning = 'MORNING',
  Night = 'NIGHT'
}

export type TimeRange = {
  __typename?: 'TimeRange';
  /** End time (HH:mm) */
  endTime: Scalars['String']['output'];
  /** Start time (HH:mm) */
  startTime: Scalars['String']['output'];
};

export type TimeRangeInput = {
  /** End time (HH:mm) */
  endTime: Scalars['String']['input'];
  /** Start time (HH:mm) */
  startTime: Scalars['String']['input'];
};

export type TimeSlotAvailability = {
  __typename?: 'TimeSlotAvailability';
  /** Booking ID if slot is booked (for CONFIRMED/COMPLETED) */
  bookingId?: Maybe<Scalars['ID']['output']>;
  /** Booking status if slot is booked */
  bookingStatus?: Maybe<Scalars['String']['output']>;
  /** Customer ID who booked this slot */
  customerId?: Maybe<Scalars['ID']['output']>;
  /** Customer name who booked this slot */
  customerName?: Maybe<Scalars['String']['output']>;
  /** Customer phone who booked this slot */
  customerPhone?: Maybe<Scalars['String']['output']>;
  /** End time (HH:mm) */
  endTime: Scalars['String']['output'];
  /** Has active booking pass for this slot */
  hasActivePass?: Maybe<Scalars['Boolean']['output']>;
  /** Booking ID of the hold */
  holdBookingId?: Maybe<Scalars['String']['output']>;
  /** Hold expiration time (ISO string) */
  holdExpiresAt?: Maybe<Scalars['String']['output']>;
  /** Is available */
  isAvailable: Scalars['Boolean']['output'];
  /** Is slot being held (reservation hold - HOLD_ACTIVE) */
  isHold?: Maybe<Scalars['Boolean']['output']>;
  /** Is hold active booking by current user */
  isMyHoldActive?: Maybe<Scalars['Boolean']['output']>;
  /** Is hold pending booking by current user (waiting for approval) */
  isMyHoldPending?: Maybe<Scalars['Boolean']['output']>;
  /** Is pending booking by current user */
  isMyPending?: Maybe<Scalars['Boolean']['output']>;
  /** Is in past */
  isPast: Scalars['Boolean']['output'];
  /** Is peak hour */
  isPeakHour: Scalars['Boolean']['output'];
  /** Whether the booking is a recurring (fixed) schedule */
  isRecurring?: Maybe<Scalars['Boolean']['output']>;
  /** Booking ID if slot is user hold active booking */
  myHoldActiveBookingId?: Maybe<Scalars['ID']['output']>;
  /** Booking ID if slot is user hold pending booking */
  myHoldPendingBookingId?: Maybe<Scalars['ID']['output']>;
  /** Booking ID if slot is user pending booking */
  myPendingBookingId?: Maybe<Scalars['ID']['output']>;
  /** Pass asking price */
  passAskingPrice?: Maybe<Scalars['Int']['output']>;
  /** Pass ID if slot has active pass */
  passId?: Maybe<Scalars['String']['output']>;
  /** Price */
  price: Scalars['Int']['output'];
  /** Start time (HH:mm) */
  startTime: Scalars['String']['output'];
};

export type TopCampaignParticipant = {
  __typename?: 'TopCampaignParticipant';
  /** Tỉ lệ check-in */
  attendanceRate: Scalars['Float']['output'];
  /** Avatar URL */
  avatarUrl?: Maybe<Scalars['String']['output']>;
  /** Tên hiển thị */
  displayName: Scalars['String']['output'];
  /** Số kèo đã check-in */
  gamesCheckedIn: Scalars['Int']['output'];
  /** Số kèo đã tham gia trong campaign */
  gamesJoined: Scalars['Int']['output'];
  /** ID người dùng */
  userId: Scalars['ID']['output'];
};

export type TopParticipant = {
  __typename?: 'TopParticipant';
  /** Tên hiển thị */
  displayName: Scalars['String']['output'];
  /** Số lần tham gia */
  gamesCount: Scalars['Int']['output'];
  /** Avatar */
  photoURL?: Maybe<Scalars['String']['output']>;
  /** ID người chơi */
  userId: Scalars['String']['output'];
};

export type TopSellingProduct = {
  __typename?: 'TopSellingProduct';
  /** Product category */
  category: Scalars['String']['output'];
  /** Growth compared to previous period (-100 to +inf) */
  growth: Scalars['Float']['output'];
  /** Product ID */
  productId: Scalars['String']['output'];
  /** Product name */
  productName: Scalars['String']['output'];
  /** Total quantity sold */
  quantitySold: Scalars['Int']['output'];
  /** Total revenue from this product */
  revenue: Scalars['Int']['output'];
  /** Percentage of total revenue */
  revenuePercentage: Scalars['Float']['output'];
};

export type TopicSubscriptionResponse = {
  __typename?: 'TopicSubscriptionResponse';
  /** Number of successful subscriptions */
  count: Scalars['Int']['output'];
  /** Response message */
  message: Scalars['String']['output'];
  /** Whether the subscription was successful */
  success: Scalars['Boolean']['output'];
};

export type Tournament = {
  __typename?: 'Tournament';
  _id: Scalars['ID']['output'];
  contacts?: Maybe<Array<TournamentContact>>;
  courts?: Maybe<Array<TournamentCourt>>;
  /** Cover image URL */
  coverImage?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dates: TournamentDates;
  /** Short description for landing page */
  description?: Maybe<Scalars['String']['output']>;
  facilities?: Maybe<Array<TournamentFacility>>;
  /** Highlight bullets */
  highlights?: Maybe<Array<Scalars['String']['output']>>;
  /** Detailed introduction for overview/detail page (markdown) */
  introduction?: Maybe<Scalars['String']['output']>;
  location?: Maybe<TournamentLocation>;
  /** Organizer user ID */
  organizer: Scalars['ID']['output'];
  /** Tên đơn vị ban tổ chức (hiển thị công khai) */
  organizerName?: Maybe<Scalars['String']['output']>;
  paymentInfo?: Maybe<TournamentPaymentInfo>;
  prizes?: Maybe<Array<TournamentPrize>>;
  rules?: Maybe<Array<TournamentRule>>;
  schedule?: Maybe<Array<TournamentSchedulePhase>>;
  scheduleConfig?: Maybe<ScheduleConfig>;
  /** Primary sport */
  sportType: SportType;
  status: TournamentStatus;
  /** Tournament title */
  title: Scalars['String']['output'];
  totalCategories: Scalars['Int']['output'];
  totalMatches: Scalars['Int']['output'];
  totalRegistrations: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type TournamentCategory = {
  __typename?: 'TournamentCategory';
  _id: Scalars['ID']['output'];
  /** Players per group advancing (GROUP_KNOCKOUT) */
  advancingPerGroup?: Maybe<Scalars['Int']['output']>;
  /** Age label (e.g. U11, U13, Open) */
  ageLabel?: Maybe<Scalars['String']['output']>;
  /** Bracket size (power of 2, auto-calculated) */
  bracketSize?: Maybe<Scalars['Int']['output']>;
  completedMatchCount: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Default match duration in minutes for this category */
  defaultMatchDurationMinutes?: Maybe<Scalars['Int']['output']>;
  /** Short description for landing page */
  description?: Maybe<Scalars['String']['output']>;
  /** Display order within tournament */
  displayOrder?: Maybe<Scalars['Int']['output']>;
  format: TournamentFormat;
  gender: TournamentGender;
  /** Groups count (GROUP_KNOCKOUT) */
  groupCount?: Maybe<Scalars['Int']['output']>;
  /** IonIcon name (e.g. people-outline) */
  icon?: Maybe<Scalars['String']['output']>;
  matchCount: Scalars['Int']['output'];
  matchType: MatchType;
  /** Max registrations (0 = unlimited) */
  maxRegistrations?: Maybe<Scalars['Int']['output']>;
  /** Highlight this category on landing */
  popular?: Maybe<Scalars['Boolean']['output']>;
  prizes?: Maybe<Array<TournamentPrize>>;
  registeredCount: Scalars['Int']['output'];
  /** Scoring rules for this category */
  scoringConfig: ScoringConfig;
  /** Number of seeded players */
  seedCount?: Maybe<Scalars['Int']['output']>;
  /** Đồng giải ba - không đánh trận tranh hạng 3-4 (SINGLE_ELIMINATION only) */
  sharedThirdPlace?: Maybe<Scalars['Boolean']['output']>;
  status: CategoryStatus;
  /** Category title (e.g. Nam Đơn U15) */
  title: Scalars['String']['output'];
  tournamentId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type TournamentChampion = {
  __typename?: 'TournamentChampion';
  bronzeNames?: Maybe<Array<Scalars['String']['output']>>;
  categoryId: Scalars['ID']['output'];
  categoryTitle: Scalars['String']['output'];
  goldName?: Maybe<Scalars['String']['output']>;
  silverName?: Maybe<Scalars['String']['output']>;
};

/** A Relay-style connection for Tournament items. */
export type TournamentConnection = {
  __typename?: 'TournamentConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<TournamentEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

export type TournamentContact = {
  __typename?: 'TournamentContact';
  /** Icon name */
  icon?: Maybe<Scalars['String']['output']>;
  /** Contact label (e.g. Hotline, Email) */
  label: Scalars['String']['output'];
  /** Contact value */
  value: Scalars['String']['output'];
};

export type TournamentContactInput = {
  icon?: InputMaybe<Scalars['String']['input']>;
  label: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type TournamentCourt = {
  __typename?: 'TournamentCourt';
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  /** available | maintenance | reserved */
  status?: Maybe<Scalars['String']['output']>;
};

export type TournamentCourtInput = {
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type TournamentDates = {
  __typename?: 'TournamentDates';
  /** Tournament end date */
  endDate?: Maybe<Scalars['DateTime']['output']>;
  /** Registration closes */
  registrationCloseDate?: Maybe<Scalars['DateTime']['output']>;
  /** Registration opens */
  registrationOpenDate?: Maybe<Scalars['DateTime']['output']>;
  /** Tournament start date */
  startDate: Scalars['DateTime']['output'];
};

export type TournamentDatesInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  registrationCloseDate?: InputMaybe<Scalars['String']['input']>;
  registrationOpenDate?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['String']['input'];
};

/** An edge in the TournamentConnection. */
export type TournamentEdge = {
  __typename?: 'TournamentEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Tournament;
};

export type TournamentFacility = {
  __typename?: 'TournamentFacility';
  /** Icon name */
  icon?: Maybe<Scalars['String']['output']>;
  /** Facility label (e.g. Bãi đỗ xe) */
  label: Scalars['String']['output'];
};

export type TournamentFacilityInput = {
  icon?: InputMaybe<Scalars['String']['input']>;
  label: Scalars['String']['input'];
};

export type TournamentFee = {
  __typename?: 'TournamentFee';
  amount: Scalars['String']['output'];
  label: Scalars['String']['output'];
};

export type TournamentFeeInput = {
  amount: Scalars['String']['input'];
  label: Scalars['String']['input'];
};

export type TournamentFilterInput = {
  dateFrom?: InputMaybe<Scalars['String']['input']>;
  dateTo?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<TournamentSortBy>;
  sortOrder?: InputMaybe<TournamentSortOrder>;
  sportType?: InputMaybe<SportType>;
  status?: InputMaybe<TournamentStatus>;
  statuses?: InputMaybe<Array<TournamentStatus>>;
};

/** Bracket/competition format for a tournament category */
export enum TournamentFormat {
  DoubleElimination = 'DOUBLE_ELIMINATION',
  GroupKnockout = 'GROUP_KNOCKOUT',
  RoundRobin = 'ROUND_ROBIN',
  SingleElimination = 'SINGLE_ELIMINATION'
}

/** Gender restriction for a tournament category */
export enum TournamentGender {
  Female = 'FEMALE',
  Male = 'MALE',
  Mixed = 'MIXED',
  Open = 'OPEN'
}

export type TournamentLocation = {
  __typename?: 'TournamentLocation';
  /** Full address */
  address?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  /** Venue name */
  name?: Maybe<Scalars['String']['output']>;
};

export type TournamentLocationInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type TournamentMatch = {
  __typename?: 'TournamentMatch';
  _id: Scalars['ID']['output'];
  /** Position in bracket (for elimination formats) */
  bracketPosition?: Maybe<Scalars['Int']['output']>;
  categoryId: Scalars['ID']['output'];
  court?: Maybe<MatchCourt>;
  createdAt: Scalars['DateTime']['output'];
  /** Match duration in seconds (set after completion) */
  durationSeconds?: Maybe<Scalars['Int']['output']>;
  estimatedDurationMinutes?: Maybe<Scalars['Int']['output']>;
  /** Group ID (for GROUP_KNOCKOUT format) */
  groupId?: Maybe<Scalars['String']['output']>;
  /** True when the match was force-scheduled despite conflict warnings */
  hasConflictWarning?: Maybe<Scalars['Boolean']['output']>;
  /** Is this a BYE match (auto-advance) */
  isBye: Scalars['Boolean']['output'];
  /** Losers bracket next match (double elimination) */
  losersNextMatchId?: Maybe<Scalars['ID']['output']>;
  losersNextMatchSlot?: Maybe<Scalars['Int']['output']>;
  /** Unique match number within tournament */
  matchNumber: Scalars['Int']['output'];
  /** Timestamp when the match was started (status → LIVE) */
  matchStartedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Match ID where winner advances to */
  nextMatchId?: Maybe<Scalars['ID']['output']>;
  /** Slot in next match (1 or 2) */
  nextMatchSlot?: Maybe<Scalars['Int']['output']>;
  player1?: Maybe<MatchPlayer>;
  /** Nhãn ô đấu khi chưa có VĐV (GROUP_KNOCKOUT knockout), ví dụ: Nhất bảng A */
  player1SlotLabel?: Maybe<Scalars['String']['output']>;
  player2?: Maybe<MatchPlayer>;
  /** Nhãn ô đấu khi chưa có VĐV (ví dụ: Nhì bảng B, Thắng trận #12) */
  player2SlotLabel?: Maybe<Scalars['String']['output']>;
  refereeId?: Maybe<Scalars['ID']['output']>;
  /** Invite status when referee has a system account (PENDING/CONFIRMED/DECLINED) */
  refereeInviteStatus?: Maybe<RefereeInviteStatus>;
  refereeName?: Maybe<Scalars['String']['output']>;
  /** Player who retired: 1 or 2 (only set when status is RETIREMENT) */
  retiredPlayer?: Maybe<Scalars['Int']['output']>;
  /** Round number (1 = first round) */
  round: Scalars['Int']['output'];
  /** Round label (e.g. Vòng 1, Tứ kết, Bán kết, Chung kết) */
  roundLabel: Scalars['String']['output'];
  scheduledAt?: Maybe<Scalars['DateTime']['output']>;
  scoreSummary?: Maybe<ScoreSummary>;
  /** Currently serving player (1 or 2), synced from scorecard during LIVE */
  servingPlayer?: Maybe<Scalars['Int']['output']>;
  status: MatchStatus;
  tournamentId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  /** Winner: 1 = player1, 2 = player2 */
  winner?: Maybe<Scalars['Int']['output']>;
};

/** A Relay-style connection for TournamentMatch items. */
export type TournamentMatchConnection = {
  __typename?: 'TournamentMatchConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<TournamentMatchEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the TournamentMatchConnection. */
export type TournamentMatchEdge = {
  __typename?: 'TournamentMatchEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: TournamentMatch;
};

export type TournamentPaymentInfo = {
  __typename?: 'TournamentPaymentInfo';
  accountName?: Maybe<Scalars['String']['output']>;
  accountNumber?: Maybe<Scalars['String']['output']>;
  bank?: Maybe<Scalars['String']['output']>;
  fees?: Maybe<Array<TournamentFee>>;
  qrImage?: Maybe<Scalars['String']['output']>;
};

export type TournamentPaymentInfoInput = {
  accountName?: InputMaybe<Scalars['String']['input']>;
  accountNumber?: InputMaybe<Scalars['String']['input']>;
  bank?: InputMaybe<Scalars['String']['input']>;
  fees?: InputMaybe<Array<TournamentFeeInput>>;
  qrImage?: InputMaybe<Scalars['String']['input']>;
};

/** Payment status for a tournament registration */
export enum TournamentPaymentStatus {
  Paid = 'PAID',
  Refunded = 'REFUNDED',
  Unpaid = 'UNPAID',
  Verifying = 'VERIFYING'
}

export type TournamentPrize = {
  __typename?: 'TournamentPrize';
  /** Prize amount/description */
  amount?: Maybe<Scalars['String']['output']>;
  /** Extra perks */
  perks?: Maybe<Array<Scalars['String']['output']>>;
  /** Rank label (gold, silver, bronze, etc.) */
  rank: Scalars['String']['output'];
  /** Prize title */
  title: Scalars['String']['output'];
};

export type TournamentPrizeInput = {
  amount?: InputMaybe<Scalars['String']['input']>;
  perks?: InputMaybe<Array<Scalars['String']['input']>>;
  rank: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type TournamentReferee = {
  __typename?: 'TournamentReferee';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  /** Max matches per day (0 = unlimited) */
  maxMatchesPerDay: Scalars['Int']['output'];
  /** Display name */
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  /** Preferred court names from tournament.courts */
  preferredCourts?: Maybe<Array<Scalars['String']['output']>>;
  role: RefereeRole;
  status: TournamentRefereeStatus;
  /** Tournament this referee belongs to */
  tournamentId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  /** System user ID (null for external referees) */
  userId?: Maybe<Scalars['ID']['output']>;
};

export type TournamentRefereeFilterInput = {
  role?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type TournamentRefereePublic = {
  __typename?: 'TournamentRefereePublic';
  _id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  role: RefereeRole;
};

/** Status of a referee in the tournament referee pool */
export enum TournamentRefereeStatus {
  Confirmed = 'CONFIRMED',
  Declined = 'DECLINED',
  Invited = 'INVITED',
  Removed = 'REMOVED'
}

export type TournamentRegistration = {
  __typename?: 'TournamentRegistration';
  _id: Scalars['ID']['output'];
  /** Athlete full name */
  athleteName: Scalars['String']['output'];
  avatarUrl?: Maybe<Scalars['String']['output']>;
  /** Số báo danh (SBD) — unique per (tournamentId, categoryId) */
  bibNumber?: Maybe<Scalars['Int']['output']>;
  category?: Maybe<TournamentCategory>;
  categoryId: Scalars['ID']['output'];
  club?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dateOfBirth?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  guardianName?: Maybe<Scalars['String']['output']>;
  guardianPhone?: Maybe<Scalars['String']['output']>;
  identityProofUrl?: Maybe<Scalars['String']['output']>;
  /** Entry members: 1 for singles, 2 for doubles, N for team. Empty for legacy data. */
  members?: Maybe<Array<EntryMember>>;
  notes?: Maybe<Scalars['String']['output']>;
  /** Payment amount in VND */
  paymentAmount?: Maybe<Scalars['Float']['output']>;
  paymentProofUrl?: Maybe<Scalars['String']['output']>;
  paymentStatus: TournamentPaymentStatus;
  /** Participant phone number */
  phone?: Maybe<Scalars['String']['output']>;
  /** User who submitted this registration */
  registeredByUserId: Scalars['ID']['output'];
  registrationStatus: RegistrationStatus;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  reviewedAt?: Maybe<Scalars['DateTime']['output']>;
  reviewedBy?: Maybe<Scalars['ID']['output']>;
  school?: Maybe<Scalars['String']['output']>;
  /** Seed number (set after draw) */
  seed?: Maybe<Scalars['Int']['output']>;
  tournament?: Maybe<Tournament>;
  tournamentId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  /** Registered user (if authenticated) */
  userId?: Maybe<Scalars['ID']['output']>;
};

/** A Relay-style connection for TournamentRegistration items. */
export type TournamentRegistrationConnection = {
  __typename?: 'TournamentRegistrationConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<TournamentRegistrationEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the TournamentRegistrationConnection. */
export type TournamentRegistrationEdge = {
  __typename?: 'TournamentRegistrationEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: TournamentRegistration;
};

export type TournamentRule = {
  __typename?: 'TournamentRule';
  content?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type TournamentRuleInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type TournamentSchedulePhase = {
  __typename?: 'TournamentSchedulePhase';
  /** Phase date (YYYY-MM-DD or ISO 8601) */
  date?: Maybe<Scalars['String']['output']>;
  /** End time (HH:mm or "sáng", "chiều") */
  endTime?: Maybe<Scalars['String']['output']>;
  /** Phase label (e.g. Vòng bảng) */
  label: Scalars['String']['output'];
  /** Start time (HH:mm or "sáng", "chiều") */
  startTime?: Maybe<Scalars['String']['output']>;
  /** upcoming | active | completed */
  status?: Maybe<Scalars['String']['output']>;
};

export type TournamentSchedulePhaseInput = {
  date?: InputMaybe<Scalars['String']['input']>;
  endTime?: InputMaybe<Scalars['String']['input']>;
  label: Scalars['String']['input'];
  startTime?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export enum TournamentSortBy {
  CreatedAt = 'CREATED_AT',
  Registrations = 'REGISTRATIONS',
  StartDate = 'START_DATE',
  Title = 'TITLE'
}

export enum TournamentSortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type TournamentStats = {
  __typename?: 'TournamentStats';
  avgMatchDurationSeconds: Scalars['Int']['output'];
  completedMatches: Scalars['Int']['output'];
  longestMatchDurationSeconds: Scalars['Int']['output'];
  longestMatchLabel?: Maybe<Scalars['String']['output']>;
  totalCategories: Scalars['Int']['output'];
  totalMatches: Scalars['Int']['output'];
  totalPointsScored: Scalars['Int']['output'];
  totalRegistrations: Scalars['Int']['output'];
  totalSetsPlayed: Scalars['Int']['output'];
};

/** Status of a tournament */
export enum TournamentStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Draft = 'DRAFT',
  InProgress = 'IN_PROGRESS',
  Published = 'PUBLISHED',
  RegistrationClosed = 'REGISTRATION_CLOSED',
  RegistrationOpen = 'REGISTRATION_OPEN'
}

export type TransferProductItem = {
  /** Product ID to transfer */
  productId: Scalars['ID']['input'];
  /** Quantity to transfer */
  quantity: Scalars['Int']['input'];
};

export type TransferProductsInput = {
  /** Destination venue ID */
  destinationVenueId: Scalars['ID']['input'];
  /** Products to transfer with quantities */
  products: Array<TransferProductItem>;
  /** Source venue ID */
  sourceVenueId: Scalars['ID']['input'];
};

export type TransferrerRating = {
  __typename?: 'TransferrerRating';
  _id: Scalars['ID']['output'];
  /** Nhận xét tuỳ chọn */
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Pass đã được rate */
  passId: Scalars['ID']['output'];
  rater?: Maybe<User>;
  /** User rate (receiver / transferee) */
  raterId: Scalars['ID']['output'];
  /** Điểm 1-5 */
  score: Scalars['Int']['output'];
  transferrer?: Maybe<User>;
  /** User được rate (transferrer) */
  transferrerId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type TransferrerStats = {
  __typename?: 'TransferrerStats';
  /** Tỷ lệ hoàn tất = totalCompleted / (totalCompleted + totalCancelled). 0..1 */
  completionRate: Scalars['Float']['output'];
  /** Ngày tham gia hệ thống (ISO) */
  memberSince?: Maybe<Scalars['DateTime']['output']>;
  /** Số báo cáo PENDING tích luỹ */
  pendingReports: Scalars['Int']['output'];
  /** Số pass bị huỷ */
  totalCancelled: Scalars['Int']['output'];
  /** Số pass đã hoàn tất giao dịch */
  totalCompleted: Scalars['Int']['output'];
  /** Tổng số pass đã tạo */
  totalCreated: Scalars['Int']['output'];
  /** Số pass hết hạn không ai nhận */
  totalExpired: Scalars['Int']['output'];
};

export type TypingStatusPayload = {
  __typename?: 'TypingStatusPayload';
  conversationId: Scalars['ID']['output'];
  isTyping: Scalars['Boolean']['output'];
  userId: Scalars['ID']['output'];
};

export type UnblockUserInput = {
  /** User ID to unblock */
  userId: Scalars['ID']['input'];
};

export type UnpinMessageInput = {
  /** Conversation ID */
  conversationId: Scalars['ID']['input'];
  /** Message ID to unpin */
  messageId: Scalars['ID']['input'];
};

export type UpdateBibNumberInput = {
  /** null = clear SBD */
  bibNumber?: InputMaybe<Scalars['Int']['input']>;
  registrationId: Scalars['ID']['input'];
};

export type UpdateCategoryInput = {
  advancingPerGroup?: InputMaybe<Scalars['Int']['input']>;
  ageLabel?: InputMaybe<Scalars['String']['input']>;
  /** Bracket size (power of 2). 0 or null = auto-calculate. */
  bracketSize?: InputMaybe<Scalars['Int']['input']>;
  /** Default match duration in minutes (default 30) */
  defaultMatchDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  format?: InputMaybe<TournamentFormat>;
  gender?: InputMaybe<TournamentGender>;
  groupCount?: InputMaybe<Scalars['Int']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  matchType?: InputMaybe<MatchType>;
  maxRegistrations?: InputMaybe<Scalars['Int']['input']>;
  popular?: InputMaybe<Scalars['Boolean']['input']>;
  prizes?: InputMaybe<Array<TournamentPrizeInput>>;
  scoringConfig?: InputMaybe<ScoringConfigInput>;
  seedCount?: InputMaybe<Scalars['Int']['input']>;
  /** Đồng giải ba - không đánh trận tranh hạng 3-4 (SINGLE_ELIMINATION only) */
  sharedThirdPlace?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCommentInput = {
  /** Updated comment content */
  content: Scalars['String']['input'];
};

export type UpdateCourtInput = {
  /** Court capacity */
  capacity?: InputMaybe<Scalars['Int']['input']>;
  /** Court ID */
  courtId: Scalars['ID']['input'];
  /** Court type */
  courtType?: InputMaybe<CourtType>;
  /** Default price per hour */
  defaultPricePerHour?: InputMaybe<Scalars['Int']['input']>;
  /** Court description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Display order */
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Special features */
  features?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Court image URL */
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Is indoor court */
  isIndoor?: InputMaybe<Scalars['Boolean']['input']>;
  /** Maintenance note */
  maintenanceNote?: InputMaybe<Scalars['String']['input']>;
  /** Minimum number of slots required per booking */
  minimumBookingSlots?: InputMaybe<Scalars['Int']['input']>;
  /** Court name/number */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Peak price per hour */
  peakPricePerHour?: InputMaybe<Scalars['Int']['input']>;
  /** Pricing rules */
  pricing?: InputMaybe<Array<CourtPricingInput>>;
  /** Sport type */
  sportType?: InputMaybe<SportType>;
  /** Court status */
  status?: InputMaybe<CourtStatus>;
};

export type UpdateGroupInput = {
  /** Group address/location */
  address?: InputMaybe<Scalars['String']['input']>;
  /** Cover image URL */
  coverImageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Group description/bio */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Group ID to update */
  groupId: Scalars['ID']['input'];
  /** Group name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Privacy level */
  privacy?: InputMaybe<GroupPrivacy>;
};

export type UpdateInquiryStatusInput = {
  /** Internal admin note */
  adminNote?: InputMaybe<Scalars['String']['input']>;
  /** New inquiry status */
  status: InquiryStatus;
};

export type UpdateLegalDocumentInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  effectiveDate?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMarginThresholdsInput = {
  /** Margin % below which shows red danger */
  dangerMargin?: InputMaybe<Scalars['Float']['input']>;
  /** Margin % below which shows yellow warning */
  warningMargin?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateMessageInput = {
  /** Message ID to update */
  messageId: Scalars['ID']['input'];
  /** Updated text content */
  text: Scalars['String']['input'];
};

export type UpdateMessageReportStatusInput = {
  /** Admin notes */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** ID of the report to update */
  reportId: Scalars['ID']['input'];
  /** New status */
  status: ReportStatus;
};

export type UpdateOtpTestPhoneInput = {
  /** Empty = all phone OTP purposes allowed */
  allowedPurposes?: InputMaybe<Array<OtpPurpose>>;
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  testCode?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateParticipantDepositInput = {
  /** Trạng thái đặt cọc mới */
  depositStatus: DepositStatus;
  /** ID kèo */
  gameId: Scalars['ID']['input'];
  /** Ghi chú */
  note?: InputMaybe<Scalars['String']['input']>;
  /** ID người chơi */
  userId: Scalars['ID']['input'];
};

export type UpdateParticipantPaymentInput = {
  /** Số tiền đã trả */
  amountPaid?: InputMaybe<Scalars['Int']['input']>;
  /** ID kèo */
  gameId: Scalars['ID']['input'];
  /** Ghi chú */
  note?: InputMaybe<Scalars['String']['input']>;
  /** Trạng thái thanh toán mới */
  paymentStatus: PaymentStatus;
  /** ID người chơi */
  userId: Scalars['ID']['input'];
};

export type UpdatePaymentStatusInput = {
  paymentAmount?: InputMaybe<Scalars['Float']['input']>;
  paymentStatus: TournamentPaymentStatus;
  registrationId: Scalars['ID']['input'];
};

export type UpdatePickupGameCampaignInput = {
  /** Mô tả campaign */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Ngày kết thúc (ISO string) */
  endDate?: InputMaybe<Scalars['String']['input']>;
  /** Kèo thuộc campaign */
  gameIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Mục tiêu campaign */
  goals?: InputMaybe<CampaignGoalsInput>;
  /** Kích hoạt/tắt */
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** Tên campaign */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Môn thể thao của campaign */
  sportTypes?: InputMaybe<Array<SportType>>;
  /** Ngày bắt đầu (ISO string) */
  startDate?: InputMaybe<Scalars['String']['input']>;
  /** Trình độ mục tiêu */
  targetSkillLevels?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Danh sách sân mục tiêu */
  venueIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type UpdatePickupGameInput = {
  /** Chế độ duyệt */
  approvalMode?: InputMaybe<ApprovalMode>;
  /** Cấu hình chi phí */
  costConfig?: InputMaybe<CostConfigInput>;
  /** Ảnh bìa */
  coverImageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Địa điểm tùy chỉnh */
  customLocation?: InputMaybe<CustomLocationInput>;
  /** Cấu hình đặt cọc */
  depositConfig?: InputMaybe<DepositConfigInput>;
  /** Dụng cụ cần mang */
  equipment?: InputMaybe<Array<EquipmentItemInput>>;
  /** Thể thức thi đấu — multi-select */
  gameFormats?: InputMaybe<Array<Scalars['String']['input']>>;
  /** ID kèo */
  gameId: Scalars['ID']['input'];
  /** Loại hình chơi */
  gameType?: InputMaybe<GameType>;
  /** Cấu hình giới tính */
  genderConfig?: InputMaybe<GenderConfigInput>;
  /** Ảnh khác */
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Host đã đặt sân chưa */
  isVenueBooked?: InputMaybe<Scalars['Boolean']['input']>;
  /** ID booking để liên kết với kèo */
  linkBookingId?: InputMaybe<Scalars['ID']['input']>;
  /** Tỷ lệ tham gia tối thiểu (0-1) */
  minAttendanceRate?: InputMaybe<Scalars['Float']['input']>;
  /** Ghi chú */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Yêu cầu trình độ */
  skillRequirement?: InputMaybe<SkillRequirementInput>;
  /** Cấu hình số người */
  slotConfig?: InputMaybe<SlotConfigInput>;
  /** Môn thể thao */
  sportType?: InputMaybe<SportType>;
  /** Tags */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Thời gian chơi */
  timeSlot?: InputMaybe<GameTimeSlotInput>;
  /** Tiêu đề kèo */
  title?: InputMaybe<Scalars['String']['input']>;
  /** ID sân */
  venueId?: InputMaybe<Scalars['ID']['input']>;
  /** Độ hiển thị */
  visibility?: InputMaybe<GameVisibility>;
};

export type UpdatePostInput = {
  /** Whether comments are allowed */
  allowComments?: InputMaybe<Scalars['Boolean']['input']>;
  /** Post content/body */
  content?: InputMaybe<Scalars['String']['input']>;
  /** Featured/cover image URL */
  coverImageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Whether the post is pinned by author */
  isPinned?: InputMaybe<Scalars['Boolean']['input']>;
  /** Location tagged in post */
  location?: InputMaybe<PostLocationInput>;
  /** Media attachments */
  media?: InputMaybe<Array<PostMediaInput>>;
  /** Scheduled publish time (ISO string) */
  scheduledAt?: InputMaybe<Scalars['String']['input']>;
  /** Status of the post */
  status?: InputMaybe<PostStatus>;
  /** Tags for categorization */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Post title */
  title?: InputMaybe<Scalars['String']['input']>;
  /** Visibility of the post */
  visibility?: InputMaybe<PostVisibility>;
};

export type UpdateProductCategoryInput = {
  /** Category ID */
  categoryId: Scalars['ID']['input'];
  /** Category color (hex code) */
  color?: InputMaybe<Scalars['String']['input']>;
  /** Category description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Display order */
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Category icon */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** Category image URL */
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Is category active */
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** Category name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Parent category ID */
  parentId?: InputMaybe<Scalars['ID']['input']>;
  /** URL-friendly slug */
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductInput = {
  /** Allow backorder */
  allowBackorder?: InputMaybe<Scalars['Boolean']['input']>;
  /** Category ID */
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  /** Compare at price */
  compareAtPrice?: InputMaybe<Scalars['Int']['input']>;
  /** Cost price */
  costPrice?: InputMaybe<Scalars['Int']['input']>;
  /** Full description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Display order */
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Has variants */
  hasVariants?: InputMaybe<Scalars['Boolean']['input']>;
  /** Product images */
  images?: InputMaybe<Array<ProductImageInput>>;
  /** Is featured */
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  /** Is popular */
  isPopular?: InputMaybe<Scalars['Boolean']['input']>;
  /** Low stock threshold */
  lowStockThreshold?: InputMaybe<Scalars['Int']['input']>;
  /** SEO meta description */
  metaDescription?: InputMaybe<Scalars['String']['input']>;
  /** SEO meta title */
  metaTitle?: InputMaybe<Scalars['String']['input']>;
  /** Product name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Selling price */
  price?: InputMaybe<Scalars['Int']['input']>;
  /** Product ID */
  productId: Scalars['ID']['input'];
  /** Product type */
  productType?: InputMaybe<ProductType>;
  /** Short description */
  shortDescription?: InputMaybe<Scalars['String']['input']>;
  /** Product SKU */
  sku?: InputMaybe<Scalars['String']['input']>;
  /** URL-friendly slug */
  slug?: InputMaybe<Scalars['String']['input']>;
  /** Product status */
  status?: InputMaybe<ProductStatus>;
  /** Stock quantity */
  stockQuantity?: InputMaybe<Scalars['Int']['input']>;
  /** Track inventory */
  trackInventory?: InputMaybe<Scalars['Boolean']['input']>;
  /** Unit of measure (lon, chai, thùng…) */
  unit?: InputMaybe<Scalars['String']['input']>;
  /** Variant option names */
  variantOptions?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Product variants */
  variants?: InputMaybe<Array<ProductVariantInput>>;
};

export type UpdateProfileInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  club?: InputMaybe<Scalars['String']['input']>;
  coverPhotoURL?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Gender>;
  location?: InputMaybe<LocationInput>;
  photoURL?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePromotionInput = {
  /** Time ranges when promotion applies (PER_HOUR only); null = all hours */
  applicableTimeRanges?: InputMaybe<Array<TimeRangeInput>>;
  /** Level at which discount is applied (bookings only) */
  applyLevel?: InputMaybe<PromotionApplyLevel>;
  /** Badge color (hex) */
  badgeColor?: InputMaybe<Scalars['String']['input']>;
  /** Badge/Tag text for venue card */
  badgeText?: InputMaybe<Scalars['String']['input']>;
  /** Banner image URL */
  bannerImageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Promotion category */
  category?: InputMaybe<PromotionCategory>;
  /** Promo code (for CODE trigger) */
  code?: InputMaybe<Scalars['String']['input']>;
  /** Specific court IDs (when scope is SPECIFIC_COURTS) */
  courtIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Full description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Display order */
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Promotion end date (ISO string) */
  endDate?: InputMaybe<Scalars['String']['input']>;
  /** Maximum discount amount (for percentage type). Pass null to remove the cap. */
  maxDiscountAmount?: InputMaybe<Scalars['Int']['input']>;
  /** Minimum booking amount required. Pass null to remove the requirement. */
  minBookingAmount?: InputMaybe<Scalars['Int']['input']>;
  /** Promotion name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Per user usage limit */
  perUserLimit?: InputMaybe<Scalars['Int']['input']>;
  /** Priority for application order (higher = applied first) */
  priority?: InputMaybe<Scalars['Int']['input']>;
  /** Specific product category IDs (when scope is PRODUCTS) */
  productCategoryIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Promotion ID to update */
  promotionId: Scalars['ID']['input'];
  /** Where promotion applies */
  scope?: InputMaybe<PromotionScope>;
  /** Short description for display */
  shortDescription?: InputMaybe<Scalars['String']['input']>;
  /** Show as banner */
  showAsBanner?: InputMaybe<Scalars['Boolean']['input']>;
  /** Show on venue card */
  showOnVenueCard?: InputMaybe<Scalars['Boolean']['input']>;
  /** Specific sport types (when scope is SPECIFIC_SPORT) */
  sportTypes?: InputMaybe<Array<SportType>>;
  /** Rules for combining with other promotions */
  stackingRules?: InputMaybe<StackingRulesInput>;
  /** Promotion start date (ISO string) */
  startDate?: InputMaybe<Scalars['String']['input']>;
  /** Total usage limit (null = unlimited) */
  totalUsageLimit?: InputMaybe<Scalars['Int']['input']>;
  /** How promotion is triggered */
  trigger?: InputMaybe<PromotionTrigger>;
  /** Type of discount */
  type?: InputMaybe<PromotionType>;
  /** Discount value (percentage 0-100 or fixed amount) */
  value?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateQrCampaignInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateReferralCodeInput = {
  /** Expiry date for this code */
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Max uses allowed (null = unlimited) */
  maxUses?: InputMaybe<Scalars['Int']['input']>;
  /** Display name of the code owner */
  ownerName?: InputMaybe<Scalars['String']['input']>;
  /** Role of the code owner */
  ownerRole?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateReportStatusInput = {
  /** Admin notes about the resolution */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** ID of the report to update */
  reportId: Scalars['ID']['input'];
  /** New status for the report */
  status: PostReportStatus;
};

export type UpdateTemplateInput = {
  /** Chế độ duyệt */
  approvalMode?: InputMaybe<ApprovalMode>;
  /** Cấu hình chi phí */
  costConfig?: InputMaybe<CostConfigInput>;
  /** Địa điểm tùy chỉnh */
  customLocation?: InputMaybe<CustomLocationInput>;
  /** Cấu hình đặt cọc */
  depositConfig?: InputMaybe<DepositConfigInput>;
  /** Mô tả */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Dụng cụ cần mang */
  equipment?: InputMaybe<Array<EquipmentItemInput>>;
  /** Thể thức thi đấu */
  gameFormats?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Loại hình chơi */
  gameType?: InputMaybe<GameType>;
  /** Cấu hình giới tính */
  genderConfig?: InputMaybe<GenderConfigInput>;
  /** Host cũng tham gia chơi */
  hostPlaying?: InputMaybe<Scalars['Boolean']['input']>;
  /** Tên template */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Yêu cầu trình độ */
  skillRequirement?: InputMaybe<SkillRequirementInput>;
  /** Cấu hình số người */
  slotConfig?: InputMaybe<SlotConfigInput>;
  /** Môn thể thao */
  sportType?: InputMaybe<SportType>;
  /** Tags */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** ID template */
  templateId: Scalars['ID']['input'];
  /** ID sân */
  venueId?: InputMaybe<Scalars['ID']['input']>;
  /** Độ hiển thị */
  visibility?: InputMaybe<GameVisibility>;
};

export type UpdateTournamentInput = {
  contacts?: InputMaybe<Array<TournamentContactInput>>;
  courts?: InputMaybe<Array<TournamentCourtInput>>;
  coverImage?: InputMaybe<Scalars['String']['input']>;
  dates?: InputMaybe<TournamentDatesInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  facilities?: InputMaybe<Array<TournamentFacilityInput>>;
  highlights?: InputMaybe<Array<Scalars['String']['input']>>;
  id: Scalars['ID']['input'];
  introduction?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<TournamentLocationInput>;
  organizerName?: InputMaybe<Scalars['String']['input']>;
  paymentInfo?: InputMaybe<TournamentPaymentInfoInput>;
  prizes?: InputMaybe<Array<TournamentPrizeInput>>;
  rules?: InputMaybe<Array<TournamentRuleInput>>;
  schedule?: InputMaybe<Array<TournamentSchedulePhaseInput>>;
  scheduleConfig?: InputMaybe<ScheduleConfigInput>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTournamentRefereeInput = {
  id: Scalars['ID']['input'];
  maxMatchesPerDay?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  preferredCourts?: InputMaybe<Array<Scalars['String']['input']>>;
  role?: InputMaybe<RefereeRole>;
};

export type UpdateUserReportStatusInput = {
  /** Admin notes about the resolution */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** ID of the report to update */
  reportId: Scalars['ID']['input'];
  /** New status */
  status: UserReportStatus;
};

export type UpdateVenueExpenseInput = {
  amount?: InputMaybe<Scalars['Int']['input']>;
  category?: InputMaybe<ExpenseCategory>;
  coverageFrom?: InputMaybe<Scalars['String']['input']>;
  coverageTo?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  expenseId: Scalars['ID']['input'];
  isRecurring?: InputMaybe<Scalars['Boolean']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  paymentMethod?: InputMaybe<PaymentMethod>;
};

export type UpdateVenueInput = {
  /** Advance booking days */
  advanceBookingDays?: InputMaybe<Scalars['Int']['input']>;
  /** Is booking pass (transfer) enabled */
  allowBookingPass?: InputMaybe<Scalars['Boolean']['input']>;
  /** Is reservation hold enabled */
  allowReservationHold?: InputMaybe<Scalars['Boolean']['input']>;
  /** Amenities */
  amenities?: InputMaybe<Array<VenueAmenityInput>>;
  /** Bank QR code URL for payment */
  bankQrCodeUrl?: InputMaybe<Scalars['String']['input']>;
  /** Policy for booking pass transfers */
  bookingPassPolicy?: InputMaybe<Scalars['String']['input']>;
  /** Cancellation hours */
  cancellationHours?: InputMaybe<Scalars['Int']['input']>;
  /** Cover image URL */
  coverImageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Venue description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Email */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Has order service */
  hasOrderService?: InputMaybe<Scalars['Boolean']['input']>;
  /** Venue images URLs */
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Venue location */
  location?: InputMaybe<VenueLocationInput>;
  /** Min completed bookings to become loyal customer */
  loyaltyMinBookings?: InputMaybe<Scalars['Int']['input']>;
  /** Min total spending (VND) to become loyal customer */
  loyaltyMinSpending?: InputMaybe<Scalars['Int']['input']>;
  /** Profit margin thresholds for inventory management */
  marginThresholds?: InputMaybe<UpdateMarginThresholdsInput>;
  /** Maximum concurrent hold requests per customer (1-10) */
  maxConcurrentHoldsPerCustomer?: InputMaybe<Scalars['Int']['input']>;
  /** Maximum hold duration in minutes (15-180) */
  maxHoldDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
  /** Minimum time before slot to allow hold (minutes) */
  minTimeBeforeSlotForHold?: InputMaybe<Scalars['Int']['input']>;
  /** Venue name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Operating hours */
  operatingHours?: InputMaybe<Array<OperatingHoursInput>>;
  /** Phone number */
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  /** Is recurring booking enabled */
  recurringBookingEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Slot duration in minutes */
  slotDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
  /** Sports available */
  sportTypes?: InputMaybe<Array<SportType>>;
  /** Terms and conditions of the venue */
  termsAndConditions?: InputMaybe<Scalars['String']['input']>;
  /** Venue ID to update */
  venueId: Scalars['ID']['input'];
  /** Website URL */
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVenueOrderTypeConfigsInput = {
  /** Order type configurations */
  orderTypeConfigs: Array<VenueOrderTypeConfigInput>;
  /** Venue ID */
  venueId: Scalars['ID']['input'];
};

export type UploadAvatarInput = {
  /** Base64 encoded image data (with or without data URI prefix) */
  base64Image: Scalars['String']['input'];
};

export type UploadChatMediaInput = {
  /** Base64 encoded media data */
  base64Data: Scalars['String']['input'];
  /** Original filename */
  fileName?: InputMaybe<Scalars['String']['input']>;
  /** Type of media */
  mediaType: ChatMediaType;
};

export type UploadCoverPhotoInput = {
  /** Base64 encoded image data (with or without data URI prefix) */
  base64Image: Scalars['String']['input'];
};

export type UploadGroupChatImageInput = {
  /** Base64 encoded image data */
  base64Image: Scalars['String']['input'];
  /** Group ID to upload image for */
  groupId: Scalars['ID']['input'];
};

export type UploadGroupCoverInput = {
  base64Image: Scalars['String']['input'];
  /** Group ID (required when updating existing group cover) */
  groupId?: InputMaybe<Scalars['String']['input']>;
};

/** Logical category of an uploaded asset; controls storage path & validation rules. */
export enum UploadKind {
  Avatar = 'AVATAR',
  ChatFile = 'CHAT_FILE',
  ChatImage = 'CHAT_IMAGE',
  ChatVideo = 'CHAT_VIDEO',
  CoverPhoto = 'COVER_PHOTO',
  GroupChatImage = 'GROUP_CHAT_IMAGE',
  GroupCover = 'GROUP_COVER',
  PaymentProof = 'PAYMENT_PROOF',
  PostMedia = 'POST_MEDIA',
  ProductImage = 'PRODUCT_IMAGE',
  TournamentImage = 'TOURNAMENT_IMAGE',
  VenueImage = 'VENUE_IMAGE',
  VenueRequestImage = 'VENUE_REQUEST_IMAGE'
}

export type UploadPaymentProofInput = {
  /** Base64 encoded image data */
  base64Image: Scalars['String']['input'];
  /** Order ID */
  orderId: Scalars['ID']['input'];
};

export type UploadPostMediaInput = {
  /** Base64 encoded image data (with or without data URI prefix) */
  base64Image: Scalars['String']['input'];
};

export type UploadPostMediaResponse = {
  __typename?: 'UploadPostMediaResponse';
  /** BlurHash placeholder for instant image preview on the client. */
  blurhash?: Maybe<Scalars['String']['output']>;
  /** Height in pixels */
  height?: Maybe<Scalars['Float']['output']>;
  /** File key in storage */
  key: Scalars['String']['output'];
  /** MIME type of the uploaded file */
  mimeType?: Maybe<Scalars['String']['output']>;
  /** File size in bytes */
  size?: Maybe<Scalars['Float']['output']>;
  /** Public URL of the uploaded file */
  url: Scalars['String']['output'];
  /** Width in pixels */
  width?: Maybe<Scalars['Float']['output']>;
};

export type UploadProcessedImageInput = {
  /** Base64-encoded image (with or without data: URI prefix). */
  base64Image: Scalars['String']['input'];
  /** Logical asset kind (avatar, group-cover, venue-image, …). */
  kind: UploadKind;
  /** Owner id used to namespace the storage path (userId / venueId / groupId). */
  ownerId?: InputMaybe<Scalars['String']['input']>;
  /** Skip 800px medium variant generation. */
  skipMedium?: InputMaybe<Scalars['Boolean']['input']>;
  /** Skip 200px thumbnail generation if the consumer does not need it. */
  skipThumbnail?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UploadProductImageInput = {
  /** Base64 encoded image data */
  base64Image: Scalars['String']['input'];
  /** Shop ID (for shop products) */
  shopId?: InputMaybe<Scalars['ID']['input']>;
  /** Venue ID (for venue products) */
  venueId?: InputMaybe<Scalars['ID']['input']>;
};

export type UploadResponse = {
  __typename?: 'UploadResponse';
  /** File key in storage */
  key: Scalars['String']['output'];
  /** Public URL of the uploaded file */
  url: Scalars['String']['output'];
  /** Updated user object */
  user: User;
};

export type UploadTournamentImageInput = {
  /** Base64 encoded image data */
  base64Image: Scalars['String']['input'];
  /** Tournament ID (used for storage path organisation) */
  tournamentId?: InputMaybe<Scalars['ID']['input']>;
};

export type UploadVenueImageInput = {
  /** Base64 encoded image data */
  base64Image: Scalars['String']['input'];
  /** Venue ID */
  venueId: Scalars['ID']['input'];
};

export type UploadVenueRequestImageInput = {
  /** Base64 encoded image data (with or without data URI prefix) */
  base64Image: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  /** How the account was created */
  accountOrigin?: Maybe<AccountOrigin>;
  /** How the user discovered the platform (collected via onboarding survey) */
  acquisitionSource?: Maybe<AcquisitionSource>;
  /** Avatar with placeholder + responsive variants. */
  avatar?: Maybe<ImageMedia>;
  bio?: Maybe<Scalars['String']['output']>;
  club?: Maybe<Scalars['String']['output']>;
  coverPhotoURL?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Admin who created this account (if admin-created) */
  createdBy?: Maybe<Scalars['ID']['output']>;
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  displayName: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  emailVerificationDate?: Maybe<Scalars['DateTime']['output']>;
  emailVerified: Scalars['Boolean']['output'];
  fcmTokens: Array<Scalars['String']['output']>;
  followerCount: Scalars['Float']['output'];
  followingCount: Scalars['Float']['output'];
  fullName: Scalars['String']['output'];
  gender?: Maybe<Gender>;
  /** Whether user can access portal owner workspace (active venue staff or owned venues) */
  hasVenuePortalAccess: Scalars['Boolean']['output'];
  isActive: Scalars['Boolean']['output'];
  isOwner: Scalars['Boolean']['output'];
  /** Is user suspended */
  isSuspended: Scalars['Boolean']['output'];
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  location?: Maybe<Location>;
  /** Average rating (1-5) from receivers across completed pass transfers */
  passRatingAvg?: Maybe<Scalars['Float']['output']>;
  /** Total number of ratings received for completed transfers */
  passRatingCount?: Maybe<Scalars['Float']['output']>;
  passwordSetAt?: Maybe<Scalars['DateTime']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  phoneVerificationDate?: Maybe<Scalars['DateTime']['output']>;
  phoneVerified: Scalars['Boolean']['output'];
  /** Plain avatar URL. Kept for backward compat with mobile builds < 1.7. Prefer `avatar.url` (with blurhash placeholder). */
  photoURL?: Maybe<Scalars['String']['output']>;
  /** Active portal capability grants (resolved at query time) */
  portalCapabilities: Array<PortalCapability>;
  /** Personal referral code (unique per user) */
  referralCode?: Maybe<Scalars['String']['output']>;
  /** User ID of the person who referred this user */
  referredBy?: Maybe<Scalars['ID']['output']>;
  role: UserRole;
  /** Suspended at date */
  suspendedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Suspended by admin ID */
  suspendedBy?: Maybe<Scalars['ID']['output']>;
  /** Suspension reason */
  suspensionReason?: Maybe<Scalars['String']['output']>;
  totalActivities: Scalars['Float']['output'];
  uid?: Maybe<Scalars['ID']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userName: Scalars['String']['output'];
};

export type UserBlock = {
  __typename?: 'UserBlock';
  _id: Scalars['ID']['output'];
  /** Blocked user details (resolved field) */
  blockedUser?: Maybe<User>;
  /** User who was blocked */
  blockedUserId: Scalars['ID']['output'];
  /** User who blocked */
  blockerId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Reason for blocking */
  reason?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

/** A Relay-style connection for User items. */
export type UserConnection = {
  __typename?: 'UserConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<UserEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

export type UserContactLookup = {
  __typename?: 'UserContactLookup';
  _id: Scalars['ID']['output'];
  displayName: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  fullName: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  photoURL?: Maybe<Scalars['String']['output']>;
};

/** An edge in the UserConnection. */
export type UserEdge = {
  __typename?: 'UserEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: User;
};

export type UserReport = {
  __typename?: 'UserReport';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Additional details about the report */
  description?: Maybe<Scalars['String']['output']>;
  /** Admin notes or resolution details */
  notes?: Maybe<Scalars['String']['output']>;
  /** Reason for reporting */
  reason: UserReportReason;
  /** User who was reported (resolved field) */
  reportedUser?: Maybe<User>;
  /** User that was reported */
  reportedUserId: Scalars['ID']['output'];
  /** User who filed the report (resolved field) */
  reporter?: Maybe<User>;
  /** User who reported */
  reporterId: Scalars['ID']['output'];
  /** When the report was reviewed */
  reviewedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Admin who reviewed */
  reviewedBy?: Maybe<Scalars['ID']['output']>;
  /** Admin who reviewed (resolved field) */
  reviewer?: Maybe<User>;
  /** Status of the report */
  status: UserReportStatus;
  updatedAt: Scalars['DateTime']['output'];
};

/** A Relay-style connection for UserReport items. */
export type UserReportConnection = {
  __typename?: 'UserReportConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<UserReportEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the UserReportConnection. */
export type UserReportEdge = {
  __typename?: 'UserReportEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: UserReport;
};

export type UserReportFilterInput = {
  /** Filter by report reason */
  reason?: InputMaybe<UserReportReason>;
  /** Filter by report status */
  status?: InputMaybe<UserReportStatus>;
};

/** Reason for reporting a user */
export enum UserReportReason {
  Harassment = 'HARASSMENT',
  HateSpeech = 'HATE_SPEECH',
  Impersonation = 'IMPERSONATION',
  InappropriateContent = 'INAPPROPRIATE_CONTENT',
  Other = 'OTHER',
  Spam = 'SPAM'
}

export type UserReportStats = {
  __typename?: 'UserReportStats';
  /** Total dismissed reports */
  dismissedReports: Scalars['Int']['output'];
  /** Total pending reports */
  pendingReports: Scalars['Int']['output'];
  /** Total resolved reports */
  resolvedReports: Scalars['Int']['output'];
  /** Total reviewed reports */
  reviewedReports: Scalars['Int']['output'];
  /** Total reports */
  totalReports: Scalars['Int']['output'];
};

/** Status of user report */
export enum UserReportStatus {
  Dismissed = 'DISMISSED',
  Pending = 'PENDING',
  Resolved = 'RESOLVED',
  Reviewed = 'REVIEWED'
}

export enum UserRole {
  Admin = 'ADMIN',
  FacilityOwner = 'FACILITY_OWNER',
  Player = 'PLAYER',
  SuperAdmin = 'SUPER_ADMIN'
}

export type ValidateOrderPromoCodeInput = {
  /** Promo code to validate */
  code: Scalars['String']['input'];
  /** Product category IDs in the order */
  productCategoryIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Order subtotal for discount calculation */
  subtotal: Scalars['Int']['input'];
  /** User ID (for usage check) */
  userId?: InputMaybe<Scalars['ID']['input']>;
  /** Venue ID */
  venueId: Scalars['ID']['input'];
};

export type ValidatePromoCodeInput = {
  /** Booking date YYYY-MM-DD (for context validation) */
  bookingDate?: InputMaybe<Scalars['String']['input']>;
  /** Promo code to validate */
  code: Scalars['String']['input'];
  /** Court IDs being booked (for scope validation) */
  courtIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Effective session count after staff exclude dates (for RECURRING promo validation) */
  effectiveSessionCount?: InputMaybe<Scalars['Int']['input']>;
  /** Is first booking at this venue */
  isFirstBooking?: InputMaybe<Scalars['Boolean']['input']>;
  /** Is this a recurring booking */
  isRecurring?: InputMaybe<Scalars['Boolean']['input']>;
  /** Slot duration in minutes (for PER_HOUR calculation) */
  slotDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
  /** Per-slot price info for accurate PER_HOUR discount estimation */
  slots?: InputMaybe<Array<SlotPriceInfoInput>>;
  /** Total booking amount for discount estimation */
  totalAmount?: InputMaybe<Scalars['Int']['input']>;
  /** User ID (for usage check) */
  userId?: InputMaybe<Scalars['ID']['input']>;
  /** Venue ID */
  venueId: Scalars['ID']['input'];
};

export type VariantOption = {
  __typename?: 'VariantOption';
  /** Option name (e.g., "Size") */
  name: Scalars['String']['output'];
  /** Option value (e.g., "L") */
  value: Scalars['String']['output'];
};

export type VariantOptionInput = {
  /** Option name (e.g., "Size") */
  name: Scalars['String']['input'];
  /** Option value (e.g., "L") */
  value: Scalars['String']['input'];
};

export type Venue = {
  __typename?: 'Venue';
  _id: Scalars['ID']['output'];
  /** Advance booking days limit */
  advanceBookingDays: Scalars['Int']['output'];
  /** Is booking pass (transfer) enabled for this venue */
  allowBookingPass: Scalars['Boolean']['output'];
  /** Is reservation hold enabled for this venue */
  allowReservationHold: Scalars['Boolean']['output'];
  /** Available amenities */
  amenities?: Maybe<Array<VenueAmenity>>;
  /** Average rating */
  averageRating: Scalars['Float']['output'];
  /** Bank QR code URL for payment */
  bankQrCodeUrl?: Maybe<Scalars['String']['output']>;
  /** Policy for booking pass transfers */
  bookingPassPolicy?: Maybe<Scalars['String']['output']>;
  /** Whether booking is available (only for VERIFIED venues with ACTIVE status) */
  canBook: Scalars['Boolean']['output'];
  /** Cancellation hours before booking */
  cancellationHours: Scalars['Int']['output'];
  /** Venue categories (includes system categories, cursor) */
  categoriesConnection: ProductCategoryConnection;
  /** When venue was claimed */
  claimedAt?: Maybe<Scalars['DateTime']['output']>;
  /** User who claimed this venue */
  claimedById?: Maybe<Scalars['ID']['output']>;
  /** Community group ID for this venue */
  communityGroupId?: Maybe<Scalars['ID']['output']>;
  /** Number of courts */
  courtCount: Scalars['Int']['output'];
  /** Cover image with placeholder + responsive variants. */
  coverImage?: Maybe<ImageMedia>;
  /**
   * Cover image URL
   * @deprecated Use `coverImage.url`. Kept for backward compat with mobile builds < 1.7.
   */
  coverImageUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Venue description */
  description?: Maybe<Scalars['String']['output']>;
  /** Distance from user in kilometers (only in nearby queries) */
  distanceKm?: Maybe<Scalars['Float']['output']>;
  /** Email */
  email?: Maybe<Scalars['String']['output']>;
  /** Only enabled order types for display */
  enabledOrderTypes: Array<VenueOrderTypeConfig>;
  /** External ID from source system */
  externalId?: Maybe<Scalars['String']['output']>;
  /** External source if imported */
  externalSource?: Maybe<VenueExternalSource>;
  /** Has food/beverage service */
  hasOrderService: Scalars['Boolean']['output'];
  /** Venue gallery with placeholder + responsive variants. */
  imageMedia?: Maybe<Array<ImageMedia>>;
  /**
   * Venue images URLs
   * @deprecated Use `imageMedia[].url`. Kept for mobile builds < 1.7.
   */
  images?: Maybe<Array<Scalars['String']['output']>>;
  /** Is venue favorited by current user */
  isFavorite: Scalars['Boolean']['output'];
  /** Is featured venue */
  isFeatured: Scalars['Boolean']['output'];
  isOpen: Scalars['Boolean']['output'];
  isOwner: Scalars['Boolean']['output'];
  isStaff: Scalars['Boolean']['output'];
  /** Venue location */
  location: VenueLocation;
  /** Min completed bookings to become loyal customer */
  loyaltyMinBookings?: Maybe<Scalars['Int']['output']>;
  /** Min total spending (VND) to become loyal customer */
  loyaltyMinSpending?: Maybe<Scalars['Int']['output']>;
  /** Profit margin thresholds for inventory management */
  marginThresholds?: Maybe<VenueMarginThresholds>;
  /** Maximum number of concurrent hold requests per customer (default: 1) */
  maxConcurrentHoldsPerCustomer?: Maybe<Scalars['Int']['output']>;
  /** Maximum hold duration in minutes (default: 120) */
  maxHoldDurationMinutes?: Maybe<Scalars['Int']['output']>;
  /** Minimum time before slot to allow hold (minutes, default: 60) */
  minTimeBeforeSlotForHold?: Maybe<Scalars['Int']['output']>;
  /** Current user permissions for this venue */
  myPermissions?: Maybe<Array<VenueAction>>;
  /** Venue name */
  name: Scalars['String']['output'];
  /** Weekly operating hours */
  operatingHours: Array<OperatingHours>;
  /** Order type configurations for this venue */
  orderTypeConfigs?: Maybe<Array<VenueOrderTypeConfig>>;
  /** Owner user */
  owner?: Maybe<User>;
  /** Owner user ID (null for unclaimed venues) */
  ownerId?: Maybe<Scalars['ID']['output']>;
  /** Phone number */
  phoneNumber?: Maybe<Scalars['String']['output']>;
  /** Price range */
  priceRange?: Maybe<PriceRange>;
  /** Venue products (active only, cursor) */
  productsConnection: ProductConnection;
  /** Promotion information for venue display */
  promotionInfo?: Maybe<VenuePromotionInfo>;
  /** Is recurring booking enabled for this venue */
  recurringBookingEnabled: Scalars['Boolean']['output'];
  /** Rejection reason if rejected */
  rejectionReason?: Maybe<Scalars['String']['output']>;
  /** Slot duration in minutes */
  slotDurationMinutes: Scalars['Int']['output'];
  /** Sports available at this venue */
  sportTypes: Array<SportType>;
  /** Venue status */
  status: VenueStatus;
  /** User ID who submitted this venue via Pass sân flow (USER_SUBMITTED). Used to throttle abuse and trace authorship. */
  submittedById?: Maybe<Scalars['ID']['output']>;
  /** Terms and conditions of the venue */
  termsAndConditions?: Maybe<Scalars['String']['output']>;
  /** Total bookings */
  totalBookings: Scalars['Int']['output'];
  /** Total reviews */
  totalReviews: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  /** Venue type based on verification */
  venueType: VenueType;
  /** View count */
  viewCount?: Maybe<Scalars['Int']['output']>;
  /** Website URL */
  website?: Maybe<Scalars['String']['output']>;
};


export type VenueCategoriesConnectionArgs = {
  pagination?: InputMaybe<CursorPageInput>;
};


export type VenueProductsConnectionArgs = {
  filter?: InputMaybe<ProductFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
};

/** Venue-specific actions */
export enum VenueAction {
  ApproveBooking = 'APPROVE_BOOKING',
  CancelOrder = 'CANCEL_ORDER',
  CreateBooking = 'CREATE_BOOKING',
  CreateOrder = 'CREATE_ORDER',
  Edit = 'EDIT',
  ManageExpenses = 'MANAGE_EXPENSES',
  ManageProducts = 'MANAGE_PRODUCTS',
  ManagePromotions = 'MANAGE_PROMOTIONS',
  OverridePrice = 'OVERRIDE_PRICE',
  View = 'VIEW',
  ViewAnalytics = 'VIEW_ANALYTICS',
  ViewBookings = 'VIEW_BOOKINGS',
  ViewOrders = 'VIEW_ORDERS',
  ViewSensitiveData = 'VIEW_SENSITIVE_DATA'
}

export type VenueAmenity = {
  __typename?: 'VenueAmenity';
  /** Amenity icon */
  icon?: Maybe<Scalars['String']['output']>;
  /** Is available */
  isAvailable: Scalars['Boolean']['output'];
  /** Amenity name */
  name: Scalars['String']['output'];
};

export type VenueAmenityInput = {
  /** Amenity icon */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** Is available */
  isAvailable: Scalars['Boolean']['input'];
  /** Amenity name */
  name: Scalars['String']['input'];
};

export type VenueAnalytics = {
  __typename?: 'VenueAnalytics';
  /** Booking distribution by court type */
  bookingDistribution: Array<BookingDistribution>;
  /** Customer metrics */
  customerMetrics: Array<CustomerMetric>;
  /** Booking heatmap data */
  heatMapData: Array<HeatMapCell>;
  /** Analytics period (week, month, quarter, year) */
  period: Scalars['String']['output'];
  /** Revenue by day/period */
  revenueByPeriod: Array<RevenueDataPoint>;
  /** Revenue trend over months */
  revenueTrend: Array<RevenueDataPoint>;
  /** Service performance */
  servicePerformance: Array<ServicePerformance>;
  /** Summary statistics */
  summary: AnalyticsSummary;
  /** Venue ID */
  venueId: Scalars['String']['output'];
  /** Venue name */
  venueName: Scalars['String']['output'];
};

export type VenueAnalyticsPreview = {
  __typename?: 'VenueAnalyticsPreview';
  venueAnalytics: VenueAnalytics;
};

export type VenueAvailability = {
  __typename?: 'VenueAvailability';
  /** Court availabilities */
  courts: Array<CourtAvailability>;
  /** Date (YYYY-MM-DD) */
  date: Scalars['String']['output'];
};

export type VenueClaimRequest = {
  __typename?: 'VenueClaimRequest';
  _id: Scalars['ID']['output'];
  /** Admin notes (internal) */
  adminNotes?: Maybe<Scalars['String']['output']>;
  /** When the claim was submitted */
  createdAt: Scalars['DateTime']['output'];
  /** Contact email */
  email?: Maybe<Scalars['String']['output']>;
  /** Notes or additional information */
  notes?: Maybe<Scalars['String']['output']>;
  /** Contact phone number */
  phoneNumber: Scalars['String']['output'];
  /** Proof document URLs */
  proofDocuments?: Maybe<Array<Scalars['String']['output']>>;
  /** Reason for rejection (if rejected) */
  rejectionReason?: Maybe<Scalars['String']['output']>;
  /** When the claim was reviewed */
  reviewedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Admin who reviewed this claim */
  reviewedById?: Maybe<Scalars['ID']['output']>;
  /** Admin who reviewed */
  reviewer?: Maybe<User>;
  /** Current status of the claim */
  status: ClaimRequestStatus;
  /** When the claim was last updated */
  updatedAt: Scalars['DateTime']['output'];
  /** User who made the claim */
  user?: Maybe<User>;
  /** ID of the user making the claim */
  userId: Scalars['ID']['output'];
  /** Venue being claimed */
  venue?: Maybe<Venue>;
  /** Venue address at time of claim */
  venueAddress?: Maybe<Scalars['String']['output']>;
  /** ID of the venue being claimed */
  venueId: Scalars['ID']['output'];
  /** Venue name at time of claim */
  venueName: Scalars['String']['output'];
};

/** A Relay-style connection for VenueClaimRequest items. */
export type VenueClaimRequestConnection = {
  __typename?: 'VenueClaimRequestConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<VenueClaimRequestEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the VenueClaimRequestConnection. */
export type VenueClaimRequestEdge = {
  __typename?: 'VenueClaimRequestEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: VenueClaimRequest;
};

/** A Relay-style connection for Venue items. */
export type VenueConnection = {
  __typename?: 'VenueConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<VenueEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

export type VenueDashboardSummary = {
  __typename?: 'VenueDashboardSummary';
  /** Analytics preview when staff has VIEW_ANALYTICS */
  analyticsPreview?: Maybe<VenueAnalyticsPreview>;
  /** Counts when staff has VIEW_BOOKINGS and/or VIEW_ORDERS */
  operational?: Maybe<VenueOperationalStats>;
  /** Revenue when staff has VIEW_SENSITIVE_DATA */
  sensitive?: Maybe<VenueSensitiveStats>;
  /** Venue with myPermissions */
  venue: Venue;
};

/** An edge in the VenueConnection. */
export type VenueEdge = {
  __typename?: 'VenueEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Venue;
};

export type VenueExpense = {
  __typename?: 'VenueExpense';
  _id: Scalars['ID']['output'];
  /** Accrual amount allocated to the list filter period */
  allocatedAmountInPeriod?: Maybe<Scalars['Int']['output']>;
  amount: Scalars['Int']['output'];
  category: ExpenseCategory;
  /** Coverage start (YYYY-MM-DD) */
  coverageFrom: Scalars['String']['output'];
  /** Coverage end (YYYY-MM-DD) */
  coverageTo: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['ID']['output'];
  /** Payment date (YYYY-MM-DD) */
  date: Scalars['String']['output'];
  isRecurring: Scalars['Boolean']['output'];
  note?: Maybe<Scalars['String']['output']>;
  paymentMethod?: Maybe<PaymentMethod>;
  updatedAt: Scalars['DateTime']['output'];
  venueId: Scalars['ID']['output'];
};

export type VenueExpenseConnection = {
  __typename?: 'VenueExpenseConnection';
  edges: Array<VenueExpenseEdge>;
  pageInfo: VenueExpensePageInfo;
  totalCount: Scalars['Float']['output'];
};

export type VenueExpenseEdge = {
  __typename?: 'VenueExpenseEdge';
  cursor: Scalars['String']['output'];
  node: VenueExpense;
};

export type VenueExpensePageInfo = {
  __typename?: 'VenueExpensePageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

/** External source of imported venue data */
export enum VenueExternalSource {
  Google = 'GOOGLE',
  Manual = 'MANUAL',
  Osm = 'OSM',
  UserSubmitted = 'USER_SUBMITTED'
}

export type VenueFilterInput = {
  /** Filter only bookable venues (VERIFIED + ACTIVE) */
  bookableOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by city */
  city?: InputMaybe<Scalars['String']['input']>;
  /** Filter by district */
  district?: InputMaybe<Scalars['String']['input']>;
  /** Filter by external source */
  externalSource?: InputMaybe<VenueExternalSource>;
  /** Filter only favorite venues (requires authentication) */
  favoritesOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter featured only */
  featuredOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter venues with available slots in the next 2 hours */
  hasAvailableSlotsNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** Has order service */
  hasOrderService?: InputMaybe<Scalars['Boolean']['input']>;
  /** User latitude for distance */
  latitude?: InputMaybe<Scalars['Float']['input']>;
  /** User longitude for distance */
  longitude?: InputMaybe<Scalars['Float']['input']>;
  /** Max distance in km (requires lat/long) */
  maxDistanceKm?: InputMaybe<Scalars['Float']['input']>;
  /** Minimum rating */
  minRating?: InputMaybe<Scalars['Float']['input']>;
  /** Get only my venues (as owner) */
  myVenues?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter open now */
  openNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** Search query for name/description */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  /** Filter by sport types */
  sportTypes?: InputMaybe<Array<SportType>>;
  /** Get venues I staff at */
  staffedVenues?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by status */
  status?: InputMaybe<VenueStatus>;
  /** Filter by venue type (verified, claimed, unclaimed) */
  venueType?: InputMaybe<VenueType>;
  /** Filter by multiple venue types */
  venueTypes?: InputMaybe<Array<VenueType>>;
};

export type VenueFinanceExportResult = {
  __typename?: 'VenueFinanceExportResult';
  /** CSV content (UTF-8) */
  content: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  mimeType: Scalars['String']['output'];
  /** Approximate size in bytes */
  sizeBytes: Scalars['Float']['output'];
};

export type VenueFinancePortfolio = {
  __typename?: 'VenueFinancePortfolio';
  totalVenues: Scalars['Int']['output'];
  venues: Array<VenueFinancePortfolioItem>;
};

export type VenueFinancePortfolioItem = {
  __typename?: 'VenueFinancePortfolioItem';
  completedOrders: Scalars['Int']['output'];
  grossProfit: FinancePnlMetric;
  grossRevenue: FinancePnlMetric;
  netMarginPercent: FinancePnlRateMetric;
  netProfit: FinancePnlMetric;
  netRevenue: FinancePnlMetric;
  venueId: Scalars['ID']['output'];
  venueName: Scalars['String']['output'];
};

export type VenueFinanceReport = {
  __typename?: 'VenueFinanceReport';
  averageOrderValue: Scalars['Int']['output'];
  byCourt: Array<FinanceBreakdownItem>;
  byOrderType: Array<FinanceBreakdownItem>;
  byPaymentMethod: Array<FinanceBreakdownItem>;
  /** Item-level revenue streams (court / product / other) */
  byRevenueStream: Array<FinanceBreakdownItem>;
  byStatus: Array<FinanceBreakdownItem>;
  completedOrders: Scalars['Int']['output'];
  completionRate: Scalars['Float']['output'];
  expenseByCategory: Array<FinanceBreakdownItem>;
  /** Expected revenue from pending bookings (no order yet) */
  pendingBookingRevenue: Scalars['Int']['output'];
  period: FinancePeriodInfo;
  /** Total order value of pipeline orders created in the period */
  pipelineGrossValue: Scalars['Int']['output'];
  /** Orders still in pipeline (not completed) created in the selected period */
  pipelineOrders: Scalars['Int']['output'];
  pnl: FinancePnlSummary;
  totalOrders: Scalars['Int']['output'];
  trend: Array<FinanceTrendPoint>;
};

export type VenueLocation = {
  __typename?: 'VenueLocation';
  /** Full address */
  address: Scalars['String']['output'];
  /** City/Province */
  city?: Maybe<Scalars['String']['output']>;
  /** District */
  district?: Maybe<Scalars['String']['output']>;
  /** Latitude */
  latitude?: Maybe<Scalars['Float']['output']>;
  /** Longitude */
  longitude?: Maybe<Scalars['Float']['output']>;
  /** Ward/District */
  ward?: Maybe<Scalars['String']['output']>;
};

export type VenueLocationInput = {
  /** Full address */
  address: Scalars['String']['input'];
  /** City/Province */
  city?: InputMaybe<Scalars['String']['input']>;
  /** District */
  district?: InputMaybe<Scalars['String']['input']>;
  /** Latitude */
  latitude?: InputMaybe<Scalars['Float']['input']>;
  /** Longitude */
  longitude?: InputMaybe<Scalars['Float']['input']>;
  /** Ward */
  ward?: InputMaybe<Scalars['String']['input']>;
};

export type VenueMarginThresholds = {
  __typename?: 'VenueMarginThresholds';
  /** Margin % below which shows red danger (default 10) */
  dangerMargin: Scalars['Float']['output'];
  /** Margin % below which shows yellow warning (default 20) */
  warningMargin: Scalars['Float']['output'];
};

export type VenueOperationalStats = {
  __typename?: 'VenueOperationalStats';
  bookingStats: BookingStats;
  orderStats: OrderStats;
};

export type VenueOperationsReport = {
  __typename?: 'VenueOperationsReport';
  /** Breakdown by venue promotion in the selected period */
  byPromotion: Array<FinanceBreakdownItem>;
  /** Breakdown by BookingScheduleType (fixed / single) */
  byScheduleType: Array<FinanceBreakdownItem>;
  /** Court revenue by schedule date (confirmed/completed bookings) */
  courtRevenue: Scalars['Int']['output'];
  /** Booking heatmap by day/hour */
  heatMapData: Array<HeatMapCell>;
  occupancy: OperationsOccupancySummary;
  period: FinancePeriodInfo;
  /** Daily/weekly/monthly court revenue and occupancy by schedule date (booking.date) */
  scheduleCoverageTrend: Array<ScheduleCoveragePoint>;
  totalBookings: Scalars['Int']['output'];
};

export type VenueOrderTypeConfig = {
  __typename?: 'VenueOrderTypeConfig';
  /** Custom color (hex) */
  color?: Maybe<Scalars['String']['output']>;
  /** Display order (lower = first) */
  displayOrder: Scalars['Int']['output'];
  /** Custom icon name */
  icon?: Maybe<Scalars['String']['output']>;
  /** Is this order type enabled */
  isEnabled: Scalars['Boolean']['output'];
  /** Custom label for this order type */
  label?: Maybe<Scalars['String']['output']>;
  /** Order type enum value */
  orderType: OrderType;
};

export type VenueOrderTypeConfigInput = {
  /** Custom color (hex) */
  color?: InputMaybe<Scalars['String']['input']>;
  /** Display order (lower = first) */
  displayOrder: Scalars['Int']['input'];
  /** Custom icon name */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** Is this order type enabled */
  isEnabled: Scalars['Boolean']['input'];
  /** Custom label for this order type */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Order type enum value */
  orderType: OrderType;
};

export type VenueProductReport = {
  __typename?: 'VenueProductReport';
  comparePeriod?: Maybe<ProductReportPeriodInfo>;
  decliningProducts: Array<ProductPerformance>;
  hourlySales: Array<ProductHourlySales>;
  inventory: InventoryReport;
  inventoryStatus: InventoryStatus;
  period: ProductReportPeriodInfo;
  productsTable: ProductReportRowConnection;
  profitByProduct: Array<ProductProfitItem>;
  salesByCategory: Array<CategorySalesPerformance>;
  salesTrend: Array<ProductSalesDataPoint>;
  scope: ProductReportScope;
  stockAlerts: Array<StockAlertProduct>;
  summary: ProductReportSummary;
  topProducts: Array<ProductPerformance>;
  trend: Array<ProductSalesDataPoint>;
};

/** Compact promotion info for venue cards */
export type VenuePromotionBadge = {
  __typename?: 'VenuePromotionBadge';
  /** Badge background color (hex) */
  color: Scalars['String']['output'];
  /** Badge icon name */
  icon?: Maybe<Scalars['String']['output']>;
  /** Badge text (e.g., "Giảm 20%", "Flash Sale") */
  text: Scalars['String']['output'];
};

/** Promotion summary for venue display */
export type VenuePromotionInfo = {
  __typename?: 'VenuePromotionInfo';
  /** Number of active promotions */
  activePromotionCount: Scalars['Int']['output'];
  /** All promotion badges for venue */
  badges?: Maybe<Array<VenuePromotionBadge>>;
  /** Best discount amount (VND) */
  bestDiscountAmount?: Maybe<Scalars['Int']['output']>;
  /** Best discount percentage */
  bestDiscountPercent?: Maybe<Scalars['Int']['output']>;
  /** Featured badge to show on venue card */
  featuredBadge?: Maybe<VenuePromotionBadge>;
  /** Whether venue has any active promotions */
  hasActivePromotions: Scalars['Boolean']['output'];
  /** Short promotion text for display */
  promotionText?: Maybe<Scalars['String']['output']>;
};

export type VenuePromotionSummary = {
  __typename?: 'VenuePromotionSummary';
  /** Active promotion count */
  activePromotionCount: Scalars['Int']['output'];
  /** Best discount amount available */
  bestDiscountAmount?: Maybe<Scalars['Int']['output']>;
  /** Best discount percentage available */
  bestDiscountPercent?: Maybe<Scalars['Int']['output']>;
  /** Featured promotion badge color */
  featuredBadgeColor?: Maybe<Scalars['String']['output']>;
  /** Featured promotion badge text */
  featuredBadgeText?: Maybe<Scalars['String']['output']>;
  /** Featured promotions for banner display */
  featuredPromotions?: Maybe<Array<Promotion>>;
  /** Has active promotions */
  hasActivePromotions: Scalars['Boolean']['output'];
  /** Venue ID */
  venueId: Scalars['ID']['output'];
};

export type VenueRequest = {
  __typename?: 'VenueRequest';
  _id: Scalars['ID']['output'];
  /** Admin note */
  adminNote?: Maybe<Scalars['String']['output']>;
  /** Allow booking pass (transfer booking to others) */
  allowBookingPass?: Maybe<Scalars['Boolean']['output']>;
  /** Allow reservation hold (temporary booking before confirmation) */
  allowReservationHold?: Maybe<Scalars['Boolean']['output']>;
  /** Amenities */
  amenities?: Maybe<Array<RequestAmenity>>;
  /** Bank QR code URL for payment */
  bankQrCodeUrl?: Maybe<Scalars['String']['output']>;
  /** Booking pass policy */
  bookingPassPolicy?: Maybe<Scalars['String']['output']>;
  /** Courts information */
  courts: Array<RequestCourtInfo>;
  /** Cover image URL */
  coverImageUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Created venue */
  createdVenue?: Maybe<Venue>;
  /** Created venue ID (if approved) */
  createdVenueId?: Maybe<Scalars['ID']['output']>;
  /** Venue description */
  description?: Maybe<Scalars['String']['output']>;
  /** Email */
  email?: Maybe<Scalars['String']['output']>;
  /** Venue images URLs */
  images?: Maybe<Array<Scalars['String']['output']>>;
  /** Venue location */
  location: RequestLocation;
  /** Minimum time before slot start time to allow hold (in minutes) */
  minTimeBeforeSlotForHold?: Maybe<Scalars['Int']['output']>;
  /** Venue name */
  name: Scalars['String']['output'];
  /** Operating hours */
  operatingHours: Array<RequestOperatingHours>;
  /** Phone number */
  phoneNumber?: Maybe<Scalars['String']['output']>;
  /** Is recurring booking enabled */
  recurringBookingEnabled?: Maybe<Scalars['Boolean']['output']>;
  /** Rejection reason */
  rejectionReason?: Maybe<Scalars['String']['output']>;
  /** Requester user */
  requester?: Maybe<User>;
  /** Requester user ID */
  requesterId: Scalars['ID']['output'];
  /** Reviewed at */
  reviewedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Reviewed by admin ID */
  reviewedBy?: Maybe<Scalars['ID']['output']>;
  /** Reviewed by admin */
  reviewedByAdmin?: Maybe<User>;
  /** Slot duration in minutes */
  slotDurationMinutes?: Maybe<Scalars['Int']['output']>;
  /** Sports available */
  sportTypes: Array<SportType>;
  /** Request status */
  status: VenueRequestStatus;
  /** Terms and conditions of the venue */
  termsAndConditions?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

/** A Relay-style connection for VenueRequest items. */
export type VenueRequestConnection = {
  __typename?: 'VenueRequestConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<VenueRequestEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the VenueRequestConnection. */
export type VenueRequestEdge = {
  __typename?: 'VenueRequestEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: VenueRequest;
};

export type VenueRequestStats = {
  __typename?: 'VenueRequestStats';
  /** Approved requests */
  approvedRequests: Scalars['Int']['output'];
  /** Pending requests */
  pendingRequests: Scalars['Int']['output'];
  /** Rejected requests */
  rejectedRequests: Scalars['Int']['output'];
  /** Total requests */
  totalRequests: Scalars['Int']['output'];
};

/** Status of the venue request */
export enum VenueRequestStatus {
  Approved = 'APPROVED',
  Cancelled = 'CANCELLED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type VenueRevenueStats = {
  __typename?: 'VenueRevenueStats';
  /** Booking revenue breakdown */
  bookingRevenue: RevenueBreakdown;
  /** Collected percentage of expected */
  collectedPercentage: Scalars['Float']['output'];
  /** Confirmed percentage of expected */
  confirmedPercentage: Scalars['Float']['output'];
  /** End date of the period (YYYY-MM-DD) */
  endDate: Scalars['String']['output'];
  /** Growth percentage compared to previous period */
  growthPercentage: Scalars['Float']['output'];
  /** Order revenue breakdown */
  orderRevenue: RevenueBreakdown;
  /** Pending percentage of expected */
  pendingPercentage: Scalars['Float']['output'];
  /** Time period: day, week, month, quarter, year */
  period: Scalars['String']['output'];
  /** Previous period collected revenue */
  previousCollectedRevenue: Scalars['Int']['output'];
  /** Start date of the period (YYYY-MM-DD) */
  startDate: Scalars['String']['output'];
  /** Total collected revenue (bookings + orders) */
  totalCollectedRevenue: Scalars['Int']['output'];
  /** Total confirmed revenue (bookings + orders) */
  totalConfirmedRevenue: Scalars['Int']['output'];
  /** Total expected revenue (bookings + orders) */
  totalExpectedRevenue: Scalars['Int']['output'];
  /** Total pending revenue (bookings + orders) */
  totalPendingRevenue: Scalars['Int']['output'];
};

export type VenueReview = {
  __typename?: 'VenueReview';
  _id: Scalars['ID']['output'];
  /** Review author */
  author?: Maybe<User>;
  /** Related booking ID */
  bookingId?: Maybe<Scalars['ID']['output']>;
  /** Review content */
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Helpful count */
  helpfulCount: Scalars['Int']['output'];
  /** Review images */
  images?: Maybe<Array<Scalars['String']['output']>>;
  /** Is review visible */
  isVisible: Scalars['Boolean']['output'];
  /** Owner reply */
  ownerReply?: Maybe<Scalars['String']['output']>;
  /** Owner reply date */
  ownerReplyAt?: Maybe<Scalars['DateTime']['output']>;
  /** Rating (1-5) */
  rating: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  /** User ID who wrote the review */
  userId: Scalars['ID']['output'];
  /** Venue ID */
  venueId: Scalars['ID']['output'];
};

/** Relay-style connection for venue reviews with rating stats. */
export type VenueReviewConnection = {
  __typename?: 'VenueReviewConnection';
  /** Average rating (1–5). */
  averageRating: Scalars['Int']['output'];
  /** List of edges (each contains a node + cursor). */
  edges: Array<VenueReviewEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Rating distribution [1,2,3,4,5]. */
  ratingDistribution: Array<Scalars['Int']['output']>;
  /** Total reviews matching the filter. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the VenueReviewConnection. */
export type VenueReviewEdge = {
  __typename?: 'VenueReviewEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The review at the end of the edge. */
  node: VenueReview;
};

export type VenueSensitiveStats = {
  __typename?: 'VenueSensitiveStats';
  revenueStats: VenueRevenueStats;
};

export type VenueSortInput = {
  /** Sort by field */
  sortBy?: InputMaybe<Scalars['String']['input']>;
  /** Sort order */
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};

export type VenueStaff = {
  __typename?: 'VenueStaff';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Custom title */
  customTitle?: Maybe<Scalars['String']['output']>;
  /** Invited by user ID */
  invitedBy?: Maybe<Scalars['ID']['output']>;
  /** Is venue owner (has all permissions) */
  isOwner: Scalars['Boolean']['output'];
  /** Joined date */
  joinedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Custom permissions (only applies when isOwner is false) */
  permissions: Array<VenueAction>;
  /** Staff status */
  status: VenueStaffStatus;
  updatedAt: Scalars['DateTime']['output'];
  /** Staff user */
  user?: Maybe<User>;
  /** User ID */
  userId: Scalars['ID']['output'];
  /** Venue */
  venue: Venue;
  /** Venue ID */
  venueId: Scalars['ID']['output'];
};

/** A Relay-style connection for VenueStaff items. */
export type VenueStaffConnection = {
  __typename?: 'VenueStaffConnection';
  /** List of edges (each contains a node + cursor). */
  edges: Array<VenueStaffEdge>;
  /** Pagination metadata (next/prev page, start/end cursor). */
  pageInfo: PageInfo;
  /** Total number of items matching the filter (across all pages). Optional — implementations may return 0 if computing the count is too expensive. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in the VenueStaffConnection. */
export type VenueStaffEdge = {
  __typename?: 'VenueStaffEdge';
  /** Opaque cursor pointing to this node. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: VenueStaff;
};

/** Status of staff member */
export enum VenueStaffStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

/** Status of the venue */
export enum VenueStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Suspended = 'SUSPENDED'
}

/** Type of venue based on verification status */
export enum VenueType {
  Claimed = 'CLAIMED',
  Unclaimed = 'UNCLAIMED',
  Verified = 'VERIFIED'
}

export type VerifyOtpInput = {
  /** 6-digit OTP code */
  code: Scalars['String']['input'];
  /** Verification ID received when OTP was sent */
  verificationId: Scalars['String']['input'];
};

export type VerifyPhoneOtpInput = {
  code: Scalars['String']['input'];
  purpose: OtpPurpose;
  verificationId: Scalars['String']['input'];
};

export type VerifyPhoneOtpResponse = {
  __typename?: 'VerifyPhoneOtpResponse';
  expiresAt: Scalars['DateTime']['output'];
  phone: Scalars['String']['output'];
  phoneVerificationToken: Scalars['String']['output'];
};

export type AdminCreateUserMutationVariables = Exact<{
  input: AdminCreateUserInput;
}>;


export type AdminCreateUserMutation = { __typename?: 'Mutation', adminCreateUser: { __typename?: 'User', _id: string, email?: string | null, phone?: string | null, fullName: string, displayName: string, userName: string, role: UserRole, isActive: boolean, accountOrigin?: AccountOrigin | null, createdAt: string } };

export type AdminSuspendUserMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type AdminSuspendUserMutation = { __typename?: 'Mutation', adminSuspendUser: { __typename?: 'User', _id: string, isActive: boolean, isSuspended: boolean, suspendedAt?: string | null, suspensionReason?: string | null } };

export type AdminUnsuspendUserMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type AdminUnsuspendUserMutation = { __typename?: 'Mutation', adminUnsuspendUser: { __typename?: 'User', _id: string, isActive: boolean, isSuspended: boolean } };

export type AdminProvisionPlayerMutationVariables = Exact<{
  input: AdminProvisionPlayerInput;
}>;


export type AdminProvisionPlayerMutation = { __typename?: 'Mutation', adminProvisionPlayer: { __typename?: 'AdminProvisionPlayerResponse', generatedPassword?: string | null, loginInstructions: string, user: { __typename?: 'User', _id: string, fullName: string, phone?: string | null, email?: string | null, userName: string, role: UserRole, accountOrigin?: AccountOrigin | null, createdBy?: string | null, phoneVerified: boolean, createdAt: string } } };

export type AdminResetUserPasswordMutationVariables = Exact<{
  input: AdminResetUserPasswordInput;
}>;


export type AdminResetUserPasswordMutation = { __typename?: 'Mutation', adminResetUserPassword: { __typename?: 'AdminResetUserPasswordResponse', success: boolean, generatedPassword?: string | null, message: string } };

export type AdminChangeUserRoleMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  role: UserRole;
}>;


export type AdminChangeUserRoleMutation = { __typename?: 'Mutation', adminChangeUserRole: { __typename?: 'User', _id: string, role: UserRole, fullName: string, email?: string | null, phone?: string | null, isOwner: boolean } };

export type AdminGetUsersQueryVariables = Exact<{
  role?: InputMaybe<UserRole>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isSuspended?: InputMaybe<Scalars['Boolean']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
}>;


export type AdminGetUsersQuery = { __typename?: 'Query', adminUsersConnection: { __typename?: 'UserConnection', totalCount: number, edges: Array<{ __typename?: 'UserEdge', cursor: string, node: { __typename?: 'User', _id: string, email?: string | null, phone?: string | null, fullName: string, displayName: string, userName: string, role: UserRole, isOwner: boolean, isActive: boolean, isSuspended: boolean, photoURL?: string | null, accountOrigin?: AccountOrigin | null, lastLoginAt?: string | null, createdAt: string } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type AdminGetSystemStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminGetSystemStatsQuery = { __typename?: 'Query', adminGetSystemStats: { __typename?: 'SystemStats', totalUsers: number, activeUsers: number, suspendedUsers: number, totalVenues: number, activeVenues: number, pendingVenues: number, totalBookings: number, totalRevenue: number } };

export type AdminGetUserBookingsQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
  statuses?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type AdminGetUserBookingsQuery = { __typename?: 'Query', adminUserBookingsConnection: { __typename?: 'AdminBookingItemConnection', totalCount: number, edges: Array<{ __typename?: 'AdminBookingItemEdge', cursor: string, node: { __typename?: 'AdminBookingItem', _id: string, venueName: string, venueAddress: string, date: string, timeSlots: string, status: string, totalPrice: number, courtName: string } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type AuditGetLogsQueryVariables = Exact<{
  filter?: InputMaybe<AuditFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
}>;


export type AuditGetLogsQuery = { __typename?: 'Query', auditLogsConnection: { __typename?: 'AuditLogConnection', totalCount: number, edges: Array<{ __typename?: 'AuditLogEdge', cursor: string, node: { __typename?: 'AuditLog', _id: string, actor?: string | null, actorName?: string | null, actorRole?: string | null, action: AuditAction, category: AuditCategory, status: AuditStatus, target?: string | null, targetId?: string | null, ip?: string | null, userAgent?: string | null, correlationId?: string | null, metadata?: Record<string, unknown> | null, errorMessage?: string | null, createdAt: string, updatedAt: string } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type AuditGetStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type AuditGetStatsQuery = { __typename?: 'Query', auditStats: { __typename?: 'AuditStats', totalEvents: number, failedLast24h: number, securityLast7d: number, authLast24h: number, byCategory: Array<{ __typename?: 'AuditCategoryCount', category: string, count: number }> } };

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'SuccessResponse', success: boolean, message: string } };

export type ReviewClaimRequestMutationVariables = Exact<{
  input: ReviewClaimRequestInput;
}>;


export type ReviewClaimRequestMutation = { __typename?: 'Mutation', reviewClaimRequest: { __typename?: 'VenueClaimRequest', _id: string, status: ClaimRequestStatus, rejectionReason?: string | null, adminNotes?: string | null, reviewedAt?: string | null, reviewedById?: string | null } };

export type GetClaimRequestsQueryVariables = Exact<{
  filter?: InputMaybe<ClaimRequestFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
}>;


export type GetClaimRequestsQuery = { __typename?: 'Query', claimRequestsConnection: { __typename?: 'VenueClaimRequestConnection', totalCount: number, edges: Array<{ __typename?: 'VenueClaimRequestEdge', cursor: string, node: { __typename?: 'VenueClaimRequest', _id: string, venueId: string, userId: string, venueName: string, venueAddress?: string | null, phoneNumber: string, email?: string | null, notes?: string | null, proofDocuments?: Array<string> | null, status: ClaimRequestStatus, rejectionReason?: string | null, adminNotes?: string | null, createdAt: string, updatedAt: string, reviewedAt?: string | null, reviewedById?: string | null, user?: { __typename?: 'User', _id: string, displayName: string, userName: string, photoURL?: string | null } | null, venue?: { __typename?: 'Venue', _id: string, name: string } | null, reviewer?: { __typename?: 'User', _id: string, displayName: string } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type GetClaimRequestStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetClaimRequestStatsQuery = { __typename?: 'Query', claimRequestStats: { __typename?: 'ClaimRequestStats', total: number, pending: number, approved: number, rejected: number, cancelled: number, thisWeek: number, thisMonth: number } };

export type UpdateContactInquiryStatusMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateInquiryStatusInput;
}>;


export type UpdateContactInquiryStatusMutation = { __typename?: 'Mutation', updateContactInquiryStatus: { __typename?: 'ContactInquiry', _id: string, name: string, phone: string, email: string, subject: ContactSubject, message: string, status: InquiryStatus, adminNote?: string | null, repliedBy?: string | null, repliedAt?: string | null, createdAt: string, updatedAt: string, repliedByUser?: { __typename?: 'User', _id: string, fullName: string } | null } };

export type GetContactInquiriesQueryVariables = Exact<{
  filter?: InputMaybe<ContactInquiryFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type GetContactInquiriesQuery = { __typename?: 'Query', contactInquiriesConnection: { __typename?: 'ContactInquiryConnection', totalCount: number, edges: Array<{ __typename?: 'ContactInquiryEdge', cursor: string, node: { __typename?: 'ContactInquiry', _id: string, name: string, phone: string, email: string, subject: ContactSubject, message: string, status: InquiryStatus, adminNote?: string | null, repliedBy?: string | null, repliedAt?: string | null, createdAt: string, updatedAt: string, repliedByUser?: { __typename?: 'User', _id: string, fullName: string } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type GetContactInquiryStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetContactInquiryStatsQuery = { __typename?: 'Query', getContactInquiryStats: { __typename?: 'ContactInquiryStats', total: number, newCount: number, inProgressCount: number, repliedCount: number, closedCount: number } };

export type UpdateReportStatusMutationVariables = Exact<{
  input: UpdateReportStatusInput;
}>;


export type UpdateReportStatusMutation = { __typename?: 'Mutation', updateReportStatus: { __typename?: 'PostReport', _id: string, status: PostReportStatus, notes?: string | null, reviewedAt?: string | null, reviewedBy?: string | null } };

export type UpdateUserReportStatusMutationVariables = Exact<{
  input: UpdateUserReportStatusInput;
}>;


export type UpdateUserReportStatusMutation = { __typename?: 'Mutation', updateUserReportStatus: { __typename?: 'UserReport', _id: string, status: UserReportStatus, notes?: string | null, reviewedAt?: string | null, reviewedBy?: string | null } };

export type DeletePostByAdminMutationVariables = Exact<{
  postId: Scalars['ID']['input'];
}>;


export type DeletePostByAdminMutation = { __typename?: 'Mutation', deletePostByAdmin: boolean };

export type UpdateMessageReportStatusMutationVariables = Exact<{
  input: UpdateMessageReportStatusInput;
}>;


export type UpdateMessageReportStatusMutation = { __typename?: 'Mutation', updateMessageReportStatus: { __typename?: 'MessageReport', _id: string, status: ReportStatus, notes?: string | null, reviewedAt?: string | null, reviewedBy?: string | null } };

export type DeleteMessageByAdminMutationVariables = Exact<{
  messageId: Scalars['ID']['input'];
}>;


export type DeleteMessageByAdminMutation = { __typename?: 'Mutation', deleteMessageByAdmin: boolean };

export type GetPostReportsForAdminQueryVariables = Exact<{
  filter?: InputMaybe<PostReportFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
}>;


export type GetPostReportsForAdminQuery = { __typename?: 'Query', getPostReportsForAdminConnection: { __typename?: 'PostReportConnection', totalCount: number, edges: Array<{ __typename?: 'PostReportEdge', cursor: string, node: { __typename?: 'PostReport', _id: string, postId: string, reason: PostReportReason, status: PostReportStatus, description?: string | null, notes?: string | null, createdAt: string, updatedAt: string, reporterId: string, reviewedAt?: string | null, reviewedBy?: string | null, reporter?: { __typename?: 'User', _id: string, displayName: string, userName: string, photoURL?: string | null } | null, post?: { __typename?: 'Post', _id: string, content: string, author: { __typename?: 'User', _id: string, displayName: string, userName: string, photoURL?: string | null } } | null, reviewer?: { __typename?: 'User', _id: string, displayName: string } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type GetPostReportStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPostReportStatsQuery = { __typename?: 'Query', getPostReportStats: { __typename?: 'PostReportStats', totalReports: number, pendingReports: number, reviewedReports: number, resolvedReports: number, dismissedReports: number } };

export type GetUserReportsForAdminQueryVariables = Exact<{
  filter?: InputMaybe<UserReportFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
}>;


export type GetUserReportsForAdminQuery = { __typename?: 'Query', getUserReportsForAdminConnection: { __typename?: 'UserReportConnection', totalCount: number, edges: Array<{ __typename?: 'UserReportEdge', cursor: string, node: { __typename?: 'UserReport', _id: string, reportedUserId: string, reporterId: string, reason: UserReportReason, status: UserReportStatus, description?: string | null, notes?: string | null, createdAt: string, updatedAt: string, reviewedAt?: string | null, reviewedBy?: string | null, reviewer?: { __typename?: 'User', _id: string, displayName: string } | null, reporter?: { __typename?: 'User', _id: string, displayName: string, userName: string, photoURL?: string | null } | null, reportedUser?: { __typename?: 'User', _id: string, displayName: string, userName: string, photoURL?: string | null } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type GetUserReportStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserReportStatsQuery = { __typename?: 'Query', getUserReportStats: { __typename?: 'UserReportStats', totalReports: number, pendingReports: number, reviewedReports: number, resolvedReports: number, dismissedReports: number } };

export type GetMessageReportsForAdminQueryVariables = Exact<{
  filter?: InputMaybe<MessageReportFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
}>;


export type GetMessageReportsForAdminQuery = { __typename?: 'Query', messageReportsConnection: { __typename?: 'MessageReportConnection', totalCount: number, edges: Array<{ __typename?: 'MessageReportEdge', cursor: string, node: { __typename?: 'MessageReport', _id: string, messageId: string, reporterId: string, reason: string, status: ReportStatus, notes?: string | null, createdAt: string, updatedAt: string, reviewedAt?: string | null, reviewedBy?: string | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type GetMessageReportStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMessageReportStatsQuery = { __typename?: 'Query', getMessageReportStats: { __typename?: 'MessageReportStats', totalReports: number, pendingReports: number, reviewedReports: number, resolvedReports: number, dismissedReports: number } };

export type NotificationFieldsFragment = { __typename?: 'Notification', _id: string, userId: string, type: NotificationType, title: string, description: string, icon: string, imageUrl?: string | null, isRead: boolean, readAt?: string | null, createdAt: string, updatedAt: string, data?: { __typename?: 'NotificationData', screen?: string | null, targetId?: string | null, action?: string | null, requesterId?: string | null, initialTab?: string | null, actionTaken?: boolean | null, secondaryTargetId?: string | null } | null };

export type MarkNotificationAsReadMutationVariables = Exact<{
  notificationId: Scalars['ID']['input'];
}>;


export type MarkNotificationAsReadMutation = { __typename?: 'Mutation', markNotificationAsRead: { __typename?: 'Notification', _id: string, userId: string, type: NotificationType, title: string, description: string, icon: string, imageUrl?: string | null, isRead: boolean, readAt?: string | null, createdAt: string, updatedAt: string, data?: { __typename?: 'NotificationData', screen?: string | null, targetId?: string | null, action?: string | null, requesterId?: string | null, initialTab?: string | null, actionTaken?: boolean | null, secondaryTargetId?: string | null } | null } };

export type MarkAllNotificationsAsReadMutationVariables = Exact<{
  type?: InputMaybe<NotificationType>;
}>;


export type MarkAllNotificationsAsReadMutation = { __typename?: 'Mutation', markAllNotificationsAsRead: { __typename?: 'MarkAllAsReadResponse', success: boolean, message: string, count: number } };

export type MarkNotificationActionTakenMutationVariables = Exact<{
  notificationId: Scalars['ID']['input'];
}>;


export type MarkNotificationActionTakenMutation = { __typename?: 'Mutation', markNotificationActionTaken: { __typename?: 'Notification', _id: string, userId: string, type: NotificationType, title: string, description: string, icon: string, imageUrl?: string | null, isRead: boolean, readAt?: string | null, createdAt: string, updatedAt: string, data?: { __typename?: 'NotificationData', screen?: string | null, targetId?: string | null, action?: string | null, requesterId?: string | null, initialTab?: string | null, actionTaken?: boolean | null, secondaryTargetId?: string | null } | null } };

export type SaveFcmTokenMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type SaveFcmTokenMutation = { __typename?: 'Mutation', saveFcmToken: boolean };

export type RemoveFcmTokenMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type RemoveFcmTokenMutation = { __typename?: 'Mutation', removeFcmToken: boolean };

export type GetNotificationsQueryVariables = Exact<{
  filter?: InputMaybe<NotificationFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type GetNotificationsQuery = { __typename?: 'Query', notificationsConnection: { __typename?: 'NotificationConnection', totalCount: number, edges: Array<{ __typename?: 'NotificationEdge', cursor: string, node: { __typename?: 'Notification', _id: string, userId: string, type: NotificationType, title: string, description: string, icon: string, imageUrl?: string | null, isRead: boolean, readAt?: string | null, createdAt: string, updatedAt: string, data?: { __typename?: 'NotificationData', screen?: string | null, targetId?: string | null, action?: string | null, requesterId?: string | null, initialTab?: string | null, actionTaken?: boolean | null, secondaryTargetId?: string | null } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type GetUnreadNotificationCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUnreadNotificationCountQuery = { __typename?: 'Query', getUnreadNotificationCount: number };

export type NotificationCreatedSubscriptionVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type NotificationCreatedSubscription = { __typename?: 'Subscription', notificationCreated: { __typename?: 'Notification', _id: string, userId: string, type: NotificationType, title: string, description: string, icon: string, imageUrl?: string | null, isRead: boolean, readAt?: string | null, createdAt: string, updatedAt: string, data?: { __typename?: 'NotificationData', screen?: string | null, targetId?: string | null, action?: string | null, requesterId?: string | null, initialTab?: string | null, actionTaken?: boolean | null, secondaryTargetId?: string | null } | null } };

export type CreateOtpTestPhoneMutationVariables = Exact<{
  input: CreateOtpTestPhoneInput;
}>;


export type CreateOtpTestPhoneMutation = { __typename?: 'Mutation', createOtpTestPhone: { __typename?: 'OtpTestPhone', _id: string, phone: string, testCode: string, label: string, enabled: boolean, allowedPurposes?: Array<OtpPurpose> | null, expiresAt?: string | null, createdAt: string } };

export type UpdateOtpTestPhoneMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateOtpTestPhoneInput;
}>;


export type UpdateOtpTestPhoneMutation = { __typename?: 'Mutation', updateOtpTestPhone: { __typename?: 'OtpTestPhone', _id: string, phone: string, testCode: string, label: string, enabled: boolean, allowedPurposes?: Array<OtpPurpose> | null, expiresAt?: string | null, updatedAt: string } };

export type SetOtpTestPhoneEnabledMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  enabled: Scalars['Boolean']['input'];
}>;


export type SetOtpTestPhoneEnabledMutation = { __typename?: 'Mutation', setOtpTestPhoneEnabled: { __typename?: 'OtpTestPhone', _id: string, enabled: boolean, updatedAt: string } };

export type GetOtpTestPhonesQueryVariables = Exact<{
  pagination?: InputMaybe<CursorPageInput>;
  filter?: InputMaybe<OtpTestPhoneFilterInput>;
  sort?: InputMaybe<CursorSortInput>;
}>;


export type GetOtpTestPhonesQuery = { __typename?: 'Query', otpTestPhonesConnection: { __typename?: 'OtpTestPhoneConnection', totalCount: number, edges: Array<{ __typename?: 'OtpTestPhoneEdge', cursor: string, node: { __typename?: 'OtpTestPhone', _id: string, phone: string, testCode: string, label: string, enabled: boolean, allowedPurposes?: Array<OtpPurpose> | null, expiresAt?: string | null, createdAt: string, updatedAt: string } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type CreateOtpTestUserGrantMutationVariables = Exact<{
  input: CreateOtpTestUserGrantInput;
}>;


export type CreateOtpTestUserGrantMutation = { __typename?: 'Mutation', createOtpTestUserGrant: { __typename?: 'OtpTestUserGrant', _id: string, userId: string, userDisplayName: string, userRole: UserRole, phone: string, testCode: string, reason: string, enabled: boolean, allowedPurposes: Array<OtpPurpose>, expiresAt: string, createdAt: string } };

export type RevokeOtpTestUserGrantMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RevokeOtpTestUserGrantMutation = { __typename?: 'Mutation', revokeOtpTestUserGrant: { __typename?: 'OtpTestUserGrant', _id: string, enabled: boolean, revokedAt?: string | null, updatedAt: string } };

export type GetOtpTestUserGrantsQueryVariables = Exact<{
  pagination?: InputMaybe<CursorPageInput>;
  filter?: InputMaybe<OtpTestUserGrantFilterInput>;
  sort?: InputMaybe<CursorSortInput>;
}>;


export type GetOtpTestUserGrantsQuery = { __typename?: 'Query', otpTestUserGrantsConnection: { __typename?: 'OtpTestUserGrantConnection', totalCount: number, edges: Array<{ __typename?: 'OtpTestUserGrantEdge', cursor: string, node: { __typename?: 'OtpTestUserGrant', _id: string, userId: string, userDisplayName: string, userRole: UserRole, phone: string, testCode: string, reason: string, enabled: boolean, allowedPurposes: Array<OtpPurpose>, expiresAt: string, createdAt: string, updatedAt: string } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type CreateStaffRecurringBookingMutationVariables = Exact<{
  input: CreateStaffRecurringBookingInput;
}>;


export type CreateStaffRecurringBookingMutation = { __typename?: 'Mutation', createStaffRecurringBooking: { __typename?: 'BookingWithOrderPayload', booking: { __typename?: 'Booking', _id: string, date: string, status: BookingStatus, finalAmount: number, isRecurring: boolean, discount?: number | null, discountCode?: string | null, isManualPrice: boolean, manualFinalAmount?: number | null, recurringConfig?: { __typename?: 'RecurringConfig', totalSessions: number, endDate: string, durationMonths: number, frequency: RecurringFrequency } | null, slots: Array<{ __typename?: 'BookedSlot', courtId: string, courtName: string, startTime: string, endTime: string, price: number }>, customer?: { __typename?: 'User', _id: string, displayName: string, phone?: string | null } | null }, order: { __typename?: 'Order', _id: string, orderCode: string, status: OrderStatus, totalAmount: number } } };

export type ValidatePromoCodeQueryVariables = Exact<{
  input: ValidatePromoCodeInput;
}>;


export type ValidatePromoCodeQuery = { __typename?: 'Query', validatePromoCode: { __typename?: 'PromoCodeValidationResult', isValid: boolean, errorMessage?: string | null, estimatedDiscount?: number | null, promotion?: { __typename?: 'Promotion', _id: string, venueId: string, name: string, description?: string | null, type: PromotionType, value: number, maxDiscountAmount?: number | null, scope: PromotionScope, courtIds?: Array<string> | null, sportTypes?: Array<SportType> | null, category: PromotionCategory, trigger: PromotionTrigger, code?: string | null, startDate: string, endDate: string, status: PromotionStatus, priority: number, minBookingAmount?: number | null, applyLevel: PromotionApplyLevel, isStackable: boolean, showOnVenueCard: boolean, showAsBanner: boolean, badgeText?: string | null, badgeColor?: string | null, bannerImageUrl?: string | null, usageCount: number, totalUsageLimit?: number | null, perUserLimit?: number | null, createdAt: string, updatedAt: string, applicableTimeRanges?: Array<{ __typename?: 'TimeRange', startTime: string, endTime: string }> | null } | null } };

export type CalculateBookingDiscountQueryVariables = Exact<{
  input: ApplyPromotionInput;
}>;


export type CalculateBookingDiscountQuery = { __typename?: 'Query', calculateBookingDiscount: { __typename?: 'DiscountCalculationResult', originalTotal: number, totalDiscount: number, finalAmount: number, discountPercentage: number, isStacked: boolean, stackingMessage?: string | null, appliedPromotions: Array<{ __typename?: 'AppliedPromotion', promotionId: string, name: string, type: PromotionType, category: PromotionCategory, value: number, maxDiscountAmount?: number | null, discountAmount: number, code?: string | null, badgeText?: string | null, applyLevel?: PromotionApplyLevel | null }>, slotDiscounts?: Array<{ __typename?: 'SlotDiscount', courtId: string, startTime: string, endTime: string, originalPrice: number, discountAmount: number, finalPrice: number }> | null } };

export type GetAvailablePromotionsForBookingQueryVariables = Exact<{
  input: ApplyPromotionInput;
}>;


export type GetAvailablePromotionsForBookingQuery = { __typename?: 'Query', availablePromotionsForBooking: { __typename?: 'AvailablePromotionsForBooking', hasPromotions: boolean, autoApplied: Array<{ __typename?: 'Promotion', _id: string, venueId: string, name: string, description?: string | null, type: PromotionType, value: number, maxDiscountAmount?: number | null, scope: PromotionScope, courtIds?: Array<string> | null, sportTypes?: Array<SportType> | null, category: PromotionCategory, trigger: PromotionTrigger, code?: string | null, startDate: string, endDate: string, status: PromotionStatus, priority: number, minBookingAmount?: number | null, applyLevel: PromotionApplyLevel, isStackable: boolean, showOnVenueCard: boolean, showAsBanner: boolean, badgeText?: string | null, badgeColor?: string | null, bannerImageUrl?: string | null, usageCount: number, totalUsageLimit?: number | null, perUserLimit?: number | null, createdAt: string, updatedAt: string, applicableTimeRanges?: Array<{ __typename?: 'TimeRange', startTime: string, endTime: string }> | null }>, codePromotions: Array<{ __typename?: 'Promotion', _id: string, venueId: string, name: string, description?: string | null, type: PromotionType, value: number, maxDiscountAmount?: number | null, scope: PromotionScope, courtIds?: Array<string> | null, sportTypes?: Array<SportType> | null, category: PromotionCategory, trigger: PromotionTrigger, code?: string | null, startDate: string, endDate: string, status: PromotionStatus, priority: number, minBookingAmount?: number | null, applyLevel: PromotionApplyLevel, isStackable: boolean, showOnVenueCard: boolean, showAsBanner: boolean, badgeText?: string | null, badgeColor?: string | null, bannerImageUrl?: string | null, usageCount: number, totalUsageLimit?: number | null, perUserLimit?: number | null, createdAt: string, updatedAt: string, applicableTimeRanges?: Array<{ __typename?: 'TimeRange', startTime: string, endTime: string }> | null }>, preCalculatedDiscount?: { __typename?: 'DiscountCalculationResult', originalTotal: number, totalDiscount: number, finalAmount: number, discountPercentage: number, isStacked: boolean, stackingMessage?: string | null, appliedPromotions: Array<{ __typename?: 'AppliedPromotion', promotionId: string, name: string, type: PromotionType, category: PromotionCategory, value: number, maxDiscountAmount?: number | null, discountAmount: number, code?: string | null, badgeText?: string | null, applyLevel?: PromotionApplyLevel | null }>, slotDiscounts?: Array<{ __typename?: 'SlotDiscount', courtId: string, startTime: string, endTime: string, originalPrice: number, discountAmount: number, finalPrice: number }> | null } | null } };

export type CheckRecurringAvailabilityQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  startDate: Scalars['String']['input'];
  durationMonths: Scalars['Int']['input'];
  slots?: InputMaybe<Array<BookedSlotInput> | BookedSlotInput>;
  daySchedules?: InputMaybe<Array<DayScheduleInput> | DayScheduleInput>;
  isStaffMode?: InputMaybe<Scalars['Boolean']['input']>;
  excludeDates?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  customerId?: InputMaybe<Scalars['ID']['input']>;
  discountCode?: InputMaybe<Scalars['String']['input']>;
}>;


export type CheckRecurringAvailabilityQuery = { __typename?: 'Query', checkRecurringAvailability: { __typename?: 'RecurringAvailabilityCheck', allAvailable: boolean, allDates: Array<string>, unavailableDates: Array<string>, availableDates: Array<string>, totalSessions: number, sessionsPerWeek: number, daysOfWeek: Array<number>, pricePerSession: number, totalPrice: number, discountPercent: number, discountAmount: number, finalAmount: number, recurringEnabled: boolean, effectiveSessions?: number | null, excludedSessionCount?: number | null, recurringPromoEligible?: boolean | null, minRecurringPromoSessions?: number | null, recurringCategoryDiscount?: number | null, autoPromoDiscount?: number | null, finalAmountWithPromo?: number | null, appliedPromotions?: Array<{ __typename?: 'AppliedPromotion', promotionId: string, name: string, category: PromotionCategory, discountAmount: number, code?: string | null, type: PromotionType, value: number }> | null, dayPriceBreakdown?: Array<{ __typename?: 'DayPriceBreakdown', dayOfWeek: number, pricePerSession: number, sessionCount: number, totalPrice: number }> | null } };

export type FinancePnlMetricFieldsFragment = { __typename?: 'FinancePnlMetric', value: number, previousValue: number, changePercent: number };

export type FinancePnlRateMetricFieldsFragment = { __typename?: 'FinancePnlRateMetric', value: number, previousValue: number, changePercent: number };

export type VenueFinanceReportQueryVariables = Exact<{
  filter: FinanceFilterInput;
}>;


export type VenueFinanceReportQuery = { __typename?: 'Query', venueFinanceReport: { __typename?: 'VenueFinanceReport', pendingBookingRevenue: number, totalOrders: number, completedOrders: number, pipelineOrders: number, pipelineGrossValue: number, averageOrderValue: number, completionRate: number, period: { __typename?: 'FinancePeriodInfo', from: string, to: string, previousFrom: string, previousTo: string, timezone: string }, pnl: { __typename?: 'FinancePnlSummary', grossRevenue: { __typename?: 'FinancePnlMetric', value: number, previousValue: number, changePercent: number }, collected: { __typename?: 'FinancePnlMetric', value: number, previousValue: number, changePercent: number }, outstanding: { __typename?: 'FinancePnlMetric', value: number, previousValue: number, changePercent: number }, refunds: { __typename?: 'FinancePnlMetric', value: number, previousValue: number, changePercent: number }, netRevenue: { __typename?: 'FinancePnlMetric', value: number, previousValue: number, changePercent: number }, cogs: { __typename?: 'FinancePnlMetric', value: number, previousValue: number, changePercent: number }, grossProfit: { __typename?: 'FinancePnlMetric', value: number, previousValue: number, changePercent: number }, operatingExpenses: { __typename?: 'FinancePnlMetric', value: number, previousValue: number, changePercent: number }, netProfit: { __typename?: 'FinancePnlMetric', value: number, previousValue: number, changePercent: number }, netMarginPercent: { __typename?: 'FinancePnlRateMetric', value: number, previousValue: number, changePercent: number } }, byStatus: Array<{ __typename?: 'FinanceBreakdownItem', label: string, key?: string | null, revenue: number, count: number, percentage: number }>, byPaymentMethod: Array<{ __typename?: 'FinanceBreakdownItem', label: string, key?: string | null, revenue: number, count: number, percentage: number }>, byOrderType: Array<{ __typename?: 'FinanceBreakdownItem', label: string, key?: string | null, revenue: number, count: number, percentage: number }>, byCourt: Array<{ __typename?: 'FinanceBreakdownItem', label: string, key?: string | null, revenue: number, count: number, percentage: number }>, byRevenueStream: Array<{ __typename?: 'FinanceBreakdownItem', label: string, key?: string | null, revenue: number, count: number, percentage: number }>, expenseByCategory: Array<{ __typename?: 'FinanceBreakdownItem', label: string, key?: string | null, revenue: number, count: number, percentage: number }>, trend: Array<{ __typename?: 'FinanceTrendPoint', label: string, revenue: number, netProfit: number, expenses: number, previousRevenue?: number | null }> } };

export type VenueFinanceTransactionsConnectionQueryVariables = Exact<{
  filter: FinanceTransactionFilterInput;
  sort?: InputMaybe<FinanceTransactionSortInput>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type VenueFinanceTransactionsConnectionQuery = { __typename?: 'Query', venueFinanceTransactionsConnection: { __typename?: 'FinanceTransactionConnection', totalCount: number, edges: Array<{ __typename?: 'FinanceTransactionEdge', cursor: string, node: { __typename?: 'FinanceTransaction', orderId: string, orderCode: string, venueId: string, venueName?: string | null, createdAt: string, completedAt?: string | null, paidAt?: string | null, orderType: OrderType, status: OrderStatus, paymentStatus: OrderPaymentStatus, paymentMethod?: PaymentMethod | null, courtLabel?: string | null, customerName?: string | null, grossAmount: number, paidAmount: number, refundAmount: number, netAmount: number, cogsAmount: number, profitAmount: number, profitMarginPercent: number } }>, pageInfo: { __typename?: 'FinanceTransactionPageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export type VenueExpensesConnectionQueryVariables = Exact<{
  filter: ExpenseFilterInput;
  sort?: InputMaybe<CursorSortInput>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type VenueExpensesConnectionQuery = { __typename?: 'Query', venueExpensesConnection: { __typename?: 'VenueExpenseConnection', totalCount: number, edges: Array<{ __typename?: 'VenueExpenseEdge', cursor: string, node: { __typename?: 'VenueExpense', _id: string, venueId: string, category: ExpenseCategory, amount: number, date: string, coverageFrom: string, coverageTo: string, allocatedAmountInPeriod?: number | null, note?: string | null, paymentMethod?: PaymentMethod | null, isRecurring: boolean, createdAt: string } }>, pageInfo: { __typename?: 'VenueExpensePageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export type CreateVenueExpenseMutationVariables = Exact<{
  input: CreateVenueExpenseInput;
}>;


export type CreateVenueExpenseMutation = { __typename?: 'Mutation', createVenueExpense: { __typename?: 'VenueExpense', _id: string, category: ExpenseCategory, amount: number, date: string, coverageFrom: string, coverageTo: string, note?: string | null, paymentMethod?: PaymentMethod | null, isRecurring: boolean } };

export type UpdateVenueExpenseMutationVariables = Exact<{
  input: UpdateVenueExpenseInput;
}>;


export type UpdateVenueExpenseMutation = { __typename?: 'Mutation', updateVenueExpense: { __typename?: 'VenueExpense', _id: string, category: ExpenseCategory, amount: number, date: string, coverageFrom: string, coverageTo: string, note?: string | null, paymentMethod?: PaymentMethod | null, isRecurring: boolean } };

export type DeleteVenueExpenseMutationVariables = Exact<{
  expenseId: Scalars['ID']['input'];
}>;


export type DeleteVenueExpenseMutation = { __typename?: 'Mutation', deleteVenueExpense: boolean };

export type FinancePeriodFieldsFragment = { __typename?: 'FinancePeriodInfo', from: string, to: string, previousFrom: string, previousTo: string, timezone: string };

export type FinanceBreakdownItemFieldsFragment = { __typename?: 'FinanceBreakdownItem', label: string, key?: string | null, revenue: number, count: number, percentage: number };

export type VenueFinancePortfolioQueryVariables = Exact<{
  filter: FinanceFilterInput;
}>;


export type VenueFinancePortfolioQuery = { __typename?: 'Query', venueFinancePortfolio: { __typename?: 'VenueFinancePortfolio', totalVenues: number, venues: Array<{ __typename?: 'VenueFinancePortfolioItem', venueId: string, venueName: string, completedOrders: number, grossRevenue: { __typename?: 'FinancePnlMetric', value: number, previousValue: number, changePercent: number }, netProfit: { __typename?: 'FinancePnlMetric', value: number, previousValue: number, changePercent: number }, netMarginPercent: { __typename?: 'FinancePnlRateMetric', value: number, previousValue: number, changePercent: number }, grossProfit: { __typename?: 'FinancePnlMetric', value: number, previousValue: number, changePercent: number }, netRevenue: { __typename?: 'FinancePnlMetric', value: number, previousValue: number, changePercent: number } }> } };

export type VenueOperationsReportQueryVariables = Exact<{
  filter: OperationsFilterInput;
}>;


export type VenueOperationsReportQuery = { __typename?: 'Query', venueOperationsReport: { __typename?: 'VenueOperationsReport', totalBookings: number, courtRevenue: number, period: { __typename?: 'FinancePeriodInfo', from: string, to: string, previousFrom: string, previousTo: string, timezone: string }, occupancy: { __typename?: 'OperationsOccupancySummary', availableSlots: number, occupiedSlots: number, occupancyRate: number }, byScheduleType: Array<{ __typename?: 'FinanceBreakdownItem', label: string, key?: string | null, revenue: number, count: number, percentage: number }>, byPromotion: Array<{ __typename?: 'FinanceBreakdownItem', label: string, key?: string | null, revenue: number, count: number, percentage: number }>, heatMapData: Array<{ __typename?: 'HeatMapCell', hour: string, day: string, intensity: number, bookings: number }>, scheduleCoverageTrend: Array<{ __typename?: 'ScheduleCoveragePoint', date: string, label: string, revenue: number, bookingCount: number, occupiedSlots: number, availableSlots: number, occupancyRate: number, previousRevenue?: number | null, previousOccupancyRate?: number | null }> } };

export type StockMovementListFieldsFragment = { __typename?: 'StockMovement', _id: string, productId: string, venueId: string, variantId?: string | null, type: StockMovementType, quantity: number, importPrice?: number | null, totalCost?: number | null, supplierName?: string | null, supplierContact?: string | null, invoiceNumber?: string | null, orderId?: string | null, salePrice?: number | null, costAtSale?: number | null, adjustmentReason?: StockAdjustmentReason | null, relatedVenueId?: string | null, relatedProductId?: string | null, previousStock: number, newStock: number, note?: string | null, createdBy: string, createdAt: string, updatedAt: string, product?: { __typename?: 'Product', _id: string, name: string, sku?: string | null, price: number, costPrice?: number | null, averageCost?: number | null, lastImportPrice?: number | null, stockQuantity: number, images: Array<{ __typename?: 'ProductImage', url: string, isPrimary: boolean }> } | null, createdByUser?: { __typename?: 'User', _id: string, displayName: string, photoURL?: string | null } | null };

export type StockMovementsConnectionQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  filter?: InputMaybe<StockMovementFilterInput>;
  sort?: InputMaybe<StockMovementSortInput>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type StockMovementsConnectionQuery = { __typename?: 'Query', stockMovementsConnection: { __typename?: 'StockMovementConnection', totalCount: number, edges: Array<{ __typename?: 'StockMovementEdge', cursor: string, node: { __typename?: 'StockMovement', _id: string, productId: string, venueId: string, variantId?: string | null, type: StockMovementType, quantity: number, importPrice?: number | null, totalCost?: number | null, supplierName?: string | null, supplierContact?: string | null, invoiceNumber?: string | null, orderId?: string | null, salePrice?: number | null, costAtSale?: number | null, adjustmentReason?: StockAdjustmentReason | null, relatedVenueId?: string | null, relatedProductId?: string | null, previousStock: number, newStock: number, note?: string | null, createdBy: string, createdAt: string, updatedAt: string, product?: { __typename?: 'Product', _id: string, name: string, sku?: string | null, price: number, costPrice?: number | null, averageCost?: number | null, lastImportPrice?: number | null, stockQuantity: number, images: Array<{ __typename?: 'ProductImage', url: string, isPrimary: boolean }> } | null, createdByUser?: { __typename?: 'User', _id: string, displayName: string, photoURL?: string | null } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type UpdateVenueMutationVariables = Exact<{
  input: UpdateVenueInput;
}>;


export type UpdateVenueMutation = { __typename?: 'Mutation', updateVenue: { __typename?: 'Venue', _id: string, name: string, status: VenueStatus } };

export type UpdateVenueOrderTypeConfigsMutationVariables = Exact<{
  input: UpdateVenueOrderTypeConfigsInput;
}>;


export type UpdateVenueOrderTypeConfigsMutation = { __typename?: 'Mutation', updateVenueOrderTypeConfigs: { __typename?: 'Venue', _id: string, orderTypeConfigs?: Array<{ __typename?: 'VenueOrderTypeConfig', orderType: OrderType, isEnabled: boolean, label?: string | null }> | null } };

export type CreateCourtMutationVariables = Exact<{
  input: CreateCourtInput;
}>;


export type CreateCourtMutation = { __typename?: 'Mutation', createCourt: { __typename?: 'Court', _id: string, name: string, sportType: SportType, status: CourtStatus } };

export type UpdateCourtMutationVariables = Exact<{
  input: UpdateCourtInput;
}>;


export type UpdateCourtMutation = { __typename?: 'Mutation', updateCourt: { __typename?: 'Court', _id: string, name: string, sportType: SportType, status: CourtStatus, defaultPricePerHour: number, peakPricePerHour: number } };

export type DeleteCourtMutationVariables = Exact<{
  courtId: Scalars['ID']['input'];
}>;


export type DeleteCourtMutation = { __typename?: 'Mutation', deleteCourt: boolean };

export type ConfirmBookingMutationVariables = Exact<{
  bookingId: Scalars['ID']['input'];
}>;


export type ConfirmBookingMutation = { __typename?: 'Mutation', confirmBooking: { __typename?: 'BookingWithOrderPayload', booking: { __typename?: 'Booking', _id: string, status: BookingStatus } } };

export type RejectBookingMutationVariables = Exact<{
  bookingId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type RejectBookingMutation = { __typename?: 'Mutation', rejectBooking: { __typename?: 'Booking', _id: string, status: BookingStatus } };

export type CancelBookingMutationVariables = Exact<{
  bookingId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type CancelBookingMutation = { __typename?: 'Mutation', cancelBooking: { __typename?: 'Booking', _id: string, status: BookingStatus } };

export type CompleteBookingMutationVariables = Exact<{
  bookingId: Scalars['ID']['input'];
}>;


export type CompleteBookingMutation = { __typename?: 'Mutation', completeBooking: { __typename?: 'Booking', _id: string, status: BookingStatus } };

export type CheckInBookingMutationVariables = Exact<{
  bookingId: Scalars['ID']['input'];
}>;


export type CheckInBookingMutation = { __typename?: 'Mutation', checkIn: { __typename?: 'Booking', _id: string, status: BookingStatus } };

export type MarkNoShowMutationVariables = Exact<{
  bookingId: Scalars['ID']['input'];
}>;


export type MarkNoShowMutation = { __typename?: 'Mutation', markNoShow: { __typename?: 'Booking', _id: string, status: BookingStatus } };

export type ApproveHoldBookingMutationVariables = Exact<{
  input: ApproveHoldBookingInput;
}>;


export type ApproveHoldBookingMutation = { __typename?: 'Mutation', approveHoldBooking: { __typename?: 'Booking', _id: string, status: BookingStatus } };

export type ConfirmHoldBookingMutationVariables = Exact<{
  bookingId: Scalars['ID']['input'];
  paymentMethod?: InputMaybe<PaymentMethod>;
}>;


export type ConfirmHoldBookingMutation = { __typename?: 'Mutation', confirmHoldBooking: { __typename?: 'BookingWithOrderPayload', booking: { __typename?: 'Booking', _id: string, status: BookingStatus } } };

export type RejectHoldBookingMutationVariables = Exact<{
  bookingId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type RejectHoldBookingMutation = { __typename?: 'Mutation', rejectHoldBooking: { __typename?: 'Booking', _id: string, status: BookingStatus } };

export type CreateStaffOrderMutationVariables = Exact<{
  input: CreateOrderInput;
}>;


export type CreateStaffOrderMutation = { __typename?: 'Mutation', createStaffOrder: { __typename?: 'Order', _id: string, orderCode: string, status: OrderStatus, totalAmount: number } };

export type ConfirmOrderMutationVariables = Exact<{
  orderId: Scalars['ID']['input'];
}>;


export type ConfirmOrderMutation = { __typename?: 'Mutation', confirmOrder: { __typename?: 'Order', _id: string, status: OrderStatus } };

export type MarkOrderPreparingMutationVariables = Exact<{
  orderId: Scalars['ID']['input'];
}>;


export type MarkOrderPreparingMutation = { __typename?: 'Mutation', markOrderPreparing: { __typename?: 'Order', _id: string, status: OrderStatus } };

export type MarkOrderReadyMutationVariables = Exact<{
  orderId: Scalars['ID']['input'];
}>;


export type MarkOrderReadyMutation = { __typename?: 'Mutation', markOrderReady: { __typename?: 'Order', _id: string, status: OrderStatus } };

export type MarkOrderDeliveredMutationVariables = Exact<{
  orderId: Scalars['ID']['input'];
}>;


export type MarkOrderDeliveredMutation = { __typename?: 'Mutation', markOrderDelivered: { __typename?: 'Order', _id: string, status: OrderStatus } };

export type CompleteOrderMutationVariables = Exact<{
  orderId: Scalars['ID']['input'];
}>;


export type CompleteOrderMutation = { __typename?: 'Mutation', completeOrder: { __typename?: 'Order', _id: string, status: OrderStatus } };

export type UploadPaymentProofMutationVariables = Exact<{
  input: UploadPaymentProofInput;
}>;


export type UploadPaymentProofMutation = { __typename?: 'Mutation', uploadPaymentProof: { __typename?: 'Order', _id: string, paymentProofImages?: Array<string> | null } };

export type RemovePaymentProofImageMutationVariables = Exact<{
  orderId: Scalars['ID']['input'];
  imageUrl: Scalars['String']['input'];
}>;


export type RemovePaymentProofImageMutation = { __typename?: 'Mutation', removePaymentProofImage: { __typename?: 'Order', _id: string, paymentProofImages?: Array<string> | null } };

export type CancelOrderMutationVariables = Exact<{
  orderId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type CancelOrderMutation = { __typename?: 'Mutation', cancelOrder: { __typename?: 'Order', _id: string, status: OrderStatus } };

export type CancelOrderWithRefundMutationVariables = Exact<{
  orderId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
  refundPercent?: InputMaybe<Scalars['Int']['input']>;
  refundNote?: InputMaybe<Scalars['String']['input']>;
}>;


export type CancelOrderWithRefundMutation = { __typename?: 'Mutation', cancelOrderWithRefund: { __typename?: 'Order', _id: string, status: OrderStatus, paymentStatus: OrderPaymentStatus } };

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct: { __typename?: 'Product', _id: string, name: string, price: number, status: ProductStatus } };

export type UpdateProductMutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', updateProduct: { __typename?: 'Product', _id: string, name: string, price: number, status: ProductStatus, stockQuantity: number } };

export type DeleteProductMutationVariables = Exact<{
  productId: Scalars['ID']['input'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct: boolean };

export type PublishProductMutationVariables = Exact<{
  productId: Scalars['ID']['input'];
}>;


export type PublishProductMutation = { __typename?: 'Mutation', publishProduct: { __typename?: 'Product', _id: string, status: ProductStatus } };

export type UnpublishProductMutationVariables = Exact<{
  productId: Scalars['ID']['input'];
}>;


export type UnpublishProductMutation = { __typename?: 'Mutation', unpublishProduct: { __typename?: 'Product', _id: string, status: ProductStatus } };

export type ImportStockMutationVariables = Exact<{
  venueId: Scalars['ID']['input'];
  input: ImportStockInput;
}>;


export type ImportStockMutation = { __typename?: 'Mutation', importStock: { __typename?: 'StockMovement', _id: string, productId: string, quantity: number, importPrice?: number | null, totalCost?: number | null, previousStock: number, newStock: number, createdAt: string } };

export type MoveProductsToVenueMutationVariables = Exact<{
  input: TransferProductsInput;
}>;


export type MoveProductsToVenueMutation = { __typename?: 'Mutation', moveProductsToVenue: { __typename?: 'BulkOperationResult', success: number, failed: Array<string> } };

export type CreateProductCategoryMutationVariables = Exact<{
  input: CreateProductCategoryInput;
}>;


export type CreateProductCategoryMutation = { __typename?: 'Mutation', createProductCategory: { __typename?: 'ProductCategory', _id: string, name: string } };

export type UpdateProductCategoryMutationVariables = Exact<{
  input: UpdateProductCategoryInput;
}>;


export type UpdateProductCategoryMutation = { __typename?: 'Mutation', updateProductCategory: { __typename?: 'ProductCategory', _id: string, name: string } };

export type DeleteProductCategoryMutationVariables = Exact<{
  categoryId: Scalars['ID']['input'];
}>;


export type DeleteProductCategoryMutation = { __typename?: 'Mutation', deleteProductCategory: boolean };

export type CreateStaffBookingMutationVariables = Exact<{
  input: CreateStaffBookingInput;
}>;


export type CreateStaffBookingMutation = { __typename?: 'Mutation', createStaffBooking: { __typename?: 'BookingWithOrderPayload', booking: { __typename?: 'Booking', _id: string, date: string, status: BookingStatus, finalAmount: number, totalPrice: number, discount?: number | null, discountCode?: string | null, isManualPrice: boolean, manualFinalAmount?: number | null, slots: Array<{ __typename?: 'BookedSlot', courtId: string, courtName: string, startTime: string, endTime: string, price: number }>, customer?: { __typename?: 'User', _id: string, displayName: string, phone?: string | null } | null }, order: { __typename?: 'Order', _id: string, orderCode: string, status: OrderStatus, totalAmount: number } } };

export type AddVenueStaffMutationVariables = Exact<{
  venueId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  permissions: Array<VenueAction> | VenueAction;
  customTitle?: InputMaybe<Scalars['String']['input']>;
}>;


export type AddVenueStaffMutation = { __typename?: 'Mutation', addVenueStaff: { __typename?: 'VenueStaff', _id: string, permissions: Array<VenueAction>, status: VenueStaffStatus } };

export type UpdateVenueStaffPermissionsMutationVariables = Exact<{
  venueId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  permissions: Array<VenueAction> | VenueAction;
}>;


export type UpdateVenueStaffPermissionsMutation = { __typename?: 'Mutation', updateVenueStaffPermissions: { __typename?: 'VenueStaff', _id: string, permissions: Array<VenueAction> } };

export type UpdateVenueStaffTitleMutationVariables = Exact<{
  venueId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  customTitle: Scalars['String']['input'];
}>;


export type UpdateVenueStaffTitleMutation = { __typename?: 'Mutation', updateVenueStaffTitle: { __typename?: 'VenueStaff', _id: string, customTitle?: string | null, permissions: Array<VenueAction>, status: VenueStaffStatus } };

export type RemoveVenueStaffMutationVariables = Exact<{
  venueId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
}>;


export type RemoveVenueStaffMutation = { __typename?: 'Mutation', removeVenueStaff: boolean };

export type ProductReportPeriodFieldsFragment = { __typename?: 'ProductReportPeriodInfo', from: string, to: string, timezone: string };

export type ProductReportSummaryFieldsFragment = { __typename?: 'ProductReportSummary', totalRevenue: number, previousRevenue: number, revenueChangePercent: number, totalItemsSold: number, previousItemsSold: number, itemsChangePercent: number, totalOrders: number, previousOrders: number, ordersChangePercent: number, totalCogs: number, previousCogs: number, grossProfit: number, previousGrossProfit: number, grossProfitChangePercent: number, grossProfitMarginPercent: number, uniqueProductsSold: number, previousUniqueProductsSold: number, bestSellingProduct: string, bestSellingCategory: string, peakHour: string, peakDay: string };

export type ProductSalesDataPointFieldsFragment = { __typename?: 'ProductSalesDataPoint', label: string, revenue: number, quantitySold: number, orderCount: number, previousRevenue?: number | null };

export type ProductPerformanceFieldsFragment = { __typename?: 'ProductPerformance', productId: string, productName: string, sku?: string | null, categoryName: string, categoryId: string, quantitySold: number, previousQuantitySold: number, revenue: number, previousRevenue: number, orderCount: number, unitPrice: number, revenuePercentage: number, revenueGrowth: number, quantityGrowth: number, rank: number, imageUrl?: string | null };

export type ProductReportRowFieldsFragment = { __typename?: 'ProductReportRow', productId: string, productName: string, sku?: string | null, imageUrl?: string | null, categoryName: string, categoryId: string, status: ProductStatus, stockQuantity: number, trackInventory: boolean, unitPrice: number, averageCost?: number | null, venueId?: string | null, venueName?: string | null, soldQuantity: number, previousSoldQuantity: number, revenue: number, previousRevenue: number, cogs: number, grossProfit: number, profitMargin: number, revenuePercentage: number, revenueGrowth: number, rank?: number | null };

export type StockMovementSummaryFieldsFragment = { __typename?: 'StockMovement', _id: string, type: StockMovementType, quantity: number, importPrice?: number | null, costAtSale?: number | null, newStock: number, supplierName?: string | null, invoiceNumber?: string | null, note?: string | null, createdAt: string };

export type VenueProductReportQueryVariables = Exact<{
  filter: ProductReportFilterInput;
}>;


export type VenueProductReportQuery = { __typename?: 'Query', venueProductReport: { __typename?: 'VenueProductReport', scope: { __typename?: 'ProductReportScope', mode: ProductReportScopeMode, venueCount: number, venueNames: Array<string>, venueIds?: Array<string> | null }, period: { __typename?: 'ProductReportPeriodInfo', from: string, to: string, timezone: string }, comparePeriod?: { __typename?: 'ProductReportPeriodInfo', from: string, to: string, timezone: string } | null, summary: { __typename?: 'ProductReportSummary', totalRevenue: number, previousRevenue: number, revenueChangePercent: number, totalItemsSold: number, previousItemsSold: number, itemsChangePercent: number, totalOrders: number, previousOrders: number, ordersChangePercent: number, totalCogs: number, previousCogs: number, grossProfit: number, previousGrossProfit: number, grossProfitChangePercent: number, grossProfitMarginPercent: number, uniqueProductsSold: number, previousUniqueProductsSold: number, bestSellingProduct: string, bestSellingCategory: string, peakHour: string, peakDay: string }, trend: Array<{ __typename?: 'ProductSalesDataPoint', label: string, revenue: number, quantitySold: number, orderCount: number, previousRevenue?: number | null }>, salesTrend: Array<{ __typename?: 'ProductSalesDataPoint', label: string, revenue: number, quantitySold: number, orderCount: number, previousRevenue?: number | null }>, topProducts: Array<{ __typename?: 'ProductPerformance', productId: string, productName: string, sku?: string | null, categoryName: string, categoryId: string, quantitySold: number, previousQuantitySold: number, revenue: number, previousRevenue: number, orderCount: number, unitPrice: number, revenuePercentage: number, revenueGrowth: number, quantityGrowth: number, rank: number, imageUrl?: string | null }>, decliningProducts: Array<{ __typename?: 'ProductPerformance', productId: string, productName: string, sku?: string | null, categoryName: string, categoryId: string, quantitySold: number, previousQuantitySold: number, revenue: number, previousRevenue: number, orderCount: number, unitPrice: number, revenuePercentage: number, revenueGrowth: number, quantityGrowth: number, rank: number, imageUrl?: string | null }>, salesByCategory: Array<{ __typename?: 'CategorySalesPerformance', categoryId: string, categoryName: string, revenue: number, quantitySold: number, orderCount: number, percentage: number, growth: number }>, hourlySales: Array<{ __typename?: 'ProductHourlySales', hour: string, revenue: number, quantitySold: number, intensity: number }>, inventory: { __typename?: 'InventoryReport', totalProducts: number, totalStockValue: number, totalCostValue: number, lowStockCount: number, outOfStockCount: number }, inventoryStatus: { __typename?: 'InventoryStatus', activeProducts: number, lowStockProducts: number, outOfStockProducts: number, stockTurnoverRate: number, totalInventoryValue: number, totalProducts: number, totalRetailValue: number }, stockAlerts: Array<{ __typename?: 'StockAlertProduct', productId: string, productName: string, sku?: string | null, imageUrl?: string | null, categoryName: string, currentStock: number, lowStockThreshold?: number | null, alertType: string, recentSales: number }>, profitByProduct: Array<{ __typename?: 'ProductProfitItem', productId: string, productName: string, soldQuantity: number, revenue: number, cogs: number, grossProfit: number, profitMargin: number }>, productsTable: { __typename?: 'ProductReportRowConnection', totalCount: number, edges: Array<{ __typename?: 'ProductReportRowEdge', cursor: string, node: { __typename?: 'ProductReportRow', productId: string, productName: string, sku?: string | null, imageUrl?: string | null, categoryName: string, categoryId: string, status: ProductStatus, stockQuantity: number, trackInventory: boolean, unitPrice: number, averageCost?: number | null, venueId?: string | null, venueName?: string | null, soldQuantity: number, previousSoldQuantity: number, revenue: number, previousRevenue: number, cogs: number, grossProfit: number, profitMargin: number, revenuePercentage: number, revenueGrowth: number, rank?: number | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null } } } };

export type ProductPerformanceReportQueryVariables = Exact<{
  productId: Scalars['ID']['input'];
  filter: ProductReportFilterInput;
}>;


export type ProductPerformanceReportQuery = { __typename?: 'Query', productPerformanceReport: { __typename?: 'ProductPerformanceReport', period: { __typename?: 'ProductReportPeriodInfo', from: string, to: string, timezone: string }, product: { __typename?: 'ProductPerformanceSnapshot', productId: string, productName: string, sku?: string | null, imageUrl?: string | null, categoryName: string, categoryId: string, status: ProductStatus, unit: string, unitPrice: number, averageCost?: number | null, stockQuantity: number, trackInventory: boolean, venueId?: string | null, venueName?: string | null, hasVariants: boolean, variantCount: number }, summary: { __typename?: 'ProductPerformanceReportSummary', soldQuantity: number, previousSoldQuantity: number, revenue: number, previousRevenue: number, cogs: number, grossProfit: number, profitMargin: number, orderCount: number, revenuePercentage: number, rank?: number | null }, trend: Array<{ __typename?: 'ProductSalesDataPoint', label: string, revenue: number, quantitySold: number, orderCount: number, previousRevenue?: number | null }>, recentMovements: Array<{ __typename?: 'StockMovement', _id: string, type: StockMovementType, quantity: number, importPrice?: number | null, costAtSale?: number | null, newStock: number, supplierName?: string | null, invoiceNumber?: string | null, note?: string | null, createdAt: string }>, importHistory: Array<{ __typename?: 'StockMovement', _id: string, type: StockMovementType, quantity: number, importPrice?: number | null, costAtSale?: number | null, newStock: number, supplierName?: string | null, invoiceNumber?: string | null, note?: string | null, createdAt: string }> } };

export type PromotionCoreFragment = { __typename?: 'Promotion', _id: string, venueId: string, name: string, description?: string | null, type: PromotionType, value: number, maxDiscountAmount?: number | null, scope: PromotionScope, courtIds?: Array<string> | null, sportTypes?: Array<SportType> | null, category: PromotionCategory, trigger: PromotionTrigger, code?: string | null, startDate: string, endDate: string, status: PromotionStatus, priority: number, minBookingAmount?: number | null, applyLevel: PromotionApplyLevel, isStackable: boolean, showOnVenueCard: boolean, showAsBanner: boolean, badgeText?: string | null, badgeColor?: string | null, bannerImageUrl?: string | null, usageCount: number, totalUsageLimit?: number | null, perUserLimit?: number | null, createdAt: string, updatedAt: string, applicableTimeRanges?: Array<{ __typename?: 'TimeRange', startTime: string, endTime: string }> | null };

export type PromotionUserBriefFragment = { __typename?: 'User', _id: string, fullName: string, displayName: string, userName: string };

export type AppliedPromotionFragment = { __typename?: 'AppliedPromotion', promotionId: string, name: string, type: PromotionType, category: PromotionCategory, value: number, maxDiscountAmount?: number | null, discountAmount: number, code?: string | null, badgeText?: string | null, applyLevel?: PromotionApplyLevel | null };

export type DiscountCalculationFragment = { __typename?: 'DiscountCalculationResult', originalTotal: number, totalDiscount: number, finalAmount: number, discountPercentage: number, isStacked: boolean, stackingMessage?: string | null, appliedPromotions: Array<{ __typename?: 'AppliedPromotion', promotionId: string, name: string, type: PromotionType, category: PromotionCategory, value: number, maxDiscountAmount?: number | null, discountAmount: number, code?: string | null, badgeText?: string | null, applyLevel?: PromotionApplyLevel | null }>, slotDiscounts?: Array<{ __typename?: 'SlotDiscount', courtId: string, startTime: string, endTime: string, originalPrice: number, discountAmount: number, finalPrice: number }> | null };

export type PromotionDetailExtraFragment = { __typename?: 'Promotion', shortDescription?: string | null, productCategoryIds?: Array<string> | null, displayOrder: number, createdBy: string, reviewedBy?: string | null, reviewedAt?: string | null, rejectionReason?: string | null, isWithinDateRange: boolean, isUsageLimitReached: boolean, remainingUsage?: number | null, createdByUser?: { __typename?: 'User', _id: string, fullName: string, displayName: string, userName: string } | null, reviewedByUser?: { __typename?: 'User', _id: string, fullName: string, displayName: string, userName: string } | null, stackingRules?: { __typename?: 'StackingRules', canStack: boolean, maxStackDiscountPercent?: number | null, maxStackDiscountAmount?: number | null, stackableWithIds?: Array<string> | null, stackableWithCategories?: Array<PromotionCategory> | null } | null };

export type CreatePromotionMutationVariables = Exact<{
  input: CreatePromotionInput;
}>;


export type CreatePromotionMutation = { __typename?: 'Mutation', createPromotion: { __typename?: 'Promotion', _id: string, venueId: string, name: string, description?: string | null, type: PromotionType, value: number, maxDiscountAmount?: number | null, scope: PromotionScope, courtIds?: Array<string> | null, sportTypes?: Array<SportType> | null, category: PromotionCategory, trigger: PromotionTrigger, code?: string | null, startDate: string, endDate: string, status: PromotionStatus, priority: number, minBookingAmount?: number | null, applyLevel: PromotionApplyLevel, isStackable: boolean, showOnVenueCard: boolean, showAsBanner: boolean, badgeText?: string | null, badgeColor?: string | null, bannerImageUrl?: string | null, usageCount: number, totalUsageLimit?: number | null, perUserLimit?: number | null, createdAt: string, updatedAt: string, applicableTimeRanges?: Array<{ __typename?: 'TimeRange', startTime: string, endTime: string }> | null } };

export type UpdatePromotionMutationVariables = Exact<{
  input: UpdatePromotionInput;
}>;


export type UpdatePromotionMutation = { __typename?: 'Mutation', updatePromotion: { __typename?: 'Promotion', _id: string, venueId: string, name: string, description?: string | null, type: PromotionType, value: number, maxDiscountAmount?: number | null, scope: PromotionScope, courtIds?: Array<string> | null, sportTypes?: Array<SportType> | null, category: PromotionCategory, trigger: PromotionTrigger, code?: string | null, startDate: string, endDate: string, status: PromotionStatus, priority: number, minBookingAmount?: number | null, applyLevel: PromotionApplyLevel, isStackable: boolean, showOnVenueCard: boolean, showAsBanner: boolean, badgeText?: string | null, badgeColor?: string | null, bannerImageUrl?: string | null, usageCount: number, totalUsageLimit?: number | null, perUserLimit?: number | null, createdAt: string, updatedAt: string, applicableTimeRanges?: Array<{ __typename?: 'TimeRange', startTime: string, endTime: string }> | null } };

export type SubmitPromotionForApprovalMutationVariables = Exact<{
  promotionId: Scalars['ID']['input'];
}>;


export type SubmitPromotionForApprovalMutation = { __typename?: 'Mutation', submitPromotionForApproval: { __typename?: 'Promotion', _id: string, venueId: string, name: string, description?: string | null, type: PromotionType, value: number, maxDiscountAmount?: number | null, scope: PromotionScope, courtIds?: Array<string> | null, sportTypes?: Array<SportType> | null, category: PromotionCategory, trigger: PromotionTrigger, code?: string | null, startDate: string, endDate: string, status: PromotionStatus, priority: number, minBookingAmount?: number | null, applyLevel: PromotionApplyLevel, isStackable: boolean, showOnVenueCard: boolean, showAsBanner: boolean, badgeText?: string | null, badgeColor?: string | null, bannerImageUrl?: string | null, usageCount: number, totalUsageLimit?: number | null, perUserLimit?: number | null, createdAt: string, updatedAt: string, applicableTimeRanges?: Array<{ __typename?: 'TimeRange', startTime: string, endTime: string }> | null } };

export type ReviewPromotionMutationVariables = Exact<{
  input: ReviewPromotionInput;
}>;


export type ReviewPromotionMutation = { __typename?: 'Mutation', reviewPromotion: { __typename?: 'Promotion', _id: string, venueId: string, name: string, description?: string | null, type: PromotionType, value: number, maxDiscountAmount?: number | null, scope: PromotionScope, courtIds?: Array<string> | null, sportTypes?: Array<SportType> | null, category: PromotionCategory, trigger: PromotionTrigger, code?: string | null, startDate: string, endDate: string, status: PromotionStatus, priority: number, minBookingAmount?: number | null, applyLevel: PromotionApplyLevel, isStackable: boolean, showOnVenueCard: boolean, showAsBanner: boolean, badgeText?: string | null, badgeColor?: string | null, bannerImageUrl?: string | null, usageCount: number, totalUsageLimit?: number | null, perUserLimit?: number | null, createdAt: string, updatedAt: string, applicableTimeRanges?: Array<{ __typename?: 'TimeRange', startTime: string, endTime: string }> | null } };

export type ActivatePromotionMutationVariables = Exact<{
  promotionId: Scalars['ID']['input'];
}>;


export type ActivatePromotionMutation = { __typename?: 'Mutation', activatePromotion: { __typename?: 'Promotion', _id: string, venueId: string, name: string, description?: string | null, type: PromotionType, value: number, maxDiscountAmount?: number | null, scope: PromotionScope, courtIds?: Array<string> | null, sportTypes?: Array<SportType> | null, category: PromotionCategory, trigger: PromotionTrigger, code?: string | null, startDate: string, endDate: string, status: PromotionStatus, priority: number, minBookingAmount?: number | null, applyLevel: PromotionApplyLevel, isStackable: boolean, showOnVenueCard: boolean, showAsBanner: boolean, badgeText?: string | null, badgeColor?: string | null, bannerImageUrl?: string | null, usageCount: number, totalUsageLimit?: number | null, perUserLimit?: number | null, createdAt: string, updatedAt: string, applicableTimeRanges?: Array<{ __typename?: 'TimeRange', startTime: string, endTime: string }> | null } };

export type PausePromotionMutationVariables = Exact<{
  promotionId: Scalars['ID']['input'];
}>;


export type PausePromotionMutation = { __typename?: 'Mutation', pausePromotion: { __typename?: 'Promotion', _id: string, venueId: string, name: string, description?: string | null, type: PromotionType, value: number, maxDiscountAmount?: number | null, scope: PromotionScope, courtIds?: Array<string> | null, sportTypes?: Array<SportType> | null, category: PromotionCategory, trigger: PromotionTrigger, code?: string | null, startDate: string, endDate: string, status: PromotionStatus, priority: number, minBookingAmount?: number | null, applyLevel: PromotionApplyLevel, isStackable: boolean, showOnVenueCard: boolean, showAsBanner: boolean, badgeText?: string | null, badgeColor?: string | null, bannerImageUrl?: string | null, usageCount: number, totalUsageLimit?: number | null, perUserLimit?: number | null, createdAt: string, updatedAt: string, applicableTimeRanges?: Array<{ __typename?: 'TimeRange', startTime: string, endTime: string }> | null } };

export type CancelPromotionMutationVariables = Exact<{
  promotionId: Scalars['ID']['input'];
}>;


export type CancelPromotionMutation = { __typename?: 'Mutation', cancelPromotion: { __typename?: 'Promotion', _id: string, venueId: string, name: string, description?: string | null, type: PromotionType, value: number, maxDiscountAmount?: number | null, scope: PromotionScope, courtIds?: Array<string> | null, sportTypes?: Array<SportType> | null, category: PromotionCategory, trigger: PromotionTrigger, code?: string | null, startDate: string, endDate: string, status: PromotionStatus, priority: number, minBookingAmount?: number | null, applyLevel: PromotionApplyLevel, isStackable: boolean, showOnVenueCard: boolean, showAsBanner: boolean, badgeText?: string | null, badgeColor?: string | null, bannerImageUrl?: string | null, usageCount: number, totalUsageLimit?: number | null, perUserLimit?: number | null, createdAt: string, updatedAt: string, applicableTimeRanges?: Array<{ __typename?: 'TimeRange', startTime: string, endTime: string }> | null } };

export type DeletePromotionMutationVariables = Exact<{
  promotionId: Scalars['ID']['input'];
}>;


export type DeletePromotionMutation = { __typename?: 'Mutation', deletePromotion: boolean };

export type VenuePromotionsConnectionQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  filter?: InputMaybe<PromotionFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<PromotionSortInput>;
}>;


export type VenuePromotionsConnectionQuery = { __typename?: 'Query', venuePromotionsConnection: { __typename?: 'PromotionConnection', totalCount: number, edges: Array<{ __typename?: 'PromotionEdge', cursor: string, node: { __typename?: 'Promotion', _id: string, venueId: string, name: string, description?: string | null, type: PromotionType, value: number, maxDiscountAmount?: number | null, scope: PromotionScope, courtIds?: Array<string> | null, sportTypes?: Array<SportType> | null, category: PromotionCategory, trigger: PromotionTrigger, code?: string | null, startDate: string, endDate: string, status: PromotionStatus, priority: number, minBookingAmount?: number | null, applyLevel: PromotionApplyLevel, isStackable: boolean, showOnVenueCard: boolean, showAsBanner: boolean, badgeText?: string | null, badgeColor?: string | null, bannerImageUrl?: string | null, usageCount: number, totalUsageLimit?: number | null, perUserLimit?: number | null, createdAt: string, updatedAt: string, applicableTimeRanges?: Array<{ __typename?: 'TimeRange', startTime: string, endTime: string }> | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type GetPromotionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPromotionQuery = { __typename?: 'Query', promotion: { __typename?: 'Promotion', _id: string, venueId: string, name: string, description?: string | null, type: PromotionType, value: number, maxDiscountAmount?: number | null, scope: PromotionScope, courtIds?: Array<string> | null, sportTypes?: Array<SportType> | null, category: PromotionCategory, trigger: PromotionTrigger, code?: string | null, startDate: string, endDate: string, status: PromotionStatus, priority: number, minBookingAmount?: number | null, applyLevel: PromotionApplyLevel, isStackable: boolean, showOnVenueCard: boolean, showAsBanner: boolean, badgeText?: string | null, badgeColor?: string | null, bannerImageUrl?: string | null, usageCount: number, totalUsageLimit?: number | null, perUserLimit?: number | null, createdAt: string, updatedAt: string, shortDescription?: string | null, productCategoryIds?: Array<string> | null, displayOrder: number, createdBy: string, reviewedBy?: string | null, reviewedAt?: string | null, rejectionReason?: string | null, isWithinDateRange: boolean, isUsageLimitReached: boolean, remainingUsage?: number | null, applicableTimeRanges?: Array<{ __typename?: 'TimeRange', startTime: string, endTime: string }> | null, createdByUser?: { __typename?: 'User', _id: string, fullName: string, displayName: string, userName: string } | null, reviewedByUser?: { __typename?: 'User', _id: string, fullName: string, displayName: string, userName: string } | null, stackingRules?: { __typename?: 'StackingRules', canStack: boolean, maxStackDiscountPercent?: number | null, maxStackDiscountAmount?: number | null, stackableWithIds?: Array<string> | null, stackableWithCategories?: Array<PromotionCategory> | null } | null } };

export type GetPromotionStatsQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
}>;


export type GetPromotionStatsQuery = { __typename?: 'Query', promotionStats: { __typename?: 'PromotionStats', total: number, active: number, pendingApproval: number, draft: number, paused: number, expired: number, cancelled: number, totalUsage: number, totalDiscountGiven: number } };

export type ValidateOrderPromoCodeQueryVariables = Exact<{
  input: ValidateOrderPromoCodeInput;
}>;


export type ValidateOrderPromoCodeQuery = { __typename?: 'Query', validateOrderPromoCode: { __typename?: 'PromoCodeValidationResult', isValid: boolean, errorMessage?: string | null, estimatedDiscount?: number | null, promotion?: { __typename?: 'Promotion', _id: string, code?: string | null, name: string, type: PromotionType, value: number, maxDiscountAmount?: number | null } | null } };

export type VenueSummaryFieldsFragment = { __typename?: 'Venue', _id: string, name: string, status: VenueStatus, courtCount: number, isOwner: boolean, isStaff: boolean, myPermissions?: Array<VenueAction> | null, location: { __typename?: 'VenueLocation', address: string, city?: string | null } };

export type GetMyVenuesStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyVenuesStatsQuery = { __typename?: 'Query', myVenuesStats: { __typename?: 'MyVenuesStats', totalVenues: number, todayBookings: number, totalRevenue: number } };

export type MyVenuesConnectionQueryVariables = Exact<{
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type MyVenuesConnectionQuery = { __typename?: 'Query', myVenuesConnection: { __typename?: 'VenueConnection', totalCount: number, edges: Array<{ __typename?: 'VenueEdge', cursor: string, node: { __typename?: 'Venue', _id: string, name: string, status: VenueStatus, courtCount: number, isOwner: boolean, isStaff: boolean, myPermissions?: Array<VenueAction> | null, location: { __typename?: 'VenueLocation', address: string, city?: string | null } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export type StaffedVenuesConnectionQueryVariables = Exact<{
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type StaffedVenuesConnectionQuery = { __typename?: 'Query', staffedVenuesConnection: { __typename?: 'VenueConnection', totalCount: number, edges: Array<{ __typename?: 'VenueEdge', cursor: string, node: { __typename?: 'Venue', _id: string, name: string, status: VenueStatus, courtCount: number, isOwner: boolean, isStaff: boolean, myPermissions?: Array<VenueAction> | null, location: { __typename?: 'VenueLocation', address: string, city?: string | null } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export type GetVenueDetailQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
}>;


export type GetVenueDetailQuery = { __typename?: 'Query', venue: { __typename?: 'Venue', _id: string, name: string, description?: string | null, status: VenueStatus, phoneNumber?: string | null, email?: string | null, courtCount: number, coverImageUrl?: string | null, images?: Array<string> | null, isOwner: boolean, isStaff: boolean, myPermissions?: Array<VenueAction> | null, recurringBookingEnabled: boolean, slotDurationMinutes: number, operatingHours: Array<{ __typename?: 'OperatingHours', dayOfWeek: number, openTime: string, closeTime: string, isClosed: boolean, is24Hours?: boolean | null }>, location: { __typename?: 'VenueLocation', address: string, city?: string | null, district?: string | null, latitude?: number | null, longitude?: number | null }, orderTypeConfigs?: Array<{ __typename?: 'VenueOrderTypeConfig', orderType: OrderType, isEnabled: boolean, label?: string | null, icon?: string | null, color?: string | null, displayOrder: number }> | null, marginThresholds?: { __typename?: 'VenueMarginThresholds', warningMargin: number, dangerMargin: number } | null } };

export type VenuesConnectionQueryVariables = Exact<{
  filter?: InputMaybe<VenueFilterInput>;
  sort?: InputMaybe<VenueSortInput>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type VenuesConnectionQuery = { __typename?: 'Query', venuesConnection: { __typename?: 'VenueConnection', totalCount: number, edges: Array<{ __typename?: 'VenueEdge', cursor: string, node: { __typename?: 'Venue', _id: string, name: string, status: VenueStatus, courtCount: number, isOwner: boolean, isStaff: boolean, myPermissions?: Array<VenueAction> | null, location: { __typename?: 'VenueLocation', address: string, city?: string | null } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export type VenueCourtsConnectionQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  sort?: InputMaybe<CursorSortInput>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type VenueCourtsConnectionQuery = { __typename?: 'Query', venueCourtsConnection: { __typename?: 'CourtConnection', totalCount: number, edges: Array<{ __typename?: 'CourtEdge', cursor: string, node: { __typename?: 'Court', _id: string, name: string, sportType: SportType, status: CourtStatus, defaultPricePerHour: number, peakPricePerHour: number, displayOrder: number } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export type VenueBookingsConnectionQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  filter?: InputMaybe<BookingFilterInput>;
  sort?: InputMaybe<BookingSortInput>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type VenueBookingsConnectionQuery = { __typename?: 'Query', venueBookingsConnection: { __typename?: 'BookingConnection', totalCount: number, edges: Array<{ __typename?: 'BookingEdge', cursor: string, node: { __typename?: 'Booking', _id: string, date: string, status: BookingStatus, source: BookingSource, isRecurring: boolean, parentBookingId?: string | null, totalPrice: number, finalAmount: number, paymentMethod?: PaymentMethod | null, internalNote?: string | null, holdExpiresAt?: string | null, customerDisplayName?: string | null, customerDisplayPhone?: string | null, recurringConfig?: { __typename?: 'RecurringConfig', frequency: RecurringFrequency, endDate: string, totalSessions: number, durationMonths: number } | null, slots: Array<{ __typename?: 'BookedSlot', courtId: string, courtName: string, startTime: string, endTime: string, price: number }>, customerInfo?: { __typename?: 'CustomerInfo', name: string, phone: string } | null, customer?: { __typename?: 'User', _id: string, displayName: string, phone?: string | null } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export type GetBookingQueryVariables = Exact<{
  bookingId: Scalars['ID']['input'];
}>;


export type GetBookingQuery = { __typename?: 'Query', booking: { __typename?: 'Booking', _id: string, date: string, status: BookingStatus, source: BookingSource, isRecurring: boolean, parentBookingId?: string | null, sessionNumber?: number | null, totalPrice: number, serviceFee?: number | null, discount?: number | null, finalAmount: number, isManualPrice: boolean, manualPriceNote?: string | null, paymentMethod?: PaymentMethod | null, customerNote?: string | null, internalNote?: string | null, discountCode?: string | null, confirmedAt?: string | null, checkedInAt?: string | null, checkedOutAt?: string | null, cancelledAt?: string | null, cancellationReason?: string | null, holdExpiresAt?: string | null, createdAt: string, slots: Array<{ __typename?: 'BookedSlot', courtId: string, courtName: string, startTime: string, endTime: string, price: number, isPeakHour: boolean }>, customer?: { __typename?: 'User', _id: string, displayName: string, phone?: string | null, email?: string | null } | null, customerInfo?: { __typename?: 'CustomerInfo', name: string, phone: string, email?: string | null } | null, venue?: { __typename?: 'Venue', _id: string, name: string } | null, recurringConfig?: { __typename?: 'RecurringConfig', frequency: RecurringFrequency, totalSessions: number, endDate: string } | null, parentBooking?: { __typename?: 'Booking', _id: string, date: string } | null } };

export type VenueHoldBookingsConnectionQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  sort?: InputMaybe<BookingSortInput>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type VenueHoldBookingsConnectionQuery = { __typename?: 'Query', venueHoldBookingsConnection: { __typename?: 'BookingConnection', totalCount: number, edges: Array<{ __typename?: 'BookingEdge', cursor: string, node: { __typename?: 'Booking', _id: string, date: string, status: BookingStatus, holdExpiresAt?: string | null, customerDisplayName?: string | null, customerDisplayPhone?: string | null, slots: Array<{ __typename?: 'BookedSlot', courtName: string, startTime: string, endTime: string }>, customerInfo?: { __typename?: 'CustomerInfo', name: string, phone: string } | null, customer?: { __typename?: 'User', _id: string, displayName: string } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export type VenueRecurringBookingsConnectionQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  sort?: InputMaybe<BookingSortInput>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type VenueRecurringBookingsConnectionQuery = { __typename?: 'Query', venueRecurringBookingsConnection: { __typename?: 'BookingConnection', totalCount: number, edges: Array<{ __typename?: 'BookingEdge', cursor: string, node: { __typename?: 'Booking', _id: string, date: string, status: BookingStatus, customerDisplayName?: string | null, customerDisplayPhone?: string | null, recurringConfig?: { __typename?: 'RecurringConfig', frequency: RecurringFrequency, endDate: string, totalSessions: number, durationMonths: number } | null, customerInfo?: { __typename?: 'CustomerInfo', name: string, phone: string } | null, customer?: { __typename?: 'User', _id: string, displayName: string } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export type VenueOrdersConnectionQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  filter?: InputMaybe<OrderFilterInput>;
  sort?: InputMaybe<OrderSortInput>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type VenueOrdersConnectionQuery = { __typename?: 'Query', venueOrdersConnection: { __typename?: 'OrderConnection', totalCount: number, edges: Array<{ __typename?: 'OrderEdge', cursor: string, node: { __typename?: 'Order', _id: string, orderCode: string, status: OrderStatus, paymentStatus: OrderPaymentStatus, orderType: OrderType, totalAmount: number, customerName?: string | null, customerPhone?: string | null, createdAt: string, items: Array<{ __typename?: 'OrderItem', itemType: OrderItemType, quantity: number, unitPrice: number, productName: string }> } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export type GetOrderQueryVariables = Exact<{
  orderId: Scalars['ID']['input'];
}>;


export type GetOrderQuery = { __typename?: 'Query', order: { __typename?: 'Order', _id: string, orderCode: string, orderType: OrderType, status: OrderStatus, paymentStatus: OrderPaymentStatus, paymentMethod?: PaymentMethod | null, customerName?: string | null, customerPhone?: string | null, courtNumber?: string | null, tableNumber?: string | null, subtotal: number, discount?: number | null, discountCode?: string | null, serviceFee?: number | null, tax?: number | null, totalAmount: number, paidAmount?: number | null, paymentProofImages?: Array<string> | null, note?: string | null, internalNote?: string | null, isManualPrice: boolean, manualPriceNote?: string | null, cancellationReason?: string | null, cancelledAt?: string | null, confirmedAt?: string | null, inProgressAt?: string | null, readyAt?: string | null, deliveredAt?: string | null, completedAt?: string | null, paidAt?: string | null, createdAt: string, customerInfo?: { __typename?: 'OrderCustomerInfo', name: string, phone?: string | null, email?: string | null } | null, items: Array<{ __typename?: 'OrderItem', productName: string, itemType: OrderItemType, quantity: number, unitPrice: number, totalPrice: number, note?: string | null }>, refundInfo?: { __typename?: 'RefundInfo', refundAmount: number, refundPercent: number, refundReason: string, refundNote?: string | null, refundRequestedAt: string, refundCompletedAt?: string | null } | null } };

export type OrdersPendingRefundConnectionQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type OrdersPendingRefundConnectionQuery = { __typename?: 'Query', ordersPendingRefundConnection: { __typename?: 'OrderConnection', totalCount: number, edges: Array<{ __typename?: 'OrderEdge', cursor: string, node: { __typename?: 'Order', _id: string, orderCode: string, status: OrderStatus, paymentStatus: OrderPaymentStatus, totalAmount: number, customerName?: string | null, createdAt: string, refundInfo?: { __typename?: 'RefundInfo', refundAmount: number } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export type VenueProductsConnectionQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  filter?: InputMaybe<ProductFilterInput>;
  sort?: InputMaybe<ProductSortInput>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type VenueProductsConnectionQuery = { __typename?: 'Query', venueProductsConnection: { __typename?: 'ProductConnection', totalCount: number, edges: Array<{ __typename?: 'ProductEdge', cursor: string, node: { __typename?: 'Product', _id: string, name: string, sku?: string | null, unit?: string | null, price: number, averageCost?: number | null, status: ProductStatus, stockQuantity: number, trackInventory: boolean, lowStockThreshold?: number | null, lastImportPrice?: number | null, totalImportValue?: number | null, totalImportQuantity?: number | null, category?: { __typename?: 'ProductCategory', _id: string, name: string } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export type LowStockProductsQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
}>;


export type LowStockProductsQuery = { __typename?: 'Query', lowStockProducts: Array<{ __typename?: 'Product', _id: string, name: string, stockQuantity: number, lowStockThreshold?: number | null }> };

export type ProductStatsQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
}>;


export type ProductStatsQuery = { __typename?: 'Query', productStats: { __typename?: 'ProductStats', totalProducts: number, activeProducts: number, outOfStockProducts: number, lowStockProducts: number } };

export type ProductSalesAnalyticsQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  period?: InputMaybe<Scalars['String']['input']>;
}>;


export type ProductSalesAnalyticsQuery = { __typename?: 'Query', productSalesAnalytics: { __typename?: 'ProductSalesAnalytics', period: string, summary: { __typename?: 'ProductAnalyticsSummary', totalRevenue: number, totalItemsSold: number, totalOrders: number, bestSellingProduct: string, revenueChangePercent: number, itemsChangePercent: number }, salesTrend: Array<{ __typename?: 'ProductSalesDataPoint', label: string, revenue: number, quantitySold: number, orderCount: number }>, topProducts: Array<{ __typename?: 'ProductPerformance', productId: string, productName: string, categoryName: string, quantitySold: number, revenue: number, revenuePercentage: number }> } };

export type VenueCategoriesConnectionQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  sort?: InputMaybe<CursorSortInput>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type VenueCategoriesConnectionQuery = { __typename?: 'Query', venueCategoriesConnection: { __typename?: 'ProductCategoryConnection', totalCount: number, edges: Array<{ __typename?: 'ProductCategoryEdge', cursor: string, node: { __typename?: 'ProductCategory', _id: string, name: string, slug: string, displayOrder: number, productCount: number } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export type VenueStaffConnectionQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  sort?: InputMaybe<CursorSortInput>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type VenueStaffConnectionQuery = { __typename?: 'Query', venueStaffConnection: { __typename?: 'VenueStaffConnection', totalCount: number, edges: Array<{ __typename?: 'VenueStaffEdge', cursor: string, node: { __typename?: 'VenueStaff', _id: string, isOwner: boolean, permissions: Array<VenueAction>, status: VenueStaffStatus, customTitle?: string | null, joinedAt?: string | null, user?: { __typename?: 'User', _id: string, displayName: string, phone?: string | null, email?: string | null } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export type VenuePendingInvitationsQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
}>;


export type VenuePendingInvitationsQuery = { __typename?: 'Query', venuePendingInvitations: Array<{ __typename?: 'VenueStaff', _id: string, isOwner: boolean, permissions: Array<VenueAction>, status: VenueStaffStatus, customTitle?: string | null, user?: { __typename?: 'User', _id: string, displayName: string, phone?: string | null, email?: string | null } | null }> };

export type VenueRevenueStatsQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  period?: InputMaybe<Scalars['String']['input']>;
}>;


export type VenueRevenueStatsQuery = { __typename?: 'Query', venueRevenueStats: { __typename?: 'VenueRevenueStats', period: string, startDate: string, endDate: string, growthPercentage: number, totalCollectedRevenue: number, totalExpectedRevenue: number, bookingRevenue: { __typename?: 'RevenueBreakdown', collectedRevenue: number, expectedRevenue: number }, orderRevenue: { __typename?: 'RevenueBreakdown', collectedRevenue: number, expectedRevenue: number } } };

export type BookingStatsQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  fromDate?: InputMaybe<Scalars['String']['input']>;
  toDate?: InputMaybe<Scalars['String']['input']>;
}>;


export type BookingStatsQuery = { __typename?: 'Query', bookingStats: { __typename?: 'BookingStats', totalBookings: number, pendingBookings: number, confirmedBookings: number, completedBookings: number, cancelledBookings: number, todayBookings: number } };

export type OrderStatsQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  fromDate?: InputMaybe<Scalars['String']['input']>;
  toDate?: InputMaybe<Scalars['String']['input']>;
}>;


export type OrderStatsQuery = { __typename?: 'Query', orderStats: { __typename?: 'OrderStats', totalOrders: number, pendingOrders: number, completedOrders: number, cancelledOrders: number, todayOrders: number, totalRevenue: number, todayRevenue: number } };

export type OrderAnalyticsQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  period?: InputMaybe<Scalars['String']['input']>;
}>;


export type OrderAnalyticsQuery = { __typename?: 'Query', orderAnalytics: { __typename?: 'OrderAnalytics', period: string, summary: { __typename?: 'OrderAnalyticsSummary', totalOrders: number, totalRevenue: number, averageOrderValue: number, revenueChangePercent: number }, revenueTrend: Array<{ __typename?: 'OrderRevenueDataPoint', label: string, value: number }>, topProducts: Array<{ __typename?: 'TopSellingProduct', productName: string, revenue: number, quantitySold: number }> } };

export type VenueAnalyticsQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  period?: InputMaybe<Scalars['String']['input']>;
}>;


export type VenueAnalyticsQuery = { __typename?: 'Query', venueAnalytics: { __typename?: 'VenueAnalytics', period: string, summary: { __typename?: 'AnalyticsSummary', totalBookings: number, totalRevenue: number, averageBookingValue: number, revenueChangePercent: number, peakDay: string, peakHour: string }, revenueTrend: Array<{ __typename?: 'RevenueDataPoint', label: string, value: number }>, bookingDistribution: Array<{ __typename?: 'BookingDistribution', label: string, value: number }>, heatMapData: Array<{ __typename?: 'HeatMapCell', hour: string, day: string, bookings: number, intensity: number }> } };

export type MyVenuesForProductTransferQueryVariables = Exact<{ [key: string]: never; }>;


export type MyVenuesForProductTransferQuery = { __typename?: 'Query', myVenuesForProductTransfer: Array<{ __typename?: 'Venue', _id: string, name: string, coverImageUrl?: string | null }> };

export type GetMyVenueAvailabilityQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
  date: Scalars['String']['input'];
}>;


export type GetMyVenueAvailabilityQuery = { __typename?: 'Query', myVenueAvailability: { __typename?: 'VenueAvailability', date: string, courts: Array<{ __typename?: 'CourtAvailability', courtId: string, courtName: string, sportType: SportType, courtStatus?: CourtStatus | null, slots: Array<{ __typename?: 'TimeSlotAvailability', startTime: string, endTime: string, price: number, isPeakHour: boolean, isAvailable: boolean, isPast: boolean, isHold?: boolean | null, holdBookingId?: string | null, bookingId?: string | null, bookingStatus?: string | null, customerName?: string | null, customerPhone?: string | null, isRecurring?: boolean | null }> }> } };

export type LookupCustomerByPhoneQueryVariables = Exact<{
  phone: Scalars['String']['input'];
}>;


export type LookupCustomerByPhoneQuery = { __typename?: 'Query', lookupCustomerByPhone?: { __typename?: 'CustomerLookup', _id: string, displayName?: string | null, phone?: string | null, email?: string | null } | null };

export type GetVenueEnabledOrderTypesQueryVariables = Exact<{
  venueId: Scalars['ID']['input'];
}>;


export type GetVenueEnabledOrderTypesQuery = { __typename?: 'Query', venue: { __typename?: 'Venue', _id: string, name: string, hasOrderService: boolean, enabledOrderTypes: Array<{ __typename?: 'VenueOrderTypeConfig', orderType: OrderType, isEnabled: boolean, label?: string | null, icon?: string | null, color?: string | null, displayOrder: number }> } };

export type CampaignFieldsFragment = { __typename?: 'PickupGameCampaign', _id: string, name: string, description?: string | null, hostId: string, venueIds?: Array<string> | null, sportTypes?: Array<string> | null, targetSkillLevels?: Array<string> | null, gameIds?: Array<string> | null, startDate?: string | null, endDate?: string | null, isActive: boolean, createdAt: string, updatedAt: string, goals?: { __typename?: 'CampaignGoals', targetCheckIns?: number | null, targetUniqueUsers?: number | null, targetFillRate?: number | null } | null };

export type CreatePickupGameCampaignMutationVariables = Exact<{
  input: CreatePickupGameCampaignInput;
}>;


export type CreatePickupGameCampaignMutation = { __typename?: 'Mutation', createPickupGameCampaign: { __typename?: 'PickupGameCampaign', _id: string, name: string, description?: string | null, hostId: string, venueIds?: Array<string> | null, sportTypes?: Array<string> | null, targetSkillLevels?: Array<string> | null, gameIds?: Array<string> | null, startDate?: string | null, endDate?: string | null, isActive: boolean, createdAt: string, updatedAt: string, goals?: { __typename?: 'CampaignGoals', targetCheckIns?: number | null, targetUniqueUsers?: number | null, targetFillRate?: number | null } | null } };

export type UpdatePickupGameCampaignMutationVariables = Exact<{
  campaignId: Scalars['ID']['input'];
  input: UpdatePickupGameCampaignInput;
}>;


export type UpdatePickupGameCampaignMutation = { __typename?: 'Mutation', updatePickupGameCampaign: { __typename?: 'PickupGameCampaign', _id: string, name: string, description?: string | null, hostId: string, venueIds?: Array<string> | null, sportTypes?: Array<string> | null, targetSkillLevels?: Array<string> | null, gameIds?: Array<string> | null, startDate?: string | null, endDate?: string | null, isActive: boolean, createdAt: string, updatedAt: string, goals?: { __typename?: 'CampaignGoals', targetCheckIns?: number | null, targetUniqueUsers?: number | null, targetFillRate?: number | null } | null } };

export type AddGamesToCampaignMutationVariables = Exact<{
  input: AddGamesToCampaignInput;
}>;


export type AddGamesToCampaignMutation = { __typename?: 'Mutation', addGamesToCampaign: { __typename?: 'PickupGameCampaign', _id: string, name: string, description?: string | null, hostId: string, venueIds?: Array<string> | null, sportTypes?: Array<string> | null, targetSkillLevels?: Array<string> | null, gameIds?: Array<string> | null, startDate?: string | null, endDate?: string | null, isActive: boolean, createdAt: string, updatedAt: string, goals?: { __typename?: 'CampaignGoals', targetCheckIns?: number | null, targetUniqueUsers?: number | null, targetFillRate?: number | null } | null } };

export type RemoveGamesFromCampaignMutationVariables = Exact<{
  input: RemoveGamesFromCampaignInput;
}>;


export type RemoveGamesFromCampaignMutation = { __typename?: 'Mutation', removeGamesFromCampaign: { __typename?: 'PickupGameCampaign', _id: string, name: string, description?: string | null, hostId: string, venueIds?: Array<string> | null, sportTypes?: Array<string> | null, targetSkillLevels?: Array<string> | null, gameIds?: Array<string> | null, startDate?: string | null, endDate?: string | null, isActive: boolean, createdAt: string, updatedAt: string, goals?: { __typename?: 'CampaignGoals', targetCheckIns?: number | null, targetUniqueUsers?: number | null, targetFillRate?: number | null } | null } };

export type MyCampaignsQueryVariables = Exact<{
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type MyCampaignsQuery = { __typename?: 'Query', myCampaigns: Array<{ __typename?: 'PickupGameCampaign', _id: string, name: string, description?: string | null, hostId: string, venueIds?: Array<string> | null, sportTypes?: Array<string> | null, targetSkillLevels?: Array<string> | null, gameIds?: Array<string> | null, startDate?: string | null, endDate?: string | null, isActive: boolean, createdAt: string, updatedAt: string, goals?: { __typename?: 'CampaignGoals', targetCheckIns?: number | null, targetUniqueUsers?: number | null, targetFillRate?: number | null } | null }> };

export type PickupGameCampaignQueryVariables = Exact<{
  campaignId: Scalars['ID']['input'];
}>;


export type PickupGameCampaignQuery = { __typename?: 'Query', pickupGameCampaign?: { __typename?: 'PickupGameCampaign', _id: string, name: string, description?: string | null, hostId: string, venueIds?: Array<string> | null, sportTypes?: Array<string> | null, targetSkillLevels?: Array<string> | null, gameIds?: Array<string> | null, startDate?: string | null, endDate?: string | null, isActive: boolean, createdAt: string, updatedAt: string, goals?: { __typename?: 'CampaignGoals', targetCheckIns?: number | null, targetUniqueUsers?: number | null, targetFillRate?: number | null } | null } | null };

export type CampaignStatsQueryVariables = Exact<{
  campaignId: Scalars['ID']['input'];
}>;


export type CampaignStatsQuery = { __typename?: 'Query', campaignStats: { __typename?: 'CampaignStats', totalGames: number, totalSlots: number, totalCheckIns: number, uniqueParticipants: number, avgFillRate: number, returnRate: number, avgCheckInDeltaMinutes?: number | null, qrScanCount: number, manualCount: number, bulkCount: number, checkInsByGame: Array<{ __typename?: 'CheckInByGame', gameId: string, gameName: string, sportType?: string | null, date?: string | null, venueName?: string | null, maxSlots: number, checkIns: number, fillRate: number, qrScanCount: number, manualCount: number, bulkCount: number }>, checkInsByDate: Array<{ __typename?: 'CheckInByDate', date: string, count: number }>, topParticipants: Array<{ __typename?: 'TopCampaignParticipant', userId: string, displayName: string, avatarUrl?: string | null, gamesJoined: number, gamesCheckedIn: number, attendanceRate: number }> } };

export type GrantPortalCapabilityMutationVariables = Exact<{
  input: GrantPortalCapabilityInput;
}>;


export type GrantPortalCapabilityMutation = { __typename?: 'Mutation', grantPortalCapability: { __typename?: 'PortalCapabilityGrant', _id: string, userId: string, capability: PortalCapability, reason: string, enabled: boolean, grantedAt?: string | null } };

export type RevokePortalCapabilityMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RevokePortalCapabilityMutation = { __typename?: 'Mutation', revokePortalCapability: { __typename?: 'PortalCapabilityGrant', _id: string, enabled: boolean, revokedAt?: string | null } };

export type PortalCapabilityGrantsConnectionQueryVariables = Exact<{
  pagination?: InputMaybe<CursorPageInput>;
  filter?: InputMaybe<PortalCapabilityGrantFilterInput>;
  sort?: InputMaybe<CursorSortInput>;
}>;


export type PortalCapabilityGrantsConnectionQuery = { __typename?: 'Query', portalCapabilityGrantsConnection: { __typename?: 'PortalCapabilityGrantConnection', totalCount: number, edges: Array<{ __typename?: 'PortalCapabilityGrantEdge', node: { __typename?: 'PortalCapabilityGrant', _id: string, userId: string, userDisplayName: string, userRole: UserRole, capability: PortalCapability, reason: string, enabled: boolean, grantedAt?: string | null, revokedAt?: string | null, createdAt: string } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export type CreateQrCampaignMutationVariables = Exact<{
  input: CreateQrCampaignInput;
}>;


export type CreateQrCampaignMutation = { __typename?: 'Mutation', createQrCampaign: { __typename?: 'QrCampaign', _id: string, slug: string, name: string, description?: string | null, location?: string | null, isActive: boolean, totalScans: number, expiresAt?: string | null, createdAt: string } };

export type UpdateQrCampaignMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateQrCampaignInput;
}>;


export type UpdateQrCampaignMutation = { __typename?: 'Mutation', updateQrCampaign: { __typename?: 'QrCampaign', _id: string, slug: string, name: string, description?: string | null, location?: string | null, isActive: boolean, expiresAt?: string | null, updatedAt: string } };

export type ToggleQrCampaignMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  isActive: Scalars['Boolean']['input'];
}>;


export type ToggleQrCampaignMutation = { __typename?: 'Mutation', toggleQrCampaign: { __typename?: 'QrCampaign', _id: string, isActive: boolean, updatedAt: string } };

export type GetQrCampaignsQueryVariables = Exact<{
  filter?: InputMaybe<QrCampaignFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type GetQrCampaignsQuery = { __typename?: 'Query', qrCampaignsConnection: { __typename?: 'QrCampaignConnection', totalCount: number, edges: Array<{ __typename?: 'QrCampaignEdge', cursor: string, node: { __typename?: 'QrCampaign', _id: string, slug: string, name: string, description?: string | null, location?: string | null, isActive: boolean, totalScans: number, uniqueDevices: number, iosScans: number, androidScans: number, unknownScans: number, expiresAt?: string | null, createdAt: string, updatedAt: string } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type GetQrCampaignQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetQrCampaignQuery = { __typename?: 'Query', getQrCampaign: { __typename?: 'QrCampaign', _id: string, slug: string, name: string, description?: string | null, location?: string | null, isActive: boolean, totalScans: number, uniqueDevices: number, iosScans: number, androidScans: number, unknownScans: number, expiresAt?: string | null, createdAt: string, updatedAt: string } };

export type GetQrCampaignStatsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  filter?: InputMaybe<QrCampaignFilterInput>;
}>;


export type GetQrCampaignStatsQuery = { __typename?: 'Query', getQrCampaignStats: { __typename?: 'QrCampaignStats', totalScans: number, uniqueDevices: number, iosScans: number, androidScans: number, unknownScans: number, iosPercentage: number, androidPercentage: number, trend: Array<{ __typename?: 'QrScanTrendPoint', label: string, total: number, ios: number, android: number }>, topCities: Array<{ __typename?: 'QrTopCity', city: string, country?: string | null, scans: number }> } };

export type GetQrAnalyticsSummaryQueryVariables = Exact<{
  filter?: InputMaybe<QrCampaignFilterInput>;
}>;


export type GetQrAnalyticsSummaryQuery = { __typename?: 'Query', getQrAnalyticsSummary: { __typename?: 'QrAnalyticsSummary', totalScans: number, activeCampaigns: number, uniqueDevices: number, iosPercentage: number, androidPercentage: number, trend: Array<{ __typename?: 'QrScanTrendPoint', label: string, total: number, ios: number, android: number }> } };

export type GenerateQrCodeQueryVariables = Exact<{
  campaignId: Scalars['ID']['input'];
}>;


export type GenerateQrCodeQuery = { __typename?: 'Query', generateQrCode: string };

export type CreateReferralCodeMutationVariables = Exact<{
  input: CreateReferralCodeInput;
}>;


export type CreateReferralCodeMutation = { __typename?: 'Mutation', createReferralCode: { __typename?: 'ReferralCode', _id: string, code: string, ownerId: string, ownerName: string, ownerRole?: string | null, isActive: boolean, maxUses?: number | null, currentUses: number, totalSignups: number, totalActiveUsers: number, totalRevenue: number, expiresAt?: string | null, createdAt: string } };

export type ToggleReferralCodeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  isActive: Scalars['Boolean']['input'];
}>;


export type ToggleReferralCodeMutation = { __typename?: 'Mutation', toggleReferralCode: { __typename?: 'ReferralCode', _id: string, code: string, isActive: boolean, updatedAt: string } };

export type GetGrowthStatsQueryVariables = Exact<{
  filter?: InputMaybe<ReferralFilterInput>;
}>;


export type GetGrowthStatsQuery = { __typename?: 'Query', getGrowthStats: { __typename?: 'GrowthStats', totalNewUsers: number, partnerReferred: number, partnerPercentage: number, activationRate: number, totalRevenue: number, trend: Array<{ __typename?: 'GrowthTrendPoint', label: string, organic: number, partner: number }> } };

export type GetPartnerLeaderboardQueryVariables = Exact<{
  filter?: InputMaybe<ReferralFilterInput>;
}>;


export type GetPartnerLeaderboardQuery = { __typename?: 'Query', getPartnerLeaderboard: { __typename?: 'PartnerLeaderboard', totalCodes: number, items: Array<{ __typename?: 'PartnerLeaderboardItem', partnerId: string, partnerName: string, avatarUrl?: string | null, role?: string | null, referralCode: string, totalSignups: number, activationRate: number, totalRevenue: number, trend: string }> } };

export type GetReferralCodesQueryVariables = Exact<{
  filter?: InputMaybe<ReferralFilterInput>;
}>;


export type GetReferralCodesQuery = { __typename?: 'Query', getReferralCodes: Array<{ __typename?: 'ReferralCode', _id: string, code: string, ownerId: string, ownerName: string, ownerRole?: string | null, isActive: boolean, maxUses?: number | null, currentUses: number, totalSignups: number, totalActiveUsers: number, totalRevenue: number, expiresAt?: string | null, createdAt: string, updatedAt: string }> };

export type GetSportsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSportsQuery = { __typename?: 'Query', sports: Array<{ __typename?: 'Sport', _id: string, type: SportType, name: string, nameEn?: string | null, icon: string, emoji?: string | null, colorKey: string, isPopular: boolean, isActive: boolean, displayOrder: number }> };

export type TournamentCoreFragment = { __typename?: 'Tournament', _id: string, title: string, sportType: SportType, status: TournamentStatus, coverImage?: string | null, description?: string | null, introduction?: string | null, totalCategories: number, totalRegistrations: number, totalMatches: number, organizer: string, organizerName?: string | null, createdAt: string, updatedAt: string, dates: { __typename?: 'TournamentDates', startDate: string, endDate?: string | null, registrationOpenDate?: string | null, registrationCloseDate?: string | null }, location?: { __typename?: 'TournamentLocation', name?: string | null, address?: string | null, latitude?: number | null, longitude?: number | null } | null };

export type TournamentDetailFragment = { __typename?: 'Tournament', highlights?: Array<string> | null, _id: string, title: string, sportType: SportType, status: TournamentStatus, coverImage?: string | null, description?: string | null, introduction?: string | null, totalCategories: number, totalRegistrations: number, totalMatches: number, organizer: string, organizerName?: string | null, createdAt: string, updatedAt: string, prizes?: Array<{ __typename?: 'TournamentPrize', rank: string, title: string, amount?: string | null, perks?: Array<string> | null }> | null, contacts?: Array<{ __typename?: 'TournamentContact', label: string, value: string, icon?: string | null }> | null, courts?: Array<{ __typename?: 'TournamentCourt', name: string, notes?: string | null, status?: string | null }> | null, rules?: Array<{ __typename?: 'TournamentRule', title: string, content?: string | null }> | null, paymentInfo?: { __typename?: 'TournamentPaymentInfo', bank?: string | null, accountNumber?: string | null, accountName?: string | null, qrImage?: string | null, fees?: Array<{ __typename?: 'TournamentFee', label: string, amount: string }> | null } | null, facilities?: Array<{ __typename?: 'TournamentFacility', label: string, icon?: string | null }> | null, schedule?: Array<{ __typename?: 'TournamentSchedulePhase', label: string, date?: string | null, startTime?: string | null, endTime?: string | null, status?: string | null }> | null, scheduleConfig?: { __typename?: 'ScheduleConfig', minRestMinutes: number, courtBufferMinutes: number, restBreakWindows?: Array<{ __typename?: 'ScheduleRestBreakWindow', startTime: string, endTime: string }> | null } | null, dates: { __typename?: 'TournamentDates', startDate: string, endDate?: string | null, registrationOpenDate?: string | null, registrationCloseDate?: string | null }, location?: { __typename?: 'TournamentLocation', name?: string | null, address?: string | null, latitude?: number | null, longitude?: number | null } | null };

export type TournamentCategoryCoreFragment = { __typename?: 'TournamentCategory', _id: string, tournamentId: string, title: string, format: TournamentFormat, matchType: MatchType, gender: TournamentGender, ageLabel?: string | null, description?: string | null, icon?: string | null, popular?: boolean | null, maxRegistrations?: number | null, registeredCount: number, matchCount: number, completedMatchCount: number, status: CategoryStatus, displayOrder?: number | null, seedCount?: number | null, groupCount?: number | null, advancingPerGroup?: number | null, bracketSize?: number | null, defaultMatchDurationMinutes?: number | null, sharedThirdPlace?: boolean | null, createdAt: string, updatedAt: string, prizes?: Array<{ __typename?: 'TournamentPrize', rank: string, title: string, amount?: string | null, perks?: Array<string> | null }> | null, scoringConfig: { __typename?: 'ScoringConfig', scoringSystem: ScoringSystem, bestOf: number, setsToWin: number, pointsPerSet: number, deuceEnabled: boolean, deuceAt: number, tiebreakEnabled: boolean, tiebreakPoints: number, winByMargin: number, maxPoints: number, periodsCount: number, periodDurationMinutes: number } };

export type MatchCoreFragment = { __typename?: 'TournamentMatch', _id: string, tournamentId: string, categoryId: string, round: number, roundLabel: string, matchNumber: number, bracketPosition?: number | null, groupId?: string | null, status: MatchStatus, isBye: boolean, winner?: number | null, scheduledAt?: string | null, durationSeconds?: number | null, estimatedDurationMinutes?: number | null, refereeId?: string | null, refereeName?: string | null, refereeInviteStatus?: RefereeInviteStatus | null, hasConflictWarning?: boolean | null, matchStartedAt?: string | null, nextMatchId?: string | null, nextMatchSlot?: number | null, losersNextMatchId?: string | null, losersNextMatchSlot?: number | null, createdAt: string, updatedAt: string, player1?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, player2?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, scoreSummary?: { __typename?: 'ScoreSummary', finalScore: Array<number>, sets: Array<{ __typename?: 'SetScoreSummary', player1: number, player2: number }> } | null, court?: { __typename?: 'MatchCourt', courtId?: string | null, name: string } | null };

export type RegistrationCoreFragment = { __typename?: 'TournamentRegistration', _id: string, tournamentId: string, categoryId: string, userId?: string | null, registeredByUserId: string, athleteName: string, avatarUrl?: string | null, dateOfBirth?: string | null, school?: string | null, club?: string | null, guardianName?: string | null, guardianPhone?: string | null, email?: string | null, phone?: string | null, notes?: string | null, seed?: number | null, bibNumber?: number | null, paymentAmount?: number | null, paymentProofUrl?: string | null, identityProofUrl?: string | null, registrationStatus: RegistrationStatus, paymentStatus: TournamentPaymentStatus, rejectionReason?: string | null, reviewedBy?: string | null, reviewedAt?: string | null, createdAt: string, updatedAt: string, members?: Array<{ __typename?: 'EntryMember', userId?: string | null, name: string, avatarUrl?: string | null, phone?: string | null, email?: string | null, dateOfBirth?: string | null, club?: string | null, school?: string | null }> | null };

export type ScorecardCoreFragment = { __typename?: 'MatchScorecard', _id: string, matchId: string, tournamentId: string, categoryId: string, status: ScorecardStatus, bestOf: number, currentSetIndex: number, servingPlayer?: number | null, leftSidePlayer?: number | null, elapsedSeconds: number, createdAt: string, updatedAt: string, matchSetup?: { __typename?: 'MatchSetupSnapshot', setupMethod: MatchSetupMethod, coinTossWinner?: number | null, coinTossChoice?: CoinTossChoice | null, decidedAt: string } | null, sets: Array<{ __typename?: 'ScorecardSet', setNumber: number, player1Score: number, player2Score: number, isComplete: boolean, winner?: number | null }>, pointHistory: Array<{ __typename?: 'PointEvent', id: string, scoringPlayer: number, servingPlayer: number, setNumber: number, scoreAfter: Array<number>, timestamp: string }>, correctionHistory?: Array<{ __typename?: 'CorrectionEvent', id: string, actorId: string, reason: string, action: MatchCorrectionAction, timestamp: string }> | null, scoringConfig: { __typename?: 'ScoringConfig', scoringSystem: ScoringSystem, bestOf: number, setsToWin: number, pointsPerSet: number, deuceEnabled: boolean, deuceAt: number, tiebreakEnabled: boolean, tiebreakPoints: number, winByMargin: number, maxPoints: number, periodsCount: number, periodDurationMinutes: number } };

export type GenerateBracketMutationVariables = Exact<{
  input: GenerateBracketInput;
}>;


export type GenerateBracketMutation = { __typename?: 'Mutation', generateBracket: Array<{ __typename?: 'TournamentMatch', _id: string, tournamentId: string, categoryId: string, round: number, roundLabel: string, matchNumber: number, bracketPosition?: number | null, groupId?: string | null, status: MatchStatus, isBye: boolean, winner?: number | null, scheduledAt?: string | null, durationSeconds?: number | null, estimatedDurationMinutes?: number | null, refereeId?: string | null, refereeName?: string | null, refereeInviteStatus?: RefereeInviteStatus | null, hasConflictWarning?: boolean | null, matchStartedAt?: string | null, nextMatchId?: string | null, nextMatchSlot?: number | null, losersNextMatchId?: string | null, losersNextMatchSlot?: number | null, createdAt: string, updatedAt: string, player1?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, player2?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, scoreSummary?: { __typename?: 'ScoreSummary', finalScore: Array<number>, sets: Array<{ __typename?: 'SetScoreSummary', player1: number, player2: number }> } | null, court?: { __typename?: 'MatchCourt', courtId?: string | null, name: string } | null }> };

export type ResetBracketMutationVariables = Exact<{
  categoryId: Scalars['ID']['input'];
}>;


export type ResetBracketMutation = { __typename?: 'Mutation', resetBracket: { __typename?: 'SuccessResponse', success: boolean, message: string } };

export type SeedPlayersMutationVariables = Exact<{
  input: SeedPlayersInput;
}>;


export type SeedPlayersMutation = { __typename?: 'Mutation', seedPlayers: { __typename?: 'SuccessResponse', success: boolean, message: string } };

export type SeedKnockoutBracketMutationVariables = Exact<{
  categoryId: Scalars['ID']['input'];
}>;


export type SeedKnockoutBracketMutation = { __typename?: 'Mutation', seedKnockoutBracket: Array<{ __typename?: 'TournamentMatch', _id: string, tournamentId: string, categoryId: string, round: number, roundLabel: string, matchNumber: number, bracketPosition?: number | null, groupId?: string | null, status: MatchStatus, isBye: boolean, winner?: number | null, scheduledAt?: string | null, durationSeconds?: number | null, estimatedDurationMinutes?: number | null, refereeId?: string | null, refereeName?: string | null, refereeInviteStatus?: RefereeInviteStatus | null, hasConflictWarning?: boolean | null, matchStartedAt?: string | null, nextMatchId?: string | null, nextMatchSlot?: number | null, losersNextMatchId?: string | null, losersNextMatchSlot?: number | null, createdAt: string, updatedAt: string, player1?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, player2?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, scoreSummary?: { __typename?: 'ScoreSummary', finalScore: Array<number>, sets: Array<{ __typename?: 'SetScoreSummary', player1: number, player2: number }> } | null, court?: { __typename?: 'MatchCourt', courtId?: string | null, name: string } | null }> };

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'TournamentCategory', _id: string, tournamentId: string, title: string, format: TournamentFormat, matchType: MatchType, gender: TournamentGender, ageLabel?: string | null, description?: string | null, icon?: string | null, popular?: boolean | null, maxRegistrations?: number | null, registeredCount: number, matchCount: number, completedMatchCount: number, status: CategoryStatus, displayOrder?: number | null, seedCount?: number | null, groupCount?: number | null, advancingPerGroup?: number | null, bracketSize?: number | null, defaultMatchDurationMinutes?: number | null, sharedThirdPlace?: boolean | null, createdAt: string, updatedAt: string, prizes?: Array<{ __typename?: 'TournamentPrize', rank: string, title: string, amount?: string | null, perks?: Array<string> | null }> | null, scoringConfig: { __typename?: 'ScoringConfig', scoringSystem: ScoringSystem, bestOf: number, setsToWin: number, pointsPerSet: number, deuceEnabled: boolean, deuceAt: number, tiebreakEnabled: boolean, tiebreakPoints: number, winByMargin: number, maxPoints: number, periodsCount: number, periodDurationMinutes: number } } };

export type UpdateCategoryMutationVariables = Exact<{
  input: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'TournamentCategory', _id: string, tournamentId: string, title: string, format: TournamentFormat, matchType: MatchType, gender: TournamentGender, ageLabel?: string | null, description?: string | null, icon?: string | null, popular?: boolean | null, maxRegistrations?: number | null, registeredCount: number, matchCount: number, completedMatchCount: number, status: CategoryStatus, displayOrder?: number | null, seedCount?: number | null, groupCount?: number | null, advancingPerGroup?: number | null, bracketSize?: number | null, defaultMatchDurationMinutes?: number | null, sharedThirdPlace?: boolean | null, createdAt: string, updatedAt: string, prizes?: Array<{ __typename?: 'TournamentPrize', rank: string, title: string, amount?: string | null, perks?: Array<string> | null }> | null, scoringConfig: { __typename?: 'ScoringConfig', scoringSystem: ScoringSystem, bestOf: number, setsToWin: number, pointsPerSet: number, deuceEnabled: boolean, deuceAt: number, tiebreakEnabled: boolean, tiebreakPoints: number, winByMargin: number, maxPoints: number, periodsCount: number, periodDurationMinutes: number } } };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: { __typename?: 'SuccessResponse', success: boolean, message: string } };

export type CreateTournamentMutationVariables = Exact<{
  input: CreateTournamentInput;
}>;


export type CreateTournamentMutation = { __typename?: 'Mutation', createTournament: { __typename?: 'Tournament', highlights?: Array<string> | null, _id: string, title: string, sportType: SportType, status: TournamentStatus, coverImage?: string | null, description?: string | null, introduction?: string | null, totalCategories: number, totalRegistrations: number, totalMatches: number, organizer: string, organizerName?: string | null, createdAt: string, updatedAt: string, prizes?: Array<{ __typename?: 'TournamentPrize', rank: string, title: string, amount?: string | null, perks?: Array<string> | null }> | null, contacts?: Array<{ __typename?: 'TournamentContact', label: string, value: string, icon?: string | null }> | null, courts?: Array<{ __typename?: 'TournamentCourt', name: string, notes?: string | null, status?: string | null }> | null, rules?: Array<{ __typename?: 'TournamentRule', title: string, content?: string | null }> | null, paymentInfo?: { __typename?: 'TournamentPaymentInfo', bank?: string | null, accountNumber?: string | null, accountName?: string | null, qrImage?: string | null, fees?: Array<{ __typename?: 'TournamentFee', label: string, amount: string }> | null } | null, facilities?: Array<{ __typename?: 'TournamentFacility', label: string, icon?: string | null }> | null, schedule?: Array<{ __typename?: 'TournamentSchedulePhase', label: string, date?: string | null, startTime?: string | null, endTime?: string | null, status?: string | null }> | null, scheduleConfig?: { __typename?: 'ScheduleConfig', minRestMinutes: number, courtBufferMinutes: number, restBreakWindows?: Array<{ __typename?: 'ScheduleRestBreakWindow', startTime: string, endTime: string }> | null } | null, dates: { __typename?: 'TournamentDates', startDate: string, endDate?: string | null, registrationOpenDate?: string | null, registrationCloseDate?: string | null }, location?: { __typename?: 'TournamentLocation', name?: string | null, address?: string | null, latitude?: number | null, longitude?: number | null } | null } };

export type UpdateTournamentMutationVariables = Exact<{
  input: UpdateTournamentInput;
}>;


export type UpdateTournamentMutation = { __typename?: 'Mutation', updateTournament: { __typename?: 'Tournament', highlights?: Array<string> | null, _id: string, title: string, sportType: SportType, status: TournamentStatus, coverImage?: string | null, description?: string | null, introduction?: string | null, totalCategories: number, totalRegistrations: number, totalMatches: number, organizer: string, organizerName?: string | null, createdAt: string, updatedAt: string, prizes?: Array<{ __typename?: 'TournamentPrize', rank: string, title: string, amount?: string | null, perks?: Array<string> | null }> | null, contacts?: Array<{ __typename?: 'TournamentContact', label: string, value: string, icon?: string | null }> | null, courts?: Array<{ __typename?: 'TournamentCourt', name: string, notes?: string | null, status?: string | null }> | null, rules?: Array<{ __typename?: 'TournamentRule', title: string, content?: string | null }> | null, paymentInfo?: { __typename?: 'TournamentPaymentInfo', bank?: string | null, accountNumber?: string | null, accountName?: string | null, qrImage?: string | null, fees?: Array<{ __typename?: 'TournamentFee', label: string, amount: string }> | null } | null, facilities?: Array<{ __typename?: 'TournamentFacility', label: string, icon?: string | null }> | null, schedule?: Array<{ __typename?: 'TournamentSchedulePhase', label: string, date?: string | null, startTime?: string | null, endTime?: string | null, status?: string | null }> | null, scheduleConfig?: { __typename?: 'ScheduleConfig', minRestMinutes: number, courtBufferMinutes: number, restBreakWindows?: Array<{ __typename?: 'ScheduleRestBreakWindow', startTime: string, endTime: string }> | null } | null, dates: { __typename?: 'TournamentDates', startDate: string, endDate?: string | null, registrationOpenDate?: string | null, registrationCloseDate?: string | null }, location?: { __typename?: 'TournamentLocation', name?: string | null, address?: string | null, latitude?: number | null, longitude?: number | null } | null } };

export type PublishTournamentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PublishTournamentMutation = { __typename?: 'Mutation', publishTournament: { __typename?: 'Tournament', _id: string, title: string, sportType: SportType, status: TournamentStatus, coverImage?: string | null, description?: string | null, introduction?: string | null, totalCategories: number, totalRegistrations: number, totalMatches: number, organizer: string, organizerName?: string | null, createdAt: string, updatedAt: string, dates: { __typename?: 'TournamentDates', startDate: string, endDate?: string | null, registrationOpenDate?: string | null, registrationCloseDate?: string | null }, location?: { __typename?: 'TournamentLocation', name?: string | null, address?: string | null, latitude?: number | null, longitude?: number | null } | null } };

export type OpenRegistrationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type OpenRegistrationMutation = { __typename?: 'Mutation', openRegistration: { __typename?: 'Tournament', _id: string, title: string, sportType: SportType, status: TournamentStatus, coverImage?: string | null, description?: string | null, introduction?: string | null, totalCategories: number, totalRegistrations: number, totalMatches: number, organizer: string, organizerName?: string | null, createdAt: string, updatedAt: string, dates: { __typename?: 'TournamentDates', startDate: string, endDate?: string | null, registrationOpenDate?: string | null, registrationCloseDate?: string | null }, location?: { __typename?: 'TournamentLocation', name?: string | null, address?: string | null, latitude?: number | null, longitude?: number | null } | null } };

export type CloseRegistrationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CloseRegistrationMutation = { __typename?: 'Mutation', closeRegistration: { __typename?: 'Tournament', _id: string, title: string, sportType: SportType, status: TournamentStatus, coverImage?: string | null, description?: string | null, introduction?: string | null, totalCategories: number, totalRegistrations: number, totalMatches: number, organizer: string, organizerName?: string | null, createdAt: string, updatedAt: string, dates: { __typename?: 'TournamentDates', startDate: string, endDate?: string | null, registrationOpenDate?: string | null, registrationCloseDate?: string | null }, location?: { __typename?: 'TournamentLocation', name?: string | null, address?: string | null, latitude?: number | null, longitude?: number | null } | null } };

export type StartTournamentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type StartTournamentMutation = { __typename?: 'Mutation', startTournament: { __typename?: 'Tournament', _id: string, title: string, sportType: SportType, status: TournamentStatus, coverImage?: string | null, description?: string | null, introduction?: string | null, totalCategories: number, totalRegistrations: number, totalMatches: number, organizer: string, organizerName?: string | null, createdAt: string, updatedAt: string, dates: { __typename?: 'TournamentDates', startDate: string, endDate?: string | null, registrationOpenDate?: string | null, registrationCloseDate?: string | null }, location?: { __typename?: 'TournamentLocation', name?: string | null, address?: string | null, latitude?: number | null, longitude?: number | null } | null } };

export type CompleteTournamentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CompleteTournamentMutation = { __typename?: 'Mutation', completeTournament: { __typename?: 'Tournament', _id: string, title: string, sportType: SportType, status: TournamentStatus, coverImage?: string | null, description?: string | null, introduction?: string | null, totalCategories: number, totalRegistrations: number, totalMatches: number, organizer: string, organizerName?: string | null, createdAt: string, updatedAt: string, dates: { __typename?: 'TournamentDates', startDate: string, endDate?: string | null, registrationOpenDate?: string | null, registrationCloseDate?: string | null }, location?: { __typename?: 'TournamentLocation', name?: string | null, address?: string | null, latitude?: number | null, longitude?: number | null } | null } };

export type CancelTournamentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CancelTournamentMutation = { __typename?: 'Mutation', cancelTournament: { __typename?: 'Tournament', _id: string, title: string, sportType: SportType, status: TournamentStatus, coverImage?: string | null, description?: string | null, introduction?: string | null, totalCategories: number, totalRegistrations: number, totalMatches: number, organizer: string, organizerName?: string | null, createdAt: string, updatedAt: string, dates: { __typename?: 'TournamentDates', startDate: string, endDate?: string | null, registrationOpenDate?: string | null, registrationCloseDate?: string | null }, location?: { __typename?: 'TournamentLocation', name?: string | null, address?: string | null, latitude?: number | null, longitude?: number | null } | null } };

export type DeleteTournamentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTournamentMutation = { __typename?: 'Mutation', deleteTournament: { __typename?: 'SuccessResponse', success: boolean, message: string } };

export type DuplicateTournamentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DuplicateTournamentMutation = { __typename?: 'Mutation', duplicateTournament: { __typename?: 'Tournament', highlights?: Array<string> | null, _id: string, title: string, sportType: SportType, status: TournamentStatus, coverImage?: string | null, description?: string | null, introduction?: string | null, totalCategories: number, totalRegistrations: number, totalMatches: number, organizer: string, organizerName?: string | null, createdAt: string, updatedAt: string, prizes?: Array<{ __typename?: 'TournamentPrize', rank: string, title: string, amount?: string | null, perks?: Array<string> | null }> | null, contacts?: Array<{ __typename?: 'TournamentContact', label: string, value: string, icon?: string | null }> | null, courts?: Array<{ __typename?: 'TournamentCourt', name: string, notes?: string | null, status?: string | null }> | null, rules?: Array<{ __typename?: 'TournamentRule', title: string, content?: string | null }> | null, paymentInfo?: { __typename?: 'TournamentPaymentInfo', bank?: string | null, accountNumber?: string | null, accountName?: string | null, qrImage?: string | null, fees?: Array<{ __typename?: 'TournamentFee', label: string, amount: string }> | null } | null, facilities?: Array<{ __typename?: 'TournamentFacility', label: string, icon?: string | null }> | null, schedule?: Array<{ __typename?: 'TournamentSchedulePhase', label: string, date?: string | null, startTime?: string | null, endTime?: string | null, status?: string | null }> | null, scheduleConfig?: { __typename?: 'ScheduleConfig', minRestMinutes: number, courtBufferMinutes: number, restBreakWindows?: Array<{ __typename?: 'ScheduleRestBreakWindow', startTime: string, endTime: string }> | null } | null, dates: { __typename?: 'TournamentDates', startDate: string, endDate?: string | null, registrationOpenDate?: string | null, registrationCloseDate?: string | null }, location?: { __typename?: 'TournamentLocation', name?: string | null, address?: string | null, latitude?: number | null, longitude?: number | null } | null } };

export type GenerateManualDrawMutationVariables = Exact<{
  input: GenerateManualDrawInput;
}>;


export type GenerateManualDrawMutation = { __typename?: 'Mutation', generateManualDraw: Array<{ __typename?: 'TournamentMatch', _id: string, tournamentId: string, categoryId: string, round: number, roundLabel: string, matchNumber: number, bracketPosition?: number | null, groupId?: string | null, status: MatchStatus, isBye: boolean, winner?: number | null, scheduledAt?: string | null, durationSeconds?: number | null, estimatedDurationMinutes?: number | null, refereeId?: string | null, refereeName?: string | null, refereeInviteStatus?: RefereeInviteStatus | null, hasConflictWarning?: boolean | null, matchStartedAt?: string | null, nextMatchId?: string | null, nextMatchSlot?: number | null, losersNextMatchId?: string | null, losersNextMatchSlot?: number | null, createdAt: string, updatedAt: string, player1?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, player2?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, scoreSummary?: { __typename?: 'ScoreSummary', finalScore: Array<number>, sets: Array<{ __typename?: 'SetScoreSummary', player1: number, player2: number }> } | null, court?: { __typename?: 'MatchCourt', courtId?: string | null, name: string } | null }> };

export type ApproveRegistrationMutationVariables = Exact<{
  input: ApproveRegistrationInput;
}>;


export type ApproveRegistrationMutation = { __typename?: 'Mutation', approveRegistration: { __typename?: 'TournamentRegistration', _id: string, tournamentId: string, categoryId: string, userId?: string | null, registeredByUserId: string, athleteName: string, avatarUrl?: string | null, dateOfBirth?: string | null, school?: string | null, club?: string | null, guardianName?: string | null, guardianPhone?: string | null, email?: string | null, phone?: string | null, notes?: string | null, seed?: number | null, bibNumber?: number | null, paymentAmount?: number | null, paymentProofUrl?: string | null, identityProofUrl?: string | null, registrationStatus: RegistrationStatus, paymentStatus: TournamentPaymentStatus, rejectionReason?: string | null, reviewedBy?: string | null, reviewedAt?: string | null, createdAt: string, updatedAt: string, members?: Array<{ __typename?: 'EntryMember', userId?: string | null, name: string, avatarUrl?: string | null, phone?: string | null, email?: string | null, dateOfBirth?: string | null, club?: string | null, school?: string | null }> | null } };

export type RejectRegistrationMutationVariables = Exact<{
  input: RejectRegistrationInput;
}>;


export type RejectRegistrationMutation = { __typename?: 'Mutation', rejectRegistration: { __typename?: 'TournamentRegistration', _id: string, tournamentId: string, categoryId: string, userId?: string | null, registeredByUserId: string, athleteName: string, avatarUrl?: string | null, dateOfBirth?: string | null, school?: string | null, club?: string | null, guardianName?: string | null, guardianPhone?: string | null, email?: string | null, phone?: string | null, notes?: string | null, seed?: number | null, bibNumber?: number | null, paymentAmount?: number | null, paymentProofUrl?: string | null, identityProofUrl?: string | null, registrationStatus: RegistrationStatus, paymentStatus: TournamentPaymentStatus, rejectionReason?: string | null, reviewedBy?: string | null, reviewedAt?: string | null, createdAt: string, updatedAt: string, members?: Array<{ __typename?: 'EntryMember', userId?: string | null, name: string, avatarUrl?: string | null, phone?: string | null, email?: string | null, dateOfBirth?: string | null, club?: string | null, school?: string | null }> | null } };

export type BulkApproveRegistrationsMutationVariables = Exact<{
  input: BulkRegistrationActionInput;
}>;


export type BulkApproveRegistrationsMutation = { __typename?: 'Mutation', bulkApproveRegistrations: number };

export type BulkRejectRegistrationsMutationVariables = Exact<{
  input: BulkRegistrationActionInput;
}>;


export type BulkRejectRegistrationsMutation = { __typename?: 'Mutation', bulkRejectRegistrations: number };

export type BulkDeleteRegistrationsMutationVariables = Exact<{
  input: BulkRegistrationActionInput;
}>;


export type BulkDeleteRegistrationsMutation = { __typename?: 'Mutation', bulkDeleteRegistrations: number };

export type UpdatePaymentStatusMutationVariables = Exact<{
  input: UpdatePaymentStatusInput;
}>;


export type UpdatePaymentStatusMutation = { __typename?: 'Mutation', updatePaymentStatus: { __typename?: 'TournamentRegistration', _id: string, tournamentId: string, categoryId: string, userId?: string | null, registeredByUserId: string, athleteName: string, avatarUrl?: string | null, dateOfBirth?: string | null, school?: string | null, club?: string | null, guardianName?: string | null, guardianPhone?: string | null, email?: string | null, phone?: string | null, notes?: string | null, seed?: number | null, bibNumber?: number | null, paymentAmount?: number | null, paymentProofUrl?: string | null, identityProofUrl?: string | null, registrationStatus: RegistrationStatus, paymentStatus: TournamentPaymentStatus, rejectionReason?: string | null, reviewedBy?: string | null, reviewedAt?: string | null, createdAt: string, updatedAt: string, members?: Array<{ __typename?: 'EntryMember', userId?: string | null, name: string, avatarUrl?: string | null, phone?: string | null, email?: string | null, dateOfBirth?: string | null, club?: string | null, school?: string | null }> | null } };

export type DeleteRegistrationMutationVariables = Exact<{
  input: DeleteRegistrationInput;
}>;


export type DeleteRegistrationMutation = { __typename?: 'Mutation', deleteRegistration: { __typename?: 'SuccessResponse', success: boolean, message: string } };

export type BulkImportRegistrationsMutationVariables = Exact<{
  input: BulkImportRegistrationsInput;
}>;


export type BulkImportRegistrationsMutation = { __typename?: 'Mutation', bulkImportRegistrations: { __typename?: 'BulkImportResult', successCount: number, failedCount: number, errors: Array<{ __typename?: 'BulkImportError', row: number, athleteName?: string | null, reason: string }> } };

export type AddLateEntryToByeSlotMutationVariables = Exact<{
  input: AddLateEntryToByeSlotInput;
}>;


export type AddLateEntryToByeSlotMutation = { __typename?: 'Mutation', addLateEntryToByeSlot: { __typename?: 'AddLateEntryResult', action: LateEntryAction, message: string, opponentName?: string | null, selectedFromCount: number, scheduleNeedsUpdate?: boolean | null, registration?: { __typename?: 'TournamentRegistration', _id: string, tournamentId: string, categoryId: string, userId?: string | null, registeredByUserId: string, athleteName: string, avatarUrl?: string | null, dateOfBirth?: string | null, school?: string | null, club?: string | null, guardianName?: string | null, guardianPhone?: string | null, email?: string | null, phone?: string | null, notes?: string | null, seed?: number | null, bibNumber?: number | null, paymentAmount?: number | null, paymentProofUrl?: string | null, identityProofUrl?: string | null, registrationStatus: RegistrationStatus, paymentStatus: TournamentPaymentStatus, rejectionReason?: string | null, reviewedBy?: string | null, reviewedAt?: string | null, createdAt: string, updatedAt: string, members?: Array<{ __typename?: 'EntryMember', userId?: string | null, name: string, avatarUrl?: string | null, phone?: string | null, email?: string | null, dateOfBirth?: string | null, club?: string | null, school?: string | null }> | null } | null, match?: { __typename?: 'TournamentMatch', _id: string, tournamentId: string, categoryId: string, round: number, roundLabel: string, matchNumber: number, bracketPosition?: number | null, groupId?: string | null, status: MatchStatus, isBye: boolean, winner?: number | null, scheduledAt?: string | null, durationSeconds?: number | null, estimatedDurationMinutes?: number | null, refereeId?: string | null, refereeName?: string | null, refereeInviteStatus?: RefereeInviteStatus | null, hasConflictWarning?: boolean | null, matchStartedAt?: string | null, nextMatchId?: string | null, nextMatchSlot?: number | null, losersNextMatchId?: string | null, losersNextMatchSlot?: number | null, createdAt: string, updatedAt: string, player1?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, player2?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, scoreSummary?: { __typename?: 'ScoreSummary', finalScore: Array<number>, sets: Array<{ __typename?: 'SetScoreSummary', player1: number, player2: number }> } | null, court?: { __typename?: 'MatchCourt', courtId?: string | null, name: string } | null } | null } };

export type UpdateRegistrationBibNumberMutationVariables = Exact<{
  input: UpdateBibNumberInput;
}>;


export type UpdateRegistrationBibNumberMutation = { __typename?: 'Mutation', updateRegistrationBibNumber: { __typename?: 'TournamentRegistration', _id: string, tournamentId: string, categoryId: string, userId?: string | null, registeredByUserId: string, athleteName: string, avatarUrl?: string | null, dateOfBirth?: string | null, school?: string | null, club?: string | null, guardianName?: string | null, guardianPhone?: string | null, email?: string | null, phone?: string | null, notes?: string | null, seed?: number | null, bibNumber?: number | null, paymentAmount?: number | null, paymentProofUrl?: string | null, identityProofUrl?: string | null, registrationStatus: RegistrationStatus, paymentStatus: TournamentPaymentStatus, rejectionReason?: string | null, reviewedBy?: string | null, reviewedAt?: string | null, createdAt: string, updatedAt: string, members?: Array<{ __typename?: 'EntryMember', userId?: string | null, name: string, avatarUrl?: string | null, phone?: string | null, email?: string | null, dateOfBirth?: string | null, club?: string | null, school?: string | null }> | null } };

export type ScheduleMatchMutationVariables = Exact<{
  input: ScheduleMatchInput;
}>;


export type ScheduleMatchMutation = { __typename?: 'Mutation', scheduleMatch: { __typename?: 'ScheduleMatchResult', warnings: Array<string>, match: { __typename?: 'TournamentMatch', _id: string, tournamentId: string, categoryId: string, round: number, roundLabel: string, matchNumber: number, bracketPosition?: number | null, groupId?: string | null, status: MatchStatus, isBye: boolean, winner?: number | null, scheduledAt?: string | null, durationSeconds?: number | null, estimatedDurationMinutes?: number | null, refereeId?: string | null, refereeName?: string | null, refereeInviteStatus?: RefereeInviteStatus | null, hasConflictWarning?: boolean | null, matchStartedAt?: string | null, nextMatchId?: string | null, nextMatchSlot?: number | null, losersNextMatchId?: string | null, losersNextMatchSlot?: number | null, createdAt: string, updatedAt: string, player1?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, player2?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, scoreSummary?: { __typename?: 'ScoreSummary', finalScore: Array<number>, sets: Array<{ __typename?: 'SetScoreSummary', player1: number, player2: number }> } | null, court?: { __typename?: 'MatchCourt', courtId?: string | null, name: string } | null } } };

export type BulkScheduleMatchesMutationVariables = Exact<{
  input: BulkScheduleMatchInput;
}>;


export type BulkScheduleMatchesMutation = { __typename?: 'Mutation', bulkScheduleMatches: Array<{ __typename?: 'TournamentMatch', _id: string, tournamentId: string, categoryId: string, round: number, roundLabel: string, matchNumber: number, bracketPosition?: number | null, groupId?: string | null, status: MatchStatus, isBye: boolean, winner?: number | null, scheduledAt?: string | null, durationSeconds?: number | null, estimatedDurationMinutes?: number | null, refereeId?: string | null, refereeName?: string | null, refereeInviteStatus?: RefereeInviteStatus | null, hasConflictWarning?: boolean | null, matchStartedAt?: string | null, nextMatchId?: string | null, nextMatchSlot?: number | null, losersNextMatchId?: string | null, losersNextMatchSlot?: number | null, createdAt: string, updatedAt: string, player1?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, player2?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, scoreSummary?: { __typename?: 'ScoreSummary', finalScore: Array<number>, sets: Array<{ __typename?: 'SetScoreSummary', player1: number, player2: number }> } | null, court?: { __typename?: 'MatchCourt', courtId?: string | null, name: string } | null }> };

export type UnscheduleMatchMutationVariables = Exact<{
  matchId: Scalars['ID']['input'];
}>;


export type UnscheduleMatchMutation = { __typename?: 'Mutation', unscheduleMatch: { __typename?: 'TournamentMatch', _id: string, tournamentId: string, categoryId: string, round: number, roundLabel: string, matchNumber: number, bracketPosition?: number | null, groupId?: string | null, status: MatchStatus, isBye: boolean, winner?: number | null, scheduledAt?: string | null, durationSeconds?: number | null, estimatedDurationMinutes?: number | null, refereeId?: string | null, refereeName?: string | null, refereeInviteStatus?: RefereeInviteStatus | null, hasConflictWarning?: boolean | null, matchStartedAt?: string | null, nextMatchId?: string | null, nextMatchSlot?: number | null, losersNextMatchId?: string | null, losersNextMatchSlot?: number | null, createdAt: string, updatedAt: string, player1?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, player2?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, scoreSummary?: { __typename?: 'ScoreSummary', finalScore: Array<number>, sets: Array<{ __typename?: 'SetScoreSummary', player1: number, player2: number }> } | null, court?: { __typename?: 'MatchCourt', courtId?: string | null, name: string } | null } };

export type CascadeRescheduleMutationVariables = Exact<{
  input: CascadeRescheduleInput;
}>;


export type CascadeRescheduleMutation = { __typename?: 'Mutation', cascadeReschedule: { __typename?: 'CascadeRescheduleResult', totalAffected: number, warnings: Array<string>, affectedMatches: Array<{ __typename?: 'TournamentMatch', _id: string, tournamentId: string, categoryId: string, round: number, roundLabel: string, matchNumber: number, bracketPosition?: number | null, groupId?: string | null, status: MatchStatus, isBye: boolean, winner?: number | null, scheduledAt?: string | null, durationSeconds?: number | null, estimatedDurationMinutes?: number | null, refereeId?: string | null, refereeName?: string | null, refereeInviteStatus?: RefereeInviteStatus | null, hasConflictWarning?: boolean | null, matchStartedAt?: string | null, nextMatchId?: string | null, nextMatchSlot?: number | null, losersNextMatchId?: string | null, losersNextMatchSlot?: number | null, createdAt: string, updatedAt: string, player1?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, player2?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, scoreSummary?: { __typename?: 'ScoreSummary', finalScore: Array<number>, sets: Array<{ __typename?: 'SetScoreSummary', player1: number, player2: number }> } | null, court?: { __typename?: 'MatchCourt', courtId?: string | null, name: string } | null }> } };

export type RepackCourtScheduleMutationVariables = Exact<{
  input: RepackCourtScheduleInput;
}>;


export type RepackCourtScheduleMutation = { __typename?: 'Mutation', repackCourtSchedule: { __typename?: 'RepackCourtScheduleResult', totalAffected: number, warnings: Array<string>, affectedMatches: Array<{ __typename?: 'TournamentMatch', _id: string, tournamentId: string, categoryId: string, round: number, roundLabel: string, matchNumber: number, bracketPosition?: number | null, groupId?: string | null, status: MatchStatus, isBye: boolean, winner?: number | null, scheduledAt?: string | null, durationSeconds?: number | null, estimatedDurationMinutes?: number | null, refereeId?: string | null, refereeName?: string | null, refereeInviteStatus?: RefereeInviteStatus | null, hasConflictWarning?: boolean | null, matchStartedAt?: string | null, nextMatchId?: string | null, nextMatchSlot?: number | null, losersNextMatchId?: string | null, losersNextMatchSlot?: number | null, createdAt: string, updatedAt: string, player1?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, player2?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, scoreSummary?: { __typename?: 'ScoreSummary', finalScore: Array<number>, sets: Array<{ __typename?: 'SetScoreSummary', player1: number, player2: number }> } | null, court?: { __typename?: 'MatchCourt', courtId?: string | null, name: string } | null }>, preview: Array<{ __typename?: 'ScheduleShiftPreview', matchId: string, matchNumber: number, oldScheduledAt: string, newScheduledAt: string }> } };

export type AssignRefereeMutationVariables = Exact<{
  input: AssignRefereeInput;
}>;


export type AssignRefereeMutation = { __typename?: 'Mutation', assignReferee: { __typename?: 'TournamentMatch', _id: string, tournamentId: string, categoryId: string, round: number, roundLabel: string, matchNumber: number, bracketPosition?: number | null, groupId?: string | null, status: MatchStatus, isBye: boolean, winner?: number | null, scheduledAt?: string | null, durationSeconds?: number | null, estimatedDurationMinutes?: number | null, refereeId?: string | null, refereeName?: string | null, refereeInviteStatus?: RefereeInviteStatus | null, hasConflictWarning?: boolean | null, matchStartedAt?: string | null, nextMatchId?: string | null, nextMatchSlot?: number | null, losersNextMatchId?: string | null, losersNextMatchSlot?: number | null, createdAt: string, updatedAt: string, player1?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, player2?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, scoreSummary?: { __typename?: 'ScoreSummary', finalScore: Array<number>, sets: Array<{ __typename?: 'SetScoreSummary', player1: number, player2: number }> } | null, court?: { __typename?: 'MatchCourt', courtId?: string | null, name: string } | null } };

export type StartMatchMutationVariables = Exact<{
  input: StartMatchInput;
}>;


export type StartMatchMutation = { __typename?: 'Mutation', startMatch: { __typename?: 'MatchScorecard', _id: string, matchId: string, tournamentId: string, categoryId: string, status: ScorecardStatus, bestOf: number, currentSetIndex: number, servingPlayer?: number | null, leftSidePlayer?: number | null, elapsedSeconds: number, createdAt: string, updatedAt: string, matchSetup?: { __typename?: 'MatchSetupSnapshot', setupMethod: MatchSetupMethod, coinTossWinner?: number | null, coinTossChoice?: CoinTossChoice | null, decidedAt: string } | null, sets: Array<{ __typename?: 'ScorecardSet', setNumber: number, player1Score: number, player2Score: number, isComplete: boolean, winner?: number | null }>, pointHistory: Array<{ __typename?: 'PointEvent', id: string, scoringPlayer: number, servingPlayer: number, setNumber: number, scoreAfter: Array<number>, timestamp: string }>, correctionHistory?: Array<{ __typename?: 'CorrectionEvent', id: string, actorId: string, reason: string, action: MatchCorrectionAction, timestamp: string }> | null, scoringConfig: { __typename?: 'ScoringConfig', scoringSystem: ScoringSystem, bestOf: number, setsToWin: number, pointsPerSet: number, deuceEnabled: boolean, deuceAt: number, tiebreakEnabled: boolean, tiebreakPoints: number, winByMargin: number, maxPoints: number, periodsCount: number, periodDurationMinutes: number } } };

export type ScorePointMutationVariables = Exact<{
  input: ScorePointInput;
}>;


export type ScorePointMutation = { __typename?: 'Mutation', scorePoint: { __typename?: 'MatchScorecard', _id: string, matchId: string, tournamentId: string, categoryId: string, status: ScorecardStatus, bestOf: number, currentSetIndex: number, servingPlayer?: number | null, leftSidePlayer?: number | null, elapsedSeconds: number, createdAt: string, updatedAt: string, matchSetup?: { __typename?: 'MatchSetupSnapshot', setupMethod: MatchSetupMethod, coinTossWinner?: number | null, coinTossChoice?: CoinTossChoice | null, decidedAt: string } | null, sets: Array<{ __typename?: 'ScorecardSet', setNumber: number, player1Score: number, player2Score: number, isComplete: boolean, winner?: number | null }>, pointHistory: Array<{ __typename?: 'PointEvent', id: string, scoringPlayer: number, servingPlayer: number, setNumber: number, scoreAfter: Array<number>, timestamp: string }>, correctionHistory?: Array<{ __typename?: 'CorrectionEvent', id: string, actorId: string, reason: string, action: MatchCorrectionAction, timestamp: string }> | null, scoringConfig: { __typename?: 'ScoringConfig', scoringSystem: ScoringSystem, bestOf: number, setsToWin: number, pointsPerSet: number, deuceEnabled: boolean, deuceAt: number, tiebreakEnabled: boolean, tiebreakPoints: number, winByMargin: number, maxPoints: number, periodsCount: number, periodDurationMinutes: number } } };

export type UndoLastPointMutationVariables = Exact<{
  matchId: Scalars['ID']['input'];
}>;


export type UndoLastPointMutation = { __typename?: 'Mutation', undoLastPoint: { __typename?: 'MatchScorecard', _id: string, matchId: string, tournamentId: string, categoryId: string, status: ScorecardStatus, bestOf: number, currentSetIndex: number, servingPlayer?: number | null, leftSidePlayer?: number | null, elapsedSeconds: number, createdAt: string, updatedAt: string, matchSetup?: { __typename?: 'MatchSetupSnapshot', setupMethod: MatchSetupMethod, coinTossWinner?: number | null, coinTossChoice?: CoinTossChoice | null, decidedAt: string } | null, sets: Array<{ __typename?: 'ScorecardSet', setNumber: number, player1Score: number, player2Score: number, isComplete: boolean, winner?: number | null }>, pointHistory: Array<{ __typename?: 'PointEvent', id: string, scoringPlayer: number, servingPlayer: number, setNumber: number, scoreAfter: Array<number>, timestamp: string }>, correctionHistory?: Array<{ __typename?: 'CorrectionEvent', id: string, actorId: string, reason: string, action: MatchCorrectionAction, timestamp: string }> | null, scoringConfig: { __typename?: 'ScoringConfig', scoringSystem: ScoringSystem, bestOf: number, setsToWin: number, pointsPerSet: number, deuceEnabled: boolean, deuceAt: number, tiebreakEnabled: boolean, tiebreakPoints: number, winByMargin: number, maxPoints: number, periodsCount: number, periodDurationMinutes: number } } };

export type UpdateMatchResultMutationVariables = Exact<{
  input: ManualMatchResultInput;
}>;


export type UpdateMatchResultMutation = { __typename?: 'Mutation', updateMatchResult: { __typename?: 'MatchScorecard', _id: string, matchId: string, tournamentId: string, categoryId: string, status: ScorecardStatus, bestOf: number, currentSetIndex: number, servingPlayer?: number | null, leftSidePlayer?: number | null, elapsedSeconds: number, createdAt: string, updatedAt: string, matchSetup?: { __typename?: 'MatchSetupSnapshot', setupMethod: MatchSetupMethod, coinTossWinner?: number | null, coinTossChoice?: CoinTossChoice | null, decidedAt: string } | null, sets: Array<{ __typename?: 'ScorecardSet', setNumber: number, player1Score: number, player2Score: number, isComplete: boolean, winner?: number | null }>, pointHistory: Array<{ __typename?: 'PointEvent', id: string, scoringPlayer: number, servingPlayer: number, setNumber: number, scoreAfter: Array<number>, timestamp: string }>, correctionHistory?: Array<{ __typename?: 'CorrectionEvent', id: string, actorId: string, reason: string, action: MatchCorrectionAction, timestamp: string }> | null, scoringConfig: { __typename?: 'ScoringConfig', scoringSystem: ScoringSystem, bestOf: number, setsToWin: number, pointsPerSet: number, deuceEnabled: boolean, deuceAt: number, tiebreakEnabled: boolean, tiebreakPoints: number, winByMargin: number, maxPoints: number, periodsCount: number, periodDurationMinutes: number } } };

export type OrganizerCorrectLiveScoreMutationVariables = Exact<{
  input: OrganizerCorrectLiveScoreInput;
}>;


export type OrganizerCorrectLiveScoreMutation = { __typename?: 'Mutation', organizerCorrectLiveScore: { __typename?: 'MatchScorecard', _id: string, matchId: string, tournamentId: string, categoryId: string, status: ScorecardStatus, bestOf: number, currentSetIndex: number, servingPlayer?: number | null, leftSidePlayer?: number | null, elapsedSeconds: number, createdAt: string, updatedAt: string, matchSetup?: { __typename?: 'MatchSetupSnapshot', setupMethod: MatchSetupMethod, coinTossWinner?: number | null, coinTossChoice?: CoinTossChoice | null, decidedAt: string } | null, sets: Array<{ __typename?: 'ScorecardSet', setNumber: number, player1Score: number, player2Score: number, isComplete: boolean, winner?: number | null }>, pointHistory: Array<{ __typename?: 'PointEvent', id: string, scoringPlayer: number, servingPlayer: number, setNumber: number, scoreAfter: Array<number>, timestamp: string }>, correctionHistory?: Array<{ __typename?: 'CorrectionEvent', id: string, actorId: string, reason: string, action: MatchCorrectionAction, timestamp: string }> | null, scoringConfig: { __typename?: 'ScoringConfig', scoringSystem: ScoringSystem, bestOf: number, setsToWin: number, pointsPerSet: number, deuceEnabled: boolean, deuceAt: number, tiebreakEnabled: boolean, tiebreakPoints: number, winByMargin: number, maxPoints: number, periodsCount: number, periodDurationMinutes: number } } };

export type OrganizerAbortLiveMatchMutationVariables = Exact<{
  input: OrganizerAbortLiveMatchInput;
}>;


export type OrganizerAbortLiveMatchMutation = { __typename?: 'Mutation', organizerAbortLiveMatch: { __typename?: 'TournamentMatch', _id: string, tournamentId: string, categoryId: string, round: number, roundLabel: string, matchNumber: number, bracketPosition?: number | null, groupId?: string | null, status: MatchStatus, isBye: boolean, winner?: number | null, scheduledAt?: string | null, durationSeconds?: number | null, estimatedDurationMinutes?: number | null, refereeId?: string | null, refereeName?: string | null, refereeInviteStatus?: RefereeInviteStatus | null, hasConflictWarning?: boolean | null, matchStartedAt?: string | null, nextMatchId?: string | null, nextMatchSlot?: number | null, losersNextMatchId?: string | null, losersNextMatchSlot?: number | null, createdAt: string, updatedAt: string, player1?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, player2?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, scoreSummary?: { __typename?: 'ScoreSummary', finalScore: Array<number>, sets: Array<{ __typename?: 'SetScoreSummary', player1: number, player2: number }> } | null, court?: { __typename?: 'MatchCourt', courtId?: string | null, name: string } | null } };

export type SetMatchWalkoverMutationVariables = Exact<{
  input: SetMatchWalkoverInput;
}>;


export type SetMatchWalkoverMutation = { __typename?: 'Mutation', setMatchWalkover: { __typename?: 'TournamentMatch', _id: string, tournamentId: string, categoryId: string, round: number, roundLabel: string, matchNumber: number, bracketPosition?: number | null, groupId?: string | null, status: MatchStatus, isBye: boolean, winner?: number | null, scheduledAt?: string | null, durationSeconds?: number | null, estimatedDurationMinutes?: number | null, refereeId?: string | null, refereeName?: string | null, refereeInviteStatus?: RefereeInviteStatus | null, hasConflictWarning?: boolean | null, matchStartedAt?: string | null, nextMatchId?: string | null, nextMatchSlot?: number | null, losersNextMatchId?: string | null, losersNextMatchSlot?: number | null, createdAt: string, updatedAt: string, player1?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, player2?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, scoreSummary?: { __typename?: 'ScoreSummary', finalScore: Array<number>, sets: Array<{ __typename?: 'SetScoreSummary', player1: number, player2: number }> } | null, court?: { __typename?: 'MatchCourt', courtId?: string | null, name: string } | null } };

export type CorrectFinishedMatchResultMutationVariables = Exact<{
  input: CorrectFinishedMatchResultInput;
}>;


export type CorrectFinishedMatchResultMutation = { __typename?: 'Mutation', correctFinishedMatchResult: { __typename?: 'TournamentMatch', _id: string, tournamentId: string, categoryId: string, round: number, roundLabel: string, matchNumber: number, bracketPosition?: number | null, groupId?: string | null, status: MatchStatus, isBye: boolean, winner?: number | null, scheduledAt?: string | null, durationSeconds?: number | null, estimatedDurationMinutes?: number | null, refereeId?: string | null, refereeName?: string | null, refereeInviteStatus?: RefereeInviteStatus | null, hasConflictWarning?: boolean | null, matchStartedAt?: string | null, nextMatchId?: string | null, nextMatchSlot?: number | null, losersNextMatchId?: string | null, losersNextMatchSlot?: number | null, createdAt: string, updatedAt: string, player1?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, player2?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, scoreSummary?: { __typename?: 'ScoreSummary', finalScore: Array<number>, sets: Array<{ __typename?: 'SetScoreSummary', player1: number, player2: number }> } | null, court?: { __typename?: 'MatchCourt', courtId?: string | null, name: string } | null } };

export type GetMyTournamentsQueryVariables = Exact<{
  filter?: InputMaybe<TournamentFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type GetMyTournamentsQuery = { __typename?: 'Query', myTournamentsConnection: { __typename?: 'TournamentConnection', totalCount: number, edges: Array<{ __typename?: 'TournamentEdge', cursor: string, node: { __typename?: 'Tournament', _id: string, title: string, sportType: SportType, status: TournamentStatus, coverImage?: string | null, description?: string | null, introduction?: string | null, totalCategories: number, totalRegistrations: number, totalMatches: number, organizer: string, organizerName?: string | null, createdAt: string, updatedAt: string, dates: { __typename?: 'TournamentDates', startDate: string, endDate?: string | null, registrationOpenDate?: string | null, registrationCloseDate?: string | null }, location?: { __typename?: 'TournamentLocation', name?: string | null, address?: string | null, latitude?: number | null, longitude?: number | null } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type GetTournamentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetTournamentQuery = { __typename?: 'Query', tournament: { __typename?: 'Tournament', highlights?: Array<string> | null, _id: string, title: string, sportType: SportType, status: TournamentStatus, coverImage?: string | null, description?: string | null, introduction?: string | null, totalCategories: number, totalRegistrations: number, totalMatches: number, organizer: string, organizerName?: string | null, createdAt: string, updatedAt: string, prizes?: Array<{ __typename?: 'TournamentPrize', rank: string, title: string, amount?: string | null, perks?: Array<string> | null }> | null, contacts?: Array<{ __typename?: 'TournamentContact', label: string, value: string, icon?: string | null }> | null, courts?: Array<{ __typename?: 'TournamentCourt', name: string, notes?: string | null, status?: string | null }> | null, rules?: Array<{ __typename?: 'TournamentRule', title: string, content?: string | null }> | null, paymentInfo?: { __typename?: 'TournamentPaymentInfo', bank?: string | null, accountNumber?: string | null, accountName?: string | null, qrImage?: string | null, fees?: Array<{ __typename?: 'TournamentFee', label: string, amount: string }> | null } | null, facilities?: Array<{ __typename?: 'TournamentFacility', label: string, icon?: string | null }> | null, schedule?: Array<{ __typename?: 'TournamentSchedulePhase', label: string, date?: string | null, startTime?: string | null, endTime?: string | null, status?: string | null }> | null, scheduleConfig?: { __typename?: 'ScheduleConfig', minRestMinutes: number, courtBufferMinutes: number, restBreakWindows?: Array<{ __typename?: 'ScheduleRestBreakWindow', startTime: string, endTime: string }> | null } | null, dates: { __typename?: 'TournamentDates', startDate: string, endDate?: string | null, registrationOpenDate?: string | null, registrationCloseDate?: string | null }, location?: { __typename?: 'TournamentLocation', name?: string | null, address?: string | null, latitude?: number | null, longitude?: number | null } | null } };

export type GetTournamentCategoriesQueryVariables = Exact<{
  tournamentId: Scalars['ID']['input'];
}>;


export type GetTournamentCategoriesQuery = { __typename?: 'Query', tournamentCategories: Array<{ __typename?: 'TournamentCategory', _id: string, tournamentId: string, title: string, format: TournamentFormat, matchType: MatchType, gender: TournamentGender, ageLabel?: string | null, description?: string | null, icon?: string | null, popular?: boolean | null, maxRegistrations?: number | null, registeredCount: number, matchCount: number, completedMatchCount: number, status: CategoryStatus, displayOrder?: number | null, seedCount?: number | null, groupCount?: number | null, advancingPerGroup?: number | null, bracketSize?: number | null, defaultMatchDurationMinutes?: number | null, sharedThirdPlace?: boolean | null, createdAt: string, updatedAt: string, prizes?: Array<{ __typename?: 'TournamentPrize', rank: string, title: string, amount?: string | null, perks?: Array<string> | null }> | null, scoringConfig: { __typename?: 'ScoringConfig', scoringSystem: ScoringSystem, bestOf: number, setsToWin: number, pointsPerSet: number, deuceEnabled: boolean, deuceAt: number, tiebreakEnabled: boolean, tiebreakPoints: number, winByMargin: number, maxPoints: number, periodsCount: number, periodDurationMinutes: number } }> };

export type PreviewBulkImportQueryVariables = Exact<{
  input: PreviewBulkImportInput;
}>;


export type PreviewBulkImportQuery = { __typename?: 'Query', previewBulkImport: { __typename?: 'PreviewBulkImportResult', adjustmentsNeeded: Array<{ __typename?: 'BracketSizeAdjustment', categoryId: string, categoryTitle: string, currentBracketSize: number, newRegistrationCount: number, suggestedBracketSize: number }> } };

export type PreviewLateEntryPlacementQueryVariables = Exact<{
  categoryId: Scalars['ID']['input'];
}>;


export type PreviewLateEntryPlacementQuery = { __typename?: 'Query', previewLateEntryPlacement: { __typename?: 'LateEntryPlacementPreview', canProceed: boolean, eligibleByeMatchCount: number, blockReason?: string | null, isFormatSupported: boolean, eligibleMatches: Array<{ __typename?: 'LateEntryByeMatchSummary', matchId: string, matchNumber: number, roundLabel: string, opponentName: string }> } };

export type GetTournamentRegistrationsQueryVariables = Exact<{
  tournamentId: Scalars['ID']['input'];
  filter?: InputMaybe<RegistrationFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type GetTournamentRegistrationsQuery = { __typename?: 'Query', tournamentRegistrationsConnection: { __typename?: 'TournamentRegistrationConnection', totalCount: number, edges: Array<{ __typename?: 'TournamentRegistrationEdge', cursor: string, node: { __typename?: 'TournamentRegistration', _id: string, tournamentId: string, categoryId: string, userId?: string | null, registeredByUserId: string, athleteName: string, avatarUrl?: string | null, dateOfBirth?: string | null, school?: string | null, club?: string | null, guardianName?: string | null, guardianPhone?: string | null, email?: string | null, phone?: string | null, notes?: string | null, seed?: number | null, bibNumber?: number | null, paymentAmount?: number | null, paymentProofUrl?: string | null, identityProofUrl?: string | null, registrationStatus: RegistrationStatus, paymentStatus: TournamentPaymentStatus, rejectionReason?: string | null, reviewedBy?: string | null, reviewedAt?: string | null, createdAt: string, updatedAt: string, members?: Array<{ __typename?: 'EntryMember', userId?: string | null, name: string, avatarUrl?: string | null, phone?: string | null, email?: string | null, dateOfBirth?: string | null, club?: string | null, school?: string | null }> | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type GetTournamentBracketQueryVariables = Exact<{
  categoryId: Scalars['ID']['input'];
}>;


export type GetTournamentBracketQuery = { __typename?: 'Query', tournamentBracket: Array<{ __typename?: 'TournamentMatch', _id: string, tournamentId: string, categoryId: string, round: number, roundLabel: string, matchNumber: number, bracketPosition?: number | null, groupId?: string | null, status: MatchStatus, isBye: boolean, winner?: number | null, scheduledAt?: string | null, durationSeconds?: number | null, estimatedDurationMinutes?: number | null, refereeId?: string | null, refereeName?: string | null, refereeInviteStatus?: RefereeInviteStatus | null, hasConflictWarning?: boolean | null, matchStartedAt?: string | null, nextMatchId?: string | null, nextMatchSlot?: number | null, losersNextMatchId?: string | null, losersNextMatchSlot?: number | null, createdAt: string, updatedAt: string, player1?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, player2?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, scoreSummary?: { __typename?: 'ScoreSummary', finalScore: Array<number>, sets: Array<{ __typename?: 'SetScoreSummary', player1: number, player2: number }> } | null, court?: { __typename?: 'MatchCourt', courtId?: string | null, name: string } | null }> };

export type GetTournamentMatchesQueryVariables = Exact<{
  tournamentId: Scalars['ID']['input'];
  filter?: InputMaybe<MatchFilterInput>;
  pagination?: InputMaybe<CursorPageInput>;
}>;


export type GetTournamentMatchesQuery = { __typename?: 'Query', tournamentMatchesConnection: { __typename?: 'TournamentMatchConnection', totalCount: number, edges: Array<{ __typename?: 'TournamentMatchEdge', cursor: string, node: { __typename?: 'TournamentMatch', _id: string, tournamentId: string, categoryId: string, round: number, roundLabel: string, matchNumber: number, bracketPosition?: number | null, groupId?: string | null, status: MatchStatus, isBye: boolean, winner?: number | null, scheduledAt?: string | null, durationSeconds?: number | null, estimatedDurationMinutes?: number | null, refereeId?: string | null, refereeName?: string | null, refereeInviteStatus?: RefereeInviteStatus | null, hasConflictWarning?: boolean | null, matchStartedAt?: string | null, nextMatchId?: string | null, nextMatchSlot?: number | null, losersNextMatchId?: string | null, losersNextMatchSlot?: number | null, createdAt: string, updatedAt: string, player1?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, player2?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, scoreSummary?: { __typename?: 'ScoreSummary', finalScore: Array<number>, sets: Array<{ __typename?: 'SetScoreSummary', player1: number, player2: number }> } | null, court?: { __typename?: 'MatchCourt', courtId?: string | null, name: string } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type GetMatchScorecardQueryVariables = Exact<{
  matchId: Scalars['ID']['input'];
}>;


export type GetMatchScorecardQuery = { __typename?: 'Query', matchScorecard?: { __typename?: 'MatchScorecard', _id: string, matchId: string, tournamentId: string, categoryId: string, status: ScorecardStatus, bestOf: number, currentSetIndex: number, servingPlayer?: number | null, leftSidePlayer?: number | null, elapsedSeconds: number, createdAt: string, updatedAt: string, matchSetup?: { __typename?: 'MatchSetupSnapshot', setupMethod: MatchSetupMethod, coinTossWinner?: number | null, coinTossChoice?: CoinTossChoice | null, decidedAt: string } | null, sets: Array<{ __typename?: 'ScorecardSet', setNumber: number, player1Score: number, player2Score: number, isComplete: boolean, winner?: number | null }>, pointHistory: Array<{ __typename?: 'PointEvent', id: string, scoringPlayer: number, servingPlayer: number, setNumber: number, scoreAfter: Array<number>, timestamp: string }>, correctionHistory?: Array<{ __typename?: 'CorrectionEvent', id: string, actorId: string, reason: string, action: MatchCorrectionAction, timestamp: string }> | null, scoringConfig: { __typename?: 'ScoringConfig', scoringSystem: ScoringSystem, bestOf: number, setsToWin: number, pointsPerSet: number, deuceEnabled: boolean, deuceAt: number, tiebreakEnabled: boolean, tiebreakPoints: number, winByMargin: number, maxPoints: number, periodsCount: number, periodDurationMinutes: number } } | null };

export type GetRefereeMatchesQueryVariables = Exact<{
  tournamentId: Scalars['ID']['input'];
}>;


export type GetRefereeMatchesQuery = { __typename?: 'Query', refereeMatches: Array<{ __typename?: 'TournamentMatch', _id: string, tournamentId: string, categoryId: string, round: number, roundLabel: string, matchNumber: number, bracketPosition?: number | null, groupId?: string | null, status: MatchStatus, isBye: boolean, winner?: number | null, scheduledAt?: string | null, durationSeconds?: number | null, estimatedDurationMinutes?: number | null, refereeId?: string | null, refereeName?: string | null, refereeInviteStatus?: RefereeInviteStatus | null, hasConflictWarning?: boolean | null, matchStartedAt?: string | null, nextMatchId?: string | null, nextMatchSlot?: number | null, losersNextMatchId?: string | null, losersNextMatchSlot?: number | null, createdAt: string, updatedAt: string, player1?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, player2?: { __typename?: 'MatchPlayer', registrationId?: string | null, userId?: string | null, name?: string | null, club?: string | null, avatarUrl?: string | null, seed?: number | null, dateOfBirth?: string | null, bibNumber?: number | null, members?: Array<{ __typename?: 'MatchMember', userId?: string | null, name?: string | null, avatarUrl?: string | null, club?: string | null }> | null } | null, scoreSummary?: { __typename?: 'ScoreSummary', finalScore: Array<number>, sets: Array<{ __typename?: 'SetScoreSummary', player1: number, player2: number }> } | null, court?: { __typename?: 'MatchCourt', courtId?: string | null, name: string } | null }> };

export type GetTournamentRankingsQueryVariables = Exact<{
  categoryId: Scalars['ID']['input'];
}>;


export type GetTournamentRankingsQuery = { __typename?: 'Query', tournamentRankings: Array<{ __typename?: 'PlayerRanking', rank: number, registrationId: string, playerName?: string | null, matchesPlayed: number, matchesWon: number, matchesLost: number, setsWon: number, setsLost: number, pointsWon: number, pointsLost: number, winRate: number, groupPoints?: number | null }> };

export type GetTournamentGroupRankingsQueryVariables = Exact<{
  categoryId: Scalars['ID']['input'];
  groupId: Scalars['String']['input'];
}>;


export type GetTournamentGroupRankingsQuery = { __typename?: 'Query', tournamentGroupRankings: Array<{ __typename?: 'PlayerRanking', registrationId: string, playerName?: string | null, avatarUrl?: string | null, club?: string | null, seed?: number | null, rank: number, matchesPlayed: number, matchesWon: number, matchesLost: number, setsWon: number, setsLost: number, pointsWon: number, pointsLost: number, winRate: number, groupPoints?: number | null }> };

export type ExportTournamentRegistrationsQueryVariables = Exact<{
  tournamentId: Scalars['ID']['input'];
  filter?: InputMaybe<RegistrationFilterInput>;
}>;


export type ExportTournamentRegistrationsQuery = { __typename?: 'Query', exportTournamentRegistrations: Array<{ __typename?: 'TournamentRegistration', _id: string, tournamentId: string, categoryId: string, userId?: string | null, registeredByUserId: string, athleteName: string, avatarUrl?: string | null, dateOfBirth?: string | null, school?: string | null, club?: string | null, guardianName?: string | null, guardianPhone?: string | null, email?: string | null, phone?: string | null, notes?: string | null, seed?: number | null, bibNumber?: number | null, paymentAmount?: number | null, paymentProofUrl?: string | null, identityProofUrl?: string | null, registrationStatus: RegistrationStatus, paymentStatus: TournamentPaymentStatus, rejectionReason?: string | null, reviewedBy?: string | null, reviewedAt?: string | null, createdAt: string, updatedAt: string, category?: { __typename?: 'TournamentCategory', _id: string, title: string, ageLabel?: string | null, gender: TournamentGender, matchType: MatchType, format: TournamentFormat } | null, members?: Array<{ __typename?: 'EntryMember', userId?: string | null, name: string, avatarUrl?: string | null, phone?: string | null, email?: string | null, dateOfBirth?: string | null, club?: string | null, school?: string | null }> | null }> };

export type PreviewRepackCourtScheduleQueryVariables = Exact<{
  input: RepackCourtScheduleInput;
}>;


export type PreviewRepackCourtScheduleQuery = { __typename?: 'Query', previewRepackCourtSchedule: { __typename?: 'RepackCourtSchedulePreviewResult', anchorMatchId: string, courtName: string, calendarDate: string, totalAffected: number, overdueCount: number, backlogCount: number, warnings: Array<string>, preview: Array<{ __typename?: 'ScheduleShiftPreview', matchId: string, matchNumber: number, oldScheduledAt: string, newScheduledAt: string }> } };

export type PreviewManualKnockoutDrawQueryVariables = Exact<{
  input: PreviewManualKnockoutDrawInput;
}>;


export type PreviewManualKnockoutDrawQuery = { __typename?: 'Query', previewManualKnockoutDraw: { __typename?: 'ManualKnockoutDrawPreview', valid: boolean, bracketSize: number, totalByes: number, r1TvTCount: number, maxR1TvT: number, layoutHints: { __typename?: 'ManualKnockoutLayoutHints', approvedCount: number, r1PairCount: number, minR1TvT: number, structuralEmptyPairs: number, r1WalkoverCount: number, r1TvTCount: number, r2TvTCount: number, r2WalkoverCount: number }, errors: Array<{ __typename?: 'ManualKnockoutPreviewError', code: string, message: string, pairIndex?: number | null, slotIndex?: number | null }>, matchupRows: Array<{ __typename?: 'ManualKnockoutMatchupPreviewRow', player1Name: string, player2Name: string, isR1ByeWalkover: boolean, meetingRound: number, meetingRoundLabel: string, r1PairIndex?: number | null }> } };

export type MatchScoreUpdatedSubscriptionVariables = Exact<{
  _matchId: Scalars['ID']['input'];
}>;


export type MatchScoreUpdatedSubscription = { __typename?: 'Subscription', matchScoreUpdated: { __typename?: 'MatchScorecard', _id: string, matchId: string, tournamentId: string, categoryId: string, status: ScorecardStatus, bestOf: number, currentSetIndex: number, servingPlayer?: number | null, leftSidePlayer?: number | null, elapsedSeconds: number, createdAt: string, updatedAt: string, matchSetup?: { __typename?: 'MatchSetupSnapshot', setupMethod: MatchSetupMethod, coinTossWinner?: number | null, coinTossChoice?: CoinTossChoice | null, decidedAt: string } | null, sets: Array<{ __typename?: 'ScorecardSet', setNumber: number, player1Score: number, player2Score: number, isComplete: boolean, winner?: number | null }>, pointHistory: Array<{ __typename?: 'PointEvent', id: string, scoringPlayer: number, servingPlayer: number, setNumber: number, scoreAfter: Array<number>, timestamp: string }>, correctionHistory?: Array<{ __typename?: 'CorrectionEvent', id: string, actorId: string, reason: string, action: MatchCorrectionAction, timestamp: string }> | null, scoringConfig: { __typename?: 'ScoringConfig', scoringSystem: ScoringSystem, bestOf: number, setsToWin: number, pointsPerSet: number, deuceEnabled: boolean, deuceAt: number, tiebreakEnabled: boolean, tiebreakPoints: number, winByMargin: number, maxPoints: number, periodsCount: number, periodDurationMinutes: number } } };

export type TournamentMatchesUpdatedSubscriptionVariables = Exact<{
  _tournamentId: Scalars['ID']['input'];
}>;


export type TournamentMatchesUpdatedSubscription = { __typename?: 'Subscription', tournamentMatchesUpdated: string };

export type TournamentStatusChangedSubscriptionVariables = Exact<{
  _tournamentId: Scalars['ID']['input'];
}>;


export type TournamentStatusChangedSubscription = { __typename?: 'Subscription', tournamentStatusChanged: string };

export type UploadTournamentImageMutationVariables = Exact<{
  input: UploadTournamentImageInput;
}>;


export type UploadTournamentImageMutation = { __typename?: 'Mutation', uploadTournamentImage: { __typename?: 'UploadPostMediaResponse', url: string, key: string } };

export type UploadAvatarMutationVariables = Exact<{
  input: UploadAvatarInput;
}>;


export type UploadAvatarMutation = { __typename?: 'Mutation', uploadAvatar: { __typename?: 'UploadResponse', key: string, url: string, user: { __typename?: 'User', _id: string, photoURL?: string | null } } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'User', _id: string, email?: string | null, phone?: string | null, fullName: string, displayName: string, userName: string, role: UserRole, photoURL?: string | null, bio?: string | null, club?: string | null, gender?: Gender | null, dateOfBirth?: string | null, location?: { __typename?: 'Location', city?: string | null, country?: string | null, displayText?: string | null, coordinates?: { __typename?: 'Coordinates', latitude: number, longitude: number } | null } | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', _id: string, email?: string | null, phone?: string | null, fullName: string, displayName: string, userName: string, role: UserRole, isOwner: boolean, portalCapabilities: Array<PortalCapability>, hasVenuePortalAccess: boolean, photoURL?: string | null, bio?: string | null, club?: string | null, gender?: Gender | null, dateOfBirth?: string | null, location?: { __typename?: 'Location', city?: string | null, country?: string | null, displayText?: string | null, coordinates?: { __typename?: 'Coordinates', latitude: number, longitude: number } | null } | null } };

export type SearchUserByPhoneQueryVariables = Exact<{
  phone: Scalars['String']['input'];
}>;


export type SearchUserByPhoneQuery = { __typename?: 'Query', searchUserByPhone?: { __typename?: 'UserContactLookup', _id: string, fullName: string, displayName: string, phone: string, email?: string | null, photoURL?: string | null } | null };

export type GetUserProfileQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetUserProfileQuery = { __typename?: 'Query', getUserProfile: { __typename?: 'User', _id: string, email?: string | null, phone?: string | null, fullName: string, displayName: string, userName: string, role: UserRole, isOwner: boolean, portalCapabilities: Array<PortalCapability>, isActive: boolean, isSuspended: boolean, photoURL?: string | null, accountOrigin?: AccountOrigin | null, lastLoginAt?: string | null, createdAt: string } };

export type ApproveVenueRequestMutationVariables = Exact<{
  requestId: Scalars['ID']['input'];
  adminNote?: InputMaybe<Scalars['String']['input']>;
}>;


export type ApproveVenueRequestMutation = { __typename?: 'Mutation', approveVenueRequest: { __typename?: 'VenueRequest', _id: string, status: VenueRequestStatus, reviewedAt?: string | null, reviewedBy?: string | null, adminNote?: string | null } };

export type RejectVenueRequestMutationVariables = Exact<{
  requestId: Scalars['ID']['input'];
  rejectionReason: Scalars['String']['input'];
}>;


export type RejectVenueRequestMutation = { __typename?: 'Mutation', rejectVenueRequest: { __typename?: 'VenueRequest', _id: string, status: VenueRequestStatus, rejectionReason?: string | null, reviewedAt?: string | null, reviewedBy?: string | null } };

export type GetAllVenueRequestsQueryVariables = Exact<{
  status?: InputMaybe<VenueRequestStatus>;
  pagination?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<CursorSortInput>;
}>;


export type GetAllVenueRequestsQuery = { __typename?: 'Query', allVenueRequestsConnection: { __typename?: 'VenueRequestConnection', totalCount: number, edges: Array<{ __typename?: 'VenueRequestEdge', cursor: string, node: { __typename?: 'VenueRequest', _id: string, requesterId: string, name: string, description?: string | null, sportTypes: Array<SportType>, status: VenueRequestStatus, phoneNumber?: string | null, email?: string | null, coverImageUrl?: string | null, images?: Array<string> | null, rejectionReason?: string | null, adminNote?: string | null, createdAt: string, updatedAt: string, reviewedAt?: string | null, reviewedBy?: string | null, location: { __typename?: 'RequestLocation', address: string, city?: string | null, district?: string | null, ward?: string | null, latitude?: number | null, longitude?: number | null }, courts: Array<{ __typename?: 'RequestCourtInfo', name: string, sportType: SportType, pricePerHour: number, peakPricePerHour: number, isIndoor?: boolean | null }>, requester?: { __typename?: 'User', _id: string, displayName: string, userName: string, photoURL?: string | null } | null, reviewedByAdmin?: { __typename?: 'User', _id: string, displayName: string } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type GetVenueRequestStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetVenueRequestStatsQuery = { __typename?: 'Query', venueRequestStats: { __typename?: 'VenueRequestStats', totalRequests: number, pendingRequests: number, approvedRequests: number, rejectedRequests: number } };
