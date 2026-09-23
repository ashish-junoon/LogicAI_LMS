import React from 'react'
import InfoWrapper from '../../components/lead/InfoWrapper'
import InfoCard from '../../components/common/InfoCard'
import UserHeader from '../../components/utils/UserHeader'
import Breadcrumbs from '../../components/utils/Breadcrumbs'
import { lead } from '../../content/data'


const LeadDetails = () => {

  return (
    <div>
        {/* <InfoCard /> */}
        <Breadcrumbs items={[{ label: "New Leads", path: "/leads-new" }, { label: "LD-0001" }]} />
        <UserHeader permisssion lead={lead} />
        <InfoWrapper />
    </div>
  )
}

export default LeadDetails