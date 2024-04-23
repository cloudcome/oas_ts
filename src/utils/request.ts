export async function request<T>(url: string) {
    const resp = await fetch(url);

    if (resp.ok) return (await resp.json()) as T;

    throw new Error(`${resp.status} ${resp.statusText}`);
}
