import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';

const CONTENT_TYPE = 'plugin::ai-sdk.task' as const;

function getAdminUserId(ctx: Context): number | null {
  const id = ctx.state?.user?.id;
  return typeof id === 'number' ? id : null;
}

const taskController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx: Context) {
    const adminUserId = getAdminUserId(ctx);
    if (!adminUserId) {
      ctx.status = 401;
      ctx.body = { error: 'Unauthorized' };
      return;
    }

    const tasks = await strapi.documents(CONTENT_TYPE).findMany({
      filters: { adminUserId },
      sort: { createdAt: 'desc' },
    });

    ctx.body = { data: tasks };
  },

  async create(ctx: Context) {
    const adminUserId = getAdminUserId(ctx);
    if (!adminUserId) {
      ctx.status = 401;
      ctx.body = { error: 'Unauthorized' };
      return;
    }

    const body = ctx.request.body as Record<string, unknown>;

    const task = await strapi.documents(CONTENT_TYPE).create({
      data: {
        title: body.title,
        description: body.description,
        content: body.content,
        done: body.done ?? false,
        priority: body.priority ?? 'medium',
        consequence: body.consequence ?? 3,
        impact: body.impact ?? 3,
        dueDate: body.dueDate,
        adminUserId,
      },
    });

    ctx.status = 201;
    ctx.body = { data: task };
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
      ctx.body = { error: 'Task not found' };
      return;
    }

    const body = ctx.request.body as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    for (const key of ['title', 'description', 'content', 'done', 'priority', 'consequence', 'impact', 'dueDate']) {
      if (body[key] !== undefined) data[key] = body[key];
    }

    const task = await strapi.documents(CONTENT_TYPE).update({
      documentId: id,
      data: data as any,
    });

    ctx.body = { data: task };
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
      ctx.body = { error: 'Task not found' };
      return;
    }

    await strapi.documents(CONTENT_TYPE).delete({ documentId: id });

    ctx.status = 200;
    ctx.body = { data: { documentId: id } };
  },
});

export default taskController;
