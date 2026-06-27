import { Link } from 'react-router-dom'

export default function PageNumbers() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Numéros de page - à venir</p>
      <Link to="/" className="text-sm text-blue-600 hover:underline">Retour</Link>
    </div>
  )
}
