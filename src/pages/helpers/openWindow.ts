export default function openWindow(link) {
  const myHeight = 900;
  const myWidth = 1200;
  const top = (screen.height - myHeight) / 4;
  const left = (screen.width - myWidth) / 2;

  const size = `resizable=no,width=${myWidth}, height=${myHeight}, left=${left}, top=${top}`;
  const page = window.open(link.toString(), "_blank", size);
  page.focus();
}
