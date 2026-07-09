export function AdminConsole() {
  return (
    <section className="protected-route-notice">
      <div className="protected-route-icon">
        <span aria-hidden="true">!</span>
      </div>
      <p className="section-label">Private operator workspace</p>
      <h1>The operator console is intentionally stripped from this build.</h1>
      <p>
        Use the local CityAtlas dev server when you need the internal business database, outreach
        rehearsal tools, or queue review work.
      </p>
    </section>
  );
}
