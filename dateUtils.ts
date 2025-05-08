export const formatDistanceToNow = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (seconds < 60) {
    return 'just now';
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 30) {
    return `${days}d ago`;
  } else if (months < 12) {
    return `${months}mo ago`;
  } else {
    return `${years}y ago`;
  }
};