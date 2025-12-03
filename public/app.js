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
const heroSection = document.querySelector('.hero');
const mainSections = Array.from(document.querySelectorAll('main > section'));

let currentLang = 'zh';
let slidesCache = [];
let keyTechCache = [];
let publicationsCache = [];
let partnersCache = [];
let membersCache = [];
let imageWallCache = [];
let snapWheelBuffer = 0;
let snapLock = false;
let heroLightClassApplied = false;
let heroAutoBlocked = false;

const enableHorizontalScroll = (el) => {
  if (!el) return;
  const handleWheel = (event) => {
    if (!event.deltaY) return;
    event.preventDefault();
    el.scrollBy({
      left: event.deltaY,
      behavior: 'smooth',
    });
  };
  el.addEventListener('wheel', handleWheel, { passive: false });
};

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

const zhTranslations = {
  siteNameZh: 'X-Lab',
  siteNameEn: 'X-Lab',
  navHome: '首页',
  navResearch: '研究方向',
  navKeyTech: '科研成果',
  navTeam: '团队成员',
  navPublications: '出版物',
  navJoin: '联系我们',
  navContact: '联系方式',
  langChinese: '中文',
  langEnglish: 'EN',
  heroEyebrow: '探索视觉前沿 · 驱动未来智能',
  heroHeadline: 'Stay Simple • Stay Diverse',
  heroIntro: '聚焦视觉智能，打造从基础理论到产业落地的创新平台',
  heroCTAResearch: '探索研究方向',
  heroCTATeam: '团队介绍',
  heroCTAJoin: '联系我们',
  heroStatPapers: '学术论文 (Top-tier)',
  heroStatPartners: '国际合作伙伴',
  heroStatProjects: '合作项目',
  researchHeading: '核心研究方向',
  researchSubheading: '',
  researchCard1Title: '底层视觉恢复',
  researchCard1Desc: '涵盖超分、低光增强、去除雨雪雾等任务，构建端到端恢复工具箱（如 XReflection），保障真实应用的稳定输出。',
  researchCard3Title: '高层视觉感知',
  researchCard3Desc: '面向跨域检测与语义分割，探索鲁棒特征对齐、时空特征聚合与轻量化推理，支撑城市与工业场景的实时智能感知。',
  researchCard4Title: '多模态融合',
  researchCard4Desc: '面向视觉、语言与异构传感器的协同理解，构建统一的多模态模型与对齐机制，兼顾泛化、解释性与实时性，赋能更鲁棒的智能决策。',
  researchLearnMore: '了解详情',
  keyTechHeading: '关键技术与最新成果',
  keyTechSubheading: '',
  pubsHeading: '出版物',
  pubsSubheading: '',
  pubsCTA: '查看全部出版物',
  partnersHeading: '合作伙伴',
  partnersSubheading: '',
  teamHeading: '团队介绍',
  teamSubheading: '跨学科精英团队，汇聚计算机视觉、机器学习、模式识别与多模态视觉模型的顶尖人才。',
  teamCTA: '查看完整团队',
  joinHeading: '与我们一起探索视觉前沿',
  joinDescription: '实验室有多个博士与硕士名额，欢迎对计算机视觉、模式识别、机器学习充满热情与创新精神的同学加入，如有兴趣请将个人简历发送给我们。',
  joinEmail: '邮箱： xj.max.guo (at) gmail.com',
  joinCTA: '立即投递简历',
  footerContactTitle: '联系我们',
  footerAddressLabel: '地址： ',
  footerAddressText: '中国天津市津南区雅观路135号天津大学',
  footerPhoneLabel: '电话： ',
  footerPhoneText: '+86 10 1234 5678',
  footerEmailLabel: '邮箱： ',
  footerEmailText: 'xj.max.guo (at) gmail.com',
  footerLinksTitle: '快速链接',
  footerFollowTitle: '关注我们',
  footerSocialGithub: 'GitHub',
  footerSocialLinkedIn: 'LinkedIn',
  footerSocialTwitter: 'Twitter',
  footerPartnersLabel: '合作伙伴：',
  footerCopyright: '©  2025 X-Lab · 版权所有 '
};

const translations = {
  zh: zhTranslations,
  en: {
    siteNameZh: 'X-Lab',
    siteNameEn: 'X-Lab',
    navHome: 'Home',
    navResearch: 'Research',
    navKeyTech: 'Key Achievements',
    navTeam: 'Team',
    navPublications: 'Publications',
    navJoin: 'Contact Us',
    navContact: 'Contact',
    langChinese: '中文',
    langEnglish: 'EN',
    heroEyebrow: 'Exploring Vision Frontiers · Powering Future Intelligence',
    heroHeadline: 'Stay Simple • Stay Diverse',
    heroIntro: 'Focused on vision intelligence, pattern recognition, and multimodal AI,<br>building an innovation platform from theory to real-world impact.',
    heroCTAResearch: 'Explore Research',
    heroCTATeam: 'Meet the Team',
    heroCTAJoin: 'Contact Us',
    heroStatPapers: 'Top-tier Papers',
    heroStatPartners: 'Global Partners',
    heroStatProjects: 'Collaboration Projects',
    researchHeading: 'Core Research Areas',
    researchSubheading: ' ',
    researchCard1Title: 'Low-level Vision Restoration',
    researchCard1Desc: 'Super-resolution, low-light enhancement, deweathering and more, delivering robust end-to-end restoration (e.g., XReflection) for real deployment.',
    researchCard3Title: 'High-level Vision Perception',
    researchCard3Desc: 'Robust domain-adaptive detection and segmentation with feature alignment, spatiotemporal aggregation, and lightweight inference for real-time scenarios.',
    researchCard4Title: 'Multimodal Fusion',
    researchCard4Desc: 'Unified models and alignment across vision, language, and heterogeneous sensors for better generalization, interpretability, and real-time decision-making.',
    researchLearnMore: 'Learn More',
    keyTechHeading: 'Key Technologies & Latest Results',
    keyTechSubheading: ' ',
    pubsHeading: 'Publications',
    pubsSubheading: ' ',
    pubsCTA: 'View All Publications',
    partnersHeading: 'Partners',
    partnersSubheading: ' ',
    teamHeading: 'Team',
    teamSubheading: 'An interdisciplinary team across computer vision, machine learning, pattern recognition, and multimodal visual models.',
    teamCTA: 'View Full Team',
    joinHeading: 'Join Us to Explore Vision Frontiers',
    joinDescription: 'We welcome passionate researchers in computer vision, pattern recognition, and machine learning. If interested, please email us your CV.',
    joinEmail: 'Email: xj.max.guo (at) gmail.com',
    joinCTA: 'Send Your CV',
    footerContactTitle: 'Contact Us',
    footerAddressLabel: 'Address: ',
    footerAddressText: '135 Yaguan Road, Jinnan District, Tianjin University, Tianjin, China',
    footerPhoneLabel: 'Phone: ',
    footerPhoneText: '+86 10 1234 5678',
    footerEmailLabel: 'Email: ',
    footerEmailText: 'xj.max.guo (at) gmail.com',
    footerLinksTitle: 'Quick Links',
    footerFollowTitle: 'Follow Us',
    footerSocialGithub: 'GitHub',
    footerSocialLinkedIn: 'LinkedIn',
    footerSocialTwitter: 'Twitter',
    footerPartnersLabel: 'Partners:',
    footerCopyright: '©  2025 X-Lab · All rights reserved'
  }
};

const zhAttrTranslations = {
  navAriaLabel: '主导航',
  langSwitchLabel: '语言切换'
};

const attrTranslations = {
  zh: zhAttrTranslations,
  en: {
    navAriaLabel: 'Main navigation',
    langSwitchLabel: 'Language switch'
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
    titleZh: 'MODEM: A Morton-Order Degradation Estimation Mechanism for Adverse Weather Image Recovery',
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
    roleZh: '2010年入职',
    roleEn: 'Joined in 2010',
    group: 'teacher',
    avatar: '',
    bioZh: 'X-Lab负责人，专注于视觉智能、可信 AI 与跨模态认知研究。',
    bioEn: 'Head of the lab focusing on vision intelligence, trustworthy AI, and multimodal cognition.'
  },
  {
    id: 'm-002',
    nameZh: '张三',
    nameEn: 'Zhang San',
    roleZh: '2021级',
    roleEn: 'Class of 2021',
    group: 'phd',
    avatar: '',
    bioZh: '研究多模态感知和极端天气图像恢复，关注真实场景的算法落地。',
    bioEn: 'Researches multimodal perception and extreme-weather restoration with a focus on deployment.'
  },
  {
    id: 'm-003',
    nameZh: '王晓',
    nameEn: 'Wang Xiao',
    roleZh: '2022级',
    roleEn: 'Class of 2022',
    group: 'master',
    avatar: '',
    bioZh: '聚焦城市感知与高效视频分析，负责实验室平台化建设。',
    bioEn: 'Focuses on urban perception and efficient video analytics, contributing to platform engineering.'
  }
];
const FALLBACK_IMAGE_WALL = [
  {
    id: 'fw-1',
    image: 'image/顶端横幅/1.png',
    link: 'research-detail.html?id=rr1',
    title: '底层视觉 · Low-level Vision'
  },
  {
    id: 'fw-2',
    image: 'image/顶端横幅/1.png',
    link: 'research-detail.html?id=rr3',
    title: '高层感知 · High-level Perception'
  },
  {
    id: 'fw-3',
    image: 'image/顶端横幅/1.png',
    link: 'research-detail.html?id=rr4',
    title: '多模态协同 · Multimodal Fusion'
  },
  {
    id: 'fw-4',
    image: 'image/顶端横幅/1.png',
    link: 'research-detail.html?id=rr1',
    title: '视觉重建 · Vision Restoration'
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
  const htmlKeys = new Set(['heroIntro']);
  i18nElements.forEach((element) => {
    const key = element.dataset.i18n;
    if (!key) return;
    const value = dict[key] ?? translations.zh[key] ?? '';
    if (htmlKeys.has(key)) {
      element.innerHTML = value;
    } else {
      element.textContent = value;
    }
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
  let activeHasVideo = false;
  slides.forEach((slide, idx) => {
    const isActive = idx === heroIndex;
    slide.classList.toggle('is-active', isActive);
    const video = slide.querySelector('video');
    if (video) {
      if (isActive) {
        activeHasVideo = true;
        heroAutoBlocked = true;
        stopHeroAutoplay();
        video.onended = null;
        video.currentTime = 0;
        video.play().catch(() => {});
        video.onended = () => {
          video.onended = null;
          heroAutoBlocked = false;
          goToNextHeroSlide();
          startHeroAutoplay();
        };
      } else {
        video.onended = null;
        video.pause();
      }
    }
  });
  const dots = sliderDots?.querySelectorAll('.slider-dot') ?? [];
  dots.forEach((dot, idx) => {
    dot.classList.toggle('is-active', idx === heroIndex);
  });
  if (!activeHasVideo) {
    heroAutoBlocked = false;
    startHeroAutoplay();
  }
};

const startHeroAutoplay = () => {
  stopHeroAutoplay();
  if (slidesCache.length <= 1) return;
  if (heroAutoBlocked) return;
  heroTimer = setInterval(() => {
    goToNextHeroSlide();
  }, HERO_ROTATE_MS);
};

const goToNextHeroSlide = () => {
  if (!slidesCache.length) return;
  heroIndex = (heroIndex + 1) % slidesCache.length;
  updateHeroSlider();
};

const goToPreviousHeroSlide = () => {
  if (!slidesCache.length) return;
  heroIndex = (heroIndex - 1 + slidesCache.length) % slidesCache.length;
  updateHeroSlider();
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
    if (Array.isArray(slide.subImages) && slide.subImages.length) {
      const strip = document.createElement('div');
      strip.className = 'slide-substrip';
      slide.subImages.forEach((item) => {
        const hasLink = Boolean(item?.link);
        const wrapper = document.createElement(hasLink ? 'a' : 'div');
        wrapper.className = 'slide-substrip-item';
        if (hasLink) {
          wrapper.href = item.link;
          wrapper.target = '_blank';
          wrapper.rel = 'noopener noreferrer';
        }
        const img = document.createElement('img');
        img.src = item.src;
        const altText = selectText(item, 'label') || selectText(slide, 'title') || 'Hero detail';
        img.alt = altText;
        wrapper.appendChild(img);
        const labelText = selectText(item, 'label');
        if (labelText) {
          const label = document.createElement('span');
          label.textContent = labelText;
          wrapper.appendChild(label);
        }
        strip.appendChild(wrapper);
      });
      enableHorizontalScroll(strip);
      mediaBox.appendChild(strip);
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
    setLoadingMessage(pubFeatured, currentLang === 'zh' ? '暂无出版物，请稍后添加' : 'No publications yet. Please add one from the admin console.');
    return;
  }
  const list = document.createElement('div');
  list.className = 'pub-list interactive';
  items.forEach((pub) => {
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
    list.appendChild(card);
  });
  pubFeatured.appendChild(list);
  enableHorizontalScroll(list);
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

    const rawEnroll = selectText(member, 'role');
    const enroll = document.createElement('p');
    const enrollLabel = currentLang === 'zh' ? '' : '';
    enroll.textContent = rawEnroll
      ? `${enrollLabel}${rawEnroll}`
      : `${enrollLabel}${currentLang === 'zh' ? '未填写' : 'N/A'}`;
    textBox.appendChild(enroll);

    const bioText = selectText(member, 'bio');
    if (bioText) {
      const escapeHtml = (value = '') => String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      const linkified = escapeHtml(bioText).replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
      const desc = document.createElement('p');
      desc.className = 'member-desc';
      desc.innerHTML = linkified;
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
  setLoadingMessage(pubFeatured, currentLang === 'zh' ? '正在加载出版物...' : 'Loading featured publications...');
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

const renderImageWall = (track, items) => {
  if (!track) return;
  const dict = translations[currentLang] || translations.zh;
  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const validItems = (Array.isArray(items) ? items : []).filter((item) => item && item.image);
  if (!validItems.length) {
    track.innerHTML = '';
    track.classList.add('is-empty');
    track.style.removeProperty('--image-wall-duration');
    return;
  }

  const MIN_BASE_LENGTH = 6;
  const MAX_BASE_LENGTH = 18;
  let base = [...validItems];
  while (base.length < MIN_BASE_LENGTH) {
    base = base.concat(validItems);
    if (base.length >= MAX_BASE_LENGTH) break;
  }
  const itemsToRender = base.concat(base);

  const duration = Math.min(90, Math.max(26, itemsToRender.length * 3));
  track.style.setProperty('--image-wall-duration', `${duration}s`);
  track.classList.remove('is-empty');
  track.innerHTML = itemsToRender.map((item) => {
    const safeImage = escapeHtml(item.image);
    const safeTitle = currentLang === 'zh'
      ? (item.titleZh || item.title || item.titleEn || '')
      : (item.titleEn || item.title || item.titleZh || '');
    const safeLink = escapeHtml(item.link || '#');
    const extraAttrs = item.link ? ' target="_blank" rel="noopener"' : '';
    return `
      <div class="image-wall-item">
        <a href="${safeLink}"${extraAttrs}>
          <img src="${safeImage}" alt="${safeTitle}" loading="lazy" decoding="async">
          ${safeTitle ? `<div class="image-wall-caption">${escapeHtml(safeTitle)}</div>` : ''}
        </a>
      </div>
    `;
  }).join('');
};

const loadImageWall = async () => {
  const track = document.getElementById('image-wall-track');
  if (!track) return;
  track.classList.add('is-empty');
  try {
    const data = await fetchCollection('/api/image-wall');
    if (data.length) {
      imageWallCache = data;
      renderImageWall(track, imageWallCache);
      return;
    }
  } catch (error) {
    console.error('Failed to load image wall.', error);
  }
  imageWallCache = FALLBACK_IMAGE_WALL;
  renderImageWall(track, imageWallCache);
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
      const track = document.getElementById('image-wall-track');
      if (track && imageWallCache.length) {
        renderImageWall(track, imageWallCache);
      }
    });
  });
};

const initSliderEvents = () => {
  if (!heroSlider) return;
  sliderPrev?.addEventListener('click', () => {
    if (!slidesCache.length) return;
    goToPreviousHeroSlide();
    startHeroAutoplay();
  });
  sliderNext?.addEventListener('click', () => {
    if (!slidesCache.length) return;
    goToNextHeroSlide();
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

const initHeroReveal = () => {
  if (!heroSection || typeof IntersectionObserver === 'undefined') return;
  heroSection.classList.add('hero-floating');
  heroSection.classList.remove('hero-revealed');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        heroSection.classList.add('hero-revealed');
        heroSection.classList.remove('hero-floating');
        obs.disconnect();
      }
    });
  }, { threshold: 0.2, rootMargin: '-10% 0px' });
  observer.observe(heroSection);
};

const toggleHeroLightClass = () => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const sliderRect = heroSlider?.getBoundingClientRect();
  if (!sliderRect) return;
  const sliderVisibleHeight = Math.min(window.innerHeight, Math.max(0, sliderRect.bottom)) - Math.max(0, sliderRect.top);
  const sliderRatio = sliderVisibleHeight / window.innerHeight;
  if (sliderRatio > 0.5) {
    if (!heroLightClassApplied) {
      heroLightClassApplied = true;
      header.classList.add('hero-light');
    }
  } else if (heroLightClassApplied) {
    heroLightClassApplied = false;
    header.classList.remove('hero-light');
  }
};
const initManualSnap = () => {
  if (!mainSections.length) return;
  const threshold = 220;
  const resolveSectionIndex = () => {
    const viewportMid = window.scrollY + window.innerHeight / 2;
    let closestIndex = 0;
    let minDist = Number.POSITIVE_INFINITY;
    mainSections.forEach((section, idx) => {
      const rect = section.getBoundingClientRect();
      const sectionMid = rect.top + window.scrollY + rect.height / 2;
      const dist = Math.abs(sectionMid - viewportMid);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = idx;
      }
    });
    return closestIndex;
  };

  const wheelHandler = (event) => {
    if (window.innerWidth < 1024) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target.closest('.pub-list') || event.target.closest('.tech-showcase') || event.target.closest('.partners-grid')) {
      return;
    }
    snapWheelBuffer += event.deltaY;
    if (snapLock || Math.abs(snapWheelBuffer) < threshold) return;
    event.preventDefault();
    const direction = snapWheelBuffer > 0 ? 1 : -1;
    snapWheelBuffer = 0;

    const currentIndex = resolveSectionIndex();
    const targetIndex = Math.min(mainSections.length - 1, Math.max(0, currentIndex + direction));
    if (targetIndex === currentIndex) return;
    snapLock = true;
    mainSections[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      snapLock = false;
    }, 700);
  };

  window.addEventListener('wheel', wheelHandler, { passive: false });
  window.addEventListener('scroll', toggleHeroLightClass, { passive: true });
  window.addEventListener('resize', () => {
    snapWheelBuffer = 0;
    toggleHeroLightClass();
  });
  toggleHeroLightClass();
};

const init = () => {
  updateLangButtons();
  applyTranslations();
  updateHeaderOnScroll();
  initNavMenu();
  initLangSwitch();
  initSliderEvents();
  initHeroReveal();
  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
  loadSlides();
  loadKeyTech();
  loadPartners();
  loadPublications();
  // loadMembers();
  loadImageWall();
};

init();
