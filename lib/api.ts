import { cache } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
const base_url = process.env.NEXT_PUBLIC_BASE_URL;
const base_api = `${base_url}/api`;

class Api<T = any> {
  getList = cache(async function (path: string) {
    const res = fetch(`${base_api}/${path}`);
    // console.log("--log api", res);
    return res;
  });
  getById(path: string) {
    const res = fetch(`${base_api}/${path}`, {
      method: "GET",
    });
    return res;
  }

  // `data` is optional so callers can instantiate `new Api()` without specifying `T`,
  // or call `createNew()` without a payload when the endpoint doesn't require one.
  createNew(data?: T, path = "") {
    const res = fetch(`${base_api}/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });

    return res;
  }

  updateById(id: string, data: T, path: string) {
    const res = fetch(`${base_api}/${path}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });

    return res;
  }

  delete(ids: string[], path: string) {
    const res = fetch(`${base_api}/${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });

    return res;
  }
  seeds() {
    const res = fetch(`${base_api}/seeds`, {
      method: "POST",
    });
    //seed more data
    return res;
  }
  overview(data?: T) {
    const res = fetch(`${base_api}/products/overview`);
    return res;
  }
  chartData(data?: T) {
    const res = fetch(`${base_api}/products/chart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
    return res;
  }
}
export default Api;
