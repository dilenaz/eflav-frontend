const boardMembers = [
  {
    id: 'seref-karakaya',
    full_name: 'Şeref Karakaya',
    role_title: 'Vakıf Yönetim Kurulu Başkanı',
    image_url: '/images/board/seref-karakaya.png',
    image_alt: 'Şeref Karakaya, Vakıf Yönetim Kurulu Başkanı',
    sort_order: 1,
  },
  {
    id: 'cihan-bodur',
    full_name: 'Cihan Bodur',
    role_title: 'Vakıf Genel Sekreteri',
    image_url: '/images/board/cihan-bodur.png',
    image_alt: 'Cihan Bodur, Vakıf Genel Sekreteri',
    sort_order: 2,
  },
  {
    id: 'necdet-unal',
    full_name: 'Necdet Ünal',
    role_title: 'Vakıf Yönetim Kurulu Üyesi',
    image_url: '/images/board/necdet-unal.png',
    image_alt: 'Necdet Ünal, Vakıf Yönetim Kurulu Üyesi',
    sort_order: 3,
  },
  {
    id: 'yuksel-keles',
    full_name: 'Yüksel Keleş',
    role_title: 'Vakıf Yönetim Kurulu Üyesi',
    image_url: '/images/board/yuksel-keles.png',
    image_alt: 'Yüksel Keleş, Vakıf Yönetim Kurulu Üyesi',
    sort_order: 4,
  },
  {
    id: 'yasar-kilic',
    full_name: 'Yaşar Kılıç',
    role_title: 'Vakıf Yönetim Kurulu Üyesi',
    image_url: '/images/board/yasar-kilic.png',
    image_alt: 'Yaşar Kılıç, Vakıf Yönetim Kurulu Üyesi',
    sort_order: 5,
  },
  {
    id: 'burhan-ozdamar',
    full_name: 'Burhan Özdamar',
    role_title: 'Vakıf Yönetim Kurulu Üyesi',
    image_url: '/images/board/burhan-ozdamar.png',
    image_alt: 'Burhan Özdamar, Vakıf Yönetim Kurulu Üyesi',
    sort_order: 6,
  },
  {
    id: 'fatih-kocaturk',
    full_name: 'Fatih Kocatürk',
    role_title: 'Vakıf Avukatı',
    image_url: '/images/board/fatih-kocaturk.png',
    image_alt: 'Fatih Kocatürk, Vakıf Avukatı',
    sort_order: 7,
  },
];

const pages = {
  'ana-sayfa-hakkinda': {
    slug: 'ana-sayfa-hakkinda',
    title: 'Vakfımız Hakkında',
    eyebrow: 'Ana Sayfa',
    summary: 'Karabük Eflani Hayır Kervanı Vakfı, insanı merkeze alan ve toplumsal dayanışmayı güçlendiren çalışmalar yürütür.',
    content: 'Eğitim, sosyal yardım, sağlık, kültürel mirasın korunması ve toplumsal kalkınma alanlarında faaliyet gösteriyoruz.\n\nHayırseverlerin emanetlerini şeffaf, hesap verebilir ve sürdürülebilir bir anlayışla ihtiyaç sahiplerine ulaştırıyoruz.\n\nKurumsal Mesaj\n“İyilik, paylaşıldıkça büyüyen en değerli mirastır. Karabük Eflani Hayır Kervanı Vakfı olarak; insanı merkeze alan, güveni temel ilke edinen ve toplumsal dayanışmayı güçlendiren çalışmalarımızla, bugün olduğu gibi yarın da umut olmaya devam edeceğiz.”',
  },
  amac: {
    slug: 'amac',
    title: 'Amacımız',
    eyebrow: 'Kurumsal',
    summary: 'İhtiyaç sahiplerinin yaşam koşullarını iyileştirmek ve kalıcı sosyal fayda üretmek için çalışıyoruz.',
    content: 'Karabük Eflani Hayır Kervanı Vakfı, toplumsal dayanışmayı güçlendirmek, ihtiyaç sahibi birey ve ailelerin yaşam koşullarını iyileştirmek ve kalıcı sosyal fayda üretmek amacıyla kurulmuştur. Vakfımız; Karabük ili Eflani ilçesinde eğitim, sosyal yardım, sağlık, kültürel mirasın korunması ve toplumsal kalkınma alanlarında faaliyet göstermektedir.\n\nFaaliyetlerimiz yalnızca bugünün ihtiyaçlarına çözüm üretmeyi değil, aynı zamanda gelecek nesillere daha güçlü, daha bilinçli ve daha dayanışmacı bir toplum bırakmayı hedeflemektedir. İnsanı merkeze alan anlayışımızla, hayırseverlerin emanetlerini en doğru şekilde ihtiyaç sahiplerine ulaştırmayı temel sorumluluğumuz olarak görüyoruz.',
  },
  'misyon-vizyon': {
    slug: 'misyon-vizyon',
    title: 'Misyon, Vizyon ve İlkelerimiz',
    eyebrow: 'Kurumsal',
    summary: 'Yerel değerlerden güç alan, güvenilir ve sürdürülebilir bir dayanışma modeli.',
    content: 'Misyonumuz\nİnsan onurunu esas alan bir yaklaşımla; ihtiyaç sahibi birey ve ailelere sosyal destek sağlamak, eğitimde fırsat eşitliğini güçlendiren çalışmalara katkı sunmak, ibadethanelerin ve ortak yaşam alanlarının yapım, bakım ve onarımına katkıda bulunmak, kültürel ve manevi değerlerimizi yaşatan projeler geliştirmek ve toplumun her kesiminde yardımlaşma bilincini güçlendirmektir.\n\nŞeffaf, hesap verebilir ve sürdürülebilir bir yönetim anlayışıyla, bağışları en verimli şekilde toplumsal faydaya dönüştürmek temel ilkemizdir.\n\nVizyonumuz\nYerel değerlerden güç alan, ulusal ölçekte güvenilirliği ve sosyal etkisiyle örnek gösterilen, yenilikçi projeleriyle toplumsal dayanışmayı güçlendiren ve hayırseverlik kültürünün gelişimine öncülük eden saygın bir vakıf olmaktır.\n\nİyiliğin sınır tanımadığına inanarak; insan hayatına dokunan, kalıcı eserler bırakan ve gelecek nesillere umut taşıyan bir kurum olmayı hedefliyoruz.\n\nTemel İlkelerimiz\n• Güven ve şeffaflık\n• Dürüstlük ve hesap verebilirlik\n• İnsan onuruna saygı\n• Adalet ve eşitlik\n• Gönüllülük ve dayanışma\n• Sürdürülebilir sosyal fayda\n• Yerel değerlere bağlılık, evrensel sorumluluk anlayışı\n\nKurumsal Mesaj\n“İyilik, paylaşıldıkça büyüyen en değerli mirastır. Karabük Eflani Hayır Kervanı Vakfı olarak; insanı merkeze alan, güveni temel ilke edinen ve toplumsal dayanışmayı güçlendiren çalışmalarımızla, bugün olduğu gibi yarın da umut olmaya devam edeceğiz.”',
  },
  tarihce: {
    slug: 'tarihce',
    title: 'Tarihçemiz',
    eyebrow: 'Kurumsal',
    summary: 'Vakfımız, yedi kurucunun düzenlediği vakıf senediyle 11 Ekim 2023 tarihinde kurulmuştur.',
    content: 'Karabük Eflani Hayır Kervanı Vakfı; Şeref Karakaya, Hüseyin Öztürk, Yüksel Keleş, Yaşar Kılıç, Burhan Özdamar, Cihan Bodur ve Necdet Ünal tarafından 11 Ekim 2023 tarihinde noter huzurunda vakıf senedi düzenlenerek kurulmuştur.\n\nVakıf senedinde vakfın resmî merkezi Gebze, Kocaeli olarak belirlenmiştir. Vakfımızın faaliyet odağı başta Karabük ili Eflani ilçesi olmak üzere, ihtiyaç hâlinde Türkiye genelidir.\n\nKurulduğu günden bu yana eğitim, sosyal yardım, sağlık, kültürel mirasın korunması ve toplumsal kalkınma alanlarında kalıcı fayda üretmeyi amaçlamaktadır.',
  },
  'yonetim-kurulu': {
    slug: 'yonetim-kurulu',
    title: 'Yönetim ve Danışmanlık Kadromuz',
    eyebrow: 'Vakıf Organları',
    summary: 'Vakfımızın yönetim görevlerini ve hukuk danışmanlığını üstlenen kadro.',
    content: 'Yönetim ve danışmanlık kadromuz, vakfın amaçları doğrultusunda şeffaf, hesap verebilir ve sürdürülebilir çalışmalar yürütür.',
    members: boardMembers,
  },
  tuzuk: {
    slug: 'tuzuk',
    title: 'Vakıf Senedi Özeti',
    eyebrow: 'Kurumsal',
    summary: 'Vakfımızın resmî adı, merkezi ve kuruluş amaçlarına ilişkin özet bilgiler.',
    content: 'Vakfın resmî adı Karabük Eflani Hayır Kervanı Vakfı, vakıf senedinde belirtilen merkezi ise Pelitli Mahallesi, Mollafenari Caddesi No:86, Gebze/Kocaeli’dir.\n\nVakfın amacı; başta Karabük ili Eflani ilçesi olmak üzere ihtiyaç sahibi birey ve ailelere karşılıksız yardım etmek; afet veya başka nedenlerle zarar gören konutların onarımına katkı sağlamak; öğrencilere eğitim yardımı, ihtiyaç sahibi ailelere gıda ve giyecek desteği sunmak; ibadethaneler ve ortak yaşam alanlarının yapım, bakım ve onarımını desteklemek; tarihî ve manevi eserlerin korunmasına, yaşlı bakımına, aşevi çalışmalarına ve yerel dayanışma faaliyetlerine katkıda bulunmaktır.\n\nBu sayfa vakıf senedinin bilgilendirme amaçlı özetidir. Resmî ve güncel senet metni için vakıf yönetimiyle iletişime geçebilirsiniz.',
  },
  'seref-karakaya': {
    slug: 'seref-karakaya',
    title: 'Şeref Karakaya',
    eyebrow: 'Yönetim',
    summary: 'Karabük Eflani Hayır Kervanı Vakfı Yönetim Kurulu Başkanı.',
    content: 'Şeref Karakaya, Karabük Eflani Hayır Kervanı Vakfı Yönetim Kurulu Başkanı olarak görev yapmaktadır.\n\nVakfın kuruluş amaçları doğrultusunda yürütülen yönetim, dayanışma ve sosyal fayda çalışmalarına başkanlık etmektedir.',
    image_url: '/images/board/seref-karakaya.png',
    image_alt: 'Şeref Karakaya, Vakıf Yönetim Kurulu Başkanı',
  },
};

export function getFallbackContentPage(slug) {
  return pages[slug] ? { ...pages[slug], isFallback: true } : null;
}
