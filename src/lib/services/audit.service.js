import {db} from '@/lib/db';
export async function writeAuditLog({adminId,action,entityType,entityId=null,metadata=null}){
  try {
    await db.execute('INSERT INTO audit_logs(admin_id,action,entity_type,entity_id,metadata) VALUES(?,?,?,?,?)',[adminId||null,action,entityType,entityId?String(entityId):null,metadata?JSON.stringify(metadata):null]);
    return true;
  } catch (error) {
    console.error('Denetim kaydı yazılamadı:', { action, entityType, entityId, error });
    return false;
  }
}
export async function getAuditLogs(limit=200){const safe=Math.min(Math.max(Number(limit)||200,1),500);const[rows]=await db.execute(`SELECT l.id,l.action,l.entity_type,l.entity_id,l.metadata,l.created_at,a.full_name AS admin_name FROM audit_logs l LEFT JOIN admins a ON a.id=l.admin_id ORDER BY l.created_at DESC LIMIT ${safe}`);return rows;}
