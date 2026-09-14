import { ImageResponse } from 'next/og';

export const alt = 'Karabük Eflani Hayır Kervanı Vakfı';
export const size = { width:1200, height:630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',padding:'80px',background:'linear-gradient(135deg, #5f1024 0%, #801b38 62%, #c99b45 100%)',color:'white'}}><div style={{display:'flex',fontSize:28,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:'#f3d89e'}}>Eflani’den yükselen dayanışma</div><div style={{display:'flex',maxWidth:1050,marginTop:28,fontSize:66,lineHeight:1.08,fontWeight:900}}>Karabük Eflani<br/>Hayır Kervanı Vakfı</div><div style={{display:'flex',marginTop:34,fontSize:27,color:'#fff4df'}}>Eğitim • Sosyal Yardım • Sağlık • Kültürel Miras</div></div>, size);
}
