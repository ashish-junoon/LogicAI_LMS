import React from 'react'
import ApplicationInfo from '../../components/common/ApplicationInfo'
import LoanWrapper from '../../components/lead/LoanWrapper'

const LoanManagement = () => {
  return (
    <div>
        <ApplicationInfo hideBtn={true}>
            <LoanWrapper />
        </ApplicationInfo>
    </div>
  )
}

export default LoanManagement