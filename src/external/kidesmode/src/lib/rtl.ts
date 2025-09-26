export const setRTL = (enable: boolean = true) => {
  const html = document.documentElement;
  if (enable) {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');
  } else {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', 'en');
  }
};

export const isRTL = () => {
  return document.documentElement.dir === 'rtl';
};