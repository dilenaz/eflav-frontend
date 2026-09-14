import Image from "next/image";
import Link from "next/link";

const focusAreas = [
  {
    title: "Eğitim",
    image: "/images/activities/karabuk-universitesi-istisare-toplantisi.jpg",
    icon: "book",
  },
  {
    title: "Sosyal yardım",
    image: "/images/hero-dayanisma.png",
    icon: "people",
  },
  {
    title: "Cami ve ibadethane hizmetleri",
    image: "/images/activities/vakiflar-haftasi-ankara.jpg",
    icon: "mosque",
  },
  {
    title: "Kültürel miras ve toplumsal kalkınma",
    image: "/images/activities/kocaeli-dernekleri-vakif-ziyareti.jpg",
    icon: "heritage",
  },
];

const principles = [
  ["shield", "Güven", "ve şeffaflık"],
  ["scale", "Dürüstlük", "ve hesap verebilirlik"],
  ["heart", "İnsan onuruna", "saygı"],
  ["hands", "Dayanışma", "ve paylaşma"],
  ["leaf", "Sürdürülebilir", "sosyal fayda"],
];

function getSection(content, heading, nextHeading) {
  const start = content.indexOf(heading);
  if (start < 0) return '';
  const sectionStart = start + heading.length;
  const end = nextHeading ? content.indexOf(nextHeading, sectionStart) : -1;
  return content.slice(sectionStart, end < 0 ? undefined : end).trim().split(/\r?\n\s*\r?\n/)[0]?.trim() || '';
}

function getCorporateMessage(content) {
  const message = content.split(/Kurumsal Mesaj\s*/i)[1]?.trim();
  return message?.replace(/^[“\"]|[”\"]$/g, '') || '';
}

function LineIcon({ name, className = "" }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const paths = {
    book: <><path d="M4 5.5c3.2-1 5.6-.4 8 1.4v12c-2.4-1.8-4.8-2.4-8-1.4z" /><path d="M20 5.5c-3.2-1-5.6-.4-8 1.4v12c2.4-1.8 4.8-2.4 8-1.4z" /></>,
    people: <><circle cx="12" cy="8" r="3" /><circle cx="5.5" cy="10" r="2.2" /><circle cx="18.5" cy="10" r="2.2" /><path d="M7.5 19v-2.1c0-2.4 2-4.4 4.5-4.4s4.5 2 4.5 4.4V19M2.5 19v-1.2c0-2 1.5-3.7 3.5-3.9M21.5 19v-1.2c0-2-1.5-3.7-3.5-3.9" /></>,
    mosque: <><path d="M5 20V10h14v10M9 20v-5a3 3 0 0 1 6 0v5M3 20h18M7 10c0-3 2-5 5-6 3 1 5 3 5 6M4 10V6M20 10V6M4 6l1-1M20 6l-1-1" /></>,
    heritage: <><path d="M4 20h16M5 8h14M7 8v10M11 8v10M15 8v10M19 18H5M3 6l9-4 9 4z" /></>,
    shield: <><path d="M12 2.5 20 6v5.5c0 5-3.1 8.3-8 10-4.9-1.7-8-5-8-10V6z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    scale: <><path d="M12 3v17M7 20h10M5 6h14M7 6l-4 7h8zM17 6l-4 7h8z" /></>,
    heart: <><path d="M12 21S4 16.2 4 9.8A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8 2.8C20 16.2 12 21 12 21z" /><path d="M9 10.5h6" /></>,
    hands: <><path d="m3 12 4-4 5 4-3 3-6-3zM21 12l-4-4-5 4 3 3 6-3z" /><path d="m8.5 14.5 2.2 2.2c.8.8 2.1.8 2.8 0l2-2M6 15l2.5 2.5M18 15l-2.5 2.5" /></>,
    leaf: <><path d="M5 20c0-8 4-14 14-16 0 10-5 15-14 16z" /><path d="M5 20c3-5 6-8 11-11M9 15l-1-4M12 12l4 1" /></>,
  };

  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...common}>{paths[name]}</svg>;
}

export default function Hero({ corporateContent = {}, texts = {} }) {
  const homepage = corporateContent['ana-sayfa-hakkinda'];
  const purposePage = corporateContent.amac;
  const missionVisionPage = corporateContent['misyon-vizyon'];
  const mission = getSection(missionVisionPage?.content || '', 'Misyonumuz', 'Vizyonumuz');
  const vision = getSection(missionVisionPage?.content || '', 'Vizyonumuz', 'Temel İlkelerimiz');
  const purpose = purposePage?.summary || '';
  const corporateMessage = getCorporateMessage(homepage?.content || '');
  return (
    <section className="hero-poster" aria-labelledby="hero-title">
      <div className="hero-poster__leaf hero-poster__leaf--left" aria-hidden="true" />
      <div className="hero-poster__leaf hero-poster__leaf--right" aria-hidden="true" />

      <div className="hero-poster__main">
        <div className="hero-poster__copy">
          <div className="hero-poster__brand">
            <Image
              src="/images/logo/eflanilogo.png"
              alt="Karabük Eflani Hayır Kervanı Vakfı"
              width={300}
              height={268}
              priority
              className="hero-poster__logo"
            />
            <div>
              <p className="hero-poster__brand-name">Karabük<br />Eflani</p>
              <p className="hero-poster__brand-subtitle">Hayır Kervanı Vakfı</p>
            </div>
          </div>

          <div className="hero-poster__message">
            <h1 id="hero-title">
              {texts['home.hero.title_line_1'] || 'İyilik Yolunda'}
              <span>{texts['home.hero.title_line_2'] || 'Birlikte...'}</span>
            </h1>
            <p>{homepage?.summary || 'İnsan odaklı, güvenilir ve sürdürülebilir sosyal fayda için çalışıyoruz.'}</p>
            <strong>{texts['home.hero.tagline'] || 'Bir El Uzat, Bir Hayata Dokun.'}</strong>
            <div className="hero-poster__actions">
              <Link href="/bagis">İyiliğe Ortak Olun</Link>
              <Link href="/faaliyetler">Çalışmalarımız</Link>
            </div>
          </div>
        </div>

        <div className="hero-poster__promise">
          <div className="hero-poster__promise-mark" aria-hidden="true">♡</div>
          <p>{(texts['home.hero.promise'] || 'İnsana değer\nTopluma nefes\nGeleceğe umut').split('\n').map((line, index) => <span key={`${line}-${index}`}>{line}<br /></span>)}</p>
        </div>

        <div className="hero-poster__visual">
          <div className="hero-poster__focus-list">
            {focusAreas.map((area) => (
              <article className="hero-poster__focus" key={area.title}>
                <div className="hero-poster__focus-image">
                  <Image src={area.image} alt="" fill sizes="(max-width: 768px) 50vw, 26vw" className="object-cover" />
                </div>
                <div className="hero-poster__focus-label">
                  <span><LineIcon name={area.icon} /></span>
                  <strong>{area.title}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="hero-poster__heart">
          <div className="hero-poster__heart-image">
            <Image
              src="/images/hero-dayanisma.png"
              alt="Yeşil kalbin etrafında birleşen eller; dayanışma ve paylaşma"
              fill
              priority
              sizes="(max-width: 768px) 88vw, 39vw"
              className="object-cover"
            />
            <div className="hero-poster__heart-shade" />
            <p>{(texts['home.hero.heart_message'] || 'Paylaştıkça\nçoğalır,\niyilikle büyür\numutlar.').split('\n').map((line, index) => <span key={`${line}-${index}`}>{line}<br /></span>)}</p>
          </div>
        </div>
      </div>

      <div className="hero-poster__principles">
        {principles.map(([icon, title, subtitle]) => (
          <div key={title}>
            <LineIcon name={icon} className="hero-poster__principle-icon" />
            <p>{title}<span>{subtitle}</span></p>
          </div>
        ))}
      </div>

      <div className="hero-poster__bottom">
        <blockquote>
          <span className="hero-poster__quote-mark" aria-hidden="true">“</span>
          <p className="hero-poster__quote-text">{corporateMessage}</p>
          <span className="hero-poster__quote-mark hero-poster__quote-mark--closing" aria-hidden="true">”</span>
        </blockquote>
        <div>
          <strong>Misyonumuz</strong>
          <p>{mission}</p>
        </div>
        <div>
          <strong>Vizyonumuz</strong>
          <p>{vision}</p>
        </div>
        <div>
          <strong>Amacımız</strong>
          <p>{purpose}</p>
        </div>
      </div>
    </section>
  );
}
