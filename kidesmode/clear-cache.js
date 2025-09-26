// Clear YouTube cache from browser console
Object.keys(localStorage).filter(k => k.startsWith('yt:v')).forEach(k => localStorage.removeItem(k));
console.log('YouTube cache cleared!');
