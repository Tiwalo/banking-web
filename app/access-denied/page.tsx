export default async function AccessDenied({ searchParams }: PageProps<"/access-denied">) {
  const operations = (await searchParams).area === "operations";
  return <section><h1>{operations ? "Operations access denied" : "Customer access denied"}</h1>
    <p>{operations ? "This identity cannot view reconciliation findings." : "This identity cannot view customer accounts."}</p>
    <form method="post" action="/logout"><button className="action">Log out</button></form></section>;
}
