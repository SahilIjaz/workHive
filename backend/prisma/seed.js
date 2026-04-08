import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  
  // Hash password for admin user
  const passwordHash = await bcrypt.hash('Admin123!', 12);

  // Create first tenant (Acme Corp)
  const acmeTenant = await prisma.tenant.upsert({
    where: { slug: 'acme' },
    update: {},
    create: {
      name: 'Acme Corp',
      slug: 'acme',
      plan: 'pro',
    },
  });

  console.log(`✓ Created tenant: ${acmeTenant.name}`);

  // Create admin user for Acme
  const adminUser = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: acmeTenant.id, email: 'alice@acme.com' } },
    update: {},
    create: {
      tenantId: acmeTenant.id,
      name: 'Alice Admin',
      email: 'alice@acme.com',
      passwordHash,
      role: 'admin',
    },
  });

  console.log(`✓ Created admin user: ${adminUser.name}`);

  // Create member user
  const memberUser = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: acmeTenant.id, email: 'bob@acme.com' } },
    update: {},
    create: {
      tenantId: acmeTenant.id,
      name: 'Bob Member',
      email: 'bob@acme.com',
      passwordHash,
      role: 'member',
    },
  });

  console.log(`✓ Created member user: ${memberUser.name}`);

  // Create a sample project
  const project = await prisma.project.upsert({
    where: { id: 'project-seed-1' },
    update: {},
    create: {
      id: 'project-seed-1',
      tenantId: acmeTenant.id,
      createdById: adminUser.id,
      name: 'Website Redesign',
      description: 'Complete redesign of company website',
      status: 'active',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  console.log(`✓ Created project: ${project.name}`);

  // Create sample tasks
  const task1 = await prisma.task.upsert({
    where: { id: 'task-seed-1' },
    update: {},
    create: {
      id: 'task-seed-1',
      tenantId: acmeTenant.id,
      projectId: project.id,
      createdById: adminUser.id,
      assignedToId: memberUser.id,
      title: 'Design homepage mockup',
      description: 'Create wireframes and high-fidelity mockups for the new homepage',
      status: 'in_progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  });

  const task2 = await prisma.task.upsert({
    where: { id: 'task-seed-2' },
    update: {},
    create: {
      id: 'task-seed-2',
      tenantId: acmeTenant.id,
      projectId: project.id,
      createdById: adminUser.id,
      assignedToId: adminUser.id,
      title: 'Set up development environment',
      description: 'Install dependencies and configure build pipeline',
      status: 'todo',
      priority: 'urgent',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    },
  });

  const task3 = await prisma.task.upsert({
    where: { id: 'task-seed-3' },
    update: {},
    create: {
      id: 'task-seed-3',
      tenantId: acmeTenant.id,
      projectId: project.id,
      createdById: adminUser.id,
      title: 'Review competitor websites',
      description: 'Analyze top 5 competitors for design inspiration',
      status: 'done',
      priority: 'medium',
    },
  });

  console.log(`✓ Created 3 sample tasks`);

  // Create second tenant for multi-tenant testing
  const betaTenant = await prisma.tenant.upsert({
    where: { slug: 'beta-corp' },
    update: {},
    create: {
      name: 'Beta Corp',
      slug: 'beta-corp',
      plan: 'free',
    },
  });

  console.log(`✓ Created tenant: ${betaTenant.name}`);

  const betaAdmin = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: betaTenant.id, email: 'charlie@beta.com' } },
    update: {},
    create: {
      tenantId: betaTenant.id,
      name: 'Charlie Admin',
      email: 'charlie@beta.com',
      passwordHash,
      role: 'admin',
    },
  });

  console.log(`✓ Created admin for Beta Corp: ${betaAdmin.name}`);

  console.log('\n✅ Seeding complete!');
  console.log('\nTest Credentials:');
  console.log('Acme Corp Admin:     alice@acme.com / Admin123!');
  console.log('Acme Corp Member:    bob@acme.com / Admin123!');
  console.log('Beta Corp Admin:     charlie@beta.com / Admin123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
