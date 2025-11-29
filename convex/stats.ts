import { mutation, query } from "./_generated/server";

export const updateThumbnailCount = mutation({
  args: {},
  handler: async (ctx) => {
    const stats = await ctx.db.query("stats").first();

    if (!stats) {
      return await ctx.db.insert("stats", { thumbnails: 1 });
    }

    return await ctx.db.patch(stats._id, {
      thumbnails: stats.thumbnails + 1,
    });
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const stats = await ctx.db.query("stats").first();
    return stats ?? { thumbnails: 0 };
  },
});
