import 'dotenv/config'
import { defineConfig } from '@prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    // This allows the CLI to work locally while letting Vercel 
    // handle the environment variable during the build.
    url: process.env.DATABASE_URL,
  },
})