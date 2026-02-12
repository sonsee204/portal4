/**
 * Shared portal data types — used by mock data and page components.
 */

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

export type UserRole = 'admin' | 'partner' | 'user' | 'coach' | 'moderator';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'banned';

export interface PortalUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  online?: boolean;
  phone?: string;
  joinedAt?: string;
}

/* ------------------------------------------------------------------ */
/* Transactions / Finance                                              */
/* ------------------------------------------------------------------ */

export type TransactionType = 'deposit' | 'withdrawal';
export type TransactionStatus = 'success' | 'pending' | 'failed';

export interface Transaction {
  _id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  memberType?: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  date: string;
  time: string;
}

/* ------------------------------------------------------------------ */
/* Tournaments                                                         */
/* ------------------------------------------------------------------ */

export type TournamentStatus = 'live' | 'registration' | 'completed' | 'upcoming';
export type SportType = 'football' | 'badminton' | 'pickleball' | 'tennis';

export interface Tournament {
  _id: string;
  name: string;
  sport: SportType;
  category: string;
  status: TournamentStatus;
  participants: number;
  maxParticipants: number;
  prizePool: string;
}

export type MatchStatus = 'live' | 'finished' | 'scheduled' | 'upcoming';

export interface MatchPlayer {
  name: string;
  avatar?: string;
  score?: number;
  winner?: boolean;
}

export interface BracketMatch {
  _id: string;
  matchNumber: number;
  status: MatchStatus;
  players: [MatchPlayer, MatchPlayer];
  time?: string;
}

/* ------------------------------------------------------------------ */
/* Ecosystem                                                           */
/* ------------------------------------------------------------------ */

export interface SportModule {
  sport: SportType;
  label: string;
  activeUsers: string;
  status: 'online' | 'maintenance' | 'offline';
  enabled: boolean;
  icon: string;
}

/* ------------------------------------------------------------------ */
/* Bookings / Calendar                                                 */
/* ------------------------------------------------------------------ */

export type BookingStatus = 'completed' | 'cancelled' | 'pending' | 'paid';

export interface Booking {
  _id: string;
  sport: SportType;
  venue: string;
  location: string;
  date: string;
  time: string;
  status: BookingStatus;
}

export interface CalendarBooking {
  _id: string;
  venue: string;
  court: string;
  startHour: number;
  endHour: number;
  status: 'paid' | 'pending' | 'maintenance';
  userName?: string;
}

/* ------------------------------------------------------------------ */
/* Moderation                                                          */
/* ------------------------------------------------------------------ */

export type ReportCategory = 'hate_speech' | 'spam' | 'scam' | 'other';
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export interface Report {
  _id: string;
  ticketId: string;
  category: ReportCategory;
  reporterCount: number;
  createdAt: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  status: ReportStatus;
}

/* ------------------------------------------------------------------ */
/* Support Tickets                                                     */
/* ------------------------------------------------------------------ */

export type TicketStatus = 'new' | 'open' | 'replied' | 'closed';
export type MessageSender = 'user' | 'admin' | 'system';

export interface SupportTicket {
  _id: string;
  subject: string;
  userName: string;
  userAvatar?: string;
  status: TicketStatus;
  lastMessage: string;
  updatedAt: string;
  unread?: boolean;
}

export interface ChatMessage {
  _id: string;
  sender: MessageSender;
  content: string;
  time: string;
  date?: string;
  image?: string;
}

/* ------------------------------------------------------------------ */
/* CMS / Ops                                                           */
/* ------------------------------------------------------------------ */

export type MatchmakingStatus = 'searching' | 'matched' | 'cancelled';

export interface MatchmakingLog {
  _id: string;
  hostName: string;
  hostAvatar?: string;
  hostId: string;
  sport: SportType;
  level: string;
  time: string;
  status: MatchmakingStatus;
  reputationScore: number;
}

export interface Banner {
  _id: string;
  title: string;
  imageUrl?: string;
  status: 'active' | 'scheduled' | 'paused';
  deepLink?: string;
  duration?: number;
}

/* ------------------------------------------------------------------ */
/* Audit Logs                                                          */
/* ------------------------------------------------------------------ */

export type AuditAction = 'lock_account' | 'auto_scale' | 'delete_group' | 'update_profile' | 'api_key_gen' | 'login' | 'config_change';
export type AuditStatus = 'success' | 'failed';

export interface AuditLog {
  _id: string;
  adminName: string;
  adminInitials: string;
  action: AuditAction;
  actionLabel: string;
  target: string;
  ip: string;
  timestamp: string;
  status: AuditStatus;
}

/* ------------------------------------------------------------------ */
/* RBAC / Settings                                                     */
/* ------------------------------------------------------------------ */

export interface Permission {
  key: string;
  label: string;
  category: string;
}

export interface ApiKey {
  _id: string;
  name: string;
  clientId: string;
  secret: string;
  status: 'active' | 'test';
  createdAt: string;
}
