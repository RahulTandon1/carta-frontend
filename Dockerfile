# Install deps & build
FROM node:20 AS builder

# Pass NEXT_PUBLIC_BACKEND_URL as build-arg & env var

# Doing this is the ideal implementation but it seems things were not working as planned
# ARG NEXT_PUBLIC_BACKEND_URL
# ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
# RUN echo "NEXT_PUBLIC_BACKEND_URL is $NEXT_PUBLIC_BACKEND_URL"
WORKDIR /app
COPY . .

RUN npm install
# ARG NEXT_PUBLIC_BACKEND_URL
# unfortunately hardcoding. Spent time trying to achieve the ideal implementation above ^ but couldn't pull it off in time
ENV NEXT_PUBLIC_BACKEND_URL=chat-backend-484449034118.us-central1.run.app
RUN npm run build

# Serve using Next.js built-in server (Edge-ready)
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
