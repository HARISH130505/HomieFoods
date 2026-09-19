export default function OfflinePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 20 }}>
      <div style={{ textAlign: 'center' }}>
        <h1>You're offline</h1>
        <p>Cached menus and images should still be available. Connect to the internet for latest data.</p>
      </div>
    </div>
  );
}
