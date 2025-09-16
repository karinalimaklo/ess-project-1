import Header from '../components/Header/Header';
import '../App.css'
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <main>
            <Header />

            <Outlet />

        </main>

    );

}
