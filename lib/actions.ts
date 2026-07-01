'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const FREE_LIMIT = 100

async function getUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
}

export async function createClient_action(formData: FormData) {
  const { supabase, user } = await getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan === 'free') {
    const { count } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .neq('status', 'archived')

    if ((count ?? 0) >= FREE_LIMIT) {
      return { error: 'Free plan limit reached. Upgrade to Pro for unlimited clients.' }
    }
  }

  const name = formData.get('name') as string
  if (!name?.trim()) return { error: 'Name is required.' }

  const tags = (formData.get('tags') as string)
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)

  const { data: client, error } = await supabase
    .from('clients')
    .insert({
      user_id: user.id,
      name: name.trim(),
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      company: (formData.get('company') as string) || null,
      notes: (formData.get('notes') as string) || null,
      status: 'lead',
    })
    .select()
    .single()

  if (error) return { error: error.message }

  if (tags.length > 0) {
    await supabase.from('client_tags').insert(
      tags.map(tag => ({ client_id: client.id, tag }))
    )
  }

  await supabase.from('timeline_events').insert({
    client_id: client.id,
    user_id: user.id,
    content: 'Created',
  })

  revalidatePath('/app/clients')
  redirect(`/app/clients/${client.id}`)
}

export async function updateClient_action(clientId: string, formData: FormData) {
  const { supabase, user } = await getUser()

  const { error } = await supabase
    .from('clients')
    .update({
      name: (formData.get('name') as string).trim(),
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      company: (formData.get('company') as string) || null,
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', clientId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  const newTags = (formData.get('tags') as string)
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)

  await supabase.from('client_tags').delete().eq('client_id', clientId)
  if (newTags.length > 0) {
    await supabase.from('client_tags').insert(
      newTags.map(tag => ({ client_id: clientId, tag }))
    )
  }

  revalidatePath(`/app/clients/${clientId}`)
  return { error: null }
}

export async function updateStatus_action(clientId: string, status: string) {
  const { supabase, user } = await getUser()

  await supabase
    .from('clients')
    .update({ status, last_contact_at: new Date().toISOString() })
    .eq('id', clientId)
    .eq('user_id', user.id)

  await supabase.from('timeline_events').insert({
    client_id: clientId,
    user_id: user.id,
    content: `Status changed to ${status}`,
  })

  revalidatePath(`/app/clients/${clientId}`)
  revalidatePath('/app/clients')
}

export async function addTimelineEvent_action(clientId: string, formData: FormData) {
  const { supabase, user } = await getUser()

  const content = (formData.get('content') as string).trim()
  if (!content) return

  await supabase.from('timeline_events').insert({
    client_id: clientId,
    user_id: user.id,
    content,
  })

  await supabase
    .from('clients')
    .update({ last_contact_at: new Date().toISOString() })
    .eq('id', clientId)
    .eq('user_id', user.id)

  revalidatePath(`/app/clients/${clientId}`)
}

export async function deleteClient_action(clientId: string) {
  const { supabase, user } = await getUser()

  await supabase
    .from('clients')
    .delete()
    .eq('id', clientId)
    .eq('user_id', user.id)

  revalidatePath('/app/clients')
  redirect('/app/clients')
}

export async function exportClients_action() {
  const { supabase, user } = await getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan !== 'pro') {
    return { error: 'Export is a Pro feature.' }
  }

  const { data: clients } = await supabase
    .from('clients')
    .select('name, email, phone, company, status, notes, created_at, last_contact_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (!clients) return { error: 'No data.' }

  const header = 'Name,Email,Phone,Company,Status,Notes,Created,Last Contact'
  const rows = clients.map(c =>
    [c.name, c.email, c.phone, c.company, c.status, c.notes, c.created_at, c.last_contact_at]
      .map(v => `"${(v ?? '').toString().replace(/"/g, '""')}"`)
      .join(',')
  )

  return { csv: [header, ...rows].join('\n') }
}

export async function deleteAccount_action() {
  const { supabase, user } = await getUser()

  const adminClient = createClient()
  await adminClient.from('clients').delete().eq('user_id', user.id)
  await supabase.auth.signOut()
  redirect('/')
}
