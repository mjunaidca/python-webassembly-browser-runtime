import { Redis } from "@upstash/redis"

// Local type – adjust if you have a central definition elsewhere.
export interface NotebookFile {
  id: string
  name: string
  content: string
  size: number
  lastModified: Date
  userId?: string
}

// --- ENV VALIDATION ---------------------------------------------------------
const UPSTASH_URL = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL
const UPSTASH_TOKEN = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN
const HAS_UPSTASH = Boolean(UPSTASH_URL && UPSTASH_TOKEN)
// ----------------------------------------------------------------------------

export class UpstashStorage {
  redis: Redis | undefined
  userId: string | undefined

  constructor() {
    // Abort early if env vars are missing (client runs in the browser).
    if (!HAS_UPSTASH) {
      console.warn(
        "[UpstashStorage] ENV vars missing – persistence disabled. " +
          "Add NEXT_PUBLIC_UPSTASH_REDIS_REST_URL and " +
          "NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN to enable cloud sync.",
      )
      return
    }

    // Browser-safe Upstash client.
    this.redis = new Redis({ url: UPSTASH_URL!, token: UPSTASH_TOKEN! })

    // Generate or retrieve a per-browser user id
    this.userId = this.getUserId()
  }

  /** Return the current user-id (or “server” during SSR) */
  getCurrentUserId(): string {
    return this.userId ?? "server"
  }

  private getUserId(): string {
    if (typeof window === "undefined") return "server" // SSR

    let userId = localStorage.getItem("user-id")
    if (!userId) {
      userId = crypto.randomUUID()
      localStorage.setItem("user-id", userId)
    }
    return userId
  }

  /** Add or update a notebook */
  async saveNotebook(nb: NotebookFile) {
    if (!this.redis || !this.userId) return
    const key = `notebook:${nb.id}`
    await this.redis.hset(key, {
      ...nb,
      lastModified: nb.lastModified.toISOString(),
    })
    // keep an index of this user’s notebooks
    await this.redis.sadd(`user:${this.userId}:notebooks`, nb.id)
  }

  /** Return all notebooks that belong to the current user */
  async listNotebooks(): Promise<NotebookFile[]> {
    if (!this.redis || !this.userId) return []

    // get the ids from the indexed set – **no wildcard, no regex**
    const ids = await this.redis.smembers<string>(`user:${this.userId}:notebooks`)
    if (!ids.length) return []

    // pipeline → fetch all hashes in one round-trip
    const pipeline = this.redis.pipeline()
    ids.forEach((id) => pipeline.hgetall<Record<string, string>>(`notebook:${id}`))
    const raw = await pipeline.exec()

    return raw
      .filter((res) => res.data && Object.keys(res.data).length)
      .map((res) => {
        const n = res.data!
        return {
          id: n.id,
          name: n.name,
          content: n.content,
          size: Number(n.size),
          lastModified: new Date(n.lastModified),
          userId: n.userId,
        } as NotebookFile
      })
      .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
  }

  /** Delete notebook and remove it from the user’s index */
  async deleteNotebook(id: string) {
    if (!this.redis || !this.userId) return
    await this.redis.del(`notebook:${id}`)
    await this.redis.srem(`user:${this.userId}:notebooks`, id)
  }

  async isAvailable(): Promise<boolean> {
    if (!this.redis) return false
    try {
      await this.redis.ping()
      return true
    } catch {
      return false
    }
  }
}

// ---- Singleton instance used across the app -------------------------------
export const upstashStorage = new UpstashStorage()
export default upstashStorage // (optional) default export for brevity
