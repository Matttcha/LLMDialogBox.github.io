/**
 * generateConversationId 生成用于性能监控的对话id
 * @returns
 */
export const generateConversationId = () =>
  `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
