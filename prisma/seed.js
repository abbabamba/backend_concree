const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const opportunities = [
    {
      title: 'Développeur Full Stack',
      description: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe dynamique.',
      company: 'Concree',
      location: 'Dakar, Sénégal',
      salary: '45000€ - 60000€ par an',
      dateLimit: new Date('2024-07-31'),
      sectors: ['Technologie'],
      targetAudience: ['Étudiants', 'Entrepreneurs'],
      advantages: [
        'Mentorat par des experts de l’industrie',
        'Accès à des investisseurs et des partenaires stratégiques',
        'Formations avancées en gestion d’entreprise et technologie',
      ],
      selectionProcess: 'Le processus de sélection comprend une évaluation initiale des candidatures, suivie de présentations devant un panel de juges.',
    },
    {
      title: 'Designer UX/UI',
      description: 'Opportunité passionnante pour un designer UX/UI créatif pour travailler sur des projets innovants.',
      company: 'Bakeli',
      location: 'Dakar, Sénégal',
      salary: '35000€ - 50000€ par an',
      dateLimit: new Date('2024-07-31'),
      sectors: ['Design', 'Technologie'],
      targetAudience: ['Étudiants', 'Entrepreneurs'],
      advantages: [
        'Espaces de coworking gratuits',
        'Soutien à la préparation de pitchs et à la levée de fonds',
      ],
      selectionProcess: 'Les candidats retenus seront invités à un entretien final avant l’acceptation dans le programme.',
    },
    {
      title: 'Ingénieur DevOps',
      description: 'Nous cherchons un ingénieur DevOps pour améliorer et maintenir notre infrastructure cloud.',
      company: 'Volkeno',
      location: 'Dakar, Sénégal',
      salary: '50000€ - 70000€ par an',
      dateLimit: new Date('2024-07-31'),
      sectors: ['Technologie', 'Cloud'],
      targetAudience: ['Femmes Entrepreneurs', 'Entrepreneurs'],
      advantages: [
        'Accès à des outils technologiques de pointe',
        'Réseautage avec des leaders de l’industrie',
      ],
      selectionProcess: 'Un entretien final est prévu pour les candidats sélectionnés après la phase de présélection.',
    },
  ];

  for (const opportunity of opportunities) {
    await prisma.opportunity.create({
      data: opportunity,
    });
  }

  console.log('Seed data inserted successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
