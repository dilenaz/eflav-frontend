import { NextResponse } from 'next/server';
import { requireAdminRole } from '@/lib/admin-session';
import { writeAuditLog } from '@/lib/services/audit.service';
import { activitySchema } from '@/lib/validations/activity.schema';
import { createActivity,getActivityBySlug,getAllActivities } from '@/lib/services/activity.service';

export async function GET(){if(!(await requireAdminRole(['admin','editor'])))return NextResponse.json({success:false},{status:401});return NextResponse.json({success:true,data:await getAllActivities()});}
export async function POST(request){try{const admin=await requireAdminRole(['admin','editor']);if(!admin)return NextResponse.json({success:false,message:'Yetkisiz işlem.'},{status:401});const v=activitySchema.safeParse(await request.json());if(!v.success)return NextResponse.json({success:false,message:'Faaliyet bilgileri geçersiz.',errors:v.error.flatten().fieldErrors},{status:400});if(await getActivityBySlug(v.data.slug))return NextResponse.json({success:false,message:'Bu slug kullanılıyor.'},{status:409});const id=await createActivity(v.data,Number(admin.sub));await writeAuditLog({adminId:Number(admin.sub),action:'activity.created',entityType:'activity',entityId:id,metadata:{title:v.data.title,status:v.data.status}});return NextResponse.json({success:true,data:{id},message:'Faaliyet oluşturuldu.'},{status:201});}catch(e){console.error('Faaliyet oluşturma hatası:',e);return NextResponse.json({success:false,message:'Faaliyet oluşturulamadı.'},{status:500});}}
