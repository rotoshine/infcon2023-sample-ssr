const END_POINT =
  import.meta.env.VITE_APP_END_POINT ?? "https://api.infcon2023.roto.codes/api";

const request = async (path: string, options: RequestInit = {}) => {
  const res = await fetch(`${END_POINT}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Accept: "application/json",
    },
  });
  return res.json();
};
export const fetchMusicians = async () => request("/musicians");
export const fetchMusician = async (slug: string) =>
  request(`/musicians/${slug}`);
