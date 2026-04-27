

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(timeString: string): string {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function getTimeUntilEvent(eventDate: string): string {
  const now = new Date();
  const event = new Date(eventDate);
  const diff = event.getTime() - now.getTime();

  if (diff <= 0) return 'Event has passed';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 30) {
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''} away`;
  }
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ${hours}h away`;
  }
  return `${hours} hour${hours > 1 ? 's' : ''} away`;
}

export function getInviteUrl(slug: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/invite/${slug}`;
  }
  return `/invite/${slug}`;
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  // Fallback
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  const success = document.execCommand('copy');
  document.body.removeChild(textarea);
  return Promise.resolve(success);
}

export function getWhatsAppShareUrl(invitation: { title: string; slug: string; eventDate: string }): string {
  const url = getInviteUrl(invitation.slug);
  const message = encodeURIComponent(
    `🎉 You're Invited!\n\n${invitation.title}\n📅 ${formatDate(invitation.eventDate)}\n\nView invitation: ${url}`
  );
  return `https://wa.me/?text=${message}`;
}

export function getTwitterShareUrl(invitation: { title: string; slug: string }): string {
  const url = getInviteUrl(invitation.slug);
  const text = encodeURIComponent(`🎉 You're Invited to ${invitation.title}!\n\nView the invitation:`);
  return `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
}

export function getEmailShareUrl(invitation: { title: string; slug: string; eventDate: string; hostName: string }): string {
  const url = getInviteUrl(invitation.slug);
  const subject = encodeURIComponent(`You're Invited: ${invitation.title}`);
  const body = encodeURIComponent(
    `Hi!\n\nYou're invited to ${invitation.title} hosted by ${invitation.hostName}.\n\n📅 ${formatDate(invitation.eventDate)}\n\nView the invitation and RSVP here:\n${url}\n\nHope to see you there! 🎉`
  );
  return `mailto:?subject=${subject}&body=${body}`;
}

export async function nativeShare(invitation: { title: string; slug: string; eventDate: string }): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.share) return false;
  try {
    await navigator.share({
      title: `You're Invited: ${invitation.title}`,
      text: `🎉 ${invitation.title} — ${formatDate(invitation.eventDate)}`,
      url: getInviteUrl(invitation.slug),
    });
    return true;
  } catch {
    return false;
  }
}
