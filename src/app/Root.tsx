import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { RoutesComponent } from '@/routes/Routes'
import './Root.css'

function Root() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Provider store={store}>
        <RoutesComponent />
      </Provider>
    </BrowserRouter>
  )
}

export default Root
