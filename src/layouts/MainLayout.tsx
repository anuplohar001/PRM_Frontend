import { Outlet } from "react-router-dom"
import Header from "./Header"
import Sidebar from "./Sidebar"
import Footer from "./Footer"

const MainLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">

            <Header />

            <div className="d-flex flex-grow-1">

                <Sidebar />

                <main className="flex-grow-1 p-3 bg-light">
                    <Outlet />
                </main>

            </div>

            <Footer />

        </div>
    )
}

export default MainLayout