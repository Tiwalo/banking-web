export default function AccessDenied() {
  return <section><h1>Customer access denied</h1><p>This identity cannot view customer accounts.</p>
    <form method="post" action="/logout"><button className="action">Log out</button></form></section>;
}
