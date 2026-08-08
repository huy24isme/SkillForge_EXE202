import { Link } from 'react-router-dom'

export function Navbar() {
  return (
    <nav className="flex items-center gap-4 px-4 py-3 border-b">
      <Link to="/employee" className="font-medium">Employee</Link>
      <Link to="/pm" className="font-medium">PM</Link>
      <Link to="/leadership" className="font-medium">Leadership</Link>
    </nav>
  )
}
