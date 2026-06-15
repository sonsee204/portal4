/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * This source code is the intellectual property of Lê Trung Hiếu.
 * Unauthorized copying, modification, distribution, or use of this code
 * is strictly prohibited without prior written consent.
 */

'use client';

import { useMutation } from '@apollo/client/react';
import {
  GET_MESSAGE_REPORTS_FOR_ADMIN,
  GET_MESSAGE_REPORT_STATS,
  GET_POST_REPORTS_FOR_ADMIN,
  GET_POST_REPORT_STATS,
  GET_USER_REPORTS_FOR_ADMIN,
  GET_USER_REPORT_STATS,
} from '@/graphql/moderation/queries';
import {
  DELETE_MESSAGE_BY_ADMIN,
  DELETE_POST_BY_ADMIN,
  UPDATE_MESSAGE_REPORT_STATUS,
  UPDATE_REPORT_STATUS,
  UPDATE_USER_REPORT_STATUS,
} from '@/graphql/moderation/mutations';
import { ADMIN_SUSPEND_USER } from '@/graphql/admin/mutations';
import { PostReportStatus } from '@/graphql/generated';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import type {
  MessageReportStatus,
  UserReportStatus,
} from '../types';
import type { ModerationPageData } from './useModerationPageData';

export function useModerationPageActions(data: ModerationPageData) {
  const {
    postFilterVar,
    postPaginationVar,
    userFilterVar,
    userPaginationVar,
    msgFilterVar,
    msgPaginationVar,
    setStatusFilter,
    setSelectedId,
    setUserStatusFilter,
    setSelectedUserReportId,
    setMsgStatusFilter,
    setSelectedMsgReportId,
  } = data;

  const [updateStatus, { loading: updatingStatus }] = useMutation(
    UPDATE_REPORT_STATUS,
    createMutationOptions(
      'UpdateReportStatus',
      'Cập nhật trạng thái thành công',
    ),
  );

  const [deletePost, { loading: deletingPost }] = useMutation(
    DELETE_POST_BY_ADMIN,
    createMutationOptions('DeletePostByAdmin', 'Bài viết đã được xóa'),
  );

  const [updateUserReportStatus, { loading: updatingUserStatus }] = useMutation(
    UPDATE_USER_REPORT_STATUS,
    createMutationOptions(
      'UpdateUserReportStatus',
      'Cập nhật trạng thái thành công',
    ),
  );

  const [updateMsgReportStatus, { loading: updatingMsgStatus }] = useMutation(
    UPDATE_MESSAGE_REPORT_STATUS,
    createMutationOptions(
      'UpdateMessageReportStatus',
      'Cập nhật trạng thái thành công',
    ),
  );

  const [deleteMessage, { loading: deletingMessage }] = useMutation(
    DELETE_MESSAGE_BY_ADMIN,
    createMutationOptions('DeleteMessageByAdmin', 'Tin nhắn đã được xóa'),
  );

  const [suspendUser, { loading: suspendingUser }] = useMutation(
    ADMIN_SUSPEND_USER,
    createMutationOptions('AdminSuspendUser', 'Khóa tài khoản thành công'),
  );

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as PostReportStatus | 'ALL');
    setSelectedId(null);
  };

  const handleUserStatusFilterChange = (value: string) => {
    setUserStatusFilter(value as UserReportStatus | 'ALL');
    setSelectedUserReportId(null);
  };

  const handleMsgStatusFilterChange = (value: string) => {
    setMsgStatusFilter(value as MessageReportStatus | 'ALL');
    setSelectedMsgReportId(null);
  };

  const handleUpdateStatus = async (
    reportId: string,
    status: PostReportStatus,
    notes?: string,
  ) => {
    await updateStatus({
      variables: { input: { reportId, status, notes } },
      refetchQueries: [
        {
          query: GET_POST_REPORTS_FOR_ADMIN,
          variables: { filter: postFilterVar, pagination: postPaginationVar },
        },
        { query: GET_POST_REPORT_STATS },
      ],
    });
  };

  const handleUpdateUserReportStatus = async (
    reportId: string,
    status: UserReportStatus,
    notes?: string,
  ) => {
    await updateUserReportStatus({
      variables: { input: { reportId, status, notes } },
      refetchQueries: [
        {
          query: GET_USER_REPORTS_FOR_ADMIN,
          variables: { filter: userFilterVar, pagination: userPaginationVar },
        },
        { query: GET_USER_REPORT_STATS },
      ],
    });
  };

  const handleDeletePost = async (postId: string) => {
    if (
      !window.confirm(
        'Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.',
      )
    ) {
      return;
    }
    await deletePost({
      variables: { postId },
      refetchQueries: [
        {
          query: GET_POST_REPORTS_FOR_ADMIN,
          variables: { filter: postFilterVar, pagination: postPaginationVar },
        },
        { query: GET_POST_REPORT_STATS },
      ],
    });
    setSelectedId(null);
  };

  const handleSuspendUser = async (userId: string, reason?: string) => {
    await suspendUser({
      variables: { userId, reason },
      refetchQueries: [
        {
          query: GET_POST_REPORTS_FOR_ADMIN,
          variables: { filter: postFilterVar, pagination: postPaginationVar },
        },
        {
          query: GET_USER_REPORTS_FOR_ADMIN,
          variables: { filter: userFilterVar, pagination: userPaginationVar },
        },
        { query: GET_POST_REPORT_STATS },
        { query: GET_USER_REPORT_STATS },
      ],
    });
  };

  const handleUpdateMsgReportStatus = async (
    reportId: string,
    status: MessageReportStatus,
    notes?: string,
  ) => {
    await updateMsgReportStatus({
      variables: { input: { reportId, status, notes } },
      refetchQueries: [
        {
          query: GET_MESSAGE_REPORTS_FOR_ADMIN,
          variables: { filter: msgFilterVar, pagination: msgPaginationVar },
        },
        { query: GET_MESSAGE_REPORT_STATS },
      ],
    });
  };

  const handleDeleteMessage = async (messageId: string) => {
    await deleteMessage({
      variables: { messageId },
      refetchQueries: [
        {
          query: GET_MESSAGE_REPORTS_FOR_ADMIN,
          variables: { filter: msgFilterVar, pagination: msgPaginationVar },
        },
        { query: GET_MESSAGE_REPORT_STATS },
      ],
    });
  };

  return {
    updatingStatus,
    deletingPost,
    updatingUserStatus,
    updatingMsgStatus,
    deletingMessage,
    suspendingUser,
    handleStatusFilterChange,
    handleUserStatusFilterChange,
    handleMsgStatusFilterChange,
    handleUpdateStatus,
    handleUpdateUserReportStatus,
    handleDeletePost,
    handleSuspendUser,
    handleUpdateMsgReportStatus,
    handleDeleteMessage,
  };
}

export type ModerationPageActions = ReturnType<typeof useModerationPageActions>;
