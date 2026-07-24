import React from 'react'
import ApplicationInfo from '../../components/common/ApplicationInfo'
import Disbursement from '../../components/lead/Disbursement'
import DisbursementWrapper from '../../components/lead/DisbursementWrapper'

const DisbursementDetails = () => {
  return (
    <div>
        <ApplicationInfo>
            {/* <div className='mt-1 grid grid-cols-1'>
                <Disbursement />
            </div> */}
            <DisbursementWrapper />
        </ApplicationInfo>
    </div>
  )
}

export default DisbursementDetails