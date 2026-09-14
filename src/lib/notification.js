export async function sendAdminNotification(event, data) {
  const url = process.env.ADMIN_NOTIFICATION_WEBHOOK_URL;
  if (!url) return false;
  try {
    const response = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({event,data,createdAt:new Date().toISOString()}), signal:AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return true;
  } catch (error) {
    console.error('Yönetici bildirimi gönderilemedi:', error);
    return false;
  }
}
