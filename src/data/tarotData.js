// 韦特塔罗 78张牌数据
// 牌面图片使用 Wikipedia Commons 公版图片

// Wikipedia图片URL生成器
const WIKI_BASE = "https://upload.wikimedia.org/wikipedia/commons";

// Major Arcana 图片（22张，ID 0-21）
const majorImages = [
  "3/3a/The_Fool.jpg",         // 0 愚者
  "d/de/The_Magician.jpg",     // 1 魔术师
  "8/89/The_High_Priestess.jpg", // 2 女祭司
  "d/d2/The_Empress.jpg",      // 3 女皇
  "c/c3/The_Emperor.jpg",       // 4 皇帝
  "4/4d/The_Hierophant.jpg",   // 5 教皇
  "3/3a/The_Lovers.jpg",       // 6 恋人
  "9/9d/The_Chariot.jpg",      // 7 战车
  "3/3d/Strength.jpg",         // 8 力量
  "f/f5/The_Hermit.jpg",       // 9 隐士
  "d/db/Wheel_of_Fortune.jpg", // 10 命运之轮
  "e/e2/Justice.jpg",          // 11 正义
  "2/23/The_Hanged_Man.jpg",   // 12 吊人
  "d/d7/Death.jpg",            // 13 死神
  "f/f8/Temperance.jpg",       // 14 节制
  "5/55/The_Devil.jpg",        // 15 恶魔
  "5/53/The_Tower.jpg",        // 16 塔
  "d/d7/The_Star.jpg",         // 17 星星
  "7/7f/The_Moon.jpg",         // 18 月亮
  "1/1f/The_Sun.jpg",          // 19 太阳
  "a/a4/Judgement.jpg",        // 20 审判
  "f/f8/The_World.jpg",        // 21 世界
];

// Minor Arcana 路径映射
// cups: 圣杯 ID 22-35
// pentacles: 星币 ID 36-49
// swords: 宝剑 ID 50-63
// wands: 权杖 ID 64-77
const minorPaths = {
  cups: [
    "f/fd/Pience.jpg",        // 22 圣杯 Ace
    "3/36/Two_of_Cups.jpg",    // 23
    "7/79/Three_of_Cups.jpg",  // 24
    "0/0f/Four_of_Cups.jpg",   // 25
    "9/94/Five_of_Cups.jpg",    // 26
    "3/35/Six_of_Cups.jpg",     // 27
    "e/e9/Seven_of_Cups.jpg",   // 28
    "a/a7/Eight_of_Cups.jpg",   // 29
    "2/27/Nine_of_Cups.jpg",    // 30
    "0/04/Ten_of_Cups.jpg",    // 31
    "d/d8/Page_of_Cups.jpg",   // 32
    "c/c4/Knight_of_Cups.jpg", // 33
    "1/16/Queen_of_Cups.jpg",  // 34
    "6/68/King_of_Cups.jpg",   // 35
  ],
  pentacles: [
    "1/1b/Ace_of_Pentacles.jpg",     // 36
    "9/9d/Two_of_Pentacles.jpg",    // 37
    "6/6d/Three_of_Pentacles.jpg",  // 38
    "f/f2/Four_of_Pentacles.jpg",   // 39
    "9/9f/Five_of_Pentacles.jpg",   // 40
    "3/35/Six_of_Pentacles.jpg",    // 41
    "a/a1/Seven_of_Pentacles.jpg",   // 42
    "6/6a/Eight_of_Pentacles.jpg",   // 43
    "a/ad/Nine_of_Pentacles.jpg",   // 44
    "3/30/Ten_of_Pentacles.jpg",    // 45
    "2/28/Page_of_Pentacles.jpg",   // 46
    "d/d2/Knight_of_Pentacles.jpg", // 47
    "a/ae/Queen_of_Pentacles.jpg",  // 48
    "4/43/King_of_Pentacles.jpg",   // 49
  ],
  swords: [
    "1/1a/Ace_of_Swords.jpg",      // 50
    "a/ae/Two_of_Swords.jpg",      // 51
    "c/c4/Three_of_Swords.jpg",   // 52
    "9/93/Four_of_Swords.jpg",    // 53
    "c/cf/Five_of_Swords.jpg",    // 54
    "2/21/Six_of_Swords.jpg",     // 55
    "8/80/Seven_of_Swords.jpg",   // 56
    "b/bf/Eight_of_Swords.jpg",   // 57
    "a/a9/Nine_of_Swords.jpg",    // 58
    "3/32/Ten_of_Swords.jpg",     // 59
    "c/ca/Page_of_Swords.jpg",    // 60
    "f/fa/Knight_of_Swords.jpg",  // 61
    "d/d4/Queen_of_Swords.jpg",   // 62
    "8/84/King_of_Swords.jpg",    // 63
  ],
  wands: [
    "1/11/Ace_of_Wands.jpg",      // 64
    "3/33/Two_of_Wands.jpg",      // 65
    "4/45/Three_of_Wands.jpg",    // 66
    "e/ec/Four_of_Wands.jpg",    // 67
    "0/07/Five_of_Wands.jpg",    // 68
    "8/88/Six_of_Wands.jpg",     // 69
    "e/ee/Seven_of_Wands.jpg",   // 70
    "a/a6/Eight_of_Wands.jpg",   // 71
    "0/0a/Nine_of_Wands.jpg",    // 72
    "2/26/Ten_of_Wands.jpg",     // 73
    "a/ac/Page_of_Wands.jpg",    // 74
    "2/26/Knight_of_Wands.jpg",  // 75
    "d/d7/Queen_of_Wands.jpg",   // 76
    "e/ee/King_of_Wands.jpg",    // 77
  ],
};

function buildWikiUrl(path) {
  return `${WIKI_BASE}/thumb/${path}/300px-${path.split('/').pop()}`;
}

// 生成78张牌数据
export const tarotCards = [
  // ========== 大阿尔卡纳 0-21 ==========
  { id: 0, name: "愚者", nameEn: "The Fool", suit: "major",
    keywords: ["新开始", "冒险", "自由", "天真"],
    upright: "新的旅程即将开启，你带着无畏的心踏出第一步。",
    reversed: "鲁莽行事，冲动地跳进未知的陷阱，而不自知。",
    image: buildWikiUrl(majorImages[0]) },
  { id: 1, name: "魔术师", nameEn: "The Magician", suit: "major",
    keywords: ["创造", "意志力", "技能", "显化"],
    upright: "你有所有需要的资源和能力，行动吧。",
    reversed: "技能到位但方向迷失，或者能力被自己否定了。",
    image: buildWikiUrl(majorImages[1]) },
  { id: 2, name: "女祭司", nameEn: "The High Priestess", suit: "major",
    keywords: ["直觉", "神秘", "内省", "秘密"],
    upright: "表面的答案不够，答案在你之内。",
    reversed: "忽视直觉，被外在的声音淹没，失去了自己的判断。",
    image: buildWikiUrl(majorImages[2]) },
  { id: 3, name: "女皇", nameEn: "The Empress", suit: "major",
    keywords: ["丰盛", "滋养", "创造力", "自然"],
    upright: "一切正在滋养你，或者你应该去滋养自己和他人。",
    reversed: "被忽视的关系，停滞的创造力，或者过度的自我牺牲。",
    image: buildWikiUrl(majorImages[3]) },
  { id: 4, name: "皇帝", nameEn: "The Emperor", suit: "major",
    keywords: ["权威", "结构", "控制", "领导力"],
    upright: "建立秩序和边界，这是你该做的事。",
    reversed: "过度控制，或者完全缺乏纪律和方向。",
    image: buildWikiUrl(majorImages[4]) },
  { id: 5, name: "教皇", nameEn: "The Hierophant", suit: "major",
    keywords: ["信仰", "传统", "精神指导", "教育"],
    upright: "寻找传统智慧，或者被可靠的体系引导。",
    reversed: "盲目从众，或者被权威压制，失去了自己的声音。",
    image: buildWikiUrl(majorImages[5]) },
  { id: 6, name: "恋人", nameEn: "The Lovers", suit: "major",
    keywords: ["爱", "选择", "和谐", "关系"],
    upright: "重大选择面前，倾听内心和理性的双重声音。",
    reversed: "失衡的选择，被欲望或恐惧驱动，回避了真实的代价。",
    image: buildWikiUrl(majorImages[6]) },
  { id: 7, name: "战车", nameEn: "The Chariot", suit: "major",
    keywords: ["意志力", "胜利", "控制", "决心"],
    upright: "坚定前行，用意志力驾驭一切对立的力量。",
    reversed: "失去方向，冲动失控，或者被阻隔在终点之前。",
    image: buildWikiUrl(majorImages[7]) },
  { id: 8, name: "力量", nameEn: "Strength", suit: "major",
    keywords: ["勇气", "耐心", "内在力量", "慈悲"],
    upright: "用内在的力量而非外在的蛮力化解困境。",
    reversed: "自我怀疑，怯懦，或者表面强势实则脆弱。",
    image: buildWikiUrl(majorImages[8]) },
  { id: 9, name: "隐士", nameEn: "The Hermit", suit: "major",
    keywords: ["内省", "独处", "指引", "智慧"],
    upright: "答案需要你独自寻找，向内走。",
    reversed: "自我隔离，害怕亲密，或者在逃避中用孤独作借口。",
    image: buildWikiUrl(majorImages[9]) },
  { id: 10, name: "命运之轮", nameEn: "Wheel of Fortune", suit: "major",
    keywords: ["命运", "转折", "循环", "机会"],
    upright: "事情正在转变，接住这个转折点给你的机会。",
    reversed: "抗拒改变，或者时机不对，越挣扎越被动。",
    image: buildWikiUrl(majorImages[10]) },
  { id: 11, name: "正义", nameEn: "Justice", suit: "major",
    keywords: ["公正", "真相", "因果", "诚信"],
    upright: "你的行为会有相应的结果，面对它，承认它。",
    reversed: "不公正，自欺，或者回避责任，假装什么都没发生。",
    image: buildWikiUrl(majorImages[11]) },
  { id: 12, name: "吊人", nameEn: "The Hanged Man", suit: "major",
    keywords: ["暂停", "视角转换", "牺牲", "等待"],
    upright: "换一种方式看待这件事，停下来才能看清全貌。",
    reversed: "被困住却不挣扎，拒绝做出必要的牺牲，或者方向全错了。",
    image: buildWikiUrl(majorImages[12]) },
  { id: 13, name: "死神", nameEn: "Death", suit: "major",
    keywords: ["结束", "转变", "释放", "重生"],
    upright: "一个阶段正在结束，放手才能让新的进来。",
    reversed: "抗拒必要的结束，在该死的事情上硬撑。",
    image: buildWikiUrl(majorImages[13]) },
  { id: 14, name: "节制", nameEn: "Temperance", suit: "major",
    keywords: ["平衡", "耐心", "调和", "中庸"],
    upright: "找到平衡点，让对立的元素共存。",
    reversed: "极端，过度，或者长期失衡导致身心疲惫。",
    image: buildWikiUrl(majorImages[14]) },
  { id: 15, name: "恶魔", nameEn: "The Devil", suit: "major",
    keywords: ["束缚", "欲望", "成瘾", "阴影"],
    upright: "你被自己不愿承认的欲望或模式困住了。",
    reversed: "挣脱束缚的勇气，或者把欲望合理化成"爱"。",
    image: buildWikiUrl(majorImages[15]) },
  { id: 16, name: "塔", nameEn: "The Tower", suit: "major",
    keywords: ["冲击", "觉醒", "崩塌", "解放"],
    upright: "幻象崩塌，你以为稳固的东西原来站不住。痛苦，但必要。",
    reversed: "持续的内部崩塌不愿面对，或者外部崩塌但你还没准备好。",
    image: buildWikiUrl(majorImages[16]) },
  { id: 17, name: "星星", nameEn: "The Star", suit: "major",
    keywords: ["希望", "疗愈", "灵感", "平静"],
    upright: "风暴过后，星光指引你走向新的希望。",
    reversed: "失去信念，感到绝望，或者假装没事。",
    image: buildWikiUrl(majorImages[17]) },
  { id: 18, name: "月亮", nameEn: "The Moon", suit: "major",
    keywords: ["恐惧", "幻觉", "直觉", "未知"],
    upright: "看不清的东西在影响你，恐惧在蔓延，但你不愿面对。",
    reversed: "自欺越来越严重，或者开始看到黑暗中真实的路。",
    image: buildWikiUrl(majorImages[18]) },
  { id: 19, name: "太阳", nameEn: "The Sun", suit: "major",
    keywords: ["快乐", "成功", "活力", "清晰"],
    upright: "事情对了，你感受到了真实的快乐和力量。",
    reversed: "表面乐观实则逃避，或者短暂的阴天，但太阳总会出来。",
    image: buildWikiUrl(majorImages[19]) },
  { id: 20, name: "审判", nameEn: "Judgement", suit: "major",
    keywords: ["觉醒", "重生", "判断", "清算"],
    upright: "过去的你正在死去，新的人在站起来。这是清算，也是解脱。",
    reversed: "自我否定，不给自己重来的机会。",
    image: buildWikiUrl(majorImages[20]) },
  { id: 21, name: "世界", nameEn: "The World", suit: "major",
    keywords: ["完成", "成就", "整合", "圆满"],
    upright: "一个循环完成，你做到了。带着完整的自己，进入新的旅程。",
    reversed: "未完成的完成，项目卡在最后一步，或者假装满意。",
    image: buildWikiUrl(majorImages[21]) },

  // ========== 圣杯 Cups 22-35 ==========
  { id: 22, name: "圣杯 Ace", nameEn: "Ace of Cups", suit: "cups",
    keywords: ["新感情", "爱", "情绪", "直觉"],
    upright: "爱的全新可能向你打开。",
    reversed: "情感的空虚，或者新的感情来得不是时候。",
    image: buildWikiUrl(minorPaths.cups[0]) },
  { id: 23, name: "圣杯二", nameEn: "Two of Cups", suit: "cups",
    keywords: [" partnership", "united love", "mutual attraction"],
    upright: "两个人之间的连接正在深化。",
    reversed: "关系失衡，一方付出远大于另一方。",
    image: buildWikiUrl(minorPaths.cups[1]) },
  { id: 24, name: "圣杯三", nameEn: "Three of Cups", suit: "cups",
    keywords: ["celebration", "friendship", "community"],
    upright: "社交的欢乐时光，与朋友共度的美好。",
    reversed: "过度社交之后感到空虚，或者三人关系的尴尬。",
    image: buildWikiUrl(minorPaths.cups[2]) },
  { id: 25, name: "圣杯四", nameEn: "Four of Cups", suit: "cups",
    keywords: ["apathy", "contemplation", "discontent"],
    upright: "机会在你面前，但你选择了漠视。",
    reversed: "走出冷漠，开始看见已经拥有的东西。",
    image: buildWikiUrl(minorPaths.cups[3]) },
  { id: 26, name: "圣杯五", nameEn: "Five of Cups", suit: "cups",
    keywords: ["loss", "regret", "disappointment"],
    upright: "失去的东西抓住了你全部注意力，看不见你还拥有的。",
    reversed: "开始从失去中走出来，放下过去。",
    image: buildWikiUrl(minorPaths.cups[4]) },
  { id: 27, name: "圣杯六", nameEn: "Six of Cups", suit: "cups",
    keywords: ["nostalgia", "memories", "innocence"],
    upright: "过去的美好记忆涌上来，或者你对某个人的看法停留在过去。",
    reversed: "沉溺于过去，或者被过去的情感操控。",
    image: buildWikiUrl(minorPaths.cups[5]) },
  { id: 28, name: "圣杯七", nameEn: "Seven of Cups", suit: "cups",
    keywords: ["choices", "fantasy", "illusion"],
    upright: "太多幻想中的选项，你需要分清哪些是真的。",
    reversed: "更现实地看待选择，或者完全放弃选择。",
    image: buildWikiUrl(minorPaths.cups[6]) },
  { id: 29, name: "圣杯八", nameEn: "Eight of Cups", suit: "cups",
    keywords: ["walking away", "disillusionment", "seeking truth"],
    upright: "你知道离开是对的，即使还舍不得。",
    reversed: "在错误的事情上停留太久，或者逃避真正的决定。",
    image: buildWikiUrl(minorPaths.cups[7]) },
  { id: 30, name: "圣杯九", nameEn: "Nine of Cups", suit: "cups",
    keywords: ["contentment", "satisfaction", "gratitude"],
    upright: "愿望正在实现，你感到满足。",
    reversed: "外在满足但内心空虚，或者愿望实现后发现不过如此。",
    image: buildWikiUrl(minorPaths.cups[8]) },
  { id: 31, name: "圣杯十", nameEn: "Ten of Cups", suit: "cups",
    keywords: ["harmony", "happiness", "family"],
    upright: "家庭和关系的和谐，这是你想要的生活。",
    reversed: "家庭不和谐，或者对理想和现实之间的差距感到失望。",
    image: buildWikiUrl(minorPaths.cups[9]) },
  { id: 32, name: "圣杯侍卫", nameEn: "Page of Cups", suit: "cups",
    keywords: ["creative opportunity", "intuition", "curiosity"],
    upright: "创意和直觉在召唤你，去探索。",
    reversed: "创造力的封锁，或者情绪上的不成熟。",
    image: buildWikiUrl(minorPaths.cups[10]) },
  { id: 33, name: "圣杯骑士", nameEn: "Knight of Cups", suit: "cups",
    keywords: ["romance", "charm", "imagination"],
    upright: "带着浪漫和情感向你走来，或者你的情感正在推动你行动。",
    reversed: "情绪化的行动，或者浪漫但不现实的计划。",
    image: buildWikiUrl(minorPaths.cups[11]) },
  { id: 34, name: "圣杯皇后", nameEn: "Queen of Cups", suit: "cups",
    keywords: ["compassion", "intuition", "emotional security"],
    upright: "来自一个情感充沛但稳定的人的支持。",
    reversed: "情绪波动大，或者过度迎合他人而失去自我。",
    image: buildWikiUrl(minorPaths.cups[12]) },
  { id: 35, name: "圣杯国王", nameEn: "King of Cups", suit: "cups",
    keywords: ["emotional balance", "leadership", "compassion"],
    upright: "情感成熟，能给你安全感的人。",
    reversed: "情感操控，或者用情绪作为武器。",
    image: buildWikiUrl(minorPaths.cups[13]) },

  // ========== 星币 Pentacles 36-49 ==========
  { id: 36, name: "星币 Ace", nameEn: "Ace of Pentacles", suit: "pentacles",
    keywords: ["新机会", "资源", "物质", "实际"],
    upright: "实际的资源和机会向你打开。",
    reversed: "机会来了但你看不上，或者缺乏实际的行动。",
    image: buildWikiUrl(minorPaths.pentacles[0]) },
  { id: 37, name: "星币二", nameEn: "Two of Pentacles", suit: "pentacles",
    keywords: ["balance", "adaptability", "time management"],
    upright: "在多项事务中找到平衡点。",
    reversed: "失衡，被多件事拉扯得喘不过气。",
    image: buildWikiUrl(minorPaths.pentacles[1]) },
  { id: 38, name: "星币三", nameEn: "Three of Pentacles", suit: "pentacles",
    keywords: ["teamwork", "collaboration", "learning"],
    upright: "专业的事需要专业的人，协作才能完成。",
    reversed: "缺乏协作，单打独斗，或者团队里有人在敷衍。",
    image: buildWikiUrl(minorPaths.pentacles[2]) },
  { id: 39, name: "星币四", nameEn: "Four of Pentacles", suit: "pentacles",
    keywords: ["security", "conservation", "control"],
    upright: "紧紧抓住你已经拥有的，不愿意放手。",
    reversed: "害怕失去反而失去更多，或者过度囤积。",
    image: buildWikiUrl(minorPaths.pentacles[3]) },
  { id: 40, name: "星币五", nameEn: "Five of Pentacles", suit: "pentacles",
    keywords: ["financial loss", "isolation", "worry"],
    upright: "物质或精神上的匮乏感在折磨你，但你不是真的孤独。",
    reversed: "开始走出困境，或者假装看不见自己的幸运。",
    image: buildWikiUrl(minorPaths.pentacles[4]) },
  { id: 41, name: "星币六", nameEn: "Six of Pentacles", suit: "pentacles",
    keywords: ["generosity", "charity", "sharing"],
    upright: "给予和接受的平衡，慷慨正在流动。",
    reversed: "不平等的给予，或者一方永远在付出。",
    image: buildWikiUrl(minorPaths.pentacles[5]) },
  { id: 42, name: "星币七", nameEn: "Seven of Pentacles", suit: "pentacles",
    keywords: ["patience", "long-term view", "investment"],
    upright: "播下的种子还没长出来，但别放弃，继续等待。",
    reversed: "缺乏耐心，不断换方向，或者投资打了水漂。",
    image: buildWikiUrl(minorPaths.pentacles[6]) },
  { id: 43, name: "星币八", nameEn: "Eight of Pentacles", suit: "pentacles",
    keywords: ["apprenticeship", "dedication", "skill development"],
    upright: "专注于打磨你的技能，这段时间的投入会有回报。",
    reversed: "缺乏专注，三心二意，或者在做没有意义的工作。",
    image: buildWikiUrl(minorPaths.pentacles[7]) },
  { id: 44, name: "星币九", nameEn: "Nine of Pentacles", suit: "pentacles",
    keywords: ["abundance", "luxury", "self-sufficiency"],
    upright: "你已经创造了值得骄傲的东西，享受它。",
    reversed: "靠别人供养而不自知，或者浪费了你的独立。",
    image: buildWikiUrl(minorPaths.pentacles[8]) },
  { id: 45, name: "星币十", nameEn: "Ten of Pentacles", suit: "pentacles",
    keywords: ["wealth", "inheritance", "family"],
    upright: "家庭的财富或传承，真正属于你的东西。",
    reversed: "家族问题，或者财富带来的纠纷。",
    image: buildWikiUrl(minorPaths.pentacles[9]) },
  { id: 46, name: "星币侍卫", nameEn: "Page of Pentacles", suit: "pentacles",
    keywords: ["manifestation", "financial opportunity"],
    upright: "一个新的实际机会出现了，看准了就去追。",
    reversed: "缺乏承诺，或者机会被其他人抢先。",
    image: buildWikiUrl(minorPaths.pentacles[10]) },
  { id: 47, name: "星币骑士", nameEn: "Knight of Pentacles", suit: "pentacles",
    keywords: ["efficiency", "routine", "conservatism"],
    upright: "稳定地向前推进，可靠比速度更重要。",
    reversed: "过度保守，抵制变化，或者拖延。",
    image: buildWikiUrl(minorPaths.pentacles[11]) },
  { id: 48, name: "星币皇后", nameEn: "Queen of Pentacles", suit: "pentacles",
    keywords: ["nurturing", "practicality", "abundance"],
    upright: "务实且慷慨的支持者，在资源上给你安全感。",
    reversed: "占有欲强，或者把自己的安全感完全寄托在他人身上。",
    image: buildWikiUrl(minorPaths.pentacles[12]) },
  { id: 49, name: "星币国王", nameEn: "King of Pentacles", suit: "pentacles",
    keywords: ["abundance", "security", "control"],
    upright: "实际的成功者和掌控者，能给你实际的保障。",
    reversed: "用物质控制人，或者对金钱有执念。",
    image: buildWikiUrl(minorPaths.pentacles[13]) },

  // ========== 宝剑 Swords 50-63 ==========
  { id: 50, name: "宝剑 Ace", nameEn: "Ace of Swords", suit: "swords",
    keywords: ["clarity", "breakthrough", "new ideas"],
    upright: "清晰的洞察，突破性的想法正在形成。",
    reversed: "混乱的思维，或者真相被压制。",
    image: buildWikiUrl(minorPaths.swords[0]) },
  { id: 51, name: "宝剑二", nameEn: "Two of Swords", suit: "swords",
    keywords: ["indecision", "stalemate", "blocked emotions"],
    upright: "两边都不愿意选，或者你在假装问题不存在。",
    reversed: "被迫做出选择，或者继续逃避。",
    image: buildWikiUrl(minorPaths.swords[1]) },
  { id: 52, name: "宝剑三", nameEn: "Three of Swords", suit: "swords",
    keywords: ["heartbreak", "grief", "painful truth"],
    upright: "痛苦的真相击中你，直面它才能过去。",
    reversed: "还在痛，但开始慢慢放下。",
    image: buildWikiUrl(minorPaths.swords[2]) },
  { id: 53, name: "宝剑四", nameEn: "Four of Swords", suit: "swords",
    keywords: ["rest", "recovery", "contemplation"],
    upright: "你需要休息，给自己一个暂停的空间。",
    reversed: "休息变成了逃避，休息完了问题还在。",
    image: buildWikiUrl(minorPaths.swords[3]) },
  { id: 54, name: "宝剑五", nameEn: "Five of Swords", suit: "swords",
    keywords: ["conflict", "defeat", "winning at all costs"],
    upright: "赢了争吵但输了关系，值得吗？",
    reversed: "还在冲突中，或者被冲突后的余波影响。",
    image: buildWikiUrl(minorPaths.swords[4]) },
  { id: 55, name: "宝剑六", nameEn: "Six of Swords", suit: "swords",
    keywords: ["transition", "leaving behind", "moving forward"],
    upright: "离开困难的地方，向着平静的方向走。",
    reversed: "旅程不完整，还在半路。",
    image: buildWikiUrl(minorPaths.swords[5]) },
  { id: 56, name: "宝剑七", nameEn: "Seven of Swords", suit: "swords",
    keywords: ["deception", "strategy", "stealth"],
    upright: "有人在暗中行动，但可能不是为了伤害你。",
    reversed: "你在自欺，或者欺骗别人来保护自己。",
    image: buildWikiUrl(minorPaths.swords[6]) },
  { id: 57, name: "宝剑八", nameEn: "Eight of Swords", suit: "swords",
    keywords: ["restriction", "self-imprisonment", "helplessness"],
    upright: "你被自己思维困住了，实际上你比你想的自由。",
    reversed: "开始挣脱，或者发现了真正困住你的东西。",
    image: buildWikiUrl(minorPaths.swords[7]) },
  { id: 58, name: "宝剑九", nameEn: "Nine of Swords", suit: "swords",
    keywords: ["anxiety", "worry", "nightmares"],
    upright: "深夜的焦虑在折磨你，大部分是你自己想象出来的。",
    reversed: "开始从焦虑中走出来，或者主动寻求帮助。",
    image: buildWikiUrl(minorPaths.swords[8]) },
  { id: 59, name: "宝剑十", nameEn: "Ten of Swords", suit: "swords",
    keywords: ["endings", "betrayal", "rock bottom"],
    upright: "已经到了最坏的底部，没有更低了，只有向上。",
    reversed: "拒绝接受结束，或者还在持续地自我伤害。",
    image: buildWikiUrl(minorPaths.swords[9]) },
  { id: 60, name: "宝剑侍卫", nameEn: "Page of Swords", suit: "swords",
    keywords: ["curiosity", "new ideas", "thirst for knowledge"],
    upright: "新的想法在涌动，带着批判性思维去探索。",
    reversed: "操纵性的言辞，或者为了辩论而辩论。",
    image: buildWikiUrl(minorPaths.swords[10]) },
  { id: 61, name: "宝剑骑士", nameEn: "Knight of Swords", suit: "swords",
    keywords: ["action", "ambition", "drive"],
    upright: "快速行动，目标明确，但小心伤及无辜。",
    reversed: "冲动决策，伤了自己和别人。",
    image: buildWikiUrl(minorPaths.swords[11]) },
  { id: 62, name: "宝剑皇后", nameEn: "Queen of Swords", suit: "swords",
    keywords: ["independence", "clear boundaries", "direct"],
    upright: "直接、真诚、不拖泥带水的支持者。",
    reversed: "尖刻、冷漠，或者刀子嘴豆腐心但表达方式伤人。",
    image: buildWikiUrl(minorPaths.swords[12]) },
  { id: 63, name: "宝剑国王", nameEn: "King of Swords", suit: "swords",
    keywords: ["intellectual power", "authority", "truth"],
    upright: "用智慧和真相来掌权，是一个可以依靠的判断者。",
    reversed: "滥用权力，用才智操控他人，冷酷无情。",
    image: buildWikiUrl(minorPaths.swords[13]) },

  // ========== 权杖 Wands 64-77 ==========
  { id: 64, name: "权杖 Ace", nameEn: "Ace of Wands", suit: "wands",
    keywords: ["inspiration", "new opportunities", "growth"],
    upright: "创造的火焰燃烧起来了，抓住这个机会。",
    reversed: "创意被压制，或者机会来了但你没有行动。",
    image: buildWikiUrl(minorPaths.wands[0]) },
  { id: 65, name: "权杖二", nameEn: "Two of Wands", suit: "wands",
    keywords: ["planning", "decisions", "discovery"],
    upright: "你在计划未来的路，视野正在扩大。",
    reversed: "恐惧未知，或者一直在计划但没有出发。",
    image: buildWikiUrl(minorPaths.wands[1]) },
  { id: 66, name: "权杖三", nameEn: "Three of Wands", suit: "wands",
    keywords: ["expansion", "foresight", "overseas opportunities"],
    upright: "你的行动开始看到回报，继续等待。",
    reversed: "缺乏进展，或者机会来了但你还没准备好。",
    image: buildWikiUrl(minorPaths.wands[2]) },
  { id: 67, name: "权杖四", nameEn: "Four of Wands", suit: "wands",
    keywords: ["celebration", "harmony", "homecoming"],
    upright: "值得庆祝的时刻，稳定和和谐正在建立。",
    reversed: "庆祝过度，或者缺乏真正的归属感。",
    image: buildWikiUrl(minorPaths.wands[3]) },
  { id: 68, name: "权杖五", nameEn: "Five of Wands", suit: "wands",
    keywords: ["competition", "conflict", "diversity"],
    upright: "多方力量的竞争，不要让它消耗你。",
    reversed: "避免冲突，或者冲突已经解决。",
    image: buildWikiUrl(minorPaths.wands[4]) },
  { id: 69, name: "权杖六", nameEn: "Six of Wands", suit: "wands",
    keywords: ["success", "public recognition", "progress"],
    upright: "你正在赢，胜利的消息在传播。",
    reversed: "表面成功但内部空虚，或者失败但不接受。",
    image: buildWikiUrl(minorPaths.wands[5]) },
  { id: 70, name: "权杖七", nameEn: "Seven of Wands", suit: "wands",
    keywords: ["challenge", "perseverance", "defense"],
    upright: "捍卫你的位置，你需要坚持。",
    reversed: "被压垮而放弃，或者主动放弃错误的战场。",
    image: buildWikiUrl(minorPaths.wands[6]) },
  { id: 71, name: "权杖八", nameEn: "Eight of Wands", suit: "wands",
    keywords: ["speed", "action", "movement"],
    upright: "事情进展飞快，抓住这个速度。",
    reversed: "延迟和阻碍，或者太急而发生意外。",
    image: buildWikiUrl(minorPaths.wands[7]) },
  { id: 72, name: "权杖九", nameEn: "Nine of Wands", suit: "wands",
    keywords: ["resilience", "courage", "persistent effort"],
    upright: "已经筋疲力尽但还在坚持，胜利就在眼前。",
    reversed: "过度坚持已经不值得的事，或者被过去的问题困住。",
    image: buildWikiUrl(minorPaths.wands[8]) },
  { id: 73, name: "权杖十", nameEn: "Ten of Wands", suit: "wands",
    keywords: ["burden", "responsibility", "stress"],
    upright: "你背负的已经超出你的极限，是时候放下一些。",
    reversed: "拒绝分担，或者负担已经把你压垮了。",
    image: buildWikiUrl(minorPaths.wands[9]) },
  { id: 74, name: "权杖侍卫", nameEn: "Page of Wands", suit: "wands",
    keywords: ["inspiration", "ideas", "discovery"],
    upright: "新的创意在召唤你，带着热情去探索。",
    reversed: "三分钟热度，或者被批评打击了信心。",
    image: buildWikiUrl(minorPaths.wands[10]) },
  { id: 75, name: "权杖骑士", nameEn: "Knight of Wands", suit: "wands",
    keywords: ["energy", "passion", "adventure"],
    upright: "带着火焰和激情向前冲，但要小心烧伤。",
    reversed: "冲动、鲁莽，或者等待太久热情熄灭了。",
    image: buildWikiUrl(minorPaths.wands[11]) },
  { id: 76, name: "权杖皇后", nameEn: "Queen of Wands", suit: "wands",
    keywords: ["courage", "confidence", "independence"],
    upright: "充满热情和自信的领导力，温暖而有力量。",
    reversed: "嫉妒、占有欲强，或者在掩饰内心的不安全感。",
    image: buildWikiUrl(minorPaths.wands[12]) },
  { id: 77, name: "权杖国王", nameEn: "King of Wands", suit: "wands",
    keywords: ["leadership", "vision", "success"],
    upright: "真正的领导者，有远见、有魄力、有担当。",
    reversed: "专制、滥用权力，或者魄力变成了鲁莽。",
    image: buildWikiUrl(minorPaths.wands[13]) },
];

// 10种牌阵
export const spreads = [
  {
    id: 1, name: "单张牌", nameEn: "Single Card", cardCount: 1,
    description: "每日指引，快速洞察",
    detail: "适合日常占卜，获取当天的指引或对某个简单问题的快速答案。",
    positions: [{ name: "当前能量", meaning: "此刻围绕你的核心能量与整体状态" }],
    icon: "🃏"
  },
  {
    id: 2, name: "三张牌阵", nameEn: "Three Cards", cardCount: 3,
    description: "过去·现在·未来",
    detail: "经典的时间线牌阵，揭示过去的影响、当前的状况和未来的走向。",
    positions: [
      { name: "过去", meaning: "过去的经历与影响" },
      { name: "现在", meaning: "当前的核心状态" },
      { name: "未来", meaning: "未来可能的走向" },
    ],
    icon: "🔮"
  },
  {
    id: 3, name: "凯尔特十字", nameEn: "Celtic Cross", cardCount: 10,
    description: "深度全面分析",
    detail: "最经典的塔罗牌阵，提供对问题的全面深入分析。",
    positions: [
      { name: "当前处境", meaning: "核心状态与问题本质" },
      { name: "挑战/阻碍", meaning: "主要障碍或对立力量" },
      { name: "远因", meaning: "深层根源与远期背景" },
      { name: "近因", meaning: "近期事件或即将显现的影响" },
      { name: "过去", meaning: "正在消退的能量" },
      { name: "未来", meaning: "即将到来的能量" },
      { name: "自我认知", meaning: "你对自身的看法" },
      { name: "外部影响", meaning: "外部力量的影响" },
      { name: "希望与恐惧", meaning: "内心的期望与恐惧" },
      { name: "最终结果", meaning: "最可能的走向" },
    ],
    icon: "✝️"
  },
  {
    id: 4, name: "爱情牌阵", nameEn: "Love Spread", cardCount: 5,
    description: "感情关系深度解析",
    positions: [
      { name: "你的感受", meaning: "你的情感状态" },
      { name: "对方感受", meaning: "对方的真实感受" },
      { name: "关系现状", meaning: "关系整体能量" },
      { name: "挑战", meaning: "需要克服的障碍" },
      { name: "建议", meaning: "行动指引" },
    ],
    icon: "💕"
  },
  {
    id: 5, name: "职业牌阵", nameEn: "Career Spread", cardCount: 6,
    description: "事业发展指引",
    positions: [
      { name: "当前职业状态", meaning: "你现在的职业处境" },
      { name: "优势", meaning: "你的核心竞争力" },
      { name: "挑战", meaning: "主要的职业障碍" },
      { name: "机遇", meaning: "可能出现的机会" },
      { name: "建议行动", meaning: "应该采取的下一步" },
      { name: "最终结果", meaning: "这段时期的可能走向" },
    ],
    icon: "💼"
  },
  {
    id: 6, name: "是否牌阵", nameEn: "Yes/No Spread", cardCount: 3,
    description: "快速决策指引",
    positions: [
      { name: "支持因素", meaning: "yes的核心能量" },
      { name: "核心能量", meaning: "主导这件事的力量" },
      { name: "阻碍因素", meaning: "no的核心能量" },
    ],
    icon: "❓"
  },
  {
    id: 7, name: "月相牌阵", nameEn: "Moon Phase Spread", cardCount: 4,
    description: "月亮周期能量",
    positions: [
      { name: "新月·意图", meaning: "你真正的意图是什么" },
      { name: "上弦月·行动", meaning: "需要采取什么行动" },
      { name: "满月·收获", meaning: "这个周期的收获是什么" },
      { name: "下弦月·释放", meaning: "需要放下什么" },
    ],
    icon: "🌙"
  },
  {
    id: 8, name: "身心灵牌阵", nameEn: "Body-Mind-Spirit", cardCount: 3,
    description: "整体健康平衡",
    positions: [
      { name: "身体", meaning: "身体层面的状态和提醒" },
      { name: "心理", meaning: "内心的真实感受和需求" },
      { name: "灵性", meaning: "灵魂层面的指引" },
    ],
    icon: "🧘"
  },
  {
    id: 9, name: "五元素牌阵", nameEn: "Five Elements Spread", cardCount: 5,
    description: "五行能量平衡",
    positions: [
      { name: "火·激情", meaning: "你的行动力和创造力" },
      { name: "水·情感", meaning: "你的情感和人际关系" },
      { name: "土·物质", meaning: "你的实际资源和安全感" },
      { name: "风·思想", meaning: "你的思维和沟通方式" },
      { name: "以太·灵性", meaning: "你的精神追求和更高指引" },
    ],
    icon: "⭐"
  },
  {
    id: 10, name: "年度牌阵", nameEn: "Year Spread", cardCount: 12,
    description: "十二月份全年预测",
    positions: [
      { name: "一月", meaning: "新年开局" },
      { name: "二月", meaning: "关系与价值" },
      { name: "三月", meaning: "行动开始" },
      { name: "四月", meaning: "工作与健康" },
      { name: "五月", meaning: "挑战与突破" },
      { name: "六月", meaning: "内省与调整" },
      { name: "七月", meaning: "下半场启动" },
      { name: "八月", meaning: "旅行与扩张" },
      { name: "九月", meaning: "回归本质" },
      { name: "十月", meaning: "转变点" },
      { name: "十一月", meaning: "收获整理" },
      { name: "十二月", meaning: "年度总结" },
    ],
    icon: "📅"
  },
];

// 随机抽取指定数量的牌
export function drawCards(count) {
  const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(card => ({
    ...card,
    isReversed: Math.random() < 0.25, // 约25%概率逆位
  }));
}

// 每日一签（从22张大阿尔卡纳随机）
export function dailyCard() {
  const majorOnly = tarotCards.filter(c => c.suit === 'major');
  const card = majorOnly[Math.floor(Math.random() * majorOnly.length)];
  return { ...card, isReversed: false };
}
