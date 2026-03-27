import React, { useEffect, useState } from 'react'
import { apiRequest, getRecords } from '../../services/api.services'
import { useNavigate } from 'react-router-dom'

type Organization = {
    name: string
    id: number
}

const SelectOrganization = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [organizations, setOrganizations] = useState<Organization[]>([])
    const [selectedOrg, setSelectedOrg] = useState("");
    const navigate = useNavigate()
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(e.target.value);

        const org =
            organizations.find((o) => o.id === selectedId);

        setSelectedOrg(org);

    };
    const getCurrentOrgDetails = async () => {
        setLoading(true)
        try {
            const response = await apiRequest({
                endpoint: '/organizations/get-organizations',
                method: "GET",
            })
            const organization = response?.data.map((org) => ({
                ...org.organization,
                role: org.role
            }))
            console.log(organization)
            setOrganizations(organization)
        } catch (err) {
            if (err && typeof err === 'object' && 'message' in err) {
                alert(err.message)
                console.error(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCurrentOrgDetails()
    }, [])



    const confirmSelectOrg = async () => {
        localStorage.setItem('organization', JSON.stringify(selectedOrg))
        navigate('/')
    }

    return (
        <div className='custom-overlay'>
            <div className='col-6'>
                <div className="card">
                    <div className="card-header">Select Organization</div>
                    <span className='text-muted m-2'>You are added to below organizations</span>
                    <div className="card-body">
                        <select
                            className="form-select"
                            value={selectedOrg.id}
                            onChange={handleChange}
                        >
                            <option value="">-- Select Organization --</option>

                            {organizations?.map((org) => (
                                <option key={org.id} value={org.id}>
                                    {org.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <button type='button' className='w-50 m-2 btn btn-sm btn-success' onClick={confirmSelectOrg}>
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectOrganization
