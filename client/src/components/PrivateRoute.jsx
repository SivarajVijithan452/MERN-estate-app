import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

export default function PrivateRoute() {
    const { currentUser } = useSelector(state => state.user);
  return (
    currentUser ? <Outlet /> : <Navigate to='/signIn' />
  )
}
