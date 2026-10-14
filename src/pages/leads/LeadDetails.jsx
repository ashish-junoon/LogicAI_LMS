import { useEffect, useState } from 'react'
import InfoWrapper from '../../components/lead/InfoWrapper'
import UserHeader from '../../components/utils/UserHeader'
import Breadcrumbs from '../../components/utils/Breadcrumbs'
import Loader from '../../components/utils/Loader'
import { CustomerDetails } from '../../api/application'
import { useLocation, useSearchParams } from 'react-router-dom'

const LeadDetails = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const routeLead = location.state?.lead
  const customerId = searchParams.get('customer_id') || routeLead?.customer_id
  const applicationId = searchParams.get('application_id') || routeLead?.application_id
  const [customerDetails, setCustomerDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    const fetchCustomerDetails = async () => {
      if (!customerId || !applicationId) {
        setError('Customer ID and application ID are required to load this lead.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const response = await CustomerDetails({
          customer_id: customerId,
          application_id: applicationId,
          role: 'admin',
          created_by: 'admin',
        })

        if (!response?.status || !response?.data) {
          throw new Error(response?.message || 'Failed to load customer details.')
        }

        if (isCurrent) setCustomerDetails(response.data)
      } catch (fetchError) {
        console.error('Error fetching customer details:', fetchError)
        if (isCurrent) {
          setError(
            fetchError?.response?.data?.message ||
            fetchError?.message ||
            'Something went wrong while loading customer details.'
          )
        }
      } finally {
        if (isCurrent) setLoading(false)
      }
    }

    fetchCustomerDetails()

    return () => {
      isCurrent = false
    }
  }, [customerId, applicationId])

  const matchesLead = (record) => {
    const recordCustomerId = record?.customer_id
    const recordApplicationId = record?.application_id || record?.applicantion_id

    return (
      (!recordCustomerId || recordCustomerId === customerId) &&
      (!recordApplicationId || recordApplicationId === applicationId)
    )
  }
  const scopedDetails = customerDetails
    ? Object.fromEntries(
        Object.entries(customerDetails).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.filter(matchesLead) : value,
        ]),
      )
    : null
  const marketSurvey = scopedDetails?.marketSurvey?.[0]
  const personalKyc = scopedDetails?.personalKyc?.[0]
  const loanDetails = scopedDetails?.loanDetails?.[0]
  const lead = {
    ...routeLead,
    customer_name:
      marketSurvey?.business_owner_name ||
      personalKyc?.full_name ||
      routeLead?.business_owner_name,
    loan_id: applicationId,
    product_code: loanDetails?.product_code || loanDetails?.loan_type,
    loan_amount: loanDetails?.loan_amount,
    loan_status: routeLead?.status || 'draft',
    stage: 'draft',
  }

  return (
    <div>
        <Breadcrumbs items={[{ label: "New Leads", path: "/leads-new" }, { label: applicationId || "Lead Details" }]} />
        <UserHeader permisssion lead={lead} />
        {loading ? (
          <Loader text="Loading customer details..." />
        ) : error ? (
          <div role="alert" className="m-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <InfoWrapper key={`${customerId}-${applicationId}`} customerDetails={scopedDetails} />
        )}
    </div>
  )
}

export default LeadDetails