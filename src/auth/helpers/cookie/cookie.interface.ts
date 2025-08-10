export interface CookieObjectI {
  [key: string]: string;
}

export interface UrlInterface {
  href: string;
  origin: string;
  protocol: string;
  username: string;
  password: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  searchParams: URLSearchParams;
  hash: string;
}
