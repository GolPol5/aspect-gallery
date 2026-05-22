// ============ ASPECT GALLERY DATA ============

const ARTISTS = [
  { id: 'sokolova',  name: 'Мария Соколова',   bio: 'Петербургская художница, работает с цветовыми полями и геометрической абстракцией. Член Союза художников России с 2015 года.' },
  { id: 'belov',     name: 'Игорь Белов',      bio: 'Скульптор и инсталлятор. Исследует диалог между промышленным материалом и органической формой.' },
  { id: 'chernova',  name: 'Анна Чернова',     bio: 'Живописец, выпускница СПбГАИЖСА. Работы находятся в частных собраниях в России, Германии и ОАЭ.' },
  { id: 'orlov',     name: 'Денис Орлов',      bio: 'Художник-концептуалист. Работает в технике коллажа, графики и смешанной медиа.' },
  { id: 'novikova',  name: 'Светлана Новикова',bio: 'Пейзажист, окончила Академию Штиглица. Лауреат премии «Молодые мастера» 2022.' },
  { id: 'ryabov',    name: 'Кирилл Рябов',     bio: 'Скульптор. Работает с бронзой, мрамором и сварной сталью. Резидент студии «Линия Невы».' },
  { id: 'mironova',  name: 'Ольга Миронова',   bio: 'Художница, исследует тему памяти, тела и архива. Куратор серии выставок «Тихий свет».' },
];

const SEED = (s) => `https://picsum.photos/seed/aspect-${s}/${1200}/${1500}`;
const SEEDSQ = (s) => `https://picsum.photos/seed/aspect-${s}/800/800`;

const ARTWORKS = [
  { id: 1,  artistId:'sokolova', title:'Тихий полдень',         year:2024, type:'painting',  genre:'abstract',     size:'large',  technique:'холст, масло',           dimensions:'120×140 см', price:345000, seed:'p1',  desc:'Работа из цикла «Цветовое молчание». Художница использует широкие монохромные плоскости, чтобы зафиксировать состояние внутренней тишины. Свет выстраивает композицию, минуя нарратив.' },
  { id: 2,  artistId:'chernova', title:'Портрет в красном',     year:2023, type:'painting',  genre:'portrait',     size:'medium', technique:'холст, акрил',           dimensions:'90×120 см',  price:280000, seed:'p2',  desc:'Камерный портрет, написанный по личной фотографии. Чернова продолжает традицию русской портретной школы, но переводит её в современный визуальный язык.' },
  { id: 3,  artistId:'novikova', title:'Карелия. Утро',         year:2024, type:'painting',  genre:'landscape',    size:'medium', technique:'холст, масло',           dimensions:'80×100 см',  price:175000, seed:'p3',  desc:'Серия «Северные мотивы». Работа была представлена на выставке «Граница света» в 2024 году.' },
  { id: 4,  artistId:'orlov',    title:'Архив №14',             year:2025, type:'painting',  genre:'conceptual',   size:'large',  technique:'смешанная техника',      dimensions:'150×200 см', price:520000, seed:'p4',  desc:'Часть многолетнего проекта «Архив», в котором художник работает с найденными изображениями и текстом как с пластической материей.' },
  { id: 5,  artistId:'sokolova', title:'Без названия (синее)',  year:2022, type:'painting',  genre:'abstract',     size:'large',  technique:'холст, масло',           dimensions:'160×140 см', price:410000, seed:'p5',  desc:'Одна из ключевых работ позднего периода. Из частной коллекции.' },
  { id: 6,  artistId:'chernova', title:'Семейный портрет',      year:2024, type:'painting',  genre:'portrait',     size:'large',  technique:'холст, масло',           dimensions:'130×180 см', price:495000, seed:'p6',  desc:'Большеформатный групповой портрет. Работа экспонировалась на выставке «Близкие» в галерее Аспект.' },
  { id: 7,  artistId:'novikova', title:'Финский залив',         year:2023, type:'painting',  genre:'landscape',    size:'medium', technique:'холст, масло',           dimensions:'70×90 см',   price:155000, seed:'p7',  desc:'Зимний этюд, написанный в окрестностях Зеленогорска.' },
  { id: 8,  artistId:'orlov',    title:'Письмо без адреса',     year:2024, type:'painting',  genre:'conceptual',   size:'medium', technique:'коллаж, бумага, тушь',   dimensions:'70×70 см',   price:95000,  seed:'p8',  desc:'Работа из серии «Письма», объединяющей графику и текстовые фрагменты.' },
  { id: 9,  artistId:'mironova', title:'Дверь в саду',          year:2023, type:'painting',  genre:'landscape',    size:'small',  technique:'холст, масло',           dimensions:'40×50 см',   price:65000,  seed:'p9',  desc:'Небольшой пейзаж, выполненный во время резиденции в Старом Крыму.' },
  { id: 10, artistId:'sokolova', title:'Свет, прерывистый',     year:2025, type:'painting',  genre:'abstract',     size:'large',  technique:'холст, масло',           dimensions:'180×150 см', price:890000, seed:'p10', desc:'Центральная работа предстоящей выставки «Слой». Художница расширяет привычную палитру, вводя теплые охристые тона.' },
  { id: 11, artistId:'belov',    title:'Фигура I',              year:2024, type:'sculpture', genre:'conceptual',   size:'medium', technique:'сварная сталь',          dimensions:'высота 110 см', price:380000, seed:'s1',  desc:'Из серии «Молчаливые свидетели». Работа предполагает напольную установку.' },
  { id: 12, artistId:'ryabov',   title:'Узел',                  year:2023, type:'sculpture', genre:'abstract',     size:'small',  technique:'бронза, патина',         dimensions:'высота 38 см',  price:145000, seed:'s2',  desc:'Камерная скульптура. Авторская отливка, тираж 5 экз. Эта работа №2/5.' },
  { id: 13, artistId:'belov',    title:'Стена',                 year:2024, type:'sculpture', genre:'conceptual',   size:'large',  technique:'кортен, бетон',          dimensions:'200×80×40 см',  price:720000, seed:'s3',  desc:'Скульптурная инсталляция. Возможен авторский монтаж в пространстве заказчика.' },
  { id: 14, artistId:'ryabov',   title:'Голова',                year:2022, type:'sculpture', genre:'portrait',     size:'small',  technique:'мрамор',                 dimensions:'высота 32 см',  price:215000, seed:'s4',  desc:'Авторская резьба. Каррарский мрамор.' },
  { id: 15, artistId:'belov',    title:'Линия',                 year:2025, type:'sculpture', genre:'abstract',     size:'medium', technique:'нержавеющая сталь',      dimensions:'высота 145 см', price:425000, seed:'s5',  desc:'Из новой серии «Линии и поля». Работа создавалась специально для предстоящей выставки.' },
];

const EXHIBITIONS = [
  { id: 1, slug:'svet-preryvistyy', title:'Свет, прерывистый',  artists:'Мария Соколова', dates:'10 МАЯ 2026 – 15 ИЮЛ 2026', status:'current',  seed:'e1', teaser:'Персональная выставка живописи. 28 новых работ, объединённых темой света как ритмической структуры.' },
  { id: 2, slug:'molchalivye',      title:'Молчаливые свидетели', artists:'Игорь Белов, Кирилл Рябов', dates:'02 АПР 2026 – 30 ИЮН 2026', status:'current', seed:'e2', teaser:'Совместный проект двух скульпторов. Диалог между сваркой и литьём, индустрией и ремеслом.' },
  { id: 3, slug:'arkhiv',           title:'Архив',                 artists:'Денис Орлов', dates:'15 АВГ 2026 – 20 ОКТ 2026', status:'soon', seed:'e3', teaser:'Многолетний концептуальный проект, впервые показанный целиком. Графика, текст, инсталляция.' },
  { id: 4, slug:'severnye-motivy',  title:'Северные мотивы',       artists:'Светлана Новикова', dates:'12 ФЕВ 2026 – 24 МАР 2026', status:'past', seed:'e4', teaser:'Пейзажи Карелии и Ленинградской области. Сорок работ за десять лет.' },
  { id: 5, slug:'blizkie',          title:'Близкие',               artists:'Анна Чернова', dates:'05 НОЯ 2025 – 18 ЯНВ 2026', status:'past', seed:'e5', teaser:'Серия портретов как исследование интимной дистанции.' },
  { id: 6, slug:'tikhiy-svet',      title:'Тихий свет',            artists:'Ольга Миронова', dates:'01 СЕН 2026 – 15 НОЯ 2026', status:'soon', seed:'e6', teaser:'Кураторский проект, исследующий тему памяти через медиа фотографии и архива.' },
];

const COLORS_SWATCH = [
  { id:'black',  hex:'#111111' },
  { id:'white',  hex:'#FFFFFF' },
  { id:'brown',  hex:'#7A4B26' },
  { id:'red',    hex:'#A8302A' },
  { id:'blue',   hex:'#2A4C8C' },
  { id:'yellow', hex:'#D4A136' },
];

const fmtRub = (n) => `₽ ${n.toLocaleString('ru-RU').replace(/,/g, ' ')}`;
const getArtist = (id) => ARTISTS.find(a => a.id === id);
const getArtwork = (id) => ARTWORKS.find(a => a.id === id);

Object.assign(window, { ARTISTS, ARTWORKS, EXHIBITIONS, COLORS_SWATCH, fmtRub, getArtist, getArtwork, SEED, SEEDSQ });
