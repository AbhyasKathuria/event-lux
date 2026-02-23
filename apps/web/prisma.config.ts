import 'dotenv/config'
import { defineConfig } from '@prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    // We changed this to DATABASE_URL to match your environment variables
    url: process.env.DATABASE_URL!,
  },
})