import { Home } from 'pages/home'
import { StorageProvider } from 'services/storage'

export default function App() {
  return (
    <StorageProvider>
      <Home />
    </StorageProvider>
  )
}
