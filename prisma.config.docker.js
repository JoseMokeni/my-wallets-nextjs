// Simplified Prisma config for Docker production environment
// No external dependencies required

module.exports = {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
