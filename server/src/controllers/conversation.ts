import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';

const CONTENT_TYPE = 'plugin::ai-sdk.conversation' as const;

function getAdminUserId(ctx: Context): number | null {
  const id = ctx.state?.user?.id;
  return typeof id === 'number' ? id : null;
}

const conversationController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx: Context) {
    const adminUserId = getAdminUserId(ctx);
    if (!adminUserId) {
      ctx.status = 401;
      ctx.body = { error: 'Unauthorized' };
      return;
    }

    const conversations = await strapi.documents(CONTENT_TYPE).findMany({
      filters: { adminUserId },
      fields: ['title', 'createdAt', 'updatedAt'],
      sort: { updatedAt: 'desc' },
    });

    ctx.body = { data: conversations };
  },

  async findOne(ctx: Context) {
    const adminUserId = getAdminUserId(ctx);
    if (!adminUserId) {
      ctx.status = 401;
      ctx.body = { error: 'Unauthorized' };
      return;
    }

    const { id } = ctx.params;
    const conversation = await strapi.documents(CONTENT_TYPE).findOne({
      documentId: id,
    });

    if (!conversation || conversation.adminUserId !== adminUserId) {
      ctx.status = 404;
      ctx.body = { error: 'Conversation not found' };
      return;
    }

    ctx.body = { data: conversation };
  },

  async create(ctx: Context) {
    const adminUserId = getAdminUserId(ctx);
    if (!adminUserId) {
      ctx.status = 401;
      ctx.body = { error: 'Unauthorized' };
      return;
    }

    const { title, messages } = ctx.request.body as { title?: string; messages?: unknown[] };

    const conversation = await strapi.documents(CONTENT_TYPE).create({
      data: {
        title: title || 'New conversation',
        messages: messages || [],
        adminUserId,
      },
    });

    ctx.status = 201;
    ctx.body = { data: conversation };
  },

  async update(ctx: Context) {
    const adminUserId = getAdminUserId(ctx);
    if (!adminUserId) {
      ctx.status = 401;
      ctx.body = { error: 'Unauthorized' };
      return;
    }

    const { id } = ctx.params;
    const existing = await strapi.documents(CONTENT_TYPE).findOne({
      documentId: id,
    });

    if (!existing || existing.adminUserId !== adminUserId) {
      ctx.status = 404;
      ctx.body = { error: 'Conversation not found' };
      return;
    }

    const { title, messages } = ctx.request.body as { title?: string; messages?: unknown[] };

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (messages !== undefined) data.messages = messages;

    const conversation = await strapi.documents(CONTENT_TYPE).update({
      documentId: id,
      data: data as any,
    });

    ctx.body = { data: conversation };
  },

  async delete(ctx: Context) {
    const adminUserId = getAdminUserId(ctx);
    if (!adminUserId) {
      ctx.status = 401;
      ctx.body = { error: 'Unauthorized' };
      return;
    }

    const { id } = ctx.params;
    const existing = await strapi.documents(CONTENT_TYPE).findOne({
      documentId: id,
    });

    if (!existing || existing.adminUserId !== adminUserId) {
      ctx.status = 404;
      ctx.body = { error: 'Conversation not found' };
      return;
    }

    await strapi.documents(CONTENT_TYPE).delete({ documentId: id });

    ctx.status = 200;
    ctx.body = { data: { documentId: id } };
  },
});

export default conversationController;
