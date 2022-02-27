import {Switch, Route} from 'react-router-dom'

import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'
import NotFound from './components/NotFound'
import Profile from './components/Profile'
import MyProfile from './components/MyProfile'

import './App.css'

const App = () => (
  <Switch>
    <Route path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/users/:id" component={Profile} />
    <ProtectedRoute exact path="/my-profile" component={MyProfile} />
    <Route component={NotFound} />
  </Switch>
)

export default App
