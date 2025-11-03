const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('#nav-menu');
const langSwitch = document.querySelector('.lang-switch');
const langButtons = document.querySelectorAll('.lang-btn');
const i18nElements = document.querySelectorAll('[data-i18n]');
const i18nAttrElements = document.querySelectorAll('[data-i18n-attr]');
const siteHeader = document.querySelector('.site-header');
const heroSlider = document.querySelector('.hero-slider');
const sliderTrack = heroSlider?.querySelector('#hero-slider');
const sliderDots = heroSlider?.querySelector('.slider-dots');
const sliderPrev = heroSlider?.querySelector('.slider-nav.prev');
const sliderNext = heroSlider?.querySelector('.slider-nav.next');
const keyTechList = document.querySelector('#key-tech-list');
const pubFeatured = document.querySelector('#pub-featured');
const partnersGrid = document.querySelector('#partners-grid');
const teamHighlight = document.querySelector('#team-highlight');

let currentLang = 'zh';
let slidesCache = [];
let keyTechCache = [];
let publicationsCache = [];
let partnersCache = [];
let membersCache = [];

const HERO_ROTATE_MS = 6000;
let heroIndex = 0;
let heroTimer = null;

try {
  const savedLang = localStorage.getItem('fil-lang');
  if (savedLang === 'zh' || savedLang === 'en') {
    currentLang = savedLang;
  }
} catch (error) {
  console.warn('Unable to access localStorage for language preference.', error);
}

const translations = {
  zh: {
    siteNameZh: '未来智能实验室',
    siteNameEn: 'Future Intelligence Lab',
    navHome: '首页',
    navResearch: '研究方向',
    navKeyTech: '科研成果',
    navTeam: '团队成员',
    navPublications: '出版物',
    navJoin: '联系我们',
    navContact: '联系方式',
    langChinese: '中文',
    langEnglish: 'EN',
    heroEyebrow: '探索科学前沿 · 驱动未来智能',
    heroHeadline: 'Stay Simple • Stay Diverse',
    heroIntro: '未来智能实验室聚焦视觉智能、认知计算与多模态 AI，打造从基础理论到产业落地的全链条创新平台。',
    heroCTAResearch: '探索研究方向',
    heroCTAJoin: '联系我们',
    heroStatPapers: '学术论文 (Top-tier)',
    heroStatPatents: '授权发明专利',
    heroStatPartners: '国际合作伙伴',
    researchHeading: '核心研究方向',
    researchSubheading: '围绕人工智能与计算机视觉的关键议题，布局未来十年的技术突破口。',
    researchCard1Title: '反射去除与层析重建',
    researchCard1Desc: '围绕单幅图像反射去除（SIRR）与场景分层，打造 XReflection 等高效工具链，实现真实场景的清晰重建。',
    researchCard2Title: '极端条件下的图像增强',
    researchCard2Desc: '研究恶劣天气与低光照退化建模，开发 MODEM 等视觉恢复方法，提升复杂环境中的成像质量。',
    researchCard3Title: '文本感知超分与生成',
    researchCard3Desc: '以扩散模型和联合解码器为核心，构建真实场景文本区域的高保真生成能力。',
    researchCard4Title: '鲁棒视频理解与跨域感知',
    researchCard4Desc: '聚焦高效视频目标检测与差异化对齐策略，提升跨场景的数据泛化与实时感知能力。',
    researchLearnMore: '了解详情',
    keyTechHeading: '关键技术与代表性成果',
    keyTechSubheading: '从原创算法到产业级系统，持续输出高影响力的科研成果。',
    pubsHeading: '精选出版物',
    pubsSubheading: '聚焦顶级会议与期刊的最新成果，展现我们在视觉智能与多模态 AI 领域的持续突破。',
    pubsCTA: '查看全部出版物',
    partnersHeading: '合作伙伴',
    partnersSubheading: '携手产业与科研伙伴，共同推动视觉智能技术的应用与落地。',
    teamHeading: '团队介绍',
    teamSubheading: '跨学科精英团队，汇聚计算机视觉、机器学习、硬件架构与应用科学的顶尖人才。',
    teamCTA: '查看完整团队',
    joinHeading: '与我们一起探索未来智能',
    joinDescription: '我们正在寻找对人工智能、计算机视觉与跨学科创新充满热情的研究者与工程师。加入我们，一起突破技术边界。',
    joinCTA: '立即投递简历',
    footerContactTitle: '联系我们',
    footerAddressLabel: '地址： ',
    footerAddressText: '中国北京市海淀区学府大街 88 号未来科技园 B 座',
    footerPhoneLabel: '电话： ',
    footerPhoneText: '+86 10 1234 5678',
    footerEmailLabel: '邮箱： ',
    footerEmailText: 'contact@futurelab.ai',
    footerLinksTitle: '快速链接',
    footerFollowTitle: '关注我们',
    footerSocialGithub: 'GitHub',
    footerSocialLinkedIn: 'LinkedIn',
    footerSocialTwitter: 'Twitter',
    footerPartnersLabel: '合作伙伴：',
    footerCopyright: '© 2024 未来智能实验室 · 版权所有 | 京ICP备 12345678 号'
  },
  en: {
    siteNameZh: 'Future Intelligence Lab',
    siteNameEn: 'Future Intelligence Lab',
    navHome: 'Home',
    navResearch: 'Research',
    navKeyTech: 'Key Technologies',
    navTeam: 'Team',
    navPublications: 'Publications',
    navJoin: 'Contact Us',
    navContact: 'Contact',
    langChinese: '中文',
    langEnglish: 'EN',
    heroEyebrow: 'Exploring scientific frontiers · Driving future intelligence',
    heroHeadline: 'Stay Simple \u2022 Stay Diverse',
    heroIntro: 'Future Intelligence Lab advances vision intelligence, cognitive computing, and multimodal AI from theory to real-world impact.',
    heroCTAResearch: 'Explore Research',
    heroCTAJoin: 'Contact Us',
    heroStatPapers: 'Top-tier publications',
    heroStatPatents: 'Granted patents',
    heroStatPartners: 'Global partners',
    researchHeading: 'Core Research Areas',
    researchSubheading: 'We map out the next decade of breakthroughs in AI and computer vision.',
    researchCard1Title: 'Reflection Removal & Layered Reconstruction',
    researchCard1Desc: 'Toolchains such as XReflection tackle single-image reflection removal and scene decomposition with precision.',
    researchCard2Title: 'Imaging Enhancement under Extremes',
    researchCard2Desc: 'We model adverse weather and low-light degradation, delivering MODEM-grade restoration quality.',
    researchCard3Title: 'Text-aware Super-resolution & Generation',
    researchCard3Desc: 'Diffusion models with joint decoders retain real-world text fidelity in generated imagery.',
    researchCard4Title: 'Robust Video Understanding & Cross-domain Perception',
    researchCard4Desc: 'Efficient detection and adaptive alignment empower real-time perception across diverse scenarios.',
    researchLearnMore: 'Learn More',
    keyTechHeading: 'Key Technologies & Flagship Outcomes',
    keyTechSubheading: 'From original algorithms to production-grade systems, we deliver high-impact research.',
    pubsHeading: 'Featured Publications',
    pubsSubheading: 'Highlighting breakthroughs in vision intelligence and multimodal AI across top venues.',
    pubsCTA: 'Browse All Publications',
    partnersHeading: 'Partners',
    partnersSubheading: 'We collaborate with industry and research allies to accelerate vision intelligence in practice.',
    teamHeading: 'Meet the Team',
    teamSubheading: 'An interdisciplinary crew uniting vision, machine learning, hardware, and applied science experts.',
    teamCTA: 'Meet the Full Team',
    joinHeading: 'Join Us to Explore Future Intelligence',
    joinDescription: 'We welcome passionate researchers and engineers in AI, computer vision, and cross-disciplinary innovation.',
    joinCTA: 'Apply Now',
    footerContactTitle: 'Contact',
    footerAddressLabel: 'Address: ',
    footerAddressText: 'Building B, Future Tech Park, 88 Xuefu Street, Haidian, Beijing, China',
    footerPhoneLabel: 'Phone: ',
    footerPhoneText: '+86 10 1234 5678',
    footerEmailLabel: 'Email: ',
    footerEmailText: 'contact@futurelab.ai',
    footerLinksTitle: 'Quick Links',
    footerFollowTitle: 'Follow Us',
    footerSocialGithub: 'GitHub',
    footerSocialLinkedIn: 'LinkedIn',
    footerSocialTwitter: 'Twitter',
    footerPartnersLabel: 'Partners:',
    footerCopyright: '© 2024 Future Intelligence Lab · All rights reserved | Beijing ICP 12345678'
  }
};

const attrTranslations = {
  zh: {
    navAriaLabel: '主导航',
    langSwitchLabel: '语言切换'
  },
  en: {
    navAriaLabel: 'Primary navigation',
    langSwitchLabel: 'Language toggle'
  }
};

const FALLBACK_SLIDES = [
  {
    id: 's-001',
    tagZh: '最新发布',
    tagEn: 'Latest',
    titleZh: '下一代视觉智能平台发布',
    titleEn: 'Next-gen Vision Intelligence Platform',
    descriptionZh: '融合大模型与视觉算法，全面提升科研、工业与城市场景的智能感知能力。',
    descriptionEn: 'Integrating foundation models with vision AI to empower cities, industries, and research labs.',
    media: 'image/xreflection.png',
    mediaType: 'image',
    link: 'https://www.sensetime.com/cn/about'
  },
  {
    id: 's-002',
    tagZh: '学术动态',
    tagEn: 'Research',
    titleZh: '多模态认知推理斩获顶会荣誉',
    titleEn: 'Multimodal Reasoning Wins Top-tier Award',
    descriptionZh: '视觉与语言融合的最新突破荣获最佳论文，展示多模态认知的新进展。',
    descriptionEn: 'Our multimodal reasoning work earned a best paper award, highlighting breakthroughs in vision-language fusion.',
    media: 'image/modem.png',
    mediaType: 'image',
    link: 'https://www.sensetime.com/cn/news'
  },
  {
    id: 's-003',
    tagZh: '产业落地',
    tagEn: 'Solutions',
    titleZh: '多行业智能解决方案',
    titleEn: 'Industry-ready AI Solutions',
    descriptionZh: '智慧城市、智能制造与医疗影像等领域全面落地创新方案，创造真实价值。',
    descriptionEn: 'Delivering intelligent solutions across smart cities, manufacturing, and healthcare to create real-world impact.',
    media: 'image/modem.mp4',
    mediaType: 'video',
    link: 'https://www.sensetime.com/cn/solutions'
  }
];

const FALLBACK_KEY_TECH = [
  {
    id: 't-001',
    tagZh: '开源工具',
    tagEn: 'Open Source',
    titleZh: 'XReflection',
    titleEn: 'XReflection',
    descriptionZh: '面向单幅图像反射去除（SIRR）的高效工具箱，覆盖数据构建、训练与推理全流程。',
    descriptionEn: 'A compact toolbox for single-image reflection removal with end-to-end data, training, and inference pipelines.',
    media: 'image/xreflection.png',
    mediaType: 'image',
    link: 'https://github.com/hainuo-wang/XReflection',
    linkLabelZh: '访问项目 >',
    linkLabelEn: 'Explore Project >'
  },
  {
    id: 't-002',
    tagZh: '旗舰成果',
    tagEn: 'Flagship',
    titleZh: 'MODEM：极端天气影像恢复',
    titleEn: 'MODEM: Extreme-weather Restoration',
    descriptionZh: '引入 Morton 顺序与多尺度退化建模，实现暴雨、雾霾场景下的高质量图像恢复。',
    descriptionEn: 'Morton-order modeling with multi-scale degradation estimation delivers superior restoration under heavy rain and haze.',
    media: 'image/modem.mp4',
    mediaType: 'video',
    link: 'https://www.sensetime.com/cn/tech',
    linkLabelZh: '查看论文 >',
    linkLabelEn: 'Read Paper >'
  }
];

const FALLBACK_PARTNERS = [
  {
    id: 'partner-001',
    nameZh: '商汤科技',
    nameEn: 'SenseTime',
    image: 'image/partners/sensetime.png',
    link: 'https://www.sensetime.com/cn',
    altZh: '商汤科技 Logo',
    altEn: 'SenseTime Logo'
  },
  {
    id: 'partner-002',
    nameZh: '深视智能',
    nameEn: 'DeepVision',
    image: 'image/partners/deepvision.png',
    link: 'https://example.com/deepvision',
    altZh: '深视智能 Logo',
    altEn: 'DeepVision Logo'
  },
  {
    id: 'partner-003',
    nameZh: '未来之光',
    nameEn: 'FutureLight',
    image: 'image/partners/futurelight.png',
    link: 'https://example.com/futurelight',
    altZh: '未来之光 Logo',
    altEn: 'FutureLight Logo'
  }
];

const FALLBACK_PUBLICATIONS = [
  {
    id: 'p-001',
    titleZh: 'MODEM：用于恶劣天气图像恢复的 Morton 顺序退化估计机制',
    titleEn: 'MODEM: A Morton-Order Degradation Estimation Mechanism for Adverse Weather Image Recovery',
    venueZh: 'NeurIPS · 2025',
    venueEn: 'NeurIPS · 2025',
    authors: 'Hainuo Wang, Qiming Hu, Xiaojie Guo*',
    summaryZh: '提出 Morton 顺序退化建模框架，在暴雨、雾霾场景下实现高质量重建。',
    summaryEn: 'Morton-order degradation modeling delivers high-quality restoration in severe weather conditions.',
    paperUrl: '#',
    codeUrl: '#',
    year: 2025
  },
  {
    id: 'p-002',
    titleZh: '面向真实场景文字的扩散式图像超分辨框架',
    titleEn: 'Text-aware Real-world Image Super-resolution via Diffusion Model with Joint Segmentation Decoders',
    venueZh: 'CVPR · 2025',
    venueEn: 'CVPR · 2025',
    authors: 'Qiming Hu, Linglong Fan, Yiyan Luo, Yuhang Yu, Qingnan Fan, Xiaojie Guo*',
    summaryZh: '联合分割解码器保持真实场景文字细节，显著提升可读性。',
    summaryEn: 'Joint segmentation decoders in a diffusion framework preserve text fidelity in real-world scenarios.',
    paperUrl: '#',
    codeUrl: '#',
    year: 2025
  }
];

const FALLBACK_MEMBERS = [
  {
    id: 'm-001',
    nameZh: '李老师',
    nameEn: 'Professor Li',
    roleZh: '导师',
    roleEn: 'Supervisor',
    group: 'teacher',
    avatar: '',
    bioZh: '未来智能实验室负责人，专注于视觉智能、可信 AI 与跨模态认知研究。',
    bioEn: 'Head of the lab focusing on vision intelligence, trustworthy AI, and multimodal cognition.'
  },
  {
    id: 'm-002',
    nameZh: '张三',
    nameEn: 'Zhang San',
    roleZh: '博士研究生',
    roleEn: 'PhD Student',
    group: 'phd',
    avatar: '',
    bioZh: '研究多模态感知和极端天气图像恢复，关注真实场景的算法落地。',
    bioEn: 'Researches multimodal perception and extreme-weather restoration with a focus on deployment.'
  },
  {
    id: 'm-003',
    nameZh: '王晓',
    nameEn: 'Wang Xiao',
    roleZh: '硕士研究生',
    roleEn: 'Master Student',
    group: 'master',
    avatar: '',
    bioZh: '聚焦城市感知与高效视频分析，负责实验室平台化建设。',
    bioEn: 'Focuses on urban perception and efficient video analytics, contributing to platform engineering.'
  }
];

const selectText = (entry, key) => {
  if (!entry) return '';
  const zhKey = `${key}Zh`;
  const enKey = `${key}En`;
  if (currentLang === 'zh') {
    return entry[zhKey] || entry[enKey] || '';
  }
  return entry[enKey] || entry[zhKey] || '';
};

const applyTranslations = () => {
  const dict = translations[currentLang];
  i18nElements.forEach((element) => {
    const key = element.dataset.i18n;
    if (!key) return;
    const value = dict[key] ?? translations.zh[key] ?? '';
    element.textContent = value;
  });
  i18nAttrElements.forEach((element) => {
    const mapping = element.dataset.i18nAttr;
    if (!mapping) return;
    mapping.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':').map((part) => part.trim());
      if (!attr || !key) return;
      const value = attrTranslations[currentLang][key] ?? attrTranslations.zh[key] ?? '';
      if (value) {
        element.setAttribute(attr, value);
      }
    });
  });
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
  if (langSwitch) {
    langSwitch.setAttribute('data-active-lang', currentLang);
  }
};

const setLoadingMessage = (container, message) => {
  if (!container) return;
  container.innerHTML = '';
  const placeholder = document.createElement('div');
  placeholder.className = 'section-empty';
  placeholder.textContent = message;
  container.appendChild(placeholder);
};

const updateLangButtons = () => {
  langButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
};

const closeNavMenu = () => {
  if (!navMenu || !navToggle) return;
  navMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
};

const updateHeaderOnScroll = () => {
  if (!siteHeader) return;
  if (window.scrollY > 40) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
};

const initNavMenu = () => {
  if (!navToggle || !navMenu) return;
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    navMenu.classList.toggle('open', !expanded);
  });
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNavMenu);
  });
};

const stopHeroAutoplay = () => {
  if (heroTimer) {
    clearInterval(heroTimer);
    heroTimer = null;
  }
};

const updateHeroSlider = () => {
  if (!sliderTrack || !slidesCache.length) return;
  const offset = heroIndex * -100;
  sliderTrack.style.transform = `translateX(${offset}%)`;
  const slides = sliderTrack.querySelectorAll('.slide');
  slides.forEach((slide, idx) => {
    const isActive = idx === heroIndex;
    slide.classList.toggle('is-active', isActive);
    const video = slide.querySelector('video');
    if (video) {
      if (isActive) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  });
  const dots = sliderDots?.querySelectorAll('.slider-dot') ?? [];
  dots.forEach((dot, idx) => {
    dot.classList.toggle('is-active', idx === heroIndex);
  });
};

const startHeroAutoplay = () => {
  stopHeroAutoplay();
  if (slidesCache.length <= 1) return;
  heroTimer = setInterval(() => {
    heroIndex = (heroIndex + 1) % slidesCache.length;
    updateHeroSlider();
  }, HERO_ROTATE_MS);
};

const renderSlides = (slides) => {
  if (!heroSlider || !sliderTrack || !sliderDots) return;
  stopHeroAutoplay();
  sliderTrack.innerHTML = '';
  sliderDots.innerHTML = '';
  heroSlider.classList.toggle('is-empty', slides.length === 0);
  if (slides.length === 0) {
    setLoadingMessage(sliderTrack, currentLang === 'zh' ? '暂无横幅，敬请期待。' : 'No slides yet. Please add one from the admin console.');
    sliderPrev?.setAttribute('disabled', 'true');
    sliderNext?.setAttribute('disabled', 'true');
    return;
  }
  sliderPrev?.removeAttribute('disabled');
  sliderNext?.removeAttribute('disabled');
  slides.forEach((slide, index) => {
    const slideWrapper = slide.link ? document.createElement('a') : document.createElement('div');
    slideWrapper.className = 'slide';
    slideWrapper.dataset.index = String(index);
    if (slide.link) {
      slideWrapper.href = slide.link;
      slideWrapper.target = '_blank';
      slideWrapper.rel = 'noopener noreferrer';
    }
    const mediaBox = document.createElement('div');
    mediaBox.className = 'slide-media';
    if (slide.mediaType === 'video') {
      const video = document.createElement('video');
      video.src = slide.media;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      mediaBox.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = slide.media;
      img.alt = selectText(slide, 'title') || selectText(slide, 'tag') || 'Hero slide';
      mediaBox.appendChild(img);
    }
    slideWrapper.appendChild(mediaBox);
    sliderTrack.appendChild(slideWrapper);

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'slider-dot';
    dot.dataset.index = String(index);
    dot.setAttribute(
      'aria-label',
      currentLang === 'zh' ? `跳转到第 ${index + 1} 张` : `Go to slide ${index + 1}`
    );
    sliderDots.appendChild(dot);
  });
  heroIndex = Math.min(heroIndex, slides.length - 1);
  updateHeroSlider();
  startHeroAutoplay();
};

const renderKeyTech = (items) => {
  if (!keyTechList) return;
  keyTechList.innerHTML = '';
  if (!items.length) {
    setLoadingMessage(keyTechList, currentLang === 'zh' ? '暂无关键技术，敬请期待。' : 'No key technologies yet. Please add one from the admin console.');
    return;
  }
  items.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = `tech-item${index % 2 === 1 ? ' secondary' : ''}`;

    const media = document.createElement('div');
    media.className = `tech-media ${index % 2 === 0 ? 'gradient-1' : 'gradient-2'}`;
    if (item.mediaType === 'video') {
      const video = document.createElement('video');
      video.src = item.media;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.preload = 'metadata';
      media.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = item.media;
      const altText = selectText(item, 'alt') || selectText(item, 'title');
      if (altText) {
        img.alt = altText;
      } else {
        img.alt = selectText(item, 'title') || 'Key technology media';
      }
      media.appendChild(img);
    }

    const content = document.createElement('div');
    content.className = 'tech-content';

    const tag = document.createElement('span');
    tag.className = `tag ${index % 2 === 1 ? 'alt' : ''}`;
    tag.textContent = selectText(item, 'tag');
    content.appendChild(tag);

    const title = document.createElement('h3');
    title.textContent = selectText(item, 'title');
    content.appendChild(title);

    const desc = document.createElement('p');
    desc.textContent = selectText(item, 'description');
    content.appendChild(desc);

    if (item.link) {
      const link = document.createElement('a');
      link.className = 'link';
      link.href = item.link;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = selectText(item, 'linkLabel') || (currentLang === 'zh' ? '了解更多 >' : 'Learn more >');
      content.appendChild(link);
    }

    card.appendChild(media);
    card.appendChild(content);
    keyTechList.appendChild(card);
  });
};

const renderPublications = (items) => {
  if (!pubFeatured) return;
  pubFeatured.innerHTML = '';
  if (!items.length) {
    setLoadingMessage(pubFeatured, currentLang === 'zh' ? '暂无出版物，敬请期待。' : 'No publications yet. Please add one from the admin console.');
    return;
  }
  items.slice(0, 3).forEach((pub) => {
    const card = document.createElement('article');
    card.className = 'pub-card';

    const venue = document.createElement('span');
    venue.className = 'pub-tag';
    venue.textContent = selectText(pub, 'venue') || (currentLang === 'zh' ? '待定' : 'TBD');
    card.appendChild(venue);

    const title = document.createElement('h3');
    title.textContent = selectText(pub, 'title');
    card.appendChild(title);

    if (pub.authors) {
      const authors = document.createElement('p');
      authors.className = 'pub-authors';
      authors.textContent = pub.authors;
      card.appendChild(authors);
    }

    const summaryText = selectText(pub, 'summary');
    if (summaryText) {
      const summary = document.createElement('p');
      summary.textContent = summaryText;
      card.appendChild(summary);
    }

    const links = document.createElement('div');
    links.className = 'pub-links';
    if (pub.paperUrl && pub.paperUrl !== '#') {
      const paperLink = document.createElement('a');
      paperLink.href = pub.paperUrl;
      paperLink.target = '_blank';
      paperLink.rel = 'noopener noreferrer';
      paperLink.className = 'link';
      paperLink.textContent = currentLang === 'zh' ? '论文链接 >' : 'Paper >';
      links.appendChild(paperLink);
    }
    if (pub.codeUrl && pub.codeUrl !== '#') {
      const codeLink = document.createElement('a');
      codeLink.href = pub.codeUrl;
      codeLink.target = '_blank';
      codeLink.rel = 'noopener noreferrer';
      codeLink.className = 'link';
      codeLink.textContent = currentLang === 'zh' ? '代码仓库 >' : 'Code >';
      links.appendChild(codeLink);
    }
    if (links.children.length) {
      card.appendChild(links);
    }
    pubFeatured.appendChild(card);
  });
};

const renderPartners = (items) => {
  if (!partnersGrid) return;
  partnersGrid.innerHTML = '';
  if (!items.length) {
    setLoadingMessage(partnersGrid, currentLang === 'zh' ? '暂无合作伙伴，敬请期待。' : 'No partners yet. Please add one from the admin console.');
    return;
  }

  items.forEach((partner) => {
    const card = document.createElement('a');
    card.className = 'partner-card';
    card.href = partner.link || '#';
    if (partner.link) {
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
    }

    const img = document.createElement('img');
    img.src = partner.image;
    const alt = currentLang === 'zh'
      ? (partner.altZh || partner.nameZh || partner.nameEn || '合作伙伴')
      : (partner.altEn || partner.nameEn || partner.nameZh || 'Partner');
    img.alt = alt;
    card.appendChild(img);
    partnersGrid.appendChild(card);
  });
};

const renderMembers = (items) => {
  if (!teamHighlight) return;
  teamHighlight.innerHTML = '';
  if (!items.length) {
    setLoadingMessage(teamHighlight, currentLang === 'zh' ? '暂无团队成员，敬请期待。' : 'No team members yet. Please add one from the admin console.');
    return;
  }
  items.slice(0, 3).forEach((member) => {
    const card = document.createElement('article');
    card.className = 'team-card mini';

    const avatarBox = document.createElement('div');
    avatarBox.className = 'avatar';
    if (member.avatar) {
      const img = document.createElement('img');
      img.src = member.avatar;
      img.alt = selectText(member, 'name');
      avatarBox.appendChild(img);
    }

    const textBox = document.createElement('div');
    textBox.className = 'text';

    const name = document.createElement('h3');
    name.textContent = selectText(member, 'name');
    textBox.appendChild(name);

    const role = document.createElement('p');
    role.textContent = selectText(member, 'role') || member.group || '';
    textBox.appendChild(role);

    const bioText = selectText(member, 'bio');
    if (bioText) {
      const desc = document.createElement('p');
      desc.className = 'member-desc';
      desc.textContent = bioText;
      textBox.appendChild(desc);
    }

    card.appendChild(avatarBox);
    card.appendChild(textBox);
    teamHighlight.appendChild(card);
  });
};

const fetchCollection = async (url) => {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

const loadSlides = async () => {
  if (!sliderTrack) return;
  setLoadingMessage(sliderTrack, currentLang === 'zh' ? '正在加载横幅...' : 'Loading slides...');
  try {
    const data = await fetchCollection('/api/slides');
    slidesCache = data.length ? data : [];
    if (!slidesCache.length) {
      renderSlides([]);
    } else {
      renderSlides(slidesCache);
    }
  } catch (error) {
    console.error('Failed to load slides.', error);
    slidesCache = FALLBACK_SLIDES;
    renderSlides(slidesCache);
  }
};

const loadKeyTech = async () => {
  if (!keyTechList) return;
  setLoadingMessage(keyTechList, currentLang === 'zh' ? '正在加载关键技术...' : 'Loading key technologies...');
  try {
    const data = await fetchCollection('/api/key-tech');
    keyTechCache = data.length ? data : [];
    if (!keyTechCache.length) {
      renderKeyTech([]);
    } else {
      renderKeyTech(keyTechCache);
    }
  } catch (error) {
    console.error('Failed to load key technologies.', error);
    keyTechCache = FALLBACK_KEY_TECH;
    renderKeyTech(keyTechCache);
  }
};

const loadPartners = async () => {
  if (!partnersGrid) return;
  setLoadingMessage(partnersGrid, currentLang === 'zh' ? '正在加载合作伙伴...' : 'Loading partners...');
  try {
    const data = await fetchCollection('/api/partners');
    partnersCache = data.length ? data : [];
    if (!partnersCache.length) {
      renderPartners([]);
    } else {
      renderPartners(partnersCache);
    }
  } catch (error) {
    console.error('Failed to load partners.', error);
    partnersCache = FALLBACK_PARTNERS;
    renderPartners(partnersCache);
  }
};

const loadPublications = async () => {
  if (!pubFeatured) return;
  setLoadingMessage(pubFeatured, currentLang === 'zh' ? '正在加载精选出版物...' : 'Loading featured publications...');
  try {
    const data = await fetchCollection('/api/publications');
    publicationsCache = data.length
      ? [...data].sort((a, b) => (b.year || 0) - (a.year || 0))
      : [];
    if (!publicationsCache.length) {
      renderPublications([]);
    } else {
      renderPublications(publicationsCache);
    }
  } catch (error) {
    console.error('Failed to load publications.', error);
    publicationsCache = [...FALLBACK_PUBLICATIONS].sort((a, b) => (b.year || 0) - (a.year || 0));
    renderPublications(publicationsCache);
  }
};

const loadMembers = async () => {
  if (!teamHighlight) return;
  setLoadingMessage(teamHighlight, currentLang === 'zh' ? '正在加载团队成员...' : 'Loading team members...');
  try {
    const data = await fetchCollection('/api/members');
    membersCache = data.length ? data : [];
    if (!membersCache.length) {
      renderMembers([]);
    } else {
      renderMembers(membersCache);
    }
  } catch (error) {
    console.error('Failed to load members.', error);
    membersCache = FALLBACK_MEMBERS;
    renderMembers(membersCache);
  }
};

const initLangSwitch = () => {
  updateLangButtons();
  applyTranslations();
  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (!lang || lang === currentLang) return;
      if (!(lang in translations)) return;
      currentLang = lang;
      try {
        localStorage.setItem('fil-lang', currentLang);
      } catch (error) {
        console.warn('Unable to persist language preference.', error);
      }
      updateLangButtons();
      applyTranslations();
      renderSlides(slidesCache);
      renderKeyTech(keyTechCache);
      renderPartners(partnersCache);
      renderPublications(publicationsCache);
      renderMembers(membersCache);
    });
  });
};

const initSliderEvents = () => {
  if (!heroSlider) return;
  sliderPrev?.addEventListener('click', () => {
    if (!slidesCache.length) return;
    heroIndex = (heroIndex - 1 + slidesCache.length) % slidesCache.length;
    updateHeroSlider();
    startHeroAutoplay();
  });
  sliderNext?.addEventListener('click', () => {
    if (!slidesCache.length) return;
    heroIndex = (heroIndex + 1) % slidesCache.length;
    updateHeroSlider();
    startHeroAutoplay();
  });
  sliderDots?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains('slider-dot')) return;
    const index = Number.parseInt(target.dataset.index || '', 10);
    if (Number.isNaN(index)) return;
    heroIndex = index;
    updateHeroSlider();
    startHeroAutoplay();
  });
  heroSlider.addEventListener('mouseenter', stopHeroAutoplay);
  heroSlider.addEventListener('mouseleave', startHeroAutoplay);
};

const init = () => {
  updateLangButtons();
  applyTranslations();
  updateHeaderOnScroll();
  initNavMenu();
  initLangSwitch();
  initSliderEvents();
  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
  loadSlides();
  loadKeyTech();
  loadPartners();
  loadPublications();
  loadMembers();
  // apply collapse state from backend, then set up toggle buttons
  const sectionsMeta = new Map();
  fetch('/api/sections').then(r=>r.ok?r.json():[]).then((list)=>{
    if (Array.isArray(list)) {
      list.forEach((s)=>{
        sectionsMeta.set(s.id, s);
        const el = document.getElementById(s.id);
        if (el) el.classList.toggle('collapsed', !!s.collapsed);
      });
    }
  }).finally(()=>{
    // wire up toggle buttons
    document.querySelectorAll('.collapse-toggle').forEach((btn)=>{
      btn.addEventListener('click', async () => {
        const targetId = btn.getAttribute('data-target') || btn.closest('section')?.id;
        if (!targetId) return;
        const sectionEl = document.getElementById(targetId);
        if (!sectionEl) return;
        const nowCollapsed = sectionEl.classList.toggle('collapsed');
        btn.setAttribute('aria-expanded', String(!nowCollapsed));
        btn.textContent = nowCollapsed ? '展开' : '收起';
        // persist to backend if this section is known by API
        if (sectionsMeta.has(targetId)) {
          try {
            await fetch(`/api/sections/${targetId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ collapsed: nowCollapsed })
            });
          } catch (_) { /* ignore network errors here */ }
        }
      });
      // initialize button label from current DOM state
      const targetId = btn.getAttribute('data-target') || btn.closest('section')?.id;
      const el = targetId ? document.getElementById(targetId) : null;
      const isCollapsed = !!el?.classList.contains('collapsed');
      btn.setAttribute('aria-expanded', String(!isCollapsed));
      btn.textContent = isCollapsed ? '展开' : '收起';
    });
  });
};

init();
