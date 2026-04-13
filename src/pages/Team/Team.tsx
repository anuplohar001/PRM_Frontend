import React, { useState } from 'react'
import Loader from '../../components/Loader/Loader'
import { useNavigate } from 'react-router-dom'
import { useApiOnLoad } from '../../utils/useApiOnLoad'
import { apiRequest } from '../../services/api.services'
import TeamAdminPannel from './TeamAdminPannel'



const Team = () => {

    const navigate = useNavigate()
    



    const loading = false
    return (
        <div className="container-fluid mt-1 position-relative">
            <Loader loading={loading} />
            <div className="d-flex justify-content-between align-items-center mb-1">
                <h5>Team Dashboard</h5>
                <button className='btn btn-sm btn-primary' onClick={() => navigate('/create-team')}>
                    + Create Team
                </button>
            </div>

            <div>
                <TeamAdminPannel/>
            </div>
        </div>
    )
}

export default Team
