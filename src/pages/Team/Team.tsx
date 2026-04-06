import React from 'react'
import Loader from '../../components/Loader/Loader'

const Team = () => {


    const loading = false
    return (
        <div className="container-fluid mt-1 position-relative">
            <Loader loading={loading} />
            <div className="d-flex justify-content-between align-items-center mb-1">
                <h5>Team Dashboard</h5>
            </div>
        </div>
    )
}

export default Team
