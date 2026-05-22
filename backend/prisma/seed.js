import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Artists
  const arden = await prisma.artist.upsert({
    where: { id: 'arden-leonid-001' },
    update: {},
    create: {
      id: 'arden-leonid-001',
      name: 'Леонид Арден',
      bio: 'Художник, работающий на стыке сюрреализма и пейзажной живописи. Его полотна исследуют границу между реальностью и воображаемым миром через насыщенные цвета и необычные образы.',
    },
  });

  const orlova = await prisma.artist.upsert({
    where: { id: 'orlova-sofia-002' },
    update: {},
    create: {
      id: 'orlova-sofia-002',
      name: 'София Орлова',
      bio: 'Живописец, чьи работы исследуют внутренний мир человека через символизм и сюрреализм. Картины Орловой отличаются тонкой цветовой палитрой и поэтической атмосферой.',
    },
  });

  const levin = await prisma.artist.upsert({
    where: { id: 'levin-mark-003' },
    update: {},
    create: {
      id: 'levin-mark-003',
      name: 'Марк Левин',
      bio: 'Мастер графики, работающий в жанре авангарда и абстракции. Левин создаёт динамичные многослойные композиции, в которых цвет и форма вступают в диалог с городским ритмом.',
    },
  });

  const ren = await prisma.artist.upsert({
    where: { id: 'ren-ilya-004' },
    update: {},
    create: {
      id: 'ren-ilya-004',
      name: 'Илья Рен',
      bio: 'Скульптор-минималист, исследующий пластику формы через белые полимерные материалы. Его объекты балансируют между органическим и архитектурным, создавая медитативные образы.',
    },
  });

  const artworks = [
    {
      artistId: arden.id,
      title: 'Сад луны',
      year: 2024,
      type: 'painting',
      genre: 'landscape',
      size: 'large',
      technique: 'холст, акрил',
      dimensions: '110 × 70 см',
      price: 185000,
      description: 'Работа из серии «Ночные сады». Изумрудные, золотые и фиолетовые оттенки создают атмосферу лунного сада, где реальное растворяется в сновидческом.',
      status: 'published',
    },
    {
      artistId: arden.id,
      title: 'Оранжевая река',
      year: 2023,
      type: 'painting',
      genre: 'landscape',
      size: 'medium',
      technique: 'холст, акрил',
      dimensions: '90 × 60 см',
      price: 142000,
      description: 'Минималистичный пейзаж с рекой в огненных тонах. Синие и серо-голубые берега обрамляют оранжевое течение, создавая медитативный ритм.',
      status: 'published',
    },
    {
      artistId: arden.id,
      title: 'Город террас',
      year: 2025,
      type: 'painting',
      genre: 'landscape',
      size: 'large',
      technique: 'холст, акрил',
      dimensions: '150 × 100 см',
      price: 228000,
      description: 'Сюрреалистический городской пейзаж, где террасы и уровни города уходят в бирюзовое небо. Зелёные и жёлтые акценты задают тропический ритм архитектуры.',
      status: 'published',
    },
    {
      artistId: orlova.id,
      title: 'Облако вместо голоса',
      year: 2024,
      type: 'painting',
      genre: 'portrait',
      size: 'medium',
      technique: 'холст, масло',
      dimensions: '80 × 80 см',
      price: 210000,
      description: 'Портрет-метафора о невозможности высказаться. Серо-голубые и изумрудные тона создают образ молчания, где слово замещается облаком.',
      status: 'published',
    },
    {
      artistId: orlova.id,
      title: 'Узел тишины',
      year: 2025,
      type: 'painting',
      genre: 'abstract',
      size: 'medium',
      technique: 'холст, акрил',
      dimensions: '100 × 100 см',
      price: 170000,
      description: 'Абстрактная работа, исследующая феномен тишины через пересечение белых, розовых и серо-голубых плоскостей. Авангардная форма встречается с лирикой.',
      status: 'published',
    },
    {
      artistId: orlova.id,
      title: 'Розовая долина наблюдения',
      year: 2023,
      type: 'painting',
      genre: 'conceptual',
      size: 'medium',
      technique: 'холст, акрил',
      dimensions: '80 × 80 см',
      price: 195000,
      description: 'Сюрреалистический пейзаж-наблюдение. Розовые, лавандовые и бежевые оттенки складываются в образ долины, которую кто-то рассматривает снаружи.',
      status: 'published',
    },
    {
      artistId: levin.id,
      title: 'Конструкция на розовом поле',
      year: 2024,
      type: 'graphic',
      genre: 'abstract',
      size: 'medium',
      technique: 'бумага, шелкография',
      dimensions: '100 × 50 см',
      price: 74000,
      description: 'Авангардная шелкография с геометрической конструкцией на розовом фоне. Чёрные, красные, жёлтые и зелёные элементы образуют динамичную систему.',
      status: 'published',
    },
    {
      artistId: levin.id,
      title: 'Городской ритм',
      year: 2025,
      type: 'graphic',
      genre: 'abstract',
      size: 'large',
      technique: 'бумага, цифровая печать, акрил',
      dimensions: '200 × 180 см',
      price: 118000,
      description: 'Крупноформатная графика, передающая пульс мегаполиса. Синие, жёлтые, красные и белые слои складываются в абстрактную партитуру городского движения.',
      status: 'published',
    },
    {
      artistId: levin.id,
      title: 'Система равновесия',
      year: 2024,
      type: 'graphic',
      genre: 'abstract',
      size: 'large',
      technique: 'бумага, гуашь, тушь',
      dimensions: '65 × 150 см',
      price: 96000,
      description: 'Вертикальная работа о балансе противоположностей. Белые, синие, красные и зелёные элементы удерживают друг друга в состоянии равновесия.',
      status: 'published',
    },
    {
      artistId: levin.id,
      title: 'Пересечение плоскостей',
      year: 2023,
      type: 'graphic',
      genre: 'abstract',
      size: 'medium',
      technique: 'бумага, цифровая графика',
      dimensions: '80 × 80 см',
      price: 88000,
      description: 'Квадратная цифровая графика с пересекающимися геометрическими плоскостями. Белый, синий, красный и оранжевый строят диалог форм.',
      status: 'published',
    },
    {
      artistId: ren.id,
      title: 'Внутренний жест',
      year: 2025,
      type: 'sculpture',
      genre: 'conceptual',
      size: 'large',
      technique: 'полимерный композит, матовое покрытие',
      dimensions: '165 × 38 × 28 см',
      price: 320000,
      description: 'Вертикальная скульптура из белого полимерного композита. Плавные изгибы фигуры передают застывший внутренний импульс — жест, обращённый внутрь.',
      status: 'published',
    },
    {
      artistId: ren.id,
      title: 'Пламя формы',
      year: 2024,
      type: 'sculpture',
      genre: 'conceptual',
      size: 'large',
      technique: 'композит, искусственный камень',
      dimensions: '140 × 55 × 45 см',
      price: 410000,
      description: 'Авангардная скульптура с динамичным силуэтом, напоминающим застывшее пламя. Белый и серебристо-серый материалы подчёркивают текучесть формы.',
      status: 'published',
    },
  ];

  for (const artwork of artworks) {
    await prisma.artwork.create({ data: { ...artwork, images: [] } });
  }

  // Exhibitions
  const exhibitions = [
    {
      slug: 'nine-names-2024',
      title: 'Девять имён',
      artists: 'Леонид Арден, София Орлова, Марк Левин',
      dateStart: new Date('2024-03-01'),
      dateEnd:   new Date('2024-04-30'),
      teaser: 'Совместный проект выпускников Академии Штиглица. Живопись, графика и объекты в диалоге с городским пространством.',
    },
    {
      slug: 'white-form-2025',
      title: 'Белая форма',
      artists: 'Илья Рен',
      dateStart: new Date('2025-09-10'),
      dateEnd:   new Date('2025-11-15'),
      teaser: 'Персональная выставка скульптора Ильи Рена. Двадцать объектов из полимерного композита — исследование пластики тишины.',
    },
    {
      slug: 'inner-landscape-2026',
      title: 'Внутренний пейзаж',
      artists: 'София Орлова, Леонид Арден',
      dateStart: new Date('2026-04-15'),
      dateEnd:   new Date('2026-06-30'),
      teaser: 'Диалог двух художников о границе между внешним наблюдением и внутренним переживанием. Живопись и смешанная техника.',
    },
    {
      slug: 'urban-rhythm-2026',
      title: 'Городской ритм',
      artists: 'Марк Левин',
      dateStart: new Date('2026-07-01'),
      dateEnd:   new Date('2026-09-01'),
      teaser: 'Новая серия крупноформатной графики Марка Левина. Пульс мегаполиса через авангардную абстракцию.',
    },
  ];

  for (const ex of exhibitions) {
    await prisma.exhibition.upsert({
      where: { slug: ex.slug },
      update: {},
      create: ex,
    });
  }

  console.log(`Добавлено 4 художника, ${artworks.length} работ и ${exhibitions.length} выставки.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
