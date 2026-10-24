export const THEME_COOKIE = "theme";

// Runs in <head> before first paint so a saved preference never flashes.
export const themeInitScript = `(function(){try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=([^;]*)/);if(m)document.documentElement.setAttribute("data-theme",decodeURIComponent(m[1]))}catch(e){}})()`;
