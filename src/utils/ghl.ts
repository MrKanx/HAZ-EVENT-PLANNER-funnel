import { getStoredFbParams } from '@/utils/fbclid'

const GHL_WEBHOOK =
  import.meta.env.VITE_WEBHOOK_REGISTRO ??
  'https://services.leadconnectorhq.com/hooks/dZiSZokzwuadJfuzW9EK/webhook-trigger/HebSJp0aZcq1P01vdzqV'

export function generateEventId(prefix = 'evt'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

export async function trackStage(etapa: string, data: Record<string, string> & { event_id?: string }) {
  try {
    const event_id = data.event_id ?? generateEventId('view')
    const fbParams = getStoredFbParams()
    await fetch(GHL_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ etapa, event_id, ...fbParams, ...data }),
    })
  } catch {
    // silencioso
  }
}
