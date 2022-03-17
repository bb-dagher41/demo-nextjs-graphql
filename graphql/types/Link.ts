import { objectType, extendType, intArg, stringArg, arg } from "nexus";
import { User } from "./User";
import DataLoader from "dataloader";
import prisma from "../../lib/prisma";

const batchFindUsers = async (ids: string[]) => {
  const userLinks = await prisma.userLink.findMany({
    where: {
      post_id: {in: ids},
    },
    include: {
      user: true,
    },
  });
  const userMap = userLinks.reduce((memo, current) => {
    memo[current.post_id] = current.user
    return memo;
  }, {});
  
  return ids.map(id => [userMap[id]] || null);
}

const userLoader = new DataLoader(batchFindUsers)

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.string("id");
    t.string("title");
    t.string("url");
    t.string("description");
    t.string("imageUrl");
    t.string("category");
    t.list.field("users", {
      type: User,
      async resolve(_parent, _args, _ctx) {
        const user = await userLoader.load(_parent.id)
        return user;
      },
    });
  },
});

export const LinksEdge = objectType({
  name: "LinksEdge",
  definition(t) {
    t.field("node", {
      type: Link,
    });
  },
});

export const PageInfo = objectType({
  name: "PageInfo",
  definition(t) {
    t.string("endCursor");
    t.boolean("hasNextPage");
  },
});

export const LinkResponse = objectType({
  name: "LinkResponse",
  definition(t) {
    t.field("pageInfo", { type: PageInfo });
    t.list.field("edges", {
      type: LinksEdge,
    });
  },
});

export const LinksQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("links", {
      type: "LinkResponse",
      args: {
        first: intArg(),
        after: stringArg(),
      },
      async resolve(_, args, ctx) {
        let query = {
          take: args.first + 1,
          orderBy: {
            id: "asc",
          }
        };
        if (args.after) {
          query["skip"] = 1 // skip the first id since this was the last id past in
          query["cursor"] = { id: args.after };
        }

        let results = await ctx.prisma.link.findMany(query);

        let hasNextPage = false;
        if (results.length > args.first) {
          hasNextPage = true;
          results = results.slice(0, results.length-1);
        }

        return {
          pageInfo: {
            endCursor: (results.length && results[results.length-1].id) || null,
            hasNextPage,
          },
          edges: results.map((link: { id: any; }) => ({
            node: link,
          })),
        };
      }
    });
  },
});
