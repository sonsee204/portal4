/**
 * Mock data types -- used ONLY by lib/mock-data.ts and pages that still consume mock data.
 * These will be replaced by real API types as each feature migrates to real backends.
 *
 * NOTE: MockUserRole / MockUser are intentionally prefixed to avoid conflicts
 * with the real UserRole (from types/auth.ts) and User (from types/user.ts).
 */

/* ------------------------------------------------------------------ */
/* Users (mock-only)                                                   */
/* ------------------------------------------------------------------ */

export type MockUserRole = 'admin' | 'partner' | 'user' | 'coach' | 'moderator';
export type MockUserStatus = 'active' | 'inactive' | 'pending' | 'banned';

export interface MockUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: MockUserRole;
  status: MockUserStatus;
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

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
