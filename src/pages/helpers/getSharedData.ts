export default async function getSharedData() {
  if (!location.href.includes("instagram.com")) return;

  const res = await fetch("/data/shared_data/");
  return res.json();
}
