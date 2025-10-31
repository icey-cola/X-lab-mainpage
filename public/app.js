const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('#nav-menu');
const langButtons = document.querySelectorAll('.lang-btn');
const i18nElements = document.querySelectorAll('[data-i18n]');
const i18nAttrElements = document.querySelectorAll('[data-i18n-attr]');
const heroSlider = document.querySelector('.hero-slider');
const sliderTrack = heroSlider?.querySelector('#hero-slider');
const sliderDots = heroSlider?.querySelector('.slider-dots');
const keyTechList = document.querySelector('#key-tech-list');
const pubFeatured = document.querySelector('#pub-featured');
const teamHighlight = document.querySelector('#team-highlight');

let currentLang = 'zh';
let slidesCache = [];
let keyTechCache = [];
let publicationsCache = [];
let membersCache = [];

const HERO_ROTATE_MS = 6000;
let heroIndex = 0;
let heroTimer = null;

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
    descriptionEn: 'Morton-order modelling with multi-scale estimation delivers superior restoration in heavy rain and haze.',
    media: 'image/modem.mp4',
    mediaType: 'video',
    link: 'https://www.sensetime.com/cn/tech',
    linkLabelZh: '查看论文 >',
    linkLabelEn: 'Read Paper >'
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
    summaryEn: 'Morton-order degradation modelling achieves high-quality restoration in severe weather conditions.',
    paperUrl: '#',
    codeUrl: '#'
  },
  {
    id: 'p-002',
    titleZh: '面向真实场景文字的扩散式图像超分辨框架',
    titleEn: 'Text-aware Real-world Image Super-resolution via Diffusion Model with Joint Segmentation Decoders',
    venueZh: 'CVPR · 2025',
    venueEn: 'CVPR · 2025',
    authors: 'Qiming Hu, Linglong Fan, Yiyan Luo, Yuhang Yu, Qingnan Fan, Xiaojie Guo*',
    summaryZh: '联合分割解码器保持真实场景文字细节，显著提升可读性。',
    summaryEn: 'Joint decoders preserve text fidelity in real-world scenarios.',
    paperUrl: '#',
    codeUrl: '#'
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
    avatar: ''
  },
  {
    id: 'm-002',
    nameZh: '张三',
    nameEn: 'Zhang San',
    roleZh: '博士研究生',
    roleEn: 'PhD Student',
    group: 'phd',
    avatar: ''
  }
];

const translations = {
  zh: {
    siteNameZh: '未来智能实验室',
    siteNameEn: 'Future Intelligence Lab',
    navAriaLabel: '主导航',
    langSwitchLabel: '语言切换',
    langChinese: '中文',
    langEnglish: 'EN',
    navHome: '首页',
    navResearch: '研究方向',
    navKeyTech: '科研成果',
    navTeam: '团队成员',
    navPublications: '出版物',
    navJoin: '加入我们',
    navContact: '联系方式',
    heroEyebrow: '探索科学前沿 · 驱动未来智能',
    heroHeadline: 'Stay&nbsp;Simple&nbsp;&#8226;&nbsp;Stay&nbsp;Diverse',
    heroIntro: '未来智能实验室聚焦视觉智能、认知计算与多模态 AI，打造从基础理论到产业落地的全链条创新平台。',
    heroCTAResearch: '探索研究方向',
    heroCTAJoin: '加入我们',
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
    emptyFeatured: '暂无精选出版物。',
    emptyTech: '暂无关键技术条目。',
    emptyMembers: '暂无团队成员。',
    joinHeading: '与我们一起探索未来智能',
    joinDescription: '我们正在寻找对人工智能、计算机视觉与跨学科创新充满热情的研究者与工程师。加入我们，一起突破技术边界。',
    joinCTA: '立即投递简历',
    footerContactTitle: '联系我们',
    footerAddressLabel: '地址：',
    footerAddressText: '中国北京市海淀区学府大街 88 号未来科技园 B 座',
    footerPhoneLabel: '电话：',
    footerPhoneText: '+86 10 1234 5678',
    footerEmailLabel: '邮箱：',
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
    navAriaLabel: 'Main navigation',
    langSwitchLabel: 'Language toggle',
