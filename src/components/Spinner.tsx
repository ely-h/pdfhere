export function Spinner() {
  return (
    <div className="proc" role="status" aria-label="Traitement en cours">
      <div className="procbar">
        <div className="procfill" />
      </div>
      <div className="proctext">Traitement sur ton appareil…</div>
      <div className="procsub">// aucun upload · 100% local</div>
    </div>
  )
}
