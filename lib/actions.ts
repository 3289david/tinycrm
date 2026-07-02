'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

async function getUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')
  return { userId: session.user.id, isAdmin: session.user.isAdmin }
}

async function requireAdmin() {
  const { isAdmin } = await getUser()
  if (!isAdmin) redirect('/app/clients')
}

// ---------- Auth ----------

export async function register_action(formData: FormData) {
  const email = ((formData.get('email') as string) ?? '').toLowerCase().trim()
  const password = (formData.get('password') as string) ?? ''
  const name = ((formData.get('name') as string) ?? '').trim()

  if (!email || !password || !name) return { error: 'All fields are required.' }
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { error: 'An account with this email already exists.' }

  const isFirst = (await prisma.user.count()) === 0
  const hash = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: { email, password: hash, name, isAdmin: isFirst },
  })

  redirect('/login?registered=1')
}

export async function updateProfile_action(formData: FormData) {
  const { userId } = await getUser()

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: ((formData.get('name') as string) ?? '').trim() || null,
      company: ((formData.get('company') as string) ?? '').trim() || null,
    },
  })

  revalidatePath('/app/settings')
}

export async function changePassword_action(formData: FormData) {
  const { userId } = await getUser()

  const current = (formData.get('current') as string) ?? ''
  const next = (formData.get('password') as string) ?? ''
  const confirm = (formData.get('confirm') as string) ?? ''

  if (!current || !next || !confirm) return { error: 'All fields are required.' }
  if (next.length < 8) return { error: 'New password must be at least 8 characters.' }
  if (next !== confirm) return { error: 'Passwords do not match.' }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return { error: 'User not found.' }

  const valid = await bcrypt.compare(current, user.password)
  if (!valid) return { error: 'Current password is incorrect.' }

  const hash = await bcrypt.hash(next, 12)
  await prisma.user.update({ where: { id: userId }, data: { password: hash } })

  return { error: null }
}

// ---------- Clients ----------

export async function createClient_action(formData: FormData) {
  const { userId } = await getUser()

  const name = ((formData.get('name') as string) ?? '').trim()
  if (!name) return { error: 'Name is required.' }

  const tags = ((formData.get('tags') as string) ?? '')
    .split(',').map(t => t.trim()).filter(Boolean)

  const client = await prisma.client.create({
    data: {
      userId,
      name,
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      company: (formData.get('company') as string) || null,
      notes: (formData.get('notes') as string) || null,
      status: 'lead',
      tags: tags.length > 0 ? { create: tags.map(tag => ({ tag })) } : undefined,
      timeline: { create: { userId, content: 'Created' } },
    },
  })

  revalidatePath('/app/clients')
  redirect(`/app/clients/${client.id}`)
}

export async function updateClient_action(clientId: string, formData: FormData) {
  const { userId } = await getUser()

  await prisma.client.updateMany({
    where: { id: clientId, userId },
    data: {
      name: ((formData.get('name') as string) ?? '').trim(),
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      company: (formData.get('company') as string) || null,
      notes: (formData.get('notes') as string) || null,
    },
  })

  const tags = ((formData.get('tags') as string) ?? '')
    .split(',').map(t => t.trim()).filter(Boolean)

  await prisma.clientTag.deleteMany({ where: { clientId } })
  if (tags.length > 0) {
    await prisma.clientTag.createMany({
      data: tags.map(tag => ({ clientId, tag })),
      skipDuplicates: true,
    })
  }

  revalidatePath(`/app/clients/${clientId}`)
  return { error: null }
}

export async function updateStatus_action(clientId: string, status: string) {
  const { userId } = await getUser()

  await prisma.client.updateMany({
    where: { id: clientId, userId },
    data: { status, lastContactAt: new Date() },
  })

  await prisma.timelineEvent.create({
    data: { clientId, userId, content: `Status changed to ${status}` },
  })

  revalidatePath(`/app/clients/${clientId}`)
  revalidatePath('/app/clients')
}

export async function addTimelineEvent_action(clientId: string, formData: FormData) {
  const { userId } = await getUser()

  const content = ((formData.get('content') as string) ?? '').trim()
  if (!content) return

  await prisma.timelineEvent.create({ data: { clientId, userId, content } })
  await prisma.client.updateMany({
    where: { id: clientId, userId },
    data: { lastContactAt: new Date() },
  })

  revalidatePath(`/app/clients/${clientId}`)
}

export async function deleteClient_action(clientId: string) {
  const { userId } = await getUser()

  await prisma.client.deleteMany({ where: { id: clientId, userId } })
  revalidatePath('/app/clients')
  redirect('/app/clients')
}

// ---------- Invoices ----------

export async function createInvoice_action(clientId: string, formData: FormData) {
  const { userId } = await getUser()

  const description = ((formData.get('description') as string) ?? '').trim()
  const amountStr = ((formData.get('amount') as string) ?? '').trim()
  const currency = ((formData.get('currency') as string) || 'usd').toLowerCase()
  const dueDateStr = formData.get('due_date') as string

  if (!description) return { error: 'Description is required.' }
  const amount = parseFloat(amountStr)
  if (isNaN(amount) || amount <= 0) return { error: 'Amount must be greater than 0.' }

  const last = await prisma.invoice.findFirst({
    where: { userId, invoiceNumber: { not: null } },
    orderBy: { createdAt: 'desc' },
    select: { invoiceNumber: true },
  })
  const seq = last?.invoiceNumber ? parseInt(last.invoiceNumber.replace('INV-', '')) + 1 : 1
  const invoiceNumber = `INV-${String(seq).padStart(4, '0')}`

  await prisma.invoice.create({
    data: {
      userId,
      clientId,
      invoiceNumber,
      amountCents: Math.round(amount * 100),
      currency,
      description,
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
      status: 'pending',
    },
  })

  revalidatePath(`/app/clients/${clientId}`)
  revalidatePath('/app/invoices')
  return { error: null }
}

export async function cancelInvoice_action(invoiceId: string, clientId: string) {
  const { userId } = await getUser()

  await prisma.invoice.updateMany({
    where: { id: invoiceId, userId, status: 'pending' },
    data: { status: 'cancelled' },
  })

  revalidatePath(`/app/clients/${clientId}`)
  revalidatePath('/app/invoices')
}

// ---------- Quotes ----------

export async function createQuote_action(clientId: string, formData: FormData) {
  const { userId } = await getUser()

  const description = ((formData.get('description') as string) ?? '').trim()
  const amountStr = ((formData.get('amount') as string) ?? '').trim()
  const notes = ((formData.get('notes') as string) ?? '').trim()
  const validUntilStr = formData.get('valid_until') as string

  if (!description) return { error: 'Description is required.' }
  const amount = parseFloat(amountStr)
  if (isNaN(amount) || amount <= 0) return { error: 'Amount must be greater than 0.' }

  const last = await prisma.quote.findFirst({
    where: { userId, quoteNumber: { not: null } },
    orderBy: { createdAt: 'desc' },
    select: { quoteNumber: true },
  })
  const seq = last?.quoteNumber ? parseInt(last.quoteNumber.replace('QT-', '')) + 1 : 1
  const quoteNumber = `QT-${String(seq).padStart(4, '0')}`

  await prisma.quote.create({
    data: {
      userId,
      clientId,
      quoteNumber,
      amountCents: Math.round(amount * 100),
      currency: 'usd',
      description,
      notes: notes || null,
      validUntil: validUntilStr ? new Date(validUntilStr) : null,
      status: 'draft',
    },
  })

  revalidatePath(`/app/clients/${clientId}`)
  revalidatePath('/app/quotes')
  return { error: null }
}

export async function updateQuoteStatus_action(quoteId: string, clientId: string, status: string) {
  const { userId } = await getUser()

  await prisma.quote.updateMany({
    where: { id: quoteId, userId },
    data: { status, updatedAt: new Date() },
  })

  revalidatePath(`/app/clients/${clientId}`)
  revalidatePath('/app/quotes')
}

export async function convertQuoteToInvoice_action(quoteId: string, clientId: string) {
  const { userId } = await getUser()

  const quote = await prisma.quote.findFirst({ where: { id: quoteId, userId } })
  if (!quote) return { error: 'Quote not found.' }

  const last = await prisma.invoice.findFirst({
    where: { userId, invoiceNumber: { not: null } },
    orderBy: { createdAt: 'desc' },
    select: { invoiceNumber: true },
  })
  const seq = last?.invoiceNumber ? parseInt(last.invoiceNumber.replace('INV-', '')) + 1 : 1
  const invoiceNumber = `INV-${String(seq).padStart(4, '0')}`

  await prisma.invoice.create({
    data: {
      userId,
      clientId: quote.clientId,
      invoiceNumber,
      amountCents: quote.amountCents,
      currency: quote.currency,
      description: quote.description,
      status: 'pending',
    },
  })

  await prisma.quote.updateMany({
    where: { id: quoteId, userId },
    data: { status: 'accepted', updatedAt: new Date() },
  })

  revalidatePath(`/app/clients/${clientId}`)
  revalidatePath('/app/quotes')
  revalidatePath('/app/invoices')
  return { error: null }
}

// ---------- Services ----------

export async function createService_action(formData: FormData) {
  const { userId } = await getUser()

  const name = ((formData.get('name') as string) ?? '').trim()
  const description = ((formData.get('description') as string) ?? '').trim()
  const priceStr = ((formData.get('price') as string) ?? '').trim()

  if (!name) return { error: 'Name is required.' }
  const price = parseFloat(priceStr)
  if (isNaN(price) || price < 0) return { error: 'Price must be a valid number.' }

  await prisma.service.create({
    data: {
      userId,
      name,
      description: description || null,
      priceCents: Math.round(price * 100),
      currency: 'usd',
    },
  })

  revalidatePath('/app/services')
  return { error: null }
}

export async function updateService_action(serviceId: string, formData: FormData) {
  const { userId } = await getUser()

  const name = ((formData.get('name') as string) ?? '').trim()
  const description = ((formData.get('description') as string) ?? '').trim()
  const priceStr = ((formData.get('price') as string) ?? '').trim()

  if (!name) return { error: 'Name is required.' }
  const price = parseFloat(priceStr)
  if (isNaN(price) || price < 0) return { error: 'Invalid price.' }

  await prisma.service.updateMany({
    where: { id: serviceId, userId },
    data: { name, description: description || null, priceCents: Math.round(price * 100) },
  })

  revalidatePath('/app/services')
  return { error: null }
}

export async function deleteService_action(serviceId: string) {
  const { userId } = await getUser()

  await prisma.service.deleteMany({ where: { id: serviceId, userId } })
  revalidatePath('/app/services')
}

// ---------- Admin ----------

export async function adminDeleteUser_action(targetUserId: string) {
  await requireAdmin()

  await prisma.user.delete({ where: { id: targetUserId } })
  revalidatePath('/admin/users')
}

export async function adminToggleAdmin_action(targetUserId: string, isAdmin: boolean) {
  await requireAdmin()

  await prisma.user.update({ where: { id: targetUserId }, data: { isAdmin } })
  revalidatePath('/admin/users')
}

// ---------- Data ----------

export async function exportClients_action() {
  const { userId } = await getUser()

  const clients = await prisma.client.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      name: true, email: true, phone: true, company: true,
      status: true, notes: true, createdAt: true, lastContactAt: true,
    },
  })

  const header = 'Name,Email,Phone,Company,Status,Notes,Created,Last Contact'
  const rows = clients.map(c =>
    [c.name, c.email, c.phone, c.company, c.status, c.notes,
      c.createdAt?.toISOString(), c.lastContactAt?.toISOString()]
      .map(v => `"${(v ?? '').toString().replace(/"/g, '""')}"`)
      .join(',')
  )

  return { csv: [header, ...rows].join('\n') }
}

export async function deleteAccount_action() {
  const { userId } = await getUser()

  await prisma.user.delete({ where: { id: userId } })
  redirect('/')
}
